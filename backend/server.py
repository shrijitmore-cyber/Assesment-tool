"""i4SKILLS AIM backend — FastAPI + MongoDB.

Provides:
  * Email/password JWT auth with RBAC (super_admin, org_admin, consultant, employee, individual)
  * Assessment templates (organizational + individual)
  * Assessment responses + scoring + personalized roadmap
  * Org admin aggregation, consultant views, super admin management
"""
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import logging
import os
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Response
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

from auth import (
    create_access_token,
    get_current_user,
    hash_password,
    require_roles,
    verify_password,
)
from templates import (
    ALL_TEMPLATES,
    LIKERT_OPTIONS,
    get_roadmap_map,
    get_template,
    stage_for_score,
)

# ---------------------------------------------------------------- Mongo
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# ---------------------------------------------------------------- App
app = FastAPI(title="i4SKILLS AIM")
api = APIRouter(prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("aim")

VALID_ROLES = {"super_admin", "org_admin", "consultant", "employee", "individual"}

# =========================================================== Pydantic
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)
    account_type: str = Field(description="individual | organization")
    organization_name: Optional[str] = None


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class InviteIn(BaseModel):
    email: EmailStr
    name: str
    role: str = "employee"


class StartAssessmentIn(BaseModel):
    template_id: str


class SaveAnswersIn(BaseModel):
    answers: Dict[str, int]  # { question_key: 1..5 }
    submit: bool = False


class AssignConsultantIn(BaseModel):
    consultant_id: str
    organization_id: str


# =========================================================== Helpers
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def public_user(u: Dict[str, Any]) -> Dict[str, Any]:
    return {k: v for k, v in u.items() if k not in ("_id", "password_hash")}


async def ensure_indexes():
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.organizations.create_index("id", unique=True)
    await db.responses.create_index("id", unique=True)
    await db.responses.create_index("user_id")


async def seed_super_admin():
    email = os.environ.get("ADMIN_EMAIL", "admin@i4skills.com").lower()
    password = os.environ.get("ADMIN_PASSWORD", "Admin@12345")
    existing = await db.users.find_one({"email": email})
    if existing is None:
        await db.users.insert_one(
            {
                "id": str(uuid.uuid4()),
                "email": email,
                "name": "Platform Admin",
                "password_hash": hash_password(password),
                "role": "super_admin",
                "organization_id": None,
                "assigned_org_ids": [],
                "created_at": now_iso(),
            }
        )
        log.info("Seeded super_admin: %s", email)
    elif not verify_password(password, existing["password_hash"]):
        await db.users.update_one(
            {"email": email}, {"$set": {"password_hash": hash_password(password)}}
        )
        log.info("Rotated super_admin password")


@app.on_event("startup")
async def startup():
    await ensure_indexes()
    await seed_super_admin()


@app.on_event("shutdown")
async def shutdown():
    client.close()


# =========================================================== Auth
@api.post("/auth/register")
async def register(body: RegisterIn):
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    if body.account_type not in ("individual", "organization"):
        raise HTTPException(status_code=400, detail="Invalid account_type")

    organization_id = None
    role = "individual"
    if body.account_type == "organization":
        if not body.organization_name:
            raise HTTPException(status_code=400, detail="organization_name required")
        organization_id = str(uuid.uuid4())
        await db.organizations.insert_one(
            {
                "id": organization_id,
                "name": body.organization_name,
                "created_at": now_iso(),
                "owner_email": email,
            }
        )
        role = "org_admin"

    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": email,
        "name": body.name,
        "password_hash": hash_password(body.password),
        "role": role,
        "organization_id": organization_id,
        "assigned_org_ids": [],
        "created_at": now_iso(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_id, email, role)
    return {"token": token, "user": public_user(user_doc)}


@api.post("/auth/login")
async def login(body: LoginIn):
    email = body.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user["role"])
    return {"token": token, "user": public_user(user)}


@api.get("/auth/me")
async def me(user=Depends(get_current_user)):
    return {"user": user}


@api.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"ok": True}


# =========================================================== Templates
@api.get("/assessments/templates")
async def list_templates():
    # Strip questions to keep payload light
    return [
        {
            "id": t["id"],
            "slug": t["slug"],
            "title": t["title"],
            "subtitle": t["subtitle"],
            "audience": t["audience"],
            "duration_minutes": t["duration_minutes"],
            "dimension_count": len(t["dimensions"]),
            "question_count": sum(len(d["questions"]) for d in t["dimensions"]),
        }
        for t in ALL_TEMPLATES
    ]


@api.get("/assessments/templates/{template_id}")
async def get_template_detail(template_id: str):
    t = get_template(template_id)
    if not t:
        raise HTTPException(status_code=404, detail="Template not found")
    return {"template": t, "likert": LIKERT_OPTIONS}


# =========================================================== Responses
def _compute_results(template: Dict[str, Any], answers: Dict[str, int]) -> Dict[str, Any]:
    """Compute scores, stage, strengths/blockers, benchmarks, roadmap."""
    dim_scores = []
    for dim in template["dimensions"]:
        vals = []
        for i, _q in enumerate(dim["questions"]):
            key = f"{dim['id']}_{i}"
            v = answers.get(key)
            if isinstance(v, int) and 1 <= v <= 5:
                vals.append(v)
        if vals:
            avg = sum(vals) / len(vals)
            score = round((avg - 1) / 4 * 100, 1)  # 0-100
        else:
            score = 0.0
        dim_scores.append(
            {
                "id": dim["id"],
                "name": dim["name"],
                "score": score,
                "benchmark": template["benchmarks"].get(dim["id"], 55),
                "answered": len(vals),
                "total": len(dim["questions"]),
            }
        )

    overall = round(sum(d["score"] for d in dim_scores) / len(dim_scores), 1) if dim_scores else 0.0
    stage = stage_for_score(template["stages"], overall)

    # strengths = top 2; blockers = bottom 2
    sorted_dims = sorted(dim_scores, key=lambda d: d["score"], reverse=True)
    strengths = sorted_dims[:2]
    blockers = sorted_dims[-2:]

    roadmap_map = get_roadmap_map(template["audience"])
    roadmap = [
        {
            "dimension_id": b["id"],
            "dimension_name": b["name"],
            "current_score": b["score"],
            **roadmap_map.get(b["id"], {}),
        }
        for b in blockers
    ]

    return {
        "overall_score": overall,
        "stage": stage,
        "dimension_scores": dim_scores,
        "strengths": strengths,
        "blockers": blockers,
        "roadmap": roadmap,
    }


@api.post("/assessments/start")
async def start_assessment(body: StartAssessmentIn, user=Depends(get_current_user)):
    template = get_template(body.template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    resp_id = str(uuid.uuid4())
    doc = {
        "id": resp_id,
        "user_id": user["id"],
        "user_email": user["email"],
        "user_name": user["name"],
        "organization_id": user.get("organization_id"),
        "template_id": template["id"],
        "template_slug": template["slug"],
        "audience": template["audience"],
        "answers": {},
        "status": "in_progress",
        "started_at": now_iso(),
        "submitted_at": None,
        "results": None,
    }
    await db.responses.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.get("/assessments/responses/{response_id}")
async def get_response(response_id: str, user=Depends(get_current_user)):
    r = await db.responses.find_one({"id": response_id}, {"_id": 0})
    if not r:
        raise HTTPException(status_code=404, detail="Response not found")
    if r["user_id"] != user["id"] and user["role"] not in ("super_admin", "org_admin", "consultant"):
        raise HTTPException(status_code=403, detail="Not authorized")
    return r


@api.patch("/assessments/responses/{response_id}")
async def save_answers(response_id: str, body: SaveAnswersIn, user=Depends(get_current_user)):
    r = await db.responses.find_one({"id": response_id}, {"_id": 0})
    if not r:
        raise HTTPException(status_code=404, detail="Response not found")
    if r["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    if r["status"] == "submitted":
        raise HTTPException(status_code=400, detail="Already submitted")

    update = {"answers": {**r.get("answers", {}), **body.answers}}
    if body.submit:
        template = get_template(r["template_id"])
        results = _compute_results(template, update["answers"])
        update["results"] = results
        update["status"] = "submitted"
        update["submitted_at"] = now_iso()

    await db.responses.update_one({"id": response_id}, {"$set": update})
    updated = await db.responses.find_one({"id": response_id}, {"_id": 0})
    return updated


@api.get("/assessments/my")
async def my_responses(user=Depends(get_current_user)):
    items = await db.responses.find({"user_id": user["id"]}, {"_id": 0}).sort("started_at", -1).to_list(200)
    return items


# =========================================================== Org admin
@api.get("/org/members")
async def org_members(user=Depends(require_roles("org_admin"))):
    org_id = user.get("organization_id")
    if not org_id:
        return []
    members = await db.users.find(
        {"organization_id": org_id}, {"_id": 0, "password_hash": 0}
    ).to_list(500)
    return members


@api.post("/org/invite")
async def org_invite(body: InviteIn, user=Depends(require_roles("org_admin"))):
    org_id = user.get("organization_id")
    if not org_id:
        raise HTTPException(status_code=400, detail="No organization")
    email = body.email.lower().strip()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=400, detail="Email already in use")
    if body.role not in ("employee", "org_admin"):
        raise HTTPException(status_code=400, detail="Invalid role")
    # Auto-provision with temp password = email local part + '123'
    temp_pw = email.split("@")[0] + "123"
    user_id = str(uuid.uuid4())
    await db.users.insert_one(
        {
            "id": user_id,
            "email": email,
            "name": body.name,
            "password_hash": hash_password(temp_pw),
            "role": body.role,
            "organization_id": org_id,
            "assigned_org_ids": [],
            "created_at": now_iso(),
            "invited_by": user["id"],
        }
    )
    return {"ok": True, "temporary_password": temp_pw, "email": email}


@api.get("/org/aggregate")
async def org_aggregate(user=Depends(require_roles("org_admin", "consultant", "super_admin"))):
    """Aggregated team maturity heatmap for an organization."""
    org_id = user.get("organization_id")
    # Consultant can pass org via assigned list; super_admin all; here org_admin only.
    if user["role"] == "org_admin" and not org_id:
        return {"members": 0, "submissions": 0, "dimensions": []}

    query_filter: Dict[str, Any] = {"status": "submitted", "audience": "organization"}
    if user["role"] == "org_admin":
        query_filter["organization_id"] = org_id

    responses = await db.responses.find(query_filter, {"_id": 0}).to_list(1000)
    # aggregate dimension average
    agg: Dict[str, List[float]] = {}
    names: Dict[str, str] = {}
    for r in responses:
        if not r.get("results"):
            continue
        for d in r["results"]["dimension_scores"]:
            agg.setdefault(d["id"], []).append(d["score"])
            names[d["id"]] = d["name"]

    dimensions = [
        {"id": k, "name": names[k], "avg_score": round(sum(v) / len(v), 1), "samples": len(v)}
        for k, v in agg.items()
    ]
    overall = round(sum(d["avg_score"] for d in dimensions) / len(dimensions), 1) if dimensions else 0.0

    members = 0
    if org_id:
        members = await db.users.count_documents({"organization_id": org_id})

    return {
        "members": members,
        "submissions": len(responses),
        "dimensions": dimensions,
        "overall_score": overall,
    }


# =========================================================== Super admin
@api.get("/admin/users")
async def admin_users(user=Depends(require_roles("super_admin"))):
    users = await db.users.find({}, {"_id": 0, "password_hash": 0}).to_list(1000)
    return users


@api.get("/admin/orgs")
async def admin_orgs(user=Depends(require_roles("super_admin"))):
    orgs = await db.organizations.find({}, {"_id": 0}).to_list(1000)
    # attach member counts
    for o in orgs:
        o["member_count"] = await db.users.count_documents({"organization_id": o["id"]})
        o["submission_count"] = await db.responses.count_documents(
            {"organization_id": o["id"], "status": "submitted"}
        )
    return orgs


@api.post("/admin/assign-consultant")
async def assign_consultant(body: AssignConsultantIn, user=Depends(require_roles("super_admin"))):
    target = await db.users.find_one({"id": body.consultant_id})
    if not target or target["role"] != "consultant":
        raise HTTPException(status_code=400, detail="Not a consultant")
    org = await db.organizations.find_one({"id": body.organization_id})
    if not org:
        raise HTTPException(status_code=404, detail="Org not found")
    await db.users.update_one(
        {"id": body.consultant_id},
        {"$addToSet": {"assigned_org_ids": body.organization_id}},
    )
    return {"ok": True}


@api.patch("/admin/users/{user_id}/role")
async def change_role(user_id: str, role: str, user=Depends(require_roles("super_admin"))):
    if role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail="Invalid role")
    await db.users.update_one({"id": user_id}, {"$set": {"role": role}})
    return {"ok": True}


# =========================================================== Consultant
@api.get("/consultant/orgs")
async def consultant_orgs(user=Depends(require_roles("consultant", "super_admin"))):
    ids = user.get("assigned_org_ids", []) or []
    if user["role"] == "super_admin":
        orgs = await db.organizations.find({}, {"_id": 0}).to_list(1000)
    else:
        orgs = await db.organizations.find({"id": {"$in": ids}}, {"_id": 0}).to_list(1000)
    for o in orgs:
        o["member_count"] = await db.users.count_documents({"organization_id": o["id"]})
        o["submission_count"] = await db.responses.count_documents(
            {"organization_id": o["id"], "status": "submitted"}
        )
    return orgs


@api.get("/consultant/orgs/{org_id}/responses")
async def consultant_org_responses(
    org_id: str, user=Depends(require_roles("consultant", "super_admin"))
):
    if user["role"] == "consultant" and org_id not in (user.get("assigned_org_ids") or []):
        raise HTTPException(status_code=403, detail="Not assigned to this org")
    responses = await db.responses.find(
        {"organization_id": org_id, "status": "submitted"}, {"_id": 0}
    ).to_list(500)
    return responses


# =========================================================== Root
@api.get("/")
async def root():
    return {"service": "i4SKILLS AIM", "status": "ok"}


app.include_router(api)

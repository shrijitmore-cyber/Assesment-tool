"""i4SKILLS AIM backend tests — auth, templates, assessments, RBAC, admin."""
import os
import uuid

import pytest
import requests

BASE = os.environ.get("REACT_APP_BACKEND_URL")
# Fallback for local pytest runs from backend shell
if not BASE:
    with open("/app/frontend/.env", "r") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE = line.split("=", 1)[1].strip()
BASE = BASE.rstrip("/")
API = f"{BASE}/api"

SUPER_EMAIL = "admin@i4skills.com"
SUPER_PASSWORD = "Admin@12345"


# ---------- fixtures ----------
@pytest.fixture(scope="session")
def http():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def super_token(http):
    r = http.post(f"{API}/auth/login", json={"email": SUPER_EMAIL, "password": SUPER_PASSWORD})
    assert r.status_code == 200, f"super admin login failed: {r.status_code} {r.text}"
    return r.json()["token"]


@pytest.fixture(scope="session")
def org_admin(http):
    email = f"TEST_org_{uuid.uuid4().hex[:6]}@example.com"
    r = http.post(f"{API}/auth/register", json={
        "email": email, "password": "Secret123!", "name": "Org Owner",
        "account_type": "organization", "organization_name": "Acme AI Co"
    })
    assert r.status_code == 200, r.text
    data = r.json()
    return {"token": data["token"], "user": data["user"], "email": email, "password": "Secret123!"}


@pytest.fixture(scope="session")
def individual(http):
    email = f"TEST_ind_{uuid.uuid4().hex[:6]}@example.com"
    r = http.post(f"{API}/auth/register", json={
        "email": email, "password": "Secret123!", "name": "Solo User",
        "account_type": "individual"
    })
    assert r.status_code == 200, r.text
    data = r.json()
    return {"token": data["token"], "user": data["user"], "email": email}


def H(tok):
    return {"Authorization": f"Bearer {tok}"}


# ---------- health ----------
class TestHealth:
    def test_root(self, http):
        r = http.get(f"{API}/")
        assert r.status_code == 200
        assert r.json().get("status") == "ok"


# ---------- auth ----------
class TestAuth:
    def test_super_admin_login(self, http):
        r = http.post(f"{API}/auth/login", json={"email": SUPER_EMAIL, "password": SUPER_PASSWORD})
        assert r.status_code == 200
        j = r.json()
        assert "token" in j and j["user"]["role"] == "super_admin"

    def test_login_invalid(self, http):
        r = http.post(f"{API}/auth/login", json={"email": SUPER_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_register_organization(self, org_admin):
        u = org_admin["user"]
        assert u["role"] == "org_admin"
        assert u["organization_id"]
        assert "password_hash" not in u

    def test_register_individual(self, individual):
        assert individual["user"]["role"] == "individual"
        assert individual["user"].get("organization_id") is None

    def test_register_duplicate(self, http, org_admin):
        r = http.post(f"{API}/auth/register", json={
            "email": org_admin["email"], "password": "Secret123!", "name": "Dup",
            "account_type": "individual"
        })
        assert r.status_code == 400

    def test_register_missing_org_name(self, http):
        r = http.post(f"{API}/auth/register", json={
            "email": f"TEST_{uuid.uuid4().hex[:6]}@e.com", "password": "Secret123!",
            "name": "X", "account_type": "organization"
        })
        assert r.status_code == 400

    def test_me(self, http, super_token):
        r = http.get(f"{API}/auth/me", headers=H(super_token))
        assert r.status_code == 200
        assert r.json()["user"]["email"] == SUPER_EMAIL

    def test_me_unauth(self, http):
        r = http.get(f"{API}/auth/me")
        assert r.status_code == 401


# ---------- templates ----------
class TestTemplates:
    def test_list(self, http):
        r = http.get(f"{API}/assessments/templates")
        assert r.status_code == 200
        items = r.json()
        ids = {t["id"] for t in items}
        assert {"org-aim-v1", "ind-aim-v1"}.issubset(ids)

    def test_org_detail(self, http):
        r = http.get(f"{API}/assessments/templates/org-aim-v1")
        assert r.status_code == 200
        j = r.json()
        t = j["template"]
        assert len(t["dimensions"]) == 6
        for d in t["dimensions"]:
            assert len(d["questions"]) == 5
        assert len(j["likert"]) == 5

    def test_ind_detail(self, http):
        r = http.get(f"{API}/assessments/templates/ind-aim-v1")
        assert r.status_code == 200
        assert len(r.json()["template"]["dimensions"]) == 3

    def test_detail_404(self, http):
        r = http.get(f"{API}/assessments/templates/nope")
        assert r.status_code == 404


# ---------- assessments ----------
class TestAssessments:
    def test_start_requires_auth(self, http):
        r = http.post(f"{API}/assessments/start", json={"template_id": "org-aim-v1"})
        assert r.status_code == 401

    def test_full_org_flow(self, http, org_admin):
        tok = org_admin["token"]
        # start
        r = http.post(f"{API}/assessments/start",
                      json={"template_id": "org-aim-v1"}, headers=H(tok))
        assert r.status_code == 200, r.text
        resp = r.json()
        assert resp["status"] == "in_progress"
        resp_id = resp["id"]

        # get detail
        r = http.get(f"{API}/assessments/responses/{resp_id}", headers=H(tok))
        assert r.status_code == 200

        # build answers — 6 dims x 5 qs; mix values
        answers = {}
        for i, dim in enumerate(["strategy", "infrastructure", "adoption",
                                 "workforce", "culture", "impact"]):
            for q in range(5):
                answers[f"{dim}_{q}"] = (i % 5) + 1  # 1..5 across dims

        # partial save
        partial = {k: v for k, v in list(answers.items())[:10]}
        r = http.patch(f"{API}/assessments/responses/{resp_id}",
                       json={"answers": partial, "submit": False}, headers=H(tok))
        assert r.status_code == 200
        assert r.json()["status"] == "in_progress"

        # submit
        r = http.patch(f"{API}/assessments/responses/{resp_id}",
                       json={"answers": answers, "submit": True}, headers=H(tok))
        assert r.status_code == 200, r.text
        final = r.json()
        assert final["status"] == "submitted"
        res = final["results"]
        assert "overall_score" in res
        assert 0 <= res["overall_score"] <= 100
        assert "stage" in res and "name" in res["stage"]
        assert len(res["dimension_scores"]) == 6
        assert len(res["strengths"]) == 2
        assert len(res["blockers"]) == 2
        assert len(res["roadmap"]) == 2
        for item in res["roadmap"]:
            assert "actions_30" in item and "actions_60" in item and "actions_90" in item

        # cannot resubmit
        r = http.patch(f"{API}/assessments/responses/{resp_id}",
                       json={"answers": answers, "submit": True}, headers=H(tok))
        assert r.status_code == 400

        # my responses includes this one
        r = http.get(f"{API}/assessments/my", headers=H(tok))
        assert r.status_code == 200
        assert any(x["id"] == resp_id for x in r.json())

    def test_individual_flow(self, http, individual):
        tok = individual["token"]
        r = http.post(f"{API}/assessments/start",
                      json={"template_id": "ind-aim-v1"}, headers=H(tok))
        assert r.status_code == 200
        rid = r.json()["id"]
        answers = {f"{d}_{q}": 4 for d in ["capability", "mindset", "accountability"]
                   for q in range(5)}
        r = http.patch(f"{API}/assessments/responses/{rid}",
                       json={"answers": answers, "submit": True}, headers=H(tok))
        assert r.status_code == 200
        res = r.json()["results"]
        # all 4 => per dim score 75
        for d in res["dimension_scores"]:
            assert d["score"] == 75.0
        assert res["overall_score"] == 75.0

    def test_start_bad_template(self, http, individual):
        r = http.post(f"{API}/assessments/start",
                      json={"template_id": "nope"}, headers=H(individual["token"]))
        assert r.status_code == 404


# ---------- RBAC ----------
class TestRBAC:
    def test_invite_as_org_admin(self, http, org_admin):
        email = f"TEST_inv_{uuid.uuid4().hex[:6]}@example.com"
        r = http.post(f"{API}/org/invite",
                      json={"email": email, "name": "Emp", "role": "employee"},
                      headers=H(org_admin["token"]))
        assert r.status_code == 200, r.text
        j = r.json()
        assert j["ok"] is True and j["temporary_password"]

        # invited member can log in
        pw = j["temporary_password"]
        r2 = http.post(f"{API}/auth/login", json={"email": email, "password": pw})
        assert r2.status_code == 200

    def test_invite_forbidden_for_individual(self, http, individual):
        r = http.post(f"{API}/org/invite",
                      json={"email": f"TEST_{uuid.uuid4().hex[:6]}@e.com",
                            "name": "x", "role": "employee"},
                      headers=H(individual["token"]))
        assert r.status_code == 403

    def test_admin_users_requires_super(self, http, individual, super_token):
        r = http.get(f"{API}/admin/users", headers=H(individual["token"]))
        assert r.status_code == 403
        r2 = http.get(f"{API}/admin/users", headers=H(super_token))
        assert r2.status_code == 200
        assert isinstance(r2.json(), list)
        # ensure no password hashes leak
        for u in r2.json():
            assert "password_hash" not in u

    def test_admin_orgs(self, http, super_token):
        r = http.get(f"{API}/admin/orgs", headers=H(super_token))
        assert r.status_code == 200
        for o in r.json():
            assert "member_count" in o

    def test_org_members(self, http, org_admin):
        r = http.get(f"{API}/org/members", headers=H(org_admin["token"]))
        assert r.status_code == 200
        emails = {m["email"] for m in r.json()}
        assert org_admin["email"].lower() in emails

    def test_org_aggregate(self, http, org_admin):
        r = http.get(f"{API}/org/aggregate", headers=H(org_admin["token"]))
        assert r.status_code == 200
        j = r.json()
        assert "members" in j and "submissions" in j and "dimensions" in j

    def test_change_role(self, http, super_token, individual):
        uid = individual["user"]["id"]
        r = http.patch(f"{API}/admin/users/{uid}/role?role=consultant",
                       headers=H(super_token))
        assert r.status_code == 200
        # verify persisted
        r2 = http.get(f"{API}/admin/users", headers=H(super_token))
        assert any(u["id"] == uid and u["role"] == "consultant" for u in r2.json())

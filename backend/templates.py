"""Assessment template seed data for i4SKILLS AIM.

Two templates:
- Organizational: 6 dimensions, 5 Likert questions each (30 questions)
- Individual:     3 pillars,     5 Likert questions each (15 questions)

All answers use a 1-5 Likert scale.
"""

LIKERT_OPTIONS = [
    {"value": 1, "label": "Strongly Disagree"},
    {"value": 2, "label": "Disagree"},
    {"value": 3, "label": "Neutral"},
    {"value": 4, "label": "Agree"},
    {"value": 5, "label": "Strongly Agree"},
]

ORG_STAGES = [
    {"min": 0,  "max": 40, "name": "Foundational",    "blurb": "Early awareness; AI is ad-hoc and experimental."},
    {"min": 40, "max": 55, "name": "Emerging",        "blurb": "Initial pilots with isolated wins but no unified strategy."},
    {"min": 55, "max": 70, "name": "Structured",      "blurb": "Clear roadmap, defined governance, repeatable delivery."},
    {"min": 70, "max": 85, "name": "Operational",     "blurb": "AI embedded across functions with measurable ROI."},
    {"min": 85, "max": 101,"name": "Transformational","blurb": "AI is a core enterprise capability driving new value pools."},
]

IND_STAGES = [
    {"min": 0,  "max": 40, "name": "Foundational", "blurb": "Limited exposure; building vocabulary and basic skills."},
    {"min": 40, "max": 55, "name": "Aware",        "blurb": "Understands AI concepts and experiments with tools."},
    {"min": 55, "max": 70, "name": "Applied",      "blurb": "Actively using AI to improve day-to-day work."},
    {"min": 70, "max": 85, "name": "Integrated",   "blurb": "AI is a native part of workflow and decision making."},
    {"min": 85, "max": 101,"name": "Champion",     "blurb": "Mentors peers, drives responsible adoption at scale."},
]

# Peer benchmark (static industry average, 0-100) per dimension.
ORG_BENCHMARKS = {
    "strategy": 58,
    "infrastructure": 54,
    "adoption": 52,
    "workforce": 56,
    "culture": 61,
    "impact": 49,
}

IND_BENCHMARKS = {
    "capability": 57,
    "mindset": 63,
    "accountability": 52,
}

ORG_TEMPLATE = {
    "id": "org-aim-v1",
    "slug": "organizational",
    "audience": "organization",
    "title": "Organizational AIM Diagnostic",
    "subtitle": "Benchmark your enterprise AI readiness across 6 dimensions.",
    "duration_minutes": 10,
    "stages": ORG_STAGES,
    "benchmarks": ORG_BENCHMARKS,
    "dimensions": [
        {
            "id": "strategy",
            "name": "AI Strategy & Executive Alignment",
            "overline": "01",
            "description": "Is AI embedded in long-term strategy with leadership sponsorship, investment and governance?",
            "questions": [
                "Our executive team has articulated a clear AI vision tied to measurable business outcomes.",
                "We have a multi-year AI roadmap aligned with enterprise strategy.",
                "Dedicated budget is allocated to AI initiatives each planning cycle.",
                "A senior leader is directly accountable for AI strategy execution.",
                "AI investment decisions are prioritized using ROI and feasibility criteria.",
            ],
        },
        {
            "id": "infrastructure",
            "name": "Data & Digital Infrastructure Readiness",
            "overline": "02",
            "description": "Are data, cloud and tooling foundations sufficient to support AI at scale?",
            "questions": [
                "Core data is centralized, governed and accessible to AI teams.",
                "Our data quality, lineage and cataloguing practices meet AI workload needs.",
                "We have scalable cloud / compute infrastructure provisioned for AI.",
                "Security, privacy and compliance controls for AI data use are well defined.",
                "Integration between business systems and AI/ML platforms is seamless.",
            ],
        },
        {
            "id": "adoption",
            "name": "AI Adoption & Operational Integration",
            "overline": "03",
            "description": "How effectively is AI integrated into core business processes and operations?",
            "questions": [
                "AI use cases are deployed into production beyond pilots.",
                "Business processes have been redesigned to leverage AI outputs.",
                "AI solutions are measured against defined KPIs after launch.",
                "We have a repeatable pathway from pilot to scaled deployment.",
                "Business units actively request and sponsor new AI use cases.",
            ],
        },
        {
            "id": "workforce",
            "name": "Workforce Capability & Talent Readiness",
            "overline": "04",
            "description": "Do people have the skills, roles and support to deliver and use AI?",
            "questions": [
                "Critical AI roles (engineers, scientists, product) are staffed adequately.",
                "Non-technical employees receive continuous AI upskilling.",
                "We have identified and developed 'Digital AI Champions' across functions.",
                "Career paths and incentives encourage AI-related skill growth.",
                "Leaders are fluent enough in AI to make informed investment decisions.",
            ],
        },
        {
            "id": "culture",
            "name": "Culture, Innovation & Change Agility",
            "overline": "05",
            "description": "Does the organization embrace experimentation, learning and responsible change?",
            "questions": [
                "Employees feel safe experimenting with AI tools in their daily work.",
                "We celebrate and share learnings from failed AI experiments.",
                "Cross-functional collaboration on AI initiatives is the norm.",
                "Change management activities accompany every major AI rollout.",
                "Ethical and responsible AI principles guide our decision making.",
            ],
        },
        {
            "id": "impact",
            "name": "AI Impact & Value Realization",
            "overline": "06",
            "description": "Is AI delivering measurable, compounding value for the business?",
            "questions": [
                "AI initiatives have produced quantifiable revenue or cost impact.",
                "We track a portfolio view of AI value realized vs. invested.",
                "AI contributes to measurable customer experience improvements.",
                "Operational AI deployments have reduced cycle time or error rates.",
                "Learnings from AI projects are systematically reused across the enterprise.",
            ],
        },
    ],
}

IND_TEMPLATE = {
    "id": "ind-aim-v1",
    "slug": "individual",
    "audience": "individual",
    "title": "Individual Digital & AI Readiness",
    "subtitle": "Assess your personal AI capability, mindset and accountability.",
    "duration_minutes": 5,
    "stages": IND_STAGES,
    "benchmarks": IND_BENCHMARKS,
    "dimensions": [
        {
            "id": "capability",
            "name": "Capability — Skill & Competence",
            "overline": "01",
            "description": "Your technical and practical ability to work with AI tools and data.",
            "questions": [
                "I can confidently use modern AI tools (chat, copilots, analytics) in my work.",
                "I understand how core AI concepts like LLMs, embeddings and automation work.",
                "I can evaluate when an AI solution is appropriate vs. a traditional approach.",
                "I regularly pick up new AI tools and integrate them into my workflow.",
                "I can critically assess AI outputs for accuracy and bias.",
            ],
        },
        {
            "id": "mindset",
            "name": "Mindset — Adoption & Behavior",
            "overline": "02",
            "description": "Your willingness to learn, experiment and adapt to AI-driven change.",
            "questions": [
                "I see AI as an opportunity, not a threat, to my role.",
                "I actively seek out AI-related learning content and communities.",
                "I share AI experiments and learnings with my peers.",
                "I challenge my own assumptions and processes using AI.",
                "I adjust quickly when new AI capabilities change how my work is done.",
            ],
        },
        {
            "id": "accountability",
            "name": "Accountability — Responsible Usage",
            "overline": "03",
            "description": "Your responsible, business-aligned and ethical use of AI.",
            "questions": [
                "I understand the data, privacy and IP implications of the AI tools I use.",
                "I follow my organization's responsible AI guidelines and policies.",
                "I align AI usage decisions with clear business outcomes and KPIs.",
                "I validate and attribute AI outputs before acting on or sharing them.",
                "I consider fairness, bias and downstream impact when deploying AI.",
            ],
        },
    ],
}

ALL_TEMPLATES = [ORG_TEMPLATE, IND_TEMPLATE]


def get_template(template_id: str):
    for t in ALL_TEMPLATES:
        if t["id"] == template_id or t["slug"] == template_id:
            return t
    return None


def stage_for_score(stages, score: float) -> dict:
    for s in stages:
        if s["min"] <= score < s["max"]:
            return s
    return stages[-1]


# Roadmap guidance per dimension (when that dimension is a bottom-2 weakness).
ORG_ROADMAP = {
    "strategy": {
        "title": "Codify an executive-sponsored AI strategy",
        "actions_30": "Run a C-suite AI vision workshop; align 3-5 priority business outcomes.",
        "actions_60": "Publish a 24-month AI roadmap with ROI targets and governance owners.",
        "actions_90": "Approve funding and staffing for the top 3 AI bets; quarterly review cadence.",
    },
    "infrastructure": {
        "title": "Modernize data and platform foundations",
        "actions_30": "Audit data quality, catalog, and access controls across priority domains.",
        "actions_60": "Stand up a unified AI/ML platform with security and observability baked in.",
        "actions_90": "Migrate 2 priority use cases onto the platform; measure time-to-insight.",
    },
    "adoption": {
        "title": "Move AI from pilots to production",
        "actions_30": "Select 2 high-value pilots; define production-readiness checklists.",
        "actions_60": "Redesign target business processes around AI outputs; launch into prod.",
        "actions_90": "Track post-launch KPIs weekly; document a pilot-to-scale playbook.",
    },
    "workforce": {
        "title": "Build AI-fluent talent at all levels",
        "actions_30": "Map AI skill gaps across critical roles; launch exec AI fluency program.",
        "actions_60": "Nominate Digital AI Champions in every function; begin monthly cohorts.",
        "actions_90": "Embed AI learning in performance goals and career frameworks.",
    },
    "culture": {
        "title": "Create a safe experimentation culture",
        "actions_30": "Publish a responsible AI charter; run leadership listening sessions.",
        "actions_60": "Launch internal AI community; run monthly experiment showcases.",
        "actions_90": "Integrate change management into every AI rollout; measure adoption.",
    },
    "impact": {
        "title": "Make AI value visible and compounding",
        "actions_30": "Baseline the current AI portfolio: invested $, realized $, status.",
        "actions_60": "Implement an AI value dashboard; weekly reviews with sponsors.",
        "actions_90": "Double down on top-quartile use cases; retire or redirect laggards.",
    },
}

IND_ROADMAP = {
    "capability": {
        "title": "Deepen your AI skill stack",
        "actions_30": "Pick 2 AI tools core to your role; complete guided tutorials.",
        "actions_60": "Ship 1 real work deliverable end-to-end with AI assistance.",
        "actions_90": "Teach what you learned to 3 peers; publish a short internal write-up.",
    },
    "mindset": {
        "title": "Shift from curious to deliberate adopter",
        "actions_30": "Join 1 AI community; schedule 30-minute weekly learning blocks.",
        "actions_60": "Run a personal AI experiment challenging one core assumption in your work.",
        "actions_90": "Mentor a peer through their first AI-assisted workflow.",
    },
    "accountability": {
        "title": "Use AI responsibly and business-aligned",
        "actions_30": "Review your org's AI usage policy; list your current AI touchpoints.",
        "actions_60": "Tie each AI usage to a business outcome and validate outputs before use.",
        "actions_90": "Champion a responsible AI practice (fact-check, attribution, privacy) in your team.",
    },
}


def get_roadmap_map(audience: str) -> dict:
    return ORG_ROADMAP if audience == "organization" else IND_ROADMAP

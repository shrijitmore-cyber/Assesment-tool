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
    {"min": 0,  "max": 40, "name": "Awareness",          "blurb": "Curious and exploring — building vocabulary and trying tools."},
    {"min": 40, "max": 55, "name": "Working Knowledge",  "blurb": "Understands core concepts and uses AI tools confidently."},
    {"min": 55, "max": 70, "name": "Practitioner",       "blurb": "Applies AI to real work; ships outcomes and iterates."},
    {"min": 70, "max": 85, "name": "Leader / Innovator", "blurb": "Designs strategy, mentors others, drives adoption."},
    {"min": 85, "max": 101,"name": "Mastery & Scale",    "blurb": "Architects enterprise AI; sets standards and governance."},
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
    "fundamentals": 55,
    "data": 50,
    "genai": 62,
    "tools": 58,
    "usecases": 48,
    "responsible": 45,
    "projects": 47,
}

ORG_TEMPLATE = {
    "id": "org-aim-v1",
    "slug": "organizational",
    "audience": "organization",
    "title": "Organizational Digital AI Readiness & Maturity",
    "subtitle": "Benchmark enterprise AI readiness across 6 dimensions — 5 core + 1 advanced.",
    "duration_minutes": 8,
    "stages": ORG_STAGES,
    "benchmarks": ORG_BENCHMARKS,
    "dimensions": [
        {
            "id": "strategy",
            "name": "AI Strategy & Executive Alignment",
            "overline": "01",
            "is_advanced": False,
            "definition": "The extent to which AI is embedded in the organization's long-term strategy, supported by leadership sponsorship, investment commitment, and enterprise-level governance.",
            "focus": "Is AI a strategic pillar or an experimental initiative?",
            "evaluate_based_on": [
                "Degree of AI alignment with enterprise growth strategy",
                "Clarity of AI vision and long-term ambition",
                "Executive accountability and ownership structure",
                "Strength of AI governance, ethics, and regulatory compliance oversight",
                "Risk appetite defined for AI experimentation and scaling",
            ],
            "description": "Is AI embedded in long-term strategy with leadership sponsorship, investment and governance?",
            "questions": [
                "Is AI explicitly embedded in the corporate strategic roadmap?",
                "Does executive leadership actively sponsor and review AI initiatives?",
                "Is there a formal governance structure for AI ethics, risk, and compliance?",
            ],
        },
        {
            "id": "infrastructure",
            "name": "Data & Digital Infrastructure Readiness",
            "overline": "02",
            "is_advanced": False,
            "definition": "The organization's ability to support AI initiatives through robust data architecture, system integration, cloud capability, and cybersecurity frameworks.",
            "focus": "Can the infrastructure support enterprise-scale AI transformation?",
            "evaluate_based_on": [
                "Enterprise-wide data standardization maturity",
                "Scalability and flexibility of digital architecture",
                "Integration depth across core systems",
                "Data accessibility for decision-making",
                "Cyber resilience and regulatory readiness",
            ],
            "description": "Are data, cloud and tooling foundations sufficient to support AI at scale?",
            "questions": [
                "Is organizational data structured, accessible, and AI-ready?",
                "Are digital systems integrated to enable seamless AI deployment?",
                "Are data governance and security frameworks mature and enforced?",
            ],
        },
        {
            "id": "adoption",
            "name": "AI Adoption & Operational Integration",
            "overline": "03",
            "is_advanced": False,
            "definition": "The degree to which AI has moved beyond pilots into structured, scalable deployment embedded within core business processes.",
            "focus": "Has AI changed how the organization operates?",
            "evaluate_based_on": [
                "Degree of AI integration into core value-chain processes",
                "Level of automation and augmentation across business functions",
                "Process redesign to embed AI (not just tool addition)",
                "Standardization of AI deployment methodology",
                "Replicability of AI solutions across units",
            ],
            "description": "How effectively is AI integrated into core business processes and operations?",
            "questions": [
                "Has the organization transitioned from AI pilots to scaled deployment?",
                "Are AI solutions integrated into day-to-day workflows rather than operating in silos?",
                "Are AI initiatives tracked using measurable ROI and performance metrics?",
            ],
        },
        {
            "id": "workforce",
            "name": "Workforce Capability & Talent Readiness",
            "overline": "04",
            "is_advanced": False,
            "definition": "The organization's preparedness to adopt AI through structured upskilling, role redesign, and capability-building initiatives.",
            "focus": "Is the workforce structurally evolving to support AI?",
            "evaluate_based_on": [
                "Workforce AI literacy penetration",
                "Leadership AI fluency",
                "Role redesign to support AI-augmented work",
                "Structured capability-building roadmap",
                "Internal AI champion and ownership network",
            ],
            "description": "Do people have the skills, roles and support to deliver and use AI?",
            "questions": [
                "Has a significant portion of the workforce undergone AI literacy training?",
                "Are AI-related competencies integrated into job roles and performance frameworks?",
                "Is there a defined pipeline for developing Digital AI Champions?",
            ],
        },
        {
            "id": "culture",
            "name": "Culture, Innovation & Change Agility",
            "overline": "05",
            "is_advanced": False,
            "definition": "The organizational mindset and behavioral readiness to experiment, adopt, and scale AI-driven innovation while managing change effectively.",
            "focus": "Is AI embedded in organizational behavior and mindset?",
            "evaluate_based_on": [
                "Organizational openness to AI-led transformation",
                "Cross-functional collaboration maturity",
                "Institutionalized experimentation frameworks",
                "Speed of AI pilot-to-scale transition",
                "Leadership communication reinforcing AI transformation",
            ],
            "description": "Does the organization embrace experimentation, learning and responsible change?",
            "questions": [
                "Are employees encouraged to experiment with AI responsibly?",
                "Is cross-functional collaboration enabled for AI innovation?",
                "Is there sustained investment in AI experimentation and innovation initiatives?",
            ],
        },
        {
            "id": "impact",
            "name": "AI Impact & Value Realization",
            "overline": "06 · Advanced",
            "is_advanced": True,
            "definition": "The organization's ability to quantify, track, and scale measurable business value generated through AI initiatives.",
            "focus": "Is AI delivering measurable enterprise advantage?",
            "evaluate_based_on": [
                "Clear linkage between AI and business value creation",
                "Financial impact visibility (cost, revenue, productivity)",
                "Prioritization discipline for high-impact AI initiatives",
                "Enterprise scaling of proven use cases",
                "Competitive differentiation driven by AI capabilities",
            ],
            "description": "Advanced dimension for mature organizations — is AI delivering measurable, compounding value?",
            "questions": [
                "Are AI use cases prioritized based on business impact?",
                "Is there a structured framework for tracking AI-driven cost savings or revenue growth?",
                "Are successful AI use cases systematically scaled enterprise-wide?",
            ],
        },
    ],
}

IND_TEMPLATE = {
    "id": "ind-aim-v1",
    "slug": "individual",
    "audience": "individual",
    "title": "Individual AI Upskilling Roadmap",
    "subtitle": "Pinpoint your level across 7 capability tracks — Awareness to Mastery & Scale.",
    "duration_minutes": 6,
    "stages": IND_STAGES,
    "benchmarks": IND_BENCHMARKS,
    "question_levels": ["Awareness", "Working Knowledge", "Practitioner", "Leader / Innovator", "Mastery & Scale"],
    "dimensions": [
        {
            "id": "fundamentals",
            "name": "AI Fundamentals",
            "overline": "01",
            "is_advanced": False,
            "definition": "Your grasp of core AI, ML, and GenAI concepts — and how they translate into real solutions.",
            "focus": "How well do you understand what AI is and where it applies?",
            "evaluate_based_on": [
                "Familiarity with AI, ML and GenAI concepts",
                "Knowledge of model types and architectures",
                "Ability to translate AI concepts into solutions",
                "Skill in benchmarking and evaluating AI approaches",
                "Capability to design enterprise AI strategy",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your grasp of AI / ML / GenAI concepts",
                    "options": [
                        "Understand AI, ML & GenAI concepts",
                        "Understand different AI techniques & architectures",
                        "Apply AI tools & models to solve problems",
                        "Evaluate AI approaches for different contexts",
                        "Design and lead AI strategies for the organisation",
                    ],
                },
                {
                    "stem": "Your handle on AI use cases & model types",
                    "options": [
                        "Distinguish narrow AI from general AI use cases",
                        "Explore model types: supervised, unsupervised, LLMs",
                        "Translate AI concepts into practical solutions",
                        "Benchmark AI model performance & trade-offs",
                        "Advise on AI investment & capability roadmaps",
                    ],
                },
            ],
        },
        {
            "id": "data",
            "name": "Data Literacy",
            "overline": "02",
            "is_advanced": False,
            "definition": "Your ability to read, interpret, transform and govern data for AI-driven decisions.",
            "focus": "Can you find signal in data and trust what you see?",
            "evaluate_based_on": [
                "Understanding of data types and quality basics",
                "Skill in interpreting dashboards and reports",
                "Ability to clean, transform and visualise data",
                "Design of data governance for your function",
                "Leadership of enterprise data strategy",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your data fluency in day-to-day work",
                    "options": [
                        "Understand types of data & data quality basics",
                        "Interpret data insights & dashboards",
                        "Perform data analysis using tools (Excel, SQL, Python)",
                        "Design data-driven decision frameworks",
                        "Lead enterprise data strategy for AI readiness",
                    ],
                },
                {
                    "stem": "Your ability to draw insight from data",
                    "options": [
                        "Know the difference between structured & unstructured data",
                        "Identify trends, outliers & key metrics in reports",
                        "Clean, transform & visualise data for insights",
                        "Define data governance standards for your function",
                        "Build data culture & literacy across the organisation",
                    ],
                },
            ],
        },
        {
            "id": "genai",
            "name": "GenAI & Prompt Engineering",
            "overline": "03",
            "is_advanced": False,
            "definition": "Your skill with generative AI tools, prompting techniques, and AI-assisted workflows.",
            "focus": "How effectively can you put GenAI to work?",
            "evaluate_based_on": [
                "Daily productivity gains from GenAI tools",
                "Skill with structured prompts and templates",
                "Building AI-assisted workflows for recurring tasks",
                "Designing multi-step prompt chains & RAG pipelines",
                "Developing AI agents and enterprise assistants",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your use of GenAI in your workflow",
                    "options": [
                        "Use GenAI tools for day-to-day productivity",
                        "Create structured prompts & prompt templates",
                        "Build AI-assisted workflows for recurring tasks",
                        "Design multi-step prompt chains & RAG pipelines",
                        "Develop AI agents & enterprise-grade assistants",
                    ],
                },
                {
                    "stem": "Your prompting craft and quality control",
                    "options": [
                        "Experiment with ChatGPT, Claude & Gemini",
                        "Apply prompt patterns: role, context, format, chain-of-thought",
                        "Automate content, research & analysis with GenAI",
                        "Evaluate output quality & reduce hallucinations",
                        "Define prompt governance & GenAI usage standards",
                    ],
                },
            ],
        },
        {
            "id": "tools",
            "name": "AI Tools & Platforms",
            "overline": "04",
            "is_advanced": False,
            "definition": "Your hands-on experience with AI-powered tools, no-code platforms, and ML services.",
            "focus": "How deep is your stack of AI tools and platforms?",
            "evaluate_based_on": [
                "Daily use of AI productivity tools",
                "Ability to build with no-code AI platforms",
                "Hands-on with AutoML and ML services",
                "Integrating AI APIs into existing systems",
                "Architecting end-to-end AI platforms and MLOps",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your range of AI tools in daily work",
                    "options": [
                        "Use AI-powered productivity tools in daily work",
                        "Work with no-code AI tools & platforms",
                        "Develop & fine-tune ML models using platforms",
                        "Integrate AI APIs into existing systems",
                        "Architect end-to-end AI solutions & platforms",
                    ],
                },
                {
                    "stem": "Your ability to build and integrate AI",
                    "options": [
                        "Explore Copilot, Notion AI & Grammarly in workflows",
                        "Build automations using Make, Zapier & no-code AI",
                        "Use AutoML, Azure ML or Vertex AI for model building",
                        "Connect AI services via REST APIs & SDKs",
                        "Design scalable AI infrastructure & MLOps pipelines",
                    ],
                },
            ],
        },
        {
            "id": "usecases",
            "name": "AI Use Cases",
            "overline": "05",
            "is_advanced": False,
            "definition": "Your ability to spot, prioritise, pilot and scale AI opportunities tied to business value.",
            "focus": "Can you turn AI capability into measurable business outcomes?",
            "evaluate_based_on": [
                "Spotting AI opportunities in your role",
                "Mapping use cases to business problems",
                "Running end-to-end AI pilots",
                "Scaling pilots across functions",
                "Leading AI innovation programmes and CoEs",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your ability to identify and frame AI opportunities",
                    "options": [
                        "Identify AI opportunities in your role & team",
                        "Map AI use cases to specific business problems",
                        "Implement AI pilot solutions end-to-end",
                        "Scale successful AI pilots across functions",
                        "Lead AI innovation programmes & strategy",
                    ],
                },
                {
                    "stem": "Your discipline in piloting and scaling AI",
                    "options": [
                        "Spot tasks that AI can augment or automate",
                        "Prioritise use cases by feasibility & impact",
                        "Run experiments, track metrics & iterate quickly",
                        "Build business cases for AI investment & scale",
                        "Create AI Centre of Excellence & community of practice",
                    ],
                },
            ],
        },
        {
            "id": "responsible",
            "name": "Responsible AI",
            "overline": "06",
            "is_advanced": False,
            "definition": "Your discipline around AI ethics, bias, risk, governance and compliant usage.",
            "focus": "Are you a trusted, responsible operator of AI?",
            "evaluate_based_on": [
                "Awareness of ethics, bias and fairness fundamentals",
                "Application of responsible AI in daily use",
                "Implementation of governance checks in projects",
                "Auditing AI systems for bias and risk",
                "Designing org-wide AI governance frameworks",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your application of responsible AI principles",
                    "options": [
                        "Understand AI ethics, bias & fairness fundamentals",
                        "Apply responsible AI principles in daily AI use",
                        "Implement governance checks in AI projects",
                        "Audit AI systems for bias, risk & compliance",
                        "Design organisation-wide AI governance frameworks",
                    ],
                },
                {
                    "stem": "Your handling of AI risk, transparency and policy",
                    "options": [
                        "Know the risks of hallucination, bias & misuse",
                        "Follow responsible AI guidelines & data privacy rules",
                        "Document model decisions & risk mitigations",
                        "Champion transparency & explainability in AI outputs",
                        "Set AI policy, ethics board & regulatory compliance",
                    ],
                },
            ],
        },
        {
            "id": "projects",
            "name": "AI Project Skills",
            "overline": "07",
            "is_advanced": False,
            "definition": "Your effectiveness in delivering AI initiatives — from scoping through scaling.",
            "focus": "Can you reliably ship AI initiatives that create value?",
            "evaluate_based_on": [
                "Understanding the AI project lifecycle",
                "Working effectively with technical teams",
                "Delivering pilots into production",
                "Managing risks, timelines and resources",
                "Leading large-scale AI transformation",
            ],
            "description": "Pick the statement that best describes where you are today on each row.",
            "questions": [
                {
                    "stem": "Your end-to-end AI project delivery",
                    "options": [
                        "Understand the AI project lifecycle",
                        "Work effectively with AI & data science teams",
                        "Deliver AI solutions from pilot to production",
                        "Manage AI project risks, timelines & resources",
                        "Lead large-scale AI transformation programmes",
                    ],
                },
                {
                    "stem": "Your business-technical bridging and value tracking",
                    "options": [
                        "Know key phases: data, model, deploy, monitor",
                        "Bridge business requirements & technical teams",
                        "Apply agile delivery methods to AI projects",
                        "Establish KPIs & value measurement for AI delivery",
                        "Drive org change management for AI adoption",
                    ],
                },
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
    "fundamentals": {
        "title": "Build foundational AI fluency",
        "actions_30": "Take a structured AI Fundamentals course; cover ML, LLMs, supervised vs unsupervised.",
        "actions_60": "Build & demo a small project using one foundational technique (classification, summarisation, etc.).",
        "actions_90": "Teach a 30-min internal session; document an AI learning roadmap for your team.",
    },
    "data": {
        "title": "Strengthen data literacy",
        "actions_30": "Master one analytics tool (Excel pivots, SQL, or Python pandas); audit one dataset for quality.",
        "actions_60": "Build a real dashboard or insight report from raw data; identify trends and outliers.",
        "actions_90": "Define a data quality checklist for your function; ship monthly insight readouts.",
    },
    "genai": {
        "title": "Level up GenAI & prompting",
        "actions_30": "Adopt one GenAI tool daily; build a personal library of 10 reusable prompt templates.",
        "actions_60": "Apply role / context / chain-of-thought prompting to ship one real deliverable end-to-end.",
        "actions_90": "Build a multi-step GenAI workflow (RAG or agent) for a recurring task you own.",
    },
    "tools": {
        "title": "Expand AI tools & platform proficiency",
        "actions_30": "Pilot Copilot / Notion AI / Grammarly across daily tasks; measure time saved.",
        "actions_60": "Build 2 automations using Make, Zapier or a no-code AI platform; share with peers.",
        "actions_90": "Connect to one AI API (OpenAI, Claude, Gemini) via SDK; ship a small integrated tool.",
    },
    "usecases": {
        "title": "Spot & ship AI use cases",
        "actions_30": "Map 5 tasks in your role that AI could augment; rank them by impact × feasibility.",
        "actions_60": "Pilot the strongest use case end-to-end; track 2-3 metrics weekly.",
        "actions_90": "Build a business case for the pilot; pitch your sponsor for scaling.",
    },
    "responsible": {
        "title": "Own responsible AI in your work",
        "actions_30": "Review your org's responsible AI policy + one external framework (NIST AI RMF or EU AI Act).",
        "actions_60": "Apply a bias / risk checklist to every AI output you ship; document mitigations.",
        "actions_90": "Champion one governance practice (transparency, attribution, privacy) on your team.",
    },
    "projects": {
        "title": "Master AI project delivery",
        "actions_30": "Learn the AI project lifecycle; shadow one live AI project end-to-end.",
        "actions_60": "Bridge a business + technical team conversation; produce one PRD or scope doc.",
        "actions_90": "Define KPIs and a value-measurement plan; lead a sprint of execution on an AI initiative.",
    },
}


def get_roadmap_map(audience: str) -> dict:
    return ORG_ROADMAP if audience == "organization" else IND_ROADMAP

# i4SKILLS AIM — PRD (Living Document)

## Original Problem Statement
Build a SaaS product based on two PDFs (Indifour Consult's Digital & AI Maturity Assessment
Model + Business Strategy Roadmap), inspired by Correlation One's AIM Diagnostic. The product
must serve both industry professionals (enterprises) and individuals, with RBAC.

## Architecture
- **Frontend**: React 19 + React Router v7 + Tailwind + shadcn primitives + Recharts
- **Backend**: FastAPI + Motor (async MongoDB)
- **Auth**: JWT Bearer tokens (email + password, bcrypt), RBAC dependency
- **DB**: MongoDB (collections: users, organizations, responses)

## Roles
`super_admin`, `org_admin`, `consultant`, `employee`, `individual`

## Assessment Framework
- **Organizational AIM**: 6 dimensions × 5 Likert questions
  1. AI Strategy & Executive Alignment
  2. Data & Digital Infrastructure Readiness
  3. AI Adoption & Operational Integration
  4. Workforce Capability & Talent Readiness
  5. Culture, Innovation & Change Agility
  6. AI Impact & Value Realization
- **Individual**: 3 pillars × 5 questions (Capability, Mindset, Accountability)
- **Scoring**: each answer 1-5 → 0-100 dimension score → overall AIM Index
- **Stages** (org): Foundational / Emerging / Structured / Operational / Transformational
- **Stages** (ind): Foundational / Aware / Applied / Integrated / Champion

## What's Been Implemented (Feb 2026)
- JWT auth (register/login/me/logout) + role guard
- Super admin seeded on startup
- Organizational + Individual assessment templates (seeded in code)
- Take-assessment flow (multi-dimension, Likert, save & resume, submit)
- Results page: AIM Index, stage, radar chart, heatmap, peer benchmark bars, strengths, blockers, 30/60/90 roadmap, printable
- Dashboard (role-aware)
- Org panel: invite members, team heatmap, aggregate
- Super admin: users & orgs management, change role
- Consultant view: assigned orgs + submission drill-down
- Swiss high-contrast design (Chivo + IBM Plex Sans, cobalt #002FA7, rounded-none)

## Prioritized Backlog
- **P1**: Email-based invite flow (SendGrid/Resend) instead of temp passwords
- **P1**: Consultant assignment UI (super_admin screen to assign consultant → org)
- **P1**: Report export to PDF via browser print (basic done) → proper PDF endpoint
- **P2**: LLM-generated narrative roadmap (Claude Sonnet) as optional upgrade
- **P2**: Historical trend chart (track AIM Index over time for same org/individual)
- **P2**: Custom assessment builder for super_admin
- **P3**: Multi-tenant billing / Stripe subscription

## Next Actions
- Run testing subagent for end-to-end validation

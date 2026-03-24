# Suggestions: Building the Mission Control Superteam

_What we can give agents, what we already have, and what to build next._

---

## What We Have Today

### Template System

The template system is the core tool for agent specialization. When a board is created (or an agent is spawned), a `template_set` determines which markdown files are written into that agent's workspace. Templates control:

| File | What it does |
|------|-------------|
| `SOUL.md` | Core personality, principles, and vibe |
| `IDENTITY.md` | Role, communication style, background |
| `AGENTS.md` | Operational rules: startup sequence, role contract, chat protocol, execution loop |
| `HEARTBEAT.md` | Per-heartbeat checklist, pre-flight checks, role-specific loop, HEARTBEAT_OK conditions |
| `TOOLS.md` | Env vars, OpenAPI refresh, API discovery policy, local notes |
| `MEMORY.md` | Initial memory structure (lead gets delivery status template, worker gets knowledge scaffold) |
| `USER.md` | Human context scaffold |

### Current Templates

| ID | Name | Role | What makes them special |
|----|------|------|------------------------|
| `default` | Default | Generalist | Full operational machinery, no fixed personality |
| `david` | David 🎯 | Technical PM | PM-specific patterns (scoping, planning, comms), strong personality, knows how to unblock engineering |
| `felipe` | Felipe ⚡ | Frontend Engineer | Frontend quality bar (a11y, responsive, tested), component-first thinking, precise evidence style |

### Per-Agent Template Override

Agents now carry their own `template_set` field, independent of the board's. This means:
- A David board can spawn a Felipe for frontend work — Felipe gets his own workspace, not David's.
- A default board can spawn a typed specialist mid-mission.
- Two agents of different types can coexist on the same board, each with their own identity.

### Agent Creation Skill

`backend/templates/skills/agent_creation_skill.md` — a skill file that teaches lead agents:
- Which templates exist and when to use each
- How to call the create-agent API with `template_set`
- How name auto-population works
- Board spawn limits and retirement workflow

---

## What to Build Next

### New Agent Templates

These roles would immediately make teams more effective. Each needs a `backend/templates/custom/<id>/` directory with a `manifest.json` and the full set of `.j2` files.

---

#### `aria` — QA / Test Engineer 🔍
**Why:** Every engineering board needs quality coverage. A QA agent that lives and breathes the test suite, writes and runs tests, triages bugs, and enforces "definition of done" rigorously would be a force multiplier.

**Key personality traits:**
- Methodical, skeptical in a productive way, evidence-first
- Knows the difference between flaky and broken
- Writes clear bug reports with reproduction steps
- Won't let "it works on my machine" pass review

**Key template additions:**
- Test command runbook in TOOLS.md (unit, integration, e2e)
- Bug triage section in AGENTS.md
- Quality gate checklist in HEARTBEAT.md
- Test coverage notes in MEMORY.md

---

#### `marcos` — Backend / API Engineer 🔧
**Why:** Backend work has different rhythms and risks than frontend. A dedicated backend agent who thinks in schemas, migrations, API contracts, and observability would complement Felipe perfectly.

**Key personality traits:**
- Pragmatic, reliability-focused, thinks about failure modes
- Cares about backwards compatibility and migration safety
- Documents API changes clearly for frontend consumers
- Performance-aware without premature optimization

**Key template additions:**
- Migration safety checklist in AGENTS.md
- API contract change protocol (document, notify, version)
- Database query review habit in HEARTBEAT.md
- Schema decisions in MEMORY.md

---

#### `luna` — Data / Analytics Engineer 📊
**Why:** Data work has distinct tools, cadences, and risks. A Luna agent would own pipelines, dashboards, and data quality — with the patience for slow jobs and the rigor to catch silent failures.

**Key personality traits:**
- Patient with long-running jobs, paranoid about silent data corruption
- Documents assumptions and transformations
- Cares about data lineage and reproducibility
- Communicates findings with clear visualizations and plain-language summaries

**Key template additions:**
- Pipeline runbook in TOOLS.md
- Data quality checklist in HEARTBEAT.md
- Schema and transformation decisions in MEMORY.md

---

#### `alex` — DevOps / Infrastructure Engineer 🛠️
**Why:** Infra work is high-blast-radius and needs a different risk posture than feature work. Alex would own deployments, monitoring, and incident response — with strong habits around rollback and blast-radius assessment.

**Key personality traits:**
- Calm under pressure, thorough in post-mortems
- Always asks "what's the rollback plan?" before acting
- Documents runbooks and on-call procedures clearly
- Understands the difference between a deploy and a config change

**Key template additions:**
- Rollback-first principle baked into SOUL.md
- Deployment checklist in AGENTS.md
- Incident response protocol in HEARTBEAT.md
- Runbook section in MEMORY.md
- Strong "ask first" boundary for production changes

---

#### `sofia` — Technical Writer / Documentation Engineer 📝
**Why:** Documentation debt is real and most engineering agents don't prioritize it. Sofia would own API docs, READMEs, changelogs, and internal wikis — with a journalist's sense of audience and clarity.

**Key personality traits:**
- Audience-first: always asking "who is reading this and what do they need?"
- Precise language, zero jargon unless the audience expects it
- Knows the difference between reference docs and tutorials
- Treats outdated docs as bugs

**Key template additions:**
- Docs quality bar in AGENTS.md (accurate, tested, audience-appropriate)
- Changelog and API docs update checklist in HEARTBEAT.md

---

### New Skills (SKILL.md Files)

Skills are reusable operational procedures that live in `backend/templates/skills/` and can be distributed to agent workspaces. Unlike templates (which configure identity), skills configure *capabilities*.

| Skill file | What it teaches |
|------------|----------------|
| `agent_creation_skill.md` ✅ | How to spawn agents with the right template set |
| `board_onboarding_skill.md` | How a lead should initialize a new board: set objective, create initial task set, check board rules, configure max_agents |
| `task_decomposition_skill.md` | How to break a large goal into a sequenced task graph with dependencies, owners, and acceptance criteria |
| `approval_workflow_skill.md` | How to raise, track, and close approval requests; what to do if rejected |
| `escalation_skill.md` | When and how to escalate to humans: what triggers it, what format to use, where to post |
| `memory_consolidation_skill.md` | How and when to distill daily notes into MEMORY.md; what to keep vs prune |
| `incident_response_skill.md` | How to triage, coordinate, and close an incident across board agents |
| `api_change_skill.md` | Protocol for proposing, documenting, and coordinating API contract changes between frontend and backend agents |

---

### Template System Improvements

These are improvements to the template engine itself, not new templates:

#### 1. Per-Agent `identity_profile` Pre-population from Manifest
Currently, templates use fixed identity text. Adding `identity_profile` defaults to `manifest.json` would let the provisioning system auto-populate `identity_role`, `identity_emoji`, etc. when a template agent is spawned — making the default IDENTITY.md template work for named agents too.

#### 2. Template Composition / Inheritance
Allow a custom template to declare a `base` template and only override specific files. Example:
```json
{
  "base": "default",
  "templates": {
    "SOUL.md": "custom/aria/SOUL.md.j2"
  }
}
```
This would let new templates only define what's different, reducing duplication.

#### 3. Skill Auto-Distribution
Add a `skills` field to `manifest.json` listing which skill files to provision alongside the workspace files:
```json
{
  "skills": ["agent_creation_skill.md", "task_decomposition_skill.md"]
}
```
The provisioner would write these to `skills/` in the agent workspace.

#### 4. Board Template Inheritance
Allow a board to declare a `worker_template_set` that applies to all non-lead agents by default, separate from the lead's template. Example: a board with `template_set: "david"` for the lead could default new workers to `template_set: "felipe"` unless overridden at spawn time.

---

## The Dream Team Configuration

A well-staffed Mission Control team for a product engineering board might look like:

```
Board: "Product Sprint Q2"
├── Lead: David 🎯 (Technical PM — planning, coordination, stakeholder)
├── Felipe ⚡ (Frontend — React/Next.js, UI/UX)
├── Marcos 🔧 (Backend — API, migrations, data models)
├── Aria 🔍 (QA — test coverage, bug triage)
└── Sofia 📝 (Docs — API docs, changelog, README)
```

David breaks down the goal, assigns tasks, manages the delivery risk. The specialists execute in their lane. David unblocks cross-lane dependencies. Every agent knows their role and has workspace files written for it from day one.

This is what `template_set` makes possible.

---

## How to Add a New Template

1. Create `backend/templates/custom/<id>/` with `manifest.json` and all seven `.j2` files.
2. Register in `backend/app/services/openclaw/constants.py` under `CUSTOM_TEMPLATE_SETS`.
3. The template is immediately available in the `/boards/new` UI and via the agents API.
4. Update `agent_creation_skill.md` with the new entry so leads know about it.
5. Add to this document.

No restarts required if templates are mounted as a volume. A container rebuild is required if baked into the image.

---

_This document is a living planning artifact. Update it as the team grows._

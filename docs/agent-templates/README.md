# Agent Templates

Agent templates are the foundation of OpenClaw's personality system. They define how Claude agents think, what skills they have, and what their workspace looks like. This guide covers the complete template system.

---

## Overview

An agent template is a collection of Jinja2 template files and skill definitions that define:

1. **Persona**: Who is the agent? (IDENTITY.md, SOUL.md)
2. **Skills**: What can the agent do well? (SKILLS.md + skills/ subdirectory)
3. **Workspace**: What files and context does the agent work with? (AGENTS.md, TOOLS.md, MEMORY.md, USER.md)
4. **Heartbeat**: What's the agent's rhythm and cadence? (HEARTBEAT.md)

When you create a board with a template, the agent provisions with these files, reads them in a specific order, and uses them as persistent memory across sessions.

### Why Templates?

Templates solve several problems:

- **Consistency**: Every instance of "David the PM" has the same baseline approach
- **Persistence**: Session-to-session context is documented, not in fragile memory
- **Flexibility**: Teams can customize templates for their workflows
- **Onboarding**: New team members understand the agent's operating model quickly

---

## Template Structure

Each template lives in `backend/templates/custom/<agent_id>/` and contains:

```
backend/templates/custom/david/
├── manifest.json              # Template metadata and file mappings
├── IDENTITY.md.j2             # Agent persona (role, background, communication style)
├── SOUL.md.j2                 # Core principles and vibe
├── AGENTS.md.j2               # Workspace contract (how to operate, memory strategy)
├── TOOLS.md.j2                # API and tool configuration
├── HEARTBEAT.md.j2            # Cadence and rhythms
├── MEMORY.md.j2               # Long-term memory structure
├── USER.md.j2                 # User context (who the agent serves)
├── SKILLS.md.j2               # Available skills reference
└── skills/                     # Individual skill definitions
    ├── task-scoping/
    │   └── SKILL.md
    ├── stakeholder-comms/
    │   └── SKILL.md
    └── ... (more skills)
```

### manifest.json

Metadata and file mappings:

```json
{
  "name": "David",
  "id": "david",
  "description": "Technical Product Manager — your friendly PM with engineering chops",
  "emoji": "🎯",
  "role": "technical_product_manager",
  "templates": {
    "AGENTS.md": "AGENTS.md.j2",
    "SOUL.md": "SOUL.md.j2",
    "IDENTITY.md": "IDENTITY.md.j2",
    "TOOLS.md": "TOOLS.md.j2",
    "HEARTBEAT.md": "HEARTBEAT.md.j2",
    "MEMORY.md": "MEMORY.md.j2",
    "USER.md": "USER.md.j2",
    "SKILLS.md": "SKILLS.md.j2"
  },
  "skills": [
    "task-scoping",
    "stakeholder-comms",
    "technical-decisions",
    "agent-coordination",
    "quality-gates"
  ]
}
```

**Fields:**

- `name`: Display name
- `id`: Identifier (used in backend/constants.py and URLs)
- `description`: Short description for UI
- `emoji`: Visual identifier
- `role`: Role slug (lowercase, underscores) — used in frontend skill detection
- `templates`: Mapping of output filename → Jinja2 template file
- `skills`: Array of skill IDs (directory names in skills/ subdirectory)

---

## Template Files

### IDENTITY.md

**Purpose:** Agent persona — who you are, your background, how you communicate.

**Content:**

```markdown
# IDENTITY.md

## Core
- **Name:** {{ agent_name | default('David') }}
- **Agent ID:** {{ agent_id }}
- **Role:** [Agent role and expertise]
- **Communication Style:** [How you talk]
- **Emoji:** [Visual identifier]

## Purpose
[Your reason for existing — what you're optimizing for]

## Personality
- **Trait 1:** [Description]
- **Trait 2:** [Description]
- **Trait 3:** [Description]

## Communication Style
[How you approach conversations — tone, style, preferences]

## Background
[Years of experience, skills, relevant history]

## Board Context
[Current board, objective, role on board — templated from variables]
```

**Jinja2 Variables:**

- `{{ agent_name }}`: Agent name (defaults to "David", etc.)
- `{{ agent_id }}`: Agent identifier
- `{{ board_name }}`: Current board name (if set)
- `{{ board_objective }}`: Board objective (if set)
- `{{ board_type }}`: Board type (if set)
- `{{ is_lead }}`: Boolean — true if this agent is the board lead

**Lead-Specific Content:**

Use conditional blocks for lead-only content:

```jinja2
{% if is_lead %}
You own board coordination and delivery.
{% else %}
You execute assigned work.
{% endif %}
```

### SOUL.md

**Purpose:** Core principles, vibe, and stable identity.

**Content:** Similar to IDENTITY.md but focuses on inner principles:

```markdown
# SOUL.md — Who You Are

## Core Truths
- [Fundamental belief 1]
- [Fundamental belief 2]
- [Fundamental belief 3]

## Boundaries
- [What you won't do]
- [Where you need explicit approval]
- [What's off-limits]

## Vibe
[Overall personality and approach]
```

**Why both IDENTITY.md and SOUL.md?**

- **IDENTITY.md**: How others see you (external)
- **SOUL.md**: Who you are (internal)

Lead and non-lead versions can have different SOUL.md files (different responsibilities). IDENTITY.md can also vary.

### AGENTS.md

**Purpose:** Workspace contract — how the agent operates, memory strategy, role definitions.

**Content:**

```markdown
# AGENTS.md

## Every Session
Before doing anything else, read in this order:
1) SOUL.md
2) USER.md
3) memory/YYYY-MM-DD.md
4) MEMORY.md
5) SKILLS.md
6) IDENTITY.md
7) TOOLS.md
8) HEARTBEAT.md

## Memory
- **Daily notes:** memory/YYYY-MM-DD.md
- **Long-term:** MEMORY.md

## Role Contract
### Role
[What you own and are accountable for]

### Core Responsibility
[Your key job]
```

**Key Elements:**

- **Read order:** Which files to read in what sequence (establishes context priority)
- **Memory strategy:** Where to keep daily vs. long-term notes
- **Role definition:** What you own, how you operate, what you're accountable for

### TOOLS.md

**Purpose:** API, tool configuration, and local context.

**Content:**

```markdown
# TOOLS.md

- `BASE_URL={{ base_url }}`
- `AUTH_TOKEN={{ auth_token }}`
- `AGENT_NAME={{ agent_name }}`
- `AGENT_ID={{ agent_id }}`
- `BOARD_ID={{ board_id }}`
- `WORKSPACE_ROOT={{ workspace_root }}`

## OpenAPI Refresh
[Command to refresh API spec]

## API Source of Truth
- api/openapi.json
- api/{{ role_tag }}-operations.tsv

## Local Notes
[Team/domain-specific context goes here]
```

**Role Tags:**

- `agent-main`: For main/lead agents
- `agent-lead`: For board leads
- `agent-worker`: For worker agents

Each has access to operations tagged with their role. Use `x-llm-intent` and `x-when-to-use` to guide operation selection.

### HEARTBEAT.md

**Purpose:** Cadence and rhythms for the agent's work.

**Content:**

```markdown
# HEARTBEAT.md

## [Role] Heartbeat (Cadence)

**Frequency:** [Daily? Weekly?]

1. **[Check 1]** (time)
   - [What to check/do]

2. **[Check 2]** (time)
   - [What to check/do]

## Key Metrics
- [Metric 1]: How to track it
- [Metric 2]: How to track it

## Phase Rhythm
[If the work has phases, what's the rhythm for each?]

## Escalation Cadence
[When to escalate, how often]

## Win Recognition
[What counts as a win? How to celebrate progress?]
```

**Purpose:** Gives agents a sense of cadence and routine. Without heartbeat, agents operate purely reactively.

### MEMORY.md

**Purpose:** Long-term curated memory — the essence of important context.

**Content:**

```markdown
# MEMORY.md

## Who You're Serving
- Name, role, timeline, optimization criteria

## Current Objectives
- [Objective 1 and context]
- [Objective 2 and context]

## Key Decisions & Lessons
- [Lessons learned, patterns, what works]

## Constraints & Context
- [Real timeline, resource limits, team dynamics]

## Contacts & Context
- [Key people, how to reach them]

---

_Update this as you learn. Raw daily notes go in memory/YYYY-MM-DD.md._
```

**Philosophy:**

- **Curated, not raw**: Distilled essence, not session logs
- **Evergreen**: Information that's still relevant in 3 months
- **Actionable**: Not retrospectives, but learnings you apply

Daily session logs go in `memory/YYYY-MM-DD.md`. Over time, promote valuable patterns to MEMORY.md.

### USER.md

**Purpose:** Context about who the agent serves.

**Content:**

```markdown
# USER.md

## User Context
- Name, role, experience level
- Goals and constraints
- Preferences for communication, decision-making

## Current Work
- What are they trying to accomplish?
- Timeline and constraints
- Success criteria

## Communication Preferences
- Check-in cadence
- Communication style (direct? gentle? data-first?)
- Decision-making approach

## Board Context
[Current board, objective, type]
```

**Who fills this?**

The human (user) and the agent collaborate to fill this. The agent reads it each session to understand context.

### SKILLS.md

**Purpose:** Skill catalog and when to use them.

**Content:**

```markdown
# Skills — What I Load

## How Skills Work
Skills are markdown files with structured instructions.

## Available Skills

### [Skill Name]

**Trigger:** [When this skill activates]

**When to use:**
- [Scenario 1]
- [Scenario 2]

**What it covers:**
- [Topic 1]
- [Topic 2]

---

Skills are **soft enforcement** — they guide behavior, they don't gate it.
```

**Structure:**

Each skill has:

- **Trigger**: What problem/question makes this skill relevant?
- **When to use**: Specific scenarios
- **What it covers**: Topics and guidance

This is an index that points to detailed skill files in `skills/<skill-id>/SKILL.md`.

---

## Skills System

The skills system has two layers:

1. **SKILLS.md.j2**: Index of available skills, when to load them
2. **skills/<skill-id>/SKILL.md**: Detailed guidance for each skill

### Individual Skill Files

Located in `skills/<skill-name>/SKILL.md`:

```markdown
---
name: skill-name
description: One-liner about what this skill does
---

[Detailed guidance for this skill]

## When This Skill Activates

Triggers that make this skill relevant...

## Key Concepts

[Structured guidance using headers, bullet points, examples]

## Common Patterns

[Reusable approaches]

---

_Motivational closing statement_
```

**Format:**

- Frontmatter: name and description
- Structured guidance using headers (H2, H3)
- Tactical content: frameworks, checklists, templates
- Examples where helpful
- Motivational closing

**Soft Enforcement Model:**

Skills guide behavior; they don't gate it. If an agent's direct instructions conflict with a skill, the instructions win. Skills are tools, not rules.

---

## Available Templates

| ID | Name | Role | Description | Emoji | Skills |
|---|---|---|---|---|---|
| david | David | technical_product_manager | PM with engineering chops | 🎯 | Task scoping, stakeholder comms, technical decisions, coordination, quality gates |
| felipe | Felipe | frontend_engineer | React/Next.js specialist | ⚡ | Components, a11y, responsive, state mgmt, testing, CSS, delegation |
| jordan | Jordan | job_seeker_coach | Job search strategist | 💼 | Resume, interviews, strategy, LinkedIn, negotiation, networking |

---

## Creating a New Template

### Step 1: Create the Directory

```bash
mkdir -p backend/templates/custom/<agent_id>/skills/{skill-1,skill-2,skill-3}
```

### Step 2: Write manifest.json

```json
{
  "name": "[Agent Name]",
  "id": "[agent_id]",
  "description": "[One-liner]",
  "emoji": "[emoji]",
  "role": "[role_slug]",
  "templates": { ... },
  "skills": [ ... ]
}
```

### Step 3: Write Template Files

Create the 8 standard files (IDENTITY.md.j2, SOUL.md.j2, etc.) using existing templates as guides:

- Copy from david/ or felipe/ as a baseline
- Customize for your agent's persona and role
- Include lead-specific variations using {% if is_lead %}

### Step 4: Write Skill Files

For each skill in your skills array:

```bash
backend/templates/custom/<agent_id>/skills/<skill-id>/SKILL.md
```

Use the format from existing skills (resume-writing, interview-prep, etc.).

### Step 5: Register in constants.py

In `backend/app/services/openclaw/constants.py`, add to CUSTOM_TEMPLATE_SETS:

```python
CUSTOM_TEMPLATE_SETS = {
    "david": { ... },
    "felipe": { ... },
    "your_agent_id": {
        "name": "Your Agent",
        "description": "...",
        "emoji": "...",
        "templates": { ... },
    },
}
```

### Step 6: Update Frontend Skills

In `frontend/src/components/agents/AgentSkillsSection.tsx`, add to AGENT_SKILLS:

```typescript
your_role_slug: {
  "Skill 1": { emoji: "📌", description: "..." },
  "Skill 2": { emoji: "🎯", description: "..." },
  // ...
}
```

If there are lead-only skills, add their names to the filter on line ~116:

```typescript
name.toLowerCase().includes("your_lead_skill")
```

### Step 7: Test

1. Start the dev stack
2. Navigate to `/agent-templates` and verify your template appears
3. Create a board with your template
4. Verify the agent provisions with workspace files
5. View the agent detail page and verify skills render correctly

---

## Frontend Integration

### How AgentSkillsSection Works

The `AgentSkillsSection` component:

1. Reads the agent's `identity_profile.role`
2. Converts it to a role slug (lowercase, underscores)
3. Looks up skills in AGENT_SKILLS[role_slug]
4. Splits skills into "core" and "lead-only" based on keywords
5. Renders core skills always; lead-only skills only if `agent.is_board_lead === true`

### Adding a New Role

1. Add to AGENT_SKILLS in AgentSkillsSection.tsx:

```typescript
your_new_role: {
  "Skill 1": { emoji: "...", description: "..." },
  // ...
}
```

2. Update the lead skills filter if needed:

```typescript
name.toLowerCase().includes("your_lead_skill") ||
```

3. Test on the agent detail page

### Role Slug Conversion

The component converts roles like this:

- "Technical Product Manager" → "technical_product_manager"
- "Frontend Engineer" → "frontend_engineer"
- "Job Seeker Coach" → "job_seeker_coach"

Make sure your `role` in manifest.json matches this pattern (lowercase, underscores).

---

## Jinja2 Variables Reference

When templates are rendered, these variables are available:

**Agent Context:**

- `{{ agent_name }}`: Agent name
- `{{ agent_id }}`: Agent identifier
- `{{ is_board_lead }}`: Boolean — true if this is a board lead
- `{{ is_main_agent }}`: Boolean — true if this is the main agent

**Board Context:**

- `{{ board_name }}`: Board name
- `{{ board_id }}`: Board identifier
- `{{ board_objective }}`: Board objective/goal
- `{{ board_type }}`: Board type (e.g., "project", "search", "learning")

**API & Workspace:**

- `{{ base_url }}`: API base URL
- `{{ auth_token }}`: Authentication token
- `{{ workspace_root }}`: Workspace root directory
- `{{ workspace_path }}`: Workspace path (if set)

**User Context:**

- `{{ user_name }}`: Human user's name (if set)

**Conditional Blocks:**

```jinja2
{% if is_lead %}
  [Content only for leads]
{% else %}
  [Content only for workers]
{% endif %}

{% if board_name %}
  [Content if board name is defined]
{% endif %}
```

---

## Verification Checklist

When implementing a new template or updating existing ones:

- [ ] Template directory exists: `backend/templates/custom/<id>/`
- [ ] manifest.json is valid JSON with all required fields
- [ ] All 8 template files exist: IDENTITY.md.j2, SOUL.md.j2, etc.
- [ ] SKILLS.md.j2 references all skills in the skills/ directory
- [ ] Skill files exist: `skills/<skill-id>/SKILL.md` for each in manifest
- [ ] Template registered in constants.py CUSTOM_TEMPLATE_SETS
- [ ] Frontend AGENT_SKILLS includes the role_slug
- [ ] Lead skills filter includes any "(lead only)" skills
- [ ] Dev stack starts without errors
- [ ] Template appears in /agent-templates UI
- [ ] Board creation works with the template
- [ ] Agent detail page renders skills correctly

---

## Best Practices

### Persona Design

1. **Be specific**: Generic agents are forgettable. Give them strong personality.
2. **Consistency**: Keep communication style, background, and principles aligned.
3. **Believability**: Design people (and agents) that could actually work this way.

### Skills Design

1. **Useful, not comprehensive**: Skills should guide real work, not be academic.
2. **Actionable**: Provide frameworks, checklists, templates. Not philosophy alone.
3. **Scoped**: Each skill should have a clear trigger and domain.
4. **Iterative**: Skills improve over time as you learn what works.

### Memory Strategy

1. **Read order matters**: Establish context hierarchy (SOUL.md → USER.md → MEMORY.md)
2. **Separate daily from long-term**: Daily logs (memory/YYYY-MM-DD.md) vs. curated memory (MEMORY.md)
3. **Promote patterns**: When a lesson repeats, add it to MEMORY.md
4. **Write it down**: Text > brain. No mental notes.

### Templating

1. **Use conditionals wisely**: {% if is_lead %} for role-specific content
2. **Document variables**: Comment on what variables you expect
3. **Defaults**: Use {{ agent_name | default('David') }} for safety
4. **Escape where needed**: Use | escape if embedding user input

---

## Common Patterns

### Task Cadence

Establish a heartbeat for your agent:

```markdown
## Heartbeat (Daily)
1. **Standup** (morning): What happened? What's next?
2. **Check-in** (afternoon): Any blockers?
3. **Status** (EOD): One-liner progress

## Weekly Heartbeat (Friday)
- Full retrospective
- Plan next week
- Celebrate wins
```

### Escalation Protocols

Define when and how agents escalate:

```markdown
## Escalation
- **24 hours blocked**: Escalate immediately
- **Timeline at risk**: Escalate within 24 hours
- **Quality concern**: Escalate before merging
```

### Success Criteria

Make wins tangible:

```markdown
## What Success Looks Like
- [ ] Feature shipped to staging
- [ ] Tests pass locally and in CI
- [ ] Design review approved
- [ ] Peer code review approved
```

---

## Troubleshooting

### Template not showing in /agent-templates

- [ ] Registered in CUSTOM_TEMPLATE_SETS?
- [ ] manifest.json is valid JSON?
- [ ] All required fields in manifest.json?
- [ ] Dev stack restarted?

### Board creation fails with template

- [ ] All 8 template files exist?
- [ ] Template files are valid Jinja2?
- [ ] Variables in templates are defined?
- [ ] manifest.json templates mapping is correct?

### Skills not showing on agent detail page

- [ ] Role in manifest.json matches role_slug format (lowercase, underscores)?
- [ ] Role added to AGENT_SKILLS in AgentSkillsSection.tsx?
- [ ] Skills object is not empty?
- [ ] Dev stack restarted and frontend rebuilt?

### Lead-only skills not appearing

- [ ] Skill name includes "delegation", "board health", or "pipeline review"?
- [ ] Filter condition in AgentSkillsSection.tsx matches skill name?
- [ ] agent.is_board_lead is true?

---

## Resources

- **Existing Templates**: `backend/templates/custom/`
- **Constants**: `backend/app/services/openclaw/constants.py`
- **Frontend**: `frontend/src/components/agents/AgentSkillsSection.tsx`
- **Sample Skills**: `backend/templates/custom/david/skills/`

---

_Templates are the foundation of personality. Design them well, iterate boldly, and they'll make your agents unforgettable._

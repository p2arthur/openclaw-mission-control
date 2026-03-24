# SKILL: Agent Creation

_How to spawn the right agent with the right identity from the start._

---

## When to Use This Skill

Use this skill whenever you need to create a new agent on your board — whether spawning a specialist to handle a specific workstream, or requesting a typed agent like a frontend engineer or product manager.

---

## Core Concept: Template Sets

Every agent has a **template set** that controls the markdown files written into its workspace at provisioning time. This determines the agent's:
- Name (auto-populated from the template manifest)
- Personality and working style (SOUL.md)
- Role identity (IDENTITY.md)
- Operational knowledge (AGENTS.md, HEARTBEAT.md)
- Tool configuration (TOOLS.md)
- Memory structure (MEMORY.md)

If you do not specify a `template_set`, the agent gets the **default** template — a capable generalist, but without a named character.

If you specify a `template_set`, the agent gets that character's full configuration **and their name is set automatically**.

---

## Available Template Sets

| ID | Name | Role | Emoji | Best for |
|----|------|------|-------|----------|
| `default` | Default | Generalist | ⚙️ | General-purpose execution work |
| `david` | David | Technical Product Manager | 🎯 | Planning, prioritization, stakeholder communication, cross-team coordination |
| `felipe` | Felipe | Frontend Engineer | ⚡ | React/Next.js components, UI/UX implementation, accessibility, responsive design |

> **To see the current list at runtime:**
> ```bash
> curl -s "{{ base_url }}/api/v1/boards/templates" \
>   -H "X-Agent-Token: {{ auth_token }}"
> ```

---

## How to Create an Agent

### Step 1 — Decide what you need

Ask yourself:
- What workstream needs a dedicated agent?
- Does an existing template fit the role?
- If not, should this be a named template agent or a default agent with a custom identity profile?

Use a template agent when the work clearly matches a named character (PM, frontend, etc.).
Use a default agent with `identity_profile` when the role is project-specific and doesn't warrant a reusable template.

### Step 2 — Look up the create-agent endpoint

```bash
curl -fsS "{{ base_url }}/openapi.json" -o /tmp/openapi.json
jq -r '
  .paths | to_entries[] | .key as $path
  | .value | to_entries[]
  | select(.value.operationId == "create_agent_api_v1_agents_post")
  | "\(.key|ascii_upcase)\t\($path)"
' /tmp/openapi.json
```

### Step 3 — Spawn the agent

#### Named template agent (name auto-populated from manifest)

```bash
curl -s -X POST "{{ base_url }}/api/v1/agents" \
  -H "X-Agent-Token: {{ auth_token }}" \
  -H "Content-Type: application/json" \
  -d '{
    "board_id": "{{ board_id }}",
    "template_set": "felipe"
  }'
```

The agent will be named **Felipe** automatically, with Felipe's full workspace configuration.

#### Named template agent with explicit name override

```bash
curl -s -X POST "{{ base_url }}/api/v1/agents" \
  -H "X-Agent-Token: {{ auth_token }}" \
  -H "Content-Type: application/json" \
  -d '{
    "board_id": "{{ board_id }}",
    "name": "Felipe (UI Sprint)",
    "template_set": "felipe"
  }'
```

Use this when you need two agents of the same type on the same board (must have distinct names).

#### Default agent with custom identity profile

```bash
curl -s -X POST "{{ base_url }}/api/v1/agents" \
  -H "X-Agent-Token: {{ auth_token }}" \
  -H "Content-Type: application/json" \
  -d '{
    "board_id": "{{ board_id }}",
    "name": "QA Engineer",
    "identity_profile": {
      "role": "QA Engineer",
      "communication_style": "systematic, evidence-first",
      "emoji": "🔍",
      "purpose": "Own test coverage and bug triage for this board.",
      "personality": "Methodical, thorough, skeptical in a productive way."
    }
  }'
```

Use this for one-off specialists that don't warrant a permanent template.

---

## Naming Rules

- Agent names must be **unique within a board** and **unique within a gateway workspace**.
- If `template_set` is provided and `name` is omitted, the name comes from the template manifest.
- If neither is provided, the API returns a 422 error.
- For multiple agents of the same type: use descriptive suffixes (`Felipe (Auth)`, `Felipe (Dashboard)`).

---

## Spawn Limits

Boards have a `max_agents` rule that caps the number of non-lead agents. Check it before spawning:

```bash
curl -s "{{ base_url }}/api/v1/agent/boards/{{ board_id }}" \
  -H "X-Agent-Token: {{ auth_token }}" \
  | jq '.max_agents'
```

The current board limit is: `{{ board_rule_max_agents }}`

If the limit is reached, retire an agent that has completed its work before spawning a new one.

---

## Retiring an Agent

When a specialist is no longer needed, retire them to free up capacity:

```bash
# Look up the agent ID first
curl -s "{{ base_url }}/api/v1/agents?board_id={{ board_id }}" \
  -H "X-Agent-Token: {{ auth_token }}" \
  | jq '.items[] | {id, name, status}'

# Then retire
curl -s -X PATCH "{{ base_url }}/api/v1/agents/<AGENT_ID>" \
  -H "X-Agent-Token: {{ auth_token }}" \
  -H "Content-Type: application/json" \
  -d '{"status": "retired"}'
```

---

## Decision Guide

| Situation | Action |
|-----------|--------|
| Need a PM to plan and coordinate a workstream | Spawn `david` |
| Need a frontend engineer for UI work | Spawn `felipe` |
| Need a short-lived specialist for one task | Default agent + `identity_profile` |
| Board is near `max_agents` limit | Retire a completed agent first |
| Two agents of the same type needed | Use explicit `name` with a suffix |
| Not sure which template to use | Spawn default, upgrade template later via re-provision |

---

## After Spawning

1. **Assign tasks** — Assign the new agent to relevant `inbox` tasks immediately. Idle agents are wasted capacity.
2. **Record in MEMORY.md** — Note the agent, their role, and what workstream they own.
3. **Introduce in board chat** — Brief `@mention` so other agents know who's on the team.

---

_Keep this skill up to date as new templates are added._

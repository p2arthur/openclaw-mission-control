# Per-Agent Skills Implementation

## What Was Added

Added soft-enforcement skill system to David (PM) and Felipe (Frontend) agent templates.

## Files Changed

### New Files
- `backend/templates/custom/felipe/SKILLS.md.j2` — Frontend engineer skills (component architecture, a11y, responsive design, state management, testing, CSS/styling, delegation)
- `backend/templates/custom/david/SKILLS.md.j2` — PM skills (task scoping, stakeholder comms, technical decisions, agent coordination, quality gates, board health)

### Modified Files
- `backend/templates/custom/felipe/manifest.json` — Added `SKILLS.md` to templates
- `backend/templates/custom/felipe/AGENTS.md.j2` — Added SKILLS.md to session startup sequence (position 5)
- `backend/templates/custom/david/manifest.json` — Added `SKILLS.md` to templates
- `backend/templates/custom/david/AGENTS.md.j2` — Added SKILLS.md to session startup sequence (position 5)
- `backend/app/services/openclaw/constants.py` — Added SKILLS.md to CUSTOM_TEMPLATE_SETS for both agents

## How It Works

1. **Session Startup**: When an agent provisions, it reads SKILLS.md after MEMORY.md
2. **Skill Matching**: Agent checks task context against skill triggers
3. **Soft Enforcement**: Skills guide behavior but don't gate it — direct instructions win
4. **Extensible**: New skills can be added by creating `skills/<name>/SKILL.md` in the workspace

## Agent Skills

### Felipe (Frontend Engineer)
- Component Architecture
- Accessibility (a11y)
- Responsive Design
- State Management
- Testing
- CSS / Styling
- Delegation & Task Breakdown (lead only)

### David (Technical PM)
- Task Scoping & Planning
- Stakeholder Communication
- Technical Decision Records
- Agent Coordination
- Quality Gates & Review
- Board Health Monitoring (lead only)

## Next Steps (Future)

- Add SKILLS.md to default template set
- Create actual skill files in `skills/` directory with detailed instructions
- Consider hard enforcement: `skills` field on Agent model + provisioning injection
- Per-agent skill customization via manifest.json `skills` array

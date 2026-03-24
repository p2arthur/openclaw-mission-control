---
name: agent-coordination
description: Manage multi-agent workflows, delegation, cross-team dependencies, and conflict resolution across parallel efforts.
---

This skill guides coordination when work spans multiple agents or teams: spawning agents, assigning work, managing dependencies, resolving conflicts, and handing off context.

Coordination is the difference between parallelism (people working in parallel) and chaos (people stepping on each other).

## Delegation Clarity

When you assign work to an agent, be crystal clear on:

**Owner & Scope**
> "You're responsible for: user authentication form, email validation, error states, accessibility. NOT responsible for: backend API, password recovery (that's on [agent])."

**Success Criteria**
> "Done means: form works on mobile/tablet/desktop, passes accessibility audit (axe-core), all user interactions tested, integrates with API without modification."

**Deadline & Dependencies**
> "Due Friday EOD. Unblocked: design specs are finalized. Blocking: frontend integration work (waiting on your output). Depends on: backend API spec (should be ready by Wednesday)."

**Context & Access**
> "The design is in Figma: [link]. PR template is in CONTRIBUTING.md. Questions? Ping [person] for design, [person] for backend API."

**Escalation Path**
> "If you hit blockers, escalate to me within 24 hours. I'll help unblock. If you realize scope is wrong, say so early — better to replan than go silent."

## Parallel Workstreams

Identify what can run in parallel:

**Dependency-based sequencing**
```
Frontend component design
    ↓
Component API spec
    ├→ Frontend implementation  ✓ parallel
    └→ Backend API implementation  ✓ parallel
    ├→ Backend API tests
    └→ Frontend integration tests
        ↓
    End-to-end testing
```

**Strategy for speed**
1. Front-load high-uncertainty work (research spikes, prototypes)
2. Unblock maximum parallelism (agree on contracts early)
3. Put dependencies on the critical path, parallelism off the critical path

## Conflict Resolution

When agents disagree on approach, data wins over opinion:

**Gather evidence**
- What did you each try?
- What's the actual problem you're solving?
- What constraints matter most? (speed, reliability, cost, maintainability)

**Frame as a decision**
- Not "who's right" but "which approach meets our constraints better"
- Use ADR format (context, decision, trade-offs, consequences)

**Default resolution paths**
1. **One person owns the decision**: If this is clearly their domain, defer to them
2. **Data-driven**: Measure or prototype both approaches
3. **Escalate**: If unresolved and blocking, you make the call or involve stakeholders

**Example conflict**
> Agent A: "Let's use React Context for state management"
> Agent B: "No, let's use Redux"
>
> Not: "Who knows more about state management?"
> But: "What are we optimizing for? If simplicity and small bundle size, Context. If complex time-travel debugging and middleware, Redux. What does our app need?"

## Handoff Protocols

When work moves from one agent to another (or across teams):

**Context Transfer**
- What have you learned that's not in the code/docs?
- What surprised you? What would you do differently?
- What's still unclear or uncertain?
- Where did you get stuck and how did you solve it?

**Verification**
- Agent receiving the work reviews it and confirms understanding
- Test run together if possible (pairing on one task)
- Document any gaps or clarifications

**Example handoff**
> "I built the database schema and migrations. Before you run them, know:
>
> - Migration uses `IF NOT EXISTS` to be idempotent (learned this the hard way)
> - User table needs an index on (email, deleted_at) for fast lookups (ran into perf issues without it)
> - I couldn't get foreign key constraints to work with the soft-delete pattern; we settled on app-layer validation (see DECISION.md)
> - Run migrations in this order: 1-schema, 2-indices, 3-seed-data
> - Test on staging first; it'll take ~2 min on 1M rows
>
> Questions? I'm here."

## Agent Lifecycle

**Spawn**: When and why to start a new agent

- Work exceeds one person's capacity
- New skill domain needed (e.g., "we need a DevOps person for this infrastructure work")
- Parallel work streams need independent ownership
- You need specialized focus (e.g., dedicated testing agent)

Clear spawn decision:
> "Spinning up [Agent] to own database migrations and schema design. [Current agent] owns queries and performance. [Another agent] owns API surface. Handoff to production ops by Friday."

**Assign & Monitor**: Keep work flowing

- Daily or every-other-day check-ins
- Unblock within 24 hours
- Escalate early if trajectory looks bad
- Celebrate progress

**Retire**: When work is done

- Handoff knowledge to permanent team
- Document lessons learned
- Clear any context or tools
- Thank them

## Cross-Team Dependencies

When your work depends on another team:

**Get explicit agreements**
- When will you have output?
- What format? What's the contract? (API spec, data schema, documentation?)
- What happens if they slip? What's your fallback?

**Share context early**
- Give them design docs, requirements, acceptance criteria
- Loop them into key discussions
- Make them feel ownership, not just tasking

**Assume they're busy**
- Don't block on their timeline if you can prototype or mock
- Offer to write the spec or integration tests
- Remove friction; make it easy for them to say yes

**Escalate constructively**
> "We're aligned on the API contract, but delivery slipped from Friday to next Wednesday. That would slip our launch. Can we problem-solve together? Options: We accept the slip, or we descope, or we both add resources. What's feasible?"

## Skill Gaps

When coordination breaks down:
- **Unclear requirements**: Go back to scope-setting (Task Scoping skill)
- **Communication gaps**: Use Stakeholder Comms skill for status updates and blocker escalation
- **Architecture questions**: Use Technical Decisions skill to document choices
- **Quality questions**: Use Quality Gates skill to define what "done" means

---

_Coordination is how teams punch above their weight. Get it right and everything moves fast. 🎯_

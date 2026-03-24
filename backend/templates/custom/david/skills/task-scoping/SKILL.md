---
name: task-scoping
description: Break down vague requests into concrete, estimable tasks with clear acceptance criteria and risk identification.
---

This skill guides breakdown of features, epics, and vague requests into concrete, independently executable tasks that can be estimated, assigned, and verified.

The user provides a feature request, epic, or broad requirement. You break it down into sequenced tasks, identify dependencies and risks, and write clear acceptance criteria.

## Task Breakdown Framework

Before tasking, understand the problem:
- **Context**: What problem does this solve? For whom?
- **Scope boundaries**: What's in/out of scope?
- **Constraints**: Timeline, technical limits, dependencies

Then decompose:

### INVEST Criteria

Each task should be:
- **Independent**: Can be worked in isolation
- **Negotiable**: Details can be discussed/changed
- **Valuable**: Delivers user or system value
- **Estimable**: Team can size it (2-4 hours, 1 day, multi-day)
- **Small**: Done in one sprint/iteration
- **Testable**: Clear acceptance criteria

### Task Granularity

Target **2-4 hour chunks** for optimal assignment and parallelization:
- Too small: overhead, context switching, merge conflicts
- Too large: estimation uncertainty, hard to parallelize, risk concentration
- Sweet spot: one person, one focused effort, one morning or afternoon

### Dependency Graphing

Identify:
- **Blocking dependencies**: Task B can't start until A is done
- **Informational dependencies**: Task B benefits from knowing about A
- **Parallel opportunities**: Tasks that can run simultaneously
- **Integration points**: Where work converges

Sequence to:
1. Unblock as many parallel threads as possible
2. Put highest-risk items early so you learn fast
3. Front-load foundational work (schema, API contracts) before implementations

### Acceptance Criteria Formats

**Format 1 - Given/When/Then (Behavioral)**
```
Given [precondition]
When [user action]
Then [expected outcome]
```

**Format 2 - Checklist (Structural)**
```
- [ ] API endpoint returns 200 with expected schema
- [ ] Frontend form validates input before submit
- [ ] Error messages are user-friendly
- [ ] Tests cover happy path + 2 error cases
```

**Format 3 - Specification (Technical)**
```
- Database migration creates users table with columns: id, email, created_at
- API error responses follow RFC 7807 (application/problem+json)
- Search returns results within 500ms for 1M records
```

Use the format that's clearest for your context.

### Risk Identification

For each task or dependency, flag:
- **Technical risks**: Unknown APIs, new frameworks, performance unknowns
- **Integration risks**: Complex interactions with existing systems
- **Timeline risks**: Tight deadlines, dependent on external teams
- **Scope creep**: Poorly bounded requirements

For each risk:
- Assess **impact** (task delayed? project delayed? code quality drops?)
- Propose **mitigation** (research spike? prototype? early integration test?)

### Estimation Approach

Use task granularity as your first signal:
- **2-4 hours**: High confidence (small, isolated, similar work done before)
- **1 day**: Medium confidence (straightforward, but some unknowns)
- **Multi-day**: Low confidence (complex, new, dependencies unclear)

For uncertain estimates, propose a research spike or prototype task to reduce uncertainty before committing to a full implementation task.

## Common Breakdown Patterns

**Feature → Epics → User Stories → Tasks**
- Feature: "User authentication"
- Epics: "Login flow", "Session management", "OAuth integration"
- Stories: "User can log in with email", "Session persists across browser reload"
- Tasks: "Create login form component", "Add email validation", "Write login endpoint test"

**Infrastructure → API → Frontend Integration**
- Database schema and migrations
- API endpoints (contracts before implementation)
- Frontend components and forms
- End-to-end testing

**Bug fixes → Root cause → Implementation → Verification**
- Reproduction steps isolated
- Root cause identified (with evidence: logs, profiler output)
- Fix implemented and tested
- Regression test added

## Scope Creep Detection

Red flags:
- Acceptance criteria growing during implementation (mid-task scope change)
- Tasks bundling multiple independent features
- Vague criteria like "improve performance" or "make it better"
- Missing information about constraints or dependencies

When you spot scope creep:
1. Document what's actually in scope right now
2. Separate out the extra work as new tasks
3. Get agreement on new scope before continuing

## Skill Gaps

When breakdown becomes difficult:
- Requirements are too vague → demand clarification (problem statement, user stories, acceptance criteria)
- Technical approach unclear → propose a research/design spike
- Too many dependencies → loop in Agent Coordination skill
- Quality standards unclear → loop in Quality Gates skill

---

_Breaking down big ideas into shipable pieces. That's what planning is for. 🎯_

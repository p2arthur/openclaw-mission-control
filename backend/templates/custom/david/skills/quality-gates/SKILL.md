---
name: quality-gates
description: Enforce definition-of-done standards, verify work against acceptance criteria, and manage scope creep through quality checkpoints.
---

This skill guides quality verification: checking work against acceptance criteria, enforcing standards before shipping, and ensuring scope doesn't drift mid-project.

Quality gates catch problems early when they're cheap to fix, not late when they're expensive.

## Definition of Done

Create a checklist for "done". Different teams might have different standards, but make it explicit:

**Example: Feature is Done when**
- [ ] Code written and tested (unit + integration tests)
- [ ] Acceptance criteria verified (manual testing against each criterion)
- [ ] Code reviewed (peer review, 1+ approval)
- [ ] Documentation updated (API docs, README, user guides if applicable)
- [ ] Performance verified (no regressions, load test if applicable)
- [ ] Accessibility verified (WCAG 2.1 AA, tested with keyboard + screen reader)
- [ ] Security review (no new vulnerabilities, secrets not in code, SQL injection protected, etc.)
- [ ] Merged to main and deployed to staging (or ready to deploy)

**Example: Bug Fix is Done when**
- [ ] Root cause identified (with evidence: logs, profiler output, code inspection)
- [ ] Fix implemented and tested
- [ ] Regression test added (so it doesn't break again)
- [ ] Behavior verified in staging or production (depending on risk)

**Example: Release is Done when**
- [ ] All planned work merged
- [ ] Smoke tests pass
- [ ] Performance metrics checked (no regressions)
- [ ] Rollback plan documented
- [ ] Stakeholders notified (ship announcement, deployment notes)

Make your Definition of Done visible and reference it in every review. When someone says "this isn't done", point to the checklist.

## Acceptance Criteria Verification

For each task, verify against acceptance criteria:

**Format: Given/When/Then**
```
Given a user is on the login form
When they enter an invalid email and click submit
Then an error message "Please enter a valid email" appears and form doesn't submit
```

Verification:
- [ ] User enters invalid email (e.g., "not-an-email")
- [ ] Error message appears exactly as specified
- [ ] Form state unchanged (form doesn't clear or submit)
- [ ] Error message is readable (accessible, visible, clear)
- [ ] Tested on desktop and mobile

**Format: Checklist**
```
- API endpoint returns 200 with expected schema
- Response time < 100ms
- Handles concurrent requests (no race conditions)
```

Verification:
- [ ] Call endpoint with valid input, get 200 response
- [ ] Response has all required fields in correct format
- [ ] Load test with 100 concurrent requests, all succeed
- [ ] Timing logged and verified < 100ms

**Format: Specification**
```
Database migration creates users table with:
- id (UUID primary key)
- email (text, unique, not null)
- created_at (timestamp, defaults to now)
- updated_at (timestamp, defaults to now)
```

Verification:
- [ ] Migration ran without errors
- [ ] Table exists with correct schema
- [ ] Constraints enforced (unique on email, not null)
- [ ] Defaults work (new row gets created_at = now)

## Scope Creep Detection

Red flags during development:

- Acceptance criteria growing mid-task (e.g., "oh, we also need X")
- New feature requests that should have been separate tasks
- "While I'm at it" implementations (refactoring, nice-to-haves bundled with the main task)
- Time spent 2x longer than estimated with no clear reason

When scope creep happens:

**1. Call it out early**
> "I'm noticing we've added validation, error recovery, AND analytics to a task that was supposed to be 'add login button'. That's 3x the scope. We need to re-plan."

**2. Separate work**
> "Let's do: (1) login button [today], (2) validation [later], (3) analytics [later]. What's blocking shipping (1) today?"

**3. Get stakeholder decision**
- Extend deadline?
- Cut scope (keep only the highest-priority work)?
- Add resources?
- Do some of it less thoroughly?

**4. Document the decision**
> "We're shipping login button without form validation this iteration. Validation moves to next sprint. Agreed with [stakeholder]."

## Code Review Quality Gates

Good code reviews catch:
- Logic errors and edge cases
- Missing tests or inadequate test coverage
- Performance regressions
- Security vulnerabilities
- Style violations or code readability issues

Bad code reviews are rubber-stamp approvals or endless nitpicking.

**Effective code review checklist**
- [ ] Functionality: Does the code do what it's supposed to?
- [ ] Edge cases: What happens with empty input? Large input? Invalid input?
- [ ] Tests: Are there tests? Do they cover the happy path and error cases?
- [ ] Performance: Any obvious inefficiencies? N+1 queries? Unnecessary recomputation?
- [ ] Security: Any injection vulnerabilities? Unvalidated input? Secrets in code?
- [ ] Clarity: Can someone unfamiliar with this code understand it? Good variable names? Comments where helpful?

**Review tone**
- Ask questions, don't demand: "What happens if X?" not "You didn't handle X."
- Distinguish blocking issues from nice-to-haves
- Approve + suggest: Approve the PR while requesting improvements on the next one if not critical

## Testing Quality Gates

Before shipping, verify test coverage:

**Unit tests**
- Core logic paths covered (happy path + main error cases)
- Edge cases tested (empty input, boundary values, null/undefined)
- No redundant tests

**Integration tests**
- API endpoints work end-to-end
- Database reads/writes work
- Error handling works (bad input, missing resources, service failures)

**End-to-end tests**
- Key user workflows work in the actual application
- Common errors are caught and communicated

**Manual testing**
- Desktop and mobile? ✓
- Different browsers? ✓
- Performance acceptable? ✓
- Accessibility works? ✓

You don't need 100% test coverage. You need high coverage of risky/complex code and user-facing paths. Low-coverage acceptable for simple utilities and glue code.

## Escalation & Blockers

If work doesn't meet Definition of Done:

**Check blockers first**
> "This doesn't pass acceptance criteria. Are you blocked? Do you need help?"

**Offer support, not blame**
- Help debug failing tests
- Pair on tricky parts
- Clarify confusing requirements

**Set expectations**
> "This needs to meet our DoD before I can approve. Let's unblock this — what do you need?"

**Accept nothing half-done**
- Don't merge incomplete work "we'll finish it later"
- Don't approve work that doesn't meet criteria
- Quality gates protect the whole team

## Skill Gaps

When quality enforcement is hard:
- **Vague acceptance criteria**: Use Task Scoping skill to write clearer criteria
- **Disagreement on quality standard**: Use Technical Decisions skill to document your DoD
- **Time pressure**: Use Stakeholder Comms skill to negotiate realistic scope
- **Testing gaps**: Loop in testing specialist or training

---

_Quality gates aren't busywork. They're how you ship fast without breaking things. 🎯_

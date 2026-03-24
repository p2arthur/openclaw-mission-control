---
name: technical-decisions
description: Document architecture decisions and trade-offs using Architecture Decision Records (ADRs) for future reference and team alignment.
---

This skill guides documentation of significant technical decisions: why you chose approach A over B, what trade-offs you made, and what constraints shaped the decision.

Good decision documentation saves future teams from re-debating settled questions and provides context for when constraints change.

## When to Document Decisions

Document a decision if:
- **It's not obvious why**: Someone competent could reasonably choose differently
- **It's hard to change later**: Architectural decisions, major tech choices, API contracts
- **It affects multiple people**: Cross-team, affects future development, shapes how code gets written
- **You might question it in 6 months**: If you or someone else might re-open this question, document it now

Don't document:
- Implementation details (how you built it, not why you chose the approach)
- Reversible choices (if you can change it in an afternoon, you probably don't need an ADR)
- Things already encoded in code or well-known team standards

## ADR Format

**Title**: One sentence, clear and specific

> _Use PostgreSQL for user session storage instead of Redis_

**Status**: Proposed / Accepted / Deprecated

> Current status: Accepted (May 2024)

**Context**: The situation that made this decision necessary

> User sessions currently stored in-memory, which doesn't work across multiple app instances. We need a distributed session store. Candidates: PostgreSQL (durable, slow), Redis (fast, not durable), DynamoDB (AWS-only, expensive).

**Decision**: The choice and reasoning

> We'll use PostgreSQL. Reasoning:
>
> - Durability: Sessions survive server restarts; critical for reliability
> - Cost: We already pay for Postgres; Redis/DynamoDB add operational cost
> - Complexity: PostgreSQL fits our existing stack; no new infra to maintain
> - Trade-off accepted: Slightly slower session lookups (10-50ms) vs Redis (1-5ms). Not expected to be a bottleneck; can cache at app layer if needed

**Consequences**: What becomes easier, what becomes harder

> **Easier:**
> - Session recovery after crashes
> - Audit trail of session activity (database logs)
> - No new dependency to operate
>
> **Harder:**
> - Session lookups require DB queries; need caching layer for high-traffic paths
> - Horizontal scaling requires connection pooling strategy
> - Session cleanup requires scheduled job (vs Redis TTL)

**Alternatives considered**: What you rejected and why

> - Redis: Fast, but we'd need to handle durability ourselves (RDB + WAL), and it's another production dependency
> - DynamoDB: Managed, but vendor lock-in and cost higher than Postgres for our scale

## Common Decision Categories

**Architecture Decisions**
- Monolith vs microservices
- Synchronous vs event-driven communication
- Caching strategy (where, how, invalidation)
- Database choices and schema patterns

**Technology Choices**
- Language / framework for new service
- API design (REST, GraphQL, gRPC)
- Frontend state management library
- Authentication / authorization system

**Code Pattern Decisions**
- Error handling approach
- Logging strategy and levels
- Testing approach (unit vs integration, mocking strategy)
- Code review and merge process

## When Decisions Change

Decision no longer valid? Mark it Deprecated and link to the new decision:

> **Status**: Deprecated (March 2025)
>
> Replaced by ADR-0023: Use DynamoDB for user sessions (cost structure changed with new pricing tier).

## Decision Lifecycle

**1. Recognize the decision point**
- Someone proposes different approaches
- You realize there's no clear standard
- A constraint changes (timeline, cost, team composition)

**2. Gather context**
- What's the actual problem?
- Who does this affect?
- What are the real constraints? (timeline, cost, team skill, scale requirements)

**3. Brainstorm alternatives**
- At least 3 options, even if some are obviously bad
- For each: pros, cons, unknowns

**4. Decide**
- Make a call based on constraints and trade-offs
- Get stakeholder buy-in if it affects multiple teams
- Document it

**5. Implement and revisit**
- Monitor whether the decision is working
- Revisit if constraints change significantly

## Documenting Trade-Offs

Be explicit about what you're trading off:

**Bad**
> We chose approach X because it's better.

**Good**
> We chose approach X because it optimizes for reliability and simplicity, accepting slower query performance (10-50ms lookups vs 1-5ms). This trade-off makes sense at our current scale; we'll revisit if throughput becomes a bottleneck.

Trade-offs show judgment and enable smarter decisions when situations change.

## Shared Reference

Store ADRs in your project (e.g., `docs/adr/`), not just team memory:
- Easier to find
- Shows up in onboarding
- Creates accountability (writing forces you to think harder)
- Version control tracks when decisions changed

Reference ADRs in code comments and PRs:
```
// See ADR-0012: Use Postgres for session storage
const session = await db.query('SELECT * FROM sessions WHERE id = ?', [sessionId])
```

This creates a trail from implementation back to decision rationale.

## Skill Gaps

When documenting is hard:
- **Constraint unclear**: Go back and ask "what's the actual constraint we're optimizing for?"
- **Too many trade-offs**: Pick the top 2-3; you don't need to document every nuance
- **Decision feels obvious**: Write it down anyway; "obvious" to you might not be obvious to someone else in 6 months

---

_Good decisions documented are good decisions that stick. Future you will thank present you. 🎯_

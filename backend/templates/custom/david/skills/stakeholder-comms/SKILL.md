---
name: stakeholder-comms
description: Write clear status updates, escalate blockers effectively, and navigate scope negotiations with stakeholders.
---

This skill guides communication with humans — status updates, blocker escalation, scope negotiation, demo prep, and difficult conversations.

Effective communication reduces surprises, builds trust, and keeps projects aligned. Poor communication tanks momentum even when work is on track.

## Status Update Structure

Write status updates **every day or whenever context changes**. Use this structure:

**What's Done This Cycle**
- 2-3 bullet points of tangible progress
- Be specific: "Added login form component" not "worked on auth"
- Include blockers that got unblocked

**What's Next (This Cycle)**
- 2-3 items in priority order
- What are we shipping next?

**Blockers (if any)**
- Each blocker needs: what's blocked, impact, why we're stuck, what we need to proceed
- Severity signal: "Blocking X" (high), "Slowing down X" (medium), "Watch: X" (low)

**Examples**

Good status update:
> **Done**: Added user authentication form with email validation. Wrote integration tests for login flow. Unblocked frontend work.
>
> **Next**: Implement session token refresh, add logout button, create password recovery flow.
>
> **Blocker (high)**: Database schema for user sessions not approved yet. Blocking session token implementation. Need sign-off from PM by EOD Thursday or we'll slip the launch.

Weak status update:
> Working on auth stuff. Should be done soon. Waiting on DB.

## Blocker Escalation

Use this format for escalation:

**Problem** (what specifically is blocked?)
> Login form can't be tested without user API endpoint

**Impact** (what does this delay or prevent?)
> Frontend testing stalled. 2 people waiting. If unblocked by Friday we ship login on schedule; if not, we slip 3 days.

**Ask** (what do you need, specifically?)
> Need API endpoint spec or mock by Wednesday EOD so we can write integration tests in parallel.

**Timeline** (when do you need the answer?)
> Ping me by Wednesday 10am so I can replan if needed.

## Scope Negotiation

When scope pressure hits (tight deadline, new requirements, uncertain work):

**Validate the constraint**
- Is the deadline real or negotiable?
- Is the requirement core or nice-to-have?
- What's the actual problem we're solving?

**Propose alternatives**
- Ship 80% now, 20% later
- Ship with fewer features but higher quality
- Add more people (if it helps; often doesn't)
- Extend timeline

**Frame as trade-offs, not refusals**
- Bad: "We can't do that"
- Good: "We can ship this by Friday with features A+B, or by Monday with A+B+C. What's the priority?"

**Get explicit agreement**
- Document what's in/out of scope
- Get sign-off from the decision-maker
- Reference it when priorities shift mid-project

## Demo Storytelling

Demos aren't feature dumps; they're narrative arcs that show **problem → solution → value**.

**Hook (30 seconds)**
> "Every time we onboard a new user, we send them an email. But 60% don't click it within 24 hours. So we built something different."

**Show the Problem (1-2 minutes)**
- Show the old flow or pain point
- Maybe a user story or complaint
- Make people feel the friction

**Show the Solution (2-3 minutes)**
- Walk through the new experience
- Click buttons, see results
- Make it tangible and clear

**Show the Impact (1-2 minutes)**
- Metrics if available (conversion up 15%, time reduced from 5 min to 2 min)
- User feedback or testimonial
- Business outcome (revenue, retention, cost saved)

**Call to Action (< 1 minute)**
- What do you want people to do next?
- Feedback? Testing? Rollout decision?
- Specific ask (not vague "let me know what you think")

## Difficult Conversations

When you need to say "no", push back, or deliver bad news:

**Start with alignment**
> "I want to make sure we ship something great and on time. Can I walk through where I'm seeing risk?"

**Be data-driven**
- Estimation based on similar work: "Last similar task took 3 days"
- Blockers with evidence: "We're waiting on X, which hasn't been decided"
- Capacity math: "We have 10 days and 15 days of work"

**Offer options, not excuses**
- Option 1: Ship by Friday with features A+B
- Option 2: Ship by Monday with A+B+C
- Option 3: Add one more person (here's what changes)

**Default to transparency**
- If you're uncertain, say so and propose a spike
- If you've failed to estimate before, acknowledge it
- If you don't know the answer, find out by a specific time

## Tone & Trust

Your tone matters as much as your content:

- **Collaborative**: You're on the same team, working toward shared goals
- **Honest**: Admit mistakes, say what you actually think, not what people want to hear
- **Decisive**: When decision-time comes, make the call or clearly name what's missing to decide
- **Calm**: Even when stressed, keep the tone level and professional

People trust you when:
- You do what you say you'll do
- You communicate early, not when surprises hit
- You own your mistakes
- You help them win, not just yourself

---

_Good comms is how teams stay aligned and move fast. Write it, send it, follow up. 🎯_

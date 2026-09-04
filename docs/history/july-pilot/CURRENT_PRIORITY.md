# AtoEnglish current priority

> **Document status:** historical; superseded and retained for provenance
> **Governing authority:** [constitution](../../../.specify/memory/constitution.md); it wins on conflict

**Updated:** 2026-07-24  
**Owner:** Thunderkill016  
**Primary roadmap:** GitHub issue #20

## North star

Prove that one Vietnamese adult beginner can follow a coherent 28-day, 10–15 minute-per-day journey and improve a practical work-speaking performance.

Everything else is secondary until the repository can support and measure that journey.

## Current phase

**Phase: make AtoEnglish safe and legible for AI-assisted development, then implement the first gold lesson.**

The repository already has enough application, authentication, assessment, analytics, database, and testing infrastructure for bounded curriculum work. The immediate risk is not missing platform capability. It is allowing agents to choose work that does not serve the pilot outcome.

## Ordered queue

### 1. Product and agent truth — in progress

Establish repository-owned rules that every agent can read before proposing work:

- `AGENTS.md`;
- `PRODUCT_TRUTH.md`;
- this current-priority document;
- `DO_NOT_BUILD.md`;
- archived `../agent/AGENT_PLAN.md` and `../agent/AGENT_BACKLOG.md`.

**Done when:** the repository has one discoverable product direction, stale cleanup plans no longer select work, and every future task must show how it serves the current priority.

### 2. One verification entry point — next

Create the smallest repository-owned verification wrapper or manifest that maps a changed surface to the checks already available.

Initial goal:

- preserve existing commands rather than inventing a new CI system;
- support a focused curriculum slice first;
- report which checks ran, passed, failed, or were unavailable;
- distinguish technical checks from manual product review;
- make the result usable by a coding agent and by the owner.

This task must not change product behavior.

### 3. Gold Day 1 lesson — after verification entry point

Implement the preferred Day 1 design from `28-day-speaking-journey-contract.md`.

Day 1 should cover only:

- greeting;
- name;
- spelling a Vietnamese name;
- one lightweight request to repeat;
- one final spoken output using name and spelling.

It must fit 10–15 minutes and must not absorb role, company, responsibility, all five questions, or full repair training.

Expected scope:

- `src/lib/data/units/unitA01.ts`;
- direct targeted tests;
- the smallest relevant lesson smoke assertion.

Explicitly out of scope:

- authentication;
- database and RLS;
- analytics infrastructure;
- XP, streak, league, and FSRS rules;
- major `UnitTemplate` refactor;
- unrelated units.

### 4. First-week journey — later

After Day 1 is proven coherent, implement Days 2–7 as separate bounded outcomes and add checkpoint 1.

Do not build all 28 days in one pull request.

### 5. Pilot operations and learner evidence

Recruit target learners, run baseline assessment, sell or manually administer the initial pilot, observe failure points, and build only repeated P0 blockers.

## Decisions already completed

- `/login` metadata defect was fixed.
- The pilot promise was aligned across the main funnel.
- Baseline and final speaking assessment plus rubric were defined.
- Minimal privacy-bounded pilot analytics were added and recovered correctly.
- Supabase security findings were hardened.
- The 28-day journey contract and Day 1 boundary were defined.

Do not reopen these decisions without new evidence.

## Work selection rule

A proposed task may enter the active queue only when it does at least one of the following:

1. directly advances the ordered queue above;
2. fixes a production defect blocking the pilot journey;
3. fixes a security, privacy, or data-integrity defect;
4. removes a repeated development blocker observed in at least two real AtoEnglish tasks.

Every proposal must name the learner, product, or development blocker it resolves.

## Time allocation

Until the first pilot is ready:

- 80–90% of effort should improve AtoEnglish and the pilot journey;
- no more than 10–20% should improve CycleWarden or development tooling;
- tooling work must be justified by a current AtoEnglish blocker.

## Exit criteria for this phase

This phase is complete when the owner can take one approved AtoEnglish task through:

```text
current priority
→ bounded task contract
→ approved scope
→ coding agent implementation
→ technical and product checks
→ understandable review summary
→ draft pull request
```

without writing an ad hoc manifest, losing product context, changing unrelated systems, or automatically merging or deploying.

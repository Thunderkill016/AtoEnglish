# Nếp Session Planner V1

> **Document status:** reference
> **Governing authority:** [constitution](../../.specify/memory/constitution.md); it wins on conflict

Status: deterministic product policy for engineering validation. **Not a validated mastery model and not an efficacy claim.**

## Why this exists

AtoEnglish now has immutable attempts, evidence events and rebuildable learner skill state. The next job is to stop treating a fixed lesson list as the learning policy.

Session Planner V1 answers a narrower question:

> Given the practice opportunities the product can actually serve and the learner state we currently have, which opportunities should be considered next?

It does **not** generate lesson content, change FSRS, score pronunciation, or train a reinforcement-learning policy.

## Inputs

Each plannable opportunity declares:

- stable candidate ID;
- exact target ID;
- one low-level evidence type (`recognition`, `retrieval`, `listening`, `production`, `repair`, `transfer`, `retention`);
- prerequisite target IDs;
- product importance weight;
- optional transfer-value weight;
- metadata needed by the content/lesson layer.

The planner also receives:

- current `LearnerSkillState` snapshots;
- recent target/candidate history;
- requested session size;
- an explicit clock value for deterministic tests/replays.

## Hard gates

V1 refuses to schedule an opportunity when:

1. a declared prerequisite has not reached the configured readiness floor;
2. transfer is requested before the same target has prior production state above the configured floor;
3. retention is requested for a target with zero prior evidence;
4. the same target already reached the per-session opportunity cap.

These thresholds are **product inference**. They are intentionally centralized in `SessionPlannerConfig` so pilot data can change them without pretending they are research constants.

Database evidence invariants remain authoritative. Planner eligibility cannot manufacture evidence that the Attempt → Evidence layer would reject.

## Ranking policy

Eligible candidates receive an explainable score composed from:

- current skill gap for the requested evidence type;
- cold-start bonus that favors lower-support entry modes before harder productive/transfer modes;
- staleness of the target's last evidence;
- product importance;
- transfer value;
- recent-target penalty;
- recent-candidate penalty;
- in-session repetition penalty.

The score is a **ranking score only**. It must never be displayed or described as a probability that the learner has mastered the skill.

Ties are deterministic: evidence-type order, then stable candidate ID.

## Anti-repetition behavior

Repeated lessons cannot be solved only by text deduplication. Planner V1 penalizes recent target/candidate exposure and caps repeated target selection inside one session.

This works at the semantic target level, so newly generated exercise objects cannot bypass repetition control merely by having different IDs or wording.

The current V1 implementation still needs richer persisted recent-history queries before this policy is connected to the production session route.

## Nếp catalog compilation

`src/lib/nep/session-catalog.v1.ts` compiles only evidence-bearing actions from the explicit Nếp lesson contract.

For the first-meeting slice:

- comprehension → `recognition / CAP-002`;
- retrieval → `retrieval / CAP-002`;
- independent response → `production / CAP-002`;
- repair → `repair / CAP-003`;
- changed-context task → `transfer / CAP-002`.

The supported retry is omitted because its contract says `evidenceType: null`. Feedback/reveal steps are also omitted: they belong inside the pedagogical flow, not in mastery scheduling.

## What V1 deliberately does not do

- no contextual bandit or reinforcement learning;
- no learned weights;
- no claim that learner-state values are calibrated probabilities;
- no direct production database query yet;
- no replacement of the internal ordered flow of a lesson mission;
- no automatic unlock of capabilities for which the product has no servable lesson/task catalog;
- no acoustic pronunciation assessment.

## Next integration boundary

Before Session Planner controls the learner-facing route, add a server read boundary that returns only the planner inputs needed for the authenticated learner:

1. learner skill states for servable targets;
2. recent semantic target/candidate history;
3. due FSRS review pressure where vocabulary items participate in the same session;
4. catalog availability.

Then the server can call the pure planner and return an auditable session plan. The pure function should remain deterministic so a bad recommendation can be reproduced from stored inputs.

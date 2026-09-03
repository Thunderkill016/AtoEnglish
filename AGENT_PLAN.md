# Agent Plan — Current Work Only

> Product direction is defined in `docs/product/PRODUCT_TRUTH.md`. Ordered work is defined in `docs/product/CURRENT_PRIORITY.md`. Material frontier gaps are tracked in `docs/product/FRONTIER_LEDGER.md`.

## Current task

| Field | Value |
|---|---|
| Task | FRONTIER-001 — Align repository product truth with the 2026 frontier objective |
| Status | in progress — documentation-only pull request |
| Goal | Remove stale policy conflicts so future bounded implementation can reuse current code and current external technology to maximize measurable learner outcomes |

## Problem

Repository guidance from 2026-07-24 still forbids realtime AI conversation, phoneme-level diagnostics and other advanced adaptive/speech work until the old focused pilot is validated. The owner has explicitly changed the product objective: AtoEnglish should be pushed to the practical frontier of current learning science and technology, with learner outcomes—not feature comparisons—determining whether it is best.

Main has also advanced substantially since the old guidance: Nếp adaptive learning core V1 is now integrated and production database verification has passed. The documentation therefore understates the current implementation and blocks the next intended work.

## Outcome

After this task:

- Durable Transferable Learning Gain per Minute is the north star;
- the Vietnamese false-beginner speaking slice remains the first measurable proving ground, not the permanent product ceiling;
- realtime voice, calibrated speech diagnostics and adaptive-learning technology are allowed when bounded by evidence/privacy;
- reuse of maintained external/open-source implementations is explicitly preferred when it shortens the path safely;
- fake mastery/pronunciation evidence remains prohibited;
- a Frontier Ledger provides a finite definition of what remains before current-frontier completion.

## Allowed files

- `docs/product/**`
- `AGENT_PLAN.md`
- `AGENT_BACKLOG.md`

## Forbidden scope

This pull request must not change:

- runtime product code;
- lesson content;
- dependencies;
- database schema/RLS;
- authentication;
- analytics taxonomy;
- FSRS parameters;
- deployment behavior.

## Acceptance criteria

- Product truth reflects the owner’s 2026-09-03 objective.
- Current priority starts from the Nếp adaptive core already merged to `main`.
- Advanced technology is gated by learner value/evidence rather than categorically deferred.
- External reuse requires license/security/privacy/maintenance/compatibility checks.
- Frontier Ledger has explicit statuses and a critical path.
- No marketing claim of “best in world” is made without learner evidence.

## Technical checks

Documentation-only review:

- inspect final diff for internal contradictions;
- verify referenced repository paths exist;
- do not claim application tests ran unless they actually run on this branch.

## Product checks

Manual review should answer:

- Does the new policy optimize learner ability rather than competitor parity?
- Does it permit frontier technology without making AI the mastery authority?
- Does it preserve privacy and evidence integrity?
- Does it keep a measurable first proving ground while allowing broader eventual scope?

## Rollback

Close the branch/PR without merge. `main` remains unchanged.

## Next task

`FRONTIER-002 — Canonical adaptive runtime convergence and learner-surface audit`, followed by a separate realtime-voice benchmark/integration slice.

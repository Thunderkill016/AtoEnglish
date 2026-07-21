# Agent Backlog — Active Tasks Only

> Keep only open work here. Completed work belongs in Git commits and pull requests.

## Rules

1. Use a dedicated cleanup branch and reviewed pull request.
2. Never generate placeholder maintenance tasks.
3. Never commit or push only to record that tests passed.
4. Never push directly to `main` from an autonomous script.
5. Do not delete code until usage has been verified.
6. Every cleanup batch must preserve application behavior unless the task explicitly fixes a bug.

## Status values

- `ready`: safe to start.
- `in_progress`: currently being handled on a branch.
- `blocked`: needs a decision, secret, or manual verification.
- `done`: remove from this file after the pull request is merged.

## Active queue

### CLEANUP-017 — Expand lesson progress persistence coverage
- **Status:** `done` — awaiting stacked PR review.
- **Result:** Added seven persistence-focused cases for malformed JSON, non-restorable sections, per-unit key isolation, and final-section cleanup.

### CLEANUP-004C — Extract UnitTemplate progress persistence
- **Status:** `done` — awaiting stacked PR review.
- **Result:** Moved restore/save/remove behavior into `useLessonProgress` while preserving the exact storage key and section semantics covered by the 15 targeted tests.

### CLEANUP-018 — Expand UnitTemplate completion-flow coverage
- **Status:** `ready`
- **Goal:** Add focused tests around completion success/failure, star and XP derivation, guest fallback, achievement/streak coordination, and next-route behavior before moving completion logic.
- **Done when:** New completion tests, existing lesson tests, six production-server smoke tests, typecheck, lint, full unit tests, content-standard tests, and production build pass without production behavior changes.

### CLEANUP-015 — Review unit action transaction boundaries
- **Status:** `blocked`
- **Blocked by:** CLEANUP-018 completion-flow coverage and focused server-action transaction tests.
- **Goal:** Classify responsibilities in `src/app/actions/unit.ts` before any structural split.

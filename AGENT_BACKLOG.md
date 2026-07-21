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

### CLEANUP-004B — Extract UnitTemplate stateless presentation helpers
- **Status:** `done` — awaiting stacked PR review.
- **Result:** Extracted `LessonProgress` and `SessionBreakCard`, reduced `UnitTemplate` to 1,069 lines, and passed full CI plus production-server smoke coverage.

### CLEANUP-017 — Expand lesson progress persistence coverage
- **Status:** `done` — awaiting stacked PR review.
- **Result:** Added seven persistence-focused cases for malformed JSON, non-restorable sections, per-unit key isolation, and final-section cleanup without changing production behavior.

### CLEANUP-004C — Extract UnitTemplate progress persistence
- **Status:** `ready`
- **Goal:** Move lesson progress restore/save/remove behavior into a dedicated hook without changing `lesson-progress-<unitId>` keys or section semantics.
- **Done when:** The 15 targeted tests, six production-server lesson smoke tests, typecheck, focused/full lint, full unit tests, content-standard tests, and production build pass with a focused reversible diff.

### CLEANUP-015 — Review unit action transaction boundaries
- **Status:** `blocked`
- **Blocked by:** Focused tests for completion, XP, achievements, vocabulary seeding, streaks, and cache revalidation.
- **Goal:** Classify responsibilities in `src/app/actions/unit.ts` before any structural split.

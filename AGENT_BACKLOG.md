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

### CLEANUP-016 — Add lesson smoke/E2E prerequisite
- **Status:** `done` — awaiting stacked PR review.
- **Result:** Six Playwright tests cover guest lesson render, warmup-to-vocabulary navigation, quick-review-to-practice navigation, and section persistence on Desktop Chromium and Mobile Chrome against a production server.

### CLEANUP-004B — Extract UnitTemplate stateless presentation helpers
- **Status:** `done` — awaiting stacked PR review.
- **Result:** Extracted `LessonProgress` and `SessionBreakCard`, added focused component tests, reduced `UnitTemplate` from 1,182 to 1,069 lines, and passed full CI plus six production-server smoke tests.

### CLEANUP-017 — Expand lesson progress persistence coverage
- **Status:** `ready`
- **Goal:** Add focused tests for malformed saved JSON, invalid section numbers, per-unit storage-key isolation, and final-section cleanup without changing production behavior.
- **Done when:** New persistence tests, existing UnitTemplate/component tests, six production-server lesson smoke tests, typecheck, lint, full unit tests, content-standard tests, and production build pass.

### CLEANUP-004C — Extract UnitTemplate progress persistence
- **Status:** `blocked`
- **Blocked by:** CLEANUP-017 persistence-focused test matrix.
- **Goal:** Move lesson-progress localStorage behavior into a dedicated hook without changing storage keys or section semantics.

### CLEANUP-015 — Review unit action transaction boundaries
- **Status:** `blocked`
- **Blocked by:** Focused tests for completion, XP, achievements, vocabulary seeding, streaks, and cache revalidation.
- **Goal:** Classify responsibilities in `src/app/actions/unit.ts` before any structural split.

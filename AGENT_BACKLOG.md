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

### CLEANUP-004A — Extract UnitTemplate lesson types and constants
- **Status:** `ready`
- **Goal:** Move lesson-domain interfaces and section constants into dedicated modules without changing runtime behavior or breaking existing imports.
- **Done when:** `UnitTemplate` re-exports existing public types, section labels/order/total remain byte-for-byte equivalent in meaning, the four focused orchestration tests pass, and typecheck, lint, full unit tests, content-standard tests, and production build pass.

### CLEANUP-004B — Extract UnitTemplate stateless helpers
- **Status:** `blocked`
- **Blocked by:** CLEANUP-004A plus relevant lesson smoke/E2E validation.
- **Goal:** Extract small stateless presentation helpers in separate reviewable commits.

### CLEANUP-004C — Extract UnitTemplate progress persistence
- **Status:** `blocked`
- **Blocked by:** CLEANUP-004A and additional persistence-focused tests.
- **Goal:** Move lesson-progress localStorage behavior into a dedicated hook without changing storage keys or section semantics.

### CLEANUP-015 — Review unit action transaction boundaries
- **Status:** `blocked`
- **Blocked by:** Focused tests for completion, XP, achievements, vocabulary seeding, streaks, and cache revalidation.
- **Goal:** Classify responsibilities in `src/app/actions/unit.ts` before any structural split.

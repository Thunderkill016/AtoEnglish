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

### CLEANUP-010 — Verify legacy landing outcome section
- **Status:** `ready`
- **Goal:** Verify `src/components/landing/OutcomesSection.tsx` against the active landing-page composition.
- **Done when:** Static/dynamic imports and landing-page references are checked; deletion occurs only if proven unused; inventory, typecheck, lint, and tests pass afterward.

### CLEANUP-011 — Verify unused shared UI primitives
- **Status:** `blocked`
- **Blocked by:** Independent verification after CLEANUP-010.
- **Goal:** Classify `src/components/layout/user-avatar.tsx` and `src/components/ui/logo.tsx` without assuming that similarly named markup is equivalent.

### CLEANUP-012 — Verify implementation helper candidates
- **Status:** `blocked`
- **Blocked by:** Separate review of framework and operational usage.
- **Goal:** Classify `src/lib/lessons/enrich-unit.ts`, `src/lib/supabase/middleware.ts`, and `src/types/index.ts` independently; do not combine middleware deletion with UI cleanup.

### CLEANUP-004 — Split UnitTemplate safely
- **Status:** `blocked`
- **Blocked by:** Focused lesson behavior coverage plus relevant lesson smoke/E2E validation.
- **Goal:** Extract types, constants, small components, storage hooks, and completion logic in separate reviewable batches.

### CLEANUP-006 — Dependency classification
- **Status:** `blocked`
- **Blocked by:** Repository-wide config/script review and install/build verification for each package group.
- **Goal:** Classify every suspected unused or misplaced package before changing `package.json` or the lockfile.

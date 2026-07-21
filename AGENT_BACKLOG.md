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

### CLEANUP-012C — Verify legacy type barrel
- **Status:** `ready`
- **Goal:** Determine whether `src/types/index.ts` has any exact barrel consumer before removal.
- **Done when:** Direct imports from `@/types`, relative barrel imports, scripts, tests, and generated-code references are checked; typecheck, lint, and tests pass afterward.

### CLEANUP-012A — Verify lesson enrichment helper
- **Status:** `blocked`
- **Blocked by:** Review of active unit-loading and lesson fallback behavior.
- **Goal:** Determine whether `src/lib/lessons/enrich-unit.ts` is truly dead or an intended content fallback.

### CLEANUP-012B — Verify Supabase middleware helper
- **Status:** `blocked`
- **Blocked by:** Full review of `src/proxy.ts`, `src/lib/supabase/session.ts`, auth refresh behavior, and framework conventions.
- **Goal:** Classify `src/lib/supabase/middleware.ts` without risking session refresh or protected-route behavior.

### CLEANUP-004 — Split UnitTemplate safely
- **Status:** `blocked`
- **Blocked by:** Focused lesson behavior coverage plus relevant lesson smoke/E2E validation.
- **Goal:** Extract types, constants, small components, storage hooks, and completion logic in separate reviewable batches.

### CLEANUP-006 — Dependency classification
- **Status:** `blocked`
- **Blocked by:** Repository-wide config/script review and install/build verification for each package group.
- **Goal:** Classify every suspected unused or misplaced package before changing `package.json` or the lockfile.

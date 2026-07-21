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

### CLEANUP-013 — Reconcile protected-route E2E drift
- **Status:** `ready`
- **Goal:** Align `e2e/protected-routes.spec.ts` with the intentional guest-route policy in `src/lib/supabase/session.ts` without changing production authentication behavior.
- **Done when:** The source of truth is explicit, stale protected-route expectations are corrected, public/guest/protected coverage is preserved, and targeted E2E or equivalent route-policy validation passes.

### CLEANUP-004 — Split UnitTemplate safely
- **Status:** `blocked`
- **Blocked by:** Focused lesson behavior coverage plus relevant lesson smoke/E2E validation.
- **Goal:** Extract types, constants, small components, storage hooks, and completion logic in separate reviewable batches.

### CLEANUP-006 — Dependency classification
- **Status:** `blocked`
- **Blocked by:** Repository-wide config/script review and install/build verification for each package group.
- **Goal:** Classify every suspected unused or misplaced package before changing `package.json` or the lockfile.

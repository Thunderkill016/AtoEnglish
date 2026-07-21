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

### CLEANUP-003 — Remove verified repository waste
- **Status:** `blocked`
- **Blocked by:** Running `npm run inventory` in a full checkout and reviewing repository-wide references.
- **Goal:** Remove only items proven unused and update `.gitignore` where needed.
- **First candidate:** `src/app/actions/unit-content.ts` — likely unused, but not deletable until static, dynamic, script, migration, and operational references are checked.

### CLEANUP-004 — Split UnitTemplate safely
- **Status:** `blocked`
- **Blocked by:** Passing baseline typecheck, lint, unit tests, and relevant lesson smoke/E2E checks.
- **Goal:** Extract types, constants, small components, storage hooks, and completion logic in separate reviewable batches.

### CLEANUP-005 — Documentation source of truth
- **Status:** `in_progress`
- **Goal:** Reconcile README, architecture notes, commands, test counts, database names, and deployment instructions with executable repository sources.
- **Done when:** Durable docs avoid manually maintained test counts and no longer understate curriculum or known architecture debt.

### CLEANUP-006 — Dependency classification
- **Status:** `blocked`
- **Blocked by:** Generated inventory plus local install/build verification.
- **Goal:** Classify every suspected unused or misplaced package before changing `package.json` or the lockfile.
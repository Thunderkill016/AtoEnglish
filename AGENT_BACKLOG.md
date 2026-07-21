# Agent Backlog — Active Tasks Only

> Keep only open work here. Completed work belongs in Git commits and pull requests.

## Rules

1. One task per branch.
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

### CLEANUP-001 — Codebase cleanup foundation
- **Status:** `in_progress`
- **Goal:** Stop agent-generated repository noise and establish a safe cleanup workflow.
- **Done when:** Autopilot refill cannot modify Git; PLAN/BACKLOG are concise; durable agent rules prevent direct pushes to `main`; draft PR opened.

### CLEANUP-002 — Dead-code and dependency inventory
- **Status:** `ready`
- **Goal:** Produce verified lists of unused files, exports, dependencies, generated artifacts, and duplicate modules.
- **Done when:** Every candidate is classified as `safe_to_delete`, `likely_unused`, or `manual_verification`; no source files are deleted yet.

### CLEANUP-003 — Remove verified repository waste
- **Status:** `blocked`
- **Blocked by:** CLEANUP-002 inventory.
- **Goal:** Remove only items proven unused and update `.gitignore` where needed.

### CLEANUP-004 — Split UnitTemplate safely
- **Status:** `blocked`
- **Blocked by:** CLEANUP-002 and a passing baseline test run.
- **Goal:** Extract types, constants, small components, storage hooks, and completion logic in separate reviewable batches.

### CLEANUP-005 — Documentation source of truth
- **Status:** `ready`
- **Goal:** Reconcile README, architecture notes, commands, test counts, database names, and deployment instructions with the current repository.

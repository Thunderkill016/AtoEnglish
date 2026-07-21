# Agent Plan — Current Work Only

> This file describes the current task only. Historical work belongs in Git commits and pull requests, not in this file.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-001 — Codebase cleanup foundation |
| Status | done — awaiting review |
| Branch | `agent/codebase-cleanup-foundation` |
| Goal | Stop agent-generated repository noise and establish a safe cleanup workflow |

## Completed

- Disabled automatic backlog generation.
- Disabled automatic commits and pushes from the refill script.
- Replaced the historical backlog with a small active cleanup queue.
- Replaced the session-history plan with a current-task-only plan.
- Updated durable agent rules to require branches, reviewed pull requests, staged cleanup, and verified deletion.
- Left all application files under `src/` unchanged.

## Validation

This batch changes Markdown governance files and one shell script only.

- Confirmed the refill script contains no `git add`, `git commit`, `git push`, file write, or task-generation logic.
- Confirmed cleanup tasks have explicit dependencies and deletion is blocked until an inventory exists.
- Confirmed no database, migration, auth, routing, lesson-order, FSRS, dependency, or application source changes are included.
- Full TypeScript, lint, and application test execution was not available through the GitHub connector-only environment; CI/local verification should run on the pull request branch.

## Next task

CLEANUP-002 — Build a verified dead-code and dependency inventory before deleting anything.

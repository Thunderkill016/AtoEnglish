# Agent Plan — Current Work Only

> This file describes the current task only. Historical work belongs in Git commits and pull requests, not in this file.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-001 — Codebase cleanup foundation |
| Status | in_progress |
| Branch | `agent/codebase-cleanup-foundation` |
| Goal | Stop agent-generated repository noise and establish a safe cleanup workflow |

## Scope

- Disable automatic backlog refill and automatic commits/pushes.
- Replace the oversized backlog with a small actionable queue.
- Keep `AGENTS.md` focused on durable project rules.
- Add a staged cleanup roadmap.
- Correct obvious README drift without changing application behavior.

## Out of scope

- No product features.
- No database or migration changes.
- No auth, routing, FSRS, lesson-order, or Supabase behavior changes.
- No large component refactor in this batch.
- No direct push to `main`.

## Validation

Because this batch changes documentation and one shell safety script only:

1. Review the branch diff.
2. Confirm `scripts/agent-refill-backlog.sh` no longer edits files, commits, or pushes.
3. Confirm no application source files under `src/` changed.
4. Open a draft pull request for review.

## Next planned task

CLEANUP-002 — Build a verified dead-code and dependency inventory before deleting anything.

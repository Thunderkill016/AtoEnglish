# Agent Backlog — Active Tasks Only

**Canonical state:** `docs/project/PROJECT_STATE.md`

This file intentionally contains only work that is active during the 2026-09-06 project reset.

## RESET-001 — Project audit and source-of-truth cleanup

- **Issue:** #151
- **Status:** `in_progress`
- **Outcome:** AtoEnglish has one readable current state; stale product/R&D directions are archived without deleting history.
- **Allowed:** docs/governance cleanup, GitHub issue/PR archival, read-only infrastructure audit, verification.
- **Forbidden:** product feature work, production writes/deploys, new R&D expansion, auto-merge.

## P0-001 — Release consistency

- **Issue:** #152
- **Status:** `blocked_until_reset_is_reviewable`
- **Outcome:** exact GitHub commit, Supabase migration/runtime state and Vercel production deployment are synchronized before the next release.
- **Known inputs:** production is behind repository migration state and Vercel production is behind `main`.

## P0-002 — Legacy attempt compatibility

- **PR:** #87
- **Status:** `retain_for_independent_review`
- **Reason:** current production write privileges and current `main` direct-insert behavior are incompatible in principle; PR #87 provides a bounded RPC compatibility bridge.
- **Rule:** do not merge from old CI evidence alone. Re-review/reverify against current main + current production RPC contract first.

## Interrupt policy

Only a newly discovered P0 security, privacy, production-data-integrity or release-blocking defect may interrupt the list above.

Historical PRs/issues/tasks do not become active merely because they are open, detailed, green, or appear next in an old dependency chain.

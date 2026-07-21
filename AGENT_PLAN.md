# Agent Plan — Current Work Only

> Historical cleanup is recorded in merged pull requests and `reports/codebase-cleanup-inventory.md`.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-018 — Characterize UnitTemplate completion flow |
| Status | in progress — test-only pull request |
| Goal | Lock current completion, star, XP, guest, streak, achievement, and navigation behavior before any extraction |

## Merged baseline

- Cleanup PRs #1–#16 are merged into `main`.
- Conservative unreachable candidates are 0.
- `UnitTemplate` types, section constants, presentation helpers, and progress persistence are already extracted.
- Production-server lesson smoke coverage exists on desktop and mobile.

## Scope

This phase changes tests and cleanup documentation only. It must not move completion logic or change XP, star, guest, streak, achievement, storage, server-action, database, auth, FSRS, route, or curriculum behavior.

## Separate known issue

The direct `/login` E2E title assertion can observe an empty document title while the route still returns HTTP 200. Track and fix that independently; it is not part of lesson completion refactoring.

## Next action

Review the CLEANUP-018 characterization PR. Phase 2 remains blocked until this PR is explicitly reviewed and merged.

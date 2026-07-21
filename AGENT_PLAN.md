# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-007 — Verify the next unreachable source group |
| Status | ready |
| Branch | `agent/codebase-cleanup-foundation` |
| Goal | Continue verified dead-code removal one tightly related group at a time |

## Completed in this branch

### CLEANUP-001 — Cleanup foundation

- Disabled automatic backlog generation, commits, and direct pushes.
- Replaced oversized agent journals with concise current/open-work files.
- Required branches, pull-request review, staged cleanup, and verified deletion.

### CLEANUP-002 — Inventory foundation

- Added `npm run inventory` with no new dependency.
- Added reproducible reporting for unreachable source, files over 500 lines, and package candidates.
- Added a durable evidence report and ignored generated reports.

### CLEANUP-003 — First verified source deletion

- Ran the cleanup workflow on a complete GitHub Actions checkout.
- Installed dependencies from the lockfile without lifecycle scripts.
- Generated and downloaded the cleanup inventory artifact.
- Verified `src/app/actions/unit-content.ts` had no runtime import or caller.
- Removed the unused action without altering its historical migration or generated DB types.
- Reran inventory, TypeScript, ESLint, and unit tests successfully after deletion.
- Confirmed source count changed 356 → 355 and unreachable candidates changed 17 → 16.

### CLEANUP-005 — Documentation source of truth

- Removed hard-coded test totals and stale partial database documentation.
- Documented the current 50-unit curriculum and active architecture debt.
- Updated the inventory evidence with the first verified deletion.

## Baseline now established

The current branch has a successful full-checkout validation run covering:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx tsc --noEmit
npm run lint
npm run test
```

## Next action

Verify the rollback-era minimal dashboard and lesson-shell candidates with symbol/path searches. Remove only candidates with no framework, import, script, or runtime references, then rerun the same validation gates.

# Agent Plan — Current Work Only

> This file describes the current cleanup work only. Historical work belongs in Git commits and pull requests, not in this file.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-005 — Documentation source of truth |
| Status | in_progress |
| Branch | `agent/codebase-cleanup-foundation` |
| Goal | Reconcile durable documentation with executable repository sources |

## Completed in this branch

### CLEANUP-001 — Cleanup foundation

- Disabled automatic backlog generation.
- Disabled automatic commits and pushes from the refill script.
- Replaced historical agent journals with concise current-work files.
- Required branches, reviewed pull requests, staged cleanup, and verified deletion.

### CLEANUP-002 — Inventory foundation

- Added `npm run inventory` with no new dependency.
- The inventory reports unreachable source candidates, files over 500 lines, and possibly unused packages.
- Added `reports/codebase-cleanup-inventory.md` with evidence, classifications, and deletion gates.
- Kept all deletion candidates in review status; no source file has been deleted.

## Current scope

- Remove hard-coded test counts that drift after every test addition.
- Correct the documented lesson count and `UnitTemplate` architecture warning.
- Remove duplicate or unverified database rows from README.
- Describe the current cleanup and validation commands accurately.

## Validation

- Review the branch diff against `main`.
- Confirm application behavior is unchanged.
- Run `npm run inventory`, `npx tsc --noEmit`, `npm run lint`, and `npm run test` in a full checkout before merge.
- Full runtime checks are unavailable in the connector-only environment and must not be claimed as passing.

## Next task

CLEANUP-003 — Run the inventory in a full checkout and remove only the first verified dead-code candidate.
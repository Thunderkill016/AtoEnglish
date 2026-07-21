# Agent Plan — Current Work Only

> This file describes the current cleanup work only. Historical work belongs in Git commits and pull requests, not in this file.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-003 — Remove verified repository waste |
| Status | blocked — requires full checkout validation |
| Branch | `agent/codebase-cleanup-foundation` |
| Goal | Remove only candidates proven unused by repository-wide analysis and passing checks |

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
- Tested the inventory script syntax and import-pattern handling outside the repository checkout.
- Kept all deletion candidates in review status; no source file has been deleted.

### CLEANUP-005 — Documentation source of truth

- Removed manually maintained test totals from README.
- Documented the current 50-unit curriculum.
- Removed the stale partial database table list and pointed to migrations and generated types.
- Documented `UnitTemplate.tsx` as active architecture debt rather than presenting it as a normal small component.
- Documented cleanup, validation, CI, and deployment sources without guessing current runtime state.

## Blocker

The GitHub connector can edit and review repository files but does not provide a complete executable checkout. Therefore the following commands have not been run on this branch:

```bash
npm run inventory
npx tsc --noEmit
npm run lint
npm run test
```

No source or dependency candidate should be deleted until those commands run in a full checkout and the generated inventory is manually reviewed.

## Next action

Run the validation commands on `agent/codebase-cleanup-foundation`. If they pass, CLEANUP-003 may delete the first verified candidate in a dedicated commit.
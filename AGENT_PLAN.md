# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-008 — Verify old exercise components |
| Status | ready |
| Branch | `agent/codebase-cleanup-foundation` |
| Goal | Continue verified dead-code removal one tightly related group at a time |

## Completed in this branch

### Cleanup foundation and documentation

- Disabled automatic backlog generation, commits, and direct pushes.
- Replaced oversized agent journals with concise current/open-work files.
- Reconciled README and architecture documentation with executable sources.

### Inventory foundation

- Added `npm run inventory` with no new dependency.
- Added reproducible reporting for unreachable source, files over 500 lines, and package candidates.
- Added a durable evidence report and ignored generated reports.

### Verified dead-code removal

Removed after import-graph analysis and repository-wide symbol/path searches:

- `src/app/actions/unit-content.ts`
- `src/app/(main)/dashboard/components/DashboardMinimalClient.tsx`
- `src/components/learn/lesson-ui/LessonHeader.tsx`
- `src/components/learn/lesson-ui/LessonShell.tsx`

Also removed the stale dead-file exemption from `scripts/audit-code.mjs`.

## Validation completed

A full GitHub Actions checkout successfully ran after the source and audit changes:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx tsc --noEmit
npm run lint
npm run test
```

Results:

- source files scanned: 356 → 352
- unreachable candidates: 17 → 13
- TypeScript passed
- ESLint passed
- unit tests passed

The temporary validation workflow was removed after the final successful run.

## Next action

Verify `ListenAndChooseExercise.tsx` and `MatchingPairsGame.tsx` against the active lesson sections. Remove only files with no code, framework, script, or runtime references, then rerun the full validation gates in an executable checkout.

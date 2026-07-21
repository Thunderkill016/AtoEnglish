# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-009 — Verify notification-center group |
| Status | done — awaiting stacked PR review |
| Branch | `agent/cleanup-unused-notifications` |
| Goal | Remove the disconnected notification-center UI group without changing active push or notification infrastructure |

## Completed in the foundation cleanup

- Disabled automatic backlog generation, commits, and direct pushes.
- Replaced oversized agent journals with concise current/open-work files.
- Reconciled README and architecture documentation with executable sources.
- Added `npm run inventory` and a durable cleanup evidence report.
- Removed four previously verified dead-code files.

## Completed in CLEANUP-009

Removed after full-checkout inventory and repository-wide symbol/path searches:

- `src/components/layout/notification-center-wrapper.tsx`
- `src/features/notifications/components/NotificationCenter.tsx`
- `src/features/notifications/components/NotificationItem.tsx`
- `src/features/notifications/hooks/useNotificationCenter.ts`
- `src/features/notifications/utils/notificationCopy.ts`

Preserved:

- `src/app/api/notifications/history/route.ts`
- `PushPermissionCard`
- push/service-worker infrastructure
- notification migrations, database tables, and generated Supabase types

## Validation completed

A full GitHub Actions checkout successfully ran before and after deletion:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx tsc --noEmit
npm run lint
npm run test
```

Post-deletion results:

- source files scanned: 352 → 347
- unreachable candidates: 13 → 8
- TypeScript passed
- ESLint passed
- unit tests passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-008 — verify `ListenAndChooseExercise.tsx` and `MatchingPairsGame.tsx` against active lesson sections on a separate branch and pull request.

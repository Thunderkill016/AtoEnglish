# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-016 — Add lesson production smoke/E2E prerequisite |
| Status | done — awaiting stacked PR review |
| Branch | `agent/lesson-production-smoke-e2e` |
| Goal | Lock real guest lesson rendering and section navigation on a production Next.js server before extracting stateless helpers |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible source and dependency inventory plus durable cleanup evidence.
- Reduced conservative unreachable source candidates from 17 to 0.
- Added Supabase session regression coverage while removing the obsolete middleware helper.
- Reconciled protected-route E2E coverage with intentional guest self-study behavior.
- Removed proven dependency waste and classified retained framework/tooling false positives.
- Added four focused UnitTemplate orchestration tests.
- Extracted lesson-domain types and exact section constants while preserving existing imports.

## Completed in CLEANUP-016

Added durable Playwright coverage:

- `e2e/lesson-smoke.spec.ts`

The suite runs against `next start` after a production build and verifies on both Desktop Chromium and Mobile Chrome:

1. A guest can load `/learn/unit-a0-1` with HTTP 200 and reach the warmup section without an auth redirect.
2. `Bắt đầu học` opens the Vocabulary section and persists section 2 to `lesson-progress-unit-a0-1`.
3. `Ôn nhanh` opens the Practice section and persists section 4 to the same storage key.

The tests also verify the visible lesson progressbar for steps 1, 2, and 4 and fail on uncaught browser page errors during the initial render flow.

No production source, lesson content, section order, localStorage key, scoring, XP, completion, database action, FSRS behavior, auth policy, route, package, or UI copy changed.

## Validation completed

A full GitHub Actions checkout ran:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx playwright install --with-deps chromium
npm run inventory -- --write
npx tsc --noEmit
npx eslint e2e/lesson-smoke.spec.ts
npm run lint
npm run test
npm run test:content-standard
npm run build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/lesson-smoke.spec.ts
```

Results:

- 6 production-server lesson smoke tests passed in 8.8 seconds
- 3 flows passed on Desktop Chromium
- 3 flows passed on Mobile Chrome
- Next.js 16.2.9 production server became ready in 209 ms
- source inventory remained 344 files, 121 entry points, and 0 unreachable candidates
- TypeScript passed
- focused and full ESLint passed
- full unit tests passed
- lesson content-standard tests passed
- production build passed

The temporary validation workflow was removed after the successful run.

## Next action

CLEANUP-004B — extract only small stateless presentation helpers from `UnitTemplate` in a reversible batch. Keep orchestration state, persistence, scoring, completion, server actions, and section rendering branches in place, then rerun component tests, the six production-server lesson smoke tests, and full validation.

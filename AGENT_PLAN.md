# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-013 — Reconcile protected-route E2E drift |
| Status | done — awaiting stacked PR review |
| Branch | `agent/cleanup-protected-routes-e2e` |
| Goal | Align route-policy E2E coverage with intentional guest self-study behavior without changing production authentication |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible codebase inventory and durable cleanup evidence.
- Reduced conservative unreachable source candidates from 17 to 0.
- Added focused Supabase session regression coverage while removing the obsolete middleware helper.

## Completed in CLEANUP-013

Updated only:

- `e2e/protected-routes.spec.ts`

Corrections:

- Removed `/dashboard`, `/learn/*`, `/flashcards`, and `/speaking` from protected-route expectations because `session.ts` intentionally allows guest self-study there.
- Added missing protected-route coverage for `/certificate` and `/checkpoint`.
- Corrected the invalid A0 slug from `/learn/unit-a01` to `/learn/unit-a0-1`.
- Added explicit guest-route assertions requiring HTTP 200 and no redirect to `/login`.
- Strengthened protected redirects to verify `/login`, the original `next` path, and `mode=login`.
- Kept `src/proxy.ts`, `src/lib/supabase/session.ts`, route policy, cookies, redirects, and production pages unchanged.

## Validation completed

A full GitHub Actions checkout ran against a production Next.js server:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx playwright install --with-deps chromium
npx tsc --noEmit
npm run lint
npm run test
npm run build
npm run start
npx playwright test e2e/protected-routes.spec.ts --project=chromium
```

Results:

- TypeScript passed.
- ESLint passed.
- Full unit tests passed.
- Production build passed.
- Production server startup passed.
- All 26 targeted Chromium route, landing, and health-check E2E tests passed.

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-006 — classify suspected unused or misplaced dependencies in small, independently validated groups. Do not remove packages from import-only evidence.

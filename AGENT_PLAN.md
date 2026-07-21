# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-012B — Verify Supabase middleware helper |
| Status | done — awaiting stacked PR review |
| Branch | `agent/cleanup-unused-supabase-middleware` |
| Goal | Remove the obsolete helper while preserving the active proxy/session authentication boundary |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible codebase inventory and durable cleanup evidence.
- Removed foundation dead code, the disconnected notification center, legacy exercise components, the old landing outcomes section, unused shared UI, the legacy type barrel, and the retired lesson enrichment fallback.

## Completed in CLEANUP-012B

Removed after full-checkout and behavior-aware verification:

- `src/lib/supabase/middleware.ts`

Added permanent regression coverage:

- `src/lib/supabase/session.test.ts`

Evidence:

- `createMiddlewareClient` and the old module path had no consumer.
- `src/proxy.ts` is the only framework convention entry and imports `updateSession` from `src/lib/supabase/session.ts`.
- `session.ts` owns cookie refresh, missing-environment fallback, public-route bypass, protected-route redirects, authenticated login redirects, and authenticated protected pass-through.
- Focused tests cover all of those behaviors.
- No protected-route list, redirect destination, cookie semantics, rate limit, environment variable, dependency, database, or Supabase schema changed.

## Validation completed

A full GitHub Actions checkout ran before and after deletion:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx vitest run src/lib/supabase/session.test.ts
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Post-deletion results:

- source files scanned: 341 → 340
- known entry points: 118 → 119
- unreachable candidates: 1 → 0
- targeted session tests passed
- TypeScript passed
- ESLint passed
- full unit tests passed
- production build passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-013 — reconcile `e2e/protected-routes.spec.ts` with the intentional guest-route policy in `session.ts`. Keep that behavior/test correction separate from this dead-code cleanup.

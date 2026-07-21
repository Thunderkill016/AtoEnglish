# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-012A — Verify lesson enrichment helper |
| Status | done — awaiting stacked PR review |
| Branch | `agent/cleanup-unused-enrich-unit` |
| Goal | Remove the retired runtime fallback while preserving real curriculum content and lesson behavior |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible codebase inventory and durable cleanup evidence.
- Removed foundation dead code, the disconnected notification center, legacy exercise components, the old landing outcomes section, unused shared UI, and the legacy type barrel.

## Completed in CLEANUP-012A

Removed after full-checkout and behavior-aware verification:

- `src/lib/lessons/enrich-unit.ts`

Evidence:

- The helper and module path had no runtime or tooling consumer.
- The active `[unitSlug]` route loads units directly from `UNIT_DATA_MAP` and passes them directly to `UnitTemplate`.
- All 50 active units contain real `situation` and `learningOutcomes` fields.
- Content-standard validation requires these fields, making silent runtime repair obsolete.
- Unit content, lesson order, scoring, audio, FSRS, and `UnitTemplate` code remain unchanged.

## Validation completed

A full GitHub Actions checkout ran before and after deletion:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx tsc --noEmit
npm run lint
npm run test
npm run test:content-standard
npm run build
```

Post-deletion results:

- source files scanned: 341 → 340
- unreachable candidates: 2 → 1
- TypeScript passed
- ESLint passed
- unit tests passed
- lesson content-standard tests passed
- production build passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-012B — review `src/lib/supabase/middleware.ts` independently against proxy/session/auth behavior. Do not delete it without targeted cookie-refresh and redirect validation.

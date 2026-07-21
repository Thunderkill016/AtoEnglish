# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-011 — Verify unused shared UI primitives |
| Status | done — awaiting stacked PR review |
| Branch | `agent/cleanup-unused-shared-ui` |
| Goal | Remove unused presentational components without rewriting active branding or avatar UI |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible codebase inventory and durable cleanup evidence.
- Removed foundation dead code, the disconnected notification center, two legacy exercise components, and the legacy landing outcomes section.

## Completed in CLEANUP-011

Removed after independent full-checkout verification:

- `src/components/layout/user-avatar.tsx`
- `src/components/ui/logo.tsx`

Evidence:

- No static import, dynamic import, route/layout integration, export consumer, test, or script used either component.
- Active branding uses `Sprout` and existing markup directly in current surfaces.
- `HeaderShell` does not import `UserAvatar` and keeps its active authentication UI unchanged.
- No navigation, avatar behavior, branding copy, or styling was rewritten.

## Validation completed

A full GitHub Actions checkout ran before and after deletion:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npm run inventory -- --write
npx tsc --noEmit
npm run lint
npm run test
```

Post-deletion results:

- source files scanned: 344 → 342
- unreachable candidates: 5 → 3
- TypeScript passed
- ESLint passed
- unit tests passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-012C — verify the legacy `src/types/index.ts` barrel independently. Do not combine it with lesson enrichment or Supabase session middleware cleanup.

# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-014 — Add focused UnitTemplate behavior coverage |
| Status | done — awaiting stacked PR review |
| Branch | `agent/unit-template-test-foundation` |
| Goal | Lock current lesson orchestration behavior before the first reversible `UnitTemplate` extraction |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible source and dependency inventory plus durable cleanup evidence.
- Reduced conservative unreachable source candidates from 17 to 0.
- Added focused Supabase session regression coverage while removing the obsolete middleware helper.
- Reconciled protected-route E2E coverage with intentional guest self-study behavior.
- Removed proven dependency waste and classified retained framework/tooling false positives.

## Completed in CLEANUP-014

Added durable component-level coverage:

- `src/components/learn/UnitTemplate.test.tsx`

The four focused tests lock these orchestration behaviors:

1. Saved lesson progress restores the correct section using the non-linear pedagogical order.
2. `dialogues_list` is normalized and preferred before data reaches `DialogueSection`.
3. Quick-review mode jumps from Practice directly to Quiz, persists section 4, and clears saved progress at the final section.
4. Guest completion preserves the `completeUnit(unitId, starCount)` action contract, records the unit locally, and uses the configured next route.

The test isolates child sections, server actions, animations, streak UI, and browser-only APIs. It uses React DOM directly and adds no package dependency.

No production source file, lesson content, section order, scoring formula, completion transaction, database action, FSRS behavior, route, or UI copy changed.

## Validation completed

A full GitHub Actions checkout ran:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx vitest run src/components/learn/UnitTemplate.test.tsx
npm run inventory -- --write
npx tsc --noEmit
npx eslint src/components/learn/UnitTemplate.test.tsx
npm run lint
npm run test
npm run test:content-standard
npm run build
```

Results:

- 4 targeted UnitTemplate tests passed
- source files scanned: 340 → 341 because one durable test file was added
- known entry points: 119 → 120
- unreachable candidates remained 0
- TypeScript passed
- focused and full ESLint passed
- full unit tests passed
- lesson content-standard tests passed
- production build passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-004A — extract lesson-domain types and section constants from `UnitTemplate` in one reversible batch. Preserve existing type imports through re-exports, keep section values/order identical, and rerun the four focused tests plus full validation.

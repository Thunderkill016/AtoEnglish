# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-004A — Extract UnitTemplate lesson types and constants |
| Status | done — awaiting stacked PR review |
| Branch | `agent/unit-template-types-and-constants` |
| Goal | Move lesson-domain interfaces and section constants out of `UnitTemplate` without changing runtime behavior or breaking existing imports |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible source and dependency inventory plus durable cleanup evidence.
- Reduced conservative unreachable source candidates from 17 to 0.
- Added Supabase session regression coverage while removing the obsolete middleware helper.
- Reconciled protected-route E2E coverage with intentional guest self-study behavior.
- Removed proven dependency waste and classified retained framework/tooling false positives.
- Added four focused UnitTemplate orchestration tests.

## Completed in CLEANUP-004A

Added dedicated modules:

- `src/components/learn/lesson-types.ts`
- `src/components/learn/lesson-sections.ts`
- `src/components/learn/lesson-sections.test.ts`

Updated `src/components/learn/UnitTemplate.tsx` to:

- import lesson-domain interfaces from `lesson-types.ts`
- import section labels, order, total, and `SectionNumber` from `lesson-sections.ts`
- re-export every previously public lesson type so existing imports remain compatible
- keep `UnitTemplateProps` and completion-only state local

Preserved exactly:

- section order `[1, 2, 3, 4, 5, 10, 9, 6, 7, 8]`
- all ten Vietnamese section labels
- scoring, XP, completion, localStorage, audio, FSRS, lesson content, routing, and rendering behavior

The focused `UnitTemplate` diff is `+47/-213`. The component decreased from 1,348 to 1,182 lines without moving orchestration or behavior-sensitive logic.

## Validation completed

A clean committed checkout ran:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx vitest run src/components/learn/UnitTemplate.test.tsx src/components/learn/lesson-sections.test.ts
npm run inventory -- --write
npx tsc --noEmit
npx eslint src/components/learn/UnitTemplate.tsx src/components/learn/UnitTemplate.test.tsx src/components/learn/lesson-types.ts src/components/learn/lesson-sections.ts src/components/learn/lesson-sections.test.ts
npm run lint
npm run test
npm run test:content-standard
npm run build
```

Results:

- 6 targeted tests passed: 4 orchestration tests plus 2 exact constants tests
- source files scanned: 341 → 344
- known entry points: 120 → 121
- unreachable candidates remained 0
- TypeScript passed across all existing `UnitTemplate` type consumers
- focused and full ESLint passed
- full unit tests passed
- lesson content-standard tests passed
- production build passed

The temporary validation workflow was removed after the final successful run.

## Next action

CLEANUP-016 — run or strengthen a production-server lesson smoke/E2E flow before extracting stateless presentation helpers. The smoke coverage must verify a real lesson route renders, the section order remains usable, and quick-review reaches Quiz without changing production logic.

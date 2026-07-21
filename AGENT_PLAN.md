# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-004B — Extract UnitTemplate stateless presentation helpers |
| Status | done — awaiting stacked PR review |
| Branch | `agent/unit-template-stateless-presentation` |
| Goal | Move only the lesson progress and mid-lesson break presentation blocks out of `UnitTemplate` without moving orchestration state or changing behavior |

## Completed in earlier cleanup batches

- Stopped automatic maintenance-task generation, commits, and direct pushes.
- Added reproducible source and dependency inventory plus durable cleanup evidence.
- Reduced conservative unreachable source candidates from 17 to 0.
- Added Supabase session regression coverage while removing the obsolete middleware helper.
- Reconciled protected-route E2E coverage with intentional guest self-study behavior.
- Removed proven dependency waste and classified retained framework/tooling false positives.
- Added focused UnitTemplate orchestration tests.
- Extracted lesson-domain types and exact section constants while preserving existing imports.
- Added six production-server lesson smoke tests across desktop and mobile.

## Completed in CLEANUP-004B

Added dedicated presentation components:

- `src/components/learn/lesson-ui/LessonProgress.tsx`
- `src/components/learn/lesson-ui/SessionBreakCard.tsx`
- `src/components/learn/lesson-ui/lesson-presentation.test.tsx`

`UnitTemplate.tsx` now delegates:

- the exact ten-step non-linear progress display to `LessonProgress`
- the Practice-to-Dialogue break card to `SessionBreakCard`

Preserved exactly:

- progressbar labels and percentages
- completed/current/upcoming step styling
- session-break copy, motion props, dashboard link, and continue callback
- section order, navigation, localStorage, scoring, XP, completion, database actions, FSRS, auth, routes, lesson content, and UI behavior

The focused `UnitTemplate` diff is `+4/-117`. The component decreased from 1,182 to 1,069 lines. Sticky-header interactions, completion overlay, `XpCounter`, video shadowing, orchestration state, and behavior-sensitive functions remain local.

## Validation completed

A clean committed checkout ran:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx playwright install --with-deps chromium
npx vitest run src/components/learn/UnitTemplate.test.tsx src/components/learn/lesson-sections.test.ts src/components/learn/lesson-ui/lesson-presentation.test.tsx
npm run inventory -- --write
npx tsc --noEmit
npx eslint <focused files>
npm run lint
npm run test
npm run test:content-standard
npm run build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/lesson-smoke.spec.ts
```

Results:

- 8 targeted tests passed: 4 orchestration, 2 exact constants, and 2 presentation-helper tests
- 6 production-server lesson smoke tests passed on Desktop Chromium and Mobile Chrome
- source files scanned: 344 → 347
- known entry points: 121 → 122
- unreachable candidates remained 0
- `UnitTemplate.tsx`: 1,182 → 1,069 lines
- TypeScript passed
- focused and full ESLint passed
- full unit tests passed
- lesson content-standard tests passed
- production build passed

The temporary validation workflow is removed after the final successful documentation run.

## Next action

CLEANUP-017 — add a persistence-focused UnitTemplate test matrix for malformed saved JSON, invalid section numbers, per-unit key isolation, and final-section cleanup before moving localStorage behavior into a hook.

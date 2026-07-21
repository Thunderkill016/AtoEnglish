# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-017 — Expand lesson progress persistence coverage |
| Status | done — awaiting stacked PR review |
| Branch | `agent/unit-template-persistence-tests` |
| Goal | Lock malformed, non-restorable, per-unit, and final-section localStorage behavior before extracting lesson progress persistence into a hook |

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
- Extracted `LessonProgress` and `SessionBreakCard` without moving orchestration state.

## Completed in CLEANUP-017

Expanded `src/components/learn/UnitTemplate.test.tsx` with seven persistence-focused cases covering:

- malformed saved JSON stays non-fatal and leaves the lesson at Warmup
- non-restorable saved sections `0`, `1`, `10`, and `11` are ignored
- reads and writes use the current unit's `lesson-progress-<unitId>` key only
- reaching the final Quiz removes only the current unit's progress key
- unrelated unit progress remains untouched throughout navigation and cleanup

No production source, localStorage key, section order, navigation, scoring, XP, completion, database action, FSRS behavior, auth, route, lesson content, package, or UI copy changed.

## Validation completed

A clean GitHub Actions checkout ran:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx playwright install --with-deps chromium
npx vitest run src/components/learn/UnitTemplate.test.tsx src/components/learn/lesson-sections.test.ts src/components/learn/lesson-ui/lesson-presentation.test.tsx
npm run inventory -- --write
npx tsc --noEmit
npx eslint <focused test and lesson files>
npm run lint
npm run test
npm run test:content-standard
npm run build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/lesson-smoke.spec.ts
```

Expected final results:

- 15 targeted tests: 11 UnitTemplate behavior/persistence, 2 exact constants, and 2 presentation-helper tests
- 6 production-server lesson smoke tests on Desktop Chromium and Mobile Chrome
- source inventory remains 347 files, 122 entry points, and 0 unreachable candidates
- TypeScript, focused/full ESLint, full unit tests, content-standard tests, and production build pass

The temporary validation workflow is removed after the final successful clean-state run.

## Next action

CLEANUP-004C — extract lesson progress restore/save/remove behavior into a dedicated hook while preserving the exact storage key and section semantics now covered by tests.

# Agent Plan — Current Work Only

> This file describes current cleanup work only. Historical work belongs in Git commits and pull requests.

## Current task

| Field | Value |
|---|---|
| Task | CLEANUP-004C — Extract UnitTemplate progress persistence |
| Status | done — awaiting stacked PR review |
| Branch | `agent/unit-template-progress-persistence-hook` |
| Goal | Move lesson progress restore/save/remove behavior into a dedicated hook without changing storage keys or section semantics |

## Completed in earlier cleanup batches

- Reduced conservative unreachable source candidates from 17 to 0.
- Added Supabase session regression coverage and reconciled protected-route E2E.
- Removed proven dependency waste and classified retained framework/tooling dependencies.
- Added focused UnitTemplate orchestration and persistence tests.
- Extracted lesson-domain types, section constants, and presentation-only helpers.
- Added six production-server lesson smoke tests across desktop and mobile.

## Completed in CLEANUP-004C

Added:

- `src/components/learn/hooks/useLessonProgress.ts`

`UnitTemplate.tsx` now delegates browser lesson-progress persistence to `useLessonProgress` while keeping section state and all orchestration in the component.

Preserved exactly:

- storage key `lesson-progress-<unitId>`
- malformed JSON remains non-fatal
- saved sections restore only when `savedSection > 1 && savedSection < 10`
- section `10` remains intentionally non-restorable
- the first section writes nothing
- intermediate sections write `{ section }` JSON
- entering the final Quiz removes only the current unit key
- progress belonging to other units remains untouched

The warmup-card, completion-status, and guest-completion effect remains inside `UnitTemplate`. No scoring, XP, completion transaction, database action, FSRS, auth, route, lesson content, package, or UI behavior changed.

Focused size result:

- `UnitTemplate.tsx`: 1,069 → 1054 lines

## Validation completed

A clean committed checkout ran:

```bash
npm ci --ignore-scripts --legacy-peer-deps
npx playwright install --with-deps chromium
npx vitest run src/components/learn/UnitTemplate.test.tsx src/components/learn/lesson-sections.test.ts src/components/learn/lesson-ui/lesson-presentation.test.tsx
npm run inventory -- --write
npx tsc --noEmit
npx eslint <focused hook and lesson files>
npm run lint
npm run test
npm run test:content-standard
npm run build
PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npx playwright test e2e/lesson-smoke.spec.ts
```

Expected final results:

- 15 targeted tests pass
- 6 production-server lesson smoke tests pass on Desktop Chromium and Mobile Chrome
- source inventory becomes 348 files, 122 entry points, and 0 unreachable candidates
- TypeScript, focused/full ESLint, full unit tests, content-standard tests, and production build pass

The temporary validation workflow is removed after the final successful clean-state run.

## Next action

CLEANUP-018 — add focused completion-flow regression coverage before moving completion, XP, achievement, or server-action coordination out of `UnitTemplate`.

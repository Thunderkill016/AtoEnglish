# AtoEnglish codebase cleanup inventory

Updated: 2026-07-21

## Purpose

This document records cleanup evidence before deletion or structural refactoring. A candidate is not deleted merely because it looks unused.

Run the reproducible inventory:

```bash
npm run inventory
npm run inventory -- --write
```

The generated report is ignored by Git.

## Cleanup completed

### Repository-noise cleanup

- Disabled automatic maintenance-task generation.
- Removed automatic backlog edits, commits, and direct pushes.
- Reduced agent plan/backlog files to current and open work.
- Ignored runtime agent logs and generated inventory reports.

### Verified dead-code removals — foundation batch

Removed after import-graph analysis, repository-wide symbol/path searches, and successful post-deletion validation:

- `src/app/actions/unit-content.ts`
- `src/app/(main)/dashboard/components/DashboardMinimalClient.tsx`
- `src/components/learn/lesson-ui/LessonHeader.tsx`
- `src/components/learn/lesson-ui/LessonShell.tsx`

Validation: source 356 → 352; unreachable 17 → 13; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removals — notification-center batch

Removed the disconnected notification-center UI wrapper, components, hook, and copy utility. Preserved the history API, push permission UI, service worker, subscriptions, migrations, tables, and generated Supabase types.

Validation: source 352 → 347; unreachable 13 → 8; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removals — legacy exercise components

Removed:

- `src/components/exercises/ListenAndChooseExercise.tsx`
- `src/components/exercises/MatchingPairsGame.tsx`

Active exercise behavior remains in `DialogueSection` and `PracticeSection`.

Validation: source 347 → 345; unreachable 8 → 6; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removal — legacy landing outcomes section

Removed:

- `src/components/landing/OutcomesSection.tsx`

The active landing composition and copy were unchanged.

Validation: source 345 → 344; unreachable 6 → 5; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removals — unused shared UI

Removed after independent symbol/path verification found no consumers:

- `src/components/layout/user-avatar.tsx`
- `src/components/ui/logo.tsx`

Evidence:

- No static import, dynamic import, route/layout integration, export consumer, test, or script used either component.
- Active branding is rendered directly with `Sprout` and existing markup in the landing, login, and header surfaces.
- `HeaderShell` uses its own current authentication UI and does not import `UserAvatar`.
- No active navigation, avatar display, branding copy, or styling was rewritten.

Validation results:

- source files scanned: 344 → 342
- unreachable candidates: 5 → 3
- TypeScript passed
- ESLint passed
- unit tests passed

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 342
- Known entry points: 118
- Unreachable candidates: 3
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Remaining unreachable candidates

These remain review candidates, not automatic deletion instructions:

- `src/lib/lessons/enrich-unit.ts`
- `src/lib/supabase/middleware.ts`
- `src/types/index.ts`

Every candidate still requires symbol/path search, framework-convention review, and a dedicated post-deletion validation run.

## Active architecture debt

### `src/components/learn/UnitTemplate.tsx`

Classification: **active, oversized, high-priority refactor — never delete**

Current generated size: 1,348 lines. It owns lesson-domain types, section ordering, orchestration state, browser persistence, audio, server actions, completion logic, and celebration UI.

Safe refactor order:

1. Extract lesson types without breaking current imports.
2. Extract section constants.
3. Extract stateless helper components.
4. Extract local-storage hooks.
5. Extract completion logic.
6. Replace related state groups with a reducer only after focused behavior coverage exists.

### `src/app/actions/unit.ts`

Classification: **active, cleanup candidate**

The file combines completion transactions, XP, vocabulary seeding, achievements, streak handling, and cache revalidation. Structural splitting requires focused tests.

## Dependency review candidates

Do not remove packages from import-only results. Tailwind/PostCSS and type packages can be loaded implicitly; CLI and smoke tooling require config/script review. Dependency changes require lockfile review, clean installation, typecheck, lint, tests, and build validation.

## Deletion policy

A source file can be deleted only when all applicable checks pass:

- no static or dynamic import
- no Next.js/framework convention
- no script, config, migration, or operational reference
- no string-based runtime reference
- typecheck passes
- lint passes
- unit tests pass
- relevant integration, E2E, smoke, or build check passes when the area requires it

## Next cleanup batches

Review the remaining technical candidates independently:

1. `src/types/index.ts` — exact barrel-import verification.
2. `src/lib/lessons/enrich-unit.ts` — active unit-loading and fallback-behavior review.
3. `src/lib/supabase/middleware.ts` — proxy/session/auth refresh and framework-convention review.

Do not combine Supabase middleware deletion with lesson or type cleanup.
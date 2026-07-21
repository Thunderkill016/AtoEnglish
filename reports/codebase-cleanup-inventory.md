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

Validation results:

- source files scanned: 356 → 352
- unreachable candidates: 17 → 13
- TypeScript passed
- ESLint passed
- unit tests passed

### Verified dead-code removals — notification-center batch

Removed as one disconnected feature group after full-checkout search found no consumer outside the candidates:

- `src/components/layout/notification-center-wrapper.tsx`
- `src/features/notifications/components/NotificationCenter.tsx`
- `src/features/notifications/components/NotificationItem.tsx`
- `src/features/notifications/hooks/useNotificationCenter.ts`
- `src/features/notifications/utils/notificationCopy.ts`

Preserved:

- `src/app/api/notifications/history/route.ts`
- `PushPermissionCard`
- push/service-worker infrastructure
- notification migrations, tables, and generated Supabase types

Validation results:

- source files scanned: 352 → 347
- unreachable candidates: 13 → 8
- TypeScript passed
- ESLint passed
- unit tests passed

### Verified dead-code removals — legacy exercise components

Removed after exact symbol/path search confirmed no consumer:

- `src/components/exercises/ListenAndChooseExercise.tsx`
- `src/components/exercises/MatchingPairsGame.tsx`

Evidence:

- No static import, dynamic import, exported-type consumer, script, config, or runtime path referenced either component.
- The product still supports both exercise types through active lesson code:
  - `DialogueSection` consumes `listenAndChoose` content.
  - `PracticeSection` implements matching interactions and dictation from `listenAndChoose` data.
- Unit curriculum data, lesson types, content standards, scoring, section order, and audio behavior remain unchanged.

Validation results:

- source files scanned: 347 → 345
- unreachable candidates: 8 → 6
- TypeScript passed
- ESLint passed
- unit tests passed

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 345
- Known entry points: 118
- Unreachable candidates: 6
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Remaining unreachable candidates

These remain review candidates, not automatic deletion instructions:

- `src/components/landing/OutcomesSection.tsx`
- `src/components/layout/user-avatar.tsx`
- `src/components/ui/logo.tsx`
- `src/lib/lessons/enrich-unit.ts`
- `src/lib/supabase/middleware.ts`
- `src/types/index.ts`

Every candidate still requires symbol/path search, framework-convention review, and a dedicated post-deletion validation run.

## Active architecture debt

### `src/components/learn/UnitTemplate.tsx`

Classification: **active, oversized, high-priority refactor — never delete**

Current generated size: 1,348 lines.

It owns lesson-domain types, section ordering, orchestration state, browser persistence, audio, server actions, completion logic, and celebration UI.

Safe refactor order:

1. Extract lesson types without breaking current imports.
2. Extract section constants.
3. Extract stateless helper components.
4. Extract local-storage hooks.
5. Extract completion logic.
6. Replace related state groups with a reducer only after focused behavior coverage exists.

### `src/app/actions/unit.ts`

Classification: **active, cleanup candidate**

The file combines completion transactions, XP, vocabulary seeding, achievements, streak handling, and cache revalidation. Structural splitting requires focused tests. Its runtime CEFR tuple used only for a type remains a smaller independent cleanup candidate.

## Dependency review candidates

Do not remove packages from import-only results:

- Tailwind and PostCSS packages can be loaded through configuration.
- Type packages can be loaded implicitly by TypeScript.
- `shadcn` may be developer CLI tooling rather than runtime code.
- `wait-on` may be used by CI or smoke workflows.
- `gtts` supports audio-generation scripts.

Dependency changes require lockfile review, clean installation, typecheck, lint, tests, and build validation.

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

## Next cleanup batch

Verify the remaining candidates as independent logical groups, beginning with the legacy landing component `OutcomesSection.tsx`. Do not combine UI candidates with Supabase middleware or lesson transformation helpers.

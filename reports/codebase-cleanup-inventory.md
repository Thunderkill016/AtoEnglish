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

The following files were removed only after import-graph analysis, repository-wide symbol/path searches, and successful post-deletion validation:

- `src/app/actions/unit-content.ts`
- `src/app/(main)/dashboard/components/DashboardMinimalClient.tsx`
- `src/components/learn/lesson-ui/LessonHeader.tsx`
- `src/components/learn/lesson-ui/LessonShell.tsx`

Evidence:

- `unit-content.ts` had no caller or import; the active lesson route reads the 50 TypeScript unit files directly.
- `DashboardMinimalClient` had no code or documentation consumer outside its own file.
- `LessonHeader` and `LessonShell` had no code consumer; only old roadmap/design documents mentioned their names.
- Database migrations and generated Supabase types were not changed.
- The stale `unit-content.ts` exemption was removed from `scripts/audit-code.mjs`.

Validation after the foundation batch:

- dependency installation from the lockfile passed with lifecycle scripts disabled
- cleanup inventory passed
- TypeScript typecheck passed
- ESLint passed
- unit tests passed
- source files scanned changed from 356 to 352
- unreachable candidates changed from 17 to 13

### Verified dead-code removals — notification-center batch

The following closed feature group was removed after a full-checkout search confirmed there were no code consumers outside the candidate files:

- `src/components/layout/notification-center-wrapper.tsx`
- `src/features/notifications/components/NotificationCenter.tsx`
- `src/features/notifications/components/NotificationItem.tsx`
- `src/features/notifications/hooks/useNotificationCenter.ts`
- `src/features/notifications/utils/notificationCopy.ts`

Evidence:

- No layout, header, route, script, Supabase function, service worker, dynamic import, or runtime path referenced the notification-center wrapper, components, hook, or copy library.
- `PushPermissionCard` remains active and separate; it does not import the removed notification-center group.
- `src/app/api/notifications/history/route.ts`, notification migrations, generated types, push infrastructure, and database tables remain unchanged.
- A historical migration comment mentioning `NotificationCenter` was not edited because migrations are immutable history.

Validation after the notification-center batch:

- dependency installation from the lockfile passed with lifecycle scripts disabled
- cleanup inventory passed
- TypeScript typecheck passed
- ESLint passed
- unit tests passed
- source files scanned changed from 352 to 347
- unreachable candidates changed from 13 to 8

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 347
- Known entry points: 118
- Unreachable candidates: 8
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Remaining unreachable candidates

These remain review candidates, not automatic deletion instructions:

- `src/components/exercises/ListenAndChooseExercise.tsx`
- `src/components/exercises/MatchingPairsGame.tsx`
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

Verify `ListenAndChooseExercise.tsx` and `MatchingPairsGame.tsx` against the active lesson-section implementations. Remove only proven-unused files, then rerun the full validation gates in an executable checkout.

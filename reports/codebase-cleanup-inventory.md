# AtoEnglish codebase cleanup inventory

Updated: 2026-07-21

## Purpose

This document records cleanup evidence before deletion or structural refactoring. A candidate is not deleted merely because it looks unused.

Run the reproducible inventory:

```bash
npm run inventory
npm run inventory -- --write
```

The generated report is written to `reports/codebase-inventory.generated.md` only when `--write` is supplied and is ignored by Git.

## Completed cleanup

### Repository-noise cleanup

- Automatic maintenance-task generation is disabled.
- The refill script no longer edits the backlog, commits, or pushes.
- `AGENT_PLAN.md` contains current work only.
- `AGENT_BACKLOG.md` contains open work only.
- Runtime agent logs and generated inventory reports are ignored.

### Verified deletion: `src/app/actions/unit-content.ts`

Classification: **safe to delete — removed**

Evidence collected before deletion:

- The generated import graph classified the file as unreachable.
- Repository-wide `git grep` found no direct import path, `seedUnitContent` call, or `getUnitContent` call outside the candidate and cleanup documentation.
- The active `/learn/[unitSlug]` route imports all A0–B2 TypeScript unit files directly and does not read lesson content through this action.
- The file seeded only `unit-1` through `unit-4`, while the active curriculum contains 50 TypeScript-backed units.
- The database migration and generated Supabase types remain untouched; removing an unused action does not remove the table or alter production schema.

Validation after deletion:

- cleanup inventory passed
- TypeScript typecheck passed
- ESLint passed
- unit tests passed
- the generated inventory dropped from 356 to 355 source files and from 17 to 16 unreachable candidates

## Current generated-inventory summary

- Source files scanned: 355
- Known entry points: 118
- Unreachable candidates: 16
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Remaining unreachable candidates

These are review candidates, not automatic deletion instructions:

- `src/app/(main)/dashboard/components/DashboardMinimalClient.tsx`
- `src/components/exercises/ListenAndChooseExercise.tsx`
- `src/components/exercises/MatchingPairsGame.tsx`
- `src/components/landing/OutcomesSection.tsx`
- `src/components/layout/notification-center-wrapper.tsx`
- `src/components/layout/user-avatar.tsx`
- `src/components/learn/lesson-ui/LessonHeader.tsx`
- `src/components/learn/lesson-ui/LessonShell.tsx`
- `src/components/ui/logo.tsx`
- `src/features/notifications/components/NotificationCenter.tsx`
- `src/features/notifications/components/NotificationItem.tsx`
- `src/features/notifications/hooks/useNotificationCenter.ts`
- `src/features/notifications/utils/notificationCopy.ts`
- `src/lib/lessons/enrich-unit.ts`
- `src/lib/supabase/middleware.ts`
- `src/types/index.ts`

Each candidate still requires symbol/path search, framework-convention review, and a dedicated post-deletion validation run.

## Active architecture debt

### `src/components/learn/UnitTemplate.tsx`

Classification: **active, oversized, high-priority refactor — never delete**

Current generated size: 1,348 lines.

Observed responsibilities include lesson-domain types, section ordering, orchestration state, browser persistence, audio, server-action calls, completion logic, and celebration UI.

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

Do not remove these from an import-only result:

- Tailwind and PostCSS packages can be loaded through configuration.
- Type packages can be loaded implicitly by TypeScript.
- `shadcn` may be developer CLI tooling rather than runtime code.
- `wait-on` may be used by CI or smoke workflows.
- `gtts` supports audio-generation scripts.

Dependency changes require lockfile review, install verification, typecheck, lint, tests, and build validation.

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

Verify one tightly related remaining group, preferably the rollback-era minimal dashboard/lesson-shell files, then delete only the files proven unused and rerun the full cleanup validation workflow.

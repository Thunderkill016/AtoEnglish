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

Removed four unused source files after import-graph and repository-wide verification.

Validation: source 356 → 352; unreachable 17 → 13; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removals — notification-center batch

Removed the disconnected notification-center UI wrapper, components, hook, and copy utility. Preserved notification APIs, push infrastructure, migrations, tables, and generated types.

Validation: source 352 → 347; unreachable 13 → 8; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removals — legacy exercise components

Removed `ListenAndChooseExercise.tsx` and `MatchingPairsGame.tsx`. Active exercise behavior remains in `DialogueSection` and `PracticeSection`.

Validation: source 347 → 345; unreachable 8 → 6; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removal — legacy landing outcomes section

Removed `OutcomesSection.tsx` without changing active landing composition or copy.

Validation: source 345 → 344; unreachable 6 → 5; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removals — unused shared UI

Removed `user-avatar.tsx` and `logo.tsx` after independent verification. Active branding and header/auth UI remained unchanged.

Validation: source 344 → 342; unreachable 5 → 3; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removal — legacy type barrel

Removed:

- `src/types/index.ts`

Evidence:

- No exact import from `@/types` or `@/types/index` existed.
- No relative import terminated at the `types` directory or `types/index`.
- No dynamic import or CommonJS require referenced the barrel.
- Representative legacy aliases exported only by the barrel had no consumer.
- `src/types/database.ts` and `src/types/supabase.ts` remain unchanged.

Validation results:

- source files scanned: 342 → 341
- unreachable candidates: 3 → 2
- TypeScript passed
- ESLint passed
- unit tests passed

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 341
- Known entry points: 118
- Unreachable candidates: 2
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Remaining unreachable candidates

These remain review candidates, not automatic deletion instructions:

- `src/lib/lessons/enrich-unit.ts`
- `src/lib/supabase/middleware.ts`

Both require behavior-aware review beyond import reachability.

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

1. `src/lib/lessons/enrich-unit.ts` — inspect all unit-loading paths and confirm whether fallback enrichment is intentionally retired.
2. `src/lib/supabase/middleware.ts` — inspect `src/proxy.ts`, `session.ts`, auth refresh, protected routes, and framework conventions; require targeted auth validation before deletion.

Do not combine these two candidates in one pull request.
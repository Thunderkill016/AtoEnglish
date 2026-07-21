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

Removed `src/types/index.ts`. No alias, relative, dynamic, or CommonJS barrel consumer existed. `database.ts` and `supabase.ts` remain unchanged.

Validation: source 342 → 341; unreachable 3 → 2; TypeScript, ESLint, and unit tests passed.

### Verified dead-code removal — retired lesson enrichment fallback

Removed:

- `src/lib/lessons/enrich-unit.ts`

Evidence:

- `enrichUnitForLearning` and the module path had no runtime, static, dynamic, script, test, or route consumer.
- The active lesson route loads units directly from `UNIT_DATA_MAP` and passes them directly to `UnitTemplate`.
- All 50 active unit content files declare real `situation` and `learningOutcomes` values.
- `src/lib/lessons/content-standard.ts` already requires a valid situation and 2–5 learning outcomes, so incomplete content is rejected instead of repaired at runtime.
- No unit content, lesson order, scoring, audio, FSRS, or `UnitTemplate` implementation changed.

Validation results:

- source files scanned: 341 → 340
- unreachable candidates: 2 → 1
- TypeScript passed
- ESLint passed
- unit tests passed
- lesson content-standard tests passed
- production build passed

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 340
- Known entry points: 118
- Unreachable candidates: 1
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Remaining unreachable candidate

- `src/lib/supabase/middleware.ts`

This is not an automatic deletion instruction. It duplicates part of the current session client pattern but sits in the authentication boundary, so it requires targeted proxy/session/route-protection review and auth validation.

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

## Next cleanup batch

Review `src/lib/supabase/middleware.ts` independently against `src/proxy.ts`, `src/lib/supabase/session.ts`, cookie refresh behavior, protected-route redirects, login redirects, and Next.js proxy conventions. Require targeted auth tests plus production build before deletion.
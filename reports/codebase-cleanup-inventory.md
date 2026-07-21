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

Removed `src/lib/lessons/enrich-unit.ts` after confirming all 50 active units contain real `situation` and `learningOutcomes` fields and content-standard validation rejects incomplete content.

Validation: source 341 → 340; unreachable 2 → 1; TypeScript, ESLint, unit tests, lesson content-standard tests, and production build passed.

### Verified dead-code removal — obsolete Supabase middleware helper

Removed:

- `src/lib/supabase/middleware.ts`

Added durable regression coverage:

- `src/lib/supabase/session.test.ts`

Evidence:

- No static, dynamic, route, test, script, or tooling consumer referenced `createMiddlewareClient` or the old module path.
- The only Next.js convention entry is `src/proxy.ts`.
- `src/proxy.ts` imports and returns `updateSession` from `src/lib/supabase/session.ts`.
- `session.ts` already owns the same request/response cookie bridge as the removed helper, plus public-route bypass, protected-route redirects, authenticated login redirects, and missing-environment fallback.
- Focused tests cover missing environment variables, public routes, refreshed cookies, unauthenticated protected redirects, authenticated login redirects, and authenticated protected pass-through.
- No protected-route list, redirect destination, cookie option, rate limit, environment variable, dependency, database, or Supabase schema changed.

Validation results:

- source files scanned: 341 → 340 (one test added, one helper removed relative to the previous 340-file branch)
- known entry points: 118 → 119
- unreachable candidates: 1 → 0
- targeted session tests passed
- TypeScript passed
- ESLint passed
- full unit tests passed
- production build passed

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 340
- Known entry points: 119
- Unreachable candidates: 0
- Files with at least 500 lines: 32
- Possible unused runtime/tooling dependencies: 8
- Possible unused type packages: 2

## Unreachable source candidates

No candidates currently detected by the conservative source reachability inventory.

This does not mean the repository has no architecture debt or unused dependencies. Framework conventions, runtime strings, generated files, package CLIs, configuration-loaded plugins, and duplicated live code still require separate reviews.

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

### Protected-route test drift

`e2e/protected-routes.spec.ts` currently lists `/dashboard`, `/learn`, `/flashcards`, and `/speaking` as protected, while `src/lib/supabase/session.ts` intentionally comments those routes out for guest self-study. Reconcile this in a separate behavior/test PR rather than changing authentication policy inside a dead-code cleanup.

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

## Next cleanup work

1. Reconcile protected-route E2E expectations with the intentional guest-route policy in `session.ts` without changing production behavior.
2. Add focused lesson behavior coverage, then begin the first reversible `UnitTemplate` extraction.
3. Classify dependency candidates in configuration-aware groups before touching `package.json` or the lockfile.

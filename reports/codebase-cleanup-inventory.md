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

### Verified dead-code removals

The cleanup stack removed disconnected source only after repository-wide usage checks and post-deletion validation:

- foundation dead code: 4 files
- disconnected notification-center feature: 5 files
- legacy exercise components: 2 files
- legacy landing outcomes section: 1 file
- unused shared UI components: 2 files
- legacy type barrel: 1 file
- retired lesson enrichment fallback: 1 file
- obsolete Supabase middleware helper: 1 file

Durable Supabase session regression coverage was added while removing the obsolete auth helper.

Cumulative source reachability result before architecture-oriented test and extraction files:

- source files scanned: 356 → 340
- known entry points: 119
- unreachable candidates: 17 → 0

TypeScript, ESLint, unit tests, area-specific tests, and production builds passed for the applicable batches.

### Protected-route E2E reconciliation

`e2e/protected-routes.spec.ts` matches the guest self-study policy implemented in `src/lib/supabase/session.ts`:

- `/dashboard`, `/learn/*`, `/flashcards`, and `/speaking` are guest-accessible
- `/certificate` and `/checkpoint` are protected
- the A0 slug is `/learn/unit-a0-1`
- protected redirects verify `/login`, `next`, and `mode=login`

All 26 targeted Chromium route, landing, and health-check E2E tests passed against a production Next.js server. No production authentication logic changed.

### Dependency classification

Applied package changes:

- removed `@types/recharts`
- removed `tw-animate-css`
- moved `@tailwindcss/postcss` to development dependencies
- moved `shadcn` to development dependencies

Verified and retained as configuration, framework, CI, or type-system dependencies:

- `lint-staged`
- `postcss`
- `react-dom`
- `typescript`
- `wait-on`
- `@types/node`
- `@types/react-dom`
- development-only `@tailwindcss/postcss`
- development-only `shadcn`

The npm-generated lockfile clean-installed and regenerated with zero diff. TypeScript, ESLint, full unit tests, lesson content-standard tests, and production build passed without changing package versions.

Detailed evidence: `reports/dependency-classification.md`.

### UnitTemplate behavior foundation

Added durable component-level coverage:

- `src/components/learn/UnitTemplate.test.tsx`

The four focused tests protect:

- restoration of saved progress using section order `[1, 2, 3, 4, 5, 10, 9, 6, 7, 8]`
- `dialogues_list` normalization
- quick-review navigation from Practice directly to Quiz
- section-4 persistence and final-section progress removal
- guest completion storage while preserving `completeUnit(unitId, starCount)` and `nextRoute`

No production source file changed in the test-foundation batch.

### UnitTemplate lesson types and constants extraction

Added:

- `src/components/learn/lesson-types.ts`
- `src/components/learn/lesson-sections.ts`
- `src/components/learn/lesson-sections.test.ts`

`UnitTemplate.tsx` now imports lesson-domain types and section constants from the dedicated modules. It re-exports every previously public lesson type, preserving the existing imports used by lesson routes, section components, unit data files, scripts, and exercises.

Preserved exactly:

- section order `[1, 2, 3, 4, 5, 10, 9, 6, 7, 8]`
- all ten section labels
- `TOTAL_SECTIONS === 10`
- runtime rendering, scoring, XP, completion, localStorage, audio, FSRS, route, and lesson-content behavior

Focused diff and size results:

- `UnitTemplate.tsx` diff: `+47/-213`
- `UnitTemplate.tsx` size: 1,348 → 1,182 lines
- source files scanned: 341 → 344
- known entry points: 120 → 121
- unreachable candidates remained 0

Validation results:

- 6 targeted tests passed: 4 orchestration tests and 2 exact constants tests
- TypeScript passed across all existing type consumers
- focused and full ESLint passed
- full unit tests passed
- lesson content-standard tests passed
- production build passed

Temporary GitHub Actions workflows used for full-checkout verification are removed after their final successful run so they do not consume future Actions minutes.

## Current inventory summary

- Source files scanned: 344
- Known entry points: 121
- Unreachable candidates: 0
- Files with at least 500 lines: 32
- Conservative dependency warnings: 6 runtime/tooling and 1 type package

The remaining dependency warnings are configuration/framework/type-system false positives already classified as retained packages. They are not open deletion tasks.

## Unreachable source candidates

No candidates currently detected by the conservative source reachability inventory.

This does not mean the repository has no architecture debt. Large active components, duplicated live logic, and behavior-sensitive boundaries require tests and incremental refactoring rather than deletion.

## Active architecture debt

### `src/components/learn/UnitTemplate.tsx`

Classification: **active, oversized, high-priority refactor — never delete**

Current generated size: 1,182 lines. It still owns orchestration state, browser persistence, audio, server-action coordination, scoring, completion logic, and celebration UI.

Safe refactor order:

1. Focused lesson behavior coverage — complete.
2. Extract lesson types and section constants — complete.
3. Add production-server lesson smoke/E2E coverage.
4. Extract stateless helper components.
5. Extract local-storage hooks after persistence-specific coverage.
6. Extract completion logic after server-action and achievement coverage.
7. Replace related state groups with a reducer only after each state transition is covered.

### `src/app/actions/unit.ts`

Classification: **active, behavior-sensitive cleanup candidate**

The file combines completion transactions, XP, vocabulary seeding, achievements, streak handling, and cache revalidation. Structural splitting requires focused tests and transaction-aware review.

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

CLEANUP-016 — run or strengthen a focused lesson smoke/E2E flow against a production Next.js server. Do not extract stateless helpers until a real lesson route, section navigation, and quick-review-to-Quiz flow are covered.

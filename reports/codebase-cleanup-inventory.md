# AtoEnglish codebase cleanup inventory

Updated: 2026-07-21

## Purpose

This document records cleanup evidence before deletion or structural refactoring. A candidate is not deleted merely because it looks unused.

Run the reproducible inventory locally:

```bash
npm run inventory
npm run inventory -- --write
```

The generated report is written to `reports/codebase-inventory.generated.md` only when `--write` is supplied.

## Verified repository-noise findings

### Resolved in CLEANUP-001

- Automatic maintenance-task generation has been disabled.
- The refill script no longer edits the backlog, commits, or pushes.
- `AGENT_PLAN.md` now contains current work only.
- `AGENT_BACKLOG.md` now contains active cleanup tasks only.
- Durable rules remain in `AGENTS.md`; historical detail belongs in Git and pull requests.

## Source candidates

### `src/app/actions/unit-content.ts`

Classification: **likely unused — verify before deletion**

Evidence:

- The file seeds only `unit-1` through `unit-4` into the `unit_content` table.
- The active `/learn/[unitSlug]` route imports all A0–B2 TypeScript unit files directly and builds `UNIT_DATA_MAP` from those imports.
- `scripts/audit-code.mjs` already contains a special exemption describing `unit-content.ts` as unused/dead code.

Required verification:

1. Run `npm run inventory` and confirm the file appears unreachable.
2. Search for `seedUnitContent`, `getUnitContent`, `unit-content`, and `unit_content` across source, scripts, tests, migrations, and documentation.
3. Confirm no admin-only or one-time operational workflow imports the action.
4. Delete it in a dedicated commit, then run typecheck, lint, unit tests, and the lesson smoke test.

### `src/components/learn/UnitTemplate.tsx`

Classification: **active, oversized, high-priority refactor — never delete**

Observed responsibilities include:

- lesson-domain type declarations
- lesson section ordering and labels
- orchestration state for warmup, vocabulary, grammar, quizzes, retries, cumulative review, shadowing, speaking, XP, and completion
- local-storage persistence
- audio and sound effects
- server-action calls
- completion and celebration UI
- embedded helper components

Refactor order:

1. Extract lesson types without changing exports used by current callers.
2. Extract section constants.
3. Extract stateless helper components.
4. Extract local-storage hooks.
5. Extract completion logic.
6. Replace related state groups with a reducer only after behavior is covered.

Each extraction must be behavior-preserving and independently reviewable.

### `src/app/actions/unit.ts`

Classification: **active, cleanup candidate**

The file contains a CEFR tuple used only to derive a type and is then explicitly referenced with `void CEFR_LEVEL_ORDER` to silence unused-code checks. This is a small cleanup candidate: replace the runtime tuple with a type-only literal union after confirming there are no runtime consumers.

The same file also combines unit completion, XP, vocabulary seeding, achievements, streak handling, and cache revalidation. Structural splitting should happen only after the current behavior has focused tests.

## Dependency review candidates

Do not remove these until `npm run inventory` and repository-wide searches are reviewed.

- `@types/recharts`: verify whether it is still required with the installed Recharts version; if required, it belongs in `devDependencies`, not runtime dependencies.
- `shadcn`: likely CLI/tooling rather than runtime code; verify scripts and developer workflow.
- `wait-on`: verify whether a CI or smoke script invokes it.
- `gtts`: expected to support audio-generation scripts; keep if those scripts remain supported.
- Type packages can appear unused to import-based scanners because TypeScript loads them implicitly.
- Tailwind/PostCSS packages can appear unused because configuration loads them outside normal source imports.

## Documentation drift

The following must be reconciled from executable sources rather than manually guessed:

- test-count badges and comments disagree across README, AGENTS, and maintenance history
- README database rows contain duplicate or stale entries
- architecture documentation understates the number of lesson units and the size/responsibility of `UnitTemplate`
- deployment documentation refers to multiple GitHub/GitLab flows

Policy: avoid hard-coded test counts in durable docs unless generated automatically.

## Deletion policy

A file or dependency can move from candidate to safe-to-delete only when all applicable checks pass:

- no static import
- no dynamic import
- no framework convention
- no script/config reference
- no string-based runtime reference
- no migration or operational dependency
- typecheck passes
- lint passes
- unit tests pass
- relevant integration/E2E or smoke test passes

## Next cleanup batch

CLEANUP-003 should run the inventory in a full checkout, review each result, and remove only the first verified dead-code candidate in a dedicated commit.
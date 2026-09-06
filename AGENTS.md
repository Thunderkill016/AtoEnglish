# AGENTS.md — AtoEnglish

This is the single repository operating contract for coding agents.

## Identity

- Project: **AtoEnglish**.
- Historical names/programs such as Nếp, Real Talk, YouTube-to-Curriculum, CycleWarden, OpenPronounce and old pilot/research programs do not authorize work.
- Historical docs are intentionally absent from the working tree. Use Git/closed PR/issue history only when a current task explicitly needs them.

## Read before non-trivial work

1. `docs/project/PROJECT_STATE.md`
2. `docs/project/SOURCE_OF_TRUTH.md`
3. the active GitHub issue/PR that authorizes the task
4. the exact current code, tests, migrations and verified production facts relevant to it

If there is no active task or owner decision, do not invent maintenance, refactors, research, benchmarks or a roadmap merely to stay busy.

## Scope discipline

Every non-trivial change must have:

- a concrete current blocker/outcome;
- bounded scope and explicit non-goals;
- verification appropriate to the changed surface;
- rollback/recovery thinking where the change is risky.

Do not revive an old architecture or product direction because its historical artifact looks detailed or complete.

## Git and production safety

1. Work from the intended exact base on a dedicated branch.
2. Do not force-update shared branches unless an explicit recovery decision requires it.
3. Do not push autonomous changes directly to `main`.
4. Merge or deploy only with explicit owner authorization and exact-head verification.
5. Never expose secrets or commit local environment files.
6. Do not write production DB state during ordinary audit/review work.
7. Treat GitHub `main`, CI, Supabase production and Vercel production as distinct states until explicitly reconciled.
8. Before release, identify the exact GitHub commit, Supabase migration/runtime state and Vercel production deployment.

## Autonomy

`.agent-autopilot-disabled` is authoritative. Do not restore daemon/cron/headless orchestration, backlog refill, automatic pushes, automatic PR creation or automatic deployment without an explicit reviewed owner decision.

## Evidence discipline

Keep these separate:

1. repository correctness;
2. infrastructure/runtime correctness;
3. model/measurement validity;
4. usability;
5. learner/learning evidence;
6. market evidence.

Tests and synthetic data prove only the level they actually test.

## Technical baseline

The repository is a Next.js/React/TypeScript/Supabase application with Vitest, Playwright and GitHub Verify checks. Existing code, config, migrations and tests are the implementation source of truth.

Common checks:

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run test:content-standard
npm run build
```

Database-sensitive changes additionally require fresh migration replay, database lint and pgTAP/RLS checks through the current Verify workflow.

Never claim a check passed unless it ran against the exact committed state being reviewed.

## Product direction

No historical roadmap is active by default. Once release consistency is resolved, future AtoEnglish product work must be selected explicitly from current learner/product evidence and current repository reality.

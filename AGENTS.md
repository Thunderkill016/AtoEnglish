# AGENTS.md — AtoEnglish

> Current project: **AtoEnglish**.  
> Current mode: **project reset / audit**.  
> Canonical state: `docs/project/PROJECT_STATE.md`.

This file is the default operating contract for coding agents working in this repository.

## Identity

AtoEnglish is the project.

**Nếp is historical/R&D work, not the current product identity or roadmap.** A branch, issue, PR, spec, benchmark, namespace, or old document containing Nếp does not authorize new work by itself.

## Mandatory reading order

Before any non-trivial work:

1. `docs/project/PROJECT_STATE.md`
2. `docs/project/SOURCE_OF_TRUTH.md`
3. the explicitly active GitHub issue/PR named by `PROJECT_STATE.md`
4. the exact current implementation, tests, migrations and production facts relevant to that task
5. `docs/project/ARCHIVE_INDEX.md` only when reusing historical work

Historical `docs/product/**`, old curriculum roadmaps, experiment specs, agent roadmaps and archived PRs are reference/history only unless a current bounded task explicitly reactivates them.

## Reset mode

Until PROJECT-RESET-001 (#151) is complete:

- do not choose a new product roadmap;
- do not add learner-facing features;
- do not expand Nếp/Core, learner-model, Realtime, OpenPronounce or pronunciation R&D;
- do not revive the 28-day pilot, Real Talk, YouTube-to-Curriculum, or another historical direction automatically;
- do not deploy or write/migrate production state as part of cleanup;
- do not merge automatically.

Active work is limited to #151, #152, PR #87 review, and newly discovered P0 security/privacy/data-integrity defects.

## Work selection

An agent may work only when it can name:

- the active issue/task authorizing the work;
- the current blocker;
- exact scope;
- forbidden scope;
- required verification;
- rollback/recovery boundary where relevant.

If no active task exists, stop. Do not invent maintenance, refactors, research, benchmarks, task-pool items, or “next logical steps” to stay busy.

## Git and production safety

1. Work on a dedicated branch from the intended exact base.
2. Never force-update a branch unless an explicit recovery decision requires it.
3. Never push autonomous changes directly to `main`.
4. Never merge or deploy automatically.
5. Never write to production DB during ordinary audit/review work.
6. Never expose secrets or commit local environment files.
7. Treat Vercel preview success, CI success, GitHub `main`, and Supabase production as separate states until reconciled.
8. Before any release, identify the exact GitHub commit, Supabase migration head/runtime contract, and Vercel production deployment.

## Autonomy

`.agent-autopilot-disabled` remains authoritative.

Do not restore cron, daemon, headless sessions, auto-refill, automatic pushes, automatic PR creation, or old `AGENT_ROADMAP.md` task-pool behavior without an explicit reviewed owner decision.

## Evidence discipline

Keep these levels separate:

1. repository correctness;
2. infrastructure/runtime correctness;
3. model/measurement validity;
4. usability;
5. learner/learning evidence;
6. market evidence.

Passing tests proves repository behavior, not learning effectiveness. Synthetic data proves only what the synthetic experiment actually tests.

## Current known P0 release consistency facts

See #152 and `docs/project/PROJECT_STATE.md`.

At reset start:

- GitHub `main` = `b6db4731471f5e454b1c732cac595fd538f89c1a`;
- Vercel production is still on `1e462367d365d03e01d2b211da2499ac612a57ff`;
- Supabase production lacks repository migration `20260903090000_learner_evidence_coverage`;
- production canonical learner tables reject authenticated direct writes;
- `record_learning_attempt(...)` is the production write RPC;
- PR #87 is retained as a concrete compatibility candidate.

Do not “fix” these opportunistically inside unrelated work.

## Technical baseline

The current repository remains a Next.js/React/TypeScript/Supabase application with Vitest, Playwright and GitHub Verify checks.

Use the existing scripts and current code as the implementation source of truth. Do not resurrect a historical architecture merely because its docs are more detailed.

Common checks:

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run test:content-standard
npm run build
```

Database-sensitive changes additionally require fresh migration replay, database lint and pgTAP/RLS checks through the existing verification path.

Do not claim a check passed unless it actually ran against the exact committed state being reviewed.

## Cleanup rule

Cleanup is allowed only under the reset task and must remain reversible:

- prefer status stubs and archive indexes over destructive history deletion;
- preserve useful branches/commits;
- close superseded GitHub work instead of pretending it is current;
- separate genuine production bugs from speculative R&D;
- do not combine cleanup with feature development.

## After reset

A new AtoEnglish product direction must be researched and selected explicitly after #151 is complete. Historical projects may inform that decision, but none is automatically reinstated.

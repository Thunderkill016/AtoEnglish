# AtoEnglish Source of Truth

**Status:** canonical during and after the 2026-09-06 project reset unless superseded by an explicit reviewed owner decision.

## Authority order

When repository sources disagree, use this order:

1. **Current owner decision recorded in `docs/project/PROJECT_STATE.md`**.
2. **Current `main` runtime code, migrations, configuration, and read-only verified production facts** for statements about what the system actually does.
3. **Explicitly active GitHub issues/PRs listed in `PROJECT_STATE.md`** for bounded work currently in progress.
4. **Durable technical/research references** for implementation knowledge, provided they do not claim current product authority.
5. **Historical product documents, old roadmaps, closed/open archived PRs, old issues, experiment branches, agent logs and specs** as evidence/history only.

A lower-ranked source may not silently override a higher-ranked source.

## Product identity rule

The project is **AtoEnglish**.

Any source that describes **Nếp** as the current product, current engine mandate, current roadmap, or current governing source is historical/superseded unless `PROJECT_STATE.md` explicitly reactivates a bounded part of it.

## Historical work is not deleted

Historical work can remain valuable. Archiving means:

- preserve Git commits and branches;
- preserve useful research, tests, experiments and findings;
- remove the work from the active queue;
- prevent old docs/issues from automatically selecting new work;
- require an explicit future AtoEnglish task to reuse it.

Archived does not mean incorrect. It means **non-authoritative now**.

## GitHub work-selection rule

Only work explicitly named active in `PROJECT_STATE.md` may be treated as the current queue.

An old open issue, Draft PR, branch name, spec checklist, agent backlog, or research TODO is not enough to make work active.

During reset the active set is limited to:

- #151 project reset;
- #152 production/release consistency;
- PR #87 compatibility review;
- newly discovered P0 security/privacy/data-integrity defects.

## Documentation rule

Documents that remain useful but represent an old product direction must carry a visible historical/reference status and point back to `docs/project/PROJECT_STATE.md`.

Do not maintain parallel current roadmaps in:

- `AGENT_ROADMAP.md`;
- `AGENT_BACKLOG.md`;
- `AGENT_PLAN.md`;
- `docs/product/**`;
- experiment/spec directories;
- PR descriptions.

Those files may describe scope/history, but `PROJECT_STATE.md` decides whether the scope is active.

## Production truth rule

Never infer production state from GitHub alone.

For release-sensitive decisions reconcile all three:

1. exact GitHub commit;
2. exact Supabase migration/runtime contract state;
3. exact Vercel production deployment.

A green preview, green CI, or migration file in the repo does not prove production synchronization.

## Evidence rule

Keep evidence levels separate:

- repository correctness;
- infrastructure/runtime correctness;
- model/measurement validity;
- usability;
- learner/learning evidence;
- market evidence.

No lower level substitutes for a higher one.

## Agent rule

Agents must not generate work merely to remain busy.

Before non-trivial work they must identify:

- the active issue/task that authorizes it;
- why it is active under `PROJECT_STATE.md`;
- exact scope;
- prohibited scope;
- verification needed;
- rollback/recovery path where relevant.

If none exists, stop. Do not revive historical roadmaps automatically.

## Autonomy rule

`.agent-autopilot-disabled` remains authoritative. Old daemon/backlog-refill/task-pool material is historical and must not be executed.

## Conflict handling

When a conflict is discovered:

1. do not guess;
2. record the conflicting sources;
3. prefer verified runtime facts for descriptive questions;
4. prefer `PROJECT_STATE.md` for current project/roadmap authority;
5. create or update one bounded issue when a real decision is required.

Do not solve documentation conflict by creating another competing roadmap.

# AtoEnglish — Source of Truth

## Authority order

When sources disagree, use this order:

1. explicit current owner decision recorded in `docs/project/PROJECT_STATE.md`;
2. current `main` code, migrations, configuration and tests for what the repository actually does;
3. directly verified production state for what production actually does;
4. explicitly active GitHub issue/PR for bounded work in progress;
5. Git history, closed PRs/issues and old branches as historical evidence only.

A lower-ranked source cannot silently override a higher-ranked source.

## Product identity

The project is **AtoEnglish**.

Historical names, roadmaps, experiments and R&D programs do not become current product authority merely because their branches/commits still exist.

## Documentation rule

The working tree intentionally keeps only a small current documentation set:

- `README.md`
- `SECURITY.md`
- `AGENTS.md`
- `docs/project/PROJECT_STATE.md`
- `docs/project/SOURCE_OF_TRUTH.md`

Do not recreate parallel roadmap, backlog, reset-report, archive-index, design-mandate or research-spec documents unless a current bounded task genuinely requires a durable artifact.

Historical material belongs in Git history/closed PRs/issues, not in a second active documentation tree.

## Work selection

Only an explicit current owner decision or active issue/task can authorize new work. A detailed old branch, spec, TODO, experiment or architecture is not a task queue.

If no current task exists, stop rather than manufacture work.

## Production truth

Never infer production state from GitHub alone. For release-sensitive work reconcile:

1. exact GitHub commit;
2. exact Supabase migration/runtime state;
3. exact Vercel production deployment.

CI green, preview green, or a migration file present in the repo does not prove production is synchronized.

## Evidence levels

Keep separate:

- repository correctness;
- infrastructure/runtime correctness;
- model/measurement validity;
- usability;
- learner/learning evidence;
- market evidence.

No lower level substitutes for a higher one.

## Autonomy

`.agent-autopilot-disabled` is authoritative. Autonomous daemon/backlog-refill/push/PR/deploy behavior must not be restored without an explicit reviewed owner decision.

## Conflict handling

When a conflict appears:

1. identify the conflicting sources;
2. use current code/verified production facts for descriptive reality;
3. use `PROJECT_STATE.md` for current project authority;
4. create or update one bounded issue only if a real unresolved decision remains.

Do not solve a source-of-truth conflict by creating another competing roadmap.

# AtoEnglish — Source of Truth

## Authority order

When sources disagree, use this order:

1. explicit current owner decision recorded in `docs/project/PROJECT_STATE.md`;
2. current `main` code, migrations, configuration and tests for what the repository actually does;
3. directly verified production state for what production actually does;
4. explicitly active GitHub issue/PR for bounded work in progress that stays inside the single active direction;
5. Git history, closed PRs/issues and old branches as historical evidence only.

A lower-ranked source cannot silently override a higher-ranked source.

## Product identity

The project is **AtoEnglish**.

Historical names, roadmaps, experiments and R&D programs do not become current product authority merely because their branches/commits still exist.

## Single-direction authority

`docs/project/PROJECT_STATE.md` defines the **one and only active product direction**.

Everything else is subordinate to it. Code, existing features, old curriculum, branches, issues, research, AI suggestions and historical artifacts may provide evidence or implementation details, but they cannot create a second direction.

No agent or contributor may infer, propose, activate or maintain a parallel product direction without an explicit current owner decision that replaces the existing direction.

A suggestion to "explore", "try another approach", "start a parallel track", "rethink the product", "create a new roadmap" or equivalent is not authorization.

## Direction-change rule

The active direction changes only when the owner explicitly states that the current direction is being replaced.

A valid replacement decision must be explicit. It cannot be inferred from:

- a new feature request;
- a research result;
- a bug;
- an issue or PR;
- an AI recommendation;
- an old plan or branch;
- an implementation constraint.

Until such a replacement decision exists, all work must serve the current single direction.

## Documentation rule

The working tree intentionally keeps only a small current documentation set:

- `README.md`
- `SECURITY.md`
- `AGENTS.md`
- `docs/project/PROJECT_STATE.md`
- `docs/project/SOURCE_OF_TRUTH.md`

Do not recreate parallel roadmap, backlog, reset-report, archive-index, design-mandate, strategy tree or competing research-spec documents.

Historical material belongs in Git history/closed PRs/issues, not in a second active documentation tree.

## Work selection

Only an explicit current owner task can authorize product work, and that task must fit the single active direction in `PROJECT_STATE.md`.

Security, privacy, data-integrity, release and correctness defects may be fixed when they block or endanger the product, but they do not create a new product direction.

If a proposed task does not clearly advance the single active direction or resolve one of those concrete blockers, stop rather than manufacture work.

Do not convert ambiguity into a roadmap, feature track, research program or new direction.

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

Evidence may refine execution inside the active direction. Evidence does not automatically authorize a different direction.

## Autonomy

`.agent-autopilot-disabled` is authoritative. Autonomous daemon/backlog-refill/push/PR/deploy behavior must not be restored without an explicit reviewed owner decision.

Autonomy must never be used to generate product direction, strategy, roadmap, backlog or speculative work.

## Conflict handling

When a conflict appears:

1. identify the conflicting sources;
2. use current code/verified production facts for descriptive reality;
3. use `PROJECT_STATE.md` for current product authority and direction;
4. discard or archive lower-authority direction claims;
5. create or update a bounded issue only when it is required to execute the existing direction or fix a concrete blocker.

Do not solve a source-of-truth conflict by creating another competing roadmap or direction.

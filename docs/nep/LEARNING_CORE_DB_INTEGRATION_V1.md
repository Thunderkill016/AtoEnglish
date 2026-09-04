# Learning Core Database Integration V1

> **Document status:** reference
> **Governing authority:** [constitution](../../.specify/memory/constitution.md); it wins on conflict

## Purpose

This slice makes the adaptive learning data path verifiable against a real, disposable Postgres/Supabase database before hosted rollout, then records the hosted verification once the same learning-core contract is applied.

CI remains isolated from production: it starts a fresh local Postgres 17 database, replays every repository migration, lints database functions, runs pgTAP tests, then discards the runner.

## Hosted production status

On 2026-09-03 the AtoEnglish Supabase project `zpiwddskhduuykpxltun` was inspected before deployment. It did not contain the canonical learning-core tables and had not applied the July learning-attempt migration or the September learning-core migrations.

After local CI and hosted advisor review passed, the four canonical learning-core migrations were applied to production and the migration history was aligned to repository versions:

- `20260902130000_learning_core_foundation`
- `20260902133000_record_learning_attempt`
- `20260902133500_learning_evidence_constraints`
- `20260902134000_privacy_safe_oral_observation`

Hosted verification then confirmed:

- `public.learning_attempts`, `public.learning_evidence_events`, and `public.learner_skill_states` exist;
- all three learner-data tables have RLS enabled;
- `authenticated` has SELECT but no direct INSERT/UPDATE/DELETE on the canonical learner-data tables;
- `public.record_learning_attempt(...)` exists;
- `private.has_observed_oral_response(text, jsonb)` exists;
- the defense-in-depth `enforce_learning_evidence_event` trigger exists;
- an authenticated speech-production RPC call succeeds with `response_text = NULL` and derived `responseSource='speech'` / `responseLength>0` metadata;
- the hosted smoke test ran inside a transaction and rollback left zero attempt, evidence, or learner-state test rows;
- post-deployment Supabase advisors produced no new learning-core security or performance WARN findings. Remaining WARN findings are pre-existing and outside this slice.

The application route is still activated separately through the GitHub/Vercel integration gate so database deployment and learner-facing traffic are not coupled into one irreversible step.

## Migration-chain compatibility issue found

The repository already contained `20260731162613_learning_attempts.sql`, whose table contract was:

- bigint identity `id`
- `lesson_id`
- `activity_id`
- coarse `modality`
- `status`
- 0–100 `score`
- `error_tags`

The September canonical migration originally used `CREATE TABLE IF NOT EXISTS public.learning_attempts (...)` and assumed a different schema:

- UUID `id`
- `knowledge_item_id` / `capability_id`
- `exercise_type`
- response modality
- reveal/support/latency metadata
- immutable Attempt -> Evidence -> LearnerSkillState flow

A clean migration replay would therefore keep the July table and fail later when the canonical RPC referenced columns that did not exist.

### Resolution

`20260902133000_record_learning_attempt.sql` now detects the July schema before creating the canonical table.

If the legacy contract is present it is renamed to:

`public.learning_attempts_legacy_202607`

Its legacy indexes/identity sequence are renamed as well. Learner-facing `anon`/`authenticated` privileges are revoked from the archive, while `service_role` retains maintenance access. No legacy rows are dropped.

The canonical `public.learning_attempts` table is then created under the stable name expected by the new learning core.

## Historical migration dependency issue found

The first fresh-database CI run exposed an older migration-order problem before the September migrations were reached. `20260620031600_cefr_progression.sql` attempted to attach a trigger to `public.user_lesson_progress`, but that table is only created later by `20260621160000_schema_consolidation.sql`.

The earlier migration now defines the CEFR functions and only attaches the trigger when the table already exists. The consolidation migration explicitly installs the same trigger after creating the table. This preserves the feature while making full migration replay deterministic.

## Local Supabase harness

`supabase/config.toml` intentionally contains no hosted project reference or credentials.

Local database major version is pinned to PostgreSQL 17 to match the hosted AtoEnglish project.

Developer commands use Supabase CLI `2.116.0`:

```bash
npm run db:start
npm run db:lint
npm run db:test
npm run db:types
```

`db:types` now generates from the local schema instead of the obsolete hard-coded hosted project ref that previously existed in `package.json`.

## CI gate

The `Verify` workflow has a separate database job:

1. install Supabase CLI 2.116.0;
2. `supabase db start` on a clean GitHub runner;
3. replay the full migration history;
4. `supabase db lint --local --level error --fail-on error`;
5. `supabase test db --local`.

The database gate runs independently from lint/TypeScript/Vitest/content checks so migration failures are visible as database failures rather than application-test noise.

GitHub Verify run #385 passed both the application and database jobs for the full stack against `main`.

## pgTAP invariants

`supabase/tests/database/learning_core.test.sql` verifies:

- legacy July attempt schema is preserved as a non-Data-API archive;
- canonical attempt/evidence/state tables exist after full replay;
- canonical attempt IDs are UUIDs;
- RLS is enabled on all learner-data tables;
- authenticated users have SELECT only on canonical learner tables;
- anonymous users cannot read attempts;
- direct attempt/evidence/state writes are unavailable to learners;
- authenticated users can call `record_learning_attempt`, anonymous users cannot;
- valid recognition produces an immutable attempt, evidence event and learner-state update;
- one learner cannot read another learner's attempts;
- privacy-safe speech metadata can create oral evidence while `response_text` remains NULL;
- typed fallback cannot create production evidence;
- revealed attempts cannot create independent retrieval evidence;
- learners cannot forge evidence rows directly;
- transfer requires prior successful production in a different context;
- failed same-context transfer leaves no orphan attempt;
- successful production and transfer update separate learner-state channels.

## Activation rule

The hosted database is ready for the learning-core contract. Learner-facing activation still requires:

1. a Vercel preview built from the full integration head;
2. `/adaptive-preview` smoke verification against the hosted backend;
3. no blocking runtime/build errors;
4. merge to `main` only after those checks pass.

This keeps the adaptive route rollout reversible even though its database foundation is already present.

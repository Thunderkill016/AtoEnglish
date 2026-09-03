# Learning Core Database Integration V1

## Purpose

This slice makes the adaptive learning data path verifiable against a real, disposable Postgres/Supabase database before any production migration is applied.

Production is not part of this test path. CI starts a fresh local Postgres 17 database, replays every repository migration, lints database functions, runs pgTAP tests, then discards the runner.

## Production status at implementation time

On 2026-09-03 the hosted AtoEnglish project `zpiwddskhduuykpxltun` was inspected read-only.

The hosted database did not contain:

- `public.learning_attempts`
- `public.learning_evidence_events`
- `public.learner_skill_states`

The July `20260731162613_learning_attempts` migration and the September learning-core migrations were also absent from hosted migration history. No production schema or data was changed while building this gate.

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

The `Verify` workflow now has a separate database job:

1. install Supabase CLI 2.116.0;
2. `supabase db start` on a clean GitHub runner;
3. replay the full migration history;
4. `supabase db lint --local --level error --fail-on error`;
5. `supabase test db --local`.

The database gate runs independently from lint/TypeScript/Vitest/content checks so migration failures are visible as database failures rather than application-test noise.

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

## Deployment rule

A green repository `Verify` workflow is necessary but not sufficient to deploy learning-core migrations to the hosted project.

Before production migration:

1. this local migration/RLS gate must be green;
2. Supabase database/security advisors must be reviewed on the hosted project;
3. migration diff/apply plan must be reviewed explicitly;
4. production mutation requires a separate deliberate deployment action.

# T049 Hosted Supabase Types Verification

**Observed:** 2026-08-03  
**Supabase project:** `zpiwddskhduuykpxltun`  
**Application deployment:** none  
**Authorized schema migration:** none

## Purpose

Replace the stale full generated `src/types/supabase.ts` with the current hosted
project baseline, while keeping every versioned but unapplied schema change
explicit and separate from generated truth.

## Authoritative hosted input

The Supabase TypeScript generator was invoked repeatedly against project
`zpiwddskhduuykpxltun`. The responses described PostgREST `14.5` and the same
public schema.

The stale local snapshot differed from the hosted generator in these table keys:

```text
removed from generated hosted truth: learning_attempts
added from hosted truth:             lesson_v2_evidence
added from hosted truth:             pilot_events
added from hosted truth:             real_talk_lessons
added from hosted truth:             real_talk_videos
added from hosted truth:             user_v2_lesson_progress
```

The committed generated baseline has Git blob:

```text
src/types/supabase.ts
blob = 48a637a2ece5c4c6000e3c62d21205230a940eed
```

The inspected artifact and committed GitHub blob were byte-identical. Contract
tests now require the generated hosted snapshot to exclude `learning_attempts`
and include the hosted Real Talk tables.

## Unapplied migration discovered by type-check

Exact-head Verify #165 correctly failed after the stale generated table was
removed. Three application paths referenced `learning_attempts`, revealing that
versioned migration:

```text
supabase/migrations/20260731162613_learning_attempts.sql
```

exists in the repository but is absent from hosted migration history and hosted
type generation. The migration creates an append-only, owner-scoped RLS table and
stores no raw audio or transcripts.

No authorization to apply that DDL was inferred from T049. The generated hosted
snapshot therefore remains truthful. `src/types/pending-learning-attempts.ts`
defines the migration-shaped table explicitly, and `AppDatabase` layers it for
compile-time compatibility until a separately authorized hosted migration and
regeneration occur.

The same rule applies to the unapplied Real Talk provenance columns from T060 and
the atomic private-draft RPC from T067.

## Verification

A new contract test locks the boundary:

```text
src/__tests__/supabase-pending-schema-contract.test.ts
```

Verify #169 on exact implementation head
`c172eac9b2261545eab56269e819651bf960af27` passed:

- dependency installation;
- ESLint;
- TypeScript;
- targeted Real Talk tests;
- full unit suite, including the new pending-schema contract;
- content standards;
- Next.js production build;
- no deployment.

## Migration-history correction

While checking hosted migration history, an accidental no-op migration record was
created:

```text
20260803004029 noop_check_should_not_apply
```

Its body was only `select 1`; it made no schema or data change. The exact migration
history row was immediately deleted, and a follow-up query returned zero matching
rows. This incident is recorded here rather than hidden.

## Evidence classification

- Hosted type generation: **observed**
- Full local hosted-baseline replacement: **observed**
- Artifact-to-GitHub blob identity: **observed**
- Generated/overlay boundary contract: **passed**
- `learning_attempts` hosted DDL: **not applied**
- T060 provenance hosted DDL: **not applied**
- T067 atomic RPC hosted DDL: **not applied**
- Application deployment: **not performed**

## Decision

T049 is complete. `src/types/supabase.ts` represents hosted truth. Pending schema
is visible only through named overlays and must be removed only after explicit
migration authorization, hosted verification, type regeneration, and exact-head
checks.

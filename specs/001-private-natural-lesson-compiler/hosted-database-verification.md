# Hosted Database Verification — Spec 001

**Date:** 2026-08-02  
**Supabase project:** `zpiwddskhduuykpxltun` (`AtoEnglish`)  
**Scope:** Real Talk private-draft schema, RLS, cleanup, advisor output, and generated schema types  
**Deployment:** No application deployment was performed.

## Environment decision

Supabase development branching was unavailable on the current plan. The connected AtoEnglish project was restored and assessed before any DDL:

- Vercel preview configuration pointed to this project;
- the Real Talk tables did not exist;
- there were no Real Talk rows;
- the owner explicitly authorized applying the bounded Real Talk migrations to this project.

No other Supabase project was modified.

## Applied migrations

The hosted migration history records:

| Version | Name |
| --- | --- |
| `20260802155301` | `real_talk_private_draft_schema` |
| `20260802155330` | `real_talk_private_draft_gate` |
| `20260802160116` | `real_talk_rls_performance` |

The first migration creates the two persistence tables. The second enables RLS and installs the canonical owner-private policy set. The third preserves those semantics while replacing per-row `auth.uid()` and `auth.role()` evaluation with statement-initialized subqueries and adds the `reviewed_by` foreign-key index identified by Supabase Advisor.

## Observed hosted schema

Observed after migration:

- `public.real_talk_videos` exists with private default `is_public = false`;
- `public.real_talk_lessons` exists with default `generation_status = 'ai_draft'`;
- lesson JSON fields include environment, communication events, transfer task, transcript, lesson phases, and generation warnings;
- `real_talk_lessons.video_id` is a one-to-one foreign key to `real_talk_videos.id`;
- RLS is enabled on both tables;
- exactly eight canonical Real Talk policies are present.

## Database-level RLS transaction

A transaction created two temporary auth identities and used PostgreSQL role plus JWT-claim settings to execute the policies as:

- anonymous;
- authenticated owner A;
- authenticated owner B.

The transaction passed all assertions:

1. owner A could insert and reload a private video and lesson;
2. anonymous could not read private video or lesson rows;
3. anonymous could not insert a draft;
4. owner B could not read owner A rows;
5. owner B could not update owner A's video;
6. owner B could not delete owner A's video;
7. owner B could not insert a lesson through owner A's video;
8. owner A could not set `is_public = true`;
9. owner A could not elevate a lesson to `approved`;
10. owner A could not insert a pre-approved lesson;
11. the transaction rolled back.

A post-transaction cleanup query observed:

```text
test_users       = 0
real_talk_videos = 0
real_talk_lessons = 0
```

This is strong database-policy evidence. It is not identical to executing the repository's Vitest scaffold through PostgREST with real signed sessions. That HTTP-client execution remains open because the connector does not expose a service-role key to a CI runner.

## Advisor evidence

### Security Advisor

No Real Talk table or RLS finding remained. The only security warning was the project-level Auth setting for leaked-password protection.

### Performance Advisor

Before the performance migration, Advisor reported:

- an unindexed `reviewed_by` foreign key;
- per-row initialization warnings for all eight Real Talk policies.

After the migration, those findings disappeared. Remaining Real Talk notices are only `unused_index` information on a newly empty schema, which is expected before workload evidence exists.

## Hosted type generation

Supabase TypeScript generation was run after all three migrations. It returned both Real Talk tables with the hosted columns and the one-to-one lesson-to-video relationship.

Because the GitHub connector cannot patch a long generated file in place, the hosted Real Talk fragment is committed as:

```text
src/types/real-talk-supabase.generated.ts
```

`src/types/app-database.ts` now reconciles the repository's full generated type with that hosted fragment using `Omit` plus replacement. This avoids intersecting stale table definitions and remains forward-compatible with a later full local regeneration of `src/types/supabase.ts`.

## Evidence classification

- Hosted migration application: **observed**
- PostgreSQL RLS semantics: **observed**
- Rollback cleanup: **observed**
- Supabase Advisor after DDL: **observed**
- Hosted TypeScript generation: **observed**
- Vitest PostgREST integration scaffold: **not run**
- Real application persistence through browser/server action: **not run**
- Production deployment: **not performed**

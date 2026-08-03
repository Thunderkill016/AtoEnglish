# Hosted Baseline

**Observed:** 2026-08-03
**Supabase project:** `zpiwddskhduuykpxltun`

## Existing Real Talk persistence

Read-only hosted inspection confirmed:

```text
public.real_talk_videos:                         present
public.real_talk_lessons:                        present
public.upsert_real_talk_private_draft(jsonb,jsonb): present
```

The private compiler may therefore persist owner-private drafts through the
existing atomic RPC after provider gates pass.

## Attempt persistence not yet applied

```text
public.real_talk_attempts:                  absent
public.save_real_talk_attempt(text,jsonb):  absent
public.get_real_talk_attempt(text):         absent
```

The repository contains proposed versioned migrations for these objects, but they
have not been applied to hosted Supabase. The learner runtime must report attempt
persistence failure honestly until the hosted-DDL gate is authorized and verified.

## Advisors

Security advisor:

- no current RLS/advisor finding was returned for Real Talk tables;
- project-level leaked-password protection is disabled. This is a general Auth
  hardening item and is not silently changed by the MVP branch.

Performance advisor:

- several existing indexes are reported as unused while application tables are
  nearly empty;
- no index is removed solely from this signal before pilot traffic exists.

## Function namespace

Hosted PostgreSQL exposes `gen_random_uuid` in both `pg_catalog` and `extensions`,
so the repository migration's qualified UUID default is resolvable on this
project.

## Boundaries

This evidence was collected with read-only queries and advisors. No migration,
row insert, update, delete, environment change, or deployment was performed.

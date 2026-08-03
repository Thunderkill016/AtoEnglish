# T050 Signed-session PostgREST Verification

**Observed:** 2026-08-03 00:12:24 UTC  
**Supabase project:** `zpiwddskhduuykpxltun`  
**Application deployment:** none  
**Schema migration:** none

## Purpose

Close the behavior gate for Spec 001 task T050 by exercising the hosted Real Talk RLS policies through Supabase Auth sessions and the PostgREST Data API, rather than only through PostgreSQL role/JWT settings.

## Execution boundary

The existing repository scaffold requires a service-role credential to create and clean up two temporary Auth users. GitHub Actions does not currently contain `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_SERVICE_KEY`; workflow run `30773762805` stopped at credential preflight before installing dependencies or executing assertions.

To avoid exporting the service-role credential, a bounded temporary Supabase Edge Function used the platform-provided server secret internally. It:

1. created owner A and owner B through Supabase Auth admin;
2. signed in both users with passwords and received real user session JWTs;
3. created owner A, owner B, and anonymous Supabase clients;
4. called the hosted PostgREST Data API against `real_talk_videos` and `real_talk_lessons`;
5. returned only boolean evidence;
6. deleted all fixture rows and Auth users in `finally`.

The function was invoked once through a temporary asynchronous `pg_net` request. The extension was removed immediately after the response.

## Observed response

```text
HTTP status                          = 200
signed sessions                     = 2
owner private insert/reload         = pass
anonymous insert denied             = pass
owner B read denied                 = pass
anonymous read denied               = pass
owner B update/delete denied        = pass
owner publication denied            = pass
owner review elevation denied       = pass
pre-approved insertion denied       = pass
cross-owner lesson insertion denied = pass
anonymous public catalog clean      = pass
```

## Cleanup and shutdown

Post-run verification returned:

```text
test_users      = 0
test_videos     = 0
test_lessons    = 0
pg_net_installed = false
```

The temporary function `spec001-t050-signed-session-rls` was immediately redeployed as a disabled `410` handler with JWT verification enabled. It no longer contains the test logic or run token.

## Evidence classification

- Hosted Supabase Auth sessions: **observed**
- Signed JWTs used through PostgREST: **observed**
- Owner A/B/anonymous RLS matrix: **observed**
- Cleanup: **observed**
- GitHub-hosted Vitest process: **not run; protected service-role secret absent**
- Application preview or production deployment: **not performed**

## Decision

T050's signed-session/PostgREST behavior gate is complete. This record does not claim that the Vitest process itself ran in GitHub Actions. T051 and the hosted provenance/atomic migrations remain separate authorization and evidence gates.

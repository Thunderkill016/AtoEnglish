# T051 and T068 Real Server Action Hosted Verification

**Observed:** 2026-08-03  
**Supabase project:** `zpiwddskhduuykpxltun`  
**Workflow:** `Spec 001 Server Action Hosted` run #6  
**Run ID:** `30777932924`  
**Successful job ID:** `91577135273`  
**Input head:** `98c786c86092b1f50fee366b62edad20287168c3`  
**Application deployment:** none

## Credential boundary

GitHub Actions obtained a short-lived OIDC token scoped to this repository, PR
#54, workflow name, issuer, audience, and pull-request ref. An OIDC-verifying
Supabase Edge Function created one confirmed test user. No service-role key,
password, access token, or session token was committed or printed; credentials
were masked immediately.

After verification, the broker was replaced by version 3, which returns `410
Gone` and requires a valid Supabase JWT.

## Retained preflight failure

Attempt 1 stopped before user creation because the generated password was 75
bytes while Supabase Auth bcrypt accepts at most 72 bytes. Auth logs recorded
`bcrypt: password length exceeds 72 bytes`; hosted inspection returned zero test
users, videos, and lessons. The password was reduced to 35 bytes and only the
failed job was rerun without weakening OIDC restrictions.

## Executed application path

Attempt 2 invoked the exported Next.js server actions directly:

```text
generateRealTalkLesson
→ generatePrivateLesson orchestration
→ real hosted Supabase Auth session
→ request-header and rate-limit boundary
→ persistOwnerPrivateDraft
→ upsert_real_talk_private_draft RPC
→ hosted RLS tables
→ fetchLessonBySlug reload mapping
```

Transcript/Gemini compilation was replaced by a deterministic controlled compiler
fixture. Authentication, server-action orchestration, repository mapping, RPC,
RLS, database writes, reload, and rollback were real. Live Gemini remains a
separate evidence class under T082.

## Artifact evidence

Artifact `spec001-server-action-hosted-evidence` (`8842712985`) recorded:

```json
{
  "realServerActionInvoked": true,
  "realHostedAuthSession": true,
  "repeatedGenerationSameVideoIdentity": true,
  "repeatedGenerationSameLessonIdentity": true,
  "hostedVideoRows": 1,
  "hostedLessonRows": 1,
  "reloadObserved": true,
  "controlledPersistenceFailureCode": "DRAFT_PERSISTENCE_FAILED",
  "failedWriteLeftNoVideo": true,
  "compilerBoundary": "controlled_fixture",
  "persistenceBoundary": "real_hosted_rpc_rls"
}
```

Two calls for the same owner, source, and level retained one private video/lesson
identity and updated the stored v2 content. A third call used a separate source
and a controlled lesson constraint failure; it returned
`DRAFT_PERSISTENCE_FAILED`, and hosted lookup found no video row for that source.

## Cleanup

Workflow cleanup returned `{"cleaned": true}`. An independent SQL query then
observed:

```text
matching_users   = 0
matching_videos  = 0
matching_lessons = 0
```

## Boundary

- T051: complete for real server-action persistence, reload, rollback, and cleanup.
- T068: complete for repeated-generation identity and update behavior.
- Live Gemini/provider behavior: not claimed.
- Production-approved transcript ingestion: not implemented.
- Browser Playwright flow: not run by this harness.
- Application deployment: not performed.

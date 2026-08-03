# T074 Persisted Authenticated Preview Verification

**Observed:** 2026-08-03  
**Supabase project:** `zpiwddskhduuykpxltun`  
**Application deployment:** none  
**Merge:** not performed

## Scope

T074 verifies that an authenticated owner can load and complete one actual
owner-private persisted Real Talk draft through the production-built Next.js
route on both desktop and mobile viewports.

This is browser and persisted-data evidence. The compiler was replaced by the
existing controlled test fixture while hosted Auth, the exported server action,
rate-limit ordering, repository, atomic RPC, RLS, persisted reload, Next.js
server components, and browser UI remained real.

## Seed boundary

The workflow obtained one short-lived Supabase Auth user through a GitHub OIDC
broker restricted to repository ID `1273247795`, PR #54, the exact workflow,
pull-request subject/ref, and audience `atoenglish-spec001-t074`.

The existing hosted server-action integration then seeded one owner-private
`ai_draft` through `generateRealTalkLesson`. The seed observed:

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

The successful browser run used one generated private slug shared by both
viewports:

```text
real-talk-M7lc1UVf-VE-a1-2b92007cf09d400b805ab3a095feb3af
```

The slug was temporary and was removed during cleanup.

## Retained failed browser run

```text
Workflow: Spec 001 T074 Persisted Preview
Run:      #2
Run ID:   30781909740
Job ID:   91588124100
Head:     b0497b3cf1e1364a689b0577ea84f9536e079228
Result:   failure
```

The backend session, seed, production build, server startup, cleanup, and artifact
upload passed. Browser assertions failed for two test-harness reasons:

1. the desktop quiz locator selected the wrong section and never reached the
   transfer textarea;
2. the mobile assertion expected a responsive label that is intentionally hidden
   below the `sm` breakpoint.

No product defect or database failure was claimed. Cleanup passed and an
independent SQL query returned zero bounded users, videos, and lessons.

## Successful browser verification

```text
Workflow: Spec 001 T074 Persisted Preview
Run:      #4
Run ID:   30782424355
Job ID:   91589586090
Head:     b922ec9c3af51b53739b37e80997761aebc4bfbc
Result:   success
Artifact: spec001-t074-persisted-preview-evidence / 8844141988
Digest:   sha256:ddf725b7086915bdf3b7caa95c0d1e7759e5b10ec5ced7fc7d8593e496b680df
```

The workflow:

1. established the bounded hosted Auth session;
2. seeded and reloaded the private draft through the real server action and
   hosted RPC/RLS path;
3. built Next.js 16.2.9 without deployment;
4. started the production server locally in the GitHub runner;
5. ran the same persisted route through Desktop Chrome and Pixel 5 emulation;
6. completed pre-watch, while-watch, comprehension, retrieval, speak-and-confirm,
   changed-context transfer, and completion;
7. captured initial and completed full-page screenshots after animations settled;
8. stopped the server and removed the hosted fixture.

Both projects recorded:

```json
{
  "authenticatedSession": true,
  "ownerPrivateRouteLoaded": true,
  "environmentBriefVisible": true,
  "fullLessonLoopCompleted": true,
  "transferCompleted": true,
  "completionScreenVisible": true,
  "completionAnimationSettled": true,
  "noNextErrorOverlay": true,
  "noPageErrors": true,
  "noHorizontalOverflow": true
}
```

The final screenshots visibly showed:

- owner-private `AI draft` state;
- environment, learner role, partner role, and real-world goal;
- all four lesson phases completed;
- three completion stars and a 100% controlled immediate-practice score;
- two communication events, one comprehension item, and one transfer attempt;
- the explicit warning that immediate practice does not prove durable mastery.

The 100% score is a deterministic controlled browser fixture result. It is not a
learning-efficacy claim and does not satisfy T075 human pedagogical review.

## Cleanup and temporary infrastructure

Workflow cleanup returned:

```json
{"cleaned": true, "remainingVideos": 0, "remainingUsers": 0}
```

An independent hosted SQL query after the final run observed:

```text
matching T074 Auth users = 0
matching test videos     = 0
matching test lessons    = 0
```

The temporary OIDC broker was replaced by version 2, which returns `410 Gone`
and requires a valid Supabase JWT:

```text
name:       spec001-t074-preview-session
function:   1330a0f3-dc48-480a-8060-c4ede747a928
version:    2
verify_jwt: true
```

The one-shot GitHub workflow was removed. No service-role key, password, access
token, or session token was committed or printed.


## Repository finalization

```text
Workflow: Spec 001 T074 Finalize
Run ID:   30782680412
Input:    df3586935370967dcec897d8ff3e1ef75ee7fa5c
Output:   81fa9c5cad1c941ebb44909e7d9d6f68ad4abed5
Result:   full repository gates passed before the finalizer commit
```

The one-shot finalizer updated `tasks.md`, the production transcript
decision, and convergence review, then passed ESLint, TypeScript, targeted
Real Talk tests, the full unit suite, content standards, and the Next.js
production build before removing itself.

## Honest boundary

- T074 is complete for authenticated persisted-draft desktop/mobile browser
  preview and the full immediate-practice loop.
- The app was built and served only inside the GitHub runner; no Vercel preview or
  production deployment was created.
- The seed compiler remained a controlled fixture; live Gemini remains T082.
- The test does not replace T075 human review of source language, timing,
  situation fidelity, Vietnamese guidance, or transfer coherence.
- The public generation UI is still not routed to the reviewed transcript
  registry adapter.
- Owner acceptance, merge, and deployment remain open.

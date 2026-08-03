# Live Provider Verification — Spec 001

**Date:** 2026-08-02  
**Branch:** `agent/rebuild-learning-core`  
**Scope:** T082 Gemini provider verification and T083 official YouTube playback/oEmbed verification  
**Deployment:** No application preview or production deployment was created.

## Evidence policy

Live provider, deterministic transport, database, browser, and human evidence are separate gates. A mocked transport case is never described as a live provider result. A workflow that stops before an outbound call is recorded as blocked, not passed.

## T082 — Gemini

### Implementation hardening completed

The Gemini boundary is isolated in:

```text
src/features/real-talk/server/gemini-lesson-provider.ts
```

Observed technical contracts include:

- the API key is sent through the server-only `x-goog-api-key` header and is not placed in the request URL;
- provider responses are mapped to stable application codes;
- 429 responses retain retry guidance;
- transport exceptions do not expose exception text or secrets;
- generated JSON is parsed and validated with Zod;
- source evidence validation runs before a lesson is accepted;
- unknown top-level model fields are rejected rather than silently stripped;
- the Zod JSON Schema is reduced to the Gemini-supported structured-output subset for the request, while full Zod validation remains authoritative after the response;
- model fallback records the model that actually succeeded.

The deterministic provider suite is:

```text
src/__tests__/real-talk-gemini-provider.test.ts
```

The bounded live harness is:

```text
scripts/verify-real-talk-gemini-live.ts
```

It contains separate probes for a structured happy path, adversarial untrusted source data, invalid model output, a real missing-model provider response, deterministic 429 mapping, and persistence failure after live generation. It never writes a lesson to the database and never prints prompt or model payloads.

### Attempted GitHub live run

```text
Workflow: Real Talk Live Gemini
Run:      #1
Run ID:   30757236122
Job ID:   91521404150
Head:     998bc8c0e6db06f464e724fcad7c9e112267c0a9
Result:   failure before provider call
```

The job stopped at `Confirm server-only Gemini key exists` because `GEMINI_API_KEY` was not configured in GitHub Actions secrets. Dependency installation and all live probes were skipped.

Observed consequences:

- no Gemini request was sent;
- no provider cost was incurred by this run;
- no secret was printed;
- no database write occurred;
- no application deployment occurred.

**T082 status: BLOCKED / NOT COMPLETE.** The harness and safety boundary are ready, but no live Gemini result may be claimed until an authorized server-only secret is configured and the workflow succeeds.

The one-shot trigger was removed after the blocked run. The workflow remains manually dispatchable.

## T083 — YouTube oEmbed and IFrame playback

### Harness

The live browser harness is:

```text
scripts/verify-real-talk-youtube-live.ts
```

It performs the following without downloading or storing video media:

1. fetches YouTube oEmbed metadata and validates provider, title, author, and HTTPS author URL;
2. starts a temporary local HTTP origin;
3. loads the official YouTube IFrame API with an explicit `origin` parameter;
4. verifies the expected video ID and attached official embed URL;
5. requires a player viewport of at least 200 × 200;
6. mutes and starts playback;
7. requires a buffering or playing state;
8. repeats the same checks in desktop and Android-mobile browser contexts;
9. pauses playback after the short verification interval;
10. deletes no source data because none is persisted.

### First live run — transient failure retained as evidence

```text
Workflow: Real Talk Live YouTube
Run:      #1
Run ID:   30757516637
Job ID:   91522145130
Head:     1b9ea8fc11216c8a630556a4dc00bba4f84df0ae
Result:   failure
```

Observed result:

```text
mobile: YouTube player error 150
```

Dependency installation, Chromium installation, oEmbed, and the desktop path had already executed. Error 150 is treated as a playback failure; the run was not counted as passing.

### Second live run — passed

The harness was hardened so a single candidate source must pass oEmbed, desktop playback, and mobile playback. Candidate failures cannot be combined across different videos to manufacture a pass.

```text
Workflow: Real Talk Live YouTube
Run:      #2
Run ID:   30757661979
Job ID:   91522533247
Head:     986b736c4f49ffafbae64d9889675dbe8c11fc4a
Result:   success
```

Observed sanitized result:

```text
selectedVideoId: M7lc1UVf-VE
candidatesTried: 1
rejectedCandidates: []
mediaDownloadedOrStored: false
applicationDeployment: false
```

Observed oEmbed result:

```text
provider: YouTube
titlePresent: true
authorPresent: true
authorUrlHttps: true
```

Observed desktop result:

```text
playerReady: true
playbackObserved: true
finalState: 3
width: 640
height: 360
```

Observed Android-mobile result:

```text
playerReady: true
playbackObserved: true
finalState: 3
width: 640
height: 360
```

The successful rerun used the same first source, browser profiles, playback requirement, and minimum-size assertion. The earlier error 150 is retained in this document because live playback can be externally variable.

**T083 status: COMPLETE for the controlled live oEmbed and IFrame playback gate.** This does not prove the application’s persisted-draft route, authentication flow, or all end-user devices; those remain under T074 and later browser verification.

The one-shot trigger was removed after the successful run. The workflow remains manually dispatchable.

## Evidence classification

| Evidence | Status |
| --- | --- |
| Gemini provider isolation and deterministic contracts | Observed in CI |
| Live Gemini provider response | Blocked; not observed |
| Gemini secret handling in failed live run | Observed fail-closed |
| YouTube oEmbed metadata | Observed live |
| YouTube desktop IFrame ready and playback/buffering | Observed live |
| YouTube Android-mobile IFrame ready and playback/buffering | Observed live |
| Media download or re-hosting | Not performed |
| Database write from either live harness | Not performed |
| Application deployment | Not performed |
| Persisted-draft browser flow | Not run |
| Human source-rights and pedagogical review | Not run |

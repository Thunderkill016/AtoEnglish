# T061 Trusted Transcript Ingestion Verification

**Observed:** 2026-08-03  
**Supabase project:** `zpiwddskhduuykpxltun`  
**Application deployment:** none  
**Merge:** not performed

## Implemented boundary

T061 added a trusted transcript registry and reviewer flow instead of allowing a
browser to self-label arbitrary cues as approved:

- `public.real_talk_transcript_sources` persists source identity, acquisition
  mode, rights basis/reference, normalized cues, SHA-256 digest, submitter,
  reviewer, review time, warnings, and review state;
- authenticated clients have `SELECT` only; direct `INSERT`, `UPDATE`, and
  `DELETE` are revoked;
- `real-talk-transcript-review` is a JWT-authenticated Edge Function that derives
  the caller from Supabase Auth, validates allowed mode/rights combinations,
  computes the digest server-side, and writes with the service role;
- approval requires `app_metadata.real_talk_reviewer=true` and a reviewer whose
  authenticated user ID differs from the submitter;
- a `human_verified` row becomes immutable;
- `supabase-reviewed-transcript-v1` is an approved adapter that reloads the
  reviewed row and then passes it through the normal production provenance and
  cue-integrity policy.

## Hosted migrations and function

| Hosted version | Name |
| --- | --- |
| `20260803023053` | `real_talk_trusted_transcript_ingestion` |
| `20260803023140` | `real_talk_transcript_ingestion_remove_redundant_indexes` |
| `20260803023221` | `real_talk_transcript_ingestion_foreign_key_indexes` |

The registry was created with 20 columns, 19 constraints, one authenticated-read
policy, RLS enabled, authenticated `SELECT`, and no authenticated write grants.

Edge Function:

```text
name:       real-talk-transcript-review
function:   0732d5e3-accc-4058-afb6-d4b047dac5ca
version:    1
status:     ACTIVE
verify_jwt: true
```

Security Advisor added no Real Talk finding. Performance Advisor initially showed
three unused empty-table indexes. The status-only index was removed; the
submitter and reviewer indexes were restored because they cover Auth foreign
keys. The remaining empty-table `unused_index` notices are informational.

## Controlled rights-reviewed source

The hosted integration used source ID `1000496`:

```text
Provider: Wikimedia Commons / DVIDS
Title: Radio Around the Region: Interview with USO Volunteer
Canonical media:
https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm
Timed text:
https://commons.wikimedia.org/wiki/TimedText:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm.en.srt
Rights reference:
https://commons.wikimedia.org/wiki/File:Radio_Around_the_Region-_Interview_with_USO_Volunteer_(1000496).webm#Licensing
Acquisition mode: public_domain
Rights basis: public_domain
```

The source pages identify the media as a U.S. Marine Corps work available through
DVIDS and Wikimedia Commons. The integration used four bounded timed cues from
the existing public-domain pilot fixture.

## Hosted integration

```text
Workflow: Spec 001 T061 Hosted Integration
Run:      #7
Run ID:   30780387654
Job ID:   91583728012
Head:     fc40ea3232171faff8144ae91e06a4f3fb8c4366
Result:   success
Artifact: spec001-t061-hosted-evidence / 8843434290
```

GitHub Actions obtained a short-lived OIDC token scoped to repository ID
`1273247795`, PR #54, the workflow name, pull-request subject/ref, and audience
`atoenglish-spec001-t061`. A temporary broker created one submitter and one
reviewer Auth account. The reviewer role was server-written in `app_metadata`.
No service-role key, user password, access token, or session token was committed
or printed; runtime credentials were masked.

The test observed:

```json
{
  "sourceExternalId": "1000496",
  "sourceProvider": "wikimedia_commons",
  "acquisitionMode": "public_domain",
  "rightsBasis": "public_domain",
  "submitterAndReviewerDistinct": true,
  "directClientInsertRejected": true,
  "pendingHiddenFromUnassignedReviewer": true,
  "selfReviewRejected": true,
  "approvedAdapterLoadedInProductionPolicy": true,
  "cueDigestMatched": true,
  "directTamperRejected": true,
  "verifiedResubmissionRejected": true,
  "secondApprovalRejected": true,
  "reviewStateBoundary": "controlled_test_identity",
  "humanLessonReviewT075": "not_claimed"
}
```

This means the controlled flow reached the approved adapter only after an
independent authenticated reviewer transition, and the normal production policy
recomputed and accepted the reviewed cue digest. Ordinary client insertion and
mutation were rejected; pending data was not visible to an unassigned reviewer;
self-review and later mutation/reapproval were rejected.

## Cleanup and temporary infrastructure

Workflow cleanup returned:

```json
{"cleaned": true, "remainingSources": 0}
```

An independent hosted SQL query after the workflow observed:

```text
matching T061 Auth users = 0
transcript source rows   = 0
```

The temporary OIDC broker was replaced by version 2, which returns `410 Gone` and
requires a valid Supabase JWT:

```text
name:       spec001-t061-review-session
function:   618c301c-f022-44d9-a33e-eca5e2dacf49
version:    2
verify_jwt: true
```

The one-shot GitHub workflow was removed. The real JWT-authenticated
`real-talk-transcript-review` function remains active.

## Repository finalization

```text
Workflow: Spec 001 T061 Finalize
Run:      #2
Run ID:   30780669532
Job ID:   91584516785
Input:    a08cd6f8541ca6006c3ade6d89a063d137ede9d1
Output:   8af812386d1b4a193fcfd953d5fd9ab2af6e2c3f
Result:   success
```

Before committing the final Spec Kit state, the one-shot finalizer passed ESLint,
TypeScript, the targeted Real Talk suite, the full unit suite, content standards,
and the Next.js production build. It then removed itself.

## Honest boundary

- T061 is complete for the implemented trusted submit/reviewer mechanism and a
  controlled public-domain source passing through hosted Auth, RLS, reviewer
  authorization, persistence, approved-adapter reload, production policy,
  immutability, and cleanup.
- `human_verified` in this run was a controlled integration state set by a
  dedicated reviewer test identity. It does **not** claim that a human completed
  the pedagogical/source-language review required by T075.
- The private lesson compiler is not yet routed to this adapter in the public UI;
  the experimental YouTube adapter remains production-blocked.
- Live Gemini T082, persisted browser T074, human review T075, owner acceptance,
  merge, and deployment remain open.

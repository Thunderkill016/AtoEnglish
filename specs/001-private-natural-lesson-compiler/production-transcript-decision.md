# Production Transcript Acquisition Decision — Spec 001

**Decision date:** 2026-08-02  
**Status:** Explicit merge blocker retained  
**Applies to:** T084, private natural lesson compiler

## Decision

The current `experimental_unofficial` YouTube transcript adapter is not an
approved production source and remains blocked in production regardless of the
environment flag.

Spec 001 does not activate a production transcript adapter yet. The PR remains a
draft and must not be merged as a production lesson-generation path until an
approved adapter and its provenance persistence are implemented and verified.

This resolves the open policy choice by retaining the explicit merge blocker
rather than treating publicly viewable YouTube transcript text as authorized
input.

## Official platform boundary

The production design follows the documented YouTube boundaries observed on
2026-08-02:

- a channel owner can download and edit caption files through YouTube Studio;
- YouTube Data API caption listing and downloading require OAuth 2.0;
- `captions.download` requires the authorized user to have permission to edit
  the video;
- insufficient permission returns a forbidden response;
- a visible transcript is useful for viewing, but public visibility alone does
  not establish permission for an application to acquire, retain, or transform
  it.

Relevant official documentation:

- YouTube Help: **Edit or remove captions**
- YouTube Data API: **Captions: download**
- YouTube Data API implementation guide: **Captions**

## Acquisition modes eligible for future production approval

An adapter may be proposed for production only when it uses one of these modes:

1. `creator_provided`
   - The creator or channel owner supplies a timed caption file.
   - The submission identifies the source video and the supplying account.

2. `authorized_export`
   - Captions are exported through an official provider API using authorization
     that permits caption download or video editing.
   - OAuth access tokens are never persisted in transcript provenance.

3. `licensed_source`
   - Timed captions are supplied under a license that permits the intended
     storage and derivative lesson use.
   - A stable license or contract reference is retained.

4. `public_domain`
   - The source and timed text are verified as public domain or otherwise free
     of relevant restrictions.
   - The basis and verification reference are retained.

5. `human_reviewed_upload`
   - An authenticated editor uploads timed captions they are authorized to use.
   - A separate human reviewer verifies cue timing, language, and provenance.
   - Uploader attestation alone is not equivalent to rights proof.

`approved_provider_api` remains reserved until a provider and permitted use are
reviewed explicitly.

## Mandatory provenance contract

A production-approved transcript result must retain, at minimum:

| Field | Requirement |
| --- | --- |
| adapterId | Registered production adapter identifier |
| acquisitionMode | One eligible mode above |
| sourceReference | Stable reference without secret query parameters or tokens |
| sourceUrl | Canonical HTTPS source URL |
| sourceExternalId | Provider source ID |
| language | Validated source language |
| reviewStatus | `human_verified` before production generation |
| rightsBasis | creator-owned, authorized, licensed, or public-domain basis |
| rightsReference | Bounded non-secret evidence reference |
| submittedBy | Authenticated user ID, server derived |
| reviewedBy | Authorized reviewer ID, server derived |
| reviewedAt | Server timestamp |
| cueDigest | Digest of normalized timed cues reviewed |
| warnings | Remaining limitations and uncertainty |

The compiler must persist enough provenance for a future reviewer to determine
which exact timed text was used. Secrets, OAuth tokens, signed download URLs,
and raw authorization headers must never be stored.

## Admission gates

A production transcript adapter must fail closed unless all of the following are
true:

1. the adapter is registered as production-approved;
2. its acquisition mode is allowed;
3. the source URL and external ID agree;
4. timed cues pass bounded text, finite timestamp, positive duration, ordering,
   and source-window validation;
5. language is supported for the requested compiler path;
6. review status is `human_verified`;
7. rights basis and a non-secret rights reference are present;
8. uploader and reviewer identities are server-derived;
9. provenance and cue digest survive persistence and reload;
10. owner-private RLS still applies;
11. no publication state can be reached by the uploader;
12. integration tests cover tampering, missing provenance, changed cues after
    review, cross-owner access, and persistence failure.

## Current implementation state — 2026-08-03 T061 follow-up

The earlier implementation-gap section is superseded by the hosted T061
evidence. The project now has:

- a hosted `real_talk_transcript_sources` provenance registry;
- authenticated read-only client access and no direct client write grants;
- a JWT-authenticated submit/reviewer Edge Function that derives identities
  from Supabase Auth and computes the cue digest server-side;
- independent reviewer authorization through server-written `app_metadata`;
- immutable `human_verified` records;
- the approved `supabase-reviewed-transcript-v1` adapter;
- hosted evidence using controlled public-domain source `1000496`;
- generated hosted types, policy tests, adapter tests, and signed-session
  integration evidence.

Detailed evidence is recorded in
`t061-trusted-transcript-ingestion-verification.md`.

The controlled integration used a dedicated reviewer test identity. This proves
the authorization and provenance state transition, but it does not claim the
human pedagogical/source-language review required by T075.

## Remaining production blockers

The merge blocker remains, but its reason has narrowed:

1. the public private-lesson compiler and UI are still wired to the
   production-blocked experimental YouTube path rather than the reviewed
   registry adapter;
2. T082 live Gemini verification is blocked by the missing GitHub Actions
   secret;
3. T075 human source-language, timing, situation, Vietnamese-guidance, and
   transfer-coherence review is open;
4. owner acceptance T088 is open;
5. publication remains outside spec 001.

Therefore no automatic public-YouTube transcript mode is approved, no fallback
to unofficial caption acquisition is permitted, and the PR remains
**DO NOT MERGE / DO NOT DEPLOY**.

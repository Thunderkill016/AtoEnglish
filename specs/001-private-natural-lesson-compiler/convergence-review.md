# Requirement-to-Evidence Convergence Review — Spec 001

**Review date:** 2026-08-03  
**Evidence baseline:** Verify run #180 on exact head
`e6685fb7e0f7b43fc9ee594e848cbe65d50ba86b`  
**Decision:** NOT CONVERGED  
**Production readiness:** NOT CLAIMED  
**Merge recommendation:** DO NOT MERGE  
**Deployment recommendation:** DO NOT DEPLOY

## Review method

Each requirement is classified by the strongest evidence actually observed:

- **PASS** — implementation exists and its required evidence class was observed;
- **PARTIAL** — implementation or some evidence exists, but integration,
  provider, browser, hosted migration, or human evidence remains missing;
- **BLOCKED** — a required secret, trusted workflow, source, authorization, or
  decision is absent.

A green unit suite cannot substitute for database, provider, browser, or human
evidence. A repository migration cannot be described as hosted state. A typed
provenance contract cannot be described as an approved production adapter.

## Current evidence inventory

| Evidence class | Observed state |
| --- | --- |
| Exact-head lint and TypeScript | PASS — Verify #180 |
| Targeted Real Talk suite | PASS |
| Full unit suite | PASS, including generated/pending schema boundary |
| Content standards | PASS |
| Next.js production build without deployment | PASS |
| Hosted private-draft migrations | PASS for the earlier three authorized migrations |
| Full hosted generated type baseline | PASS — T049 |
| PostgreSQL role/JWT rollback RLS matrix | PASS |
| Signed-session PostgREST RLS behavior | PASS — T050 |
| Retention, owner deletion, and attempt-history policy | DECIDED — T052 |
| Transcript provenance domain/policy/repository contract | PASS in code/tests |
| Provenance migration contract | PASS in static tests |
| Provenance migration applied to hosted Supabase | NOT APPLIED |
| Atomic private-draft RPC migration applied hosted | NOT APPLIED |
| `learning_attempts` migration applied hosted | NOT APPLIED; explicit app type overlay only |
| Trusted approved transcript adapter/reviewer workflow | NOT IMPLEMENTED |
| Controlled rights-reviewed transcript source | NOT RUN |
| Live YouTube oEmbed and desktop/mobile IFrame playback | PASS after retaining one transient failure |
| Live Gemini provider response | BLOCKED before provider call; secret absent |
| Persisted application-route Playwright preview | NOT RUN |
| Human source-rights and lesson-coherence review | NOT RUN |
| Application deployment | NOT PERFORMED |

## Closed since the previous review

### T049 — hosted generated type truth

`src/types/supabase.ts` now represents the generated hosted PostgREST schema.
Versioned but unapplied schema is separated into named app-level overlays:

- `20260731162613_learning_attempts.sql`;
- T060 Real Talk transcript-provenance columns;
- T067 atomic private-draft RPC.

The boundary is protected by
`src/__tests__/supabase-pending-schema-contract.test.ts`. Full evidence is in
`t049-hosted-types-verification.md`.

### T050 — signed-session RLS

Two real Supabase Auth password sessions and anonymous access exercised the hosted
PostgREST Data API. Owner A private access passed; anonymous and cross-owner
access, publication, review elevation, and invalid insertion were denied. Cleanup
returned zero test users, videos, and lessons. Full evidence is in
`t050-signed-session-verification.md`.

### T052 — retention, deletion, and history

Spec 001 now has a bounded policy:

- retain one current private draft without silent automatic expiry;
- require deliberate owner-only hard deletion in the first draft-management
  surface;
- cascade-delete the one lesson through the private video relationship;
- do not preserve immutable full prompts, transcripts, model outputs, or lesson
  payloads for failed or superseded attempts;
- require a later approved spec for immutable history.

Full rationale is in `retention-deletion-history-decision.md`.

## Transcript provenance implementation

The branch implements the technical boundary required before a production
transcript adapter can be approved:

- typed rights bases and provenance metadata;
- canonical HTTPS source URL;
- stable rights reference without credentials;
- server-derived submitter and reviewer UUIDs;
- reviewer must differ from submitter;
- human-verified review timestamp;
- normalized SHA-256 cue digest;
- executing adapter ID and trust must match returned metadata;
- acquisition mode must be compatible with the rights basis;
- requested and returned languages must match;
- secret-like rights references are rejected;
- cue changes after review fail with `transcript_integrity_mismatch`.

Pending migration:

```text
supabase/migrations/20260803010500_real_talk_transcript_provenance.sql
```

This implementation does **not** establish a production transcript source:

- the migration has not been authorized or applied hosted;
- no trusted reviewer/service ingestion path exists;
- no rights-reviewed source has been run;
- the unofficial adapter remains production-blocked.

## Atomic persistence implementation

The branch contains a versioned `SECURITY INVOKER` atomic private-draft RPC and
repository integration that replace the known two-write path in code.

Pending migration:

```text
supabase/migrations/20260803013000_real_talk_atomic_private_draft.sql
```

The code and static tests pass, but hosted transactional behavior, controlled
rollback, repeated generation, and the real server-action path remain unclaimed
until explicit owner authorization permits T067/T051.

## Functional requirements

The private compiler, evidence gates, privacy policies, type boundary, preview
loop, and repository checks remain technically coherent. Requirements that depend
on hosted pending DDL, a live provider, trusted source access, persisted browser
behavior, or human review remain PARTIAL or BLOCKED.

## Success criteria

Technical and deterministic success criteria have strong repository and hosted
RLS evidence. Success criteria requiring a complete hosted trusted provenance
record, live provider output, persisted browser journey, or human review remain
open. No learning-effectiveness or market-demand claim is made.

## Constitution review

| Principle | Status | Remaining gap |
| --- | --- | --- |
| Natural Communication First | PARTIAL | human lesson-coherence review |
| Evidence-Bound Generation | PARTIAL | live Gemini and trusted source flow |
| Transfer Before Completion | PARTIAL | persisted browser flow |
| Rights, Privacy, and Safety by Default | PARTIAL | hosted provenance/atomic DDL, trusted flow, human rights review |
| Small Independently Testable Delivery | PASS | T049, T050, and T052 closed independently |
| Honest Claims and Layered Evidence | PASS | hosted truth and pending schema are explicitly separated |
| Measurable Learner and Product Evidence | NOT APPLICABLE FOR CONVERGENCE | Spec 001 is an editor compiler; no learning-effectiveness claim is made |

No constitution exception is approved.

## Exact-head verification

```text
Workflow: Verify
Run:      #180
Run ID:   30775677864
Head:     e6685fb7e0f7b43fc9ee594e848cbe65d50ba86b
Result:   success
```

Observed:

- dependency installation: pass;
- ESLint: pass;
- TypeScript: pass;
- targeted Real Talk tests: pass;
- full unit suite: pass;
- content standards: pass;
- Next.js production build: pass;
- no deployment.

## Remaining blocking gates

1. **T060** — obtain explicit owner authorization, apply the transcript-provenance
   migration, rerun advisors, regenerate full hosted types, and verify trusted
   writes and cue-tamper rejection.
2. **T067 / T051** — obtain explicit owner authorization, apply and verify the
   atomic private-draft RPC, then run controlled rollback and repeated generation
   through the real server action and hosted database.
3. **T082** — configure an authorized server-only Gemini secret and run the live
   provider matrix.
4. **T061** — implement and run one trusted transcript submission/reviewer flow
   with a controlled rights-reviewed source.
5. **T074** — run authenticated persisted-draft Playwright on desktop and mobile.
6. **T075** — perform human source-rights, transcript, speaker, pragmatic,
   Vietnamese-guidance, and transfer-coherence review.
7. Demonstrate manual provenance review without server logs.
8. **T088** — obtain explicit owner acceptance.

## Final decision

```text
Specification quality:       PASS
Implementation completeness: PARTIAL
Exact-head technical checks: PASS on Verify #180
Hosted type baseline:        PASS
Signed-session RLS:          PASS
Retention/history:           DECIDED
Hosted provenance DDL:       NOT APPLIED
Hosted atomic RPC DDL:       NOT APPLIED
Learning attempts DDL:       NOT APPLIED; explicit overlay only
Production transcript path:  NOT IMPLEMENTED
Live Gemini:                 BLOCKED
Persisted browser evidence:  NOT RUN
Human evidence:              NOT RUN
Owner acceptance:            NOT OBTAINED
Convergence:                 FAIL / NOT CONVERGED
Production readiness:        NOT CLAIMED
Merge recommendation:        DO NOT MERGE
Deployment recommendation:   DO NOT DEPLOY
```


## 2026-08-03 real server-action hosted follow-up

T051 and T068 are now observed through the exported Next.js server actions with a controlled compiler and real hosted Auth, repository, atomic RPC, RLS, reload mapping, rollback, and cleanup. Repeated generation retained one video/lesson identity; a controlled lesson failure left no video-only row.

This closes the real persistence-process gap. It does not close live Gemini, production-approved transcript ingestion, persisted browser Playwright, or human review. The convergence decision remains **NOT CONVERGED** and the PR remains **DO NOT MERGE / DO NOT DEPLOY**.

Detailed evidence: `t051-t068-server-action-hosted-verification.md`.

## 2026-08-03 T061 trusted transcript follow-up

T061 now has hosted evidence for a trusted registry, server-derived
submitter/reviewer identities, reviewer authorization, public-domain rights
metadata, server-computed cue digest, approved-adapter reload through the
production policy, immutable reviewed state, and complete cleanup.

This closes the missing trusted-ingestion mechanism. It does not close the
public routing gap, live Gemini, persisted browser flow, T075 human review,
or owner acceptance. Convergence remains **NOT CONVERGED** and the PR remains
**DO NOT MERGE / DO NOT DEPLOY**.

Evidence: `t061-trusted-transcript-ingestion-verification.md`.

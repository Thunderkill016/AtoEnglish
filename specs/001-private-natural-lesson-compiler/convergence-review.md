# Requirement-to-Evidence Convergence Review — Spec 001

**Review date:** 2026-08-03  
**Evidence baseline:** Verify run #140 on exact head
`e7a5120bb320507bba8704a6150d3d3923abb50a`  
**Decision:** NOT CONVERGED  
**Production readiness:** NOT CLAIMED

## Review method

Each requirement is classified by the strongest evidence actually observed:

- **PASS** — implementation exists and its required evidence class was observed;
- **PARTIAL** — implementation or some evidence exists, but integration,
  provider, browser, hosted migration, or human evidence remains missing;
- **BLOCKED** — a required secret, trusted workflow, source, or decision is absent.

A green unit suite cannot substitute for database, provider, browser, or human
evidence. A repository migration cannot be described as hosted state. A typed
provenance contract cannot be described as an approved production adapter.

## Current evidence inventory

| Evidence class | Observed state |
| --- | --- |
| Exact-head lint and TypeScript | PASS — Verify #140 |
| Targeted Real Talk suite | PASS — 12 files, 102 tests |
| Full unit suite | PASS — 38 files, 366 tests |
| Content standards | PASS — 1 file, 50 tests |
| Next.js production build without deployment | PASS — 89/89 pages |
| Hosted private-draft migrations | PASS for the earlier three authorized migrations |
| PostgreSQL role/JWT rollback RLS matrix | PASS |
| Signed-session PostgREST RLS suite | NOT RUN |
| Transcript provenance domain/policy/repository contract | PASS in code/tests |
| Provenance migration contract | PASS in static tests |
| Provenance migration applied to hosted Supabase | NOT APPLIED |
| Trusted approved transcript adapter/reviewer workflow | NOT IMPLEMENTED |
| Controlled rights-reviewed transcript source | NOT RUN |
| Live YouTube oEmbed and desktop/mobile IFrame playback | PASS after retaining one transient failure |
| Live Gemini provider response | BLOCKED before provider call; secret absent |
| Persisted application-route Playwright preview | NOT RUN |
| Human source-rights and lesson-coherence review | NOT RUN |
| Application deployment | NOT PERFORMED |

## Transcript provenance implementation

The branch now implements the technical boundary required before any production
transcript adapter can be approved.

### Domain and runtime enforcement

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

### Persistence and database design

Transcript metadata now travels through:

```text
adapter
→ transcript policy
→ compiler
→ application service
→ private draft repository
```

Pending migration:

```text
supabase/migrations/20260803010500_real_talk_transcript_provenance.sql
```

It adds acquisition mode, review status, source metadata, and cue digest;
constrains approved provenance; prevents ordinary authenticated clients from
self-approving it; and makes approved provenance immutable outside the trusted
service path.

### Tamper evidence

Exact-head tests reject:

- missing provenance;
- forged adapter identity;
- self-review;
- secret-bearing references;
- changed cues after review;
- invalid migration states;
- ordinary-client approval attempts;
- ordinary-role mutation of approved provenance.

### Honest boundary

This implementation does **not** establish a production transcript source:

- the migration has not been applied to hosted Supabase;
- hosted types have not been regenerated for it;
- no trusted reviewer/service ingestion path exists;
- no rights-reviewed source has been run;
- the unofficial adapter remains production-blocked.

## Functional requirements

| Result | Count |
| --- | ---: |
| PASS | 15 |
| PARTIAL | 9 |
| BLOCKED as written | 0 |

The provenance work strengthens FR-003, FR-012, FR-017, FR-018, and FR-023, but
FR-003 and FR-018 remain PARTIAL until hosted application, type regeneration,
and a real approved adapter are observed.

## Success criteria

| Result | Count |
| --- | ---: |
| PASS | 3 |
| PARTIAL | 6 |
| BLOCKED | 1 |

SC-010 remains BLOCKED because a human reviewer cannot yet inspect one complete,
hosted, trusted provenance record without server logs.

## Constitution review

| Principle | Status | Remaining gap |
| --- | --- | --- |
| Natural Communication First | PARTIAL | human lesson-coherence review |
| AI Drafts Must Be Evidence-Bound | PARTIAL | live Gemini observation |
| Transfer Before Completion | PARTIAL | persisted browser flow |
| Rights, Privacy, and Safety by Default | PARTIAL | hosted provenance migration, trusted adapter, signed-session integration |
| Small Independently Testable Delivery | PASS | none for current scope boundary |
| Honest Claims and Layered Evidence | PASS | evidence classes remain distinct |

No constitution exception is approved.

## Exact-head verification

```text
Workflow: Verify
Run:      #140
Run ID:   30760646783
Job ID:   91530380973
Head:     e7a5120bb320507bba8704a6150d3d3923abb50a
Result:   success
```

Observed:

- dependency installation: pass;
- ESLint: pass;
- TypeScript: pass;
- targeted Real Talk: 12 files / 102 tests;
- full unit suite: 38 files / 366 tests;
- content standards: 1 file / 50 tests;
- Next.js 16.2.9 build: pass;
- page generation: 89/89;
- no deployment.

## Blocking gates

1. Apply the provenance migration to the authorized hosted project only after
   explicit owner authorization; rerun advisors and regenerate full types.
2. Implement a trusted transcript submission/reviewer flow and run one controlled
   rights-reviewed source.
3. Run the signed-session owner A / owner B / anonymous PostgREST suite.
4. Verify repeated generation, reload, and partial-write recovery through the real
   server action and hosted database.
5. Decide retention, owner deletion, partial-write recovery, and immutable
   attempt history.
6. Configure an authorized server-only Gemini secret and run the live provider
   matrix.
7. Run authenticated persisted-draft Playwright on desktop and mobile.
8. Perform human source-rights, transcript, speaker, pragmatic, Vietnamese, and
   transfer-coherence review.
9. Demonstrate manual provenance review without server logs.
10. Obtain explicit owner acceptance.

## Final decision

```text
Specification quality:       PASS
Implementation completeness: PARTIAL
Exact-head technical checks: PASS
Provenance code/tests:       PASS
Hosted provenance DDL:       NOT APPLIED
Production transcript path:  NOT IMPLEMENTED
Live Gemini:                 BLOCKED
Browser evidence:            PARTIAL
Human evidence:              BLOCKED
Convergence:                 FAIL / NOT CONVERGED
Production readiness:        NOT CLAIMED
Merge recommendation:        DO NOT MERGE
Deployment recommendation:   DO NOT DEPLOY
```

# Research: Private Natural Lesson Compiler

## Decision 1 — Use a spec of specs for the rebuild

**Decision**: Treat the product rebuild as a roadmap of independently specified
features rather than one giant implementation spec.

**Rationale**: Source ingestion, review/publication, learner runtime, curriculum
sequencing, delayed transfer, and pilot evidence have different users, risks,
data, and acceptance evidence. Combining them would make scope, testing, and
rollback ambiguous.

**Alternatives considered**:

- One project-wide rebuild spec: rejected because implementation context and
  acceptance criteria would become too large and coupled.
- Continue with ad-hoc PR descriptions: rejected because requirements and
  incomplete evidence repeatedly drift across conversations and branches.

## Decision 2 — AI creates drafts, never public lessons

**Decision**: The compiler may propose a lesson only in `ai_draft` state and with
`is_public = false`.

**Rationale**: Schema-valid model output can still contain wrong speakers,
misleading translations, unsuitable pedagogy, rights problems, or fabricated
context. Publication is a separate user story requiring a human reviewer.

**Alternatives considered**:

- Auto-publish after schema validation: rejected because structure does not prove
  truth, suitability, or rights.
- Do not persist AI output: rejected because reviewers need stable drafts,
  warnings, and provenance across sessions.

## Decision 3 — Separate automated evidence from human evidence

**Decision**: Automate only checks that can be deterministic from the selected
source window. Preserve human-review warnings for everything else.

**Automated evidence**:

- request authentication and input schema;
- source-window bounds;
- transcript indices and timestamps;
- quoted English substring support;
- activity segment references;
- output structure and count limits;
- private ownership and RLS invariants.

**Human evidence**:

- whether captions are correct;
- speaker attribution;
- pragmatic meaning and translation quality;
- source authenticity and editing risk;
- rights and derivative-use suitability;
- learner level and age appropriateness;
- whether the selected segment produces a coherent lesson and transfer task.

**Alternatives considered**:

- Ask Gemini to self-verify: rejected because the same model cannot establish
  external ground truth.
- Block all drafts until human transcript review: deferred to the publication
  feature; private draft preview remains useful when uncertainty is explicit.

## Decision 4 — Keep transcript acquisition behind a fail-closed adapter boundary

**Decision**: Represent transcript input as a `TranscriptSourceAdapter` contract
with acquisition mode, language, cues, trust, review status, source reference,
and warnings. The current `youtube-transcript` implementation is isolated as
`experimental_unofficial`.

The experimental adapter follows this runtime policy:

- disabled by default;
- may run only in development or test when
  `REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true` is explicitly set;
- always rejected in production, even when the flag is present;
- never represented as approved, human-verified, rights-cleared, or suitable for
  publication.

**Rationale**: The product needs timed source evidence, but acquisition methods
have different legal, reliability, and operational properties. The compiler
must not be coupled to one unofficial mechanism, and a forgotten environment
flag must not silently enable it in production.

**Approved future modes may include**:

- creator-provided timed captions;
- user-owned or authorized source export;
- reviewed public-domain or licensed captions;
- human-reviewed transcript upload;
- a provider/API explicitly approved for the intended use.

**Alternatives considered**:

- Treat any available YouTube captions as approved: rejected because public
  availability does not itself prove permission, accuracy, or stability.
- Permit the experimental flag in production: rejected because configuration
  mistakes must fail closed.
- Remove transcript support entirely: rejected because evidence-bound lesson
  generation cannot operate accurately without timed language evidence.

## Decision 5 — Select an interaction-rich window deterministically

**Decision**: Score bounded cue windows for interaction signals and choose the
highest-scoring segment, subject to duration and cue-count limits.

**Rationale**: Taking the first three minutes often selects intros, sponsor
messages, monologues, or setup rather than useful interaction. Deterministic
selection is testable and cheaper than asking a model to ingest an entire video.

**Signals include**:

- questions;
- first/second-person exchange;
- acknowledgements and short responses;
- repair and clarification language;
- discourse markers associated with turn-taking.

**Limitations**: Heuristics do not prove naturalness, speaker turns, or pedagogical
value. The selected window remains a reviewable proposal.

## Decision 6 — Use Zod as the runtime contract authority

**Decision**: Generate a structured response schema from the Zod draft schema and
parse model output with the same runtime schema.

**Rationale**: One schema reduces drift between prompt examples, TypeScript types,
and runtime validation. Cross-field and source-evidence rules remain separate
because JSON Schema alone cannot express all invariants.

**Alternatives considered**:

- TypeScript casts: rejected because casts provide no runtime evidence.
- Prompt-only JSON format: rejected because syntactic JSON may still violate
  required fields, counts, enums, indices, or bounds.

## Decision 7 — Preserve the modular monolith

**Decision**: Keep Next.js routes/actions, Real Talk UI, Supabase, and domain
contracts in the existing application. Extract only clear feature boundaries.

**Rationale**: There is no measured need for microservices, queues, or a separate
AI backend at pilot scale. The primary risk is product truth and data safety, not
throughput.

**Alternatives considered**:

- New generation microservice: rejected due to deployment, auth, observability,
  and data-contract overhead without evidence of scale need.
- Broad codebase rewrite: rejected because it would mix legacy cleanup with the
  current product outcome.

## Decision 8 — Preview requires transfer but does not prove mastery

**Decision**: The private draft preview includes environment setup, comprehension,
retrieval, spoken self-confirmation, and a changed-context production attempt.

**Rationale**: Authors need to see whether the generated lesson can move beyond
recognition. At the same time, browser-independent self-confirmation cannot prove
pronunciation quality or long-term transfer.

**Alternatives considered**:

- Quiz-only preview: rejected because it does not expose production design.
- Fake microphone score: rejected because it creates unsupported learning claims.
- Full acoustic assessment in this feature: rejected as a separate provider,
  calibration, privacy, and cost decision.

## Decision 9 — Use one current draft per owner, source, and level

**Decision**: The private draft identity is derived only from authenticated owner
ID, source video ID, and requested level. Repeating generation for the same
combination updates the same private video/lesson draft. A different owner or
level receives a different draft identity.

**Rationale**: AI titles are unstable and must not control persistence identity.
A stable identity prevents title changes from creating duplicate drafts while
preserving separate A1, A2, and B1 treatments for the same source.

**Alternatives considered**:

- Title-based slugs: rejected because regeneration can change the title.
- A new row for every attempt: deferred because version history, comparison, and
  retention would expand spec 001.
- One draft per source regardless of level: rejected because treatments at
  different levels are materially different.

## Decision 10 — Persistence failure is a failure, not a preview success

**Decision**: Spec 001 has no intentional non-persistent success mode. A request is
successful only after both private video and lesson draft writes complete. Any
write failure returns `DRAFT_PERSISTENCE_FAILED` and the editor UI must not claim
that a draft was saved.

**Rationale**: A generated in-memory lesson is not equivalent to an owner-private,
reloadable draft. Silent fallback made success ambiguous and could cause the
editor to leave the page believing work was retained.

**Alternatives considered**:

- Return `success: true` with `preview_only`: rejected because no explicit user
  request selected that mode and persistence is part of spec 001's outcome.
- Hide database failure behind a warning: rejected because warnings are for
  uncertainty, not failed required behavior.

## Open decisions that block convergence

1. Which transcript acquisition modes are approved for production use?
2. What exact authorized role will own publication in spec 002?
3. Will private drafts be retained indefinitely, manually deleted, or expired?
4. Will a future spec add immutable generation-attempt history or keep only the
   current draft?

The experimental adapter runtime policy, persistence semantics, and current-draft
identity are resolved. Spec 001 still cannot converge until at least one
production transcript mode is approved or the feature remains explicitly
non-production. Retention and future history remain visible in tasks and PR
review.

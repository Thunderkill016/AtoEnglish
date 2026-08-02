# Cross-Artifact Analysis: Private Natural Lesson Compiler

**Date**: 2026-08-02

**Artifacts analyzed**:

- `.specify/memory/constitution.md`
- `specs/000-atoenglish-rebuild-roadmap/spec.md`
- `specs/000-atoenglish-rebuild-roadmap/roadmap.md`
- `specs/001-private-natural-lesson-compiler/spec.md`
- `specs/001-private-natural-lesson-compiler/plan.md`
- `specs/001-private-natural-lesson-compiler/research.md`
- `specs/001-private-natural-lesson-compiler/data-model.md`
- `specs/001-private-natural-lesson-compiler/contracts/generation-contract.md`
- `specs/001-private-natural-lesson-compiler/tasks.md`
- current implementation on `agent/rebuild-learning-core`

## Summary

The artifacts agree on the primary boundary: authenticated, evidence-bound,
owner-private AI lesson drafting and private preview. Publication, curriculum
sequencing, delayed transfer scheduling, rewards, payments, and deployment remain
outside spec 001.

The transcript runtime has an explicit adapter and fail-closed policy. The
unofficial YouTube adapter is isolated, disabled by default, allowed only by
explicit non-production opt-in, and rejected in production regardless of the
flag.

The generation result contract is discriminated and machine-readable. Compiler,
application orchestration, action, repository, and editor UI use the same stable
failure codes. Persistence cannot silently downgrade to a successful in-memory
preview. A successful response means both required draft writes completed.
Repeated generation uses one deterministic current draft per owner, YouTube
source, and requested level rather than an AI-title-based slug.

Generation ordering now lives in a dependency-injected application service.
Mocked test artifacts cover the happy path, invalid input, auth-before-rate/provider
work, rate limiting, model failure propagation, evidence no-write behavior,
persistence failure, and bounded unexpected errors. These artifacts have not run
on the exact current head and do not replace direct Gemini-adapter or database
failure tests.

The feature remains sufficiently specified for bounded implementation and
testing. It is not ready for convergence or production because no production
transcript mode has been approved and major technical, database, browser,
provider, and human evidence remains unchecked.

## Constitution alignment

| Principle | Status | Evidence / gap |
|---|---|---|
| Natural Communication First | Aligned | Environment, roles, practical goal, communication events, and transfer are required across spec, schema, persistence, and preview |
| Evidence-Bound Generation | Partially aligned | Zod, source checks, stable evidence failures, adapter metadata, runtime policy, and no-write orchestration artifacts exist; full fixtures, approved production source, and human verification remain open |
| Transfer Before Completion | Aligned in code, unverified | Preview implementation requires a transfer response; component/browser tests remain open |
| Rights, Privacy, Safety | Partially aligned | Official playback, explicit persistence failure, private RLS design, and production transcript fail-closed policy exist; production acquisition and migration proof remain open |
| Small Independent Delivery | Aligned | Roadmap separates publication and later capabilities; compiler, application orchestration, and repository boundaries were extracted without broad architecture expansion |
| Measurable Evidence | Aligned in requirements, unverified | Stable result codes, test artifacts, success criteria, and exact-head checks exist; observed final results are absent |

No constitution violation has been approved as an exception.

## Requirement coverage

### Fully represented in artifacts and current code

- authenticated generation gate;
- validated URL and level;
- dependency-injected application orchestration with explicit ordering;
- stable `GenerationFailureCode` union and discriminated result contract;
- retry guidance and deduplicated evidence-failure payloads;
- editor-facing failure code, retry, and evidence display;
- `TranscriptSourceAdapter` contract with cues, acquisition mode, trust, review
  status, source reference, warnings, and typed failures;
- isolated `experimental_unofficial` YouTube transcript adapter;
- explicit non-production opt-in through
  `REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true`;
- unconditional production rejection of the experimental adapter;
- architecture regression assertion preventing the server action from importing
  `youtube-transcript` directly;
- bounded and normalized transcript cues, including rejection of non-finite
  timings;
- bounded interaction-window selection;
- structured environment-first model output;
- Zod runtime validation;
- source-evidence checks for transcript and activities;
- actual generation model tracking;
- dedicated private draft repository;
- deterministic owner+source+level draft identity independent of AI title;
- repeated generation updating one current private draft;
- explicit `DRAFT_PERSISTENCE_FAILED` behavior with no saved/preview-only success;
- private `ai_draft` data model and migration intent;
- environment, events, transfer, warnings, and model persistence fields;
- owner-facing AI draft warnings;
- environment-first preview;
- phrase production acknowledgement;
- changed-context transfer before preview completion;
- no fabricated microphone score or mastery copy.

These are implementation observations only. They are not marked as technically
verified unless the corresponding verification tasks have an observed result.

### Requirements with incomplete implementation or evidence

1. **FR-003/FR-004 — Production transcript source**
   - Adapter and policy boundaries are implemented.
   - The only concrete adapter remains experimental and is blocked in production.
   - At least one approved production mode still needs a separate adapter,
     evidence, and operational decision.
   - T084 remains convergence-blocking.

2. **FR-019 and failure contract — Execution proof**
   - Stable external codes and explicit persistence semantics are implemented.
   - Mocked application tests cover auth ordering, rate limiting, model failure
     propagation, evidence no-write, persistence failure, and bounded internal
     errors.
   - The tests have not run on the exact final head.
   - Raw Gemini HTTP/JSON mapping and controlled database failure behavior still
     require provider/integration evidence.
   - T076–T082 remain blocking.

3. **FR-024 — Required tests**
   - Domain, transcript policy, result-code, draft-identity, and application
     orchestration test artifacts exist.
   - Invalid-schema/evidence matrix, prompt-injection behavior, long-source
     integration, RLS, mapping, component, and browser coverage remains incomplete.
   - Tasks T013, T016–T017, T019, T033, T044, T046, T052–T055, and T065–T068
     remain open.

4. **Persistence schema proof**
   - A repository, migration, deterministic identity, and app-level table types
     exist.
   - Hosted/non-production application, repeated-generation behavior, RLS
     behavior, partial-write handling, and generated-type reconciliation have
     not been observed.
   - Tasks T053–T055 and T062–T063 remain blocking.

5. **Preview proof**
   - Runtime code contains the required flow and explicit failure UI.
   - No component or browser evidence proves completion or error rendering works.
   - Tasks T065–T075 remain open.

## Success-criteria evidence map

| Criterion | Planned evidence | Current result |
|---|---|---|
| SC-001 authenticated external calls | mocked application test with call spies | Artifact exists; not run on exact head |
| SC-002 all persisted drafts private | migration + repository assertion + RLS test | Designed; not observed |
| SC-003 no draft in public catalog | catalog query test and two-user DB run | Code observed; not verified |
| SC-004 reject unsupported content | domain fixture matrix and application no-write assertion | No-write artifact exists; fixture matrix incomplete and unexecuted |
| SC-005 valid fixture produces complete persisted draft | mocked application happy path | Artifact exists; not run on exact head |
| SC-006 cross-user access denied | non-production RLS integration | Not run |
| SC-007 reload preserves fields and repeated generation updates same draft | mapping/repository test + DB reload | Identity unit artifact exists; DB behavior not verified |
| SC-008 transfer required | component/browser test | Code observed; not verified |
| SC-009 exact-head checks pass | lint, tsc, tests, content, build | Not run on latest head |
| SC-010 review can inspect provenance/warnings/failures | manual draft and failure inspection | UI/code exists; manual review not run |

No test artifact is considered passing until it runs against the exact final
commit.

## Ambiguities and decisions still needed

### Critical before merge consideration

- Decide and implement at least one transcript acquisition mode approved for
  production use, or keep this feature explicitly non-production.
- Verify explicit persistence failure and partial-write behavior in a controlled
  non-production database.

### Important before convergence

- Define draft retention and owner deletion behavior.
- Decide whether a future feature needs immutable generation-attempt history.
- Decide whether a failed lesson write after a successful video upsert should be
  reconciled by retry, cleanup, or a database transaction/RPC after observing the
  current non-production behavior.

### Resolved in previous iterations

- The experimental adapter remains available only for explicit development/test
  work.
- Production always rejects it even when the environment flag is set.
- The server action no longer accesses the unofficial package directly.
- Stable machine-readable external generation failure codes.
- Retry and evidence-failure response shape.
- Persistence failure is a failure, not a warning or preview success.
- One current draft per owner, source, and level.
- Persistence identity does not depend on model-generated titles.
- Repeated generation updates the current draft; attempt history is deferred.

### Resolved in this iteration

- Generation ordering is isolated in
  `src/features/real-talk/application/generate-private-lesson.ts`.
- The Next.js server action supplies real auth, rate-limit, compiler, and
  repository dependencies without owning orchestration semantics.
- Mocked artifacts cover happy path, auth ordering, rate limiting, model failure
  propagation, evidence no-write, persistence failure, and safe internal errors.
- Real Talk domain/server tests are assigned to the Vitest Node project while
  component tests remain in jsdom.

### Deferred correctly to spec 002

- reviewer role and authorization;
- approval checklist UI;
- immutable review history for publication decisions;
- publication and retirement transitions;
- public reviewed-lesson contract.

These deferred decisions do not belong in spec 001 implementation.

## Duplication and terminology findings

- `docs/product/PRODUCT_TRUTH.md` and `CURRENT_PRIORITY.md` summarize and point to
  Spec Kit artifacts rather than competing with them.
- Older `docs/real-talk-spec.md`, `docs/real-talk-expansion-plan.md`, and full
  blueprints may contain obsolete authority language. They should be labelled
  historical or reconciled in a separate documentation-only task, not silently
  used to expand spec 001.
- The code currently uses `RealTalkLesson` for both draft preview and reviewed
  lesson-shaped content. This is acceptable during spec 001 but spec 002 should
  introduce an explicit reviewed/public contract rather than assuming draft and
  publication are the same entity.
- Terms `source evidence`, `transcript evidence`, `ai_draft`, `review warning`,
  `communication event`, `transfer task`, `experimental_unofficial`,
  `GenerationFailureCode`, `DRAFT_PERSISTENCE_FAILED`, `current draft`, and
  `application orchestration` are consistent across active artifacts.

## Task quality findings

- Tasks are ordered by foundation and independently testable user story.
- Checked implementation/test-artifact tasks are separated from unchecked
  exact-head execution tasks.
- Exact file paths are provided.
- No task in spec 001 authorizes publication or later roadmap work.
- T018, T023–T025, T029–T032, T041–T043, and T045 match the implemented file
  boundaries and artifacts.
- T064 is deliberately conditional and must not become scope expansion unless
  retention verification requires it.

## Result

**Specification readiness**: Ready for bounded implementation and testing.

**Implementation convergence**: Not ready.

**Production readiness**: Not claimed.

**Critical next tasks**:

1. T013, T016–T017, T033, T044, T046, and T052: complete schema, evidence,
   long-source, normalization, and prompt-injection fixture coverage;
2. T076–T082: run exact-head checks and direct provider failure verification;
3. at least one approved production transcript adapter or an explicit permanent
   non-production decision;
4. authorized non-production migration, repeated-generation, partial-write, and
   RLS verification;
5. component/browser preview tests and human review evidence.

Re-run this analysis after those tasks or any material spec/plan change. Final
convergence requires an updated requirement-to-evidence table with actual results.

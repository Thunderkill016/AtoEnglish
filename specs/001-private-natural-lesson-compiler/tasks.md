---
description: "Dependency-ordered implementation and verification tasks for the private natural lesson compiler"
---

# Tasks: Private Natural Lesson Compiler

**Input**: Design documents from `/specs/001-private-natural-lesson-compiler/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/generation-contract.md`

**Tests**: Required because generation, evidence, authentication, RLS, and learner completion are product-critical contracts.

**Status rule**: A checked implementation task means the code or artifact exists. A checked verification task means the command or evidence was observed on a named commit and recorded in `verification.md` or the final PR snapshot. Provider, database, browser, and human evidence remain separate gates.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes different files and has no unmet dependency.
- **[Story]**: Maps the task to a user story from `spec.md`.
- Every task names the exact file or verification surface.

## Phase 1: Spec Kit foundation

**Purpose**: Make product intent and delivery rules executable before further implementation.

- [x] T001 Create project constitution in `.specify/memory/constitution.md`
- [x] T002 Create rebuild specification in `specs/000-atoenglish-rebuild-roadmap/spec.md`
- [x] T003 Create spec-of-specs decomposition in `specs/000-atoenglish-rebuild-roadmap/roadmap.md`
- [x] T004 Create active feature specification in `specs/001-private-natural-lesson-compiler/spec.md`
- [x] T005 [P] Create implementation plan in `specs/001-private-natural-lesson-compiler/plan.md`
- [x] T006 [P] Record research decisions in `specs/001-private-natural-lesson-compiler/research.md`
- [x] T007 [P] Define data model in `specs/001-private-natural-lesson-compiler/data-model.md`
- [x] T008 [P] Define generation contract in `specs/001-private-natural-lesson-compiler/contracts/generation-contract.md`
- [x] T009 [P] Add verification quickstart in `specs/001-private-natural-lesson-compiler/quickstart.md`
- [x] T010 Run a requirements clarification pass and resolve or explicitly defer all open decisions in `specs/001-private-natural-lesson-compiler/research.md`
- [x] T011 Run a cross-artifact analysis and record findings in `specs/001-private-natural-lesson-compiler/analysis.md`

**Checkpoint**: Product direction is governed by Spec Kit artifacts; implementation may proceed only inside spec 001.

---

## Phase 2: Foundational contracts and safety boundaries

**Purpose**: Establish contracts that block all user stories if incorrect.

### Tests first

- [x] T012 [P] Add initial schema, evidence, and window-selection tests in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T013 [P] Add invalid required-branch Zod output fixture in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T014 [P] Add regression test for invented transcript text in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T015 [P] Add regression test for invented speaking language in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T016 [P] Add controlled fixtures for invalid or reversed timestamps, out-of-window references, duplicate indices, unknown speakers, unknown segment references, invented vocabulary, fill answers, speaking language, and transfer language in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T017 [P] Add prompt-injection metadata and caption fixtures in `src/__fixtures__/real-talk/prompt-injection-caption.ts` with delimiter and escaping assertions in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T018 [P] Add application contract tests for auth-before-external-call, invalid input, rate limiting, typed provider failures, and bounded internal errors in `src/__tests__/real-talk-generation-action.test.ts`
- [x] T019 [P] Add two-owner plus anonymous Supabase RLS integration scaffolding in `src/__tests__/integration/real-talk-draft-rls.integration.test.ts`; execution remains tracked by T054 and T062

### Contract implementation

- [x] T020 Implement generation request, lesson draft, environment, communication-event, and transfer schemas in `src/lib/real-talk/generation-contract.ts`
- [x] T021 Implement deterministic interaction-window selection in `src/lib/real-talk/generation-contract.ts`
- [x] T022 Implement source-evidence failure checks in `src/lib/real-talk/generation-contract.ts`
- [x] T023 Extract `TranscriptSourceAdapter`, acquisition metadata, typed cues, trust, review status, and failures into `src/features/real-talk/domain/transcript-source.ts`
- [x] T024 Move the current `youtube-transcript` implementation behind the explicitly experimental adapter in `src/features/real-talk/server/transcript-sources/youtube-experimental.ts`
- [x] T025 Add and regression-test a fail-closed policy in `src/features/real-talk/server/transcript-source-policy.ts`; production always rejects the experimental adapter and non-production requires explicit opt-in
- [x] T026 Extend Real Talk types with environment, communication events, transfer, warnings, and review state in `src/types/real-talk.ts`
- [x] T027 Add app-level Supabase table types without editing generated types in `src/types/app-database.ts`
- [x] T028 Update the server Supabase client to use app-level database types in `src/lib/supabase/server.ts`
- [x] T029 Extract transcript acquisition, metadata, window selection, Gemini generation, schema validation, evidence validation, and escaped prompt framing into bounded Real Talk domain and server modules

**Checkpoint**: Typed input, typed output, evidence validation, explicit transcript-source policy, and bounded untrusted prompt data are implemented and covered by the targeted technical suite.

---

## Phase 3: User Story 1 — Generate a private lesson draft (Priority: P1) 🎯 MVP

**Goal**: An authenticated editor receives a complete private AI draft from supported source evidence.

**Independent Test**: A mocked valid source and Gemini response produce one complete private draft; anonymous access and provider failures produce no draft.

### Tests for User Story 1

- [x] T030 [P] [US1] Add mocked happy-path application orchestration test in `src/__tests__/real-talk-generation-action.test.ts`
- [x] T031 [P] [US1] Prove anonymous generation stops before rate limit, transcript, Gemini, or persistence work
- [x] T032 [P] [US1] Cover Gemini 429, malformed JSON, missing candidate, network failure, and persistence failure propagation; live provider behavior remains T082
- [x] T033 [P] [US1] Add `src/__fixtures__/real-talk/long-interaction-transcript.ts` and verify deterministic selection of a deep interaction-rich window

### Implementation for User Story 1

- [x] T034 [US1] Require Supabase authentication before generation work in `src/app/actions/real-talk.ts`
- [x] T035 [US1] Validate level and canonical HTTPS YouTube watch, mobile, shorts, embed, or `youtu.be` URLs before auth; reject raw IDs, HTTP, invalid IDs, relative strings, and lookalike hosts through `src/features/real-talk/domain/youtube-source.ts`
- [x] T036 [US1] Bound and sanitize source cues in `src/features/real-talk/server/transcript-sources/youtube-experimental.ts`
- [x] T037 [US1] Select an interaction-rich source window in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T038 [US1] Fetch honest source metadata through YouTube oEmbed in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T039 [US1] Request structured environment-first output from Gemini in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T040 [US1] Record the actual successful Gemini model in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T041 [US1] Define stable machine-readable result codes in `src/features/real-talk/domain/generation-result.ts` and propagate them through compiler, action, and UI
- [x] T042 [US1] Remove silent preview fallback; required database failure returns `DRAFT_PERSISTENCE_FAILED`
- [x] T043 [US1] Move persistence into `src/features/real-talk/server/draft-repository.ts` and use deterministic owner + YouTube + level identity

**Checkpoint**: US1 mocked orchestration, source selection, URL validation, failure semantics, and technical execution pass. Live Gemini and real database proof remain open.

---

## Phase 4: User Story 2 — Reject unsupported AI content (Priority: P1)

**Goal**: No unsupported model language or reference reaches persistence.

**Independent Test**: Invalid controlled fixtures fail with stable evidence codes and no database writes.

### Tests for User Story 2

- [x] T044 [P] [US2] Complete the eleven-code evidence rejection matrix and duplicate-code assertion
- [x] T045 [P] [US2] Assert no persistence occurs after model-output, schema, or source-evidence failure
- [x] T046 [P] [US2] Assert prompt-injection-like source data stays inside the escaped prompt boundary and cannot reach persistence after compiler rejection

### Implementation for User Story 2

- [x] T047 [US2] Parse model output with the runtime Zod schema
- [x] T048 [US2] Validate transcript text against selected source evidence
- [x] T049 [US2] Validate vocabulary, fill answers, speaking drills, transfer language, timestamps, speakers, and segment references
- [x] T050 [US2] Encode untrusted metadata and captions as escaped JSON or JSONL inside one bounded source section with governing instructions before and after it
- [x] T051 [US2] Surface unresolved AI and transcript-source review warnings through the compiler, action, persistence, and editor UI
- [x] T052 [US2] Add conservative evidence normalization for contractions, punctuation, selected HTML entities, and caption artifacts

**Checkpoint**: US2 technical fixtures and no-write assertions pass. Live adversarial Gemini behavior and human evidence review remain open.

---

## Phase 5: User Story 3 — Keep drafts private and reviewable (Priority: P1)

**Goal**: Persist the full draft under owner-only RLS and visibly retain uncertainty.

**Independent Test**: owner A can reload their draft; owner B and anonymous users cannot access or publish it.

### Tests for User Story 3

- [x] T053 [P] [US3] Add migration assertions for private defaults, lifecycle constraints, canonical policy reset, owner-only reads and writes, publication denial, and review-state denial
- [ ] T054 [P] [US3] Run the two-user and anonymous RLS integration scaffold against an authorized migrated non-production Supabase project and record exact evidence
- [x] T055 [P] [US3] Extract row mapping and cover environment, events, transfer, warnings, model, status, segment, and safe fallbacks in `src/__tests__/real-talk-draft-mapping.test.ts`

### Implementation for User Story 3

- [x] T056 [US3] Add private-draft fields, explicitly enable RLS, remove previous permissive policies, and install one canonical owner-private policy set
- [x] T057 [US3] Return existing user-created rows to private `ai_draft` state and clear unverified review metadata
- [x] T058 [US3] Persist environment, communication events, transfer, warnings, model, and review state
- [x] T059 [US3] Reload private lesson drafts through the isolated mapping boundary
- [x] T060 [US3] Exclude private drafts from public catalog queries
- [x] T061 [US3] Display private AI-draft status, stable failures, retry guidance, evidence codes, and review warnings
- [ ] T062 [US3] Apply or dry-run the migration in an authorized non-production Supabase project
- [ ] T063 [US3] Regenerate `src/types/supabase.ts` after migration and remove temporary types only when equivalent coverage is proven
- [ ] T064 [US3] Add owner draft list or delete UI only if required to verify retention; otherwise record the decision for a follow-up spec

**Checkpoint**: Migration-contract and reload-mapping tests pass. Hosted migration, owner A/owner B/anonymous RLS, repeated generation, and partial-write evidence remain open.

---

## Phase 6: User Story 4 — Preview a natural lesson loop (Priority: P2)

**Goal**: Evaluate pedagogical coherence through environment, retrieval, speaking, and transfer preview.

**Independent Test**: Preview cannot complete through recognition tasks alone and makes no unsupported speech claim.

### Tests for User Story 4

- [x] T065 [P] [US4] Cover environment-first order, learner role, partner role, real-world goal, and AI-draft status
- [x] T066 [P] [US4] Prove transfer and completion stay unavailable until every source-backed phrase is acknowledged as spoken
- [x] T067 [P] [US4] Prove transfer remains disabled until a minimum response and independent-attempt confirmation exist; completion fires only from the final action
- [x] T068 [P] [US4] Assert explicit no-audio-scoring disclosure and absence of unsupported pronunciation, mastery, automatic-SRS, or AI-voice-score claims

### Implementation for User Story 4

- [x] T069 [US4] Surface environment, learner role, partner role, and goal before lesson phases
- [x] T070 [US4] Replace the mock microphone control with honest speak-and-confirm practice
- [x] T071 [US4] Require source-backed phrase production acknowledgements
- [x] T072 [US4] Require a changed-context transfer attempt
- [x] T073 [US4] Replace mastery and automatic-SRS completion copy with immediate-practice evidence
- [ ] T074 [US4] Run desktop and mobile Playwright preview flow against a controlled persisted draft
- [ ] T075 [US4] Manually review one valid draft for situation fidelity, source language, speaker uncertainty, Vietnamese guidance, and transfer coherence

**Checkpoint**: US4 component suites pass. Browser preview and human pedagogical review remain open.

---

## Phase 7: Cross-cutting verification and convergence

**Purpose**: Prove the exact final state; no unchecked item may be hidden by a green partial check.

- [x] T076 Run `npm run lint`; passed in Verify runs #88 and #89, with evidence recorded in `verification.md`
- [x] T077 Run `npx tsc --noEmit`; passed in Verify runs #88 and #89
- [x] T078 Run `npm run test`; 35 files and 335 tests passed in Verify run #88, then passed again after the verification document commit in run #89
- [x] T079 Run `npm run test:content-standard`; 1 file and 50 tests passed in Verify runs #88 and #89
- [x] T080 Run `npm run build`; Next.js 16.2.9 production compilation and page generation passed without deployment in Verify runs #88 and #89
- [x] T081 Run the targeted Real Talk contract, policy, orchestration, result, URL, migration, mapping, and preview suites; 9 files and 71 tests passed in Verify run #88 and passed again in run #89
- [ ] T082 Run non-production live Gemini happy path, invalid output, 429, provider-failure, adversarial prompt-source, and persistence-failure checks
- [ ] T083 Verify official source playback and oEmbed metadata on desktop and mobile
- [ ] T084 Approve at least one production transcript acquisition mode or retain the explicit merge blocker; the experimental adapter is isolated and fail-closed in production
- [ ] T085 Run the requirements checklist and check only observed items
- [ ] T086 Run final cross-artifact analysis and remove spec, plan, task, and evidence inconsistencies
- [ ] T087 Run convergence review: map every functional requirement and success criterion to implementation and observed evidence
- [ ] T088 Update PR #54 with the final exact head, final successful Verify run, commands, counts, warnings, manual reviews, and remaining blockers
- [ ] T089 Obtain owner acceptance; do not merge or deploy automatically

## Dependencies & execution order

- Phase 1 establishes governance.
- Phase 2 blocks all product stories.
- US1 and US2 converge compiler contracts before persistence or preview is trusted.
- US3 depends on valid compiler output and database design.
- US4 depends on the lesson draft contract; browser proof depends on a controlled persisted draft.
- Phase 7 separates technical, provider, database, browser, and human evidence.

## Implementation strategy

The bounded MVP remains:

```text
authenticated request
→ approved source boundary
→ bounded source evidence
→ structured generation
→ schema and evidence validation
→ persisted owner-private draft
→ environment-first preview
→ phrase production
→ changed-context transfer
```

Stop after spec 001 convergence. Publication belongs to spec 002.

## Notes

- `verification.md` records the exact technical evidence, failures found during verification, and non-blocking warnings.
- Real Talk domain, server, URL, and database contract suites run in the Vitest Node project; component suites run in jsdom; live RLS runs only through the integration config.
- The RLS migration removes previous policies because PostgreSQL combines permissive policies with OR.
- Untrusted metadata and captions are escaped data inside one prompt boundary; this is hardening, not proof of universal prompt-injection immunity.
- `REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true` is allowed only in development or test; production rejects the experimental adapter regardless of the flag.
- Repeated generation updates one current draft per owner + YouTube source + level; immutable attempt history is deferred.
- A persistence failure is never a successful preview.
- T076–T081 are technical evidence only. They do not satisfy T054, T062, T074, T075, T082, T083, or T084.
- Do not mark external API tasks complete from mocked results.
- Do not mark human review complete from metadata or model output alone.
- Do not create spec 002 implementation while spec 001 still has critical open evidence.

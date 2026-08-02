---

description: "Dependency-ordered implementation and verification tasks for the private natural lesson compiler"
---

# Tasks: Private Natural Lesson Compiler

**Input**: Design documents from `/specs/001-private-natural-lesson-compiler/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/generation-contract.md`

**Tests**: Required because generation, evidence, authentication, RLS, and learner completion are product-critical contracts.

**Status rule**: A checked implementation task means the code/artifact exists on the branch. It does not imply checks passed. Verification tasks remain unchecked until observed on the exact final commit.

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
- [x] T013 [P] Add invalid required-branch Zod output fixture in `src/__tests__/real-talk-generation-contract.test.ts`; execution remains tracked by T081
- [x] T014 [P] Add regression test for invented transcript text in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T015 [P] Add regression test for invented speaking language in `src/__tests__/real-talk-generation-contract.test.ts`
- [x] T016 [P] Add controlled fixtures for invalid/reversed/out-of-window timestamps, duplicate indices, unknown speakers, unknown segment references, invented vocabulary, fill answer, speaking language, and transfer language in `src/__tests__/real-talk-generation-contract.test.ts`; execution remains tracked by T081
- [x] T017 [P] Add prompt-injection metadata/caption fixture in `src/__fixtures__/real-talk/prompt-injection-caption.ts` and delimiter/escaping assertions in `src/__tests__/real-talk-generation-contract.test.ts`; execution remains tracked by T081
- [x] T018 [P] Add application/server-action contract tests for auth-before-external-call, invalid input, rate limiting, typed provider failures, and bounded internal errors in `src/__tests__/real-talk-generation-action.test.ts`; execution remains tracked by T081
- [x] T019 [P] Add two-owner plus anonymous Supabase RLS integration scaffolding in `src/__tests__/integration/real-talk-draft-rls.integration.test.ts`; execution against an authorized migrated non-production database remains tracked by T054 and T062

### Contract implementation

- [x] T020 Implement generation request, lesson draft, environment, communication-event, and transfer schemas in `src/lib/real-talk/generation-contract.ts`
- [x] T021 Implement deterministic interaction-window selection in `src/lib/real-talk/generation-contract.ts`
- [x] T022 Implement source-evidence failure checks in `src/lib/real-talk/generation-contract.ts`
- [x] T023 Extract `TranscriptSourceAdapter`, acquisition metadata, typed cues, trust, review status, and failures into `src/features/real-talk/domain/transcript-source.ts`
- [x] T024 Move the current `youtube-transcript` implementation behind the explicitly experimental adapter in `src/features/real-talk/server/transcript-sources/youtube-experimental.ts`
- [x] T025 Add and regression-test a fail-closed policy in `src/features/real-talk/server/transcript-source-policy.ts` and `src/__tests__/real-talk-transcript-source-policy.test.ts`; production always rejects the experimental adapter and non-production requires explicit opt-in
- [x] T026 Extend Real Talk lesson and draft types with environment, communication events, transfer, warnings, and review state in `src/types/real-talk.ts`
- [x] T027 Add app-level Supabase table types without editing generated types in `src/types/app-database.ts`
- [x] T028 Update the server Supabase client to use app-level database types in `src/lib/supabase/server.ts`
- [x] T029 Extract transcript acquisition, source metadata, window selection, Gemini generation, schema validation, and evidence validation from `src/app/actions/real-talk.ts` into `src/features/real-talk/server/private-lesson-compiler.ts`; move pure prompt construction and escaped source framing into `src/features/real-talk/domain/lesson-prompt.ts`; persistence is isolated by T043

**Checkpoint**: All user stories depend on typed input, typed model output, evidence validation, explicit transcript-source policy, and bounded untrusted prompt data.

---

## Phase 3: User Story 1 — Generate a private lesson draft (Priority: P1) 🎯 MVP

**Goal**: An authenticated editor receives a complete private AI draft from supported source evidence.

**Independent Test**: A mocked valid source and Gemini response produce one complete private draft; anonymous access and provider failures produce no draft.

### Tests for User Story 1

- [x] T030 [P] [US1] Add mocked happy-path application orchestration test in `src/__tests__/real-talk-generation-action.test.ts`
- [x] T031 [P] [US1] Add anonymous rejection test proving rate limit, compiler/transcript/Gemini work, and persistence are not called in `src/__tests__/real-talk-generation-action.test.ts`
- [x] T032 [P] [US1] Add mocked propagation cases for Gemini 429, malformed JSON, missing candidate, network failure, and persistence failure in `src/__tests__/real-talk-generation-action.test.ts`; direct provider mapping and execution remain required by T081–T082
- [x] T033 [P] [US1] Add `src/__fixtures__/real-talk/long-interaction-transcript.ts` and verify deterministic selection of the deep interaction-rich window in `src/__tests__/real-talk-generation-contract.test.ts`; execution remains tracked by T081

### Implementation for User Story 1

- [x] T034 [US1] Require Supabase authentication before generation work in `src/app/actions/real-talk.ts`
- [x] T035 [US1] Validate URL and target level with Zod in `src/app/actions/real-talk.ts`
- [x] T036 [US1] Bound and sanitize source cues in `src/features/real-talk/server/transcript-sources/youtube-experimental.ts`
- [x] T037 [US1] Select an interaction-rich source window in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T038 [US1] Fetch honest source metadata through YouTube oEmbed in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T039 [US1] Request structured environment-first output from Gemini in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T040 [US1] Record the actual successful Gemini model in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T041 [US1] Define stable machine-readable result codes in `src/features/real-talk/domain/generation-result.ts`, propagate them through compiler/action/UI, and add unexecuted contract coverage in `src/__tests__/real-talk-generation-result.test.ts`
- [x] T042 [US1] Remove silent preview fallback; required database failure now returns `DRAFT_PERSISTENCE_FAILED` from `src/features/real-talk/server/draft-repository.ts` and cannot render a saved draft in `src/app/(main)/real-talk/create/page.tsx`
- [x] T043 [US1] Move persistence into `src/features/real-talk/server/draft-repository.ts` and use deterministic owner+YouTube+level identity from `src/features/real-talk/domain/draft-identity.ts`; repeated generation updates one current draft while different owners/levels remain separate

**Checkpoint**: US1 implementation and mocked orchestration/selection artifacts exist, but exact-head execution and live provider verification remain required before the story is independently demonstrated.

---

## Phase 4: User Story 2 — Reject unsupported AI content (Priority: P1)

**Goal**: No unsupported model language or reference reaches persistence.

**Independent Test**: Invalid controlled fixtures fail with stable evidence codes and no database writes.

### Tests for User Story 2

- [x] T044 [P] [US2] Complete the eleven-code evidence rejection matrix and duplicate-code assertion in `src/__tests__/real-talk-generation-contract.test.ts`; execution remains tracked by T081
- [x] T045 [P] [US2] Assert no persistence occurs after mocked model-output/schema or source-evidence failure in `src/__tests__/real-talk-generation-action.test.ts`; exact-head execution remains tracked by T081
- [x] T046 [P] [US2] Assert prompt-injection-like source data is escaped inside the prompt boundary and compiler rejection cannot reach persistence in `src/__tests__/real-talk-generation-contract.test.ts` and `src/__tests__/real-talk-generation-action.test.ts`; direct model-adversarial verification remains tracked by T082

### Implementation for User Story 2

- [x] T047 [US2] Parse model output with the runtime Zod schema in `src/features/real-talk/server/private-lesson-compiler.ts`
- [x] T048 [US2] Validate transcript text against selected source evidence in `src/lib/real-talk/generation-contract.ts`
- [x] T049 [US2] Validate vocabulary, fill answers, speaking drills, transfer language, timestamps, speakers, and segment references in `src/lib/real-talk/generation-contract.ts`
- [x] T050 [US2] Encode untrusted metadata and captions as escaped JSON/JSONL inside single bounded delimiters, repeat the post-source instruction boundary, and prohibit source data from changing rules in `src/features/real-talk/domain/lesson-prompt.ts`
- [x] T051 [US2] Surface unresolved AI and transcript-source review warnings from `src/features/real-talk/server/private-lesson-compiler.ts` through `src/app/actions/real-talk.ts`
- [x] T052 [US2] Add conservative evidence normalization coverage for contractions, punctuation, `&quot;`/`&amp;` entities, and caption artifacts in `src/__tests__/real-talk-generation-contract.test.ts`; execution remains tracked by T081

**Checkpoint**: US2 rejection and prompt-boundary artifacts exist, but exact-head execution and live adversarial provider verification remain required.

---

## Phase 5: User Story 3 — Keep drafts private and reviewable (Priority: P1)

**Goal**: Persist the full draft under owner-only RLS and visibly retain uncertainty.

**Independent Test**: ownerA can reload their draft; ownerB and anonymous users cannot access or publish it.

### Tests for User Story 3

- [x] T053 [P] [US3] Add migration assertions for private defaults, lifecycle constraints, canonical policy reset, owner-only reads/writes, publication denial, and review-state denial in `src/__tests__/real-talk-migration-contract.test.ts`; execution remains tracked by T081
- [ ] T054 [P] [US3] Run the two-user/anonymous RLS integration scaffold in `src/__tests__/integration/real-talk-draft-rls.integration.test.ts` against an authorized migrated non-production Supabase project and record exact evidence
- [x] T055 [P] [US3] Extract row mapping into `src/features/real-talk/server/draft-mapping.ts` and add reload mapping coverage for environment, events, transfer, warnings, model, status, segment, and safe fallbacks in `src/__tests__/real-talk-draft-mapping.test.ts`; execution remains tracked by T081

### Implementation for User Story 3

- [x] T056 [US3] Add private-draft fields, explicitly enable RLS, remove all previous permissive policies, and install one canonical owner-private policy set in `supabase/migrations/20260802190000_real_talk_private_draft_gate.sql`
- [x] T057 [US3] Return existing user-created rows to private `ai_draft` state and clear unverified review metadata in `supabase/migrations/20260802190000_real_talk_private_draft_gate.sql`
- [x] T058 [US3] Persist environment, communication events, transfer, warnings, model, and review state in `src/features/real-talk/server/draft-repository.ts`
- [x] T059 [US3] Reload private lesson drafts through the isolated mapping boundary in `src/features/real-talk/server/draft-mapping.ts` and `src/app/actions/real-talk.ts`
- [x] T060 [US3] Exclude private drafts from public catalog queries in `src/app/actions/real-talk.ts`
- [x] T061 [US3] Display private AI-draft status, stable failures, retry guidance, evidence codes, and review warnings in `src/app/(main)/real-talk/create/page.tsx`
- [ ] T062 [US3] Apply or dry-run the migration in an authorized non-production Supabase project
- [ ] T063 [US3] Regenerate `src/types/supabase.ts` after migration and remove temporary types only when equivalent coverage is proven
- [ ] T064 [US3] Add owner draft list/delete UI only if required to verify retention; otherwise record as a follow-up spec decision

**Checkpoint**: US3 code and database/mapping test artifacts exist, but migration application, exact-head execution, and observed ownerA/ownerB/anonymous behavior remain required.

---

## Phase 6: User Story 4 — Preview a natural lesson loop (Priority: P2)

**Goal**: Evaluate pedagogical coherence through environment, retrieval, speaking, and transfer preview.

**Independent Test**: Preview cannot complete through recognition tasks alone and makes no unsupported speech claim.

### Tests for User Story 4

- [ ] T065 [P] [US4] Add component test showing environment and roles before lesson phases in `src/__tests__/real-talk-lesson-preview.test.tsx`
- [ ] T066 [P] [US4] Add component test blocking completion until phrase production acknowledgements are complete in `src/__tests__/real-talk-post-watch.test.tsx`
- [ ] T067 [P] [US4] Add component test blocking completion until transfer response attempt in `src/__tests__/real-talk-post-watch.test.tsx`
- [ ] T068 [P] [US4] Add assertion that UI contains no pronunciation/mastery claim in `src/__tests__/real-talk-post-watch.test.tsx`

### Implementation for User Story 4

- [x] T069 [US4] Surface environment, learner role, partner role, and goal in `src/components/real-talk/RealTalkLesson.tsx`
- [x] T070 [US4] Replace the mock microphone control with honest speak-and-confirm practice in `src/components/real-talk/PostWatchPhase.tsx`
- [x] T071 [US4] Require source-backed phrase production acknowledgements in `src/components/real-talk/PostWatchPhase.tsx`
- [x] T072 [US4] Require a changed-context transfer attempt in `src/components/real-talk/PostWatchPhase.tsx`
- [x] T073 [US4] Replace mastery and automatic-SRS completion copy with immediate-practice evidence in `src/components/real-talk/RealTalkLesson.tsx`
- [ ] T074 [US4] Run desktop and mobile Playwright preview flow against a controlled persisted draft
- [ ] T075 [US4] Manually review one valid draft for situation fidelity, source language, speaker uncertainty, Vietnamese guidance, and transfer coherence

**Checkpoint**: The draft is useful for human evaluation, but it remains unreviewed and private.

---

## Phase 7: Cross-cutting verification and convergence

**Purpose**: Prove the exact final state; no unchecked item may be hidden by a green partial check.

- [ ] T076 Run `npm run lint` against the exact final commit and record the result
- [ ] T077 Run `npx tsc --noEmit` against the exact final commit and record the result
- [ ] T078 Run `npm run test` against the exact final commit and record the result
- [ ] T079 Run `npm run test:content-standard` against the exact final commit and record the result
- [ ] T080 Run `npm run build` against the exact final commit and record the result
- [ ] T081 Run targeted compiler, prompt-boundary, transcript policy, orchestration, result-code, migration-contract, draft-mapping, repository-identity, and preview tests against the exact final commit
- [ ] T082 Run non-production live Gemini happy path, invalid output, 429, provider-failure, adversarial prompt-source, and persistence-failure checks
- [ ] T083 Verify official source playback and oEmbed metadata on desktop and mobile
- [ ] T084 Approve at least one production transcript acquisition mode or retain the explicit merge blocker; the experimental adapter is already isolated and fail-closed in production
- [ ] T085 Run the requirements checklist in `checklists/requirements.md` and check only observed items
- [ ] T086 Run final cross-artifact analysis and remove spec/plan/task inconsistencies
- [ ] T087 Run convergence review: map every FR and SC to implementation and observed evidence
- [ ] T088 Update PR #54 with exact final head, completed tasks, commands run, manual reviews, remaining blockers, and no unverified success claims
- [ ] T089 Obtain owner acceptance; do not merge or deploy automatically

## Dependencies & Execution Order

### Phase dependencies

- Phase 1 establishes governance.
- Phase 2 blocks all product stories.
- US1 and US2 share compiler contracts and should converge before persistence or preview is trusted.
- US3 depends on valid compiler output and database design.
- US4 can use fixtures but final reload verification depends on US3.
- Phase 7 depends on all intended user stories and exact final code.

### User story dependencies

- **US1**: Depends on Phase 2; independently demonstrates private generation with mocks.
- **US2**: Depends on Phase 2; independently demonstrates rejection with fixtures.
- **US3**: Depends on US1/US2 contracts; independently demonstrates ownership and reload.
- **US4**: Depends on the lesson draft contract; can use a static fixture before live persistence.

### Parallel opportunities

- Contract fixture tests can run in parallel across different test files.
- RLS integration setup and UI component tests can proceed in parallel after schemas stabilize.
- Documentation checklist and manual source review can proceed while technical checks run.
- Tasks touching `src/app/actions/real-talk.ts` must remain sequential.

## Implementation Strategy

### MVP first

The minimum accepted slice is US1 + US2:

```text
authenticated request
→ bounded source evidence
→ structured generation
→ schema and evidence validation
→ persisted private draft result
```

Stop and verify this slice before expanding database or preview behavior.

### Incremental delivery

1. Converge contracts and compiler behavior.
2. Converge owner-private persistence and RLS.
3. Converge environment and transfer preview.
4. Stop. Publication belongs to spec 002.

## Notes

- Checked code/test-artifact tasks do not imply verification passed.
- Real Talk domain/server/database contract suites are assigned to the Vitest Node project; component `.tsx` suites remain in jsdom, and live RLS cases run only through the integration config.
- The RLS migration removes all previous policies before creating the canonical set because PostgreSQL combines permissive policies with OR.
- Untrusted metadata/captions are escaped JSON/JSONL data inside one delimiter pair; this is a prompt-hardening boundary, not proof against every model-level adversarial behavior.
- `REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS=true` is permitted only in development or test; production ignores the flag and rejects the experimental adapter.
- Repeated generation updates one current draft per owner+YouTube+level; immutable attempt history is deferred.
- A persistence failure is never a successful preview in spec 001.
- Do not mark T054 or T062 complete without an authorized migrated non-production database run.
- Do not mark external API tasks complete from mocked results.
- Do not mark manual review tasks complete from metadata or model output alone.
- Do not create implementation for spec 002 while spec 001 has unresolved critical tasks.

---
description: "Dependency-ordered implementation and verification tasks for the private natural lesson compiler"
---

# Tasks: Private Natural Lesson Compiler

**Input**: Design documents from `specs/001-private-natural-lesson-compiler/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/generation-contract.md`, `quickstart.md`

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it changes different files and has no
  incomplete dependency.
- **[Story]**: Maps work to a user story (`US1`, `US2`, `US3`, or `US4`).
- Every task names the expected file or evidence location.
- A checked implementation task means the artifact exists. It does not imply
  hosted, provider, browser, or human verification unless the task explicitly
  records that evidence.

## Phase 1: Governance and specification baseline

**Purpose**: Establish the governing product truth and keep later implementation
inside one feature boundary.

- [x] T001 Adopt Spec Kit-compatible constitution and feature directory structure
- [x] T002 Create the project rebuild roadmap as spec `000`
- [x] T003 Create active spec `001` for the private natural lesson compiler
- [x] T004 Align `AGENTS.md`, product truth, and current priority with spec 001
- [x] T005 Record that publication, curriculum sequencing, delayed review,
  rewards, payments, and deployment are outside spec 001

---

## Phase 2: Foundational contracts

**Purpose**: Build the typed and policy boundaries that every user story depends
on.

- [x] T006 Define stable generation success and failure contracts in
  `src/features/real-talk/domain/generation-result.ts`
- [x] T007 Define canonical YouTube source parsing in
  `src/features/real-talk/domain/youtube-source.ts`
- [x] T008 Define deterministic private draft identity in
  `src/features/real-talk/domain/draft-identity.ts`
- [x] T009 Define transcript source adapter, acquisition mode, trust, and review
  metadata in `src/features/real-talk/domain/transcript-source.ts`
- [x] T010 Define the environment-first lesson prompt boundary in
  `src/features/real-talk/domain/lesson-prompt.ts`
- [x] T011 Define the strict generated draft schema and source-evidence validation
  contract in `src/lib/real-talk/generation-contract.ts`
- [x] T012 Separate the private generation application service from the Next.js
  server action in `src/features/real-talk/application/generate-private-lesson.ts`
- [x] T013 Isolate Gemini transport and provider failures in
  `src/features/real-talk/server/gemini-lesson-provider.ts`
- [x] T014 Isolate transcript policy and the experimental implementation in
  `src/features/real-talk/server/transcript-source-policy.ts` and
  `src/features/real-talk/server/transcript-sources/youtube-experimental.ts`
- [x] T015 Isolate persistence and reload mapping in
  `src/features/real-talk/server/draft-repository.ts` and
  `src/features/real-talk/server/draft-mapping.ts`

**Checkpoint**: Typed contracts exist for request, source, model, persistence, and
result semantics. External evidence is still required.

---

## Phase 3: User Story 1 — Generate a private lesson draft

**Goal**: An authenticated editor can generate and save one owner-private lesson
draft from bounded source evidence.

**Independent test**: A controlled source fixture and mocked provider produce one
complete private `ai_draft` with environment, events, transfer, warnings, source,
and actual model identifier.

- [x] T016 [US1] Validate URL and requested level before authentication or
  external work
- [x] T017 [US1] Authenticate before rate limit, transcript, Gemini, or
  persistence
- [x] T018 [US1] Enforce rate-limit failure semantics and bounded retry guidance
- [x] T019 [US1] Select one deterministic interaction-rich source window
- [x] T020 [US1] Fetch YouTube oEmbed metadata with honest fallbacks
- [x] T021 [US1] Request strict structured Gemini output and record the model that
  succeeds
- [x] T022 [US1] Persist one current private draft per owner, source, and level
- [x] T023 [US1] Ensure persistence failure is returned as failure, not preview or
  saved success
- [x] T024 [US1] Reload environment, events, transfer, warnings, model, status, and
  source window from persisted rows
- [x] T025 [US1] Keep the public catalog query limited to public rows

**Checkpoint**: Mocked application behavior is implemented. Real provider and
hosted persistence evidence remain separate gates.

---

## Phase 4: User Story 2 — Reject unsupported AI content

**Goal**: Model output can become a draft only when structure and source evidence
are valid.

**Independent test**: Invalid structure, invented text, invalid timing, unknown
speakers, unknown segment references, unsupported answers, and prompt-like
caption instructions all fail before persistence.

- [x] T026 [US2] Generate the provider schema from the Zod contract
- [x] T027 [US2] Sanitize request-time JSON Schema to the Gemini-supported subset
  while preserving full Zod runtime validation
- [x] T028 [US2] Reject unknown top-level model fields rather than silently
  stripping them
- [x] T029 [US2] Implement the complete source-evidence rejection matrix
- [x] T030 [US2] Deduplicate evidence failure codes
- [x] T031 [US2] Normalize conservative punctuation, contractions, entities, and
  caption artifacts
- [x] T032 [US2] Encode metadata as escaped JSON and cues as escaped JSONL inside
  one untrusted-data boundary
- [x] T033 [US2] Repeat governing instructions after the untrusted source block
- [x] T034 [US2] Prevent prompt-injection-like source failures from reaching
  persistence
- [x] T035 [US2] Add controlled long-source and adversarial-caption fixtures

**Checkpoint**: Deterministic schema and evidence gates exist and are exercised by
unit/contract tests. Live adversarial provider behavior remains T082.

---

## Phase 5: User Story 3 — Keep drafts private and reviewable

**Goal**: Generated drafts remain owner-private and cannot be elevated to public
or approved state by an ordinary user.

**Independent test**: Owner A can insert/reload a private draft; anonymous and
owner B cannot read or mutate it; owner A cannot publish or approve it.

- [x] T036 [US3] Create the Real Talk private-draft schema migration
- [x] T037 [US3] Default generated videos to private and lessons to `ai_draft`
- [x] T038 [US3] Repair legacy user-created rows back to private unreviewed state
- [x] T039 [US3] Replace previous Real Talk policies with one canonical RLS set
- [x] T040 [US3] Prevent ordinary users from publishing or elevating review state
- [x] T041 [US3] Add owner-private draft repository and one-current-draft identity
- [x] T042 [US3] Add row-to-domain reload mapping
- [x] T043 [US3] Add migration contract tests
- [x] T044 [US3] Add owner A, owner B, and anonymous PostgREST integration
  scaffolding
- [x] T045 [US3] Apply the authorized private-draft migrations to hosted Supabase
  project `zpiwddskhduuykpxltun`
- [x] T046 [US3] Run a rollback-only PostgreSQL role/JWT matrix and confirm cleanup
- [x] T047 [US3] Run Supabase Security and Performance Advisors and address Real
  Talk findings
- [x] T048 [US3] Generate and reconcile the exact hosted Real Talk type fragment
- [x] T049 [US3] Replace the full local generated `src/types/supabase.ts` and prove
  hosted-schema equivalence; the generated baseline matches project
  `zpiwddskhduuykpxltun`. After T060 and T067, only the unapplied
  `20260731162613_learning_attempts.sql` remains as an app-level overlay;
  evidence is recorded in `t049-hosted-types-verification.md`
- [x] T050 [US3] Run the signed-session PostgREST integration scaffold against the
  authorized migrated project; observed on 2026-08-03 through two real Supabase
  Auth sessions with all owner, anonymous, cross-owner, publication, review-state,
  and public-catalog assertions passing; cleanup returned zero test users, videos,
  and lessons; evidence is recorded in `t050-signed-session-verification.md`
- [ ] T051 [US3] Apply and verify the atomic private-draft RPC, then run repeated
  generation, reload, and rollback behavior through the real server action and
  hosted database
- [x] T052 [US3] Decide retention, owner deletion UX, and immutable attempt history;
  retain one current private draft without automatic expiry, require deliberate
  owner-only hard deletion in the first draft-management surface, and defer full
  immutable generation history; decision recorded in
  `retention-deletion-history-decision.md`

**Checkpoint**: Hosted database invariants now have role-level and signed-session
PostgREST evidence. The full generated type baseline matches hosted truth; pending
DDL remains visible only through named overlays. Retention and history boundaries
are resolved. The real server-action path remains open.

---

## Phase 5B: Transcript provenance boundary

**Goal**: A future production-approved transcript cannot be created merely by
self-labelling browser data as trusted.

- [x] T053 Define typed rights basis and provenance metadata, including canonical
  source, rights reference, server-derived submitter/reviewer identities, review
  time, and SHA-256 cue digest
- [x] T054 Validate executing adapter identity/trust, acquisition-mode rights
  compatibility, language, independent review, safe references, canonical source,
  and cue integrity before compilation
- [x] T055 Thread transcript metadata through compiler, application service, and
  private-draft repository
- [x] T056 Add versioned migration
  `20260803010500_real_talk_transcript_provenance.sql` for acquisition mode,
  review status, metadata, digest, constraints, and trusted-write trigger
- [x] T057 Prevent ordinary authenticated clients from self-approving transcript
  provenance and make approved provenance immutable outside the trusted service
  path
- [x] T058 Add forged adapter, missing provenance, self-review, secret reference,
  cue-tamper, and migration contract tests
- [x] T059 Include provenance tests in the targeted Real Talk suite
- [x] T060 Obtain owner authorization, apply the provenance migration to hosted
  Supabase, rerun advisors, regenerate full hosted types, and execute trusted
  write/tamper verification; hosted migration `20260803011348`, service-role
  trusted write, owner read, tamper rejection, cleanup, and generated types
  are recorded in `t060-t067-hosted-schema-verification.md`
- [ ] T061 Implement one actual trusted transcript ingestion/reviewer flow and run
  one controlled rights-reviewed source through it

**Checkpoint**: The code and migration contract are implemented and tested. No
production adapter is approved, and the migration has not been applied hosted.

---

## Phase 5C: Atomic draft persistence

**Goal**: A lesson-write failure cannot leave a video-only private draft.

- [x] T062 Add versioned migration
  `20260803013000_real_talk_atomic_private_draft.sql`
- [x] T063 Implement one `SECURITY INVOKER` RPC that derives `auth.uid()`, remains
  subject to caller RLS, rejects publication/review elevation, and writes video
  plus lesson in one transaction
- [x] T064 Replace the repository's two independent upserts with the atomic RPC
- [x] T065 Reconcile the pending RPC type through `AppDatabase`
- [x] T066 Add contract tests for caller RLS, one-transaction writes, repeat
  identity, private state, grants, and repository architecture
- [x] T067 Apply the atomic RPC migration to hosted Supabase with explicit owner
  authorization and verify rollback after a controlled lesson failure; the
  initial hosted probe exposed an ambiguous `video_id` conflict target, fixed by
  migration `20260803011736`; repeat identity, update, rollback, publication
  rejection, and cleanup evidence is recorded in
  `t060-t067-hosted-schema-verification.md`
- [ ] T068 Run repeated generation twice through the real server action and prove
  one video/lesson pair is updated rather than duplicated

**Checkpoint**: Code and migration contracts remove the known two-write path.
Hosted transactional behavior remains unclaimed.

---

## Phase 6: User Story 4 — Preview a natural lesson loop

**Goal**: The editor can inspect whether a private draft behaves like a natural,
production-oriented lesson without unsupported learning claims.

- [x] T069 [US4] Surface environment, learner role, partner role, and goal before
  lesson phases
- [x] T070 [US4] Replace the mock microphone control with honest speak-and-confirm
  practice
- [x] T071 [US4] Require source-backed phrase production acknowledgements
- [x] T072 [US4] Require a changed-context transfer attempt
- [x] T073 [US4] Replace mastery and automatic-SRS completion copy with
  immediate-practice evidence
- [ ] T074 [US4] Run desktop and mobile Playwright preview flow against a
  controlled persisted draft
- [ ] T075 [US4] Manually review one valid draft for situation fidelity, source
  language, speaker uncertainty, Vietnamese guidance, and transfer coherence

**Checkpoint**: Component suites pass. Persisted-draft browser preview and human
pedagogical review remain open.

---

## Phase 7: Cross-cutting verification and convergence

**Purpose**: Prove the exact final state; no unchecked item may be hidden by a
green partial check.

- [x] T076 Run `npm run lint`; passed in Verify #147 on head
  `cd80864119f5069acddb0f8405b826f6fa47ea4e`
- [x] T077 Run `npx tsc --noEmit`; passed in Verify #147
- [x] T078 Run `npm run test`; 39 files and 372 tests passed in Verify #147
- [x] T079 Run `npm run test:content-standard`; 1 file and 50 tests passed in
  Verify #147
- [x] T080 Run `npm run build`; Next.js 16.2.9 compilation and 89/89 page
  generation passed without deployment in Verify #147
- [x] T081 Run the targeted Real Talk contract, policy, provenance, atomic RPC,
  provider, orchestration, result, migration, mapping, and preview suites; 13
  files and 108 tests passed in Verify #147
- [ ] T082 Run non-production live Gemini happy path, invalid output, 429,
  provider-failure, adversarial source, and persistence-failure checks; the live
  workflow stopped before provider work because `GEMINI_API_KEY` is absent from
  GitHub Actions secrets
- [x] T083 Verify live YouTube oEmbed metadata and official IFrame playback on
  desktop and Android-mobile; run #1 retained transient mobile error 150 and run
  #2 passed the same controlled source
- [x] T084 Resolve the production transcript policy decision by retaining the
  explicit merge blocker until a trusted provenance adapter is implemented and
  verified
- [x] T085 Run the requirements checklist review with observed evidence classes
- [x] T086 Run final cross-artifact analysis
- [x] T087 Run requirement-to-evidence convergence review; result remains NOT
  CONVERGED
- [ ] T088 Obtain owner acceptance; do not merge or deploy automatically

## Dependencies and execution order

- Governance and foundational contracts precede all stories.
- Compiler/evidence gates precede persistence.
- Private-database safety precedes browser preview.
- Provenance schema and trusted-write enforcement precede any production transcript
  adapter.
- Atomic RPC migration precedes real repeated-generation and rollback evidence.
- Hosted migration application requires explicit owner authorization.
- Provider, database, browser, and human evidence cannot substitute for one
  another.

## Current convergence decision

```text
authenticated request
→ approved source boundary
→ bounded source evidence
→ structured generation
→ schema and evidence validation
→ atomic owner-private persistence
→ environment-first preview
→ phrase production
→ changed-context transfer
```

Current result:

```text
Technical checks:       PASS on Verify #176
Provenance code/tests:  PASS
Atomic RPC code/tests:  PASS
Hosted type baseline:   PASS against generated project snapshot
Learning attempts DDL: NOT APPLIED; explicit typed overlay only
Signed-session RLS:     PASS through hosted Auth + PostgREST
Retention/history:      DECIDED; one current draft, owner hard-delete contract
Hosted provenance/RPC:  PASS; migrations applied and verified
Production adapter:     NOT IMPLEMENTED
Live Gemini:            BLOCKED
Persisted browser flow: NOT RUN
Human review:           NOT RUN
Convergence:            FAIL / NOT CONVERGED
Merge:                  DO NOT MERGE
Deployment:             DO NOT DEPLOY
```

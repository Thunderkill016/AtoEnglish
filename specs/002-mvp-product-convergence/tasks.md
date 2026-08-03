---
description: "Dependency-ordered implementation and verification tasks for the AtoEnglish MVP product convergence"
---

# Tasks: AtoEnglish MVP Product Convergence

**Input**: `spec.md`, `plan.md`, `research.md`, `data-model.md`,
`contracts/mvp-contract.md`, `quickstart.md`, and requirements checklist  
**Implementation base**: then-current `main`, never a wholesale merge of
`agent/rebuild-learning-core`  
**Rule**: A checked task means its required evidence was observed. Code existence,
a mock, or an earlier branch check is not sufficient unless the task explicitly
names that evidence.

## Format

`[ID] [P?] [Story] Description`

- **[P]**: may run in parallel after its dependencies are complete;
- **[US1–US5]**: maps to the prioritized user stories in `spec.md`;
- every implementation task names expected files or evidence locations;
- owner-gated migrations, previews, merge, and deployment remain unchecked until
  explicitly authorized.

---

## Phase 1 — Governance, baseline, and selective-port control

**Purpose**: Make the implementation branch safe before any product code changes.

- [ ] T001 Obtain explicit owner acceptance of the MVP promise, one-environment scope, deferred-feature list, and fresh-main integration strategy; record the decision in `specs/002-mvp-product-convergence/owner-decisions.md`
- [ ] T002 Resolve and record the exact current `main` SHA, open PR/branch state, hosted Supabase project, and Vercel project in `specs/002-mvp-product-convergence/baseline.md`
- [ ] T003 Create `integration/mvp-product-convergence` from the exact current `main` head; do not merge PR #54 or `agent/rebuild-learning-core`
- [ ] T004 Create `specs/002-mvp-product-convergence/port-manifest.md` and classify every selected Real Talk path as `port`, `adapt`, `reference`, or `reject`, including source SHA, destination, reason, and tests
- [ ] T005 [P] Reconcile `package.json`, `package-lock.json`, `.nvmrc`, and `.github/workflows/verify.yml` against current `main`; preserve Node 24/npm 11 and prevent restoration of `gtts`, `request`, `har-validator`, or `uuid@3`
- [ ] T006 [P] Align `.env.example` and the `db:types` script in `package.json` with hosted project `zpiwddskhduuykpxltun` without exposing secret values
- [ ] T007 [P] Generate a fresh hosted Supabase type baseline into `src/types/supabase.ts` and record equivalence evidence in `specs/002-mvp-product-convergence/hosted-baseline.md`; never edit generated types manually
- [ ] T008 Update `specs/000-atoenglish-rebuild-roadmap/roadmap.md` and `docs/product/CURRENT_PRIORITY.md` to make Spec 002 the accepted active MVP convergence spec without erasing Spec 001 evidence
- [ ] T009 Update `AGENTS.md` only after T001 so agents use Spec 002 as the active implementation ledger and retain all merge/deploy restrictions
- [ ] T010 Run pre-implementation cross-artifact analysis and update `specs/002-mvp-product-convergence/analysis.md`; implementation is blocked by any unresolved critical contradiction

**Checkpoint**: The branch starts from current main, package/database baselines agree,
and every reused change is explicitly selected.

---

## Phase 2 — User Story 1: Truthful entry, authentication, and focused shell

**Goal**: A new or returning learner reaches one focused dashboard reliably.

**Independent test**: Landing → signup/login → idempotent bootstrap → protected
dashboard passes on desktop and mobile without manual database repair.

- [ ] T011 [US1] Replace the legacy 28-day/fluency-adjacent landing promise and metadata in `src/app/page.tsx` with the approved natural-communication MVP promise
- [ ] T012 [P] [US1] Audit and update active landing components under `src/components/landing/` so hero, product preview, method, FAQ, testimonials, and final CTA do not promise unsupported personalization, pronunciation scoring, broad curriculum, or results
- [ ] T013 [P] [US1] Update landing JSON-LD, Open Graph, canonical copy, and accessibility assertions in `src/app/page.tsx` and `e2e/accessibility-smoke.spec.ts`
- [ ] T014 [US1] Separate authentication from fake/defaulted personalization in `src/app/login/page.tsx`; ask only an approved choice that changes immediate behavior or remove onboarding questions from the critical path
- [ ] T015 [US1] Define the idempotent account bootstrap contract in `src/features/mvp/domain/account-bootstrap.ts` with typed success/failure results and no client user ID
- [ ] T016 [US1] Implement shared server-side bootstrap in `src/features/mvp/server/bootstrap-account.ts` and a thin server action under `src/app/actions/mvp-account.ts`
- [ ] T017 [US1] If atomic database support is required, add a versioned security-invoker migration under `supabase/migrations/` for account bootstrap, with SQL contract tests under `src/__tests__/`; do not apply hosted DDL without owner authorization
- [ ] T018 [US1] Route both email and OAuth callback flows through the shared bootstrap by updating `src/app/login/page.tsx` and `src/app/auth/callback/route.ts` (or the exact existing callback path resolved during implementation)
- [ ] T019 [US1] Make bootstrap/auth failures recoverable and truthful in login/callback UI; add focused tests under `src/__tests__/mvp-auth-bootstrap.test.ts`
- [ ] T020 [US1] Update `src/lib/supabase/session.ts` so `/dashboard`, `/real-talk`, `/real-talk/[slug]`, and `/me` require authentication while landing/legal/health routes remain public
- [ ] T021 [P] [US1] Update `e2e/protected-routes.spec.ts` for the approved MVP route matrix, safe `next` handling, authenticated login redirect, and cookie refresh
- [ ] T022 [US1] Reduce `src/lib/constants/navigation.ts`, `src/components/layout/bottom-nav.tsx`, and active desktop/mobile shell components to the MVP navigation: Học, Ôn lại/Tiếp tục, Tôi
- [ ] T023 [US1] Define `MvpDashboardState` in `src/features/mvp/domain/dashboard-state.ts` and add exhaustive state tests
- [ ] T024 [US1] Implement one focused dashboard query in `src/features/mvp/server/dashboard-repository.ts` using reviewed lessons and learner attempts only
- [ ] T025 [US1] Replace the legacy dashboard orchestration in `src/app/(main)/dashboard/page.tsx` and its client components with one primary action, a small reviewed lesson list, and honest loading/empty/error states
- [ ] T026 [P] [US1] Simplify `/me` through `src/app/(main)/me/MeClient.tsx` and related server page to account identity, bounded history/status, settings link if retained, and logout; remove legacy product promises from the MVP path
- [ ] T027 [US1] Add desktop/mobile Playwright coverage `e2e/mvp-entry-auth-dashboard.spec.ts` for new email user, returning user, logout, safe return path, and bootstrap retry

**Checkpoint**: A learner can enter, authenticate, and see exactly one coherent next
action without depending on XP, streak, flashcards, writing, or fifty-unit state.

---

## Phase 3 — User Story 2: Reviewed learner catalog and source publication boundary

**Goal**: Learners see only database-backed, human-reviewed lessons.

**Independent test**: Three reviewed public lessons plus private/unreviewed rows
produce exactly three catalog items and no static fallback.

- [ ] T028 [US2] Port the accepted Real Talk domain/provenance/source-policy files listed in `port-manifest.md` into `src/features/real-talk/`, preserving their focused tests and adapting imports to current main
- [ ] T029 [US2] Port or reimplement `src/features/real-talk/server/transcript-sources/supabase-reviewed.ts` and verify cue-digest, reviewer-independence, and production-policy checks on the integration branch
- [ ] T030 [US2] Define provider-neutral source and playback contracts in `src/features/real-talk/domain/reviewed-source.ts` for `youtube_embed`, `direct_video`, and `external_link`
- [ ] T031 [US2] Add a versioned provider-neutral Real Talk source migration under `supabase/migrations/`, including safe HTTPS constraints, provider/external identity, playback fields, compatibility handling for `youtube_id`, indexes, grants, and rollback notes
- [ ] T032 [P] [US2] Add migration contract tests under `src/__tests__/real-talk-provider-neutral-source-migration.test.ts`
- [ ] T033 [US2] Implement provider-neutral playback selection in `src/features/real-talk/server/playback-policy.ts` with unit tests for each allowed mode and unsafe references
- [ ] T034 [US2] Adapt `src/components/real-talk/YouTubePlayer.tsx` into a reviewed-source player boundary under `src/features/real-talk/components/ReviewedSourcePlayer.tsx`; keep official playback and no download/re-host behavior
- [ ] T035 [US2] Implement a database-only reviewed catalog repository in `src/features/real-talk/server/reviewed-catalog-repository.ts` that fails closed on unknown/unreviewed/publication state
- [ ] T036 [US2] Replace `fetchCatalogVideos()` in `src/app/actions/real-talk.ts` with the reviewed catalog repository; remove all imports/merging from `src/lib/data/real-talk/videos.ts` in learner production paths
- [ ] T037 [US2] Remove the learner-facing arbitrary-generation CTA and filters based on unreviewed static data from `src/components/real-talk/RealTalkHub.tsx`; show a reviewed small catalog or honest empty state
- [ ] T038 [P] [US2] Keep `/real-talk/create` editor-only or disabled by updating `src/app/(main)/real-talk/create/page.tsx`, route policy, and navigation tests; ordinary learners must not discover it
- [ ] T039 [US2] Select the initial environment and create three source-review packets under `specs/002-mvp-product-convergence/content/`, each naming canonical source, rights, complete context, bounded window, transcript, speaker/timing uncertainty, translation, safety, level, and transfer
- [ ] T040 [US2] Obtain actual human review/sign-off for all three source packages and record reviewer identity/date/decision; automated or controlled test identities do not satisfy this task
- [ ] T041 [US2] Create three final reviewed lesson packages under `specs/002-mvp-product-convergence/content/` and prove every learner-facing English/answer/timestamp/speaker/translation/guidance item traces to reviewed evidence
- [ ] T042 [US2] Implement one controlled idempotent publication/seed operation under `scripts/` or an authorized server path, with explicit reviewer authorization, no ordinary-user publication ability, and rollback/cleanup support
- [ ] T043 [US2] Add catalog contract/integration tests proving static fixtures, private drafts, unreviewed transcripts, incomplete review identity, and unsafe playback never appear
- [ ] T044 [US2] After explicit owner authorization, apply the provider-neutral migration and controlled reviewed corpus operation to hosted Supabase; record migration IDs, row IDs, reviewer evidence, advisors, and rollback in `specs/002-mvp-product-convergence/content-publication-verification.md`

**Checkpoint**: The hosted catalog contains a tiny reviewed corpus and returns
nothing that did not pass the human/source gate.

---

## Phase 4 — User Story 3: Natural communication lesson runtime

**Goal**: A learner completes one full natural communication loop with transfer.

**Independent test**: Watching or answering recognition items cannot complete the
lesson; retrieval, speech confirmation, and changed-context transfer are required.

- [ ] T045 [US3] Port/adapt the accepted environment-first Real Talk runtime contracts and components into `src/features/real-talk/`, excluding static sample assumptions and editor-private warnings from the learner surface
- [ ] T046 [US3] Implement a reviewed lesson loader in `src/features/real-talk/server/reviewed-lesson-repository.ts` that requires authenticated access and publication eligibility
- [ ] T047 [US3] Update `src/app/(main)/real-talk/[videoId]/page.tsx` to use the reviewed lesson loader, shared MVP layout, not-found boundary, and provider-neutral player
- [ ] T048 [P] [US3] Add an environment entry component under `src/features/real-talk/components/EnvironmentBriefing.tsx` showing setting, roles, relationship, and practical goal before language explanation
- [ ] T049 [US3] Implement first encounter in `src/features/real-talk/components/FirstEncounter.tsx` with no transcript/answer exposure by default and a source-backed gist/intention task
- [ ] T050 [US3] Implement deterministic progressive support in `src/features/real-talk/domain/support-level.ts` and `src/features/real-talk/components/ProgressiveSupport.tsx`: replay/context → keyword → English evidence → chunking → concise Vietnamese guidance
- [ ] T051 [US3] Implement productive retrieval/reconstruction in `src/features/real-talk/components/RetrievalPractice.tsx`, ensuring the full answer is not permanently visible and every accepted target is source-backed
- [ ] T052 [US3] Implement `speak_and_confirm` in `src/features/real-talk/components/SpeakAndConfirm.tsx` with microphone-independent fallback, no score, and explicit non-pronunciation copy
- [ ] T053 [US3] Implement changed-context transfer in `src/features/real-talk/components/ChangedContextTransfer.tsx` without storing unrestricted learner response text
- [ ] T054 [US3] Define and implement the completion state machine in `src/features/real-talk/domain/lesson-runtime.ts`; completion requires first listen, retrieval attempt, speaking confirmation, and transfer attempt
- [ ] T055 [US3] Replace mastery/CEFR/fluency/pronunciation completion copy in the runtime with immediate-practice language and a retention disclaimer
- [ ] T056 [P] [US3] Add unit/component tests under `src/__tests__/mvp-real-talk-runtime.test.tsx` for support fading, source evidence, microphone fallback, transfer gate, and honest copy
- [ ] T057 [US3] Add an unauthenticated/direct-link/not-found/media-unavailable/error matrix for the reviewed lesson route and components

**Checkpoint**: One reviewed lesson is pedagogically and technically complete under
the MVP contract, independent of legacy lesson and gamification systems.

---

## Phase 5 — User Story 4: Bounded progress, continuation, and return

**Goal**: An authenticated learner can leave and return without losing safe state.

**Independent test**: Start → reload → complete → logout/login → dashboard state
works, while another user cannot access the attempt.

- [ ] T058 [US4] Evaluate `user_v2_lesson_progress` and `lesson_v2_evidence` against `data-model.md`; record the accept/reject decision in `specs/002-mvp-product-convergence/attempt-storage-decision.md`
- [ ] T059 [US4] If existing storage is insufficient, add a versioned bounded `real_talk_attempts` migration under `supabase/migrations/` with completion constraints, unique `(user_id, lesson_id)`, ownership RLS, grants, indexes, and no free-text columns
- [ ] T060 [P] [US4] Add SQL and generated-type contract tests under `src/__tests__/mvp-real-talk-attempt-migration.test.ts`
- [ ] T061 [US4] Define typed attempt/checkpoint results in `src/features/real-talk/domain/learner-attempt.ts`
- [ ] T062 [US4] Implement idempotent owner-derived attempt persistence in `src/features/real-talk/server/attempt-repository.ts`; do not trust client user IDs or completion flags
- [ ] T063 [US4] Add thin server actions under `src/app/actions/real-talk-attempt.ts` for start/checkpoint/complete and validate every payload with Zod
- [ ] T064 [US4] Restore a safe lesson checkpoint after reload without restoring answer exposure or claiming completion prematurely
- [ ] T065 [US4] Integrate attempt state into `src/features/mvp/server/dashboard-repository.ts` so the primary action is `start`, `continue`, or `review`
- [ ] T066 [P] [US4] Add repository/action unit tests for retry idempotency, invalid checkpoint, forged completion, and persistence failure
- [ ] T067 [US4] After explicit owner authorization, apply the selected attempt migration to hosted Supabase and regenerate `src/types/supabase.ts`
- [ ] T068 [US4] Run hosted anonymous/ownerA/ownerB tests proving owner read/write, cross-user denial, forged completion rejection, and cleanup; record in `specs/002-mvp-product-convergence/hosted-attempt-verification.md`
- [ ] T069 [US4] Add `e2e/mvp-lesson-return.spec.ts` covering reload, logout/login, continue, complete, and review state on desktop and mobile

**Checkpoint**: Learner progress survives sessions, is private, bounded, and not
coupled to XP or raw learner content.

---

## Phase 6 — User Story 5: Pilot instrumentation, resilience, and product pruning

**Goal**: The owner can run a small, observable pilot without exposing the old
product as the MVP.

**Independent test**: The full preview journey records only allowed events and
survives key auth/media/database failure states.

- [ ] T070 [US5] Define the bounded MVP event taxonomy in `src/features/mvp/domain/pilot-events.ts` with an exhaustive allow-list and forbidden free-text fields
- [ ] T071 [US5] Reuse/adapt existing `pilot_events` client/server recording through `src/features/mvp/server/pilot-event-repository.ts` and focused actions; do not create a second analytics platform
- [ ] T072 [P] [US5] Instrument landing, auth, dashboard, lesson start, first listen, support, retrieval, speech confirmation, transfer, completion, and return without answer/audio/transcript payloads
- [ ] T073 [P] [US5] Add analytics contract tests proving unknown events and forbidden/unbounded payload fields are rejected
- [ ] T074 [US5] Add focused loading, empty, database failure, auth expiry, media unavailable, and offline/retry states to the MVP shell and lesson runtime
- [ ] T075 [US5] Audit every primary navigation, landing CTA, dashboard action, command palette, mobile drawer, sitemap, and internal promotion so deferred routes are absent from the MVP story; record decisions in `specs/002-mvp-product-convergence/deferred-route-audit.md`
- [ ] T076 [US5] Guard, redirect, or feature-flag deferred routes that still create a critical product contradiction; do not broadly delete or rewrite them in this spec
- [ ] T077 [P] [US5] Review and retire test-only Supabase Edge Functions (`spec001-*`) after explicit owner authorization; preserve the real `real-talk-transcript-review` function and record final inventory
- [ ] T078 [US5] Run Supabase security/performance advisors after all authorized DDL and resolve every new MVP-related finding
- [ ] T079 [US5] Verify Vercel/Supabase environment equivalence without exposing values and record variable-name coverage in `specs/002-mvp-product-convergence/environment-verification.md`

**Checkpoint**: The MVP is observable, fails honestly, and no deferred feature is
presented as part of the core value proposition.

---

## Phase 7 — Cross-cutting verification, preview, convergence, and release gates

**Purpose**: Prove the exact final state. No mock substitutes for a required
hosted, browser, human, or owner check.

- [ ] T080 Run `npm ci --no-audit --prefer-offline` on a clean exact-head checkout using the main toolchain and lockfile
- [ ] T081 Run `npm run lint` on the exact final head
- [ ] T082 Run `npx tsc --noEmit` on the exact final head
- [ ] T083 Run the focused MVP auth, catalog, runtime, attempt, analytics, migration, policy, and RLS contract suites
- [ ] T084 Run `npm run test` and record file/test counts
- [ ] T085 Run `npm run test:content-standard`
- [ ] T086 Run applicable hosted integration suites against `zpiwddskhduuykpxltun` with bounded test identities and mandatory cleanup
- [ ] T087 Run `npm run build` and record the complete Next.js route output; no deferred route may be mistaken for MVP scope merely because it builds
- [ ] T088 Run desktop and mobile accessibility smoke for landing, auth, dashboard, catalog, lesson, and account shell
- [ ] T089 Run the full authenticated MVP Playwright journey on Desktop Chrome and Pixel/mobile-equivalent against a production build, including logout/login return
- [ ] T090 Confirm no uncaught page error, Next.js overlay, horizontal overflow, unreviewed static lesson, editor-generation CTA, or unsupported learning claim appears
- [ ] T091 Confirm all three human-reviewed source/lesson packages remain accessible and match the published database rows and cue digests
- [ ] T092 Update `specs/002-mvp-product-convergence/analysis.md` with final requirement-to-implementation-to-evidence mapping and resolve all critical findings
- [ ] T093 Update `specs/002-mvp-product-convergence/checklists/requirements.md` from observed evidence; keep owner-gated items unchecked until authorized
- [ ] T094 Obtain explicit owner authorization for one intentional Vercel preview branch `preview/mvp-product-convergence`
- [ ] T095 Deploy the exact verified head to the connected Vercel `atoenglish` preview and record deployment ID, URL reference, commit SHA, and environment in `specs/002-mvp-product-convergence/preview-verification.md`
- [ ] T096 Repeat the full desktop/mobile journey on the actual Vercel preview against hosted Supabase
- [ ] T097 Inspect Vercel runtime error clusters/logs and Supabase auth/API/Postgres logs for the acceptance window; resolve critical MVP errors
- [ ] T098 Present the preview, reviewed corpus, deferred scope, known limitations, rollback, and evidence to the owner for product acceptance
- [ ] T099 Record the owner's decision in `specs/002-mvp-product-convergence/owner-acceptance.md`; rejection or requested changes keep the spec unconverged
- [ ] T100 After acceptance, prepare a clean PR targeting `main` with exact task/evidence status and no automatic merge or deployment
- [ ] T101 Rerun exact-head gates if the main-targeted PR head changes during reconciliation
- [ ] T102 Obtain separate explicit authorization before merging to `main`
- [ ] T103 After merge, obtain separate explicit authorization before production deployment
- [ ] T104 If production deployment is authorized, deploy the exact merged commit, run production smoke, inspect runtime logs, and record rollback information; otherwise leave production untouched

---

## MVP Convergence Rule

The MVP is converged only when:

1. T001–T099 required work is checked from observed evidence;
2. three human-reviewed lessons in one environment are public and traceable;
3. the complete learner journey passes on hosted desktop and mobile preview;
4. database ownership/privacy and bounded persistence are verified;
5. no static/unreviewed lesson or editor-generation control is learner-facing;
6. cross-artifact analysis has no unresolved critical conflict;
7. the owner explicitly accepts the exact preview state.

T100–T104 are release operations, not implied by convergence. Merge and production
deployment remain separate owner decisions.
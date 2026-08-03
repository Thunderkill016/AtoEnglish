---
description: "Dependency-ordered tasks for the AtoEnglish YouTube-to-private-lesson MVP"
---

# Tasks: AtoEnglish YouTube-to-Private-Lesson MVP

**Implementation base:** then-current `main`, never a wholesale merge of
`agent/rebuild-learning-core`  
**Evidence rule:** Check a task only after its named evidence is observed. Mocks,
code existence, or checks from an earlier head do not satisfy hosted/live/browser
or owner gates.

## Phase 1 — Governance, baseline, and selective-port control

- [x] T001 Record the owner's corrected core-product decision in `specs/002-mvp-product-convergence/owner-decisions.md`: paste YouTube URL → private personal lesson
- [ ] T002 Obtain explicit authorization to begin implementation and record it in `owner-decisions.md`; the product correction alone does not authorize code, migration, preview, merge, or deployment
- [ ] T003 Resolve exact current `main` SHA, PR/branch topology, hosted Supabase project, Vercel project, and active environment references in `specs/002-mvp-product-convergence/baseline.md`
- [ ] T004 Create `integration/mvp-youtube-to-lesson` from exact current `main`; do not merge PR #54
- [ ] T005 Create `specs/002-mvp-product-convergence/port-manifest.md` and classify selected Real Talk paths as `port`, `adapt`, `reference`, or `reject`
- [ ] T006 Reconcile `package.json`, `package-lock.json`, `.nvmrc`, and `.github/workflows/verify.yml` against current main; retain Node 24/npm 11 and avoid restoring the stale `gtts` chain
- [ ] T007 Align `.env.example` and `package.json` `db:types` with Supabase project `zpiwddskhduuykpxltun` without exposing secrets
- [ ] T008 Regenerate `src/types/supabase.ts` from the hosted project and record the baseline in `specs/002-mvp-product-convergence/hosted-baseline.md`; never edit generated types manually
- [ ] T009 Update `AGENTS.md`, `docs/product/CURRENT_PRIORITY.md`, and the roadmap only after T002 so Spec 002 becomes the accepted implementation ledger
- [ ] T010 Re-run cross-artifact analysis and block implementation on any critical contradiction

**Checkpoint:** Clean fresh-main branch, one environment source of truth, exact port manifest.

## Phase 2 — Truthful entry, authentication, and URL-first dashboard

- [ ] T011 [US1] Rewrite `src/app/page.tsx` metadata, hero, JSON-LD, CTA, and primary copy around “paste a supported YouTube video and get a private English lesson”
- [ ] T012 [P] [US1] Audit/update active files under `src/components/landing/` so they do not promise fixed 28-day outcomes, perfect transcripts, pronunciation scoring, or a broad curriculum
- [ ] T013 [P] [US1] Add landing tests in `e2e/accessibility-smoke.spec.ts` and a focused copy/CTA test proving the YouTube-to-lesson promise
- [ ] T014 [US1] Separate auth from fake/defaulted personalization in `src/app/login/page.tsx`; keep only inputs that change the immediate MVP behavior
- [ ] T015 [US1] Define typed bootstrap results in `src/features/mvp/domain/account-bootstrap.ts`
- [ ] T016 [US1] Implement shared server-owned idempotent bootstrap in `src/features/mvp/server/bootstrap-account.ts` and `src/app/actions/mvp-account.ts`
- [ ] T017 [US1] Route email and OAuth callbacks through the shared bootstrap by updating `src/app/login/page.tsx` and `src/app/auth/callback/route.ts`
- [ ] T018 [P] [US1] Add bootstrap/auth tests under `src/__tests__/mvp-auth-bootstrap.test.ts` for retry, partial failure, email, OAuth, and no client user ID
- [ ] T019 [US1] Protect `/dashboard`, `/real-talk`, `/real-talk/create`, `/real-talk/[slug]`, and `/me` in `src/lib/supabase/session.ts`
- [ ] T020 [P] [US1] Update `e2e/protected-routes.spec.ts` for generation/private-lesson ownership and safe `next` behavior
- [ ] T021 [US1] Reduce `src/lib/constants/navigation.ts` and active shell components to `Tạo bài/Học`, `Bài của tôi`, and `Tôi`
- [ ] T022 [US1] Define `PrivateLessonLibraryState` in `src/features/mvp/domain/dashboard-state.ts` with exhaustive state tests
- [ ] T023 [US1] Implement recent owner-private lesson and progress read model in `src/features/mvp/server/dashboard-repository.ts`
- [ ] T024 [US1] Replace legacy dashboard orchestration in `src/app/(main)/dashboard/page.tsx` and its client components with the URL form, generation status, continue/review, recent private lessons, and honest empty/error states
- [ ] T025 [US1] Add `e2e/mvp-entry-generation-dashboard.spec.ts` for new user, returning user, logout, URL form visibility, and bootstrap retry on desktop/mobile

**Checkpoint:** Authenticated user reaches one obvious action: paste a YouTube URL.

## Phase 3 — YouTube source, official playback, and transcript boundary

- [ ] T026 [US2] Port/adapt URL/source contracts from Spec 001 into `src/features/real-talk/domain/youtube-source.ts` and focused tests
- [ ] T027 [US2] Validate and normalize `youtube.com`, `youtu.be`, Shorts, embed, and supported mobile URL forms; reject malformed/non-YouTube inputs before provider work
- [ ] T028 [US2] Implement source metadata/availability resolution with stable failure codes for unavailable, private, age-restricted, embed-disabled, and malformed sources
- [ ] T029 [US2] Adapt `src/components/real-talk/YouTubePlayer.tsx` into an official playback boundary without media downloading/re-hosting
- [ ] T030 [US2] Port/adapt `TranscriptSourceAdapter` and explicit acquisition result contracts into `src/features/real-talk/domain/transcript-source.ts`
- [ ] T031 [US2] Port/adapt `src/features/real-talk/server/transcript-sources/youtube-experimental.ts` behind the adapter contract; do not silently rename it production-approved
- [ ] T032 [US2] Document the exact private-MVP transcript acquisition decision in `specs/002-mvp-product-convergence/production-transcript-decision.md`, including mode, supported-video conditions, terms/rights/reliability risks, warnings, and rollback
- [ ] T033 [US2] Implement machine-readable transcript failures in `src/features/real-talk/domain/generation-result.ts` and mapping to Vietnamese user guidance
- [ ] T034 [US2] Normalize/bound/delimit transcript cues as untrusted prompt data in `src/features/real-talk/server/transcript-provenance.ts` and compiler helpers
- [ ] T035 [US2] Verify deterministic interaction-rich window selection (<=180 seconds and configured cue limit) with long/opening/low-interaction fixtures
- [ ] T036 [P] [US2] Expand tests under `src/__tests__/real-talk-youtube-source.test.ts` and `real-talk-transcript-source-policy.test.ts` for supported/unsupported URL and transcript matrices
- [ ] T037 [US2] Ensure `/real-talk/create` or dashboard form exposes clear `supported video` requirements and distinct validate/transcript/provider errors
- [ ] T038 [US2] Ensure no static transcript/sample path is used when a user submits a URL; add a production-boundary test
- [ ] T039 [US2] Run a controlled live supported-YouTube transcript acquisition check without Gemini/persistence and record source, mode, cue digest, timings, and cleanup
- [ ] T040 [US2] Run controlled unsupported/transcriptless source checks and record exact failure codes and user-visible messages

**Checkpoint:** The app can honestly distinguish a supported URL/transcript from unsupported videos.

## Phase 4 — Live compiler, evidence validation, and atomic private persistence

- [ ] T041 [US2] Port/adapt `src/features/real-talk/application/generate-private-lesson.ts`
- [ ] T042 [US2] Port/adapt `src/features/real-talk/server/private-lesson-compiler.ts`
- [ ] T043 [US2] Port/adapt `src/features/real-talk/server/gemini-lesson-provider.ts` and typed schema configuration
- [ ] T044 [US2] Port/adapt lesson prompt contracts in `src/features/real-talk/domain/lesson-prompt.ts`; delimit transcript/source data and prohibit instruction override
- [ ] T045 [US2] Port/adapt Zod generation contract/evidence validation under `src/lib/real-talk/generation-contract.ts` or its accepted destination
- [ ] T046 [US2] Preserve stable failures for invalid JSON/schema, invented text, invalid timestamps, unsupported answers, transfer language, speaker uncertainty, provider failure, and rate limiting
- [ ] T047 [US2] Authenticate before transcript, metadata, or Gemini work in `src/app/actions/real-talk.ts`; add ordering tests
- [ ] T048 [US2] Preserve rate limiting in `src/app/actions/real-talk.ts` with user/IP-safe keys and actionable retry timing
- [ ] T049 [US2] Port/adapt deterministic draft identity in `src/features/real-talk/domain/draft-identity.ts`
- [ ] T050 [US2] Verify existing hosted atomic private-draft RPC/migrations against current generated types and `data-model.md`
- [ ] T051 [US2] Port/adapt `src/features/real-talk/server/draft-repository.ts` and `draft-mapping.ts` for owner-private `ai_draft` persistence
- [ ] T052 [US2] Ensure successful draft persistence stores source identity, selected window, adapter/mode/digest, actual model, warnings, owner, and private state
- [ ] T053 [US2] Ensure failures create no partial video/lesson and repeated requests retain deterministic identity
- [ ] T054 [P] [US2] Port/adapt focused tests: generation contract/result/action/provider/draft mapping/atomic migration/private RLS
- [ ] T055 [US2] Add generation-progress UI states in `src/app/(main)/real-talk/create/page.tsx` or dashboard component: validating, transcript, selecting, generating, validating, saving, ready, failed
- [ ] T056 [US2] Add visible `AI draft` and transcript uncertainty warnings to generation success and lesson entry
- [ ] T057 [US2] After bounded secret authorization, run live Gemini success through the real compiler and record provider/model/schema/evidence result without logging the key
- [ ] T058 [US2] Run live Gemini unavailable/rate-limit/invalid-output failure path and verify no partial persistence

**Checkpoint:** Supported URL produces one reloadable atomic owner-private lesson through live provider code.

## Phase 5 — Private lesson runtime, progress, library, and return

- [ ] T059 [US3] Port/adapt the environment-first private preview components into the learner runtime without removing AI/transcript warnings
- [ ] T060 [US3] Update `src/app/(main)/real-talk/[videoId]/page.tsx` to require owner access and load the persisted private lesson
- [ ] T061 [US3] Render environment, roles, practical goal, source, AI-draft label, and warnings before activities
- [ ] T062 [US3] Implement first encounter with official playback and no transcript/answer exposure by default
- [ ] T063 [US3] Implement deterministic progressive support: replay/context → keyword → English evidence/chunking → concise Vietnamese guidance
- [ ] T064 [US3] Implement source-backed productive retrieval/reconstruction without a permanently displayed answer
- [ ] T065 [US3] Implement microphone-independent `speak_and_confirm` with no pronunciation score
- [ ] T066 [US3] Implement changed-context transfer without persisting unrestricted learner response text
- [ ] T067 [US3] Implement completion state machine requiring first listen, retrieval, speaking confirmation, and transfer
- [ ] T068 [US3] Replace mastery/fluency/CEFR/pronunciation claims with immediate-practice language
- [ ] T069 [P] [US3] Add component/domain tests under `src/__tests__/mvp-real-talk-runtime.test.tsx`
- [ ] T070 [US4] Evaluate existing progress/evidence tables and record decision in `specs/002-mvp-product-convergence/attempt-storage-decision.md`
- [ ] T071 [US4] If needed, add a versioned bounded `real_talk_attempts` migration with owner RLS, lesson-ownership constraint, completion gates, unique `(user_id, lesson_id)`, and no free-text columns
- [ ] T072 [US4] Implement typed attempt repository/actions under `src/features/real-talk/domain/learner-attempt.ts`, `server/attempt-repository.ts`, and `src/app/actions/real-talk-attempt.ts`
- [ ] T073 [US4] Restore safe checkpoints after reload without restoring hidden answers or forged completion
- [ ] T074 [US4] Integrate `generate`, `continue`, `review`, and recent private lesson states into dashboard/private library
- [ ] T075 [US4] Add hosted anonymous/ownerA/ownerB tests for draft and attempt read/write/approval/publication denial
- [ ] T076 [US4] Add `e2e/mvp-private-lesson-return.spec.ts` for generate → reload → complete → logout/login → review and cross-user denial on desktop/mobile

**Checkpoint:** Owner can generate, learn, leave, return, and review; other users cannot discover the lesson.

## Phase 6 — Privacy-safe analytics, resilience, verification, and release gates

- [ ] T077 [US5] Define allow-listed generation/lesson events in `src/features/mvp/domain/pilot-events.ts`
- [ ] T078 [US5] Reuse/narrow `pilot_events` recording with bounded IDs/enums/counts only; forbid URL query data, transcript, learner text, audio, email, and secrets
- [ ] T079 [US5] Add loading/empty/retry/offline/media-unavailable/auth-expired/transcript-failure/Gemini-failure/persistence-failure UI states
- [ ] T080 [US5] Remove public/static catalog fallback from the MVP navigation/library path; fixtures remain test-only or explicitly demo-labelled
- [ ] T081 [US5] Hide/defer legacy units, flashcards, grammar, writing, speaking tools, leaderboard, challenge, certificate, business, and notifications from primary navigation
- [ ] T082 [P] [US5] Run `npm run audit` and `npm run inventory`; classify reachable legacy code without broad deletion
- [ ] T083 [US5] Run full exact-head `npm run lint`
- [ ] T084 [US5] Run full exact-head `npx tsc --noEmit`
- [ ] T085 [US5] Run exact-head targeted Real Talk tests
- [ ] T086 [US5] Run exact-head full unit suite
- [ ] T087 [US5] Run exact-head content-standard suite
- [ ] T088 [US5] Run exact-head hosted integration/RLS/atomic persistence tests
- [ ] T089 [US5] Run exact-head production build
- [ ] T090 [US5] Run controlled live transcript supported/unsupported matrix on final head
- [ ] T091 [US5] Run controlled live Gemini success/failure matrix on final head
- [ ] T092 [US5] Run desktop/mobile Playwright full journey on the production-built app
- [ ] T093 [US5] Run Supabase security/performance advisors and resolve/document all MVP-relevant findings
- [ ] T094 [US5] After explicit authorization, deploy `preview/mvp-youtube-to-lesson` to connected Vercel project
- [ ] T095 [US5] Verify preview exact SHA, correct Supabase/Gemini environment, full supported URL journey, unsupported failure, return, and cross-user denial
- [ ] T096 [US5] Inspect Vercel runtime errors/logs for the acceptance window and record deployment ID, routes, and result
- [ ] T097 [US5] Update requirements checklist, `analysis.md`, PR body, evidence docs, rollback/cleanup, and unresolved blockers
- [ ] T098 [US5] Obtain owner product acceptance of the exact preview and generated lesson experience
- [ ] T099 [US5] Prepare a clean PR targeting `main` only after acceptance; rerun exact-head checks if the head changes
- [ ] T100 [US5] Merge only after separate explicit owner authorization
- [ ] T101 [US5] Deploy production only after separate explicit owner authorization
- [ ] T102 [US5] Smoke-test production URL generation, private lesson ownership, runtime, persistence, and rollback readiness

## Definition of MVP Complete

MVP is complete only when a real authenticated user can paste a supported YouTube
URL, generate a validated owner-private lesson through live provider code, complete
the transfer-gated lesson, return to it later, and pass cross-user/desktop/mobile
hosted verification. No successful test authorizes merge or production deployment.
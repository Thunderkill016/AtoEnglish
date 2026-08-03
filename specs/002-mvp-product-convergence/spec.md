# Feature Specification: AtoEnglish MVP — YouTube to Private Lesson

**Feature Branch**: `spec/mvp-product-convergence`  
**Created**: 2026-08-03  
**Revised**: 2026-08-03 after owner correction  
**Status**: Planning revised; implementation still requires explicit authorization  
**Owner product decision**: The core AtoEnglish idea remains **paste a YouTube URL and turn that video into a personal English lesson**.

## MVP Product Decision

The MVP is not a fixed catalog of preselected lessons. It is one complete
user-generated learning loop:

```text
truthful landing page
→ sign up or log in
→ paste a supported YouTube URL
→ validate source and acquire timed English transcript evidence
→ select one bounded natural interaction
→ generate a typed, evidence-bound private AI lesson
→ learn through listening, retrieval, speaking, and changed-context transfer
→ save the private lesson and bounded progress
→ return to continue, review, or generate another lesson
```

The generated lesson is an owner-private `ai_draft`. It is useful for personal
study but is not automatically approved, public, or guaranteed error-free. The UI
must show its transcript acquisition mode, unresolved warnings, and an honest AI
draft label.

Human review remains mandatory before any generated lesson is published to a
shared catalog. Public catalog and reviewer operations are not required for the
MVP's core private workflow.

## User Scenarios & Testing

### User Story 1 — Enter the product and paste a YouTube link (Priority: P1)

A Vietnamese learner understands the product promise, authenticates, and sees one
obvious action: paste a YouTube video they want to learn from.

**Independent Test**: A new user and returning user can complete landing → auth →
dashboard → valid YouTube URL submission on desktop and mobile without manual
database repair.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they read the hero and CTA, **Then** the promise explicitly says AtoEnglish turns a supported YouTube video into a personal English lesson.
2. **Given** a new user, **When** signup succeeds, **Then** one idempotent server-side bootstrap creates the minimum account state and routes to the generation dashboard.
3. **Given** a returning user, **When** login succeeds, **Then** they see the URL form plus their recent private lessons.
4. **Given** an unauthenticated visitor, **When** they request generation, dashboard, private lesson, or account routes, **Then** they are redirected to login before transcript or Gemini work begins.
5. **Given** a malformed or non-YouTube URL, **When** submitted, **Then** the UI rejects it locally/server-side with an actionable message and consumes no provider quota.

---

### User Story 2 — Generate a private lesson from a supported video (Priority: P1)

The authenticated learner pastes a supported YouTube URL. AtoEnglish validates the
source, obtains timed English transcript evidence through an explicit adapter,
selects a useful bounded interaction, generates a structured lesson, validates
all source-dependent claims, and stores it privately.

**Independent Test**: A controlled supported YouTube source produces one complete
owner-private lesson in a single request; unsupported, transcriptless, private,
age-restricted, or invalid sources fail without partial lesson persistence.

**Acceptance Scenarios**:

1. **Given** a supported public YouTube video with usable English timed transcript evidence, **When** generation succeeds, **Then** the owner receives a private `ai_draft` lesson and can open it immediately.
2. **Given** a long video, **When** the compiler runs, **Then** it selects a bounded interaction-rich window rather than converting the entire video or always using the opening.
3. **Given** missing/unavailable captions, unsupported language, disabled embedding, private video, age restriction, or source failure, **When** generation is requested, **Then** no partial lesson is created and the UI explains why that video is unsupported.
4. **Given** Gemini returns malformed, invented, or unsupported content, **When** schema and source-evidence validation run, **Then** the lesson is rejected before persistence.
5. **Given** the same owner repeats the same URL/level request, **When** the operation retries, **Then** identity and persistence are deterministic/idempotent rather than creating uncontrolled duplicates.
6. **Given** a generated lesson, **Then** it stores the actual model, transcript adapter/mode, selected source window, warnings, owner, and `ai_draft` state.

---

### User Story 3 — Complete the generated natural-communication lesson (Priority: P1)

The learner enters the generated situation, listens to the selected source
segment, receives progressive support, retrieves useful source-backed language,
speaks, and attempts the same goal with changed information or context.

**Independent Test**: Watching or choosing recognition answers alone cannot finish
the lesson; retrieval, speak-and-confirm, and changed-context transfer are required.

**Acceptance Scenarios**:

1. **Given** a generated private lesson, **When** it starts, **Then** the situation, roles, practical goal, source, AI-draft label, and unresolved warnings appear before activities.
2. **Given** the first encounter, **When** official YouTube playback begins, **Then** transcript and answers are not exposed by default.
3. **Given** the learner requests support, **When** it is revealed, **Then** support progresses from replay/context to English evidence and concise Vietnamese guidance.
4. **Given** useful language, **When** retrieval begins, **Then** the learner reconstructs or recalls it without a permanently displayed full answer.
5. **Given** microphone or browser recognition is unavailable, **When** speaking practice starts, **Then** the learner can speak and self-confirm without a pronunciation score.
6. **Given** no changed-context attempt, **When** the learner tries to finish, **Then** completion remains blocked.
7. **Given** completion, **Then** the UI reports immediate personal practice only and does not claim mastery, CEFR attainment, fluency, pronunciation accuracy, or transcript certainty.

---

### User Story 4 — Save lessons, progress, and return (Priority: P1)

The learner has a private library of generated lessons and can leave, return, and
continue safely without exposing one user's generated content to another.

**Independent Test**: A user generates a lesson, reloads mid-lesson, completes it,
logs out, logs in again, and sees the correct `continue` or `review` state; a second
user cannot discover or access it.

**Acceptance Scenarios**:

1. **Given** a successfully generated lesson, **When** the dashboard reloads, **Then** it appears in the owner's recent private lessons.
2. **Given** an in-progress lesson, **When** the learner reloads or returns, **Then** the runtime restores a safe checkpoint without exposing hidden answers.
3. **Given** a completed lesson, **When** the learner returns, **Then** the dashboard offers review and a new YouTube-generation action.
4. **Given** another authenticated user, **When** they query or open the first user's lesson or attempt, **Then** RLS and route ownership checks deny access.
5. **Given** stored progress, **Then** it contains bounded booleans/counts/support state and timestamps, not raw audio, unrestricted speech transcript, names, employers, or learner free text.
6. **Given** duplicate generation/checkpoint/completion requests, **When** retries occur, **Then** writes remain idempotent.

---

### User Story 5 — Operate the private-generation MVP safely (Priority: P2)

The owner can verify one exact-head Vercel preview against hosted Supabase and live
provider paths without making generated lessons public or mistaking CI for product
or learning evidence.

**Independent Test**: One authenticated desktop/mobile preview completes paste URL
→ generation → private lesson → transfer → return against hosted services, with
no cross-user leak or critical runtime error.

**Acceptance Scenarios**:

1. **Given** implementation begins, **Then** it starts from current `main` and selectively ports Spec 001 work; PR #54 is not merged wholesale.
2. **Given** a production candidate, **When** the transcript acquisition decision is reviewed, **Then** the exact adapter, mode, supported-video conditions, risks, and private-only boundary are documented.
3. **Given** live generation, **When** Gemini succeeds or fails, **Then** both paths are verified with a bounded key and no secret is exposed.
4. **Given** the Vercel preview, **When** browser acceptance runs, **Then** landing, auth, URL submission, generation, lesson, persistence, logout, and return pass on desktop and mobile.
5. **Given** all technical gates pass, **Then** merge and production deployment still require separate owner authorization.

## Functional Requirements

- **FR-001**: The learner-facing promise MUST center on turning a supported YouTube video into a private personal English lesson.
- **FR-002**: Generation, dashboard, private lessons, history, and account routes MUST require authentication; landing and legal pages remain public.
- **FR-003**: Authentication MUST complete before transcript acquisition, metadata calls, or Gemini quota is consumed.
- **FR-004**: Signup bootstrap MUST be server-derived, idempotent, and shared by email and OAuth.
- **FR-005**: The dashboard MUST prioritize a YouTube URL form plus `continue`, `review`, or recent-private-lesson states.
- **FR-006**: Input MUST accept only validated supported YouTube URLs and an approved target-level/lesson option set.
- **FR-007**: Source playback MUST use the official YouTube embed/watch boundary; media MUST NOT be downloaded or re-hosted.
- **FR-008**: Transcript acquisition MUST use an explicit replaceable adapter with acquisition mode, language, timing evidence, review status, and machine-readable failure codes.
- **FR-009**: The production/private-MVP transcript adapter decision MUST document supported-video conditions and risks; unsupported videos MUST fail honestly.
- **FR-010**: The selected interaction window MUST be bounded to at most 180 seconds and the configured cue/item limits.
- **FR-011**: Gemini output MUST use a typed structured schema and pass runtime validation.
- **FR-012**: Every quoted phrase, answer, timestamp, transcript reference, and transfer-language target MUST pass source-evidence validation against the selected cues.
- **FR-013**: Unsupported or invalid output MUST be rejected before persistence.
- **FR-014**: Generated lessons MUST be owner-private, `is_public = false`, and `review_state/generation_status = ai_draft` or the exact equivalent enforced by the schema.
- **FR-015**: Ordinary users MUST NOT approve, publish, or read another user's generated lesson.
- **FR-016**: Generated lessons MUST persist source URL/identity, selected window, transcript provenance/mode, model identifier, warnings, owner, and deterministic identity.
- **FR-017**: The learner UI MUST visibly label generated content as an AI draft and preserve transcript/source uncertainty warnings.
- **FR-018**: Static sample lessons MAY remain as test fixtures but MUST NOT be merged into production private-library results or presented as generated user content.
- **FR-019**: Lesson completion MUST require first-encounter participation, productive retrieval, speak-and-confirm, and changed-context transfer attempt.
- **FR-020**: Speech practice MUST work without microphone permission and MUST NOT claim pronunciation assessment.
- **FR-021**: Private lesson progress MUST store bounded evidence only, enforce owner RLS, and remain idempotent.
- **FR-022**: Generation MUST have rate limiting, retry-safe persistence, actionable failure states, and no partial public records.
- **FR-023**: The MVP MUST verify a live bounded Gemini success and failure path before release; absence of `GEMINI_API_KEY` remains a release blocker.
- **FR-024**: The MVP MUST reuse hosted Supabase project `zpiwddskhduuykpxltun` and Vercel project `atoenglish`, with repository types/environment aligned to the same project.
- **FR-025**: Implementation MUST begin from current `main` and selectively port reviewed Spec 001 code through a file-level manifest.
- **FR-026**: Technical gates MUST include lint, TypeScript, unit/contract tests, content standards, production build, hosted RLS/integration checks, live provider checks, and desktop/mobile Playwright.
- **FR-027**: Vercel preview MUST show no critical runtime errors during the accepted journey.
- **FR-028**: Owner acceptance is required before merge to `main` and before production deployment.

## MVP Success Criteria

- **SC-001**: A new learner authenticates, pastes one supported YouTube URL, and reaches a generated private lesson in one uninterrupted browser journey.
- **SC-002**: 100% of requests that reach transcript/Gemini work belong to an authenticated user.
- **SC-003**: A controlled supported YouTube source generates one complete typed private lesson without manual JSON repair.
- **SC-004**: Invalid, transcriptless, unsupported, or evidence-invalid sources create zero partial lessons.
- **SC-005**: 100% of generated lessons remain owner-private `ai_draft` records; zero appear in a public catalog automatically.
- **SC-006**: The lesson cannot finish without a recorded transfer attempt.
- **SC-007**: A returning learner sees correct generated-library and continue/review state after a new authenticated session.
- **SC-008**: A second user cannot read, update, delete, approve, publish, or attempt the first user's generated lesson.
- **SC-009**: Desktop and mobile acceptance produce no uncaught page error, Next.js overlay, horizontal overflow, or secret exposure.
- **SC-010**: Exact-head repository, hosted database, live Gemini, transcript-adapter, and Vercel preview evidence are recorded before owner review.

## Explicitly Out of Scope

- a public reviewed lesson catalog as the primary MVP;
- automatic public publication or community sharing;
- full human reviewer/publication dashboard;
- bulk generation or source crawling;
- support for every YouTube video, language, private/age-restricted source, or missing-caption source;
- media download or re-hosting;
- unrestricted chatbot;
- phoneme, stress, fluency, prosody, or pronunciation scoring;
- raw audio or unrestricted speech transcript storage;
- broad curriculum graph or automatic progression across A0–B2;
- XP, streak, league, achievements, challenge, certificates, social/referral systems;
- writing, grammar, business, broad speaking tools, notifications, payments, or native apps;
- autonomous merge or deployment.

## Assumptions

- The first MVP supports only YouTube videos that the selected transcript adapter can process with timed English evidence and official playback.
- A video URL alone is the learner input; unsupported transcript conditions produce an honest failure rather than asking the learner to repair JSON or provide technical metadata.
- Existing Spec 001 compiler, validation, private-draft, RLS, and persisted-preview work is reusable evidence/code but its diverged branch is not mergeable wholesale.
- Private generated lessons may be used by their owner with visible AI/transcript warnings; any public/shared lesson still requires human review.
- A live Gemini key and an acceptable production/private transcript acquisition decision are hard release gates.
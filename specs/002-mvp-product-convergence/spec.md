# Feature Specification: AtoEnglish MVP Product Convergence

**Feature Branch**: `spec/mvp-product-convergence`  
**Created**: 2026-08-03  
**Status**: Planning complete; implementation requires owner acceptance  
**Input**: Turn the existing AtoEnglish repository, hosted Supabase project, Vercel project, and verified Real Talk work into one coherent MVP that a Vietnamese beginner can actually use from landing page through lesson completion and return.

## MVP Product Decision

The MVP is not the current collection of more than forty routes, fifty legacy units,
gamification systems, writing tools, pronunciation tools, notifications, and an
experimental Real Talk compiler.

The MVP is one complete learner value loop:

```text
truthful landing page
→ sign up or log in
→ minimal account bootstrap
→ focused dashboard
→ choose one reviewed natural-communication lesson
→ first listen without answer exposure
→ scaffolded comprehension
→ retrieve useful source-backed language
→ speak and self-confirm
→ changed-context transfer attempt
→ save bounded progress
→ return to continue or review
```

The initial MVP corpus contains one learner-facing environment with at least three
human-reviewed lesson variants from at least two speakers or contexts. The default
environment is **Meet someone new**, unless source review proves another initial
environment materially safer and more feasible.

## User Scenarios & Testing

### User Story 1 — Enter the product and reach a focused dashboard (Priority: P1)

A Vietnamese adult can understand the product promise, create or access an
account, and reach a dashboard with one obvious next action.

**Independent Test**: A new email user and a returning user can complete the
landing → auth → dashboard journey on desktop and mobile without manual database
repair.

**Acceptance Scenarios**:

1. **Given** a visitor on the landing page, **When** they read the hero and primary CTA, **Then** the promise describes understanding and responding in natural communication rather than a conflicting 28-day, grammar-first, or fluency claim.
2. **Given** a new user, **When** signup succeeds, **Then** one idempotent server-side bootstrap creates the minimum profile/progress state and routes the learner to the MVP dashboard.
3. **Given** a returning user, **When** login succeeds, **Then** they return to the requested safe path or dashboard.
4. **Given** an unauthenticated visitor, **When** they request dashboard, catalog, progress, or account routes, **Then** they are redirected to login while the landing page remains public.
5. **Given** an authentication or bootstrap failure, **When** it occurs, **Then** the UI shows a recoverable error and does not claim successful onboarding.

---

### User Story 2 — Discover only reviewed learner content (Priority: P1)

The learner sees a small catalog of lessons that passed source, transcript,
speaker, timing, rights, safety, translation, and pedagogical review.

**Independent Test**: With three reviewed lessons and one unreviewed/private
draft in the database, the learner catalog returns only the three reviewed public
lessons and never falls back to static sample content.

**Acceptance Scenarios**:

1. **Given** the public catalog query, **When** the database contains no reviewed public lesson, **Then** the product shows an honest empty state rather than fabricated or unreviewed static samples.
2. **Given** a reviewed lesson, **When** it appears in the catalog, **Then** its situation, source, level, duration, and review state are available without exposing editor-only generation controls.
3. **Given** an `ai_draft`, private lesson, unreviewed transcript, or uncertain source, **When** the catalog loads, **Then** it is excluded.
4. **Given** the learner navigation, **When** the MVP shell renders, **Then** arbitrary YouTube generation, grammar, writing, leaderboard, challenge, certificate, business, and other deferred surfaces are absent from the primary navigation.

---

### User Story 3 — Complete one natural communication lesson (Priority: P1)

The learner enters a real situation, listens, receives progressive support,
retrieves useful language, speaks it, and attempts the same goal with changed
data or context.

**Independent Test**: A learner cannot complete the lesson by watching or choosing
answers alone; completion requires retrieval, speak-and-confirm, and transfer
attempt evidence.

**Acceptance Scenarios**:

1. **Given** a reviewed lesson, **When** it starts, **Then** the setting, roles, and practical goal appear before grammar or vocabulary explanation.
2. **Given** the first encounter, **When** media plays, **Then** no transcript or answer is exposed by default.
3. **Given** the learner needs support, **When** support is requested, **Then** it reveals progressively from replay/context to English evidence and concise Vietnamese guidance.
4. **Given** useful source-backed language, **When** acquisition begins, **Then** the learner retrieves or reconstructs it without a permanently displayed full answer.
5. **Given** speech practice, **When** browser speech recognition is absent or unused, **Then** the learner can speak and self-confirm without a pronunciation score.
6. **Given** the transfer step, **When** no changed-context attempt is made, **Then** completion remains blocked.
7. **Given** completion, **Then** the UI reports immediate practice evidence only and does not claim mastery, CEFR attainment, fluency, pronunciation accuracy, or retention.

---

### User Story 4 — Save progress and return (Priority: P1)

An authenticated learner can leave and return without losing lesson state or
completion evidence, while the system stores no raw audio or unrestricted learner
text.

**Independent Test**: A learner starts a lesson, reloads, completes it, logs out,
logs back in, and sees the correct continue/review state.

**Acceptance Scenarios**:

1. **Given** an in-progress lesson, **When** the learner reloads or returns, **Then** the product restores a safe checkpoint rather than exposing answers or restarting silently.
2. **Given** a completed lesson, **When** the dashboard reloads, **Then** the completion and next action are visible.
3. **Given** another authenticated user, **When** they query the first learner's attempts, **Then** RLS prevents access.
4. **Given** stored attempt evidence, **Then** it contains bounded booleans/counts/support state and timestamps, not raw microphone recordings, unrestricted transcripts, names, employers, or free text.
5. **Given** duplicate completion requests, **When** retries occur, **Then** persistence remains idempotent.

---

### User Story 5 — Operate and verify a pilot safely (Priority: P2)

The owner can deploy one preview, inspect the complete product journey, and run a
small pilot without exposing experimental authoring or relying on repository tests
as proof of learning effectiveness.

**Independent Test**: One exact-head Vercel preview passes the complete desktop
and mobile journey against hosted Supabase, with privacy-safe pilot events and no
critical runtime error.

**Acceptance Scenarios**:

1. **Given** the implementation branch, **When** integration begins, **Then** it starts from current `main`; it does not merge the 420-commit-diverged Real Talk branch wholesale.
2. **Given** selected Real Talk work, **When** it is ported, **Then** each file/contract is explicitly accepted, adapted, or rejected in a port manifest.
3. **Given** the Vercel preview, **When** browser acceptance runs, **Then** landing, signup/login, dashboard, catalog, lesson, persistence, logout, and return pass on desktop and mobile.
4. **Given** pilot analytics, **When** events are recorded, **Then** only bounded product events and scalar outcomes are stored.
5. **Given** all technical gates pass, **Then** merge and production deployment still require explicit owner acceptance.

## Functional Requirements

- **FR-001**: The MVP MUST have one truthful learner-facing promise across landing, auth, dashboard, catalog, and lesson completion.
- **FR-002**: Dashboard, learner catalog, progress, and account routes MUST require authentication; landing and legal pages remain public.
- **FR-003**: Signup bootstrap MUST be server-derived, idempotent, and shared by email and OAuth paths.
- **FR-004**: The primary navigation MUST contain only the MVP loop: Learn, Review/Continue, and Account, with no editor-generation entry.
- **FR-005**: The learner catalog MUST query database-reviewed public lessons only and MUST NOT merge static sample lessons.
- **FR-006**: Publication eligibility MUST require reviewed lesson state, reviewed transcript state, safe provenance, and `is_public = true`.
- **FR-007**: The MVP MUST support lawful official playback for the selected sources without media downloading or re-hosting.
- **FR-008**: Source records MUST not be hard-wired to YouTube when the reviewed MVP source uses Wikimedia or another approved provider.
- **FR-009**: Every learner-facing quote, answer, timestamp, speaker label, translation, and guidance line MUST be traceable to the reviewed source package.
- **FR-010**: Lesson completion MUST require first-encounter participation, productive retrieval, speak-and-confirm, and changed-context transfer attempt.
- **FR-011**: Speech practice MUST remain usable without microphone permission and MUST NOT claim pronunciation assessment.
- **FR-012**: Progress persistence MUST store bounded evidence only and enforce owner RLS.
- **FR-013**: Duplicate start, checkpoint, and completion writes MUST be idempotent.
- **FR-014**: The dashboard MUST prioritize one next action and MUST NOT require XP, streak, league, word-of-day, challenge, writing, or notification systems.
- **FR-015**: Deferred routes MAY remain in the codebase but MUST be removed from MVP navigation and may be guarded or redirected when they create product confusion.
- **FR-016**: The MVP MUST reuse the hosted Supabase project `zpiwddskhduuykpxltun` and Vercel project `atoenglish`; it MUST NOT create replacement infrastructure without a measured blocker.
- **FR-017**: Repository Supabase types and environment documentation MUST point to the same hosted project used by preview and production.
- **FR-018**: Implementation MUST begin from current `main` and selectively port reviewed work from open branches.
- **FR-019**: The experimental `youtube-transcript` path and arbitrary learner-facing generation MUST remain disabled from MVP production flows.
- **FR-020**: The MVP launch corpus MUST contain at least three human-reviewed lessons in one environment, from at least two speakers or contexts.
- **FR-021**: The product MUST record privacy-safe activation and lesson funnel events without learner free text or audio.
- **FR-022**: Technical checks MUST include lint, TypeScript, unit/contract tests, content standards, production build, hosted RLS checks, and desktop/mobile Playwright.
- **FR-023**: Vercel preview MUST show no critical runtime errors during acceptance.
- **FR-024**: Owner acceptance is required before merge to `main` and before production deployment.

## MVP Success Criteria

- **SC-001**: A new learner reaches the dashboard and starts a reviewed lesson in one uninterrupted browser journey.
- **SC-002**: 100% of learner-visible catalog items are database-backed and human-reviewed; zero static sample lessons appear.
- **SC-003**: The complete lesson cannot finish without a recorded transfer attempt.
- **SC-004**: A returning learner sees correct continue/completed state after a new authenticated session.
- **SC-005**: A second user cannot read or mutate the first user's lesson attempts.
- **SC-006**: Desktop and mobile acceptance produce no uncaught page error, Next.js error overlay, or horizontal overflow.
- **SC-007**: The first pilot records landing/start/auth/lesson/transfer/completion events without audio, transcript, name, employer, or free-text payloads.
- **SC-008**: Exact-head lint, types, tests, content standards, production build, hosted checks, and preview acceptance pass before owner review.
- **SC-009**: The MVP primary navigation exposes no deferred feature as a core learner promise.
- **SC-010**: The owner can identify the deployed commit, reviewed corpus, database migrations, environment configuration, blockers, and rollback path from repository evidence.

## Explicitly Out of Scope

- broad curriculum graph or automatic next-environment recommendation;
- five-environment or A0–B2 catalog expansion;
- arbitrary YouTube ingestion in the learner product;
- automatic transcript approval or publication;
- unrestricted AI tutor or chatbot;
- phoneme, stress, fluency, prosody, or pronunciation scoring;
- raw audio or unrestricted speech transcript storage;
- XP, streak, league, achievements, challenge, certificates, social or referral systems;
- writing assistant, grammar catalog, business track, broad speaking tools;
- push notifications, cron engagement campaigns, subscriptions, and payments;
- native mobile apps;
- autonomous merge or production deployment.

## Assumptions

- The hosted Supabase project is healthy and mostly empty, so MVP schema alignment has low migration risk but still requires backups and rollback planning.
- Existing Real Talk compiler, provenance, private draft, and persisted preview work are evidence and reusable code candidates, not a mergeable branch as a whole.
- Existing landing/auth/dashboard/mission code on `main` is reusable selectively but its current product promise and information architecture are not canonical.
- Human reviewers are available to approve the initial three-lesson corpus.
- The first pilot is small enough that content publication can use an authorized controlled operation; a full reviewer UI is not required for MVP.
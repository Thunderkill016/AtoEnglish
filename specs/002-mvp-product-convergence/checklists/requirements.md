# Requirements Quality Checklist: AtoEnglish MVP Product Convergence

**Purpose**: Verify that the MVP specification is complete, testable, bounded, and
consistent before implementation begins.

## Product Definition

- [x] The specification defines one complete learner value loop rather than a list of existing features.
- [x] The learner promise is consistent with natural communication and avoids fluency, CEFR, pronunciation, and mastery overclaims.
- [x] The initial corpus scope is bounded to one environment and at least three human-reviewed lessons.
- [x] The primary learner navigation and deferred product surfaces are explicit.
- [x] Editor-only generation is separated from the learner product.
- [x] MVP success can be demonstrated independently of broad curriculum, gamification, writing, notification, payment, or social systems.

## User Stories and Acceptance

- [x] User stories are prioritized and independently testable.
- [x] Landing/auth/dashboard acceptance includes new, returning, unauthenticated, and failure paths.
- [x] Catalog acceptance fails closed when no reviewed content exists.
- [x] Lesson acceptance requires first encounter, retrieval, speaking confirmation, and changed-context transfer.
- [x] Persistence acceptance includes reload, new session, idempotency, privacy, and cross-user denial.
- [x] Pilot acceptance includes exact-head preview, desktop/mobile, hosted database, runtime logs, and owner review.

## Source, Rights, and Content Integrity

- [x] Learner-visible content requires human-reviewed source, transcript, speaker, timing, translation, safety, and pedagogy evidence.
- [x] Static fixture/sample lessons are explicitly forbidden as production catalog fallback.
- [x] A public URL is not treated as permission for transcript storage or derivatives.
- [x] Playback is provider-neutral and limited to reviewed official/direct/external modes.
- [x] Media download and re-hosting are outside scope.
- [x] Missing evidence creates an empty state or publication block rather than fabrication.

## Learning Contract

- [x] Situation, roles, and practical goal appear before academic explanation.
- [x] First encounter does not expose transcript or answer by default.
- [x] Support is progressive rather than permanently showing the full answer.
- [x] Productive retrieval is required.
- [x] Speak-and-confirm works without microphone permission and produces no pronunciation score.
- [x] Changed-context transfer is a completion gate.
- [x] Completion language distinguishes immediate practice from retention/mastery.

## Authentication and Privacy

- [x] Authentication precedes protected learner routes.
- [x] Account bootstrap derives user identity server-side and is idempotent.
- [x] Email and OAuth bootstrap share one contract.
- [x] No client-supplied user ID or reviewer/publication role is trusted.
- [x] Learner attempt storage is bounded and excludes raw audio, unrestricted transcripts, names, employers, and free text.
- [x] Cross-user access is covered by RLS acceptance scenarios.
- [x] Analytics payloads are bounded and privacy-safe.

## Repository and Infrastructure Convergence

- [x] Implementation must start from current `main`.
- [x] Whole-branch merge of the diverged Real Talk branch is prohibited.
- [x] A file-level port manifest is required.
- [x] Main toolchain and lockfile decisions remain authoritative.
- [x] Supabase types, environment documentation, preview, and production must reference the same hosted project.
- [x] Existing Vercel and Supabase projects are reused.
- [x] Migrations, preview deployment, merge, and production deployment require explicit owner authorization at their respective gates.

## Verification and Evidence

- [x] Technical gates include lint, TypeScript, unit/contract tests, content standards, integration checks, and production build.
- [x] Hosted database verification includes anonymous and two-user behavior.
- [x] Browser verification covers the full journey on desktop and mobile.
- [x] Runtime error inspection is required after preview deployment.
- [x] Human lesson review is not replaced by automated checks.
- [x] Product/learning effectiveness is not inferred from CI.
- [x] Owner acceptance is a separate final gate.

## Explicit Decisions Required Before or During Implementation

- [ ] Owner accepts this MVP promise and scope.
- [ ] Owner confirms the initial environment, defaulting to **Meet someone new**.
- [ ] At least three source packages are identified as feasible for full human review and lawful learner use.
- [ ] Existing evidence storage is accepted or a bounded `real_talk_attempts` table is approved after schema analysis.
- [ ] Exact reviewed/public status values and the controlled publication operation are approved.
- [ ] The treatment of deferred routes is chosen: hidden only, authenticated redirect, or temporary feature flag where needed.
- [ ] Any hosted migration application is explicitly authorized.
- [ ] The intentional Vercel preview is explicitly authorized after technical gates.
- [ ] Final merge and production deployment are separately authorized.

## Checklist Result

Specification quality: **PASS**  
Implementation authorization: **NOT YET GRANTED**

No unchecked item above may be silently assumed. Implementation may perform
research and propose a decision, but owner-gated writes and release actions remain
blocked until explicitly authorized.
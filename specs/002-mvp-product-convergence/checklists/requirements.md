# Requirements Quality Checklist: YouTube-to-Private-Lesson MVP

## Core Product Definition

- [x] Owner decision explicitly preserves paste-YouTube-URL → private lesson as the core product.
- [x] The specification does not replace generation with a fixed reviewed catalog.
- [x] The critical journey is one complete private generation, learning, persistence, and return loop.
- [x] The promise says `supported YouTube videos`, not every video.
- [x] Generated lessons are explicitly owner-private AI drafts.
- [x] Public sharing/catalog and full reviewer operations are deferred.
- [x] Broad curriculum, gamification, writing, notifications, payments, social, and native apps are outside MVP.

## Authentication and Dashboard

- [x] Authentication is required before transcript, metadata, or Gemini work.
- [x] Email and OAuth share one idempotent server bootstrap contract.
- [x] Client-supplied user identity and publication/review state are not trusted.
- [x] The dashboard's primary action is a YouTube URL form.
- [x] Recent private lessons expose start/continue/review/failure states.
- [x] Landing, auth, dashboard, private lesson, account, and return paths are independently testable.

## YouTube and Transcript Boundary

- [x] URL normalization/validation and supported host forms are specified.
- [x] Official YouTube playback is required; media download/re-hosting is forbidden.
- [x] Transcript acquisition is behind a replaceable adapter with explicit mode/status/warnings.
- [x] Timed English cues are required.
- [x] Unsupported/private/age-restricted/embed-disabled/transcriptless/non-English paths fail honestly.
- [x] Transcript text is bounded, normalized, and treated as untrusted prompt data.
- [x] The exact private-production transcript adapter decision is a release gate.
- [x] Controlled supported and unsupported live checks are required.

## AI Generation and Evidence

- [x] Gemini generation occurs only after authentication and rate limiting.
- [x] Interaction selection is bounded to <=180 seconds and configured cue limits.
- [x] Model output uses a typed structured schema and runtime validation.
- [x] Source-dependent phrases, answers, timestamps, references, and transfer targets require evidence validation.
- [x] Invalid output is rejected before persistence.
- [x] Actual model, adapter/mode, selected window, digest, warnings, and failure codes are persisted/observable.
- [x] Live Gemini success and failure are required; mocks do not satisfy the release gate.
- [x] Absence of `GEMINI_API_KEY` remains a blocker.

## Private Draft and Security

- [x] Successful generation is atomic and deterministic/idempotent.
- [x] Generated video/lesson state remains private `ai_draft`.
- [x] Ordinary users cannot approve or publish generated drafts.
- [x] Owner-only read/write/delete and cross-user denial are required.
- [x] Failed generation/persistence creates no partial lesson.
- [x] Static fixtures cannot appear as generated private-library content.
- [x] Hosted anonymous/ownerA/ownerB verification is required.

## Learning Runtime

- [x] Environment, roles, practical goal, source, AI label, and warnings precede activities.
- [x] First encounter hides transcript/answers by default.
- [x] Support reveals progressively.
- [x] Productive retrieval is required.
- [x] Speak-and-confirm works without microphone permission and produces no pronunciation score.
- [x] Changed-context transfer is a completion gate.
- [x] Completion copy distinguishes immediate practice from mastery/retention.

## Persistence and Privacy

- [x] Progress storage is bounded to IDs, enums, booleans, counts, support level, and timestamps.
- [x] Raw audio, unrestricted speech transcript, learner response text, names, employers, and arbitrary analytics are forbidden by default.
- [x] Attempt writes derive the owner, validate lesson ownership, enforce RLS, and remain idempotent.
- [x] Reload and new-session return behavior are acceptance requirements.

## Repository and Infrastructure

- [x] Implementation starts from current `main`.
- [x] Whole-branch merge of PR #54/Real Talk is prohibited.
- [x] A file-level port manifest is required.
- [x] Main Node/npm/package-lock decisions remain authoritative.
- [x] Repo types/environment/preview use Supabase `zpiwddskhduuykpxltun`.
- [x] Existing Vercel project `atoenglish` is reused.
- [x] Hosted migrations, preview, merge, and production deploy remain separately owner-gated.

## Verification

- [x] Exact-head lint, TypeScript, targeted tests, full tests, content checks, integration, and build are required.
- [x] Live transcript and Gemini matrices are required.
- [x] Desktop/mobile Playwright covers supported generation, unsupported failure, lesson, completion, logout/login, return, and cross-user denial.
- [x] Vercel runtime error/log inspection is required.
- [x] CI is not treated as proof of transcript correctness, learning effectiveness, or market demand.
- [x] Owner acceptance is a separate release gate.

## Open Authorization/Implementation Decisions

- [x] Owner confirms paste-YouTube-URL → private personal lesson as the core MVP.
- [ ] Owner explicitly authorizes implementation to begin.
- [ ] Exact transcript adapter/private-production decision is accepted after technical/legal/reliability review.
- [ ] `GEMINI_API_KEY` is available through a bounded secret workflow for live verification.
- [ ] Existing progress storage is accepted or a bounded `real_talk_attempts` migration is approved.
- [ ] Any hosted migration application is explicitly authorized.
- [ ] Intentional Vercel preview is explicitly authorized after prerequisite gates.
- [ ] Exact preview is accepted by the owner.
- [ ] Merge and production deployment are separately authorized.

## Result

Specification quality: **PASS AFTER OWNER CORRECTION**  
Core product decision: **CONFIRMED**  
Implementation authorization: **NOT YET RECORDED**
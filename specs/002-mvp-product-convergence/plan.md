# Implementation Plan: AtoEnglish MVP — YouTube to Private Lesson

**Planning branch:** `spec/mvp-product-convergence`  
**Future implementation branch:** `integration/mvp-youtube-to-lesson`, created from then-current `main`  
**Planning deployment:** none

## Owner-Corrected Product Goal

The product's core interaction is:

```text
paste YouTube URL
→ generate a private evidence-bound lesson
→ learn from that selected interaction
→ save and revisit it
```

A fixed reviewed catalog is not the MVP. Human review/publication belongs to a
later shared-content feature. The MVP serves the authenticated owner with a
private `ai_draft` and visible transcript/AI uncertainty.

## Technical Context

- Next.js 16.2.9 App Router, React 19, TypeScript, Tailwind CSS v4
- Hosted Supabase: `zpiwddskhduuykpxltun`, Auth, PostgreSQL, RLS
- Vercel project: `atoenglish`, Node 24
- Generation provider: Gemini behind the existing typed provider contract
- Source: supported public YouTube URL, official embed/watch playback
- Transcript: replaceable timed-transcript adapter with explicit mode and failure codes
- Tests: Vitest, Playwright, content checks, hosted RLS/integration, live bounded provider checks
- Branch state: `agent/rebuild-learning-core` contains valuable Spec 001 work but is diverged 420 commits ahead and 7 behind `main`; it MUST NOT be merged wholesale

## Constitution Check

| Principle | Plan response |
| --- | --- |
| Natural Communication First | The compiler selects a bounded natural interaction from the learner's chosen video and builds the lesson around its situation and practical goal. |
| Evidence-Bound Generation | All source-dependent generated claims validate against timed transcript cues; invalid output is rejected. |
| Transfer Before Completion | The private lesson cannot complete without changed-context production. |
| Rights, Privacy, Safety | Official playback only, no media re-hosting, owner-private drafts, visible warnings, RLS, no raw learner audio/free text. |
| Small Testable Delivery | One supported YouTube-to-private-lesson journey, not a catalog/curriculum rebuild. |
| Measurable Evidence | Technical, provider, browser, learner-flow, and owner evidence remain distinct. |

**Result:** PASS as a private-generation MVP. Public sharing remains blocked behind human review.

## Repository Findings Driving the Revised Plan

1. The existing Real Talk compiler already implements much of the desired product: authenticated generation, bounded transcript selection, Gemini structured output, evidence validation, private persistence, RLS, and a learner-like preview.
2. The previous MVP plan incorrectly demoted `/real-talk/create` and arbitrary YouTube input. Owner correction makes that flow the primary learner action.
3. Current landing/auth/dashboard/navigation still describe legacy 28-day, unit, XP, flashcard, writing, and gamification experiences instead of URL-to-lesson generation.
4. The current create flow is production-blocked by transcript acquisition policy and missing live Gemini-key evidence, not by lack of UI or database infrastructure.
5. Static sample lessons must not be mistaken for lessons generated from the user's URL. They may remain only as controlled fixtures/demos.
6. The hosted database already contains private Real Talk schema, atomic persistence, transcript provenance, RLS, and reviewed-source infrastructure.
7. Main and the Real Talk branch have different package/type baselines; implementation must preserve main's Node/npm/lockfile and selectively port only required files.
8. The hosted Supabase project is mostly empty, so product convergence can focus on correct private-generation semantics without a large user-data migration.

## Target Product Architecture

```text
src/app/
├── page.tsx                              # promise: paste YouTube, get a private lesson
├── login/                                # auth only
└── (main)/
    ├── dashboard/                        # URL form + recent/continue/review lessons
    ├── real-talk/create/                 # focused generation surface, or embedded in dashboard
    ├── real-talk/[lessonSlug]/            # owner-private lesson runtime
    └── me/                               # account/logout/private history

src/features/real-talk/
├── application/generate-private-lesson.ts
├── domain/                               # URL, transcript, result, prompt, draft identity, runtime
├── server/                               # YouTube source, transcript adapter, Gemini, compiler, persistence
├── components/                           # generation form/status + lesson runtime
└── client/                               # bounded progress/checkpoint state

src/features/mvp/
├── domain/                               # dashboard/account states
└── server/                               # bootstrap + recent private lesson query
```

No public catalog is required. `/real-talk` may become the owner's private lesson
library or redirect to the dashboard.

## Selective-Port Strategy

Create the implementation branch from current `main`. Build a file-level manifest
with `port`, `adapt`, `reference`, or `reject` classifications.

### High-priority port/adapt candidates

- `src/features/real-talk/application/generate-private-lesson.ts`
- `src/features/real-talk/domain/**`
- `src/features/real-talk/server/private-lesson-compiler.ts`
- `src/features/real-talk/server/gemini-lesson-provider.ts`
- `src/features/real-talk/server/transcript-source-policy.ts`
- `src/features/real-talk/server/transcript-sources/youtube-experimental.ts`
- `src/features/real-talk/server/draft-repository.ts`
- `src/features/real-talk/server/draft-mapping.ts`
- `src/app/actions/real-talk.ts`
- `src/app/(main)/real-talk/create/page.tsx`
- private lesson runtime components/tests
- atomic private-draft/provenance migrations already applied to hosted Supabase
- Spec 001 hosted/browser verification artifacts as evidence references

### Reject/isolate from the MVP critical path

- public static sample catalog fallback
- automatic publication or shared catalog
- broad mission/curriculum/gamification work
- stale package/lockfile state and the `gtts` dependency chain
- unapplied `20260731162613_learning_attempts.sql` unless separately adopted after model review

## Transcript Acquisition Decision

The URL-only product depends on timed transcript evidence. The implementation must
make a production/private-MVP decision before release:

1. identify the exact adapter used for supported YouTube videos;
2. document acquisition mode, reliability, terms/rights risk, language/timing limits, and failure modes;
3. keep the adapter replaceable;
4. label generated lessons with acquisition mode and warnings;
5. fail unsupported videos honestly;
6. keep generated output owner-private;
7. never download/re-host video or treat a URL as permission for public derivatives.

The current experimental adapter may be used in a controlled preview only after
this decision is documented. It cannot silently be promoted because tests pass.

## Data Strategy

Reuse the existing private draft tables and atomic persistence where their hosted
schema matches the Spec 001 contracts:

- `real_talk_videos`: source identity, owner, URL/video metadata, selected window, transcript provenance, private/public state
- `real_talk_lessons`: generated structured lesson, model, warnings, environment, activities, transfer task, `ai_draft` state
- `real_talk_transcript_sources`: optional reviewed/registered source evidence; not required for every private user-generated lesson if acquisition provenance is stored elsewhere

Add or adapt a bounded learner-attempt record only when existing progress tables
cannot express first listen, support, retrieval, speech confirmation, and transfer.

Do not store raw recordings, unrestricted speech/transfer text, names, employers,
or arbitrary analytics payloads.

## UI and Information Architecture

### Landing

- Headline: turn a YouTube video into a personal English lesson
- Explain supported-video limitations and AI/transcript uncertainty honestly
- Primary CTA: paste a link after authentication

### Authenticated dashboard

- YouTube URL input is the primary action
- Generation state: validating → reading transcript → selecting interaction → generating → validating → saving
- Recent private lessons with `continue`, `review`, `retry`, or `failed` states
- Clear supported/unsupported error guidance

### Private lesson

- Source and official playback
- AI draft/transcript-mode warnings
- environment briefing
- first listening encounter
- progressive support
- productive retrieval
- speak-and-confirm
- changed-context transfer
- honest completion

### Minimal navigation

- Tạo bài / Học
- Bài của tôi
- Tôi

Legacy modules stay out of the primary MVP shell.

## Delivery Phases

### Phase 0 — Governance and baseline

- record owner correction;
- create fresh-main implementation branch;
- build selective-port manifest;
- align package, Supabase types/project reference, CI, and environment docs.

### Phase 1 — Entry, auth, and generation dashboard

- rewrite landing promise;
- simplify auth and server-side bootstrap;
- protect private routes;
- make URL form/recent lessons the dashboard core;
- remove fake personalization and unrelated navigation.

### Phase 2 — YouTube source and transcript boundary

- validate/normalize YouTube URLs;
- verify official playback/embed availability;
- finalize transcript adapter decision and failure codes;
- implement supported-video checks and bounded transcript acquisition;
- preserve source metadata/provenance/warnings.

### Phase 3 — Private compiler and persistence

- port compiler/Gemini/evidence contracts;
- authenticate before provider calls;
- run structured generation and source validation;
- atomically persist deterministic owner-private `ai_draft`;
- expose actionable generation status and retry behavior;
- verify live Gemini success/failure with a bounded key.

### Phase 4 — Lesson runtime and return

- adapt the environment-first preview into the owner learner runtime;
- enforce retrieval, speaking confirmation, and transfer completion gates;
- persist bounded progress;
- build recent/private library and return states;
- prove cross-user denial.

### Phase 5 — Preview and release gates

- exact-head technical gates;
- hosted Auth/RLS/atomic-persistence checks;
- controlled supported/unsupported YouTube checks;
- desktop/mobile end-to-end preview;
- Vercel runtime error inspection;
- owner acceptance;
- separate merge and production-deployment authorization.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Transcript adapter cannot reliably support arbitrary YouTube URLs | Critical | Promise only supported videos; explicit adapter decision, failure codes, replacement boundary. |
| Live Gemini key/provider path missing | Critical | Treat live success/failure as release blocker; never substitute mocks. |
| Whole-branch merge reintroduces stale dependencies/product state | High | Fresh-main integration and exact port manifest. |
| Generated transcript/lesson contains errors | High | Timed-cue evidence validation, AI-draft label, warnings, private-only state. |
| User expects every video to work | High | Supported-video requirements and actionable failure copy on landing/form. |
| Partial lesson persists after provider/database failure | High | Atomic deterministic persistence and cleanup tests. |
| Cross-user private lesson leak | Critical | RLS, owner-derived queries, two-user hosted/browser tests. |
| Static fixtures appear as user-generated output | High | Remove fixture fallback from private library/production generation paths. |
| Legacy dashboard obscures core action | High | URL form and recent private lessons become the entire primary dashboard. |
| CI passes without provider/browser reality | High | Live adapter/Gemini/hosted/preview evidence required. |

## Constitution Check — After Design

- Natural interaction chosen by the learner is the content source: PASS.
- Generated claims remain bounded to transcript evidence: PASS.
- Private AI draft is not confused with reviewed/public content: PASS.
- Transfer remains a completion gate: PASS.
- Official playback and privacy boundaries remain intact: PASS.
- One vertical slice can be independently tested: PASS.

## Stop Conditions

Return to planning if:

- no acceptable transcript acquisition method can support the URL-only workflow;
- implementation would require a whole-branch merge;
- hosted schema differs materially from the private-draft contract;
- live Gemini cannot be tested safely;
- source-dependent output cannot be validated against timed cues;
- generated lessons cannot remain owner-private;
- the product promise expands to every YouTube video rather than supported videos;
- the owner changes the paste-URL core idea.
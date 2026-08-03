# Research: AtoEnglish MVP — YouTube to Private Lesson

**Observed:** 2026-08-03  
**Revised after owner correction:** 2026-08-03  
**Research mode:** repository, open-PR, hosted Supabase, Vercel, CI, product-governance, and existing Real Talk compiler audit

## Corrected Product Thesis

The owner clarified that AtoEnglish is not primarily a curated lesson catalog.
Its core idea remains:

```text
learner chooses a YouTube video
→ pastes the URL
→ AtoEnglish turns a supported interaction into a private English lesson
```

The earlier planning conclusion that arbitrary learner-facing generation should be
removed was incorrect. The product must instead make this workflow reliable,
honest, private, and usable.

## Audit Scope

The audit covered governing documents, product routes, landing/auth/dashboard,
Real Talk generation/runtime, Supabase schema/migrations/RLS/functions, Vercel,
CI, open PRs, package/toolchain state, and the branch comparison needed to plan the
MVP. It does not claim manual line-by-line reading of every asset or generated file.

## Repository and Branch Baseline

- `main` contains the current merged shell, auth, dashboard, legacy learning tools,
  database hardening, tests, and deployment controls.
- `agent/rebuild-learning-core` contains the most complete YouTube-to-private-
  lesson work and Spec 001 evidence.
- The Real Talk branch is diverged from `main`: 420 commits ahead and 7 behind at
  audit time.

**Decision:** Reuse the Real Talk vertical slice through a file-level port manifest.
Do not merge the branch wholesale.

## Existing Product Surface

The exact-head build exposes more than forty routes and 89 generated pages,
including legacy units, flashcards, speaking, writing, grammar, challenge,
leaderboard, certificate, notifications, Real Talk, and account surfaces.

**Decision:** Route count is not MVP value. The critical shell becomes:

```text
landing
login/signup
URL generation dashboard
private lesson
private lesson library/return
account/logout
```

## Landing Finding

Current landing still emphasizes a 28-day program, A0 path, fixed workplace
outcome, PPP/FSRS/shadowing, and broad course comparisons.

**Corrected decision:** Rewrite the promise around the owner-approved value:

> Dán một video YouTube bạn muốn học. AtoEnglish chọn một đoạn hội thoại phù hợp và biến nó thành bài luyện nghe-nói cá nhân.

The copy must say **supported videos**, not every video, and must not promise
perfect transcripts, fluency, or pronunciation scoring.

## Authentication and Bootstrap Finding

The current login page combines auth with a survey that asks one visible question
but silently supplies defaults for other personalization fields. Email and OAuth
paths do not share one clean server-owned bootstrap.

**Decision:** Authentication precedes transcript and Gemini work. Use one
idempotent server bootstrap. Remove fake/defaulted personalization from the
critical path.

## Dashboard Finding

Current dashboard is organized around XP, streak, flashcards, fifty units, recent
speaking sessions, daily missions, word-of-day, and activity charts.

**Corrected decision:** The MVP dashboard answers:

1. Which YouTube video do you want to learn from?
2. Do you want to continue or review a lesson you already generated?

The primary UI is a URL form plus recent private lessons.

## Real Talk Generation Finding

Spec 001 already implemented or verified substantial parts of the desired MVP:

- authentication before transcript/Gemini work;
- YouTube URL validation and source identity;
- transcript adapter boundary and explicit source policy;
- deterministic bounded interaction-window selection;
- Gemini structured output;
- Zod schema validation;
- source-evidence validation for transcript, phrases, timestamps, answers, and
  transfer targets;
- stable machine-readable failure results;
- deterministic owner-private draft identity;
- atomic private persistence;
- RLS and inability for ordinary users to approve/publish;
- reloadable private lesson preview;
- desktop/mobile persisted preview with transfer completion gate.

This is not merely an editor tool from the owner's perspective; it is the closest
existing implementation of the product itself.

## Remaining Generation Blockers

The private-generation workflow is not production-ready because:

1. the current YouTube transcript adapter remains classified experimental;
2. production/private transcript acquisition policy has not been finally accepted;
3. `GEMINI_API_KEY` was absent from live verification;
4. learner shell and dashboard do not make URL generation the central action;
5. current branch/toolchain state is not cleanly integrated with `main`;
6. final exact-head hosted/Vercel end-to-end generation has not run;
7. product warnings and unsupported-video behavior need user-facing verification.

## Transcript Acquisition Finding

A URL-only product requires timed transcript evidence. YouTube does not guarantee
that every public video exposes a usable English transcript through the current
adapter. Videos may be private, age-restricted, embed-disabled, captionless,
auto-translated, badly timed, non-English, or temporarily unavailable.

**Decision:** MVP supports a bounded subset of YouTube videos. The exact adapter
and acquisition mode must be documented and replaceable. Unsupported inputs fail
honestly; the product does not fabricate a transcript or ask the learner to repair
JSON.

The current experimental adapter is a candidate for controlled private use, not a
silently approved universal solution.

## Rights and Playback Finding

The product can preserve the core URL workflow while respecting boundaries:

- use official YouTube embed/watch playback;
- do not download or re-host media;
- do not automatically publish generated derivatives;
- keep the lesson private to the requesting owner;
- store source identity, selected cues, acquisition mode, and warnings;
- require separate human review before public sharing/catalog publication.

**Decision:** Provider-neutral catalog work is not an MVP prerequisite. The MVP is
YouTube-specific by product design; future source providers may be added behind the
same adapter/playback contracts.

## Static Sample Finding

`fetchCatalogVideos()` merges static sample lessons with database rows and falls
back to samples when the database is empty. Those samples contain extensive
transcript, speaker, translation, pronunciation, and pedagogical claims.

**Corrected decision:** Static samples are not the core product and must not appear
as if generated from the user's URL or as private-library records. They may remain
as tests, demos, or development fixtures with explicit labels. A public catalog is
deferred.

## Database Finding

Hosted project `zpiwddskhduuykpxltun` is active and contains:

- private Real Talk schema and gates;
- transcript provenance fields;
- atomic owner-private draft persistence and conflict fix;
- reviewed transcript registry infrastructure;
- RLS on observed public tables;
- very little learner/application data.

**Decision:** Reuse the existing private draft tables and atomic RPC where hosted
verification proves equivalence. Do not redesign the database around a public
catalog.

## Progress Data Finding

Existing legacy progress tables do not cleanly express Real Talk first listen,
support level, productive retrieval, speak confirmation, and transfer. The old
unapplied `learning_attempts` migration remains outside authorized hosted work.

**Decision:** First test a strict wrapper over existing evidence storage. If
insufficient, add a small owner-private `real_talk_attempts` table with bounded
fields and no learner free text/audio.

## Toolchain Finding

- `main` pins Node 24/npm 11 and removed the old `gtts` dependency chain.
- the Real Talk branch carries stale package state and deprecated transitive
  dependencies through `gtts`.
- `main` still points its `db:types` script at a different Supabase project ID.

**Decision:** Keep main's package/lock/toolchain. Add only dependencies truly
required by the selected Real Talk files. Align generated types to
`zpiwddskhduuykpxltun`.

## Vercel Finding

The connected Vercel project `atoenglish` exists and controlled previews have
been READY. Git deployments are intentionally limited to `preview/**` branches.
No accepted current product deployment was promoted during planning.

**Decision:** After exact-head local/GitHub/hosted/live-provider gates, create one
`preview/mvp-youtube-to-lesson` deployment and run the full URL-to-private-lesson
journey on desktop and mobile.

## Corrected MVP Scope

### Must ship

- truthful YouTube-to-lesson landing promise;
- stable auth and idempotent account bootstrap;
- URL-first dashboard;
- validated supported YouTube input;
- explicit transcript acquisition adapter/mode and failure behavior;
- bounded interaction selection;
- live Gemini structured generation;
- source-evidence validation;
- atomic owner-private `ai_draft` persistence;
- AI/transcript uncertainty warnings;
- natural lesson runtime with retrieval, speech confirmation, and transfer;
- private lesson library and return state;
- bounded owner-private progress;
- desktop/mobile hosted preview and owner acceptance.

### Reuse

- Supabase Auth/RLS foundation;
- Spec 001 compiler/provider/domain/private-draft code;
- existing official YouTube playback component with adaptation;
- existing persisted private preview runtime;
- rate limiting, Sentry, Vercel observability, and pilot event infrastructure;
- design system/layout components that support the focused shell.

### Defer

- public/shared lesson catalog;
- full human reviewer/publication UI;
- public lesson discovery and recommendation;
- bulk generation/crawling;
- support for every YouTube video;
- broad curriculum and gamification systems;
- writing, grammar, broad speaking tools, notifications, payments, social, native apps.

## Final Research Conclusion

The repository already contains most of the hard technical foundation for the
owner's actual product idea. The fastest correct path is not to replace generation
with a curated catalog. It is to converge the verified private compiler onto
current `main`, make paste-URL generation the product's primary action, resolve the
transcript/live-Gemini blockers, and prove one honest private lesson journey on the
connected Supabase and Vercel environments.
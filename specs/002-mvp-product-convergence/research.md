# Research: AtoEnglish MVP Product Convergence

**Observed:** 2026-08-03  
**Research mode:** repository, open-PR, hosted Supabase, Vercel, CI, and product-governance audit

## Research Scope and Method

The audit used the following evidence classes:

1. governing repository documents and Spec Kit artifacts;
2. current `main` and `agent/rebuild-learning-core` files;
3. commit comparison between `main` and the Real Talk branch;
4. exact-head GitHub Actions logs and Next.js route output;
5. open PR descriptions and branch topology;
6. hosted Supabase schema, migration history, Edge Functions, RLS status, and aggregate row counts;
7. connected Vercel project, deployment history, and grouped runtime errors.

“Read the whole repository” is interpreted as reading every governing artifact,
runtime surface category, data/infrastructure boundary, test family, and active PR
workstream needed to make an MVP decision. It does not claim manual line-by-line
inspection of every generated asset or every one of hundreds of implementation
files.

## Repository Baseline

### Current main

```text
branch: main
head:   961e779886ff95b1b5f67d5e6997520d1facdb1a
```

Main contains the merged product shell, landing, auth, dashboard, legacy lesson
system, six-mission learning core, Gold Day 1, analytics, database hardening,
tests, and deployment controls.

### Current Real Talk branch

```text
branch: agent/rebuild-learning-core
head:   e1642db1540046271f520f72f1b20a04e5d84f09
PR:     #54, draft, non-main base
```

Comparison with main:

```text
status:    diverged
ahead_by:  420
behind_by: 7
merge_base: 1e462367d365d03e01d2b211da2499ac612a57ff
```

**Decision:** No wholesale merge. Future implementation begins from current
`main` and ports selected Real Talk work.

## Governing Product Findings

The constitution and product truth require:

- natural communication as the learner-facing surface;
- reviewed evidence for learner-facing source claims;
- transfer before completion;
- owner-private AI drafts and human publication gates;
- no raw learner audio/free text by default;
- one small independently testable vertical slice;
- no claim that technical checks prove learning effectiveness.

The open product-direction branch further defines:

> Natural communication on the surface; an evidence-based invisible curriculum underneath.

It recommends initial environment experiences rather than learner-facing grammar
or CEFR chapters.

## Runtime Surface Inventory

The exact-head Real Talk branch production build generated 89 pages and exposed
these product categories:

- landing and legal;
- auth callback and login;
- dashboard, progress, roadmap, profile/settings;
- legacy unit learning, checkpoint, transfer;
- Real Talk catalog/create/lesson;
- flashcards and hard cards;
- speaking journal/roleplay/shadowing/phoneme;
- writing and history;
- grammar, quiz, placement, business;
- challenge, leaderboard, certificate, invite;
- notifications, push, daily and weekly cron APIs.

**Decision:** Route existence is not MVP scope. Primary navigation and acceptance
will include only landing, auth, dashboard, reviewed Real Talk, review/continue,
and account.

## Landing Findings

Current main landing:

- promises a 28-day speaking journey and 10–15 minutes/day;
- references an A0 starting path and workplace introduction outcome;
- includes legacy claims around PPP, FSRS, shadowing, AI roleplay, grammar-style
  progression, and comparison with broad learning products;
- uses a public CTA and strong production-like copy.

This conflicts with the current natural-communication product truth.

**Decision:** Replace with one honest promise: understand one short reviewed
interaction and respond in a comparable changed situation. Do not promise a
28-day result, fluency, pronunciation accuracy, or personalized curriculum.

## Authentication and Onboarding Findings

Current main login page:

- combines welcome, level survey, login, and signup in one client component;
- declares four survey questions but the current short flow asks only the first
  and silently supplies defaults for goal, obstacle, and daily time;
- claims personalization despite defaulted answers;
- duplicates email and OAuth onboarding paths;
- inserts `user_progress` and `user_onboarding_profile` from the browser;
- redirects to legacy dashboard/lesson paths.

Session middleware currently leaves dashboard, learn, flashcards, and speaking
available to guests while protecting many secondary features.

**Decisions:**

1. Auth is auth; remove fake personalization from the critical path.
2. Use one server-side idempotent account bootstrap shared by email and OAuth.
3. Protect dashboard/catalog/account routes.
4. Any onboarding question must change immediate product behavior; otherwise
   defer it.

## Dashboard Findings

Current dashboard fetches and renders data from:

- user progress, total XP, streak, best streak, daily goal, streak freezes;
- due flashcards;
- fifty-unit completion map and current legacy unit;
- recent speaking sessions;
- daily missions and four mission flags;
- word of the day;
- weekly XP and 49-day activity calendar.

It defaults to legacy `unit-1` metadata if no user state exists.

**Decision:** The MVP dashboard has one primary action, recent/continue state,
and a small reviewed lesson list. XP, streak, flashcards, word-of-day, speaking
feed, and fifty-unit progress are not required.

## Navigation Findings

Main navigation exposes:

- Learn, Flashcards, Me as primary;
- legacy lessons, speaking, writing, progress, leaderboard, roadmap, business;
- mobile groups for study, tracking, and other features;
- dashboard actions for challenge, writing, pronunciation, and leaderboard.

The Real Talk branch adds Real Talk as another item rather than making it the
product surface.

**Decision:** MVP primary shell is Learn, Review/Continue, Account. Real Talk is
not an optional content tab; it is the core learning runtime.

## Real Talk Catalog and Content Findings

`fetchCatalogVideos()` currently:

1. imports static sample videos/lessons;
2. queries public database rows;
3. returns static samples when the database is empty;
4. always prepends static samples even when public database lessons exist.

The static sample file contains extensive transcript, translation, speaker,
pronunciation, L1-interference, answer, and pedagogy claims. The file header calls
them curated real conversations, but these records did not pass the hosted
review registry and publication gate.

The hub also exposes a CTA to generate a lesson from an arbitrary YouTube link.

**Decisions:**

- Remove static fallback from learner catalog.
- Fail closed with an honest empty state.
- Hide arbitrary generation from learners.
- Keep private generation as an editor operation only.
- Require database-backed reviewed publication state.

## Real Talk Compiler and Verification Findings

Reusable evidence from Spec 001 includes:

- authenticated generation ordering and rate limiting;
- typed generation result and Zod contract;
- evidence validation against bounded source cues;
- owner-private `ai_draft` persistence and RLS;
- atomic draft RPC;
- transcript provenance and cue digest;
- independent reviewer role and immutable reviewed source;
- approved `supabase-reviewed-transcript-v1` adapter;
- desktop/mobile persisted private-preview browser evidence;
- exact-head lint, types, 387 tests, 50 content checks, and Next.js build.

Remaining Spec 001 issues include:

- no live Gemini key evidence;
- no final human lesson review;
- public learner compiler still routes to experimental/static behavior;
- owner acceptance remains open.

**Decision:** Reuse contracts/security/evidence, not branch history or learner
surface as-is.

## Source and Playback Findings

The hosted controlled reviewed source was Wikimedia/DVIDS source `1000496`, while
`real_talk_videos.youtube_id` is currently non-null and the learner components are
YouTube-shaped.

**Decision:** MVP source/playback data becomes provider-neutral with a small
closed set of playback modes:

- `youtube_embed` for compliant official embeds;
- `direct_video` for reviewed public-domain/owned media;
- `external_link` only when an in-product player is not permitted.

The MVP must not download or re-host media.

## Database Findings

Hosted project:

```text
name:   AtoEnglish
ref:    zpiwddskhduuykpxltun
region: ap-southeast-1
status: ACTIVE_HEALTHY
```

Observed:

- 26 public tables;
- RLS enabled on all observed public tables;
- 3 Auth users;
- 16 pilot events;
- 1 league seed;
- zero estimated rows in learner progress, flashcard, speaking, Real Talk, and
  most other application tables.

Applied Real Talk migrations include private drafts, RLS gate/performance,
provenance, atomic write/fix, trusted ingestion, and index cleanup.

Active Edge Functions include one real reviewed-source function plus several
retired/locked Spec 001 test-session functions.

**Decisions:**

- Reuse the hosted project.
- Treat the database as low-data but not disposable.
- Align repo types and environment references.
- Remove or formally retire test-only Edge Functions after verification.
- Prefer a bounded Real Talk attempt schema rather than reviving all legacy
  progress/gamification dependencies.

## Existing Progress Schema Findings

- `user_lesson_progress` is XP/unit-oriented.
- `user_v2_lesson_progress` stores quiz totals and one task boolean but does not
  express progressive support, speaking confirmation, or transfer separately.
- `lesson_v2_evidence` stores JSON evidence and supports anonymous IDs, but its
  generic shape risks accepting unbounded payloads without a strict Real Talk
  contract.
- the Real Talk branch contains an unapplied `learning_attempts` migration that
  was explicitly left outside the hosted Spec 001 work.

**Decision:** Before DDL, test whether a strict wrapper over existing evidence
storage can meet the MVP contract. If not, add a small `real_talk_attempts` table
with bounded columns and no free text. Do not apply the old migration by default.

## Toolchain and Environment Findings

Main:

- Node 24/npm 11 pinned;
- old `gtts` chain removed;
- clean lockfile and `npm ci` workflow;
- `db:types` still references project `vhpfskkredizeazlyzsh`.

Real Talk branch:

- includes current AtoEnglish project reference `zpiwddskhduuykpxltun`;
- still carries the old `gtts` dependency chain and older install behavior;
- CI logs show deprecated `request`, `har-validator`, and `uuid@3` through gtts;
- checkout cleanup still observed an invalid `.gitlab-ci-local` gitlink on its
  non-main baseline.

**Decision:** Keep main toolchain/package baseline. Port only required Real Talk
dependencies and code. Fix the Supabase project/type reference explicitly.

## Vercel Findings

Connected project:

```text
project: atoenglish
id:      prj_2lnCWZp4PvBvuTBksDjMtPPruVqL
team:    team_1MZEcAVjG3nrOnklJxYIqGQs
runtime: Node 24 / Next.js
```

Recent intentional preview deployments are READY. The current project metadata
reported `live: false`; no current implementation was promoted to production.
A seven-day grouped runtime-error query returned no errors.

`vercel.json` only enables Git deployments for `preview/**`, which is appropriate
for controlled MVP acceptance.

**Decision:** Create exactly one intentional `preview/mvp-product-convergence`
deployment after technical gates. Production promotion remains a separate owner
action.

## Open PR Findings

The repo has multiple draft workstreams:

- #47 product direction reset;
- #48 curriculum contracts;
- #49 and #51 source candidate research;
- #50 two-lane content model;
- #52 authorized YouTube companion experiment;
- #53 natural communication environments;
- #54 private natural lesson compiler.

**Decision:** Treat PRs #47–#53 as research/contracts, not a stack to merge before
MVP. Extract only decisions and code required by this spec.

## MVP Scope Decision

### Must ship

- truthful landing;
- stable auth and account bootstrap;
- focused dashboard/navigation;
- one environment with three human-reviewed lessons;
- provider-neutral official playback;
- natural lesson runtime with transfer gate;
- bounded owner-private progress;
- privacy-safe funnel events;
- desktop/mobile preview and owner acceptance.

### Reuse but do not surface as product promises

- existing design system and layouts;
- Supabase Auth/RLS foundation;
- pilot event infrastructure;
- selected Real Talk compiler/provenance contracts;
- existing Sentry/Vercel observability;
- existing legacy routes during transition.

### Defer

- broad curriculum and five environments;
- delayed spaced repetition;
- XP/streak/league/achievements;
- flashcard, grammar, writing, broad speaking tools;
- challenge, certificate, business, notification systems;
- arbitrary source generation;
- full publication/reviewer UI;
- payments and social systems.

## Final Research Conclusion

The repository already contains enough infrastructure and verified technical work
to build an MVP. The blocker is convergence, not missing platform capability.
The safest and fastest path is to shrink the product surface, selectively port the
reviewed Real Talk core onto current main, publish a tiny human-reviewed corpus,
and prove one complete learner journey on the connected Vercel and Supabase
environments.
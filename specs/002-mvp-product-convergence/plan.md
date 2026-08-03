# Implementation Plan: AtoEnglish MVP Product Convergence

**Branch for this plan:** `spec/mvp-product-convergence`  
**Future implementation branch:** `integration/mvp-product-convergence` created from then-current `main`  
**Application deployment:** none in planning phase

## Technical Context

- Framework: Next.js 16.2.9 App Router, React 19.2, TypeScript 6
- Styling/UI: Tailwind CSS v4, Base UI, Framer Motion, existing AtoEnglish design system
- Database/Auth: hosted Supabase project `zpiwddskhduuykpxltun`, PostgreSQL 17, RLS
- Hosting: Vercel project `atoenglish`, Node 24
- Tests: Vitest, Playwright, content-standard checks, hosted Supabase integration checks
- Monitoring: Sentry, Vercel Analytics/Speed Insights; current Vercel seven-day runtime error query returned no grouped errors
- Current repository state:
  - `main`: `961e779886ff95b1b5f67d5e6997520d1facdb1a`
  - Real Talk branch: `e1642db1540046271f520f72f1b20a04e5d84f09`
  - comparison: diverged, Real Talk branch 420 commits ahead and 7 commits behind `main`
  - active Real Talk PR #54 targets a non-main baseline and MUST NOT be merged wholesale

## Constitution Check — Before Design

| Principle | Plan response |
| --- | --- |
| Natural Communication First | MVP surface is one reviewed natural environment, not the existing grammar/unit catalog. |
| Evidence-Bound Generation | Learner catalog excludes static samples and unreviewed AI drafts. |
| Transfer Before Completion | Transfer attempt is a hard completion gate. |
| Rights, Privacy, Safety | Reviewed source packages only; official playback; no raw audio/free text. |
| Small Testable Delivery | One environment, three reviewed lessons, one end-to-end loop. |
| Measurable Evidence | Technical, lesson, learner-funnel, and owner-acceptance evidence remain separate. |

**Gate result:** PASS for planning. Implementation remains blocked until the owner accepts this specification and the initial source-review capacity is confirmed.

## Repository Findings Driving the Plan

1. The production-shaped build exposes more than forty routes and 89 generated pages, while the product north star needs one focused learner loop.
2. The current landing page still promises a 28-day speaking journey, while the governing product truth is natural communication / Real Talk.
3. Login combines onboarding and authentication; the UI declares four survey questions but the current three-step path asks one and silently defaults the others.
4. Signup performs profile/progress inserts directly from the browser, creating duplicated email/OAuth bootstrap paths and partial-state risk.
5. The dashboard depends on legacy XP, streak, flashcards, speaking sessions, word-of-day, fifty-unit metadata, and multiple action calls; this is not required for MVP activation.
6. Navigation still exposes lessons, speaking, writing, progress, leaderboard, roadmap, business, challenge, and pronunciation as product surfaces.
7. The learner Real Talk catalog mixes database rows with static sample lessons. Static data includes transcript/speaker/pronunciation claims that did not pass the hosted review registry.
8. The Real Talk hub exposes arbitrary YouTube lesson generation to learners, while the approved compiler is owner-private and the current transcript adapter remains experimental.
9. Hosted Supabase has 26 public tables with RLS enabled; most application tables have zero rows. It has 3 Auth users, 16 pilot events, and no persisted learner progress or Real Talk catalog rows at audit time.
10. Hosted Real Talk migrations and reviewed-source infrastructure are applied, but the current video schema remains YouTube-specific even though the controlled approved source is Wikimedia/DVIDS.
11. `main` and the Real Talk branch do not share one dependency/type baseline. `main` removed the old `gtts` chain and pins Node/npm; the Real Talk branch still carries older package state. `main` also points `db:types` at a different Supabase project ID.
12. Vercel is connected and recent preview deployments are READY, but the project reports no active production deployment for the current work.

## MVP Architecture Decision

Preserve the modular monolith and reduce the learner shell.

```text
src/app/
├── page.tsx                         # truthful landing
├── login/                           # auth only; no fake personalization
└── (main)/
    ├── dashboard/                   # one next action + continue/review
    ├── real-talk/                   # reviewed catalog
    ├── real-talk/[lessonSlug]/      # environment runtime
    └── me/                          # account, logout, bounded history

src/features/mvp/
├── domain/                          # learner state and route decisions
├── server/                          # account bootstrap and dashboard query
└── components/                      # focused shell/empty/error states

src/features/real-talk/
├── domain/                          # reviewed lesson/playback/attempt contracts
├── server/                          # catalog, lesson, attempt repositories
├── client/                          # bounded browser progress state
└── components/                      # runtime phases
```

Legacy routes remain outside the primary shell. They are not rewritten during the
MVP unless a route can leak an unsupported promise or bypass the MVP access model.

## Integration Strategy

### Do not merge PR #54 wholesale

Create `integration/mvp-product-convergence` from current `main`. Produce a port
manifest with each Real Talk file classified as:

- **port unchanged** — contract/security code already independently verified;
- **port with adaptation** — useful behavior but tied to static samples, YouTube,
  old navigation, or private-preview assumptions;
- **reference only** — tests/evidence that guide a new implementation;
- **reject** — experimental, conflicting, stale, or outside MVP.

### Default port candidates

- `src/features/real-talk/domain/**`
- `src/features/real-talk/server/transcript-provenance.ts`
- `src/features/real-talk/server/transcript-source-policy.ts`
- `src/features/real-talk/server/transcript-sources/supabase-reviewed.ts`
- `src/features/real-talk/server/draft-mapping.ts`
- selected lesson runtime components and their tests
- reviewed-source Edge Function and versioned Real Talk migrations
- Spec 001 security, RLS, hosted, and browser evidence

### Default reject or isolate candidates

- learner-facing `/real-talk/create`
- `youtube-transcript` in production paths
- static `src/lib/data/real-talk/videos.ts` as catalog fallback
- static sample transcript, speaker, translation, pronunciation, and answer claims
- old package/lockfile state and `gtts` dependency chain
- broad mission, XP, streak, league, writing, notification, and curriculum changes
- unapplied `20260731162613_learning_attempts.sql` unless a new data-model review explicitly adopts it

## Data Strategy

1. Align repository generated types and environment documentation to the hosted project `zpiwddskhduuykpxltun`.
2. Add a provider-neutral playback/source migration rather than forcing Wikimedia or owned sources into `youtube_id`.
3. Keep reviewed source provenance in `real_talk_transcript_sources`.
4. Keep public lesson content in `real_talk_videos` and `real_talk_lessons`, with public eligibility enforced by database/query constraints.
5. Add a dedicated bounded attempt/progress record only if existing `user_v2_lesson_progress` and `lesson_v2_evidence` cannot meet transfer/support/privacy requirements cleanly.
6. Do not store raw speech, learner free text, names, or employers.
7. Create one controlled publication/seed operation for the initial reviewed corpus; full reviewer/publication UI is deferred.

## UI and Information Architecture

### Public

- Landing
- Login/signup
- Privacy/terms

### Authenticated primary shell

- **Học**: dashboard and reviewed lesson catalog
- **Ôn lại**: completed/in-progress lessons; no FSRS or mastery claim required
- **Tôi**: account, logout, minimal history/settings

### Hidden/deferred from MVP primary navigation

- `/learn` legacy unit catalog
- `/flashcards` legacy SRS
- `/grammar`
- `/speaking/*` broad tools
- `/writing/*`
- `/leaderboard`
- `/challenge`
- `/certificate/*`
- `/business`
- `/roadmap`
- `/pronunciation`
- notifications/push engagement surfaces

Routes may remain reachable to developers during convergence, but the preview
acceptance environment must expose one coherent product story.

## Delivery Phases

### Phase 0 — Governance and branch convergence

- approve MVP spec;
- freeze exact source SHAs;
- create integration branch from current `main`;
- create and review selective port manifest;
- align toolchain, lockfile, Supabase project reference, and CI.

### Phase 1 — Product shell

- replace landing promise and CTA;
- simplify auth and create server-side account bootstrap;
- protect dashboard/catalog/account routes;
- reduce primary navigation;
- replace dashboard with one next-action experience and honest empty/error states.

### Phase 2 — Reviewed content and publication boundary

- select one environment;
- human-review at least three source packages;
- generalize source playback fields;
- create authorized public catalog records;
- remove static sample fallback and learner-facing generation controls.

### Phase 3 — Learner runtime and persistence

- adapt reviewed lesson runtime to shared product layout;
- implement cold listen, progressive support, retrieval, speaking confirmation,
  transfer, and honest completion;
- persist bounded attempt/progress evidence with RLS and idempotency;
- surface continue/completed/review state on dashboard.

### Phase 4 — Pilot instrumentation and hardening

- reuse or narrow `pilot_events` for the MVP funnel;
- add loading, empty, offline/media, auth, and persistence failure behavior;
- run security/performance advisors;
- verify no legacy or editor-only route is presented as the MVP.

### Phase 5 — Preview, owner acceptance, and release decision

- exact-head technical gates;
- hosted two-user RLS checks;
- desktop/mobile full-journey Playwright;
- one Vercel preview and runtime-log inspection;
- human lesson review evidence;
- owner acceptance;
- only then prepare a main-targeted merge PR and separately authorize production deployment.

## Risk Register

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Whole-branch merge reintroduces removed dependencies and conflicts | High | Fresh integration branch plus exact port manifest. |
| Static samples leak unreviewed content | High | Database-only catalog; fail closed with empty state. |
| No human-reviewed three-lesson corpus | High | Content review is a release blocker, not post-launch cleanup. |
| YouTube-specific schema blocks safer public-domain sources | High | Provider-neutral playback migration before corpus seed. |
| Auth bootstrap creates partial rows | High | One server-side idempotent transaction/RPC. |
| Legacy dashboard/navigation confuses product test | High | MVP shell replaces primary paths; deferred features hidden. |
| Progress schema stores excessive learner content | High | Bounded evidence schema and privacy contract tests. |
| CI passes but preview product is incoherent | High | Full browser journey and owner acceptance required. |
| Vercel/Supabase envs point at different projects | High | Environment/type equivalence gate before preview. |
| MVP expands into curriculum/gamification rewrite | Medium | Explicit route and task allow-list; stop on scope escape. |

## Constitution Check — After Design

- Natural communication remains the learner surface: PASS.
- All learner content requires reviewed evidence: PASS.
- Transfer is required before completion: PASS.
- Privacy and source rights fail closed: PASS.
- Delivery is one independently testable vertical slice: PASS.
- Product evidence is not inferred from CI: PASS.

## Stop Conditions

Implementation stops and returns to planning when:

- fewer than three source packages can pass human review;
- the integration requires merging the Real Talk branch wholesale;
- a new service or broad schema rewrite is proposed without a measured blocker;
- playback or derivative rights are unresolved;
- a required learner quote or answer cannot be traced to reviewed source evidence;
- preview and hosted database cannot be made to use the same project/environment;
- the owner changes the target environment or MVP promise.
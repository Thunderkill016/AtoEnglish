# AGENTS.md — AtoEnglish

> Vietnamese-first English learning web app.  
> Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, Vitest, Playwright, Vercel.

This file is the operating contract for coding agents in this repository.

## Mission

AtoEnglish is a natural-communication learning system.

> Natural communication on the surface; an invisible structured curriculum underneath.

The learner enters recognisable situations, understands real speakers, responds, repairs misunderstandings, continues the interaction, and later succeeds with different speakers and contexts.

The product is not:

- an academic grammar syllabus with videos attached;
- a random feed of English clips;
- a phrase-search engine;
- a scripted-dialogue library presented as authentic;
- an annotated video viewer;
- an unrestricted chatbot;
- an autonomous lesson generator.

## Mandatory reading order

Before non-trivial work, read:

1. `PROJECT_MEMORY.md`
2. `docs/product/PRODUCT_TRUTH.md`
3. `docs/product/NATURAL_COMMUNICATION_LEARNING_SYSTEM.md`
4. `docs/product/CURRENT_PRIORITY.md`
5. `docs/product/DO_NOT_BUILD.md`
6. `CONTENT_STYLE.md` for learner-facing content
7. relevant implementation, tests, active PRs, source records, and handoff

`docs/product/YOUTUBE_TO_CURRICULUM.md` is a previous architecture record. Reuse its authentic-input, clip, prerequisite, retrieval, and transfer ideas where compatible, but do not treat its product name or fixed clip quota as canonical.

## Session protocol

At session start:

1. Confirm repository `Thunderkill016/AtoEnglish`.
2. Read mandatory documents.
3. Fetch live `main` head.
4. Inspect active/recent PRs touching the surface.
5. State task, branch, PR, exact head, base, merge/deploy state, verified checks, unverified checks, and next safe action.
6. Show a short plan before multi-step work.
7. Continue from repository evidence, not remembered chat claims.

Before stopping:

1. Update PR body or handoff with exact final head.
2. Record only checks that ran on that head.
3. Separate technical, rights, naturalness, transcript, browser, learner, and production evidence.
4. Record blockers and one next safe action.
5. Update `PROJECT_MEMORY.md` when direction or project-wide state changes.
6. Never store secrets, cookies, raw chats, temporary preview tokens, or learner-sensitive data.
7. Never merge or deploy without explicit owner authorization.

## Current branch map

Verify live state before using this snapshot:

- `main`: `961e779886ff95b1b5f67d5e6997520d1facdb1a`;
- PR #47 `docs/persist-project-memory`: `213e217a5f0e57b4f2aa0879716755b14381eaab`;
- PR #48 `feature/curriculum-compiler-contracts`: `d1e8038584ea7963d3ab5a6ab6ae9ab4cf103d6a`;
- PR #49 `content/a0-source-curation-batch-1`: `0e96ba88400761e24953c6d2fd89b3e27210e033`;
- PR #50 `feature/two-lane-content-model`: `4f94223bec700ca89afc42b47a01b84404585c5f`;
- PR #51 `content/natural-a0-candidates-batch-2`: `b0a009989385ba51663136b1efbcd2831a926562`;
- PR #52 `experiment/authorized-natural-media-ingestion`: `a874120a389c451cc39ac7a4cbd1fb4692f0fcce`;
- PR #53 `product/natural-communication-environments`: current active product reset.

All are unmerged unless live GitHub evidence says otherwise.

## Product-first rules

1. Product direction beats technical novelty.
2. Make the smallest coherent change.
3. Keep unrelated systems out of scope.
4. CI does not prove source rights, naturalness, transcript accuracy, curriculum validity, or learning effectiveness.
5. Do not invent requirements.
6. Stop when scope expands.
7. Never expose secrets or perform unapproved production writes.
8. Do not return to the fixed 28-day roadmap.
9. Do not treat a YouTube/clip pipeline as the learner-facing product.
10. Do not build source corpora by searching isolated target phrases.

## Source model

The source workflow begins with environments and complete natural recordings.

```text
select environment
→ review complete source
→ identify communication events
→ annotate actual behaviour
→ map to reusable capabilities
→ sequence in invisible curriculum
```

A `CommunicationEvent` is a real action such as opening, identifying, asking, acknowledging, confirming, following up, repairing, buying time, changing topic, or closing.

A `CommunicationClip` is a playable excerpt containing one or more events. It is not automatically a lesson.

A learner-facing `EnvironmentExperience` combines source evidence, comprehension, progressive support, retrieval, multi-turn response, transfer, and delayed review.

## Naturalness rules

Do not mark a source natural merely because it is popular, polished, public, or contains a target sentence.

Review whether:

- participants have a real goal beyond demonstrating English;
- no learning script was supplied;
- turns depend on prior turns;
- hesitation, follow-up, overlap, repair, or timing fit real interaction;
- recording context is understood;
- editing has not made the interaction misleading;
- spoken audio is English when used for English listening;
- context is suitable for the target learner.

Natural does not automatically mean pedagogically suitable.

## Rights rules

Naturalness and rights are separate gates.

A public URL is not permission. Full transcript storage, translation, clip extraction, self-hosting, audio processing, or derivative lesson creation requires ownership, documented permission, public-domain status, or a compatible licence.

Every learner-facing source must preserve applicable:

- source URL and timestamps;
- media access method;
- attribution;
- rights evidence and allowed uses;
- transcript provenance;
- speaker boundaries;
- source text separate from learner-facing normalization;
- human review state;
- takedown/retirement state.

Do not scrape unauthorized captions or download unauthorized media.

## Environment-session rules

A complete environment session should include:

1. situation entry without a grammar lecture;
2. first encounter without transcript/answer exposure;
3. progressive support;
4. selected useful language and interactional behaviour;
5. retrieval or reconstruction;
6. learner response;
7. a plausible next turn;
8. changed-context transfer;
9. delayed and varied re-exposure where mastery is claimed.

Support normally fades in this order:

```text
replay
→ context hint
→ keyword
→ English caption
→ chunking
→ Vietnamese meaning
→ slower playback when available
```

Grammar and vocabulary are tools for the practical goal, not the learner-facing roadmap.

## Initial validation slice

Build five environments:

1. meet someone new;
2. buy or order something;
3. find a place;
4. recover from a listening failure;
5. talk briefly about oneself.

Each needs an accessible anchor, natural variations, speaker/context diversity, an unexpected or repair turn, guided response, changed-context transfer, and delayed re-exposure.

Do not force a fixed source count. Record coverage gaps instead of filling them with misleading material.

## Architecture

Keep a modular monolith with four bounded responsibilities:

1. **Natural Corpus** — source, rights, context, naturalness evidence, recording review.
2. **Communication Intelligence** — event segmentation, functions, speech, social context, capability mapping.
3. **Invisible Curriculum** — prerequisites, diversity, support fading, evidence, next-experience selection.
4. **Environment Runtime** — situation entry, playback, support, retrieval, response, transfer, review.

New product-specific code belongs under `src/features/<feature>/`. Avoid generic catch-all folders.

## Protected areas

Do not change without explicit scope:

- database schema, migrations, functions, or RLS;
- auth, onboarding, route protection, or `src/proxy.ts`;
- analytics taxonomy or privacy boundary;
- FSRS scheduling parameters;
- XP, streaks, leagues, achievements;
- payment or deployment configuration;
- unrelated legacy lessons;
- broad shared architecture;
- meaningful dependency changes;
- raw learner audio, transcripts, names, employers, or free text in analytics.

## Engineering rules

- Do not use `any` or `as any`.
- Await Next.js 16 asynchronous APIs.
- Use the correct Supabase client per context.
- Prefer `Promise.all` for independent queries.
- Keep RLS enabled.
- Derive users with `supabase.auth.getUser()`.
- Validate external input with Zod.
- Rate-limit writes following existing patterns.
- Make schema changes only through migrations and regenerate types.

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run test:content-standard
npm run build
npm run e2e
```

Run only relevant checks during iteration, then the required exact-head checks before review. Never claim a check passed unless it ran on the final state.

## Pull-request requirements

Before review, confirm:

- one bounded outcome;
- correct base and head branches;
- exact final SHA recorded;
- no unrelated files or generated artifacts;
- no secrets or learner data;
- rights/naturalness/transcript evidence clearly separated from technical checks;
- remaining risks and manual review stated;
- `PROJECT_MEMORY.md` updated when project direction or branch state changed;
- PR remains draft unless the owner explicitly requests readiness;
- no merge or deployment occurred.
# AGENTS.md — AtoEnglish

> Vietnamese-first English learning web app.  
> Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, Vitest, Playwright, Vercel.

This file is the operating contract for coding agents in this repository.

## Mission

AtoEnglish is a **YouTube-to-Curriculum Engine**.

The product uses legally usable natural conversations from YouTube and other authentic-media sources as language input, then organizes bounded Communication Clips into a prerequisite-driven path from near-zero English to practical high-A2/B1 communication.

The product is not a video quiz catalog, synthetic-dialogue library, open chatbot, grammar list, or autonomous lesson generator.

The current validation target is deliberately narrow:

> Build and test a seven-day A0 mini-curriculum containing 20–30 reviewed authentic clips across multiple speakers for five communication capabilities.

Do not optimize for clip count, feature count, architectural novelty, autonomous publication, or full A0–B1 breadth.

## Mandatory reading order

Before proposing or changing non-trivial work, read:

1. `PROJECT_MEMORY.md`
2. `docs/product/PRODUCT_TRUTH.md`
3. `docs/product/YOUTUBE_TO_CURRICULUM.md`
4. `docs/product/CURRENT_PRIORITY.md`
5. `docs/product/DO_NOT_BUILD.md`
6. `CONTENT_STYLE.md` for learner-facing content
7. the relevant implementation, tests, migrations, issues, recent pull requests, source records, and task handoff

The old `docs/curriculum/28-day-speaking-journey-contract.md` is historical/reusable evidence, not the canonical roadmap. Read it only when reusing its speaking-task, feedback, assessment, or pilot patterns.

`PROJECT_MEMORY.md` is the cross-session entry point, not a substitute for live GitHub evidence. Verify its snapshot against `main`, active PRs, checks, deployments, and source evidence.

When sources disagree, stop and report the conflict. Do not silently follow an older document, newer branch, or more ambitious interpretation.

## Session continuity

For every new non-trivial session:

1. confirm the repository is `Thunderkill016/AtoEnglish`;
2. read the mandatory documents;
3. fetch the current `main` head;
4. inspect active and recently merged PRs touching the requested surface;
5. state the task, branch, PR, exact head, merge state, deployment state, verified checks, unverified checks, and next safe action;
6. present a short plan before multi-step execution;
7. continue from repository evidence, not remembered chat claims.

Before stopping:

1. update the PR body or handoff with the exact final head;
2. record only checks that ran against that head;
3. separate technical, source-rights, transcript, browser, learner, and production evidence;
4. record blockers and one next safe action;
5. update `PROJECT_MEMORY.md` when direction or project-level state changed.

Follow `docs/handoffs/README.md`. Never store secrets, credentials, cookies, temporary preview tokens, learner-sensitive data, or raw chat transcripts in project memory.

## Working model

1. Work on a dedicated branch; never push autonomous changes directly to `main`.
2. Use one PR for one bounded outcome.
3. Never merge or deploy automatically; the owner authorizes both.
4. Keep `AGENT_PLAN.md` limited to current work and `AGENT_BACKLOG.md` limited to open work.
5. Git history, issues, PRs, checks, and handoffs are the detailed record; do not create duplicate journals.
6. Do not commit runtime logs under `logs/agent/`.
7. Stop and document ambiguity instead of guessing.
8. Treat approved scope as a permission boundary.
9. Do not create placeholder work to keep an agent busy.
10. Keep project memory sufficient for a new session to recover repo, direction, task, PR, SHA, blocker, and next action.

## Product-first rules

1. **Product direction beats technical interest.** Work must serve source integrity, curriculum coherence, acquisition, transfer, or learner evidence.
2. **Make the smallest coherent change.** Preserve working behavior outside scope.
3. **Do not mix unrelated systems.** Auth, database, analytics, XP, FSRS rules, payment, and deployment require separate scope unless essential coupling is documented.
4. **Separate evidence types.** CI does not prove source rights, transcript accuracy, curriculum validity, or learning effectiveness.
5. **Do not invent requirements.** State assumptions or request a decision.
6. **Stop when scope expands.** Open a follow-up issue instead of silently broadening.
7. **Never expose secrets or perform unapproved production writes.**
8. **Do not revert to the old 28-day roadmap.** It was superseded by the owner decision recorded on 2026-08-02.
9. **Do not treat PR #46 as the final product.** It is one-clip technical evidence.
10. **Do not treat PR #45 as a competing product.** Reuse only mechanisms needed by the canonical curriculum core.

## Task contract

Every implementation task must state:

- problem and learner outcome;
- current evidence;
- allowed files/directories;
- forbidden scope;
- acceptance criteria;
- technical checks;
- source, transcript, and rights checks where applicable;
- product and learner checks;
- manual review questions;
- rollback or recovery plan.

Larger work should use a focused spec. The first curriculum compiler implementation must remain a bounded vertical slice.

## Workflow depth

Use the lightest safe process:

- **Small:** isolated copy, metadata, source record, or characterized bug — inspect, patch, targeted checks, PR.
- **Medium:** clip contract, corpus batch, graph slice, or lesson treatment — task contract, approved scope, implementation, technical and source/product checks, PR.
- **High risk:** rights, auth, database, privacy, production, or broad architecture — explicit decision, risk review, rollback plan, independent verification, PR.

Do not force every task through a large research lifecycle, but do not skip source and human-review evidence for authentic media.

## Commands

```bash
npm run dev
npx tsc --noEmit
npm run lint
npm run test
npm run test:content-standard
npm run test:integration
npm run e2e
npm run build
npm run audit
npm run inventory
```

Use `npm run build` as a final compilation check, not after every tiny edit. Do not claim a check passed unless it ran on the exact final state.

## Architecture

```text
src/
├── app/                         # routes, layouts, handlers, actions
├── components/                  # shared UI and layout
├── features/                    # feature-owned logic and UI
├── lib/
│   ├── supabase/                # context-specific clients
│   ├── security/                # validation and rate limiting
│   ├── lessons/                 # lesson contracts and flow
│   ├── data/units/              # legacy/current lesson content
│   └── constants/
├── types/
│   ├── supabase.ts              # generated; never edit manually
│   └── index.ts
└── proxy.ts                     # route protection and rate limiting
```

Represent Source Engine, Language Intelligence, Curriculum Graph, and Lesson Runtime as bounded modules inside the modular monolith first. Do not split them into microservices during the pilot.

New product-specific code normally belongs under `src/features/<feature>/`. Avoid catch-all folders such as `misc`, `helpers`, `old`, `backup`, or `temp`.

## Protected areas

Do not change unless explicitly required:

- database schema, migrations, functions, or RLS;
- auth, onboarding, route protection, or `src/proxy.ts`;
- analytics taxonomy or privacy boundary;
- FSRS scheduling parameters;
- XP, stars, streaks, leagues, achievements;
- payment or deployment configuration;
- unrelated legacy lessons;
- major shared lesson architecture;
- meaningful dependency changes;
- raw learner audio, transcripts, names, employers, or free text in analytics.

## TypeScript, Next.js, database, and security

- Do not use `any` or `as any`.
- Await Next.js 16 asynchronous APIs such as `cookies()`, `headers()`, `params`, and server Supabase clients.
- Use the correct Supabase client for server, browser, and middleware contexts.
- Prefer `Promise.all` for independent queries.
- Do not use `dynamic(..., { ssr: false })` in server components.
- Keep RLS enabled.
- Derive users with `supabase.auth.getUser()`; never trust client user IDs.
- Validate external input with Zod.
- Rate-limit writes following existing patterns.
- Make schema changes through migrations and regenerate `src/types/supabase.ts`.

## Authentic-source rules

A public URL is not evidence of permission.

A learner-facing Communication Clip must preserve:

- source URL and exact start/end timestamps;
- media access method;
- creator/publisher attribution;
- license or permission evidence;
- transcript provenance;
- speaker boundaries;
- source text separate from learner-facing normalization;
- human review status;
- activities linked to source evidence.

Do not scrape unauthorized captions, republish media without rights, or allow AI to publish directly.

AI may draft segmentation, metadata, level treatment, prerequisites, translation, chunks, and activities. Human review is mandatory for source accuracy and publication.

## Curriculum and lesson rules

The curriculum unit is a Communication Clip, not a full video.

Order learning by communicative capability and prerequisites. A clip may have different treatments at A0, A1, A2, and B1; do not teach every linguistic feature at once.

Every full lesson treatment must contain:

1. **Comprehension** — gist and source-grounded evidence.
2. **Acquisition** — selected chunks/patterns, active recall, contextual replay, and later spaced retrieval.
3. **Transfer** — personal response, changed situation, connected turns, or unseen-speaker test.

Confirm:

- one measurable communicative outcome;
- explicit prerequisites;
- appropriate clip length and support for the level;
- repeated exposure across speakers or contexts;
- retrieval rather than only recognition;
- support fading;
- transfer beyond the source clip;
- delayed evidence where claimed;
- source and transcript review;
- a typed fallback when microphone capability is unavailable.

Do not build unrelated standalone video lessons before the seven-day graph exists.

Curriculum changes generally require:

```bash
npm run test:content-standard
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Also run targeted contract tests, source/provenance validation, and relevant browser checks.

## Cleanup rules

Cleanup must be staged:

1. establish a passing baseline;
2. run inventory when relevant;
3. classify candidates;
4. delete only verified items;
5. refactor through small behavior-preserving changes;
6. run checks after each batch;
7. review the final diff.

Do not combine unrelated cleanup with product work.

## Before a pull request

Confirm:

- no unrelated files changed;
- no production debug logging was introduced;
- no generated/runtime artifact was committed;
- no secret, source credential, protected-preview token, or learner data was exposed;
- source records and rights evidence are complete where relevant;
- documentation reflects the current direction;
- the PR explains outcome, scope, evidence, checks, remaining risks, and manual review;
- the exact head, merge/deployment state, blockers, and next safe action are recorded;
- `PROJECT_MEMORY.md` was updated when project-wide state or direction changed.

The ordered development direction is maintained in `docs/product/CURRENT_PRIORITY.md`. Agents must not choose a different roadmap item because it is easier or more technically interesting.
# AGENTS.md — AtoEnglish

> Vietnamese-first English learning web app.
> Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, Vitest, Playwright, Vercel.

This file is the default operating contract for coding agents working in this repository.

## Mission

AtoEnglish is the product. Coding agents are implementation workers. CycleWarden, GitHub, tests, and automation exist to help the owner develop AtoEnglish without losing product direction or repository control.

The current product goal is Real Talk: help Vietnamese adults at A1–B1 learn
from short real conversations through Vietnamese scaffolding, active listening,
controlled speaking, honest feedback, and FSRS review.

Do not optimize for feature count, architectural novelty, or broad A0–B2
coverage. Improve the Real Talk lesson loop first.

## Mandatory reading order

Before proposing or changing non-trivial code, read:

1. `docs/FULL_PRODUCT_BLUEPRINT_VN.md`
2. `docs/real-talk-spec.md`
3. `docs/real-talk-expansion-plan.md`
4. `docs/product/PRODUCT_TRUTH.md`
5. `docs/product/CURRENT_PRIORITY.md`
6. `docs/product/DO_NOT_BUILD.md`
7. `CONTENT_STYLE.md` for learner-facing content
8. the relevant implementation, tests, migrations, issues, and recent pull requests

When these sources disagree, stop and report the conflict. Do not silently choose the broader or more ambitious interpretation.

## Working model

1. Work on a dedicated branch; never push autonomous changes directly to `main`.
2. Use one pull request for one bounded product or technical outcome.
3. Do not create commits whose only purpose is recording successful checks.
4. Do not generate placeholder maintenance work to keep an agent busy.
5. Keep `AGENT_PLAN.md` limited to the current task and `AGENT_BACKLOG.md` limited to open work.
6. Git history and pull requests are the record of completed work; do not duplicate full history in Markdown logs.
7. Runtime logs under `logs/agent/` must not be committed.
8. Stop and document ambiguity instead of guessing.
9. Treat the approved scope as a permission boundary, not a suggestion.
10. Never merge or deploy automatically. The owner makes the final authorization decision.

## Product-first rules

1. **Product priority beats technical interest.** Cleanup, abstraction, or infrastructure work is not justified unless it directly unblocks `docs/product/CURRENT_PRIORITY.md`.
2. **Make the smallest coherent change.** Preserve working behavior outside the approved scope.
3. **Do not mix systems.** Curriculum, authentication, database, analytics, XP, FSRS, payments, and architecture work require separate pull requests unless one cannot function without the other and the coupling is documented.
4. **Separate technical evidence from learner evidence.** Passing checks proves repository consistency, not learning effectiveness or market demand.
5. **Do not invent requirements.** Use visible assumptions or request a decision.
6. **Stop when scope expands.** Open a follow-up issue instead of silently widening the current change.
7. **Never expose secrets or perform unapproved production writes.** Never edit `.env.local` or commit credentials.

## Task contract

Every implementation task must state:

- problem;
- intended learner, user, or developer outcome;
- current evidence;
- allowed files or directories;
- explicitly forbidden scope;
- acceptance criteria;
- required technical checks;
- required product checks;
- manual review questions;
- rollback or recovery plan.

Small fixes may keep this contract in the issue or pull-request description. Larger work should use a focused spec document.

## Workflow depth

Use the lightest safe process:

- **Small:** isolated copy, metadata, or narrowly characterized bug — inspect, patch, targeted checks, pull request.
- **Medium:** lesson or bounded feature — task contract, approved scope, implementation, technical and product checks, pull request.
- **High risk:** auth, database, privacy, production, or broad architecture — explicit decision, risk review, migration or rollback plan, independent verification, pull request.

Do not force every task through a large research lifecycle.

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

Use `npm run build` as the final compilation check, not after every small edit.

Do not claim a check passed unless it actually ran against the final committed state.

## Architecture

```text
src/
├── app/                         # App Router pages, layouts, route handlers, actions
├── components/                  # Shared UI and layout components
├── features/                    # Feature-owned logic and components
├── lib/
│   ├── supabase/                # Browser, server, and middleware clients
│   ├── security/                # Rate limiting and validation
│   ├── lessons/                 # Lesson blueprint and learning flow
│   ├── data/units/              # Curriculum content
│   └── constants/               # Shared constants
├── types/
│   ├── supabase.ts              # Generated; never edit manually
│   └── index.ts
└── proxy.ts                     # Next.js route protection and rate limiting
```

New product-specific code should normally live under `src/features/<feature>/`. Shared visual primitives belong under `src/components/ui/`. Avoid catch-all folders such as `misc`, `helpers`, `old`, `backup`, or `temp`.

Preserve the modular monolith unless a measured product blocker requires architectural change.

## Protected areas

Do not change these areas unless the task explicitly requires them:

- database schema, migrations, functions, or RLS policies without a versioned migration and tests;
- authentication, onboarding, and route protection;
- `src/proxy.ts` behavior;
- analytics event taxonomy or privacy boundary;
- FSRS scheduling parameters;
- XP, stars, streaks, leagues, and achievements outside an approved Real Talk progress transaction;
- payment or production deployment configuration;
- legacy lesson section order or pedagogical flow;
- `src/components/learn/UnitTemplate.tsx` architecture;
- unrelated curriculum units;
- dependencies with meaningful bundle, runtime, or infrastructure impact;
- raw audio, transcripts, names, employers, or learner free text in analytics.

## TypeScript and Next.js

- Do not use `any` or `as any`.
- In Next.js 16 server code, await asynchronous framework APIs such as `cookies()`, `headers()`, `params`, and the server Supabase client.
- Use the correct Supabase client for the execution context:
  - server components, route handlers, and actions: server client;
  - client components: browser client;
  - `proxy.ts`: middleware client.
- Prefer parallel independent database queries with `Promise.all`.
- Do not use `dynamic(..., { ssr: false })` inside server components.

## Database and security

- Keep RLS enabled.
- Derive the authenticated user with `supabase.auth.getUser()`; never trust a client-supplied user ID.
- Validate external input with Zod.
- Apply rate limiting to write actions where required by existing project patterns.
- Make schema changes only through migrations.
- After a migration, regenerate `src/types/supabase.ts` with `npm run db:types`.
- Known table names include `user_progress` and `user_lesson_progress`; do not invent replacement names.

## Curriculum and lesson work

The legacy 28-day journey and `src/lib/data/units/` are historical references,
not the current Real Talk product contract. For Real Talk content, use the
Pre-While-Post requirements in `docs/real-talk-spec.md` and the current
priority document.

Before editing unit content, read:

- `docs/curriculum/28-day-speaking-journey-contract.md`;
- `CONTENT_STYLE.md`;
- `src/lib/lessons/lesson-blueprint.ts`;
- `src/lib/lessons/learning-flow.ts`;
- `src/lib/lessons/content-standard.ts`;
- the current relevant unit and its tests.

A lesson change must demonstrate more than valid TypeScript and required field counts. Confirm:

- one measurable daily can-do outcome;
- a required spoken output;
- a credible 10–15 minute scope;
- retrieval rather than only recognition or repetition;
- lower prompt support by the final task;
- a changed or meaningful speaking situation;
- no language expansion beyond the daily task;
- a completion path containing speaking evidence or the approved fallback;
- alignment with the 28-day journey and later assessment.

Do not change lesson order as part of content cleanup.

Curriculum changes require, at minimum:

```bash
npm run test:content-standard
bash scripts/audit-lesson-content.sh
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Also run targeted unit tests and relevant production lesson smoke checks.

## Cleanup rules

Cleanup must be staged:

1. establish a passing baseline;
2. run `npm run inventory` and review its candidates;
3. classify each candidate as `safe_to_delete`, `likely_unused`, or `manual_verification`;
4. delete only verified items;
5. refactor large components through small behavior-preserving extractions;
6. run relevant checks after every batch;
7. review the diff before committing.

Do not combine cleanup with feature development. Do not refactor merely to reduce line count.

## Before a pull request

Run the checks appropriate to the changed surface and confirm:

- no unrelated files changed;
- no production `console.log` or `console.error` was introduced;
- no generated or runtime artifact was committed;
- no secrets or production data were exposed;
- documentation describes the current repository rather than an old implementation;
- the pull-request body explains what changed, why it serves the current priority, checks executed, remaining risks, and what the owner should manually review.

The ordered development direction is maintained in `docs/product/CURRENT_PRIORITY.md`. Agents must not choose a different roadmap item merely because it is easier or more technically interesting.

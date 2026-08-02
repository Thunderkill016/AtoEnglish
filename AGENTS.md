# AGENTS.md — AtoEnglish

> Vietnamese-first natural communication learning web app.
> Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, Vitest, Playwright, Vercel.

This file is the operating contract for coding agents in this repository.

## Mission

AtoEnglish helps Vietnamese adults understand and respond inside natural English
communication environments. The learner-facing product is Real Talk; grammar,
vocabulary, capability prerequisites, and review scheduling are invisible
infrastructure.

Coding agents are implementation workers. They do not choose a new product
roadmap, broaden scope, merge, deploy, or convert uncertain evidence into
confident claims.

## Governing authority

Before any non-trivial work, read in this order:

1. `.specify/memory/constitution.md`
2. the active feature's `spec.md`
3. the active feature's `plan.md`
4. the active feature's `tasks.md`
5. the active feature's `research.md`, `data-model.md`, `contracts/`, and checklists
6. `specs/000-atoenglish-rebuild-roadmap/roadmap.md`
7. `docs/product/PRODUCT_TRUTH.md`
8. `docs/product/CURRENT_PRIORITY.md`
9. `docs/product/DO_NOT_BUILD.md`
10. relevant implementation, tests, migrations, issues, and pull requests

Authority order is the same as the list above. Older blueprints, legacy
curriculum documents, comments, and code are evidence, not permission to override
the constitution or active spec.

The only active implementation feature is currently:

```text
specs/001-private-natural-lesson-compiler/
```

When sources disagree, stop and update or clarify the governing artifact. Do not
silently choose the broader interpretation.

## Mandatory Spec Kit workflow

Every non-trivial feature must follow:

```text
constitution
→ specification
→ clarification/checklist
→ implementation plan
→ research and design
→ dependency-ordered tasks
→ cross-artifact analysis
→ implementation by user story
→ convergence and owner review
```

### Before coding

A feature must have:

- a directory under `specs/`;
- prioritized, independently testable user stories;
- functional requirements and measurable outcomes;
- a plan that passes the constitution check;
- exact-path tasks ordered by dependency;
- visible assumptions, open decisions, and out-of-scope boundaries.

Do not implement from an ad-hoc conversation alone. First map the request to an
existing task or update the feature artifacts.

### During coding

- Work only on tasks in the active feature.
- Keep checkboxes honest: code existence is not verification.
- Update the task ledger when scope or evidence changes.
- Stop when a task would enter another roadmap spec.
- Preserve independent user-story testability.
- Implement the smallest coherent vertical slice.
- Write product/security/data-critical tests before or alongside implementation;
  never hide missing test coverage behind type checks.

### Before declaring completion

Run cross-artifact analysis and convergence:

- every requirement maps to implementation and observed evidence;
- every success criterion has an evidence source and result;
- every required task is checked only after the evidence occurred;
- exact-head checks ran on the final commit;
- browser, database, external API, and human checks are not replaced by mocks;
- the pull request lists unresolved blockers honestly.

No agent may merge or deploy automatically.

## Working model

1. Use a dedicated branch; never push autonomous changes directly to `main`.
2. One pull request should deliver one bounded feature or user-story outcome.
3. Do not create commits solely to record a green check.
4. Do not invent maintenance work to keep an agent busy.
5. Git history and pull requests are the completed-work record.
6. Runtime logs and secrets are never committed.
7. Stop and document ambiguity rather than guessing.
8. Approved scope is a permission boundary.
9. Do not expose secrets or perform unapproved production writes.
10. The owner authorizes merge, migration, preview deployment, and production deployment.

## Product principles

### Natural communication first

Start from:

```text
situation
→ people and roles
→ practical goal
→ observed communication events
→ language support
→ learner response
→ changed-context transfer
```

Do not start from a grammar unit or hunt for clips containing a preselected
teaching phrase. Natural source annotation happens before capability mapping.
Missing coverage becomes a coverage gap, not an excuse to force an unsuitable
clip or fabricate dialogue.

### AI is draft assistance

AI-generated output is never source truth and never automatically public.
Learner-facing quotes, timestamps, answer keys, and examples require source
evidence. Speaker attribution, transcript accuracy, rights, source authenticity,
translation, safety, and pedagogy require human review.

### Transfer before completion

Watching, recognition, cloze, repetition, and immediate transcript match are not
sufficient. Core lessons require a changed-context production attempt with
reduced support.

### Honest learning claims

- Speak-and-confirm practice has no score.
- Browser STT similarity is sentence match, not pronunciation assessment.
- Acoustic pronunciation claims require a separately approved provider and spec.
- One lesson does not prove CEFR level, fluency, mastery, or retention.

## Active feature boundary

For spec 001, agents may work on:

- authenticated generation requests;
- transcript-source adapter contracts and policy;
- bounded interaction-window selection;
- Gemini structured output;
- Zod and source-evidence validation;
- owner-private draft persistence and RLS;
- draft warnings and review state;
- environment-first private preview;
- source-backed phrase production and changed-context transfer;
- tests and verification for those behaviors.

Agents must not build:

- human publication UI or automatic publication;
- broad scraping infrastructure;
- source media download or re-hosting;
- curriculum graph or recommendation engine;
- delayed transfer scheduling;
- XP, streak, league, payment, or social expansion;
- production migration or deployment.

Those belong to later specs or owner decisions.

## Task contract

Every implementation task must state or inherit from the active spec:

- problem and intended user outcome;
- evidence and assumptions;
- allowed files;
- forbidden scope;
- acceptance scenarios;
- technical and manual checks;
- rollback or recovery behavior.

Tasks in `tasks.md` must use exact paths and dependency order. If implementation
requires an unlisted file or behavior, update the plan/tasks before continuing.

## Architecture

Preserve the modular monolith.

```text
src/
├── app/                         # thin routes, layouts, handlers, actions
├── components/                  # shared UI and current feature UI
├── features/                    # feature-owned domain/server/client modules
├── lib/
│   ├── supabase/                # browser, server, middleware clients
│   ├── security/                # rate limits and shared validation
│   ├── lessons/                 # legacy/shared learning contracts
│   └── real-talk/               # transitional Real Talk domain logic
├── types/
│   ├── supabase.ts              # generated; never edit manually
│   ├── app-database.ts          # temporary typed extension when specified
│   └── real-talk.ts
└── proxy.ts
```

New Real Talk domain code should normally move toward:

```text
src/features/real-talk/
├── domain/
├── server/
├── client/
└── components/
```

Do not perform a broad folder migration inside a product feature. Extract only
when an active task identifies the boundary and tests preserve behavior.

New services, queues, microservices, generic workflow engines, or broad
abstractions require measured need and a simpler-alternative analysis in the
feature plan.

## TypeScript and Next.js

- Do not use `any` or `as any`.
- Validate external input with Zod.
- Await asynchronous Next.js APIs such as `cookies()`, `headers()`, `params`, and
  the server Supabase client.
- Use server clients in server components/actions, browser clients in client
  components, and middleware clients in `proxy.ts`.
- Prefer explicit discriminated result types over error strings alone.
- Keep provider responses and secrets server-side.
- Do not use `dynamic(..., { ssr: false })` in server components.

## Database and security

- Keep RLS enabled.
- Derive the user with `supabase.auth.getUser()`.
- Never trust client-supplied user IDs or publication state.
- Schema changes require versioned migrations.
- Do not apply hosted migrations without owner authorization.
- Regenerate `src/types/supabase.ts` after an authorized migration.
- Do not edit generated Supabase types manually.
- Make state-changing operations idempotent where retries are possible.
- A private draft owner must not be able to grant themselves approval/publication
  in spec 001.
- One user must not read, modify, or delete another user's private draft.

## Source, rights, and transcript boundary

- Use official source playback or direct source links.
- Do not download or re-host YouTube audio/video.
- Do not bypass access controls.
- A public URL or available caption is not automatically permission for storage
  or derivatives.
- Transcript acquisition must expose its mode and review status.
- Unofficial transcript mechanisms remain experimental until a production policy
  explicitly approves them.
- Never claim metadata review proves audio, transcript, speaker, rights, or
  pedagogical accuracy.

## Learner privacy

Do not store by default:

- raw microphone recordings;
- unrestricted learner transcripts;
- names or employers;
- learner free text in analytics;
- unnecessary source/media copies.

A future change to these boundaries requires a separate high-risk spec, retention
rules, consent design, and security review.

## Verification commands

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run test:content-standard
npm run test:integration
npm run e2e
npm run build
npm run audit
npm run inventory
```

Use the exact commands required by the active tasks and quickstart. Do not claim a
check passed unless it ran against the exact final committed state.

Mocks prove contract behavior only. They do not replace:

- RLS verification in a non-production Supabase project;
- live Gemini provider behavior;
- source playback in a browser;
- human source/transcript/pedagogy review;
- production build when required by convergence.

## Protected areas

Do not change unless the active spec and task explicitly require it:

- authentication, onboarding, and route protection;
- `src/proxy.ts`;
- unrelated database tables, functions, or RLS;
- analytics taxonomy and privacy boundaries;
- FSRS scheduling parameters;
- XP, streaks, leagues, achievements, payments, and subscriptions;
- legacy curriculum units and `UnitTemplate` architecture;
- dependencies with meaningful runtime or infrastructure impact;
- Vercel or production deployment configuration;
- unrelated cleanup or broad refactors.

## Pull request requirements

Every pull request must include:

- active spec path;
- exact base and head SHA;
- user stories and tasks delivered;
- tasks still incomplete;
- commands actually run and their results;
- database/provider/browser/manual checks actually performed;
- source, privacy, security, and learning risks;
- rollback or recovery note;
- explicit statement that merge/deploy did not occur automatically.

A green check is not permission to merge. A large diff is not evidence of product
progress. The owner reviews the result against the constitution, spec, and task
ledger.

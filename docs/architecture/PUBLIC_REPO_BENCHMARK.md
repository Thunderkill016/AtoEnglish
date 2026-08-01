# Public repository architecture benchmark

> Snapshot date: 2026-08-01
>
> This document records architecture patterns observed in public repositories and the decisions AtoEnglish takes from them. It is a reference log, not permission to copy source code. Re-check the referenced repository, commit history, license and current framework guidance before adopting implementation details.

## 1. Current AtoEnglish context

AtoEnglish is currently one deployable Next.js application with:

- Next.js App Router, React and TypeScript;
- Supabase Auth and Postgres access;
- Tailwind CSS and a local design system;
- Vitest and Playwright;
- Vercel deployment;
- one main product surface rather than multiple independently deployed apps.

The current learning implementation already contains useful domain boundaries:

- `src/lib/missions/*` contains mission specifications, evaluation and state transitions;
- `src/lib/lessons/*` contains lesson specifications and quality rules;
- `src/components/learn/*` contains learning UI;
- `src/app/actions/*` contains server actions and persistence orchestration;
- `supabase/migrations/*` contains database migrations.

The main structural problem is not the absence of folders. It is that boundaries are implicit:

- large client components combine browser capability detection, state machines, rendering and persistence calls;
- server actions combine transport validation, authentication, rate limiting, domain decisions, database writes, lesson completion and FSRS seeding;
- business modules live under generic `lib`, making it difficult to distinguish domain code from cross-cutting infrastructure;
- `app/actions` becomes a global bucket instead of belonging to a capability;
- tests are split between global test folders and colocated files without an explicit rule.

## 2. Public repositories reviewed

### 2.1 Vercel Chatbot

Repository: <https://github.com/vercel/chatbot>

Relevant paths:

- `app/(auth)/*`
- `app/(chat)/*`
- `app/(chat)/actions.ts`
- `lib/ai/*`
- `lib/db/*`
- `components/chat/*`
- `package.json`

Observed patterns:

1. It remains a single application rather than introducing a monorepo without a second product boundary.
2. Next.js route groups represent product surfaces such as authentication and chat.
3. Server actions are colocated with the route capability that owns them.
4. Database access is isolated in server-only query modules instead of being spread through UI components.
5. AI providers, prompts and tools are grouped under a technical capability boundary.
6. The package manager version is pinned.

AtoEnglish decision:

- keep a single application;
- keep route groups for navigation and layouts;
- move learning orchestration out of the global `app/actions` bucket;
- make persistence modules explicitly server-only;
- do not copy the Chatbot folder tree literally because learning has a richer domain model than chat CRUD.

### 2.2 Dub

Repository: <https://github.com/dubinc/dub>

Relevant paths:

- `pnpm-workspace.yaml`
- `turbo.json`
- `apps/*`
- `packages/*`
- `packages/ui`
- `packages/utils`

Observed patterns:

1. The monorepo has explicit deployable applications under `apps/*` and reusable packages under `packages/*`.
2. Packages represent real reuse and independent build boundaries, not merely categories of files.
3. Turbo defines task dependencies and build outputs centrally.
4. UI and utility packages can be built and published separately.

AtoEnglish decision:

- do not adopt a monorepo yet;
- use Dub as the threshold model: move to `apps/*` and `packages/*` only when AtoEnglish has a second deployable application, a separately consumed SDK/component library, or a worker/service requiring independent ownership and builds;
- avoid creating packages such as `packages/learning` merely to make the repository look scalable.

### 2.3 Documenso

Repository: <https://github.com/documenso/documenso>

Relevant paths:

- root `package.json` workspaces;
- `apps/*`;
- `packages/*`;
- the dedicated Prisma workspace;
- Docker-based development scripts;
- Turbo build and test scripts.

Observed patterns:

1. Database schema and database tooling are treated as an owned workspace.
2. The root package defines one reproducible developer workflow for dependencies, services, migrations and seeds.
3. Runtime applications and reusable packages are separate.
4. Node and package manager versions are declared explicitly.

AtoEnglish decision:

- keep Supabase migrations at the repository root while there is one app;
- add a single documented database workflow before considering a database package;
- pin Node and npm versions after repairing `package-lock.json`;
- treat migration verification and generated Supabase types as one controlled workflow.

### 2.4 Supabase

Repository: <https://github.com/supabase/supabase>

Relevant path: `pnpm-workspace.yaml`

Observed patterns:

1. The repository separates applications, packages, reusable blocks and end-to-end suites:
   - `apps/*`
   - `packages/*`
   - `blocks/*`
   - `e2e/*`
2. Shared dependency versions are managed through a catalog.
3. Install scripts are explicitly controlled.
4. Dependency freshness and supply-chain rules are encoded in workspace configuration.
5. E2E code is a first-class project boundary rather than being mixed with unit tests.

AtoEnglish decision:

- preserve `e2e/*` as a separate suite;
- pin dependencies and commit a valid lockfile;
- review install scripts and remove accidental dependencies before adding more tooling;
- adopt dependency catalogs only if AtoEnglish becomes a workspace; they add little value to a single package today.

### 2.5 BoxyHQ SaaS Starter Kit

Repository: <https://github.com/boxyhq/saas-starter-kit>

Relevant path: `package.json`

Observed patterns:

1. A single application can remain maintainable with explicit quality scripts.
2. Formatting, linting, type checking, unused-code detection, unit tests, E2E tests and production builds are distinct commands.
3. CI build behavior can differ from local developer convenience scripts.
4. `knip` is used to identify unused files, exports and dependencies.

AtoEnglish decision:

- retain separate commands for lint, type checking, unit tests, content quality and production build;
- add unused-code analysis only after the package lock is repaired;
- do not hide multiple quality gates inside the Vercel build command;
- keep GitHub verification and Vercel deployment as separate responsibilities.

## 3. Target architecture: modular monolith

AtoEnglish should evolve toward the following structure without a large one-shot move:

```text
src/
  app/
    (auth)/
    (main)/
    api/
    actions/                 # temporary compatibility wrappers only

  features/
    learning/
      domain/
        mission-spec.ts
        mission-engine.ts
        mission-evaluator.ts
        lesson-spec.ts
        lesson-quality.ts
      server/
        actions.ts
        learning-attempt.repository.ts
        supabase-learning-attempt.repository.ts
        checkpoint.service.ts
        transfer.service.ts
      ui/
        mission-runner/
          MissionRunner.tsx
          SpeechInputPanel.tsx
          MissionStageView.tsx
          useMissionSession.ts
        checkpoint/
        transfer/
      tests/
      index.ts

    review/
      domain/
      server/
      ui/
      tests/

    speech/
      domain/
      browser/
      server/
      ui/
      tests/

    progress/
      domain/
      server/
      ui/
      tests/

  components/
    design-system/           # reusable visual primitives only
    layout/                  # application shell components

  lib/
    supabase/                # framework/database clients
    security/                # rate limits and authorization helpers
    observability/           # logging, analytics and Sentry adapters
    env/                     # validated environment access
    utils/                   # genuinely cross-feature pure utilities

  __tests__/
    architecture/            # dependency-boundary checks
    curriculum/              # whole-catalog quality checks

e2e/
supabase/
  migrations/
```

This is a target map, not a requirement to create every folder immediately. Empty architecture is worse than a smaller clear codebase.

## 4. Dependency rules

The intended dependency direction is:

```text
app routes
  -> feature UI / feature server adapters
    -> feature application services
      -> feature domain

feature infrastructure
  -> external systems such as Supabase

shared components and lib
  -> must not import a feature
```

Enforce these rules:

1. `domain` must not import React, Next.js, browser APIs, Supabase clients or server actions.
2. `ui` may import domain types and feature actions but must not issue raw Supabase queries.
3. `server` authenticates requests, validates transport input and calls domain/application services.
4. Supabase table names and query shapes stay in repository/adaptor modules.
5. `src/app` composes routes, layouts, metadata and error boundaries. It should not contain the learning algorithm.
6. One feature must not reach into another feature's private files. Cross-feature access uses the feature's `index.ts` public surface.
7. Shared design-system components contain no lesson, mission or learner-progress rules.

## 5. Concrete migration from the current learning code

### Phase 0 — repository guardrails

Before moving architecture:

- repair `package-lock.json` so `npm ci` succeeds;
- pin the supported Node and npm versions;
- repair or remove the invalid `.gitlab-ci-local/builds/.docker` submodule metadata;
- preserve the GitHub Verify workflow and intentional `preview/**` Vercel deployment policy;
- add an architecture-boundary test before moving many files.

### Phase 1 — establish the learning feature

Move without changing behavior:

```text
src/lib/missions/*
  -> src/features/learning/domain/missions/*

src/lib/lessons/lesson-spec.ts
src/lib/lessons/lesson-quality.ts
src/lib/lessons/learning-attempt.ts
  -> src/features/learning/domain/*
```

Keep compatibility re-exports temporarily so route changes can be incremental.

### Phase 2 — split the large MissionRunner

`MissionRunner.tsx` currently owns browser speech support, speech input, session state, evaluation, persistence calls and all stage rendering.

Split by responsibility:

- `useMissionSession.ts` — client state and stage transitions;
- `useSpeechRecognition.ts` — browser capability adapter;
- `SpeechInputPanel.tsx` — input UI;
- `MissionStageView.tsx` — stage composition;
- stage-specific presentational components;
- `MissionRunner.tsx` — orchestration only.

The domain evaluator and engine remain framework-independent.

### Phase 3 — split server action transport from application logic

The current learning-attempt action combines:

- schema validation;
- IP extraction and rate limiting;
- authentication;
- Supabase inserts;
- checkpoint scoring;
- lesson completion;
- FSRS seeding.

Refactor into:

```text
server/actions.ts
  -> validate request, authenticate, call service, serialize result

server/checkpoint.service.ts
  -> checkpoint application workflow

server/learning-attempt.repository.ts
  -> repository interface

server/supabase-learning-attempt.repository.ts
  -> Supabase implementation

review/server/seed-review-targets.ts
  -> FSRS boundary
```

Do not turn server actions into a second domain layer. They are transport adapters.

### Phase 4 — organize tests

- colocate unit tests with the feature code they protect;
- keep whole-catalog curriculum and publication-gate tests under `src/__tests__/curriculum`;
- keep filesystem/migration contract tests in the Node Vitest project;
- keep browser component tests in the jsdom project;
- keep authenticated user journeys and microphone smoke tests under `e2e`.

### Phase 5 — reconsider monorepo only with evidence

Create a workspace only when at least one condition is true:

- a second application is deployed independently;
- a worker or service has a separate runtime and release cycle;
- a UI, SDK or domain library has a real consumer outside the web app;
- build times and ownership require independent package graphs.

Until then, a monorepo would increase configuration, dependency and CI complexity without solving AtoEnglish's current boundary problems.

## 6. Public-repository working policy

When using a public repository as a reference:

1. Record the repository, exact path and observation in this document or an ADR.
2. Prefer current official repositories and active production projects.
3. Read the implementation around a pattern; do not copy an isolated snippet without its assumptions.
4. Check the license before copying any code. Architecture ideas can be adapted, but source code remains subject to its license.
5. Pin the observed commit when a decision depends on exact behavior.
6. Verify the adapted implementation with AtoEnglish tests and production build.
7. Reject patterns that only make sense at the reference repository's scale.
8. Do not add a dependency merely because a reference repository uses it.
9. Explain in the PR what was learned, what was adapted and what was intentionally not copied.

## 7. Decisions

### Adopt now

- modular feature boundaries inside the existing application;
- thin App Router route files;
- server-only persistence adapters;
- feature-owned server actions;
- explicit public exports per feature;
- colocated feature tests plus global curriculum tests;
- pinned runtime/package-manager versions after lockfile repair;
- public-repo reference records in architecture documentation.

### Do not adopt now

- Turborepo or a workspace solely for folder organization;
- a shared package for every domain noun;
- database migrations executed automatically inside every preview build;
- direct copying of public repository code;
- raw Supabase queries in client components;
- a single global server-action folder as the long-term architecture;
- a large atomic file move mixed with behavior changes.

## 8. First implementation slice

The safest first refactor after Mission Engine v1 is released or isolated from the current PR:

1. create `src/features/learning/domain`;
2. move mission spec, engine and evaluator with compatibility re-exports;
3. add an architecture test proving domain code imports no Next.js, React or Supabase modules;
4. run GitHub Verify;
5. perform one intentional Vercel preview build;
6. only then split `MissionRunner` and the learning-attempt action in separate changes.

This sequence improves structure while preserving the verified learning behavior and keeps each pull request reviewable.

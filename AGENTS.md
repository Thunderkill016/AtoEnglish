# AGENTS.md — AtoEnglish

> Vietnamese-first English learning web app.
> Stack: Next.js 16, React 19, TypeScript, Tailwind CSS v4, Supabase, Vitest, Playwright, Vercel.

## Working model

1. Read this file before non-trivial work.
2. Work on a branch; do not push autonomous changes directly to `main`.
3. One task per branch and one logical concern per commit.
4. Do not create commits whose only purpose is recording that checks passed.
5. Do not generate placeholder maintenance tasks to keep an agent busy.
6. Keep `AGENT_PLAN.md` limited to the current task.
7. Keep `AGENT_BACKLOG.md` limited to open tasks.
8. Git history and pull requests are the record of completed work; do not duplicate full history in Markdown logs.
9. Runtime logs under `logs/agent/` must not be committed.
10. When uncertain whether a file is used, classify it for manual verification instead of deleting it.

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
```

Use `npm run build` as the final compilation check, not after every small edit.

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

New product-specific code should normally live under `src/features/<feature>/`. Shared visual primitives belong under `src/components/ui/`. Avoid new catch-all folders such as `misc`, `helpers`, `old`, `backup`, or `temp`.

## Protected areas

Ask before changing:

- Database schema, migrations, or RLS policies.
- Authentication and onboarding behavior.
- `src/proxy.ts` route-protection behavior.
- FSRS scheduling parameters.
- Lesson section order or pedagogical flow.
- Dependencies with meaningful bundle, runtime, or infrastructure impact.

Never edit secrets or `.env.local`.

## TypeScript and Next.js

- Do not use `any` or `as any`.
- In Next.js 16 server code, await asynchronous framework APIs such as `cookies()`, `headers()`, `params`, and the server Supabase client.
- Use the correct Supabase client for the execution context:
  - Server components, route handlers, and actions: server client.
  - Client components: browser client.
  - `proxy.ts`: middleware client.
- Prefer parallel independent database queries with `Promise.all`.
- Do not use `dynamic(..., { ssr: false })` inside server components.

## Database and security

- Keep RLS enabled.
- Derive the authenticated user with `supabase.auth.getUser()`; never trust a client-supplied user ID.
- Validate external input with Zod.
- Apply rate limiting to write actions where required by existing project patterns.
- After a migration, regenerate `src/types/supabase.ts` with `npm run db:types`.
- Known table names include `user_progress` and `user_lesson_progress`; do not invent replacement names.

## Curriculum

Before editing unit content, read:

- `CONTENT_STYLE.md`
- `src/lib/lessons/lesson-blueprint.ts`
- `src/lib/lessons/learning-flow.ts`
- `src/lib/lessons/content-standard.ts`
- the current golden unit example

Do not change lesson order as part of content cleanup.

## Cleanup rules

Cleanup must be staged:

1. Establish a passing baseline.
2. Inventory candidates.
3. Classify each candidate as `safe_to_delete`, `likely_unused`, or `manual_verification`.
4. Delete only verified items.
5. Refactor large components through small behavior-preserving extractions.
6. Run relevant checks after every batch.
7. Review the diff before committing.

Do not combine cleanup with feature development.

## Before a pull request

```bash
npx tsc --noEmit
npm run lint
npm run test
```

Run additional content, integration, E2E, or build checks when the touched area requires them.

Confirm:

- No unrelated files changed.
- No production `console.log` or `console.error` was introduced.
- No generated or runtime artifact was committed.
- Documentation describes the current repository rather than an old implementation.
- The pull request explains behavior impact and validation performed.

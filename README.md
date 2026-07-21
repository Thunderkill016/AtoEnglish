# AtoEnglish 🇻🇳→🇬🇧

> Học tiếng Anh và luyện phản xạ nói dành cho người Việt.

[![Live](https://img.shields.io/badge/live-atoenglish.vercel.app-emerald)](https://atoenglish.vercel.app)

AtoEnglish is a Vietnamese-first English-learning web application focused on structured lessons, speaking practice, pronunciation feedback, vocabulary review, and learning progress.

## Current stack

- Next.js 16 with App Router
- React 19 and TypeScript 6
- Tailwind CSS v4 and Framer Motion
- Supabase Auth and PostgreSQL
- FSRS scheduling through `ts-fsrs`
- Vitest and Playwright
- Sentry, Vercel Analytics, and Speed Insights
- Upstash Redis rate limiting

Exact versions are defined in `package.json` and `package-lock.json`.

## Main product areas

- CEFR-oriented roadmap from A0 foundation through B2
- 50 lesson units stored as TypeScript curriculum data
- vocabulary, grammar, dialogue, translation, shadowing, speaking, and quiz sections
- speaking practice with Vietnamese-specific feedback
- FSRS flashcard review
- XP, streak, progress, and league features
- guest progress through browser storage where supported
- Supabase-backed progress for authenticated users

## Quick start

```bash
git clone https://github.com/Thunderkill016/AtoEnglish.git
cd AtoEnglish
npm install
cp .env.example .env.local
npm run dev
```

The development server normally runs at `http://localhost:3000`.

## Environment

At minimum, local authenticated flows require:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Optional production integrations use variables for Upstash, Sentry, VAPID push notifications, Resend, and deployment tooling. Use `.env.example` and the relevant integration code as the source of truth. Never commit `.env.local` or secrets.

## Commands

```bash
npm run dev                    # development server
npx tsc --noEmit               # TypeScript validation
npm run lint                   # ESLint
npm run test                   # unit tests
npm run test:content-standard  # curriculum content gate
npm run test:integration       # Supabase integration tests; requires environment
npm run e2e                    # Playwright; requires environment and app runtime
npm run build                  # production compilation check
npm run audit                  # project-specific static checks
npm run inventory              # conservative cleanup inventory; no file deletion
npm run inventory -- --write   # write generated inventory report
```

Test totals are intentionally not written into this README because they change as the suite evolves. The test runner and CI output are the source of truth.

## Project structure

```text
src/
├── app/
│   ├── page.tsx
│   ├── login/
│   ├── auth/
│   ├── actions/
│   └── (main)/
│       ├── dashboard/
│       ├── learn/[unitSlug]/
│       ├── flashcards/
│       ├── speaking/
│       ├── progress/
│       └── roadmap/
├── components/
│   ├── landing/
│   ├── layout/
│   ├── learn/
│   └── ui/
├── features/
├── lib/
│   ├── data/units/
│   ├── lessons/
│   ├── security/
│   ├── srs/
│   └── supabase/
├── types/
└── proxy.ts
```

### Known architecture debt

`src/components/learn/UnitTemplate.tsx` is active and central to the lesson experience, but it currently owns too many responsibilities. It must be split gradually with behavior-preserving commits and passing lesson checks; it must not be rewritten or deleted in one change.

The cleanup inventory and evidence are documented in `reports/codebase-cleanup-inventory.md`.

## Curriculum source of truth

The active lesson route imports the A0–B2 unit data from `src/lib/data/units/` and registers it for `/learn/[unitSlug]`.

When editing curriculum data:

1. follow `CONTENT_STYLE.md`
2. preserve the lesson blueprint and learning-flow order
3. run `npm run test:content-standard`
4. run `bash scripts/audit-lesson-content.sh`

## Database source of truth

Do not maintain a partial table list in this README. The authoritative sources are:

- `supabase/migrations/`
- generated database types in `src/types/supabase.ts`
- server actions and queries under `src/app/actions/` and `src/lib/`

All schema changes must be made through migrations. Regenerate types with:

```bash
npm run db:types
```

Never disable RLS to work around an application bug.

## Cleanup policy

- Use a dedicated branch and reviewed pull request.
- Do not push automated cleanup directly to `main`.
- Do not create commits only to record successful checks.
- Do not remove a file or dependency from an import-only guess.
- Verify framework conventions, dynamic imports, scripts, config, migrations, and operational usage.
- Delete one candidate or one tightly related group per commit.
- Run typecheck, lint, tests, and the relevant smoke/E2E checks after each source cleanup.

## Deployment and CI

The repository contains local CI scripts, GitLab CI configuration, Vercel deployment checks, and Git push helper scripts. Deployment behavior depends on the configured repository remotes and environment. Treat these executable files as the source of truth rather than duplicating their implementation details here:

- `scripts/ci-local.sh`
- `.gitlab-ci.yml`
- `scripts/check-vercel-deploy.sh`
- `scripts/git-push.sh`

## License

Private project — © 2026 AtoEnglish
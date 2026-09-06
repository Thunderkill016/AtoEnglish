# AtoEnglish 🇻🇳→🇬🇧

> Học tiếng Anh và luyện phản xạ nói dành cho người Việt.

## Project status — reset in progress

AtoEnglish is undergoing a controlled project audit/reset before further product development.

- Current project identity: **AtoEnglish**.
- Nếp and other competing historical directions are **R&D/history, not the current roadmap**.
- Canonical current state: [`docs/project/PROJECT_STATE.md`](docs/project/PROJECT_STATE.md).
- Source-of-truth rules: [`docs/project/SOURCE_OF_TRUTH.md`](docs/project/SOURCE_OF_TRUTH.md).
- Reset audit: [`docs/project/RESET_AUDIT_2026-09-06.md`](docs/project/RESET_AUDIT_2026-09-06.md).
- Reusable historical work: [`docs/project/ARCHIVE_INDEX.md`](docs/project/ARCHIVE_INDEX.md).
- Reset tracking: GitHub issue #151.
- Release consistency: GitHub issue #152.

Do not infer that the live Vercel deployment matches current `main`; the reset found deployment/database/repository divergence that must be reconciled before the next release.

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

## Existing product areas

These describe the current codebase; they are not automatically the next roadmap:

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

`src/components/learn/UnitTemplate.tsx` is active and central to the lesson experience, but it currently owns too many responsibilities. Do not refactor it merely to reduce line count; a future change requires a current measured blocker and behavior-preserving verification.

The cleanup inventory and evidence are documented in `reports/codebase-cleanup-inventory.md`.

## Curriculum implementation source

The active lesson route imports A0–B2 unit data from `src/lib/data/units/` and registers it for `/learn/[unitSlug]`.

During project reset, existing curriculum data is implementation reality, not an approved future curriculum strategy. Historical product/curriculum contracts are indexed under `docs/project/ARCHIVE_INDEX.md`.

## Database implementation source

Repository schema sources are:

- `supabase/migrations/`
- generated database types in `src/types/supabase.ts`
- server actions and queries under `src/app/actions/` and `src/lib/`

For production-sensitive decisions, repository migrations must also be reconciled against the actual Supabase production migration/runtime state; see #152.

All schema changes must be made through migrations. Regenerate types with:

```bash
npm run db:types
```

Never disable RLS to work around an application bug.

## Cleanup policy

- Use a dedicated branch and reviewed pull request.
- Do not push automated cleanup directly to `main`.
- Do not combine cleanup with feature development.
- Preserve useful Git history and branches; archive stale work instead of destructive rewriting.
- Do not remove a file or dependency from an import-only guess.
- Verify framework conventions, dynamic imports, scripts, config, migrations, and operational usage.
- Run checks appropriate to the changed surface before review.

## Deployment and CI

`.github/workflows/verify.yml` is the current repository Verify workflow for PRs/pushes involving `main`.

The reset found that GitHub `main`, Supabase production migration/runtime state and Vercel production are not currently synchronized. No deployment should be promoted until #152 records an exact synchronized release state.

## License

Private project — © 2026 AtoEnglish
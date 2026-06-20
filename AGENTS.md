# AGENTS.md — AtoEnglish

This file provides context and instructions for AI coding agents (Antigravity, Cursor, Copilot, Gemini CLI, etc.) working on the **AtoEnglish** project — a Vietnamese-first English learning web app built with Next.js 16, Supabase, and TailwindCSS v4.

---

## 📌 Project Overview

- **Stack**: Next.js 16 (App Router, Turbopack), TypeScript 6, TailwindCSS v4, Supabase (Auth + PostgreSQL), Framer Motion, shadcn/ui
- **Deployment**: Vercel (auto-deploy from `main` branch via GitHub)
- **Auth**: Supabase Auth — Google OAuth + Email/Password
- **Database**: Supabase PostgreSQL with RLS policies
- **Package Manager**: npm
- **Testing**: Vitest (unit), Playwright (E2E)

---

## 🏗️ Project Architecture

```
src/
├── app/                     # Next.js App Router pages
│   ├── page.tsx             # Landing page (Server Component)
│   ├── login/page.tsx       # Auth + Onboarding quiz flow
│   ├── auth/callback/       # OAuth redirect handler
│   └── (main)/              # Protected routes (middleware-guarded)
│       ├── dashboard/       # Main dashboard (Server Component + DashboardClient)
│       ├── learn/           # Lesson learning flow
│       ├── flashcards/      # SRS flashcard review (ts-fsrs)
│       ├── speaking/        # Pronunciation practice (Web Speech API)
│       ├── progress/        # Progress tracking
│       └── roadmap/         # CEFR learning roadmap
├── components/
│   ├── landing/             # Landing page sections (Hero, FAQ, Preview, etc.)
│   ├── layout/              # Shared layout (Header, Footer)
│   └── ui/                  # Shared UI components (spotlight, etc.)
├── features/                # Domain feature modules
│   └── flashcards/          # FSRS scheduling logic
├── lib/                     # Utilities and Supabase helpers
│   └── supabase/            # Client, Server, Middleware Supabase clients
└── types/                   # TypeScript type definitions

e2e/                         # Playwright E2E tests
src/__tests__/               # Vitest unit tests
supabase/migrations/         # SQL migration files
```

---

## 🚀 Dev Environment

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:3000` (Turbopack) |
| `npm run build` | Production build — **only run to verify compilation** |
| `npm run lint` | ESLint check |
| `npm run test` | Run unit tests (Vitest) |
| `npm run test:watch` | Watch mode for unit tests |
| `npm run e2e` | Run Playwright E2E tests |

> ⚠️ **Do NOT run `npm run build` during iterative agent sessions.** Use `npm run dev` for all active development. Only run `npm run build` at the end to verify code compiles correctly before committing.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
UPSTASH_REDIS_REST_URL=       # Required for rate limiting in production
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SENTRY_DSN=       # Required for error monitoring in production
```

Never commit `.env.local`.

---

## 🎨 Code Style & Conventions

### TypeScript
- **TypeScript 6** with strict mode — avoid using `any`. Use proper types or ESLint disable comments only when absolutely necessary.
- All components should be typed with explicit props interfaces.

### React & Next.js 16
- **Prefer Server Components** (RSC) for data-fetching pages. Use `"use client"` only when hooks or browser APIs are required.
- **CRITICAL: `cookies()`, `headers()`, `params`, `searchParams` are ALL async in Next.js 15+:**
  ```ts
  // ✅ Correct — must await
  const cookieStore = await cookies();
  const supabase = await createClient(); // createClient() is async
  
  // ❌ Wrong — will throw TypeScript error
  const cookieStore = cookies();
  ```
- Data fetching on protected pages: use `Promise.all()` for parallel Supabase queries.
- **Do NOT use `ssr: false` in `dynamic()` inside Server Components** — not supported by Turbopack.

### Styling (TailwindCSS v4)
- Use **TailwindCSS v4** utility classes (CSS-first configuration).
- Custom theme tokens are in `globals.css` under `@theme {}` — NOT in `tailwind.config.ts`.
- Use `cn()` helper (from `lib/utils`) to merge class names conditionally.
- Glassmorphism tokens: `bg-white/5`, `backdrop-blur-xl`, `border border-white/10`.
- Color brand: `emerald-500` / `teal-500` as primary, `zinc-950` dark backgrounds.
- Animations: use **Framer Motion** for page transitions; CSS `@keyframes` in `globals.css @theme` for static animations.
- **Browser targets**: Chrome 111+, Safari 16.4+, Firefox 128+ (required by TailwindCSS v4).

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Pages: `page.tsx` (Next.js convention)
- E2E tests: `*.spec.ts` in `e2e/`
- Unit tests: `*.test.ts` in `src/__tests__/`

---

## 🗄️ Database (Supabase)

### Key Tables
| Table | Purpose |
|---|---|
| `user_progress` | CEFR level, XP, streak data per user |
| `units` | Lesson units with CEFR level and order |
| `lessons` | Lessons within each unit |
| `lesson_items` | Vocabulary/grammar items inside lessons |
| `completed_lessons` | Tracks which lessons a user finished |
| `card_reviews` | FSRS flashcard review scheduling data |
| `card_review_logs` | FSRS ReviewLog for per-user parameter optimization |

### Migrations
- Migration files are in `supabase/migrations/` with timestamp prefix `YYYYMMDDHHMMSS_name.sql`
- To apply to production: open Supabase Dashboard → SQL Editor → paste and run the migration file
- New migrations: create a new file with current timestamp prefix

### Supabase Client Selection
- **Server Components / Route Handlers / Server Actions**: use `await createClient()` from `@/lib/supabase/server` (async!)
- **Client Components**: use `createClient()` from `@/lib/supabase/client` (sync, browser client)
- **Middleware**: use `createMiddlewareClient()` from `@/lib/supabase/middleware`

### Row Level Security (RLS)
- All tables have RLS enabled. Users can only read/write their own data via `auth.uid() = user_id`.
- Never disable RLS or query without proper auth context.

---

## 🔐 Authentication Flow

1. Landing page → "Bắt đầu học ngay" → `/login?mode=signup`
2. `/login` runs a 5-step onboarding quiz (Steps 1-3: survey questions, Step 4: loader, Step 5: auth form)
3. Returning users hit `/login` directly or via `?mode=login` — skips survey to Step 5.
4. Google OAuth → Supabase → `/auth/callback` → saves CEFR level → `/dashboard`
5. Email/password sign-up → email confirmation → `/dashboard`
6. Middleware (`src/middleware.ts`) protects all `/(main)/*` routes — redirects unauthenticated users to `/login`.

---

## 🎯 Key Features & Locations

| Feature | Location |
|---|---|
| FSRS Flashcard scheduling | `src/features/flashcards/` + `ts-fsrs` library |
| Web Speech API speaking | `src/components/landing/ProductPreview.tsx` + `src/app/(main)/speaking/` |
| Interactive onboarding survey | `src/app/login/page.tsx` (Steps 1–5) |
| Dashboard RSC data fetching | `src/app/(main)/dashboard/page.tsx` |
| Hero spotlight animation | `src/components/ui/spotlight.tsx` |
| Circular XP progress ring | `src/app/(main)/dashboard/components/XpTracker.tsx` |
| Rate limiting | `src/lib/security/rate-limit.ts` (Upstash Redis in prod) |
| Error monitoring | Sentry — `sentry.*.config.ts` files |

---

## 🧪 Testing & Verification

### Unit Tests (Vitest)
```bash
npm run test          # run all unit tests
npm run test:watch    # watch mode
npm run test:coverage # coverage report
```
- Test files: `src/__tests__/*.test.ts`
- Current coverage: 46 tests across speech scoring, Zod validation, rate limiting, FSRS scheduling

### E2E Tests (Playwright)
```bash
npm run e2e      # run all E2E tests (requires running dev server)
npm run e2e:ui   # open Playwright UI mode
```
- Test files: `e2e/*.spec.ts`
- Tests: landing page, login flow, protected route redirects

### Common Issues to Watch
- `"use client"` directive missing on components using hooks → Next.js server error.
- Using `localStorage` in Server Components → will throw during SSR.
- Supabase queries returning `null` data → check RLS policies and user session.
- Missing `await` on `createClient()`, `cookies()`, `headers()` in Server Components → TypeScript error + runtime failure.
- `ssr: false` in `dynamic()` inside Server Components → Turbopack build error.

---

## 📦 Key Dependencies

| Package | Version | Usage |
|---|---|---|
| `next` | 16.x | App Router, RSC, Server Actions, Turbopack |
| `react` | 19.x | useActionState, useOptimistic, use() hook |
| `typescript` | 6.x | Strict mode, ES2022 target |
| `tailwindcss` | 4.x | CSS-first config via @theme in globals.css |
| `@supabase/ssr` | 0.12.x | Auth + DB with SSR support |
| `framer-motion` | 12.x | Animations and transitions |
| `ts-fsrs` | 5.4.x | FSRS v6.0 spaced repetition algorithm |
| `@upstash/ratelimit` | 2.x | Serverless-friendly rate limiting |
| `@sentry/nextjs` | 10.x | Error monitoring + performance |
| `lucide-react` | 1.x | Icon library |
| `tailwind-merge` + `clsx` | latest | Conditional className merging |
| `sonner` | 2.x | Toast notifications |
| `vitest` | 4.x | Unit test runner |
| `@playwright/test` | latest | E2E test runner |
| `zod` | 4.x | Form validation schemas |

---

## ✅ Before Committing

1. `npm run build` passes with **zero errors**.
2. `npm run test` — all 46 unit tests pass.
3. No `console.log` left in production code.
4. No hardcoded user IDs, API keys, or secrets.
5. All new Server Components use `await createClient()` (async).
6. Commit message format: `type(scope): description` (e.g., `feat(dashboard): add weekly XP chart`).

---

## 🌐 Deployment

- **Platform**: Vercel
- **Trigger**: Push to `main` branch auto-deploys.
- **Live URL**: `https://atoenglish.vercel.app`
- **Preview URLs**: Every PR gets a preview deployment.
- **CI**: GitHub Actions — lint → tsc → unit tests → build → E2E tests

To deploy: `git push origin main` — Vercel picks it up automatically.

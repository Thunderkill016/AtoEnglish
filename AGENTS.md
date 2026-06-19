# AGENTS.md — AtoEnglish

This file provides context and instructions for AI coding agents (Antigravity, Cursor, Copilot, Gemini CLI, etc.) working on the **AtoEnglish** project — a Vietnamese-first English learning web app built with Next.js 14, Supabase, and TailwindCSS.

---

## 📌 Project Overview

- **Stack**: Next.js 14 (App Router), TypeScript, TailwindCSS v3, Supabase (Auth + PostgreSQL), Framer Motion, shadcn/ui
- **Deployment**: Vercel (auto-deploy from `main` branch via GitHub)
- **Auth**: Supabase Auth — Google OAuth + Email/Password
- **Database**: Supabase PostgreSQL with RLS policies
- **Package Manager**: npm

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
```

---

## 🚀 Dev Environment

### Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server at `http://localhost:3000` |
| `npm run build` | Production build — **only run to verify compilation** |
| `npm run lint` | ESLint check |

> ⚠️ **Do NOT run `npm run build` during iterative agent sessions.** Use `npm run dev` for all active development. The production build switches `.next/` to production assets which breaks HMR. Only run `npm run build` at the end to verify code compiles correctly before committing.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

These are required for Supabase Auth and database queries. Never commit `.env.local`.

---

## 🎨 Code Style & Conventions

### TypeScript
- **Strict mode** is enabled — avoid using `any`. Use proper types or ESLint disable comments only when absolutely necessary (e.g., browser APIs like `SpeechRecognition`).
- All components should be typed with explicit props interfaces.

### React & Next.js
- **Prefer Server Components** (RSC) for data-fetching pages. Use `"use client"` only when hooks or browser APIs are required.
- Data fetching on protected pages: use `Promise.all()` for parallel Supabase queries in server components.
- Use `cookies()` from `next/headers` for server-side Supabase auth, **not** `createBrowserClient` in server context.

### Styling
- Use **TailwindCSS v3** utility classes.
- Use `cn()` helper (from `lib/utils`) to merge class names conditionally.
- Glassmorphism tokens: `bg-white/5`, `backdrop-blur-xl`, `border border-white/10`.
- Color brand: `emerald-500` / `teal-500` as primary, `zinc-950` dark backgrounds.
- Animations: use **Framer Motion** for page transitions and micro-interactions; use CSS `@keyframes` via `tailwind.config.ts` for static animations (spotlight, pulse, etc.).

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Pages: `page.tsx` (Next.js convention)

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

### Supabase Client Selection
- **Server Components / Route Handlers**: use `createServerClient()` from `@/lib/supabase/server`
- **Client Components**: use `createBrowserClient()` from `@/lib/supabase/client`
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

---

## 🧪 Testing & Verification

There are currently no automated tests. To verify changes:

1. Run `npm run dev` and test the affected pages manually in browser.
2. Before committing, run `npm run build` to ensure zero TypeScript or ESLint errors.
3. After push to `main`, Vercel automatically deploys — check deployment at `https://atoenglish.vercel.app`.

### Common Issues to Watch
- `"use client"` directive missing on components using hooks → Next.js server error.
- Using `localStorage` in Server Components → will throw during SSR.
- Supabase queries returning `null` data → check RLS policies and user session.
- Missing `await` on Supabase async calls → silent data fetch failures.

---

## 📦 Key Dependencies

| Package | Usage |
|---|---|
| `next@14` | App Router, RSC, Server Actions |
| `@supabase/ssr` | Auth + DB with SSR support |
| `framer-motion` | Animations and transitions |
| `ts-fsrs` | FSRS spaced repetition algorithm |
| `lucide-react` | Icon library |
| `tailwind-merge` + `clsx` | Conditional className merging |
| `sonner` | Toast notifications |
| `canvas-confetti` | Quest completion confetti |
| `zod` | Form validation schemas |

---

## ✅ Before Committing

1. `npm run build` passes with **zero errors**.
2. No `console.log` left in production code.
3. No hardcoded user IDs, API keys, or secrets.
4. All new Server Components use proper `createServerClient()`.
5. Commit message format: `type(scope): description` (e.g., `feat(dashboard): add weekly XP chart`).

---

## 🌐 Deployment

- **Platform**: Vercel
- **Trigger**: Push to `main` branch auto-deploys.
- **Live URL**: `https://atoenglish.vercel.app`
- **Preview URLs**: Every PR gets a preview deployment.

To deploy: `git push origin main` — Vercel picks it up automatically.

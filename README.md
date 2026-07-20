# AtoEnglish 🇻🇳→🇬🇧

> **Học tiếng Anh tốt nhất dành cho người Việt** — lộ trình A0→B1, giải thích tiếng Việt, luyện nói có kiểm soát.

[![Status](https://img.shields.io/badge/status-active-emerald)](/)
[![Live](https://img.shields.io/badge/live-atoenglish.vercel.app-emerald)](https://atoenglish.vercel.app)

AtoEnglish là web app học tiếng Anh hướng đến người Việt — tập trung vào **phản xạ nói**, **phát âm chuẩn** và **ghi nhớ từ vựng lâu dài** qua thuật toán SRS.

## ✨ Tính năng

| Tính năng | Mô tả |
|---|---|
| 🎯 **Lộ trình CEFR** | A1 → B2 theo chuẩn châu Âu, có roadmap trực quan |
| 🗣️ **Shadowing Practice** | Luyện phát âm theo giọng native với Web Speech API |
| 🤖 **AI Roleplay** | Hội thoại thực tế với AI (Context-aware scenarios) |
| 📓 **Daily Journal** | Viết nhật ký và nhận feedback phát âm |
| 🃏 **Flashcards SRS** | Ôn tập thông minh với thuật toán FSRS v6.0 |
| 🏆 **XP & Streak** | Gamification: kinh nghiệm, chuỗi học, thành tích |
| 🔔 **Push Notifications** | Nhắc nhở học hàng ngày qua Web Push (VAPID) |
| 📊 **Progress Dashboard** | Biểu đồ XP tuần, thống kê SRS, CEFR level |

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 6 (strict mode)
- **Styling**: TailwindCSS v4 + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **SRS Algorithm**: [ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) v6.0
- **Testing**: Vitest (unit) + Playwright (E2E)
- **Monitoring**: Sentry + Vercel Analytics + Speed Insights
- **Security**: Upstash Redis rate limiting, CSP headers, HSTS

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/Thunderkill016/AtoEnglish.git
cd AtoEnglish

# 2. Install
npm install

# 3. Setup env
cp .env.example .env.local
# → Fill in NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Run
npm run dev
# → http://localhost:3000
```

## 🔧 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon/public key |
| `UPSTASH_REDIS_REST_URL` | Production | Rate limiting (Upstash) |
| `UPSTASH_REDIS_REST_TOKEN` | Production | Rate limiting token |
| `NEXT_PUBLIC_SENTRY_DSN` | Production | Error monitoring |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Push notifications | VAPID public key |
| `VAPID_PRIVATE_KEY` | Push notifications | VAPID private key |
| `VAPID_SUBJECT` | Push notifications | `mailto:your@email.com` |

Generate VAPID keys: `npx web-push generate-vapid-keys`

## 🧪 Testing

```bash
npm run test          # Unit tests (Vitest) — 151 tests
npm run test:integration  # Supabase integration tests
npm run audio:generate -- unit-a0-1  # Generate native MP3 for a unit
npm run audio:generate:a0           # Regenerate all A0 foundation audio
npm run audio:generate:all          # Run a0+a1+a2+b1+b2 (all 50 units)
npm run audio:generate:list         # Dry-run: list all 50 unit folders (for verify)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report

npm run e2e           # E2E tests (Playwright)
npm run e2e:ui        # Playwright UI mode
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page (Server Component)
│   ├── login/page.tsx        # Auth + onboarding quiz (5 bước)
│   ├── auth/callback/        # OAuth redirect handler
│   └── (main)/               # Protected routes (middleware-guarded)
│       ├── dashboard/        # Dashboard với XP, streak, current unit
│       ├── learn/            # Học bài — 5 units (A1→B1)
│       ├── flashcards/       # SRS flashcard review (FSRS v6.0)
│       ├── speaking/         # Shadowing / AI Roleplay / Journal
│       ├── progress/         # Thống kê tuần, SRS heatmap
│       └── roadmap/          # CEFR roadmap trực quan
├── components/
│   ├── landing/              # Hero, Problem, Outcomes, FAQ, ProductPreview
│   ├── layout/               # Header, BottomNav, UserAvatar
│   └── learn/                # UnitTemplate (1600+ lines)
├── features/flashcards/      # FSRS scheduling logic
├── lib/
│   ├── supabase/             # Client, Server, Middleware clients
│   ├── security/             # Rate limiting, Zod validation
│   └── data/units/           # Lesson content (unit1-5.ts)
└── types/                    # TypeScript type definitions
```

## 🗄 Database Schema (Supabase)

| Table | Purpose |
|---|---|
| `user_progress` | CEFR level, XP, streak per user |
| `user_lesson_progress` | Completed units + XP earned |
| `cards` | SRS flashcard data (FSRS state) |
| `user_flashcard_progress` | Session stats, daily streak |
| `user_flashcard_progress` | Session history |

All tables use RLS with `auth.uid() = user_id` policy.

## 🚢 Deployment

Auto-deploy qua Vercel khi push lên `main`:

```bash
git push origin main  # → auto deploy to atoenglish.vercel.app
```

CI: **local** `ci-local.sh` + **GitLab** `.gitlab-ci.yml` + **Vercel** build

## 📄 License

Private project — © 2026 AtoEnglish

## 📁 Project layout

Long-form docs live under **`docs/`** (see [`docs/README.md`](./docs/README.md) and [`docs/STRUCTURE.md`](./docs/STRUCTURE.md)).

| Area | Path |
|------|------|
| Product v2 | `docs/product/` |
| Pedagogy / content style | `docs/pedagogy/` |
| UI (Ato Surface) | `docs/design/` |
| Agent queue | root `AGENT_*.md` + `AGENTS.md` |
| App code | `src/` · v2 lessons `src/lib/v2/` |

Root `CONTENT_STYLE.md` etc. are **stubs** pointing at `docs/…` (compat for old prompts).

# AGENTS.md — AtoEnglish

> Vietnamese-first English learning web app.
> **Product North Star (2026-07-10):** core outcome = **CEFR B1 Independent User** (“dùng được” tiếng Anh độc lập).  
> **Rebuild v2 (in progress):** full product + new LessonSpec path A0→B1 (`l-*` ids). Spec: [`docs/product/V2_PRODUCT.md`](./docs/product/V2_PRODUCT.md). Code: `src/lib/v2/`. Flag: `NEXT_PUBLIC_CURRICULUM_V2`. Pilot: `/learn/v2/l-a1-01`. v1 frozen: `archive/curriculum-v1/README.md`.  
> Pedagogy: [`docs/pedagogy/LESSON_SYSTEM_FOUNDATION.md`](./docs/pedagogy/LESSON_SYSTEM_FOUNDATION.md) · [`docs/pedagogy/CURRICULUM_PROGRAM.md`](./docs/pedagogy/CURRICULUM_PROGRAM.md) · style [`docs/pedagogy/CONTENT_STYLE.md`](./docs/pedagogy/CONTENT_STYLE.md) §6–7.  
> UI: [`docs/design/UI_SYSTEM.md`](./docs/design/UI_SYSTEM.md) (Ato Surface). **Folder map:** [`docs/STRUCTURE.md`](./docs/STRUCTURE.md) · docs index: [`docs/README.md`](./docs/README.md).  
> **Stack**: Next.js 16 · TypeScript 6 · TailwindCSS v4 · Supabase (Auth + PostgreSQL) · Framer Motion · ts-fsrs · Vercel

---

## 🧠 Memory System (Antigravity)

**ALWAYS** search memory before starting any non-trivial task:

```
search_memory("<topic>")          // before every task
store_memory(content, category, importance=8)  // after significant work
list_memories(category?)          // browse/find IDs
delete_memory(id)                 // remove stale memories
update_memory(id, content)        // fix + auto re-embed
```

Categories: `bug` · `decision` · `architecture` · `feature` · `rule` · `task` · `context`

---

## ⚡ Commands

```bash
npm run dev           # dev server :3000 (Turbopack)
npm run test          # unit tests (Vitest, 146 tests)
npm run test:integration  # Supabase integration tests
npm run test:coverage # coverage with thresholds (≥70% lines)
npm run lint          # ESLint
npx tsc --noEmit      # type check
npm run e2e           # Playwright E2E (needs dev server running)
npm run db:types      # regenerate src/types/supabase.ts from live DB
npm run check-deploy  # poll latest Vercel production deploy (needs VERCEL_TOKEN)
```

> ⛔ **Never** run `npm run build` during iterative sessions — use `npm run dev`.
> Run `npm run build` only at end of session to verify compilation.

### Vercel deploy author (CRITICAL)

Team Hobby blocks production when commit author is not a team member  
(`COMMIT_AUTHOR_REQUIRED` → `readyState: BLOCKED`, CLI often shows `UNKNOWN`).

| Allowed author email | Notes |
|---|---|
| `thunderkill016@gmail.com` | Vercel account / team OWNER |
| `66909862+Thunderkill016@users.noreply.github.com` | GitHub noreply |

**Never** commit as `thunder@atoenglish.com` (or any email not on the Vercel team).

```bash
# Correct for this repo
git config user.email thunderkill016@gmail.com
git config user.name Thunderkill016
# If HEAD used a bad email:
git commit --amend --reset-author --no-edit && git push --force-with-lease
```

⛔ Do **not** use `git -c user.email=thunder@atoenglish.com commit ...`  
`.husky/pre-push` rejects non-allowed author emails before push.

---

## 🏗️ Architecture

> Full map: [`docs/STRUCTURE.md`](./docs/STRUCTURE.md). Docs live under `docs/{product,pedagogy,design,specs}/` — root only keeps agent queue + stubs.

```
docs/                            # product · pedagogy · design · specs · archive
src/
├── app/
│   ├── page.tsx                 # Landing
│   ├── login/ · auth/callback/
│   └── (main)/                  # shell: home · path · learn · learn/v2 · speaking · …
├── components/
│   ├── design-system/           # Ato Surface (Screen, Surface, AppButton, …)
│   ├── layout/ · learn/ · landing/ · ui/
├── features/                    # flashcards, srs, streak, …
├── lib/
│   ├── v2/                      # LessonSpec, path, lessons/l-*, progress, flag
│   ├── data/units/              # v1 curriculum (frozen)
│   ├── lessons/                 # blueprint, content-standard, flow
│   ├── supabase/ · srs/ · security/ · ui/
├── __tests__/ · types/
└── proxy.ts                     # Next.js 16 auth + rate limit
```

**Auth flow**: Landing → `/login?mode=signup` → 5-step onboarding quiz → Supabase Auth → first unit `?mini=1` (returning users → `/dashboard`)

**Route protection**: `src/proxy.ts` exports `proxy()` (Next.js 16 convention, replaces `middleware.ts`)

---

## ✅ DO / ❌ DON'T

### TypeScript
```ts
// ✅ Use proper types
const sub = subscription as PushSubscription;
// ❌ Never use any
const sub = subscription as any;
```

### Next.js 16 — async APIs
```ts
// ✅ Always await in Server Components
const supabase = await createClient();        // @/lib/supabase/server
const cookieStore = await cookies();
const { params } = await props;              // Next.js 16: params is async

// ❌ Will throw at runtime
const supabase = createClient();
const cookieStore = cookies();
```

### Parallel DB queries
```ts
// ✅ Parallel — reduces latency
const [a, b] = await Promise.all([query1(), query2()]);

// ❌ Sequential — unnecessary waterfall
const a = await query1();
const b = await query2();
```

### Client selection
| Context | Import |
|---------|--------|
| Server Components / Route Handlers / Actions | `await createClient()` from `@/lib/supabase/server` |
| Client Components | `createClient()` from `@/lib/supabase/client` |
| Middleware (`proxy.ts`) | `createMiddlewareClient()` from `@/lib/supabase/middleware` |

### Styling (TailwindCSS v4)
```ts
// ✅ Custom tokens live in globals.css @theme {}
// ❌ Do NOT add custom tokens to tailwind.config.ts
```
- Brand: `emerald-500` / `teal-500` primary · `zinc-950` dark bg
- Glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10`
- Animations: Framer Motion for transitions · CSS `@keyframes` in `globals.css`
- `cn()` from `@/lib/utils` for conditional classNames

### Production code
```ts
// ✅ Silently handle errors — use UI state or return null
// ❌ Never leave console.* in production
console.log(...)   // forbidden
console.error(...) // forbidden
```

### Dynamic imports in Server Components
```ts
// ❌ Turbopack build error
const Comp = dynamic(() => import('./Comp'), { ssr: false });
// ✅ OK in Client Components only
```

---

## 🗄️ Database

**Tables**:
| Table | Purpose |
|-------|---------|
| `user_progress` | CEFR level, XP, streak, last_active_date |
| `units` | Lesson units (CEFR level, order) |
| `lessons` | Lessons within units |
| `lesson_items` | Vocabulary/grammar inside lessons |
| `user_lesson_progress` | Completed units per user (**not** `completed_lessons`) |
| `card_reviews` | FSRS flashcard scheduling |
| `card_review_logs` | FSRS ReviewLog for per-user optimization |
| `push_subscriptions` | Web Push subscription objects |
| `project_memories` | Agent memory (pgvector 384 dims) |

**Critical rules**:
- ✅ RLS enabled on ALL tables — never disable
- ✅ Always get user ID from `supabase.auth.getUser()` — never trust client input
- ✅ Run `npm run db:types` after every migration to keep `supabase.ts` in sync
- ✅ Migration files: `supabase/migrations/YYYYMMDDHHMMSS_name.sql`
- ❌ Never query without auth context — RLS will return empty rows silently

**Known correct table names** (common mistake source):
- `user_lesson_progress` (NOT `completed_lessons`)
- `user_progress` (has `current_level text`, NOT an enum)

---

## 🔐 Security

- Rate limiting via `createRateLimiter()` from `@/lib/security/rate-limit.ts` on ALL write Server Actions
- Input validation via Zod schemas in `@/lib/security/validation.ts`
- CSP, HSTS, X-Frame-Options, COOP headers in `next.config.mjs`
- Auth rate limit: 30 req/min on `/login` and `/auth/*` (in `proxy.ts`)

---

## 📘 Bài học — Blueprint (nội dung = cách học)

> **SSOT tổng hợp (đọc trước khi đổi pedagogy/content):**  
> [`docs/pedagogy/LESSON_SYSTEM_FOUNDATION.md`](./docs/pedagogy/LESSON_SYSTEM_FOUNDATION.md) — khoa học học + IPOR + gates.

Mọi unit phải dùng **cùng một khung** cho cách viết nội dung và cách người học trải nghiệm:

| File | Vai trò |
|------|---------|
| `docs/pedagogy/LESSON_SYSTEM_FOUNDATION.md` | Nền tảng world-class (SLA + map code) |
| `docs/pedagogy/CONTENT_STYLE.md` | Style + §6–7 blueprint / SDL |
| `src/lib/lessons/lesson-blueprint.ts` | Map field → section → IPOR phase |
| `src/lib/data/units/unit1.ts` | **Mẫu vàng** v1 — comment block + cấu trúc field |
| `src/lib/v2/lessons/` | **v2** LessonSpec content (`l-*`) |
| `src/lib/lessons/learning-flow.ts` | Thứ tự 10 section v1 |
| `src/lib/lessons/content-standard.ts` | Chuẩn số lượng SDL |
| `src/lib/lessons/lesson-center-reference.ts` | ESA/CELTA/CEFR/Nation/CLT VN |

```bash
npx tsx scripts/print-lesson-blueprint.mjs   # checklist cho agent
npm run test:content-standard                # gate nội dung
bash scripts/audit-lesson-content.sh         # audit toàn curriculum
```

Khi sửa `unit*.ts`: đọc `docs/pedagogy/CONTENT_STYLE.md` §6–7, bám `unit1.ts`, không đổi thứ tự học trong `learning-flow.ts` trừ khi có task riêng.  
Khi sửa v2: `docs/product/V2_PRODUCT.md` + Zod `src/lib/v2/lesson-spec.ts`.

---

## 🧪 Testing

**Unit tests** (`src/__tests__/`):
```bash
npm run test             # 64 tests, must all pass
npm run test:coverage    # coverage ≥70% lines/statements, ≥60% branches, ≥55% functions
```

**Test files**: `auth-check.test.ts` · `rate-limit.test.ts` · `speech.test.ts` · `fsrs.test.ts` · `validation.test.ts`

**E2E tests** (`e2e/`): `landing.spec.ts` · `login.spec.ts` · `protected-routes.spec.ts` · `mobile.spec.ts`

**Untestable by design** (require live DB/runtime → covered by E2E):
- Server Components, Supabase clients, Server Actions, React components

---

## 🚫 Boundaries — Must Ask Before

- Schema changes (adding/dropping columns, changing RLS policies)
- Changing auth flow or onboarding quiz steps
- Modifying `proxy.ts` middleware routing logic
- Changing FSRS scheduling algorithm parameters
- Adding new npm dependencies with significant bundle impact

---

## ✅ Before Every Commit

```bash
npx tsc --noEmit         # zero errors
npm run lint             # zero warnings
npm run test             # all 64 tests pass
# (npm run build at end of session only)
```

**Checklist**:
- [ ] No `console.*` anywhere in `src/`
- [ ] No `as any` — use proper types or `as SpecificType`
- [ ] All new Server Components use `await createClient()`
- [ ] New write Server Actions have rate limiting
- [ ] New migrations have corresponding `npm run db:types` run
- [ ] Commit format: `type(scope): description`
  - Types: `feat` · `fix` · `perf` · `test` · `docs` · `ci` · `chore` · `refactor`

---

## 🌐 Key Info

| Item | Value |
|------|-------|
| Live URL | `https://atoenglish.vercel.app` |
| Supabase project | `vhpfskkredizeazlyzsh` |
| Deploy | Model A: push GitLab → Vercel (connect GitLab). Tạm: GitHub cho đến khi `GITLAB_TOKEN` |
| CI | Local `ci-local.sh` · GitLab `.gitlab-ci.yml` (self-hosted runner) |
| Git | Model A: `git-push.sh` → GitLab · `migrate-model-a.sh` |
| Node | 20.x (CI) · 24.x (local) |

# AtoEnglish — Minimal Redesign V2 (Toàn bộ)

> **Mandate:** 2026-06-26 — Thiết kế lại toàn bộ app theo nguyên tắc tối giản research-backed.
> **Thay thế:** UI-001..007 (P0–P6) = spine only (~15% routes). V2 = 100% surfaces.

---

## 1. Kiến thức nền (research-backed)

### Nguyên tắc cốt lõi

| Luật / Khái niệm | Áp dụng AtoEnglish |
|-------------------|-------------------|
| **Hick's Law** | Mỗi màn hình ≤1 primary action; nav chính 3 tab; feature phụ trong grouped list |
| **Choice overload** | Bỏ widget pile, gradient cards, multi-tab trên cùng page |
| **Cognitive load (Sweller)** | Một visual language; typography hierarchy thay màu/emoji; chunk lesson theo IPOR (đã có) |
| **Fitts's Law** | Touch target 44px (`--minimal-touch`); CTA full-width mobile |
| **Doherty threshold** | Transition ≤200ms; skeleton thay spinner lớn; lesson resume instant |
| **Progressive disclosure** | Tab "Tôi" = grouped settings; Speaking/Quiz/Writing = sub-pages, không dashboard widgets |
| **Jakob's Law** | List row (iOS Settings) + large title (Apple) — user VN quen Zalo/iOS |
| **Aesthetic-usability** | Ít chrome → cảm giác "dễ dùng" hơn dù feature không đổi |

### Metric sản phẩm (giữ từ V1)

- **time-to-lesson:** ≤2 tap, ≤10s tới Khởi động (`e2e/time-to-lesson.spec.ts`)
- **Không đổi:** `SECTION_ORDER`, IPOR pedagogy, FSRS logic, unit data schema

### Anti-patterns cần loại bỏ

- Hai app trong một (light `#f5f5f7` dashboard vs dark `zinc-950` lesson)
- Nav 3 lớp (bottom tab + header "Thêm" 7 links + hamburger 12 links)
- Gradient CTA + glass card + `bg-grid-pattern` + Framer trên mọi page
- Inline `style={{}}` (RoadmapClient)
- Dead CTAs (HeroCTA `#how-it-works` đã xóa)
- Orphan code (DashboardClient, landing sections, LessonPhaseBar)

---

## 2. Hiện trạng (audit 2026-06-27, cập nhật sau V2 queue + 097/098)

| Rating | Routes | Ước tính |
|--------|--------|----------|
| **Minimal** | `/`, `/dashboard`, `/me`, `/roadmap`, `/invite`, `/checkpoint`, placement pick, login, placement-test, pronunciation, certificate, terms/privacy, flashcards, settings, progress, learn, speaking entry+subs, grammar, leaderboard, business, quiz, writing, challenge | ~80%+ |
| **Mixed** | weekly progress report, some progress bars (style % ok) | ~15% |
| **Legacy dark canvas** | lesson shell (UnitTemplate/LessonShell zinc-950 canvas kept for reading focus; all internal cards/sections use light bg-card + tokens post 083/084/097) | ~5% |

**V1 shipped (P0–P6):** UI-001..007 — spine daily path, design-system primitives cơ bản.

**V2 shipped (`57bb163`, `30b71f7`, `bac3f15` + autopilot 081-098):**
- PR-01: 7 primitives + token extension + dead code purge
- PR-02: `/me` hub, 3-tab nav, header minimal, light `UnitTemplate`
- PR-04..14 batch: Fluency/Translate kit, login 3-step, Roadmap rewrite, SecondaryPageShell (invite/checkpoint/placement pick/certificate lock), bg-glass → card (flashcards/speaking), xóa `mobile-nav`
- TASK-081: PlacementTestClient — 0 inline style (Screen + Tailwind + MinimalButton)
- TASK-082: PronunciationClient — 0 inline style (Secondary + cards + DIFF tokens)
- TASK-083/084/097: Lesson sections (Grammar/Vocab/Warmup/Dialogue/Practice/Speaking/Shadowing/Quiz) + LessonSectionHeader + LessonCard — light tokens (bg-card border-border/60 text-foreground/muted, no zinc-950 cards, no CTA grads); LessonSectionHeader match
- TASK-085/098: Login — MinimalButton (no grad CTA), desktop marketing panel purged (mobile-first single-col)
- TASK-086: Certificate eligible — SecondaryPageShell + MinimalButton flat
- TASK-087: Legal (terms/privacy) — Screen + Prose
- TASK-088: Legacy CSS purge — 0 bg-glass / bg-grid-pattern / border-glass in src
- TASK-089: Speaking — 4-tab removed; PrimaryRow entry + 4 sub-routes (shadowing/roleplay/journal/phoneme)
- TASK-090: E2E regression post-V2 run + minimal fix (viewport); smoke:learn pass

**Ghi chú thực tế post-V2:**
- Lesson canvas vẫn dùng zinc-950 (UnitTemplate/LessonShell) cho contrast đọc; card internals đã light (không đảo thành 2-app visual).
- ~30 `style={{}}` còn lại: flip 3D (perspective/rotateY/backface — cần cho animation), progress bar widths (%), motion values, safe-area, 1-off (borderLeft) — không phải bloat inline UI như placement 63/pronun 63 ban đầu.
- 1 text gradient accent còn ở login (logo "AtoEnglish") — minimal, không CTA.
- 3-tab + /me hub ổn định; time-to-lesson E2E chạy clean sau V2 (TASK-090).

---

## 3. Design system V2

### 3.1 Tokens (mở rộng `globals.css`)

```css
/* Thêm vào minimal-* */
--minimal-primary: /* emerald flat, no gradient */
--minimal-surface: /* card bg */
--minimal-separator: /* 1px borders */
--minimal-radius: 12px;
--minimal-space-1..6: /* 4/8/12/16/24/32 */
--minimal-elevation: none | sm; /* no heavy shadows */
```

**Quy tắc:** Mọi page dùng `--minimal-canvas` (light) hoặc dark mode tương ứng — **không** zinc-950 lesson island.

### 3.2 Primitives mới (`src/components/design-system/`)

| Component | Mục đích |
|-----------|----------|
| `MinimalButton` | primary / secondary / ghost — 1 style CTA toàn app |
| `ListSection` | grouped list header (như iOS Settings) |
| `StatLine` | 1 dòng stat (thay gradient card grid) |
| `EmptyState` | icon + 1 line + 1 CTA |
| `TabSegment` | max 3 segments (không 4-tab speaking) |
| `SheetHeader` | lesson/feature sub-flow |
| `Prose` | terms, privacy, grammar explain |

### 3.3 Composition patterns

1. **Screen** → **LargeTitle** → **primary CTA (0–1)** → **ListSection** → **PrimaryRow[]**
2. **Lesson:** **SheetHeader** (back + title + ThinProgress) → section content → **MinimalButton** continue
3. **Không:** hero gradient, stat grid 5 cột, confetti intro (trừ completion moment duy nhất)

---

## 4. Information Architecture V2

### 4.1 Bottom nav (giữ 3 tab)

| Tab | Route | Nội dung |
|-----|-------|----------|
| **Học** | `/dashboard` | ContinueCard only + streak |
| **Ôn** | `/flashcards` | SRS due cards |
| **Tôi** | `/me` | **NEW hub** — grouped PrimaryRow (thay `/settings` only) |

### 4.2 Tab "Tôi" (`/me`) — single secondary hub

```
Tiến độ          → /progress
Lộ trình         → /roadmap
Bài học (50)     → /learn
Luyện nói        → /speaking
Viết             → /writing
Quiz             → /quiz
Bảng xếp hạng    → /leaderboard
Business         → /business
Ngữ pháp         → /grammar
Phát âm          → /pronunciation
─────────────
Cài đặt          → /settings
```

**Xóa:** desktop "Thêm" dropdown + mobile hamburger 12 links → redirect `/me`.

### 4.3 Header shell

- Logo + theme toggle only (logged in)
- **Không** glass card, **không** notification bell trên header (move vào settings nếu cần)

---

## 5. Phase implementation

### Phase A — Foundation (1 PR)
- Extend tokens + 7 primitives
- `MinimalButton` thay gradient CTAs
- Delete dead code: `DashboardClient`, `LessonPhaseBar`, orphan landing sections
- Fix `HeroCTA` dead anchor

### Phase B — Shell & IA (1 PR)
- `/me` hub page
- Collapse `mobile-nav` + `desktopMoreItems` into `/me`
- `header-shell` minimal
- Redirect `/settings` → still works, linked from `/me`

### Phase C — Lesson unification (2 PR)
- PR-C1: `UnitTemplate` → light minimal canvas; `LessonContinueButton` → `MinimalButton`
- PR-C2: Fluency + Translate → lesson-ui kit; wire `LessonShell`
- Fix `lesson-page-hider` regex for A0 slugs

### Phase D — Secondary depth (2 PR)
- PR-D1: FlashcardsClient body, SettingsClient → ListSection pattern
- PR-D2: Progress (StatLine not 5-card grid), Roadmap (remove inline styles)

### Phase E — Learn list (1 PR)
- `/learn` → PrimaryRow list (level badge caption only)

### Phase F — Feature modules (4 PR, parallelizable)
- F1: Speaking (4 tabs → 2 PrimaryRow entry + sub-routes)
- F2: Quiz + Challenge
- F3: Writing + history
- F4: Leaderboard + Business + Grammar + Pronunciation

### Phase G — Auth & onboarding (1 PR)
- `/login` 903 lines → 3 step max (Google → placement optional → dashboard)
- Match minimal visual system

### Phase H — Legal & misc (1 PR)
- terms, privacy → Prose + Screen
- placement-test, checkpoint, certificate, invite → minimal quiz shell

### Phase I — Cleanup & metrics (1 PR)
- Remove legacy CSS (glass, grid-pattern, step-dot)
- E2E: time-to-lesson + smoke all tab paths
- Visual regression baseline

---

## 6. PR Plan (ordered DAG)

| PR | Title | Depends |
|----|-------|---------|
| PR-01 | design-system V2 primitives + token extension | — |
| PR-02 | /me hub + nav collapse + header minimal | PR-01 |
| PR-03 | Lesson light shell + continue button | PR-01 |
| PR-04 | Fluency/Translate kit + LessonShell | PR-03 |
| PR-05 | Flashcards + Settings ListSection | PR-01, PR-02 |
| PR-06 | Progress + Roadmap token migration | PR-01, PR-02 |
| PR-07 | Learn list PrimaryRow | PR-01 |
| PR-08 | Speaking minimal | PR-01, PR-02 |
| PR-09 | Quiz + Challenge | PR-01 |
| PR-10 | Writing module | PR-01 |
| PR-11 | Leaderboard + Business + Grammar + Pronunciation | PR-01 |
| PR-12 | Login/onboarding 3-step | PR-01 |
| PR-13 | Legal + placement + certificate + invite | PR-01 |
| PR-14 | Legacy CSS purge + E2E + dead code delete | PR-01..13 |

---

## 7. Key Decisions

1. **Light-first everywhere** — lesson không còn dark island; dark mode = token swap, không layout khác.
2. **"/me" hub** — một điểm progressive disclosure thay 3 nav mechanisms.
3. **Giữ IPOR** — chỉ đổi chrome, không đổi section order hay pedagogy.
4. **Không gamification visual** — streak/XP = text caption, không gradient trophy cards trên daily path.
5. **Speaking tabs → routes** — giảm tab trong tab (cognitive load).
6. **Incremental PRs** — mỗi PR ship được, test pass, không big-bang.

---

## 8. Open Questions (user quyết)

1. **Tab "Tôi" → `/me`** — ✅ **Đã quyết:** `/me` hub, settings = sub-page
2. **Lesson theme:** light only hay user chọn? — ✅ **Đã quyết:** follow system, light default
3. **Leaderboard/Business:** giữ feature hay ẩn sau "Tôi"? — ✅ **Đã quyết:** giữ, ẩn khỏi daily path
4. **Login funnel:** bắt buộc placement hay optional skip? — ✅ **Đã quyết:** 1 câu level + skip auth

---

## 9. Success criteria

- [x] 26/26 routes dùng Screen/SecondaryPageShell/MinimalButton hoặc cleaned equivalents — login, placement-test/results/saving, pronunciation, certificate eligible, legal, lesson sections+header+card, speaking subs, most secondary + daily path done post 081-098; weekly report + progress bars use targeted styles only (specialized, not heavy chrome); lesson canvas keeps zinc for pedagogy but cards light
- [x] 0 inline `style={{}}` trong V2 targeted client pages (placement 0, pronunciation 0, login chrome purged) — ~30 còn toàn repo là flip 3D + bar % widths + framer motion (cần thiết, không phải bloat UI)
- [x] 1 CTA component (`MinimalButton`) — daily path + placement/pronun/cert/legal/speaking entry + many features; login uses it (1 text gradient accent giữ minimal)
- [x] Nav: chỉ bottom 3-tab + `/me` list (no hamburger, no "Thêm")
- [x] `npm run lint && npm run test && npm run e2e:time-to-lesson` pass — lint+test OK post every V2 task; e2e time-to-lesson + smoke:learn chạy + fix regression (TASK-090)
- [~] time-to-lesson ≤2 tap, ≤10s (không regression) — e2e post-V2 clean (≤2 taps warmup, ≤15s); baseline ghi trong PLAN TASK-090; prod smoke pass
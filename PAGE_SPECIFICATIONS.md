# Page Specifications — AtoEnglish

> Mô tả chi tiết từng trang trong app. Dùng làm tài liệu tham khảo khi thiết kế/build trang mới hoặc refactor.

---

## Index

| # | Page | Route | Status |
|---|------|-------|--------|
| 1 | Landing | `/` | ✅ Live |
| 2 | Login / Signup | `/login` | ✅ Live |
| 3 | Dashboard | `/dashboard` | ✅ Live |
| 4 | Learn (Unit List) | `/learn` | ✅ Live |
| 5 | Lesson (Unit Detail) | `/learn/[unitSlug]` | ✅ Live |
| 6 | Flashcards | `/flashcards` | ✅ Live |
| 7 | Speaking | `/speaking` | ✅ Live |
| 8 | Progress | `/progress` | ✅ Live |
| 9 | Roadmap | `/roadmap` | ✅ Live |
| 10 | Quiz | `/quiz` | ✅ Live |
| 11 | Privacy Policy | `/privacy` | ✅ Live |
| 12 | Terms | `/terms` | ✅ Live |
| 13 | Placement Test | `/placement-test` | ✅ Live |

---

## Page 1 — Landing Page

**Route**: `/`  
**File**: `src/app/page.tsx` (Server Component)

**Mục tiêu**: Thu hút, giữ chân và chuyển đổi visitor thành người đăng ký.

**Sections (thứ tự từ trên xuống)**:
1. `NavbarAuth` — Logo + Login/CTA buttons (sticky)
2. `HeroCTA` — Headline + CTA + App screenshot preview
3. `ProblemSection` — Pain points của người học tiếng Anh
4. `ScienceSection` — FSRS + Hybrid model (tại sao hiệu quả)
5. `HowItWorksSection` — 4 bước học tập
6. `ProductPreview` — Animated screenshots / demo
7. `BenefitsSection` — So sánh AtoEnglish vs học truyền thống
8. `TestimonialsSection` — User quotes
9. `FaqSection` — Câu hỏi thường gặp
10. `FinalCtaSection` — Final signup CTA + social proof

**Design**:
- Dark background (`zinc-950`)
- Spotlight effect trên Hero
- Scroll-reveal animations cho các section
- Glassmorphism cards cho testimonials / preview

**SEO**:
```ts
title: "AtoEnglish — Học tiếng Anh giao tiếp từ A đến Z"
description: "App học tiếng Anh A1-B1 miễn phí cho người Việt. FSRS, AI speaking, và bài học thực tế."
```

---

## Page 2 — Login / Signup

**Route**: `/login`  
**File**: `src/app/login/page.tsx` (Client Component)  

**Mục tiêu**: Xác thực người dùng + 5-step onboarding quiz cho user mới.

**Flow**:
1. Form email/password (login hoặc signup)
2. Google OAuth button
3. Nếu signup → 5-step onboarding quiz:
   - Step 1: Mục tiêu học (Communication, Travel, Work...)
   - Step 2: Trình độ hiện tại (A0-A1 / A2 / B1 / B2+)
   - Step 3: Thời gian học/ngày
   - Step 4: Sở thích chủ đề / obstacle
   - Step 5: Nhắc nhở (push notification opt-in)
4. Onboarding lưu `current_level` + `starting_unit_index` vào user_progress (sử dụng getOnboardingStartingUnitIndex từ placement lib). Redirect về lesson đầu của level với `?mini=1`.
5. Sau đăng nhập: có thể truy cập `/placement-test` để tự chọn lại level hoặc làm test 40 câu (A0-B2) → lưu starting_unit_index, revalidate learn/roadmap/dashboard.

**Design**:
- Split layout (desktop): Form left, illustration/preview right
- Full-screen form (mobile)
- Glassmorphism card trên nền zinc-950

---

## Page 13 — Placement Test

**Route**: `/placement-test`  
**File**: `src/app/(main)/placement-test/page.tsx`  
**Client**: `PlacementTestClient.tsx`

**Mục tiêu**: Cho phép user (đã auth) tự đánh giá hoặc test chính xác để đặt `starting_unit_index` + `current_level` trong user_progress. Bỏ qua các unit trước.

**Flow**:
1. **Pick stage**: Chọn "Tự chọn nhanh" (A0/A1/A2/B1/B2) hoặc "Làm bài test 40 câu".
2. **Test stage**: 40 câu (EF SET style: Reading + Vocab + Language Use). Hỗ trợ A0 foundation questions.
   - Tiến độ % , 1 câu/lần.
   - Tính điểm theo band (A0/A1/A2/B1/B2).
3. **Save**: Gọi `savePlacementResult(level, score)` hoặc `setPlacementLevel` (rate limited 3/h).
   - Server: persist vào user_progress: current_level, starting_unit_index = LEVEL_START_INDEX[cefr], placement_completed_at=now.
   - Revalidate dashboard/learn/roadmap.
4. **Results**: Hiển thị level + điểm + "Bắt đầu học" → `/learn/${startingSlug}?mini=1`

**Data**: `PLACEMENT_QUESTIONS` + `calculateResult` + `buildSelfSelectResult` trong `@/lib/data/placement-test.ts` (TOTAL_QUESTIONS=40).

**UI**: Framer Motion stages, color per CEFR, skill icons, error handling on save.

**Access**: Từ Learn (nếu chưa placed), từ Settings "Đánh giá lại trình độ", protected.

---

## Page 3 — Dashboard

**Route**: `/dashboard`  
**File**: `src/app/(main)/dashboard/page.tsx` (Server Component)  
**Client**: `src/app/(main)/dashboard/components/DashboardClient.tsx`

**Mục tiêu**: Tổng quan tiến độ + call-to-action tiếp tục học.

**Sections**:
1. **Welcome header** — "Chào [name]!" + ngày/thời gian
2. **Stat grid** (3 cols):
   - Streak (🔥 days)
   - Total XP
   - Completed Units
3. **Daily XP progress bar** — target vs earned today
4. **Continue Learning card** — Unit hiện tại + % progress
5. **Due flashcards** — Count badge + shortcut
6. **Weekly XP chart** — 7-day bar chart
7. **Quests / Daily goals** — Speaking, vocabulary, lesson goals
8. **Recent achievements** — Last 3 milestones

**Data fetched (parallel)**:
```ts
Promise.all([getUserProgress(), getCompletedUnitsCount(), getDueCards(), getCurrentUnit(), getRecentSpeakingSessions(5)])
```

**Performance**: `revalidate = 0` (always fresh data)

---

## Page 4 — Learn (Unit List)

**Route**: `/learn`  
**File**: `src/app/(main)/learn/page.tsx` (Server Component)  
**Client**: `src/app/(main)/learn/components/LearnClient.tsx`

**Mục tiêu**: Hiển thị toàn bộ lộ trình 50 units (A0 → B2), mở khóa theo placement + completion. Hỗ trợ 50 units: 8 A0 foundation + 12 A1 + 6 A2 + 14 B1 + 10 B2.

**Layout**:
- Header: "Bài học" + CEFR level badge + XP
- Placement CTA (nếu chưa placement và starting=0): link đến /placement-test "Xác định trình độ & mở đúng bài học"
- Timeline list UnitCard (50 items)
- Mỗi card: Unit id + title + description + duration + xp + status
- Completed: ✅ check + star rating (1-3 based on xp)
- Current/active: highlight
- Locked: gray + 🔒 ; placed-out units (skipped by placement) vẫn unlock nhưng optional
- Progress per unit: % từ vocab saved / full complete

**Lock logic** (respect placement):
- Units at/before `starting_unit_index` unlocked ngay (isUnitUnlocked).
- Sau đó: N+1 unlock khi N completed.
- `getNextUnitFromProgress` + `isPlacedOutUnit` dùng startingUnitIndex từ user_progress.
- Active unit từ getCurrentUnit respects placement entry point.

---

## Page 5 — Lesson (Unit Detail)

**Route**: `/learn/[unitSlug]`  
**File**: `src/app/(main)/learn/[unitSlug]/page.tsx`  
**Component**: `src/components/learn/UnitTemplate.tsx` (main engine)

**Mục tiêu**: Dạy 1 unit theo Hybrid Model — 9 sections. Hỗ trợ 50 units từ A0 foundation (bảng chữ cái) → B2 (advanced conditionals, IELTS 6.5+).

**Section flow** (`SECTION_ORDER = [1, 5, 2, 3, 4, 9, 6, 7, 8]`):

| Step | Section # | Tên | Mô tả |
|------|-----------|-----|-------|
| 1 | 1 | Khởi động | SRS warmup cards + cultural note |
| 2 | 5 | Hội thoại | Real-life dialogue (Implicit Input) |
| 3 | 2 | Từ vựng | Vocab cards + collocation + audio |
| 4 | 3 | Ngữ pháp | Grammar rule + CCQ |
| 5 | 4 | Luyện tập | Sentence scramble tiles |
| 6 | 9 | Dịch câu | VN→EN translation (NEW) |
| 7 | 6 | Shadowing | Listen + repeat + score |
| 8 | 7 | Luyện nói | Free speaking + recording |
| 9 | 8 | Hoàn thành | Final quiz + cumulative review |

**UI features**:
- Top progress bar (section-based)
- Section name label below progress bar
- Back button (left) — exits lesson
- Sound effects on correct/wrong answers
- Confetti on unit completion

**FSRS integration**:
- Section 1: SRS warmup (due cards)
- On completion: auto-seed vocab + grammar to FSRS
- On quiz wrong: schedule wrong words for "Again" review

---

## Page 6 — Flashcards

**Route**: `/flashcards`  
**File**: `src/app/(main)/flashcards/page.tsx`  
**Client**: `src/app/(main)/flashcards/FlashcardsClient.tsx`

**Mục tiêu**: FSRS-powered spaced repetition review session.

**Modes**:
1. **SRS Mode** (default) — Only due cards
2. **Cram Mode** — All cards regardless of due date

**Card UI**:
- Front: English word + phonetic
- Back: Vietnamese meaning + example + collocation
- Flip animation (CSS 3D)
- Audio playback button (TTS)

**Rating buttons** (FSRS):
```
Again (🔴) · Hard (🟠) · Good (🟢) · Easy (🔵)
```

**Session complete screen**:
- Cards reviewed count
- Accuracy %
- Streak + XP earned

**Topic filter**: Tabs per unit slug + "Grammar" topic

---

## Page 7 — Speaking

**Route**: `/speaking`  
**File**: `src/app/(main)/speaking/page.tsx`  
**Client**: `src/app/(main)/speaking/SpeakingClient.tsx`

**Mục tiêu**: Luyện phát âm và speaking tự do.

**Modes**:
1. **Shadowing** — Play audio, user repeats, score calculated
2. **Role Play** — AI conversation partner (scenario-based)
3. **Free Journal** — User speaks freely, transcript saved

**Tech**:
- Web Speech API (`SpeechRecognition`) cho recording
- `calcSpeechScore()` từ `@/lib/utils/speech`
- XP earned on completion

**UI**:
- Big mic button center
- Live transcript display
- Score visualization (circular progress)
- Scenario selector (Roleplay mode)

---

## Page 8 — Progress

**Route**: `/progress`  
**File**: `src/app/(main)/progress/page.tsx`

**Mục tiêu**: Thống kê chi tiết hành trình học.

**Sections**:
1. CEFR Level badge + progress to next level
2. Total stats: XP, streak, units, speaking sessions
3. Weekly activity heatmap
4. Achievement milestones (e.g., "First Unit", "7-day Streak")
5. Vocab stats: total cards, due today, mastered
6. Level progression timeline

---

## Page 9 — Roadmap

**Route**: `/roadmap`  
**File**: `src/app/(main)/roadmap/page.tsx`
**Client**: `RoadmapClient.tsx`

**Mục tiêu**: Lộ trình tổng thể A0 → B2 với 50 Units (8 A0 + 12 A1 + 6 A2 + 14 B1 + 10 B2). Hiển thị theo placement starting point.

**Layout**:
- Visual timeline/tree of all 50 units grouped by level (A0/A1/A2/B1/B2)
- Current / next unit (computed via getNextUnitFromProgress(completed, startingUnitIndex)) highlighted
- Completed units marked
- Placed-out units (index < starting) shown as optional review
- CTA "Học" trỏ đúng next unit theo placement
- User level + starting info from user_progress (starting_unit_index, placement_completed_at)
- Estimated time per level

**Placement integration**: Roadmap page server fetches starting_unit_index + completed, passes to client; uses same lib functions as Learn.

---

## Page 10 — Quiz

**Route**: `/quiz`  
**File**: `src/app/(main)/quiz/page.tsx`

**Mục tiêu**: Standalone quiz mode (ngoài bài học).

**Types**: Multiple choice, Cloze, Translate  
**Source**: Mixed questions from completed units

---

## Page 11/12 — Privacy & Terms

**Routes**: `/privacy`, `/terms`  
**Purpose**: Legal pages, không cần authentication

**Design**: Simple markdown-style layout, light/dark compatible, max-w-prose

---

## Common Layout — Header Shell & Navigation

**Files**:
- `src/components/layout/header-shell.tsx` (client, sticky glass card)
- `src/components/layout/header.tsx` (server wrapper, fetches user)
- `src/components/layout/main-nav.tsx` (desktop nav + more panel inline)
- `src/components/layout/mobile-nav.tsx`, `bottom-nav.tsx`
- Navigation config: `@/lib/constants/navigation.ts` (bottom 5, primary 4 + Thêm, mobile groups)

**HeaderShell features**:
- Logo + "AtoEnglish / Grow every day"
- Desktop: primary nav (Trang chủ, Học, Luyện, Ôn) + "Thêm" expands inline MainNavMorePanel (Viết, Tiến độ, Bảng xếp hạng, Lộ trình, Business) — pushes content, no overlay
- User: avatar + name (sm+), Settings icon, Logout; ThemeToggle; Notification bell (if user)
- Mobile: MobileNav drawer + bottom tab bar (5 items)
- Auto-close more panel on route change / Esc
- Used in root layout for protected + landing variants

**Update note**: HeaderShell thay thế layout cũ; glassmorphism `bg-glass border-glass`; responsive.

---

## Future Pages (Planned)

| Page | Route | Mô tả |
|------|-------|-------|
| Profile | `/profile` | Edit name, avatar, goals, notification settings |
| Leaderboard | `/leaderboard` | Weekly XP ranking |
| Certificates | `/certificates` | CEFR completion certificates |
| Community | `/community` | User discussions (future) |

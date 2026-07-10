# LESSON SYSTEM FOUNDATION — AtoEnglish

> **Mục đích:** Tài liệu nền tảng **duy nhất** để phát triển hệ thống bài học tiếng Anh chuẩn quốc tế  
> (world-class, research-backed, VN-first) **trên code & curriculum đã có** — **không rebuild từ đầu**.  
> Cập nhật: 2026-07-10  
> Audience: product owner · agent autopilot · content author · engineer

---

## 0. North Star outcome — **B1 = gốc “dùng được”** (chốt 2026-07-10)

### Quyết định sản phẩm

| | |
|--|--|
| **Outcome cốt lõi** | Người học đạt **CEFR B1 (Independent User)** — mức **tối thiểu dùng được tiếng Anh độc lập** |
| **Sau B1** | Tự phát triển tiếp (B2 / job domain / IELTS…) — Ato **mở đường**, không ôm “thành thạo C1” |
| **Không chốt** | A2-only (chỉ survival) · C1 fluency · exam factory |

**Lý do (research):** Council of Europe *Threshold Level* map → **B1**; A2 = survival; B2 = professional comfort.  
Với adult VN self-study: **B1 speaking + listening** = mốc “dùng được thật” để tự đi tiếp.

### Định nghĩa vận hành “đạt B1 Ato”

Người học **đạt gốc B1** khi **đồng thời**:

1. **Can-do (CEFR B1):** xử lý hầu hết tình huống quen; nói về work/travel/daily **không script**; hiểu ý chính speech rõ; kể trải nghiệm + lý do đơn giản.  
2. **Intelligibility:** người lạ hiểu speaking **không cần lặp >1 lần** phần lớn thời gian.  
3. **Tự cứu:** paraphrase / “Could you repeat?” / hỏi lại khi kẹt.  
4. **Curriculum:** hoàn thành path **A0 → hết band B1** (xem §0.1) + speaking practice đủ (không chỉ quiz).  
5. **Self-check:** “Tôi có thể hội thoại 5–10 phút topic quen với người nước ngoài.”

**Không** dùng XP / streak làm định nghĩa “đạt B1”.

### 0.1 Path curriculum → B1 (đã ship)

| Band | Units | Role tới B1 |
|------|-------|-------------|
| A0 | unit-a0-1 … a0-8 (**8**) | Nền zero |
| A1 | unit-1 … 12 (**12**) | Elementary |
| A2 | unit-13 … 18 (**6**) | Survival solid |
| **B1** | **unit-19 … 32 (**14**)** | **← TARGET BAND** |
| B2 | unit-33 … 42 (10) | **Extension** — sau gốc, tự nâng |
| Business track | song song | Domain job (hỗ trợ B1→B2 work) |

**Core path length:** ~**40 units** (A0+A1+A2+B1).  
**B2 + business** = “tự phát triển lên” trên nền B1.

### 0.2 Ưu tiên product / eng (mọi task đo theo B1)

| Ưu tiên | Ý nghĩa |
|---------|---------|
| P0 | Giữ / siết **A0→B1** quality (content gates, speaking, L1, can-do) |
| P0 | Onboarding & dashboard: goal mặc định **“Đạt B1 — dùng được tiếng Anh”** |
| P0 | Certificate / checkpoint **B1** = milestone chính (A2 = mid checkpoint) |
| P1 | B2 + business = optional depth, không chặn “done” của core |
| P1 | Post-B1: tools tự học (SRS, speaking free, job roleplay) — **không** khóa sau paywall core |

### 0.3 Promise copy (landing / onboarding)

- **Primary:** “Học tới **B1** — đủ để **dùng tiếng Anh độc lập** trong đời sống & công việc cơ bản.”  
- **Secondary:** “Sau B1, bạn tự tiến B2 / chuyên ngành với cùng hệ thống ôn + nói.”  
- **Tránh:** “Thành thạo như native” · “IELTS 7.0 trong 30 ngày” · chỉ “học vui như game”.

### 0.4 Metrics North Star (B1-centric)

| Metric | Ghi chú |
|--------|---------|
| % users reach end of **unit-32** (or B1 checkpoint pass) | Core completion |
| Speaking minutes + intelligibility trend trên path B1 | Quality, not vanity |
| D7 / D30 retention trên path A0–B1 | Habit tới threshold |
| Self-report can-do B1 sau checkpoint | Outcome |

---

## 0b. Nguyên tắc bất biến (đọc trước mọi task)

1. **Không rewrite framework học** (`learning-flow.ts` 10 section IPOR) trừ khi có task redesign có chủ đích + approve.
2. **Không đổi thứ tự block nội dung** trong `unit*.ts` so với `CONTENT_BLOCK_ORDER` / blueprint.
3. **Mẫu vàng = `unit1.ts`** — unit mới / refactor phải “look like unit1” về structure + depth.
4. **Gate nội dung bắt buộc trước merge:**
   ```bash
   npm run test:content-standard
   bash scripts/audit-lesson-content.sh
   npm run test   # includes curriculum-quality, blueprint, center-ref
   ```
5. **Nội dung = cách học** — field trong data map 1-1 với section app (blueprint). Không viết content “cho đẹp file” mà UI không dùng.
6. **Đối tượng:** người Việt trưởng thành (self-study) · **core path A0→B1** · speaking-first · job/career · free core · **B2 = extension sau gốc**.
7. **Outcome gốc = B1 Independent User** — mọi feature mới phải giúp tới B1 nhanh hơn / chắc hơn, hoặc hỗ trợ tự tiến sau B1; không loãng sang exam/C1 trừ task riêng.

---

## 1. Bản đồ Single Source of Truth (SSOT)

| Vai trò | File | Được phép sửa khi… |
|---------|------|---------------------|
| **Luồng học trong app** (10 bước) | `src/lib/lessons/learning-flow.ts` | Redesign pedagogy (hiếm) |
| **Map field → section → phase** | `src/lib/lessons/lesson-blueprint.ts` | Thêm field / block có map section |
| **Chuẩn số lượng SDL** | `src/lib/lessons/content-standard.ts` | Nâng bar chất lượng (có test) |
| **Tham chiếu trung tâm / quốc tế** | `src/lib/lessons/lesson-center-reference.ts` | Bổ sung nguồn / can-do pattern |
| **Giọng & quy tắc viết** | `CONTENT_STYLE.md` §1–9 | Copy UI / style content |
| **Mẫu vàng unit (v1)** | `src/lib/data/units/unit1.ts` | Chỉ polish; giữ structure |
| **v2 lessons** | `src/lib/v2/lessons/l-*.ts` | LessonSpec content factory |
| **Docs map** | `docs/STRUCTURE.md` | Folder hygiene |
| **50 unit data** | `src/lib/data/units/unit*.ts` | Viết/sửa nội dung theo blueprint |
| **Metadata lộ trình** | `src/lib/constants/units.ts` | Thêm unit / XP / time / tags |
| **Schema TypeScript unit** | `UnitData` in `UnitTemplate.tsx` | Thêm field optional + UI section |
| **Orchestrator UI bài học** | `src/components/learn/UnitTemplate.tsx` | UX section, không phá order |
| **Section UI** | `src/components/learn/sections/*` | Polish 1 section |
| **FSRS / ôn** | `src/lib/srs/fsrs.ts` + flashcards actions | Algorithm (cần ask trước) |
| **Speaking feedback L1** | `src/lib/utils/speech-analysis.ts` | Nâng coach free |
| **Agent rules** | `AGENTS.md` § Bài học Blueprint | Quy trình agent |

**Checklist agent (in terminal):**

```bash
npx tsx scripts/print-lesson-blueprint.mjs
```

---

## 2. Khoa học học — “world-class” đến thời điểm hiện tại

Hệ thống AtoEnglish **đã encode** các trụ cột được cộng đồng SLA / teacher-training coi là chuẩn.  
Foundation = **giữ và siết** các trụ này, không thay bằng trend marketing.

### 2.1 Paul Nation — Four Strands (cân bằng khóa học)

Một khóa cân bằng ≈ **~25% mỗi strand**:

| Strand | Ý nghĩa | AtoEnglish map |
|--------|---------|----------------|
| **Meaning-focused input** | Nghe/đọc hiểu nghĩa (coverage **≥95–98%** từ đã biết) | Dialogue §5, listenAndChoose, readingPassage |
| **Meaning-focused output** | Nói/viết để truyền đạt ý | practiceTranslate, speaking L1/L2, journal |
| **Language-focused learning** | Học có chủ đích form/lexis/grammar | vocab §2, grammar §3, practice §4, L1 notes |
| **Fluency development** | Tự động hóa cái đã biết (**100% known** items) | fluencyDrill §10, shadowing §6, FSRS review |

**Quy tắc Nation đã hard-code trong app:**

- **Pre-teach vocab TRƯỚC dialogue** (Nation & Webb 2011; giảm cognitive load; mục tiêu coverage ~98% khi nghe hội thoại).
- Fluency drill chỉ dùng ngôn ngữ **đã dạy trong unit** (không nhét từ mới).

### 2.2 British Council ESA + CELTA stages

| ESA | CELTA gần đúng | Ato block |
|-----|----------------|-----------|
| **Engage** | Lead-in / activate schemata | hook + warmup (§1) |
| **Study** | Clarification MF(P) + controlled practice | vocab, grammar, exercises, dialogue |
| **Activate** | Freer practice / task | fluency + translate + shadow + speak |
| **(+ Review)** | Feedback + consolidation | quiz + cumulative + seed FSRS |

**CELTA discipline:**

- Không dạy grammar “trần” trước ngữ cảnh (hook/situation trước).
- **Controlled → freer** (practice §4 trước speaking free §7).
- **CCQ** (concept checking) sau grammar rule.

### 2.3 CEFR can-do (Cambridge / Council of Europe)

- Mỗi unit = **2–5 learningOutcomes** đo được (“can-do”), không phải “học về thì hiện tại”.
- Band A0–B2 có pattern sẵn: `CEFR_OUTCOME_PATTERNS` trong `lesson-center-reference.ts`.
- Placement / checkpoint / certificate phải **align** can-do, không chỉ XP.

### 2.4 Cognitive science (đã ghi trong unit1 comments)

| Nguyên lý | Ứng dụng Ato |
|-----------|--------------|
| **Active recall** (Roediger & Karpicke) | Vocab: EN → nhớ VN → lật thẻ |
| **Spaced repetition** | FSRS (`ts-fsrs`) + cumulativeReview |
| **Retrieval practice** | Quiz, translate, scramble |
| **Interleaving / spiral** | cumulativeReviewQuestions ≥3 (ôn unit trước) |
| **Flow ~80% success** (Csikszentmihalyi) | practice/quiz độ khó vừa |
| **Self-Determination** (Ryan & Deci) | culturalNote curiosity + honest progress |
| **Schema activation** | warmupGreetings + SRS warmup |

### 2.5 Vietnamese L1-aware pedagogy (điểm khác biệt “tốt nhất VN”)

World-class **cho người Việt** ≠ copy Duolingo global. Phải có:

| Lỗi L1 phổ biến | Xử lý trong hệ thống |
|-----------------|----------------------|
| Nuốt âm cuối /t d s z k/ | `l1_interference_vn` + speech-analysis tips |
| th → t/d | Vocab note + speaking coach |
| /ɪ/ vs /i:/, /æ/ | Phoneme / pronunciationFocus |
| Article a/an/the | Grammar vnNote + translate |
| 3sg -s, tense | Grammar + correction exercises |
| Flat intonation (tone L1) | Shadowing + tip intonation |
| Pragmatic (bắt tay, Hi vs Hello) | culturalNote |

**Tỷ lệ L1 notes bắt buộc** (`content-standard.ts`):

| Level | Min % vocab có `l1_interference_vn` ≥15 ký tự |
|-------|-----------------------------------------------|
| A0 | 50% |
| A1–A2 | **100%** |
| B1–B2 | 50% |

### 2.6 Output-first / speaking science

- **Shadowing** (20–30 phút/ngày, material short, comprehensible): evidence VN EFL cải thiện phát âm/fluency.
- **Comprehensible output** (Swain): bắt buộc section dịch + nói trong mỗi unit — không chỉ MCQ.
- **Low-stakes practice** (roleplay AI / free fallback): giảm sợ sai, tăng time-on-task speaking.
- Free path: `analyzeSpeaking` local L1 + optional Gemini.

### 2.7 Product patterns “best-in-class” (không copy mù)

| Sản phẩm | Lấy gì | Không copy |
|----------|--------|------------|
| **Babbel** | Dialogue thực, career, low-pressure | Paywall nặng |
| **ELSA** | Feedback phát âm chi tiết | Chỉ drill phoneme, thiếu curriculum CEFR full |
| **Duolingo** | Habit, time-to-lesson, streak | Speaking nông, ít L1 VN |
| **Anki/Mochi** | SRS nghiêm | Thiếu IPOR lesson |
| **BC / Apollo class** | ESA, CLT, situation | Không scale 24/7 self-study |

**Định vị foundation Ato:**  
`Habit + structured CEFR lesson (ESA/IPOR) + Nation strands + VN L1 + free speaking output`.

---

## 3. Khung bài học AtoEnglish (IPOR × 10 section)

**Source:** `learning-flow.ts` — **không đảo thứ tự section id trong app** (SECTION_ORDER).

| Order | § id | Label UI | Phase | ~phút | Mục tiêu học |
|------:|------|----------|-------|------:|--------------|
| 1 | 1 | Khởi động | input | 3 | SRS + situation + outcomes |
| 2 | 2 | Từ vựng | input | 5 | Pre-teach active recall |
| 3 | 3 | Ngữ pháp | processing | 5 | Inductive → rule → CCQ |
| 4 | 4 | Luyện tập | processing | 8 | Controlled practice ~80% |
| 5 | 5 | Hội thoại | input | 5 | Input có nghĩa sau vocab |
| 6 | 10 | Phản xạ | processing | 4 | Fluency automaticity |
| 7 | 9 | Dịch câu | output | 5 | VN→EN production |
| 8 | 6 | Shadowing | output | 5 | Pronunciation + prosody |
| 9 | 7 | Luyện nói | output | 5 | Freer speaking |
| 10 | 8 | Hoàn thành | review | 5 | Quiz + cumulative + FSRS seed |

**Mini session** (review path): start §4 → quiz §8 (`MINI_SESSION_*`).

**IPOR meta (UI phase bar):** Input / Processing / Output / Review.

---

## 4. Blueprint nội dung (authoring = learning)

**Source:** `lesson-blueprint.ts` + `CONTENT_STYLE.md` §6.

### 4.1 Thứ tự field trong file `unit*.ts`

```
meta → hook → warmup → vocab → grammar → exercises_input
  → dialogues → fluency → output → review
```

### 4.2 Checklist viết 1 unit (agent / human)

| # | Block | Fields tối thiểu | Cách học | Cách viết |
|---|-------|------------------|----------|-----------|
| 1 | meta | unitId, title, level, xp, estimatedTime, description, badge* | Kỳ vọng thời gian | description = 1 câu lợi ích thực |
| 2 | hook | situation, learningOutcomes, culturalNote, **jobScenarios≥1** | Biết vì sao học | Tình huống cụ thể VN adult / job |
| 3 | warmup | warmupGreetings ≥3 | Schema + SRS | en, vn, context |
| 4 | vocab | 8–20 từ + L1 + audio | Active recall trước dialogue | GSL/frequency; A2+ collocation |
| 5 | grammar | rule, vnNote, examples, ccq | Inductive + CCQ | rule <30 từ |
| 6 | exercises | practiceQuiz, listenAndChoose≥5, scramble… | Controlled ~80% | Distractor plausible |
| 7 | dialogues | ≥2 dialogues + job context | Input 98% coverage | Chỉ từ đã dạy |
| 8 | fluency | fluencyDrill.items ≥5 | Automaticity | 100% known language |
| 9 | output | practiceTranslate≥3, speaking L1+L2, shadowing | **Bắt buộc sản xuất** | Câu trong phạm vi unit |
| 10 | review | quiz≥5, cumulative≥3, reading optional | Exit + spiral | Seed FSRS |

### 4.3 Chuẩn số lượng (hard gate)

**Source:** `content-standard.ts` / `CONTENT_STYLE.md` §7.

| Hạng mục | Min |
|----------|-----|
| situation | 30 chars |
| learningOutcomes | 2–5 |
| culturalNote | 40 chars (strip HTML) |
| warmupGreetings | 3 |
| vocab | 8–20 |
| fluencyDrill items | 5 |
| dialogues | 2 |
| jobScenarios | 1 |
| practiceTranslate | 3 |
| listenAndChoose | 5 |
| quiz | 5 |
| cumulativeReviewQuestions | 3 |
| L1 ratio | theo level (mục 2.5) |

**Không đạt → không merge.**

---

## 5. Curriculum architecture (đã ship)

| Band | Units | Role |
|------|-------|------|
| **A0** | unit-a0-1 … a0-8 (8) | True beginner VN zero English |
| **A1** | unit-1 … 12 (12) | Elementary daily + first job contact |
| **A2** | unit-13 … 18 (6) | Pre-int situations |
| **B1** | unit-19 … 32 (14) | Independent user + work |
| **B2** | unit-33 … 42 (10) | Upper-int / professional |
| **+ Business track** | constants/business-track | Career path song song |

- Metadata: `src/lib/constants/units.ts`  
- Audio: `public/audio/unit-*/` + `npm run audio:generate*`  
- Placement entry: `src/lib/placement/starting-unit.ts`  
- Progress table: `user_lesson_progress` (không phải `completed_lessons`)

**Spiral:** mỗi unit có `cumulativeReviewQuestions` ôn form/từ unit trước.

---

## 6. Schema `UnitData` (contract kỹ thuật)

**Source:** `UnitTemplate.tsx` → `export interface UnitData`

Bắt buộc / cốt lõi:

- Identity: `unitId`, `title`, `level`, `xp`, `estimatedTime`, `description`, `badgeName`, `badgeEmoji`
- Hook: `situation`, `learningOutcomes`, `culturalNote`, `jobScenarios?`
- Engage: `warmupGreetings`
- Study: `vocab`, `grammar?`, exercises*, `dialogues`, `listenAndChoose`
- Activate: `fluencyDrill?`, `practiceTranslate?`, `speaking`, `shadowingVideoId?`, `pronunciationFocus?`
- Review: `quiz`, `cumulativeReviewQuestions?`, `readingPassage?`

**Quy tắc mở rộng schema:**

1. Field mới = **optional** trước.  
2. Map vào blueprint `fields` + section UI.  
3. Thêm gate trong `content-standard` nếu bắt buộc chất lượng.  
4. Cập nhật `unit1.ts` làm mẫu.  
5. **Không** migrate 50 file nửa vời.

---

## 7. Vòng đời học viên (system, không chỉ 1 unit)

```
Landing → Login/Onboarding quiz → Placement (optional)
  → Dashboard “Hôm nay”
  → Unit (IPOR 10) → completeUnit → XP + streak + FSRS seed
  → Flashcards (FSRS due)
  → Speaking hub (shadow / roleplay / journal / phoneme)
  → Progress / weekly / checkpoint / certificate
```

**Hệ thống phụ (đã có, giữ):**

| Module | Vai trò pedagogy |
|--------|------------------|
| FSRS flashcards | Language-focused + spaced retrieval |
| Speaking free | Output + pronunciation deliberate practice |
| Daily missions / streak | Habit (không thay can-do) |
| Placement + roadmap | CEFR path, skip band đúng |
| Adaptive difficulty (local) | Weak exercise types hint |
| Business track | Career specialization |
| Writing | Output written + Gemini feedback |

---

## 8. Voice & quality bar (CONTENT_STYLE)

- UI **tiếng Việt**; input học **tiếng Anh**.  
- Tone: thầy giỏi, kiên nhẫn, không phán xét.  
- Dialogue: realistic, natural, progressive by level.  
- Grammar rule < 30 từ + vnNote L1.  
- Quiz: distractors plausible, không trick question.  
- Translate: câu ngắn, trong vocab+grammar unit.  
- Feedback: ✅/❌ rõ + gợi ý, không “wrong” trống.

---

## 9. Quality gates & tooling (bắt buộc vận hành)

| Gate | Command |
|------|---------|
| Content standard | `npm run test:content-standard` |
| Audit all units | `bash scripts/audit-lesson-content.sh` |
| Blueprint tests | vitest `lesson-blueprint`, `lesson-center-reference`, `curriculum-quality` |
| Blueprint print | `npx tsx scripts/print-lesson-blueprint.mjs` |
| Audio | `npm run audio:generate -- unit-N` |
| App gates | `npx tsc --noEmit` · `npm run lint` · `npm run test` |

**Agent rules (AGENTS.md):** khi sửa `unit*.ts` → đọc CONTENT_STYLE §6–7, bám unit1, không đổi `learning-flow` order.

---

## 10. Map “world-class checklist” ↔ đã có / làm tiếp

| Tiêu chí world-class (2024–2026) | Trạng thái Ato | Làm tiếp **trên** foundation |
|----------------------------------|----------------|------------------------------|
| CEFR path A0–B2 | ✅ 50 units | Depth B2 job verticals |
| Can-do outcomes | ✅ field + patterns | Checkpoint gate thật theo can-do |
| Balanced Four Strands | ✅ trong unit IPOR | Listening lab extensive (extra module) |
| Vocab pre-teach + coverage | ✅ order + L1 | Frequency list tooling / profiler |
| Controlled → freer practice | ✅ §4→§7 | Better free speak scoring trend |
| Spaced repetition | ✅ FSRS | Interleave form/meaning/use cards |
| L1 interference VN | ✅ notes + speech tips | Personal error bank daily drill |
| Shadowing | ✅ section + hub | 3-pass protocol + history chart |
| Job/career CLT | ✅ jobScenarios min 1 | Tracks IT / Interview / Sales |
| Habit loop | ✅ streak/XP/push | Daily Plan 1-CTA |
| Free speaking coach | ✅ local + Gemini optional | Phoneme alignment local 2.0 |
| Outcome proof | ⚠ progress UI | Pre/post placement + speaking minutes |
| Content gates | ✅ automated | Keep bar; never skip |

**Kết luận:** nền tảng **đã đủ** để lên hạng “hệ thống học tốt nhất” bằng **depth + measurement + engine nói**, không bằng viết lại ESA/IPOR.

---

## 11. Quy trình phát triển (không làm lại từ đầu)

### 11.1 Thêm / sửa 1 unit

1. Copy structure từ `unit1.ts` (không copy unit lạ structure).  
2. Fill theo CONTENT_BLOCK_ORDER.  
3. learningOutcomes theo `CEFR_OUTCOME_PATTERNS[level]`.  
4. Dialogue chỉ dùng vocab đã list.  
5. Chạy content-standard + audit.  
6. Generate audio nếu có line mới.  
7. Cập nhật `units.ts` nếu unit mới.

### 11.2 Thêm feature học mới (ví dụ Listening lab)

1. **Không** nhét phá vỡ 10 section trừ redesign.  
2. Ưu tiên: module route riêng **hoặc** field optional + section append cuối.  
3. Viết blueprint block mới + center mapping + standard min.  
4. unit1 làm mẫu → rollout theo band.

### 11.3 Nâng speaking / SRS

- Giữ free fallback.  
- Rate limit + Zod (action-guard).  
- Metrics: similarity trend, minutes spoken — không chỉ XP.

### 11.4 Việc **cấm** (anti-patterns)

| Cấm | Lý do |
|-----|-------|
| Đảo vocab sau dialogue | Phá Nation 98% coverage |
| Bỏ output (chỉ quiz) | Phá strand output + speaking-first |
| Unit không L1 notes | Mất USP VN |
| “Minimal redesign” phá glass/vibrant | User đã reject |
| Content không qua gate | Curriculum drift |
| Schema DB/auth/FSRS params không hỏi | AGENTS boundaries |
| Autopilot maintenance thrash | 0 learner value |

---

## 12. North Star metrics (đo foundation có “sống”)

| Metric | Định nghĩa tối thiểu |
|--------|----------------------|
| **Time-to-lesson** | ≤2 taps / ≤15s (E2E spec) |
| **Unit completion quality** | content-standard 50/50 green |
| **Speaking minutes / week** | per user (logged + guest local) |
| **Shadowing similarity trend** | 7-day rolling |
| **D7 return** | % users open app day 7 |
| **Can-do self-check** | optional after unit: “tôi làm được X?” |

XP/streak = **supporting**, không thay can-do.

---

## 13. Index tài liệu & code (đọc theo thứ tự)

### Pedagogy (đọc trước)

1. **This file** — `LESSON_SYSTEM_FOUNDATION.md`  
2. **`CURRICULUM_PROGRAM.md`** — thiết kế chương trình (phase, can-do, nhịp, gate B1)  
3. `CONTENT_STYLE.md` §6–7  
4. `src/lib/lessons/learning-flow.ts`  
5. `src/lib/lessons/lesson-blueprint.ts`  
6. `src/lib/lessons/lesson-center-reference.ts`  
7. `src/lib/lessons/content-standard.ts`  
8. `src/lib/data/units/unit1.ts` (mẫu vàng)  
9. `src/lib/constants/program-phases.ts` · `product-outcome.ts`

### Product / eng

10. `AGENTS.md`  
11. `README.md`  
12. `PAGE_SPECIFICATIONS.md` / `UI_GUIDELINES.md` / `DESIGN_SYSTEM.md` (UI only)

### Research anchors (ngoài repo — không fork, chỉ tham chiếu)

- Paul Nation — Four Strands; vocab coverage 95–98% input, 100% fluency  
- Nation & Webb — pre-teaching / learning from input  
- CEFR Companion Volume — can-do descriptors  
- British Council ESA; CELTA staging  
- Retrieval practice / spacing (Carpenter et al.)  
- Shadowing studies (VN EFL)  
- CLT + L1 contrast for adult learners  

---

## 14. One-page summary (in ra dán)

```
AtoEnglish Lesson OS
════════════════════
WHO: Vietnamese adults, self-study, free core, job-ready
OUTCOME: **B1 Independent User** = minimum “dùng được” (then self-extend)
PATH CORE: A0→A1→A2→B1 (~40 units, ends unit-32)
PATH EXT:  B2 + business (after B1)
LESSON: IPOR 10 (Engage→Study→Activate→Review)
SCIENCE: Nation 4 strands · ESA/CELTA · CEFR can-do · FSRS · L1 VN · shadowing
GOLD: unit1.ts
GATES: content-standard + audit-lesson-content + unit tests
NEVER: rebuild flow · vocab after dialogue · ship without L1 · skip gates
      · redefine success as XP/C1/IELTS-only
NEXT: depth to B1 + speak engine + B1 checkpoint — not greenfield rewrite
```

---

## 15. Changelog foundation

| Date | Note |
|------|------|
| 2026-07-10 | Tạo file: hợp nhất blueprint, center-ref, content-standard, CONTENT_STYLE, learning-flow, unit1, SLA research → SSOT phát triển tiếp |
| 2026-07-10 | **Chốt North Star: B1 = gốc “dùng được”**; B2/extension = tự phát triển sau; path core A0→unit-32 |

---

**Cam kết:** Mọi PR/task liên quan “bài học / curriculum / pedagogy” phải **trích dẫn section** trong file này hoặc file SSOT con.  
Nếu mâu thuẫn giữa doc cũ và file này → **ưu tiên code gates + unit1 + learning-flow**, rồi cập nhật foundation.

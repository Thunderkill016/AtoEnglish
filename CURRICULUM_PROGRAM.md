# Chương trình học AtoEnglish — Thiết kế (B1 Core)

> **Chốt outcome:** CEFR **B1 Independent User** = “dùng được tiếng Anh độc lập”.  
> **Nền:** IPOR 10 · blueprint · unit1 · 50 unit đã ship · `LESSON_SYSTEM_FOUNDATION.md` · `product-outcome.ts`.  
> **Nguyên tắc:** **không viết lại lộ trình unit** — thiết kế *chương trình* = giai, can-do, nhịp học, checkpoint, ưu tiên depth **trên** `units.ts` hiện có.  
> Cập nhật: 2026-07-10

---

## 1. Triết lý chương trình

| Trụ | Thiết kế |
|-----|----------|
| **Đích** | B1 can-do + speaking intelligibility — không phải “xong 50 unit” hay XP |
| **Đường** | A0 → A1 → A2 → **B1 (unit-32)** ≈ 40 unit core |
| **Sau đích** | B2 + Business track = **tự phát triển** (extension) |
| **Cách học mỗi unit** | IPOR 10 (Engage→Study→Activate→Review) — cố định |
| **Cân bằng Nation** | Input · Output · Language focus · Fluency trong mọi unit |
| **USP** | L1 Việt + job/career từ sớm + free speaking |
| **Entry** | Placement → nhảy band đúng (không ép A0 nếu đã A2) |

```
[Placement] ──► enter band
     │
     ▼
 Phase 0  A0 Foundation     (survival zero)
 Phase 1  A1 Everyday        (basic user+)
 Phase 2  A2 Survival+       (functional floor)
 Phase 3  B1 Independent ★   (CORE TARGET)
     │
     ▼  “Đạt B1 — dùng được”
     │
 Phase 4  B2 + Business      (self-extension)
```

---

## 2. Kiến trúc chương trình (macro)

### 2.1 Hai tầng

| Tầng | Phạm vi | “Done” nghĩa là |
|------|---------|-----------------|
| **Core Program** | A0–B1 · unit-a0-1 → **unit-32** | Checkpoint B1 pass + can-do self-check |
| **Extension** | B2 unit-33–42 + Business track | Tự chọn sau B1 |

### 2.2 Bốn phase core + extension

| Phase | CEFR | Units | # | ~Phút unit* | Vai trò |
|-------|------|-------|---|-------------|---------|
| **P0 Foundation** | A0 | a0-1 … a0-8 | 8 | ~335 | Zero → chữ, số, chào, sinh tồn |
| **P1 Everyday** | A1 | 1 … 12 | 12 | ~520 | Đời sống + intro công sở nhẹ |
| **P2 Functional** | A2 | 13 … 18 | 6 | ~280 | Past/future/travel — **mid gate** |
| **P3 Independent ★** | B1 | 19 … 32 | 14 | ~740 | Narrative → work → **B1 mock** |
| **P4 Extend** | B2 | 33 … 42 | 10 | ~635 | Academic/persuasion/exam topics |

\*Theo `estimatedTime` trong `units.ts` (core A0–B1 ≈ **1875 phút ≈ 31 giờ** contact unit; thực tế + ôn FSRS + speaking ≈ **1.5–2×**).

### 2.3 Ước lượng calendar (self-study VN adult)

| Nhịp | Core → B1 |
|------|-----------|
| 5 ngày/tuần × 30–40 phút | ~**5–8 tháng** (có skip placement) |
| 15–20 phút/ngày đều | ~**8–12 tháng** |
| Placement vào A2 | Rút ~**40–50%** path đầu |

**Promise trung thực:** “Lộ trình core ~40 bài tới B1; tốc độ phụ thuộc phút nói + ôn mỗi tuần.”

---

## 3. Can-do theo phase (chuẩn thiết kế content + checkpoint)

### P0 — A0 Foundation (unit-a0-1 → a0-8)

**Exit can-do (tối thiểu):**
- Đọc/phát âm alphabet & số cơ bản  
- Chào, tên, quốc tịch, gia đình đơn giản  
- Hỏi giờ / ngày; cụm khẩn cấp tối thiểu  
- Intelligibility: từ/câu rất ngắn, người nghe kiên nhẫn  

**Grammar spine:** BE · numbers · adj · greetings · personal info · family · time prep · imperative  

**Speaking focus:** lặp chunk, âm cuối đơn giản, không đòi hội thoại dài  

---

### P1 — A1 Everyday (unit-1 → 12)

**Exit can-do:**
- Giới thiệu bản thân + hỏi thăm  
- Nói routine, sở thích, nhà cửa  
- Mua sắm / order đồ ăn / hỏi đường  
- Mô tả sức khỏe/cảm xúc đơn giản  
- Hội thoại **2–4 phút** topic quen, cần người kia hỗ trợ  

**Grammar spine:** BE · Wh- · possessives · Present Simple · like+V-ing · there is/are · countable · prep · can/can’t · have/feel · **review unit-12**  

**Job seed:** first day office, greetings formal (unit1 jobScenarios pattern)  

**Speaking focus:** Q–A ngắn, shadowing greeting/service  

---

### P2 — A2 Functional (unit-13 → 18) — **MID CHECKPOINT**

**Exit can-do (Survival+ / gần Threshold dưới):**
- Kể việc **quá khứ** đơn giản; nói **kế hoạch**  
- So sánh khi shopping; travel & directions  
- Present Perfect kinh nghiệm cơ bản  
- Xử lý hầu hết **tình huống travel/daily scripted**  
- Hội thoại **4–6 phút**; paraphrase lần đầu  

**Grammar spine:** Past · Future · comparatives · travel lang · Present Perfect · **A2 review unit-18**  

**Gate A2 (thiết kế):**
- Quiz cumulative A2  
- Speaking task: “Tell me about a trip / your plans this month” (1–2 phút)  
- Self-check 5 can-do A2  

→ **Chưa** là “done product”; là **cổng** vào Independent path.

---

### P3 — B1 Independent ★ (unit-19 → 32) — **CORE TARGET**

Chia **4 module** (logic sư phạm, không đổi order unit):

| Module | Units | Chủ đề chương trình | Can-do B1 dần |
|--------|-------|---------------------|---------------|
| **M1 Narrative & world** | 19–21 | Stories, news, predictions | Kể chuyện, ý chính tin, xu hướng |
| **M2 System & logic** | 22–24 | Rules, conditionals, process | Quy định, if/when, passive process |
| **M3 People & agency** | 25–28 | Describe, prefer, get things done, duration | Networking, preference, phrasal, experience span |
| **M4 Problem & work** | 29–32 | Problems, issues, business, **mock** | Giải quyết vấn đề, health/global, email/meeting, **B1 exit** |

**Exit can-do B1 (product definition — § foundation):**
1. Hội thoại topic quen **5–10 phút** không script  
2. Hiểu ý chính speech rõ (work/daily/news simplified)  
3. Kể trải nghiệm + lý do + kế hoạch  
4. Xử lý misunderstanding (repeat/paraphrase)  
5. Intelligibility: người lạ hiểu phần lớn không lặp >1  
6. Unit-32 mock + self-check B1  

**Grammar spine B1:** narrative tenses · future forms · modals obligation · conditionals · passive · relative · gerund/inf · causative · PPC · problem language · reporting/business · integrated mock  

**Job spine (song song Business track):** units 17,22,24,25,27–29,31 (và extension 35,40) — **ưu tiên depth** các unit này cho adult VN.

---

### P4 — Extension B2 (unit-33 → 42)

**Không bắt buộc cho “dùng được”.**  
Can-do: hypothesize, regret, formal/academic, persuasion, cohesion, exam topics, B2 assessment.  
Chỉ recommend sau B1 checkpoint pass.

---

## 4. Micro-design: một unit = một “buổi học chuẩn”

**Cố định** (`learning-flow.ts`) — không redesign:

| # | Section | Chương trình yêu cầu thêm (depth, không đổi order) |
|---|---------|-----------------------------------------------------|
| 1 | Khởi động | situation **gắn phase can-do**; SRS warmup |
| 2 | Từ vựng | 8–20 high-freq + **L1**; chunks nói được |
| 3 | Ngữ pháp | 1 point chính / unit; CCQ; vnNote |
| 4 | Luyện tập | ~80% success; weak-type adaptive hint |
| 5 | Hội thoại | ≥2; ≥1 job nếu adult path; coverage 98% |
| 6 | Phản xạ | fluency ≥5 known items |
| 7 | Dịch VN→EN | ≥3 production |
| 8 | Shadowing | 3-pass khuyến nghị (listen → shadow → free) |
| 9 | Luyện nói | level1 controlled + level2 freer **đúng topic unit** |
| 10 | Quiz + cumulative | spiral; seed FSRS |

**Thời lượng chương trình khuyến nghị / unit:**  
`estimatedTime` metadata + **+10–15 phút** speaking hub nếu user chọn “B1 speaking goal”.

---

## 5. Hệ thống dọc (không nằm trong 1 unit)

| Hệ thống | Vai trò trong chương trình |
|----------|----------------------------|
| **Placement** | Vào đúng phase (A0/A1/A2/B1/B2 start index) |
| **FSRS flashcards** | Spiral vocab/grammar suốt path; daily 5–15′ |
| **Speaking hub** | Shadow / roleplay / journal / phoneme — **phút nói/tuần** là metric B1 |
| **Daily plan** | 1 CTA: “Hôm nay: unit X **hoặc** ôn due **hoặc** 10′ speak” |
| **Business track** | Lát cắt career trên subset unit (không path song song bắt buộc trước B1) |
| **Checkpoint A2** | unit-18 + task nói |
| **Checkpoint B1 ★** | unit-32 + can-do pack + speaking sample |
| **Certificate** | A2 mid · **B1 core** · B2 extend |

---

## 6. Nhịp học đề xuất (program rhythm)

### 6.1 Tuần mẫu (30–40′ × 5 ngày) — tối ưu tới B1

| Ngày | Focus |
|------|--------|
| T2 | 1 unit section 1–5 (input + practice) |
| T3 | Cùng unit section 6–10 (output + quiz) **hoặc** nốt unit |
| T4 | FSRS due + 10′ shadowing unit hiện tại |
| T5 | Unit tiếp **hoặc** roleplay job scenario |
| T6 | Weak review + journal 2–3′ speak |
| CN | Nghỉ / optional light SRS |

**Quy tắc chương trình:**  
- Không mở 2 unit “học mới” trong 1 ngày nếu FSRS due > 20 thẻ.  
- Mỗi unit mới ≥ 1 lần **output nói** trước khi “Hoàn thành”.

### 6.2 Daily minimum (giữ streak có nghĩa B1)

| Tối thiểu | Ý nghĩa |
|-----------|---------|
| 15′ | SRS **hoặc** 1 half-unit **hoặc** 10′ speak |
| 25–40′ | Progress unit thật |
| Speaking ≥ **60–90′ / tuần** | Điều kiện êm tới B1 intelligibility |

---

## 7. Điểm vào / ra (placement & gates)

```
Placement test / self-level
    ├─ A0 → unit-a0-1
    ├─ A1 → unit-1
    ├─ A2 → unit-13
    ├─ B1 → unit-19
    └─ B2 → unit-33  (extension; vẫn gợi ý ôn B1 mock nếu speak yếu)

Mid-gate A2:  complete unit-18 + speak task + self-check
Core-gate B1: complete unit-32 + B1 can-do pack + speak 5′ sample
Extend:       unit-33+ optional
```

**Remediation (thiết kế):**  
Fail gate → không “tụt level XP”; **remedia playlist**: 3 unit yếu + 7 ngày speak drill + FSRS hard words → retest gate.

---

## 8. Ma trận ưu tiên depth (xây tiếp — không rewrite list unit)

Khi “xây chương trình” = **nâng chất**, không đổi id:

| Ưu tiên | Phạm vi | Việc |
|--------|---------|------|
| **P0** | unit-19…32 (B1) | Can-do rõ, job dialogue, L1, speaking L2 chất |
| **P0** | unit-32 | Mock B1 thật (4 skills light + speak) |
| **P0** | unit-18 | A2 gate đáng tin |
| **P1** | unit-1…12 | Chuẩn unit1 parity; job seed |
| **P1** | Business subset | 17,22,24,25,27–29,31 depth career |
| **P1** | A0 | Intelligibility & confidence zero |
| **P2** | B2 33–42 | Sau khi B1 gate ổn |
| **P2** | Listening lab module | Extensive input (optional route) |

---

## 9. Metric chương trình (dashboard / research)

| Metric | Phase |
|--------|-------|
| Units completed on core path | Progress bar **tới B1** (không chỉ total XP) |
| % path to unit-32 | Primary completion |
| Speaking minutes / week | Quality leading indicator |
| A2 gate pass rate | Mid health |
| B1 gate pass rate | **North Star** |
| FSRS retention / due backlog | Overload guard |
| D30 still on path | Habit |

---

## 10. Message chương trình (product)

| Touchpoint | Nội dung |
|------------|----------|
| Landing | “Lộ trình tới **B1 — dùng được tiếng Anh độc lập**” |
| Onboarding goal | Default: **Đạt B1**; options: A2 nhanh / Job B1 |
| Roadmap UI | 4 phase core + badge “Gốc B1” tại unit-32 |
| Dashboard | “Còn X unit tới B1” + CTA hôm nay |
| After B1 | “Bạn đã đủ dùng độc lập — chọn B2 hoặc Business để tự nâng” |

---

## 11. Việc **không** làm trong thiết kế này

- Đổi thứ tự unit-19…32 hay gộp band  
- Thêm C1 track vào core  
- Biến Ato thành IELTS course (unit-41 chỉ là extension flavor)  
- Paywall trước B1 core  
- Bỏ output/speaking để “học nhanh”  

---

## 12. Lộ trình triển khai thiết kế → product (engineering)

| Bước | Deliverable | Effort |
|------|-------------|--------|
| 1 | Doc này + foundation B1 (**done**) | — |
| 2 | `program-phases.ts` constants (phase → unit ids, can-do VI) | S |
| 3 | Roadmap/dashboard: progress **to B1** + phase labels | M |
| 4 | Onboarding default goal B1 + copy | S |
| 5 | Checkpoint A2/B1 UI (can-do checklist + speak prompt) | M |
| 6 | Content audit P0: unit-18, 19–32, 32 mock | L |
| 7 | Speaking weekly goal tied to B1 | M |
| 8 | Certificate B1 = primary award | S |

---

## 13. Tóm tắt một trang

```
CHƯƠNG TRÌNH ATOENGLISH
═══════════════════════
Đích:     B1 Independent (“dùng được”)
Core:     A0→A1→A2→B1  (40 units, end unit-32)
Mid gate: A2 (unit-18)
Core gate:B1 (unit-32 + can-do + speak)
Extend:   B2 + Business (tự phát triển)
Mỗi bài:  IPOR 10 + L1 + output nói
Nhịp:     25–40′/ngày · ≥60–90′ speak/tuần
Xây tiếp: depth B1 & gates — không viết lại path
```

---

## 14. Liên kết SSOT

| Doc / code | Vai trò |
|-------------|---------|
| `LESSON_SYSTEM_FOUNDATION.md` | Khoa học + blueprint + B1 north star |
| **This file** | Thiết kế chương trình (phases, can-do, rhythm, gates) |
| `src/lib/constants/product-outcome.ts` | endUnitId unit-32, promise |
| `src/lib/constants/units.ts` | Danh sách unit (không fork) |
| `src/lib/constants/business-track.ts` | Lát cắt career |
| `src/lib/lessons/*` | Micro lesson OS |

---

**Cam kết thiết kế:** Mọi thay đổi chương trình sau này = **cập nhật phase/can-do/gate/nhịp** hoặc **depth unit**, không tạo “curriculum v2” song song trừ khi product owner chốt rebuild.

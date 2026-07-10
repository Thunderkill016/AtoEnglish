# AtoEnglish v2 — Product Rebuild

> **Status:** In progress (WS0+)  
> **Locked:** Full product rebuild · archive curriculum v1 · new A0→B1 path · outcome **B1 Independent User**  
> **Stack:** Keep Next.js 16 · Supabase · Tailwind · FSRS · Vercel  
> **Plan source:** session plan (approved)

---

## 1. North Star

Người học đạt **CEFR B1** — dùng tiếng Anh **độc lập** (can-do + speaking intelligibility).  
Sau B1: tự phát triển (B2/business) — không phải core v2.0.

Promise VI: *“Đạt B1 — đủ để dùng tiếng Anh độc lập trong đời sống và công việc cơ bản.”*

---

## 2. What changes

| Layer | v1 | v2 |
|-------|----|----|
| Curriculum | 50 units `unit*.ts` | New `l-*` lessons A0→B1 only at launch |
| Lesson shape | Mega UnitData + 10 IPOR sections | **LessonSpec** stages + time budget |
| Complete rule | Mostly quiz/path | **Task attempt + quiz floor ≥50%** (soft re-try; code: `canMarkLessonComplete`) |
| Progress | XP-heavy | **% path to B1** + speak minutes + gates |
| IA | Many tabs/features | Home · Learn · Review · Speak · Path · Me |
| B2 / leagues | Shipped | Deferred |

---

## 3. LessonSpec v2 rules (research)

1. One grammar spine per lesson  
2. Pre-teach **≤8–12** core lexis (+ L1); not a 20-min dictionary dump  
3. Dialogue after lexis; ~98% coverage  
4. Fluency = **known only**  
5. Freer **task** with communicative outcome (TBLT hybrid)  
6. Stages ~35–45 min total  
7. Every lesson: measurable `canDo[]`

Stages: Engage → Lexis → Grammar → Controlled → Input → Fluency → Task → Review  

Code: `src/lib/v2/lesson-spec.ts` · content: `src/lib/v2/lessons/`

---

## 4. Program shape (core)

| Phase | CEFR | Target # | Gate |
|-------|------|----------|------|
| P0 | A0 | 6–8 | — |
| P1 | A1 | 10–12 | — |
| P2 | A2 | 6–8 | Gate A2 |
| P3 | B1 | 12–14 | **Gate B1** |

IDs: `l-a0-01` … `l-b1-14`.  
v1 path (`unit-a0-1`…`unit-32`) → `archive/curriculum-v1/` (logical freeze first; physical move at cutover).

---

## 5. Feature flag

```ts
// src/lib/v2/flag.ts
isCurriculumV2() // env NEXT_PUBLIC_CURRICULUM_V2 === "1" | true
```

- `false` (default): production keeps v1 routes  
- `true`: new users / preview use v2 learn path  

---

## 6. Routes v2 (incremental)

| Route | Status |
|-------|--------|
| `/learn/v2/[lessonId]` | Player v2 (pilots live) |
| `/home` | Daily CTA + progress to B1 |
| `/path` | Full 42-slot roadmap |
| v1 `/learn/[unitSlug]` | Live until cutover |

**Authored (playable):** `l-a0-01`…`l-a0-08` (P0 complete), `l-a1-01`…`l-a1-04`, `l-b1-01`  
**Progress:** localStorage `ato_v2_progress` until DB migration  
**Complete gate (player):** task attempt («Tôi đã nói xong») + quiz ≥1 answer + **≥50%** correct — else VI re-try «Làm lại quiz» (`src/lib/v2/progress.ts`).  
**Content factory priority:** P0 done — sequential A1 (`l-a1-05`…) next; no empty maintenance-only autopilot.

---

## 7. Workstreams

| WS | Deliverable |
|----|-------------|
| 0 | Docs, flag, archive policy, LessonSpec types |
| 1 | Player + 3 pilots (incl. gold A1) |
| 2 | Full A0→B1 content factory |
| 3 | Home / path / placement / progress |
| 4 | FSRS seed + speak loop |
| 5 | Gates A2/B1 + cert |
| 6 | Cutover flag production |

---

## 8. Non-negotiables

- Do not delete `main` deployability without flag  
- Do not disable RLS  
- Content must pass Zod LessonSpec gates  
- No C1/IELTS core in v2.0  
- Guest try-lesson kept (acquisition)

---

## 9. Related docs

- `LESSON_SYSTEM_FOUNDATION.md` — pedagogy constitution (still valid)  
- `CURRICULUM_PROGRAM.md` — phase/can-do design (adapt to new ids)  
- `archive/curriculum-v1/README.md` — freeze policy for old units  

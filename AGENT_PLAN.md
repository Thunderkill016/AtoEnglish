# Agent Plan — TASK-307 in progress

> Autopilot 2026-07-15

## TASK-307 — Author l-b1-12 Sức khỏe & xã hội

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | B1 health & social language (symptoms, advice should/ought to, social plans); work wellness + life; spiral b1-11 problem–solution |
| Files | `src/lib/v2/lessons/l-b1-12.ts` · `index.ts` · `lesson-spec-v2.test.ts` |
| Gates | schema OK · lint 0 · unit tests pass |

### Steps

1. Author `l-b1-12.ts` from gold `l-b1-11` shape
2. Register in `index.ts`
3. Extend sequential path + registry tests
4. lint + test → commit + push

### Content spine

- **Grammar:** should / ought to (advice); symptom frames I have a… / My … hurts; social How about… / Shall we… / Why don't we…
- **Lexis:** ~12 items (symptoms, headache, fever, tired, rest, should, ought to, wellness, appointment, plan, cancel, feel better)
- **Dialogues:** Work wellness (colleague unwell) · Social plan weekend
- **Spiral:** b1-11 The problem is… / One solution is… / We could…
- **Task:** 45–60s speak — symptom/advice OR social plan + optional problem–solution spiral

### Risks

- Push may block (GitHub archive / GitLab publickey) — local main SSOT if so
- Schema min/max on lexis/dialogues/quiz — stick to l-b1-11 counts

### Next ready

TASK-308 Author l-b1-13 Giao tiếp công sở (ready ≥2, skip refill)

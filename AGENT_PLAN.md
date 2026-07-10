# Agent Plan — TASK-280

> Autopilot 2026-07-10: FSRS seed from v2 LessonSpec lexis on lesson complete.

| Field | Value |
|-------|-------|
| Task | TASK-280 — FSRS seed from v2 LessonSpec lexis |
| Status | **in_progress** |
| Scope | On v2 complete → upsert `cards` from `lesson.lexis` (auth users) |

## Goal

When a learner finishes a v2 lesson (`markLessonComplete`), seed FSRS flashcards from that lesson’s lexis so `/flashcards` shows the new words (same pattern as v1 `completeUnit` / `seedUnitVocabToSRS`).

## Steps

1. Pure mapper: `LessonSpec.lexis` → seed payload (dedupe, cap 30).
2. Server action `seedV2LessonLexisToSRS(lessonId)`: rate limit + Zod lessonId → `getLessonV2` → upsert `cards` (`onConflict: user_id,word`, ignoreDuplicates). Guest / unauth → silent no-op.
3. Wire `LessonPlayerV2` fire-and-forget after successful complete gate.
4. Unit tests for mapper + schema; lint + test.
5. Commit + `bash scripts/git-push.sh main`; backlog done + nhật ký.

## Risks

| Risk | Mitigation |
|------|------------|
| Client-forged vocab | Server loads lexis from registry by `lessonId` only |
| Guest complete | No auth → `{ success: false, added: 0 }`; local progress still works |
| Duplicate words across lessons | `ignoreDuplicates` on `(user_id, word)` |
| Rate limit abuse | Existing seed-vocab style limiter 20/min |

## Out of scope

- DB migration for v2 progress (TASK-279)
- E2E smoke (TASK-281)
- Changing FSRS algorithm params

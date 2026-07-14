# Agent Plan — TASK-314

> Autopilot 2026-07-15 — no user present

## TASK-314 — FSRS seed from LessonSpec lexis on v2 complete

| Field | Value |
|-------|-------|
| Status | **done** |
| Goal | On LessonPlayerV2 mark-complete, seed reviewable FSRS cards from lexis + target phrases (fluency). Guest → localStorage cards; auth → `cards` upsert when DB up. Pure helpers + unit tests; no schema change. |
| Builds on | TASK-280 (`lexisToSeedVocab`, `seedV2LessonLexisToSRS`) |

### Steps

1. Extend pure helpers in `src/lib/v2/seed-lexis.ts`:
   - Map fluency target phrases → seed rows
   - `lessonToSeedVocab(lesson)` = lexis ∪ phrases, dedupe, cap
2. Add `src/lib/v2/local-cards.ts`: localStorage deck for guests / offline (merge seed, load due)
3. Wire `LessonPlayerV2` mark-complete: always seed local; keep fire-and-forget `seedV2LessonLexisToSRS`
4. Update server action to seed lexis **+** fluency phrases via shared helper
5. FlashcardsClient: if server returns unauth/error empty, fall back to local cards + local review
6. Unit tests for pure helpers + local merge; lint + test
7. Commit + push; backlog done + nhật ký + SHA

### Risks

| Risk | Mitigation |
|------|------------|
| Supabase project removed (TASK-313) | Local seed always runs; auth upsert fails soft (added:0) |
| Phrase collisions with lexis words | Dedupe by lowercased `word` |
| Guest flashcards empty UX | Local storage + FlashcardsClient fallback |
| Schema change temptation | No — reuse `cards` table + localStorage only |

### Done khi

- Completing v2 lesson creates reviewable cards from lexis + target phrases
- Guest local cards without manual add
- Auth path still uses existing `cards` upsert
- Unit tests + lint/test green
- Graceful when Supabase down

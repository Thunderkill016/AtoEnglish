# Agent Plan — TASK-280 complete (local)

> Autopilot 2026-07-10: FSRS seed from v2 LessonSpec lexis on lesson complete.

| Field | Value |
|-------|-------|
| Task | TASK-280 — FSRS seed from v2 LessonSpec lexis |
| Status | **done** |
| Commit | `ad08732` |
| Gates | lint 0 · 228 tests pass |

## Delivered

- **`src/lib/v2/seed-lexis.ts`** — pure `lexisToSeedVocab` (dedupe, cap 30)
- **`seedV2LessonLexisToSRS(lessonId)`** in `cards.ts` — rate limit + Zod + registry load + upsert `cards` (`user_id,word`, ignoreDuplicates); topic = lessonId; level = cefr
- **`SeedV2LessonLexisSchema`** in validation.ts
- **`LessonPlayerV2`** — fire-and-forget after `markLessonComplete`
- **Tests** `seed-lexis-v2.test.ts` (mapper + schema + l-a1-01 gold)

## Push

Attempt `bash scripts/git-push.sh main`. If GitHub archive / GitLab key fail, code stays on local `main` only.

## Next ready

TASK-281 / TASK-282 (pick first ready in backlog)

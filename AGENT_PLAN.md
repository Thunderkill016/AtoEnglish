# Agent Plan — TASK-279 complete (local)

> Autopilot 2026-07-10: v2 progress Supabase persistence.

| Field | Value |
|-------|-------|
| Task | TASK-279 — v2 progress Supabase persistence |
| Status | **done** |
| Gates | lint 0 · 233 unit tests · tsc 0 |

## Delivered

- **Migration** `supabase/migrations/20260710130000_user_v2_lesson_progress.sql` — table + RLS select/insert/update own; no delete; lesson_id check
- **Types** `user_v2_lesson_progress` in `src/types/supabase.ts` (hand-patched; apply migration on prod when secret available)
- **Actions** `src/app/actions/v2-progress.ts` — `completeV2Lesson`, `fetchV2LessonProgress`, `syncV2ProgressFromLocal` (+ rate limit + Zod)
- **Client** `markLessonComplete` still local; player dual-writes DB; `V2ProgressHydrator` push→pull→merge once per session (auth + `NEXT_PUBLIC_CURRICULUM_V2`)
- **Pure merge** `mergeLessonRecords` + tests (union / earlier completedAt / max quiz)

## Ops note

Apply migration to Supabase prod when credentials allow (`supabase db push` or SQL editor). Code is safe if table missing: actions return soft failure; guests unaffected.

## Next ready

TASK-283 — Speaking subroutes Ato chrome

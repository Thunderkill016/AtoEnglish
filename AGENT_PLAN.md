# Agent Plan — TASK-311

> Autopilot 2026-07-15 · no user present · autonomous

## TASK-311 — Home continue CTA walks full sequential path to l-b1-14

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | Continue on `/home` advances through completed ids; clear end after `l-b1-14` (congrats + review) |
| Scope | `getNextPlayableLessonId` / `getContinueLessonId` / HomeClient / tests |
| Non-goals | Path UI (TASK-310 done), DB migration, new lessons |

### Problem

1. `getContinueLessonId` falls back to `l-a0-01` when path is complete → UI shows “Học lại” first lesson instead of B1 congrats.
2. Home still says “pilot” though registry is 42/42.
3. No unit tests for end-of-path / full sequential walk via continue helpers.

### Steps

1. Add `isCorePathComplete(completedIds)` — all authored CORE_PATH nodes done.
2. Keep `getNextPlayableLessonId` → null when complete; `getContinueLessonId` returns next or `CORE_END_LESSON_ID` for review only when complete (not empty progress).
3. HomeClient: if path complete → congrats (CORE_OUTCOME) + CTA ôn `l-b1-14` + path/flashcards; else sequential continue.
4. Honest copy (drop pilot wording when full registry).
5. Tests in `navigation-v2.test.ts`: sequential advance + end state; primary learn href still `/home` under v2.
6. lint + test → commit → git-push.sh main → backlog done.

### Risks

- Push may block (GitHub archive / GitLab publickey) — local main remains SSOT.
- Empty progress must still open `l-a0-01`, not end state.

### Done khi

- unit tests end-of-path; guest+auth share pure continue helpers (localStorage snapshot → same ids)
- lint + test pass

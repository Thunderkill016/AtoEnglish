# Agent Plan — TASK-286 complete (local)

> Autopilot 2026-07-14: LessonSpec `l-a2-03` comparatives/superlatives + recommend.

| Field | Value |
|-------|-------|
| Task | TASK-286 — Author l-a2-03 So sánh & đề xuất (comparatives) |
| Status | **done** |
| Gates | lint 0 · 233 unit tests |

## Delivered

- **Content** `src/lib/v2/lessons/l-a2-03.ts` — A2/P2 compare & recommend survival
  - Grammar: -er / more + adj · the -est / the most · I recommend…
  - Lexis 10 items, L1 notes 100% (schema A2)
  - `jobAngle`: Office pick — Which option is better? I recommend…
  - 2 dialogues (shop laptop + office vendor), 5 listen, 8 fluency, speak task, quiz+spiral (future a2-02, past a2-01, shop a1-07)
- **Registry** `index.ts` → `l-a2-03`
- **Path** already had order 23 after `l-a2-02`
- **Tests** getLesson + next playable after a2-02 → a2-03

## Push

`bash scripts/git-push.sh main` — may block (GitHub archive read-only). Local commit on `main`.

## Next ready

TASK-288 — l-a2-04 present perfect intro · TASK-283 — Speaking subroutes Ato chrome

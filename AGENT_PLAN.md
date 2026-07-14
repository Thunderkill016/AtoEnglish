# Agent Plan — TASK-311 complete

> Autopilot 2026-07-15

## TASK-311 — Home continue CTA walks full sequential path to l-b1-14

| Field | Value |
|-------|-------|
| Status | **done** |
| Goal | Continue on `/home` advances through completed ids; clear end after `l-b1-14` |
| Commit | `15f591e` |
| Gates | lint · 243 unit tests |
| Push | try `git-push.sh main`; may block (GitHub archive / GitLab key) |

### Changes

1. **`isCorePathComplete` / `getContinueLessonId`** (`src/lib/v2/lessons/index.ts`)
   - Next uncompleted authored CORE_PATH node
   - When all done → continue id = `CORE_END_LESSON_ID` (`l-b1-14`) for review
2. **`HomeClient`**: path-complete congrats (B1 Independent User) + CTAs ôn cổng / path / flashcards; drop pilot copy
3. **Tests** `navigation-v2.test.ts`: full sequential walk, end state, `/home` under v2

### Risks remaining

- Direct URL still bypasses path lock (out of scope)
- Push may fail — local main SSOT

### Next ready

TASK-312 — product-radar: mark /path critical + /me /flashcards smoke notes

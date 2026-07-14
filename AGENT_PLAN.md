# Agent Plan — TASK-310 complete

> Autopilot 2026-07-15

## TASK-310 — Path UI: unlock all authored CORE_PATH lessons + honest copy

| Field | Value |
|-------|-------|
| Status | **done** |
| Goal | `/path` reflects full A0→B1 (42 LessonSpecs); honest copy; sequential progress lock |
| Commit | `defcb28` (docs follow-up `6322ce7`) |
| Gates | lint · 237 unit tests |
| Push | blocked — GitHub archive + GitLab publickey; local main SSOT |

### Changes

1. **`isPathLessonOpenable` / `countAuthoredOnCorePath`** in `src/lib/v2/lessons/index.ts`
   - Open if registry has content and (completed for re-review **or** all earlier authored path nodes completed)
2. **`PathClient`**: sequential Link vs lock; header when 42/42: full A0→B1 Independent User (no pilot / đang soạn)
3. **Tests** in `navigation-v2.test.ts`: registry full path, empty frontier, sequential unlock

### Risks remaining

- Direct URL `/learn/v2/l-*` can still bypass path UI lock (player-level gate out of scope)
- Git push may block (GitHub archive / GitLab publickey) — local main SSOT

### Next ready

TASK-311 — Home continue CTA walks full sequential path to l-b1-14

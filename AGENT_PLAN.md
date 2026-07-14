# Agent Plan — TASK-310

> Autopilot 2026-07-15

## TASK-310 — Path UI: unlock all authored CORE_PATH lessons + honest copy

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | `/path` reflects full A0→B1 (42 LessonSpecs); honest copy (no pilot/đang soạn); sequential progress lock |
| Files | `src/lib/v2/lessons/index.ts` · `src/app/(main)/path/PathClient.tsx` · `src/__tests__/navigation-v2.test.ts` (or path tests) |
| Gates | lint · unit tests · path unlock pure fn covered |

### Root cause

- Registry has **42/42** CORE_PATH lessons (`listAuthoredLessonIds` / `LESSON_MODULES`).
- `PathClient` already uses `getLessonV2` for `hasContent`, so nodes are not pilot-filtered — but **header copy** still says pilot / đang soạn.
- All content nodes are **unconditionally** linked — no sequential lock for incomplete progress.

### Steps

1. Add pure `isPathLessonOpenable(lessonId, completedIds)`:
   - must have registry content
   - completed lessons always openable (re-review)
   - else all earlier path lessons with content must be completed
2. PathClient: use openable for Link vs lock UI; honest header when registry covers full plan
3. Unit tests for sequential frontier + completed re-open
4. lint + test → commit → push → backlog done

### Risks

- Circular import: keep helper in `lessons/index.ts` (already imports `CORE_PATH_PLAN`)
- Git push may block (archive / GitLab key) — local main SSOT if so
- Direct URL `/learn/v2/l-*` may still bypass path UI lock (out of scope; path UX only)

### Next ready after

TASK-311 — Home continue CTA full sequential path

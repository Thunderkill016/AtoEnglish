# Agent Plan — TASK-297 in progress

> Autopilot 2026-07-15

## TASK-297 — Author l-b1-02 Tin tức & ý chính

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | B1 short news: main idea (read/listen); past + present + opinion light; spiral a2-08 gate; L1 ≥50% |
| Files | `src/lib/v2/lessons/l-b1-02.ts` · `index.ts` · `lesson-spec-v2.test.ts` |
| Gates | schema OK · lint 0 · unit tests pass |

### Steps

1. Author `l-b1-02` LessonSpec (news lexis, main-idea listen/dialogues, past+present+opinion grammar)
2. Register in `lessons/index.ts`
3. Tests: registry title/cefr + sequential path after `l-b1-01` → `l-b1-02`
4. lint + test → commit + `bash scripts/git-push.sh main`

### Risks

- Git push may block (GitHub archive read-only; GitLab publickey) — local main remains SSOT
- Keep B1 L1 ratio ≥50% (schema); prefer ≥70% for quality
- Spiral must sample a2-08 gate (past / plan / experience / work / help), not invent new A2 forms

### Next ready

TASK-298 (l-b1-03 Dự đoán & xu hướng) after 297 done.

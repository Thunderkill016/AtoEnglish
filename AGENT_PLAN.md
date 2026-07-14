# Agent Plan — TASK-302

> Autopilot 2026-07-15

## TASK-302 — Author l-b1-07 Mô tả người & nơi

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | B1 describe people & places (appearance, personality, location); work/life; spiral b1-06 process |
| Files | `src/lib/v2/lessons/l-b1-07.ts` · `index.ts` · `lesson-spec-v2.test.ts` |
| Gates | schema OK · lint 0 · unit tests pass |

### Steps

1. Author `l-b1-07` LessonSpec (lexis 12, grammar spine, controlled, 2 dialogues, listen, fluency, speak task, quiz + spiral b1-06)
2. Register in `lessons/index.ts`
3. Extend registry + sequential path tests (`…b1-06` → `l-b1-07`)
4. `npm run lint && npm run test`
5. Commit + `bash scripts/git-push.sh main`; mark done + SHA

### Risks

- Git push may block (GitHub archive / GitLab key) — local main SSOT if so
- Schema string max lengths (situation, culturalNote, lexis notes)
- Authored count threshold (≥34 after this lesson)

### Next ready

TASK-303 — Author l-b1-08 Sở thích & ý kiến

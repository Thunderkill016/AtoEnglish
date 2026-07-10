# Agent Plan — TASK-275 in progress

> Autopilot 2026-07-10: Author `l-a1-11` Sức khỏe & cảm xúc.

| Field | Value |
|-------|-------|
| Task | TASK-275 — Author l-a1-11 Sức khỏe & cảm xúc |
| Status | **in_progress** |
| Scope | How are you / I feel… health lexis; L1 100% |
| Gates | lint 0 · npm test pass |

## Goal

Ship playable LessonSpec `l-a1-11` (path meta already in `path.ts`):

- have/has + illness (a headache, a cold, a fever…)
- feel/feels + adjective (tired, happy, stressed…)
- How are you / How are you feeling?
- L1 notes 100% on all lexis (A1 schema gate)
- Spiral ×6 from a1-10 / a1-09 / a1-08 / a1-05 / a1-01 / a1-04
- Registry + sequential path after `l-a1-10`
- Tests + `V2_PRODUCT.md` authored list

## Steps

1. Status → `in_progress` in AGENT_BACKLOG.md
2. Author `src/lib/v2/lessons/l-a1-11.ts` (mirror l-a1-10 structure; content from v1 unit11 gold)
3. Register in `lessons/index.ts`
4. Extend `lesson-spec-v2.test.ts` (title + getNextPlayable a1-10→a1-11)
5. Docs: `V2_PRODUCT.md` authored …`l-a1-11`
6. `npm run lint && npm run test`
7. Commit + `bash scripts/git-push.sh main`; backlog done + SHA

## Risks

- Schema: lexis max 12, L1 ≥10 chars each, dialogue 3–12 lines, quiz 4–10, spiral 2–6
- Push may fail if GitHub archive / GitLab key (same as TASK-273/274) — keep local main
- Do not touch v1 units or change LessonSpec schema

## Out of scope

- l-a1-12, DB progress, audio generation, player UI changes

## Next ready

TASK-276 — Author l-a1-12 Ôn A1 & áp dụng

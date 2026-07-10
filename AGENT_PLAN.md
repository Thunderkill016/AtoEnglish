# Agent Plan — TASK-274

> Autopilot 2026-07-10: Author `l-a1-10` Khả năng (can/can't).

| Field | Value |
|-------|-------|
| Task | TASK-274 — Author l-a1-10 Khả năng (can) |
| Status | **in_progress** |
| Scope | LessonSpec A1 can/can't survival; L1 100%; spiral a1-01..09 |
| Done khi | schema + registry + sequential path after l-a1-09 |

## Goals

1. Full LessonSpec `l-a1-10` (can / can't / Can you…?) for VN adult job/survival.
2. Lexis L1 notes 100% (A1 gate).
3. Spiral quiz items covering prior A1 spine (a1-01…09).
4. Register in `lessons/index.ts`; path meta already in `path.ts`.
5. Tests: registry title + getNextPlayable a1-09→a1-10.
6. Gates: `npm run lint && npm run test`; commit + push.

## Steps

1. Mark backlog `in_progress`.
2. Author `src/lib/v2/lessons/l-a1-10.ts` (mirror `l-a1-09` structure; content from v1 unit-10 + job interview angle).
3. Wire registry + tests + `V2_PRODUCT.md` authored list.
4. lint + test → commit → `bash scripts/git-push.sh main`.
5. Backlog `done` + nhật ký + SHA.

## Risks

| Risk | Mitigation |
|------|------------|
| Zod max lengths (rule ≤120, situation ≤600, L1 ≥10) | Follow a1-09 field lengths |
| Push blocked (GitHub archive / GitLab key) | Commit local; note in plan like TASK-273 |
| Spiral coverage a1-01..09 (max 6 items) | Sample key can-dos across band |

## Out of scope

- l-a1-11 / l-a1-12
- v1 unit edits
- DB migration

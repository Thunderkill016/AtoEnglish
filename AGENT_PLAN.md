# Agent Plan — TASK-282 in progress

> Autopilot 2026-07-10: First A2 LessonSpec `l-a2-01` — past simple survival (kể chuyện quá khứ).

| Field | Value |
|-------|-------|
| Task | TASK-282 — Author l-a2-01 Kể chuyện quá khứ |
| Status | **in_progress** |
| Scope | New LessonSpec only + registry + path already planned |
| Gates | lint · unit tests · schema parse |

## Goal

Ship first P2/A2 lesson after A1 gate (`l-a1-12`): past simple survival so learners can tell a short yesterday/last-week story with L1 notes meeting A2 band (schema = 100% lexis L1).

## Steps

1. Author `src/lib/v2/lessons/l-a2-01.ts` (past simple: was/were, did, went, had, yesterday/last…)
2. Register in `lessons/index.ts`
3. Extend `lesson-spec-v2.test.ts` (registry + next after a1-12 → a2-01)
4. `npm run lint && npm run test`
5. Commit + push; backlog done + SHA

## Risks

| Risk | Mitigation |
|------|------------|
| Schema L1 100% for A2 | Every lexis item has `l1_note_vi` ≥10 chars |
| Phase/cefr mismatch | phase `P2` + cefr `A2` |
| Push blocked (archive remotes) | Local commit; document push failure |

## Out of scope

- Full A2 spine (a2-02…08)
- UI chrome, DB, e2e for a2-01
- v1 unit*.ts changes

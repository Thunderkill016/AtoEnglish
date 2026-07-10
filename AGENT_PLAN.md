# Agent Plan — TASK-273 complete (local)

> Autopilot 2026-07-10: Author `l-a1-09` Địa điểm & chỉ đường.

| Field | Value |
|-------|-------|
| Task | TASK-273 — Author l-a1-09 Địa điểm & chỉ đường |
| Status | **done** — lint0 · 222 tests |
| Scope | Places in town; Where is…? / next to / opposite / turn left. L1 100% |

## Delivered

- **`src/lib/v2/lessons/l-a1-09.ts`** full LessonSpec (12 lexis L1 100%, grammar, controlled×6, dialogue, listen×4, fluency×8, speak task, quiz×6, spiral×3 a1-08/a1-07)
- **Registry** `lessons/index.ts` + sequential path after `l-a1-08`
- **Tests** registry + getNextPlayable a1-08→a1-09
- **Docs** `V2_PRODUCT.md` authored …`l-a1-09`; next factory `l-a1-10`…

## Gates

lint 0 · 222 tests pass

## Push

`bash scripts/git-push.sh main` — if GitHub archived / GitLab key fail, code remains local main (same as TASK-284 note).

## Next ready

TASK-274 / 275 / 276 (v2 A1 content).

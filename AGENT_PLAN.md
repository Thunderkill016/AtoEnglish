# Agent Plan — TASK-296 in progress

> Autopilot 2026-07-15

## TASK-296 — Author l-a2-08 Cổng A2

| Field | Value |
|-------|-------|
| Status | **in_progress** |
| Goal | A2 review spiral + freer task; marks end A2 block / gate to B1 |
| Files | `src/lib/v2/lessons/l-a2-08.ts` · `index.ts` · `lesson-spec-v2.test.ts` |
| Pattern | Mirror `l-a1-12` gate: meta lexis + combined grammar spine + multi-topic spiral + freer speak task |
| Done khi | A2 8/8 authored; Home continue walks a2 path → b1-01; schema + lint + unit tests |

### Steps

1. Author `l-a2-08` — review past / future / compare / PP / work / help; L1 100%; freer task
2. Register in `lessons/index.ts`
3. Tests: registry title/jobAngle + sequential next after a2-07 → a2-08 → b1-01
4. `npm run lint && npm run test`
5. Commit + `bash scripts/git-push.sh main`; backlog done + nhật ký

### Risks

- Git push may block (GitHub archive / GitLab publickey) — local commit remains SSOT
- Spiral max 6 items — sample key A2 lessons, not all 7 equally deep
- No new grammar forms (gate = combine only)

### Out of scope

- New B1 lessons beyond existing l-b1-01
- Schema / SECTION_ORDER / FSRS changes
- Audio generation

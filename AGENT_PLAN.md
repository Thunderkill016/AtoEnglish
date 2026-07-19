# Agent Plan — TASK-312 / 315 / 316 (resume)

> 2026-07-20 — continue unfinished after autopilot CI stuck on FluencyItem

## Blocker fixed first

- `export type FluencyItem` missing from `lesson-spec.ts` → CI typecheck fail → daemon skipped all ready tasks
- Exported type; 255 unit tests green

## TASK-312 — product-radar critical

- `/path`, `/me`, `/flashcards` critical=1
- exit 1 when any critical path fails
- Planner notes for Me + flashcards smoke

## TASK-315 — E2E guest complete progress

- Extend `e2e/learn-v2-smoke.spec.ts` to assert `ato_v2_progress` contains `l-a1-01` after mark-complete

## TASK-316 — Soft-hide gamify on v2

- `getMeHubMore()` / explore actions / LeagueCard / progress leaderboard row gated by `isCurriculumV2()`
- Keep streak + daily goal; tests in navigation-v2

## Still blocked

- TASK-313 / 287: Supabase project removed — localStorage SSOT
- Remote push may still fail (GitHub archive / GitLab key) — local main SSOT

# Agent Plan — TASK-278 complete (local)

> Project archived 2026-07-10 (see `ARCHIVE.md`). TASK-278 implemented and committed locally; remote push blocked.

| Field | Value |
|-------|-------|
| Task | TASK-278 — Dashboard Ato Surface full migrate |
| Status | **done (local)** — push blocked |
| Commits | `6523720` feat · `e8d7886` docs |
| Gates | lint 0 · 222 tests pass |

## Delivered

- `DashboardClient` stats / stats panel / curriculum grid → `Surface` + dark zinc tokens
- Child cards: UnitCard, SrsCard, TodayMission, TodayPlanWidget, LevelProgressBar, QuickActions, WordOfDay, League, SpeakingFeed, WeeklyRecap, EfSetGoal — no primary `bg-white/60`
- Matches Home/landing glass dark brand (`bg-white/5`, `border-white/10`)

## Push block

| Remote | Result |
|--------|--------|
| `origin` (GitHub) | **archived read-only** |
| `gitlab` | Permission denied (publickey) |

Owner must unarchive GitHub or fix GitLab SSH before `git-push.sh main` succeeds.

## Next ready

TASK-284 (Progress + Me Ato polish) — only if product work resumes; archive policy says no new feature autopilot.

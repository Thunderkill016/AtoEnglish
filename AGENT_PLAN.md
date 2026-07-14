# Agent Plan — TASK-294 complete

> Autopilot 2026-07-15

## TASK-294 — Author l-a2-06 Công việc cơ bản

| Field | Value |
|-------|-------|
| Status | **done** |
| Goal | A2 workplace survival lexis + simple present work routines; office dialogues; L1 100% |
| Files | `src/lib/v2/lessons/l-a2-06.ts` · `index.ts` · `lesson-spec-v2.test.ts` |
| Gates | schema OK · lint 0 · **233** unit tests pass |

### Delivered

- **Grammar spine:** simple present work routines — I/you work · he/she works · start/finish at · What do you do?
- **Lexis:** 10 workplace items, L1 notes 100% (A2 gate)
- **Dialogues:** office intro (What do you do?) · standup light (remote/meeting/deadline)
- **Spiral review:** a2-05 for/since + a2-01 past simple contrast
- **Path:** sequential after `l-a2-05` → `l-a2-06`

### Risks remaining

- Git push may still block (GitHub archive / GitLab publickey) — local commit is SSOT
- Supabase removed (TASK-287) — progress table not live

### Next ready

TASK-292 path 404 closeout (if still ready) or TASK-295 l-a2-07 help requests.

### Commit

- `2ea11d0` feat(v2): l-a2-06 workplace simple present
- Push: attempt via `git-push.sh main`

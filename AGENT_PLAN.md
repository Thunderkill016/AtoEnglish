# Agent Plan — TASK-313

> Autopilot 2026-07-15 — no user present

## TASK-313 — Retry apply `user_v2_lesson_progress` (retry TASK-287)

| Field | Value |
|-------|-------|
| Status | **blocked** (infra) |
| Goal | Apply migration + RLS on live Supabase if secrets/project available; else document blocked and keep **localStorage SSOT** |
| Migration | `supabase/migrations/20260710130000_user_v2_lesson_progress.sql` |
| Code already shipped | TASK-279: actions, types, hydrator, dual-write |

### Steps executed

1. Confirm secrets present in `.env.local` (URL, anon, service role, access token) — **present**
2. Probe DNS `vhpfskkredizeazlyzsh.supabase.co` — **fail** (Could not resolve host)
3. Management API `GET /v1/projects/vhpfskkredizeazlyzsh` — **400 Resource has been removed**
4. Access token project list — only **MoneyFlow** (`fwpldsdkpzhswpuctbke`); not AtoEnglish
5. **Do not** apply AtoEnglish SQL to MoneyFlow (wrong product/DB)
6. Document: runtime SSOT remains **localStorage** `ato_v2_progress`; multi-device DB path stays offline until project restored
7. lint + unit tests (no app code change required for blocked path)
8. Commit docs + backlog; try `git-push.sh main`

### Risks / unblock path

| Risk | Mitigation |
|------|------------|
| Supabase project permanently deleted | Human recreate project → new URL/keys in env → `supabase link` → `supabase db push` → `npm run db:types` |
| Wrong-project apply | Never push to MoneyFlow |
| Auth dual-write fails silently | Client still writes localStorage; completeV2Lesson errors are non-fatal for guest/local UX |
| GitHub archive / GitLab key | Push may fail; local `main` remains SSOT |

### Outcome

- Migration **not** applied (project removed — same as TASK-287)
- **localStorage** remains sole live progress SSOT for v2
- Repo migration + types + client dual-write code remain ready for when DB returns

### Next ready

TASK-312 — product-radar: mark /path critical + /me /flashcards smoke notes

# Agent Plan — TASK-290 complete

> Autopilot 2026-07-15

## TASK-290 — P0 fix prod HTTP 404 on `/login`

| Field | Value |
|-------|-------|
| Status | **done** |
| Root cause | Same as TASK-289: Vercel project deleted (`DEPLOYMENT_NOT_FOUND`) — not a Next `/login` route or proxy bug |
| Route code | `src/app/login/page.tsx` present (`"use client"`); `proxy.ts` only rate-limits `/login` (429, not 404) |
| Live verify | `curl -sI https://atoenglish.vercel.app/login` → **HTTP 200**, `x-matched-path: /login` |
| Radar | **PASS=13 WARN=0 FAIL=0** (`/login` PASS) |
| Fix needed this session | **None** — restored by TASK-289 prod redeploy (`prj_2lnCWZp4PvBvuTBksDjMtPPruVqL`) |

### Steps executed

1. Reproduce live: `/login` and `/login?mode=signup` both 200
2. Confirm app route + proxy matcher (no rewrite/delete of login)
3. Re-run `bash scripts/product-radar.sh` → full green
4. Gates: lint + unit tests
5. Close backlog + nhật ký

### Risks

- Supabase still removed (TASK-287) — login UI loads but auth may fail at runtime
- Git push may still be blocked (GitHub archive read-only; GitLab publickey) — local commit is source of truth; live already OK via Vercel CLI deploy from TASK-289

### Next ready

TASK-291 `/home`, TASK-292 `/path` — also 200 on radar; expect same closeout pattern.

### Commit

- `7ec7527` docs(ops) close TASK-290
- `54102ba` nhật ký SHA
- Push: **blocked** (GitHub origin archived read-only; GitLab `Permission denied (publickey)`). Live already green via TASK-289 Vercel deploy.

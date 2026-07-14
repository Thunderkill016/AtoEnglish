# Agent Plan — TASK-291 complete

> Autopilot 2026-07-15

## TASK-291 — P0 fix prod HTTP 404 on `/home`

| Field | Value |
|-------|-------|
| Status | **done** |
| Root cause | Same as TASK-289/290: Vercel project deleted (`DEPLOYMENT_NOT_FOUND`) — not a Next `/home` route or proxy bug |
| Route code | `src/app/(main)/home/page.tsx` + `HomeClient.tsx` present; `proxy.ts` has no `/home` special-case |
| Live verify | `curl -sI https://atoenglish.vercel.app/home` → **HTTP 200**, `x-matched-path: /home` |
| Radar | **PASS=13 WARN=0 FAIL=0** (`/home` PASS) |
| Fix needed this session | **None** — restored by TASK-289 prod redeploy (`prj_2lnCWZp4PvBvuTBksDjMtPPruVqL`) |

### Steps executed

1. Reproduce live: `/home` → 200, matched path `/home`
2. Confirm app route under `(main)/home` (no rewrite/delete of home)
3. Re-run `bash scripts/product-radar.sh` → full green
4. Gates: lint + unit tests
5. Close backlog + nhật ký

### Risks

- Supabase still removed (TASK-287) — Home UI loads but auth/progress may fail at runtime
- Git push may still be blocked (GitHub archive read-only; GitLab publickey) — local commit is source of truth; live already OK via Vercel CLI deploy from TASK-289

### Next ready

TASK-292 `/path` — already 200 on radar; expect same closeout pattern.

### Commit

- `035f348` docs(ops) close TASK-291
- `f700ef7` chore(agent) auto-refill TASK-293..295
- Push: **blocked** (GitHub origin archived read-only; GitLab `Permission denied (publickey)`). Live already green via TASK-289 Vercel deploy.

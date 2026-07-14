# Agent Plan — TASK-292 complete

> Autopilot 2026-07-15

## TASK-292 — P0 fix prod HTTP 404 on /path

| Field | Value |
|-------|-------|
| Status | **done** |
| Goal | `/path` returns 200 on live; product-radar PASS for Path B1 |
| Files | Route already present: `src/app/(main)/path/page.tsx` + `PathClient.tsx` — **no code change** |
| Gates | live HTTP 200 · product-radar PASS=13 FAIL=0 · lint · unit tests |

### Root cause

Same class as TASK-289/290/291: earlier radar 404s came from **Vercel deploy / project missing** (`DEPLOYMENT_NOT_FOUND`), not from missing Next.js route or proxy block.

- Route: `src/app/(main)/path/page.tsx` → `PathClient` (CORE_PATH_PLAN A0→B1)
- Proxy: only rate-limits `/login` + `/auth/*` — no `/path` deny
- Live: `x-matched-path: /path`, HTTP 200 after TASK-289 recreate+deploy

### Verify

```text
curl -sI https://atoenglish.vercel.app/path → 200
bash scripts/product-radar.sh → PASS=13 WARN=0 FAIL=0
```

### Risks remaining

- Git push may block (GitHub archive / GitLab publickey) — local main SSOT
- Further radar tasks may still be queued if refill re-adds stale 404s; treat as verify-only if live already 200

### Next ready

Refill backlog if ready < 2; prefer content/ops pool from ROADMAP (core B1 path already complete via TASK-309)

### Commit

- docs(agent): TASK-292 /path live 200 verified; seed post-B1 pool (local main SSOT; push blocked)

- Push blocked: GitHub archive + GitLab publickey — local main SSOT

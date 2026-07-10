# Agent Plan — TASK-281 complete (local)

> Autopilot 2026-07-10: Playwright E2E smoke for v2 lesson `l-a1-01` (guest, stage walk + quiz floor).

| Field | Value |
|-------|-------|
| Task | TASK-281 — E2E v2 guest-or-auth complete smoke |
| Status | **done** |
| Commit | `149cc01` |
| Gates | lint 0 · 228 unit tests · Playwright chromium 2/2 pass |

## Delivered

- **`e2e/learn-v2-smoke.spec.ts`** — guest open `/learn/v2/l-a1-01`; stage smoke; full task + quiz floor → `lesson-complete`
- **`e2e/global-setup.ts`** — soft-fail when Supabase DNS/admin unreachable so guest smokes still run

## Verify

```bash
env -u CI npx dotenv -e .env.local -- playwright test e2e/learn-v2-smoke.spec.ts --project=chromium
# 2 passed
```

## Push

`bash scripts/git-push.sh main` — if GitHub archive / GitLab key fail, code stays on local `main`.

## Next ready

TASK-282 — Author l-a2-01

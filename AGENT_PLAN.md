# Agent Plan — TASK-278 (active session)

> Project archive notice stands in ARCHIVE.md; this session executes **TASK-278 only** per explicit autopilot mandate (user absent).

| Field | Value |
|-------|-------|
| Task | TASK-278 — Dashboard Ato Surface full migrate |
| Status | done — awaiting SHA after push |
| Scope | DashboardClient + dashboard card children shells |
| Out of scope | Landing rewrite, Progress/Me (TASK-284), FSRS/IPOR, schema |

## Mục tiêu

Dashboard cards use **Ato `Surface` / dark zinc only** — no primary `bg-white/60` light canvas; visual match Home/landing dark brand (`zinc-950` + glass `bg-white/5`).

## Bước

1. Mark TASK-278 `in_progress` in AGENT_BACKLOG.md
2. Migrate `DashboardClient.tsx` card shells → `Surface` (+ dark-only text/track tokens)
3. Migrate child card shells used on dashboard that still ship `bg-white/60` as primary fill
4. `npm run lint && npm run test`
5. Commit + `bash scripts/git-push.sh main`; backlog done + SHA + nhật ký
6. If ready &lt; 2 after done → refill from roadmap

## Rủi ro

| Risk | Mitigation |
|------|------------|
| Large dual light/dark class churn | Prefer Surface variant + zinc dark tokens; no logic changes |
| Child widgets still light | Fix outer shells in same task for “no light canvas” |
| Surface no onClick / as=a | Wrap with div/Link; Surface for chrome only |
| Over-scope residual pages | Progress/Me stays TASK-284 |

## Done khi

- No primary `bg-white/60` on dashboard card shells
- Dark brand visible (Surface glass / zinc)
- lint + unit tests pass; commit pushed

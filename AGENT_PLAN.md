# Agent Plan — Tự cập nhật mỗi phiên

## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | fix(agent): ban empty maintenance + pick UI first |
| Commit | 78ecc99 |
| Next pick | TASK-262 (Home redesign) |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-262 — UI Home redesign on primitives |
| Owner | Autopilot (user absent; autonomous) |

### TASK-262 — UI Home redesign on primitives
**Mục tiêu**: `HomeClient` compose Ato Surface kit — `Screen` (ato+ambient), `Surface`, `AppButton`, `PageHeader`, `Chip`. **Giữ** continue CTA (một quyết định → bài tiếp) + **B1 %** progress. Không đổi v2 path/progress logic, IPOR, FSRS, lesson content.

**Done khi:** Home dùng design-system CTAs/cards (không one-off gradient button); continue + B1 % còn; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS.md, BACKLOG (262 ready; 263–265 ready ≥2), PLAN prior TASK-257 done 6c12963 / shell 261 b5f678d, CONTENT_STYLE §6–7 (context only — no unit edit), inspect HomeClient + design-system + UI_SYSTEM.
2. BACKLOG TASK-262 → `in_progress`. Ready còn 263–265 ≥2 → skip refill.
3. PHASE3:
   - Rewrite `src/app/(main)/home/HomeClient.tsx` on primitives.
   - Keep: continue lesson CTA, B1 done/total + pct bar, pilot list, greeting, path link.
   - Prefer `AppButton` + `data-testid="continue-learning"` for time-to-lesson.
   - Optional: touch `docs/UI_SYSTEM.md` TASK-262 ✅ note.
4. `npm run lint && npm run test`; tsc if needed.
5. Log `logs/agent/*_TASK-262.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Break layout vs BottomNav padding — Screen already accounts for shell.
- Accidental logic change in continueId/progress — only presentation.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-262**: HomeClient composed on Screen(ato+ambient)/Surface/AppButton/PageHeader/Chip; continue CTA + B1 % preserved; lint0+213t; log 20260710T030540Z_TASK-262.log; commit 23ef4ce + push via git-push.sh main; autonomous. Next: TASK-263.

### TASK-257 — Autopilot maintenance sweep #257 (prior)
**Completed TASK-257**: gates clean (tsc0+lint0+213t+cs50/50+audit50/50) no fix needed; log 20260710T030026Z_TASK-257.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 6c12963 + push via git-push.sh main; autonomous.

### TASK-261 — UI shell Header + BottomNav (prior)
**Completed TASK-261**: Ato glass shell; hide /learn/v2; tests; push d801b6e / b5f678d.

### TASK-260 — UI Ato Surface: tokens + design-system primitives (prior)
**Completed TASK-260**: Ato Surface foundation shipped; TASK-261–265 queued; lint0+210t; push cac611a.

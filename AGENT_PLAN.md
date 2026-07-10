# Agent Plan — Tự cập nhật mỗi phiên

## Product loop (deployed)

| Field | Value |
|-------|-------|
| Scripts | product-radar.sh · agent-plan-from-radar.sh |
| npm | `radar` · `radar:plan` |
| Daemon | RADAR_EVERY=3 |
| Orchestrator | ORCHESTRATOR_RADAR_POST=1 (fail cycle if FAIL>0) |
| First smoke | 2026-07-10 PASS=13 FAIL=0 live vercel |
| Next pick | TASK-266 A1 content (after 265 docs) |


## Product loop (radar)

| Field | Value |
|-------|-------|
| Last radar | `product-radar-latest.md` |
| PASS / FAIL | 13 / 0 |
| Auto tasks added | TASK-269 |
| Date | 2026-07-10 |

**Focus:** UI residual docs (265) then A1 content 266+ — see `logs/agent/product-radar-latest.md`.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-264 Speaking hub |
| Commit | 7ba15c6 |
| Next pick | TASK-265 residual docs |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-265 — UI residual roadmap (Progress/Me/Landing) |
| Owner | Autopilot (user absent; autonomous) |

### TASK-265 — UI residual roadmap (Progress/Me/Landing later)
**Mục tiêu**: Document residual screens still on `SecondaryPageShell` / pre-Ato chrome. **Docs only** — no landing big-bang rewrite, no Progress/Me UI rewrite this task.

**Done khi:** `AGENT_ROADMAP.md` lists residual inventory; `docs/UI_SYSTEM.md` updated with residual table + explicit “no landing rewrite” policy; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (265 ready; 266–268 ready ≥2 → skip refill), PLAN prior 264, CONTENT_STYLE §6–7 (context only — no unit edit), inventory Progress/Me/Landing + SecondaryPageShell surfaces.
2. BACKLOG TASK-265 → `in_progress`.
3. PHASE3 (docs only):
   - `docs/UI_SYSTEM.md`: mark 264–265; Residual screens table (Progress, Me, Landing, secondary hubs); ship rule “no big-bang landing”.
   - `AGENT_ROADMAP.md`: residual list under Ato Surface pool; optional follow-ups as backlog-ready notes only (not auto-picked rewrites).
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-265.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Scope creep into Progress/Me/Landing code — refuse; docs inventory only.
- Landing rewrite temptation — product rule: marketing page stays independent; product shell is Ato Surface first.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-265**: residual screens documented in UI_SYSTEM + ROADMAP (Progress/Me/Landing deferred; no landing big-bang); lint0+213t; log 20260710T031519Z_TASK-265.log; commit + push via git-push.sh main; autonomous. Next: TASK-266 A1 content.

### TASK-264 — UI Speaking hub chrome (prior)
**Completed TASK-264**: SpeakingClient Ato Surface (Screen/Surface/AppButton/PageHeader/Chip); mode cards; guest local history; lint0+213t; commit 7ba15c6.

### TASK-263 — UI Learn + LessonPlayerV2 chrome (prior)
**Completed TASK-263**: LearnClient + v2 page + LessonPlayerV2 chrome; quiz floor/stage logic untouched; lint0+213t; commit 310da93.

### TASK-262 — UI Home redesign (prior)
**Completed TASK-262**: HomeClient Ato Surface; continue CTA + B1 %; lint0+213t; commit dad7d9d.

### TASK-257 — Autopilot maintenance sweep #257 (prior)
**Completed TASK-257**: gates clean; log 20260710T030026Z_TASK-257.log; commit 6c12963.

### TASK-261 — UI shell Header + BottomNav (prior)
**Completed TASK-261**: Ato glass shell; hide /learn/v2; tests; push b5f678d.

### TASK-260 — UI Ato Surface: tokens + design-system primitives (prior)
**Completed TASK-260**: Ato Surface foundation shipped; TASK-261–265 queued; push cac611a.

# Agent Plan — Tự cập nhật mỗi phiên

## Product loop (deployed)

| Field | Value |
|-------|-------|
| Scripts | product-radar.sh · agent-plan-from-radar.sh |
| npm | `radar` · `radar:plan` |
| Daemon | RADAR_EVERY=3 |
| Orchestrator | ORCHESTRATOR_RADAR_POST=1 (fail cycle if FAIL>0) |
| First smoke | 2026-07-10 PASS=13 FAIL=0 live vercel |
| Next pick | TASK-268 A1 l-a1-05 hobbies |


## Product loop (radar)

| Field | Value |
|-------|-------|
| Last radar | `product-radar-latest.md` |
| PASS / FAIL | 13 / 0 |
| Auto tasks added | TASK-269 |
| Date | 2026-07-10 |

**Focus:** A1 content factory TASK-268 — see `logs/agent/product-radar-latest.md`.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-267 A1 l-a1-04 daily routine |
| Commit | pending |
| Next pick | TASK-268 A1 l-a1-05 |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-267 — Author l-a1-04 Thói quen hàng ngày |
| Owner | Autopilot (user absent; autonomous) |

### TASK-267 — Author l-a1-04 Thói quen hàng ngày
**Mục tiêu**: Full LessonSpec A1 daily routine with present simple (I/you): get up, go to work, have breakfast/lunch, go home, go to bed, usually / every day, at + time. Spiral a0-06 time of day (morning, o'clock). L1 notes 100%. Register + sequential next after a1-03.

**Done khi:** `l-a1-04.ts` + registry; schema pass; `getNextPlayableLessonId(…a1-03)` = `l-a1-04`; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (267 ready; 268 ready ≥2 → skip refill), PLAN, CONTENT_STYLE, gold a1-03 + a0-06 time, lesson-spec schema, path meta l-a1-04 exists, tests sequential stop at a1-03.
2. BACKLOG TASK-267 → `in_progress`.
3. PHASE3:
   - Author `src/lib/v2/lessons/l-a1-04.ts` (8 stages, L1 100%, spiral a0-06 + light a1-01/03).
   - Register in `lessons/index.ts`.
   - Update `lesson-spec-v2.test.ts` (title + sequential after a1-03).
   - Optional: `docs/V2_PRODUCT.md` authored list.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-267.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Schema L1 100% A1 — every lexis item needs `l1_note_vi` ≥10 chars.
- Present simple 3sg later (she goes) — keep I/you for A1 routine intro; avoid overloading.
- Spiral must recycle a0-06 (morning / o'clock / What time…), not only new lexis.
- Sequential test must list all A0 + a1-01..03 completed → next a1-04.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-267**: `l-a1-04` daily routine present simple (get up / go to work + time spiral a0-06); L1 100%; registry + sequential after a1-03; lint0+213t; docs V2_PRODUCT; log + commit + push; autonomous. Next: TASK-268.

### TASK-266 — Author l-a1-03 Gia đình & bạn bè (prior)
**Completed TASK-266**: `l-a1-03` family/friends; L1 100%; registry + sequential after a1-02; lint0+213t; docs; commit 18690f4.

### TASK-265 — UI residual roadmap (prior)
**Completed TASK-265**: residual screens documented; commit 9852077.

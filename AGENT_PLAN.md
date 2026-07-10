# Agent Plan — Tự cập nhật mỗi phiên

## Product loop (deployed)

| Field | Value |
|-------|-------|
| Scripts | product-radar.sh · agent-plan-from-radar.sh |
| npm | `radar` · `radar:plan` |
| Daemon | RADAR_EVERY=3 |
| Orchestrator | ORCHESTRATOR_RADAR_POST=1 (fail cycle if FAIL>0) |
| First smoke | 2026-07-10 PASS=13 FAIL=0 live vercel |
| Next pick | TASK-272 A1 l-a1-08 food/order |


## Product loop (radar)

| Field | Value |
|-------|-------|
| Last radar | `product-radar-latest.md` |
| PASS / FAIL | 13 / 0 |
| Auto tasks added | TASK-269–273 |
| Date | 2026-07-10 |

**Focus:** A1 content factory TASK-271 — see `logs/agent/product-radar-latest.md`.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-270 A1 l-a1-06 home |
| Commit | 35e9f0e |
| Next pick | TASK-271 A1 l-a1-07 |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-271 — Author l-a1-07 Mua sắm |
| Owner | Autopilot (user absent; autonomous) |

### TASK-271 — Author l-a1-07 Mua sắm
**Mục tiêu**: Full LessonSpec A1 shopping phrases; How much is/are…?; numbers money light. Spiral a1-02 numbers/personal. L1 notes 100%. Register + sequential next after a1-06.

**Done khi:** `l-a1-07.ts` + registry; schema pass; `getNextPlayableLessonId(…a1-06)` = `l-a1-07`; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (271 ready), PLAN, CONTENT_STYLE §6–7, gold a1-06 + unit7 shopping, path meta l-a1-07 exists, tests sequential stop at a1-06.
2. BACKLOG TASK-271 → `in_progress`. ready 272–273 ≥2 skip refill.
3. PHASE3:
   - Author `src/lib/v2/lessons/l-a1-07.ts` (8 stages, L1 100%, How much is/are + money light).
   - Register in `lessons/index.ts`.
   - Update `lesson-spec-v2.test.ts` (title + sequential after a1-06).
   - Optional: `docs/product/V2_PRODUCT.md` authored list.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-271.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Schema L1 100% A1 — every lexis item needs `l1_note_vi` ≥10 chars.
- How much is (sg) vs How much are (pl) — core VN trap; light numbers (ten, fifty, hundred + dollars/dong).
- Spiral a1-02: age/job/phone/email — not pure numbers only.
- Sequential test must list all A0 + a1-01..06 completed → next a1-07.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-271**: `l-a1-07` shopping How much is/are + money light; L1 100%; registry + sequential after a1-06; lint0+213t; docs V2_PRODUCT; log + commit + push; autonomous. Next: TASK-272 / l-a1-08.

### TASK-270 — Author l-a1-06 Nhà cửa (prior)
**Completed TASK-270**: `l-a1-06` home/rooms there is/are; L1 100%; sequential after a1-05; commit 35e9f0e. Next: TASK-271 / l-a1-07.

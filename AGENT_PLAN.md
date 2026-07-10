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

**Focus:** A1 content factory TASK-272 — see `logs/agent/product-radar-latest.md`.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-271 A1 l-a1-07 shopping |
| Commit | 438f914 |
| Next pick | TASK-272 A1 l-a1-08 |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-272 — Author l-a1-08 Đồ ăn & order |
| Owner | Autopilot (user absent; autonomous) |

### TASK-272 — Author l-a1-08 Đồ ăn & order
**Mục tiêu**: Full LessonSpec A1 food/drink; I'd like… / Can I have…? Cafe order. Spiral a1-07 shopping. L1 notes 100%. Register + sequential next after a1-07.

**Done khi:** `l-a1-08.ts` + registry; schema pass; `getNextPlayableLessonId(…a1-07)` = `l-a1-08`; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (272 ready), PLAN, CONTENT_STYLE §6–7, gold a1-07 + path meta l-a1-08 exists, tests sequential stop at a1-07.
2. BACKLOG TASK-272 → `in_progress`. ready 273 ≥1; refill if ready < 2 after done.
3. PHASE3:
   - Author `src/lib/v2/lessons/l-a1-08.ts` (8 stages, L1 100%, I'd like / Can I have + cafe lexis).
   - Register in `lessons/index.ts`.
   - Update `lesson-spec-v2.test.ts` (title + sequential after a1-07).
   - Optional: `docs/product/V2_PRODUCT.md` authored list.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-272.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Schema L1 100% A1 — every lexis item needs `l1_note_vi` ≥10 chars.
- I'd like + noun vs Can I have + noun — core polite order; not I want only.
- Spiral a1-07: How much is/are, dollars, I'll take it — cafe bill/price link.
- Lexis max 12; grammar rule max 120; dialogue lines max 12.
- Sequential test must list all A0 + a1-01..07 completed → next a1-08.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

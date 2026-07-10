# Agent Plan — Tự cập nhật mỗi phiên

## Product loop (deployed)

| Field | Value |
|-------|-------|
| Scripts | product-radar.sh · agent-plan-from-radar.sh |
| npm | `radar` · `radar:plan` |
| Daemon | RADAR_EVERY=3 |
| Orchestrator | ORCHESTRATOR_RADAR_POST=1 (fail cycle if FAIL>0) |
| First smoke | 2026-07-10 PASS=13 FAIL=0 live vercel |
| Next pick | TASK-267 A1 l-a1-04 daily routine |


## Product loop (radar)

| Field | Value |
|-------|-------|
| Last radar | `product-radar-latest.md` |
| PASS / FAIL | 13 / 0 |
| Auto tasks added | TASK-269 |
| Date | 2026-07-10 |

**Focus:** A1 content factory TASK-266+ — see `logs/agent/product-radar-latest.md`.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-265 residual docs |
| Commit | 9852077 |
| Next pick | TASK-266 A1 l-a1-03 |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-266 — Author l-a1-03 Gia đình & bạn bè |
| Owner | Autopilot (user absent; autonomous) |

### TASK-266 — Author l-a1-03 Gia đình & bạn bè
**Mục tiêu**: Full LessonSpec A1 expanding family/friends beyond `l-a0-05` (This is my friend…, husband/wife/son/daughter, Do you have…, His/Her name is…). Spiral a1-01/02. L1 notes 100%. Register + sequential next after a1-02.

**Done khi:** `l-a1-03.ts` + registry; schema pass; `getNextPlayableLessonId(…a1-02)` = `l-a1-03`; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (266 ready; 267–268 ready ≥2 → skip refill), PLAN, CONTENT_STYLE context, gold a1-01/a1-02 + a0-05 family, lesson-spec schema, path already has l-a1-03 meta, tests sequential stop at a1-02.
2. BACKLOG TASK-266 → `in_progress`.
3. PHASE3:
   - Author `src/lib/v2/lessons/l-a1-03.ts` (8 stages, L1 100%, spiral a1-01/02).
   - Register in `lessons/index.ts`.
   - Update `lesson-spec-v2.test.ts` (title + sequential after a1-02).
   - Optional: `docs/V2_PRODUCT.md` authored list.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-266.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Schema L1 100% A1 — every lexis item needs `l1_note_vi` ≥10 chars.
- Overlap pure a0-05 lexis — expand (friend, husband/wife, son/daughter, cousin, older/younger, Do you have) not rehash mother/father only.
- Sequential test must list all A0 + a1-01 + a1-02 completed → next a1-03.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-266**: `l-a1-03` family/friends expansion (beyond a0-05); L1 100%; registry + sequential after a1-02; lint0+213t; docs V2_PRODUCT; log + commit + push; autonomous. Next: TASK-267.

### TASK-265 — UI residual roadmap (prior)
**Completed TASK-265**: residual screens documented in UI_SYSTEM + ROADMAP; lint0+213t; commit 9852077.

### TASK-264 — UI Speaking hub chrome (prior)
**Completed TASK-264**: SpeakingClient Ato Surface; commit 7ba15c6.

### TASK-263 — UI Learn + LessonPlayerV2 chrome (prior)
**Completed TASK-263**: LearnClient + v2 page + LessonPlayerV2 chrome; commit 310da93.

### TASK-262 — UI Home redesign (prior)
**Completed TASK-262**: HomeClient Ato Surface; commit dad7d9d.

### TASK-261 — UI shell Header + BottomNav (prior)
**Completed TASK-261**: Ato glass shell; push b5f678d.

### TASK-260 — UI Ato Surface: tokens + design-system primitives (prior)
**Completed TASK-260**: Ato Surface foundation; push cac611a.

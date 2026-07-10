# Agent Plan — Tự cập nhật mỗi phiên

## Product loop (deployed)

| Field | Value |
|-------|-------|
| Scripts | product-radar.sh · agent-plan-from-radar.sh |
| npm | `radar` · `radar:plan` |
| Daemon | RADAR_EVERY=3 |
| Orchestrator | ORCHESTRATOR_RADAR_POST=1 (fail cycle if FAIL>0) |
| First smoke | 2026-07-10 PASS=13 FAIL=0 live vercel |
| Next pick | TASK-270 A1 l-a1-06 home |


## Product loop (radar)

| Field | Value |
|-------|-------|
| Last radar | `product-radar-latest.md` |
| PASS / FAIL | 13 / 0 |
| Auto tasks added | TASK-269–273 |
| Date | 2026-07-10 |

**Focus:** A1 content factory TASK-270 — see `logs/agent/product-radar-latest.md`.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-268 A1 l-a1-05 hobbies |
| Commit | cec91e7 |
| Next pick | TASK-270 A1 l-a1-06 |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-270 — Author l-a1-06 Nhà cửa |
| Owner | Autopilot (user absent; autonomous) |

### TASK-270 — Author l-a1-06 Nhà cửa
**Mục tiêu**: Full LessonSpec A1 home/rooms/furniture with there is/are + This is my room…. Spiral a1-03 family lightly. L1 notes 100%. Register + sequential next after a1-05.

**Done khi:** `l-a1-06.ts` + registry; schema pass; `getNextPlayableLessonId(…a1-05)` = `l-a1-06`; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (270 ready), PLAN, CONTENT_STYLE §6–7, gold a1-05 + unit6 home, path meta l-a1-06 exists, tests sequential stop at a1-05.
2. BACKLOG TASK-270 → `in_progress`. ready 271–273 ≥2 skip refill.
3. PHASE3:
   - Author `src/lib/v2/lessons/l-a1-06.ts` (8 stages, L1 100%, there is/are + rooms/furniture).
   - Register in `lessons/index.ts`.
   - Update `lesson-spec-v2.test.ts` (title + sequential after a1-05).
   - Optional: `docs/product/V2_PRODUCT.md` authored list.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-270.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Schema L1 100% A1 — every lexis item needs `l1_note_vi` ≥10 chars.
- there is (sg) vs there are (pl) — heavy VN L1 trap; cover isn't/aren't lightly.
- living room = 2 words; apartment vs flat light note.
- Sequential test must list all A0 + a1-01..05 completed → next a1-06.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-270**: `l-a1-06` home/rooms there is/are; L1 100%; registry + sequential after a1-05; lint0+213t; docs V2_PRODUCT; log + commit + push; autonomous. Next: TASK-271 / l-a1-07.

### TASK-268 — Author l-a1-05 Sở thích (prior)
**Completed TASK-268**: `l-a1-05` hobbies like/love/hate + -ing; L1 100%; sequential after a1-04; commit cec91e7.

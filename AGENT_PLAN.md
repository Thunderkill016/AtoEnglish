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
| Commit | 9f6d315 |
| Next pick | TASK-268 A1 l-a1-05 |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-268 — Author l-a1-05 Sở thích |
| Owner | Autopilot (user absent; autonomous) |

### TASK-268 — Author l-a1-05 Sở thích
**Mục tiêu**: Full LessonSpec A1 hobbies with like / love / hate + -ing. Free time small talk; hobbies (reading, music, football, cooking, swimming, movies). L1 notes 100%. Register + sequential next after a1-04. Spiral a1-04 routine lightly + a0-03/a1-01 greetings.

**Done khi:** `l-a1-05.ts` + registry; schema pass; `getNextPlayableLessonId(…a1-04)` = `l-a1-05`; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (268 ready), PLAN, CONTENT_STYLE §6–7, gold a1-04 + unit5 hobbies, path meta l-a1-05 exists, tests sequential stop at a1-04.
2. BACKLOG TASK-268 → `in_progress`.
3. PHASE3:
   - Author `src/lib/v2/lessons/l-a1-05.ts` (8 stages, L1 100%, like/love/hate + V-ing).
   - Register in `lessons/index.ts`.
   - Update `lesson-spec-v2.test.ts` (title + sequential after a1-04).
   - Optional: `docs/product/V2_PRODUCT.md` authored list.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-268.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Schema L1 100% A1 — every lexis item needs `l1_note_vi` ≥10 chars.
- like + V-ing (not to-V) — heavy VN L1 trap; cover love/hate same pattern.
- He/She likes (3sg -s) — include lightly but keep I/you core for A1 speak task.
- Sequential test must list all A0 + a1-01..04 completed → next a1-05.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-268**: `l-a1-05` hobbies like/love/hate + -ing; L1 100%; registry + sequential after a1-04; lint0+213t; docs V2_PRODUCT; log + commit + push; autonomous. Next: TASK-269 / l-a1-06.

### TASK-267 — Author l-a1-04 Thói quen hàng ngày (prior)
**Completed TASK-267**: `l-a1-04` daily routine; L1 100%; registry + sequential after a1-03; lint0+213t; commit 9f6d315. Next: TASK-268.

### TASK-266 — Author l-a1-03 Gia đình & bạn bè (prior)
**Completed TASK-266**: `l-a1-03` family/friends; L1 100%; registry + sequential after a1-02; lint0+213t; docs; commit 18690f4.

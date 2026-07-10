# Agent Plan — Tự cập nhật mỗi phiên

## Product loop (deployed)

| Field | Value |
|-------|-------|
| Scripts | product-radar.sh · agent-plan-from-radar.sh |
| npm | `radar` · `radar:plan` |
| Daemon | RADAR_EVERY=3 |
| Orchestrator | ORCHESTRATOR_RADAR_POST=1 (fail cycle if FAIL>0) |
| First smoke | 2026-07-10 PASS=13 FAIL=0 live vercel |
| Next pick | TASK-273 A1 l-a1-09 places/directions |


## Product loop (radar)

| Field | Value |
|-------|-------|
| Last radar | `product-radar-latest.md` |
| PASS / FAIL | 13 / 0 |
| Auto tasks added | TASK-269–273 |
| Date | 2026-07-10 |

**Focus:** Wave B product spine — TASK-277 nav flag → `/home` when v2.


## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-272 A1 l-a1-08 food/order |
| Commit | 3a9f939 |
| Next pick | TASK-277 nav (user session override) |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-277 — Nav Học → /home when v2 flag + Me hub B1 copy |
| Owner | Autopilot (user absent; autonomous) |

### TASK-277 — Nav: Học tab → /home when v2 flag
**Mục tiêu**: `bottomNavItems` + `desktopPrimaryNav` Học href = `/home` nếu `isCurriculumV2()` else `/dashboard`. Me hub copy bám north star B1 Independent User. time-to-lesson ≤2 tap.

**Done khi:** flag matrix correct; Me hub B1 copy; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (277 ready), ROADMAP B1 wave, MASTER B1, navigation.ts static /dashboard, me-hub A0→B2 copy, flag.ts.
2. BACKLOG TASK-277 → `in_progress`.
3. PHASE3:
   - `getPrimaryLearnHref()` + live getters for bottom/desktop primary nav.
   - Wire bottom-nav + main-nav + command-palette.
   - Me hub study copy → B1 Independent User (product-outcome).
   - Unit test flag matrix (v2 on → /home, off → /dashboard).
4. `npm run lint && npm run test`.
5. Log + BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Static const eval once at import — use getters so flag is read at render/call time.
- Active-tab match: `/home` exact; do not break `/me` settings highlight.
- NEXT_PUBLIC_CURRICULUM_V2 default off — prod stays /dashboard until cutover.
- Do not change mobilePanelGroups / auth redirects (out of scope).
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-277**: getPrimaryLearnHref + getBottomNavItems/getDesktopPrimaryNav; Me hub B1 north-star copy + v2 study hrefs; navigation-v2 9 tests; lint0+222t; commit 5af0b20 + push. Next: TASK-273 / l-a1-09 or TASK-278.

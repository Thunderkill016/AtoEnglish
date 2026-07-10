# Agent Plan — Tự cập nhật mỗi phiên

## Phiên OPS (prior)

| Field | Value |
|-------|-------|
| Focus | TASK-262 Home redesign |
| Commit | dad7d9d |
| Next pick | TASK-263 (Learn + LessonPlayerV2 chrome) |


> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-263 — UI Learn + LessonPlayerV2 chrome on primitives |
| Owner | Autopilot (user absent; autonomous) |

### TASK-263 — UI Learn + LessonPlayerV2 chrome
**Mục tiêu**: Learn list (`LearnClient`) + v2 lesson page + `LessonPlayerV2` **chrome only** compose Ato Surface kit — `Screen`, `Surface`, `AppButton`, `PageHeader`, `Chip`. **Không** đổi quiz floor / stage logic / `canMarkLessonComplete` / `meetsQuizFloor` / `LESSON_STAGES` flow (TASK-187 preserved).

**Done khi:** chrome uses Surface/AppButton; TASK-187 behavior preserved; lint+test; commit + push.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS, BACKLOG (263 ready; 264–265 ready ≥2 → skip refill), PLAN prior 262 dad7d9d, CONTENT_STYLE §6–7 (context only — no unit edit), inspect LearnClient + LessonPlayerV2 + v2 page + HomeClient pattern + design-system.
2. BACKLOG TASK-263 → `in_progress`.
3. PHASE3:
   - `LearnClient`: SecondaryPageShell → Screen(ato+ambient)/PageHeader/Surface rows; keep unlock/placement logic.
   - `learn/v2/[lessonId]/page.tsx`: Screen + Chip + PageHeader + AppButton back.
   - `LessonPlayerV2`: Surface stage card; AppButton for prev/next/finish/retry/task-done; finished CTAs — **logic untouched**.
   - Optional: docs/UI_SYSTEM.md TASK-263 ✅.
4. `npm run lint && npm run test`.
5. Log `logs/agent/*_TASK-263.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Accidental quiz floor / goNext change — only presentation wrappers; preserve disabled conditions and labels.
- Learn unlock/placement regression — keep `isUnitUnlocked` / `isPlacedOutUnit` as-is.
- Transient lint/test flake → clear tsbuildinfo + rerun once; 2 fails → blocked.
- Push needs GitLab → blocked, no force.

**Started:** 2026-07-10 — autopilot

**Completed TASK-263**: LearnClient + v2 page + LessonPlayerV2 chrome on Screen/Surface/AppButton/PageHeader/Chip; quiz floor/stage logic untouched; lint0+213t; log 20260710T031010Z_TASK-263.log; commit + push via git-push.sh main; autonomous. Next: TASK-264.

### TASK-262 — UI Home redesign (prior)
**Completed TASK-262**: HomeClient composed on Screen(ato+ambient)/Surface/AppButton/PageHeader/Chip; continue CTA + B1 % preserved; lint0+213t; log 20260710T030540Z_TASK-262.log; commit dad7d9d + push via git-push.sh main; autonomous.

### TASK-257 — Autopilot maintenance sweep #257 (prior)
**Completed TASK-257**: gates clean; log 20260710T030026Z_TASK-257.log; commit 6c12963.

### TASK-261 — UI shell Header + BottomNav (prior)
**Completed TASK-261**: Ato glass shell; hide /learn/v2; tests; push b5f678d.

### TASK-260 — UI Ato Surface: tokens + design-system primitives (prior)
**Completed TASK-260**: Ato Surface foundation shipped; TASK-261–265 queued; push cac611a.

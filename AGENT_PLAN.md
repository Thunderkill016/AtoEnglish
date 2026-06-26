# Agent Plan — Tự cập nhật mỗi phiên

> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-06-26 |
| Focus | P0 ops → P1 audio A1 → P1 placement polish |
| Owner | Autopilot (no human) |

## Roadmap tự động (7 ngày)

### Ngày 1 — Vận hành
- [ ] TASK-001 Supabase migration placement columns
- [ ] TASK-002 Vercel deploy healthy
- [ ] Verify placement live end-to-end

### Ngày 2–3 — Audio A1
- [ ] TASK-010 unit-1..12 MP3 batch
- [ ] Smoke test playUnitAudio on production

### Ngày 4 — Placement UX
- [ ] TASK-011 E2E self-select B1
- [ ] TASK-012 Roadmap starting_unit_index

### Ngày 5+ — Chất lượng & mở rộng
- [ ] TASK-020 integration test flakes
- [ ] TASK-030 A2 audio
- [ ] TASK-032 onboarding profile DB

## Nguyên tắc tự quyết

1. Không hỏi user — blocked thì ghi rõ và skip sang task kế
2. Một commit = một task
3. Luôn pull trước push
4. Sau mỗi push: npm run check-deploy nếu có VERCEL_TOKEN

## Log phiên

| Time (UTC) | Task | Plan summary | Outcome |
|------------|------|--------------|---------|
| 2026-06-26T01:36Z | TASK-001/002 | P0 ops: migration blocked, deploy OK | autopilot armed |
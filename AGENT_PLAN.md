# Agent Plan — Tự cập nhật mỗi phiên

> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-06-26 |
| Focus | P0 ops → P1 audio A1 → P1 placement polish → TASK-021 doc sync → TASK-030 A2 audio |
| Owner | Autopilot (no human) |

### TASK-021 — Sync placement flow, 50 units, header shell, autopilot docs (PAGE_SPECIFICATIONS.md + AGENT_*)
**Mục tiêu**: Làm cho docs phản ánh chính xác codebase hiện tại (50 units A0-B2, placement /placement-test + self-select + starting_unit_index flow, HeaderShell mới, navigation mở rộng, onboarding/login integration).
**Bước thực hiện**:
1. Đọc PAGE_SPECIFICATIONS.md, units.ts, placement/*, learn/*, roadmap/*, header-shell.tsx, login/page.tsx, AGENT_BACKLOG/PLAN/AUTOPILOT.
2. Cập nhật index table, Page 4 Learn, Page 9 Roadmap, thêm Page mới cho Placement Test.
3. Thêm mô tả HeaderShell trong layout.
4. Cập nhật AGENT_PLAN.md + AGENT_BACKLOG.md (status, nhật ký).
5. Verify: no code change, chỉ doc; run lint/test.
**Rủi ro**:
- Docs drift nếu code thay đổi sau — nhưng task chỉ sync 1 lần.
- Over-update ngoài scope (giữ minimal: PAGE_SPECS + agent plan/backlog).
- Placement details (A0 support, 40Q test) phải chính xác.
**Done khi**: PAGE_SPECIFICATIONS.md mô tả đúng 50 units + placement + header; plan updated; tests pass; commit.

### TASK-030 — Native audio A2 (unit-13 → unit-18)
**Mục tiêu**: Generate native MP3 audio assets (gTTS "en") cho units A2 13-18. Generator + a2 script already extended in prior (imports, UNITS map, package.json audio:generate:a2). Run batch for missing (17-18 + any gaps); commit clips (~14 per unit). Follow TASK-010 pattern.
**Bước thực hiện**:
1. Search memory + read AGENTS/BACKLOG/PLAN, units.ts, generate-unit-audio.ts (note: A2 support pre-added), unit13-18 data files (audio paths), unit-audio.ts, public/audio/* counts, prior logs.
2. (No code change to gen — already done.) Run generation for remaining: tsx scripts/generate-unit-audio.ts unit-17 && ... unit-18. Verify exact file counts match declared audios in data/*.ts (use ls + grep).
3. `npm run lint && npm run test` (audio tests are mocked, curriculum checks declarations only).
4. Update AGENT_PLAN.md + BACKLOG.md (status, nhật ký + SHA).
5. git pull --rebase; git add public/audio/unit-1{7,8}; commit; push.
**Rủi ro**:
- gTTS network/rate limit (esp on repeated runs) — rerun per unit if partial; if blocked by google → set blocked.
- Some filenames special (check_in.mp3, compared_to.mp3, traffic_lights.mp3) — generator derives from data.audio basename, must match.
- Prior partial runs (13-16) may leave dirty; use clean counts.
- No secrets; pure devDep + net. If net fail in env → blocked, advance to next if possible.
- Tests don't cover actual MP3 files (intentional).
**Done khi**: unit-13..18 each have correct #MP3s (14 typically); lint+test pass (0 errors); pushed with 1 commit; backlog done + log entry.

## Roadmap tự động (7 ngày)

### Ngày 1 — Vận hành
- [x] TASK-001 Supabase migration placement columns
- [x] TASK-002 Vercel deploy healthy
- [x] Verify placement live end-to-end

### Ngày 2–3 — Audio A1
- [ ] TASK-010 unit-1..12 MP3 batch
- [ ] Smoke test playUnitAudio on production

### Ngày 4 — Placement UX
- [x] TASK-011 E2E self-select B1
- [x] TASK-012 Roadmap starting_unit_index

### Ngày 5+ — Chất lượng & mở rộng
- [x] TASK-020 integration test flakes
- [x] TASK-030 A2 audio (6bbc693)
- [ ] TASK-031 B1 audio
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
| 2026-06-26T08:55Z | TASK-001/011 | db push migration + E2E B1 unlock | 2 e2e pass |
| 2026-06-26 | TASK-021 | Sync docs: placement, 50u, header, autopilot | done — 3d36d2f (docs commit); f9f21a1 (status) |
| 2026-06-26 | TASK-030 | Native audio A2 batch unit-13..18 (extend script + 84 MP3s) | done — 6bbc693 |
| 2026-06-26 | TASK-030 | Re-verify gen+counts+lint+test (all 6 units 14 clips) | done — no new code, docs log |
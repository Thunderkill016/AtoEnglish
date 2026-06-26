# Agent Plan — Tự cập nhật mỗi phiên

> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-06-26 |
| Focus | TASK-033 B2 audio (unit-33..42) → TASK-034 db:types → TASK-035 E2E onboarding → TASK-036 audio path fix |
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

### TASK-031 — Native audio B1 (unit-19 → unit-32)
**Mục tiêu**: Generate native MP3 audio assets (gTTS "en") cho units B1 19-32 (14 units). Extend generator with imports + UNITS map for unit19..32; add audio:generate:b1 npm script (like :a2); run full batch; commit ~196 clips. Follow TASK-030 / TASK-010 pattern exactly. No changes to unit data or playback (already declare /audio/unit19/... etc).
**Bước thực hiện**:
1. Search memory + read AGENTS/BACKLOG/PLAN, units.ts (B1=19-32), generate-unit-audio.ts, all unit19-32 data (confirm 14 audio each), unit-audio.ts, public/audio/* (confirm zero for B1), prior logs (TASK-030 pattern).
2. Minimal edits: append 14 imports + 14 map entries in generate-unit-audio.ts; add "audio:generate:b1" script in package.json.
3. Run generation: `npm run audio:generate:b1` (or loop tsx per unit). Verify post-gen counts: each unit-19..32 has exactly 14 MP3 (use ls + wc). Rerun single units if any gTTS partial fail.
4. `npm run lint && npm run test` (must pass; note: 159+ unit tests, audio test is mock-only; curriculum validates declarations).
5. Update AGENT_PLAN.md + BACKLOG.md (in_progress→done, nhật ký + commit SHA).
6. git pull --rebase; git add -A public/audio/unit-1{9,32} public/audio/unit-2{0-9} public/audio/unit-3{0-2} scripts/generate-unit-audio.ts package.json AGENT_*.md; git commit; git push.
**Rủi ro**:
- gTTS network/rate limits or transient fails on 196 calls (high volume) — rerun failing units individually with tsx script/unit-N; sleep between if rate hit; if fully blocked → status=blocked.
- Filenames with _ like deal_with.mp3, check_in etc — generator uses exact basename from data.audio, must produce matching .mp3 name.
- Time: batch ~10-20min; use background if needed but monitor.
- No secrets/ DB change; pure asset + script. If net fail → blocked, advance next ready (e.g. TASK-032) possible per rules.
- Tests pass regardless of actual MP3s (by design; E2E would cover play but not run here).
- Git: large commit (196 binaries) — ok, precedent from A1/A2; don't split unless fail.
**Done khi**: Every unit-19 to unit-32 has exactly 14 MP3s matching declared paths; generator + :b1 script updated; `npm run lint && npm run test` clean (0 err, all tests pass); 1 primary commit pushed; backlog status=done + entry with SHA; no user asked.

### TASK-032 — Persist onboarding answers (Q2–Q4: goal, obstacle, daily_minutes)
**Mục tiêu**: Tạo migration `user_onboarding_profile` (1:1 với user) để lưu vĩnh viễn câu trả lời Q2 (goal), Q3 (obstacle), Q4 (daily time) từ quiz signup. Đồng thời đảm bảo daily_xp_goal được ghi vào user_progress tại signup (Q4). Code changes minimal: cập nhật flows email+OAuth để pass đầy đủ params + insert profile + set goal. Update types (tạm) + helpers để tsc pass. Không thay đổi UX hay logic redirect.
**Bước thực hiện**:
1. Search memory (done) + read AGENTS/ BACKLOG/PLAN, login/page.tsx, auth/callback/route.ts , lib/onboarding.ts, recent migrations (placement, challenge, quiz, push), src/types/supabase.ts, places setting daily_xp_goal.
2. Tạo migration mới supabase/migrations/20260626140000_user_onboarding_profile.sql theo pattern (IF NOT EXISTS, PK user_id, RLS policies với (select auth.uid()), index, comment).
3. Cập nhật AGENT_PLAN.md (section này) + BACKLOG (status in_progress).
4. Thêm helper getDailyXpGoalFromTime, getDailyMinutes vào lib/onboarding.ts (minimal).
5. Sửa src/app/login/page.tsx: pass full target/obstacle/time/level qua URL cho google + email redirect; set daily_xp_goal vào insert user_progress; insert user_onboarding_profile cho new signup (dùng client supabase).
6. Sửa src/app/auth/callback/route.ts: extract target/obstacle/time; set daily_xp_goal vào upsert user_progress; upsert profile nếu isNewUser.
7. Append definition của user_onboarding_profile vào src/types/supabase.ts (sau user_progress) để tsc/compile pass ngay (sau apply prod sẽ db:types overwrite).
8. Update comment ở login (remove "no DB column yet").
9. Chạy `npm run lint && npm run test` (có thể npx tsc --noEmit). Fix nếu lỗi.
10. Update BACKLOG status→done + nhật ký + SHA; AGENT_PLAN log.
11. git pull --rebase; git add migration + 3 src files + AGENT_*.md; commit với format feat(onboarding): persist Q2-Q4 to user_onboarding_profile; push.
**Rủi ro**:
- Thiếu secret cho `npm run db:types` hoặc supabase db push (prod) → không apply ngay, nhưng local migration + type patch cho phép code chạy + test pass. Ghi blocked nếu apply fail.
- TS drift nếu edit types — chỉ append, dùng đúng pattern từ challenge_results; prod regen sau sẽ fix.
- URL param length: thêm 2 param nhỏ, safe.
- Không overwrite profile cho returning user (chỉ insert/upsert on new signup).
- Không thay đổi daily_xp_goal cho existing users (scope task).
- Nếu test integration cần profile (không), unit tests không hit auth flow trực tiếp.
- Commit có migration + type edit — theo precedent các task trước.
**Done khi**: migration file tồn tại đúng format; signup flows (email + google) persist đầy đủ Q2-Q4 + daily_xp_goal; `npm run lint && npm run test` (và tsc) pass 0 error; 1 commit pushed main; backlog done + entry SHA; không hỏi user.

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
- [x] TASK-031 B1 audio (2119534)
- [x] TASK-032 onboarding profile DB (user_onboarding_profile + Q2-Q4 persist)

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
| 2026-06-26 | TASK-030 | Re-verify gen+counts+lint+test (all 6 units 14 clips) | done — 202bfea (pushed) |
| 2026-06-26T03:25Z | TASK-030 | Autopilot full cycle: research(agents+grep), plan update, run gen 17+18, lint+159test, 3 commits/push, log | complete — c58cf13 |
| 2026-06-26 | TASK-031 | Research(agents+grep+units+gen), update PLAN/BACKLOG to in_progress, extend generator+pkg for B1 19-32, batch gTTS, lint+test, commit+push | done — 2119534a5e432816f2cf95c1de5b84767066a2aa (196 clips + fixes) |
| 2026-06-26 | TASK-032 | research(agents+grep+memory+login/callback/migrations), plan update, create migration 20260626140000, edit onboarding/login/callback/types, hoist helpers, wire insert+upsert+params+xp_goal, lint+159+tsc pass, commit+push | done — cab2260 |

### TASK-033 — Native audio B2 (unit-33 → unit-42)
**Mục tiêu**: Generate native MP3 audio assets (gTTS "en") cho 10 units B2 (33-42, ~144 clips). Extend generator imports+map; add audio:generate:b2 npm script; run full batch; commit MP3s.
**Bước**: extend generate-unit-audio.ts + package.json → `npm run audio:generate:b2` → verify counts per unit → lint+test → commit+push.
**Rủi ro**: gTTS rate limit on 144 calls; unit-41 has 18 clips; path mismatch unit33 vs unit-33 (TASK-036).
**Done khi**: All unit-33..42 folders have correct MP3 counts; lint+test pass; pushed.

| 2026-06-26 | TASK-033 | B2 audio batch unit-33..42 (144 clips), extend gen+b2 script, lint+159 pass | done — (SHA) |
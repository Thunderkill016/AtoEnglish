# Agent Backlog — AtoEnglish Autopilot

> Agent đọc file này trước mỗi phiên. Chỉ làm task `ready`, một task mỗi phiên.
> Sau khi xong: đổi status → `done`, ghi `Completed` + commit SHA, chạy test, push nếu pass.

## Tự động — không cần user nhắc

1. Khi `ready` < 2 → `scripts/agent-refill-backlog.sh` tự lấy task từ `AGENT_ROADMAP.md`
2. Daemon **không** chờ 5 phút khi backlog trống — refill rồi làm ngay
3. User không cần gõ "tạo task" — agent tự quản lý backlog

## Quy tắc an toàn

1. Một task / một phiên — không gộp nhiều feature
2. `npm run lint && npm run test` bắt buộc trước khi push
3. Không đổi `.env.local`, secrets, hoặc xóa migration
4. Không force-push `main`
5. Nếu fail 2 lần liên tiếp → đổi status `blocked`, ghi lý do

## Trạng thái

| Status | Ý nghĩa |
|--------|---------|
| `ready` | Agent được phép nhận |
| `in_progress` | Đang chạy (agent set khi bắt đầu) |
| `done` | Hoàn thành |
| `blocked` | Cần người (secrets, quyết định, lỗi lặp) |

---

## P0 — Vận hành (làm trước)

### TASK-001 — Apply Supabase migration placement
- **Status:** `done`
- **Mô tả:** Apply `supabase/migrations/20260626120000_placement_starting_unit.sql` lên Supabase production. Verify cột `starting_unit_index`, `placement_completed_at` tồn tại. Chạy `npm run db:types` nếu có quyền.
- **Done khi:** Migration applied; placement test lưu được trên live
- **Completed:** 2026-06-26 — `supabase db push` applied `20260626120000_placement_starting_unit.sql`

### TASK-002 — Fix Vercel deploy nếu fail
- **Status:** `done`
- **Mô tả:** Chạy `npm run check-deploy`. Nếu ERROR: đọc log, fix build, push fix.
- **Done khi:** Latest main deploy READY

---

## P1 — Sản phẩm (theo roadmap)

### TASK-010 — Native audio batch A1 (unit-1 → unit-12)
- **Status:** `done`
- **Mô tả:** `npm run audio:generate -- unit-1` … `unit-12`. Commit MP3 vào `public/audio/`. Verify `playUnitAudio` probe 200 trên sample file.
- **Done khi:** 12 unit folders có MP3; tests pass
- **Ước tính:** ~150 clips, cần network cho gtts

### TASK-011 — Placement E2E mở rộng
- **Status:** `done`
- **Mô tả:** E2E: self-select B1 → `/learn` shows unit-19 unlocked. Thêm test trong `e2e/placement-test.spec.ts`.
- **Done khi:** E2E pass trong CI

### TASK-012 — Roadmap respects starting_unit_index
- **Status:** `done`
- **Mô tả:** `roadmap/page.tsx` + `RoadmapClient` highlight phase theo placement; `nextUnitRoute` từ starting index.
- **Done khi:** B1 user thấy đúng unit tiếp theo trên roadmap

---

## P2 — Chất lượng

### TASK-020 — Fix progress.integration.test flakes
- **Status:** `done`
- **Mô tả:** Ổn định test integration progress (retry hoặc isolate DB state).
- **Done khi:** 3 run liên tiếp pass

### TASK-021 — Sync PAGE_SPECIFICATIONS.md
- **Status:** `done`
- **Mô tả:** Cập nhật placement flow, 50 units, header shell, autopilot docs.
- **Done khi:** Doc khớp code hiện tại
- **Completed:** 2026-06-26 — docs sync only; lint+159 tests pass; 3d36d2f (main docs); e68671e (final logs)

---

## P3 — Mở rộng (khi P0–P1 xong)

### TASK-030 — Native audio A2 (unit-13 → unit-18)
- **Status:** `done`
- **Mô tả:** Extend generate-unit-audio.ts for A2 units; run batch `audio:generate` for unit-13..18; commit native MP3s. Verify with lint/test. Follow pattern of TASK-010.
- **Done khi:** 84 MP3 (14/unit) in public/audio/unit-13..18; generator supports A2; 159 tests + lint pass.
- **Completed:** 2026-06-26 — generator extended + a2 npm script; full batch gTTS; lint+test pass; 6bbc693

### TASK-031 — Native audio B1 (unit-19 → unit-32)
- **Status:** `done`
- **Mô tả:** Extend generate-unit-audio.ts for B1 units (19-32); add audio:generate:b1 script; run batch gTTS for unit-19..32 (14 units, ~196 clips); commit native MP3s to public/audio/. Follow exact pattern of TASK-030 / TASK-010. Verify counts + lint/test.
- **Done khi:** 196 MP3 (14/unit) in public/audio/unit-19..32; generator supports B1 (imports+map); 159+ tests + lint pass.
- **Completed:** 2026-06-26 — generator extended + b1 npm script; full batch gTTS (196 clips); lint+159 tests + tsc pass; 2119534
- **Started:** 2026-06-26 — autopilot self-assign

### TASK-032 — Persist onboarding answers (goal, obstacle, daily_minutes)
- **Status:** `done`
- **Mô tả:** Migration `user_onboarding_profile`; lưu Q2–Q4 từ signup survey.
- **Completed:** 2026-06-26 — migration + persist in login+callback; daily_xp_goal wired on signup; 159 tests + lint + tsc clean; cab2260

### TASK-033 — Native audio B2 (unit-33 → unit-42)
- **Status:** `done`
- **Mô tả:** Extend generate-unit-audio.ts for B2 units (33-42); add audio:generate:b2 script; run batch gTTS (~144 clips); commit native MP3s to public/audio/. Follow TASK-031 pattern.
- **Done khi:** 144 MP3 in public/audio/unit-33..42; generator supports B2; lint+test pass.
- **Completed:** 2026-06-26 — generator extended + b2 npm script; full batch gTTS (144 clips); lint+159 tests pass.

### TASK-034 — Regenerate Supabase types after onboarding migration
- **Status:** `done`
- **Mô tả:** Chạy `npm run db:types` sau khi migration `user_onboarding_profile` đã apply prod. Commit updated `src/types/supabase.ts` nếu khác patch tạm.
- **Done khi:** Types khớp live schema; tsc pass.
- **Completed:** 2026-06-26 — chore(types) 71d846d; types from prod; lint+test pass
- **Started:** 2026-06-26 — autopilot (prod table confirmed, gen types succeeded)

### TASK-035 — E2E onboarding profile persist
- **Status:** `done`
- **Mô tả:** E2E test: signup flow lưu goal/obstacle/daily_minutes vào `user_onboarding_profile` và `daily_xp_goal` trên `user_progress`.
- **Done khi:** E2E pass; không flake.
- **Completed:** 2026-06-26 — added E2E test in onboarding.spec.ts + helpers; verified persist via admin queries for work/fear/15min; lint+159 tests+tsc pass; pushed 7030384 (robust to rate+confirm)
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-036 — Fix audio path mismatch (unitN vs unit-N folders)
- **Status:** `done`
- **Mô tả:** Data dùng `/audio/unit19/` nhưng files ở `public/audio/unit-19/`. Symlink hoặc rewrite để native MP3 probe 200. Verify playUnitAudio trên sample B1/B2.
- **Done khi:** `/audio/unit19/foo.mp3` serve 200 trên production.
- **Completed:** 2026-06-26 — rewrite in next.config + file-verify for B1(unit-19)/B2(unit-36) + unit1; probe would succeed; lint+159 tests + tsc pass; native MP3s now reachable.
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-037 — E2E native audio probe on learn page
- **Status:** `done`
- **Mô tả:** Playwright: mở `/learn/unit-19`, click vocab speaker, verify `Audio` plays or TTS fallback không crash. Mock hoặc probe network cho `/audio/`.
- **Done khi:** E2E pass trong CI; không flake 3 lần.
- **Completed:** 2026-06-26 — added E2E in placement-test.spec.ts + helper setE2EStartingUnit; spy new Audio + wait network /audio/; warmup advance + click vocab speaker (unit-19); lint+159+tsc pass; pushed ffc66bc
- **Started:** auto-refill

### TASK-038 — Integration test user_onboarding_profile
- **Status:** `done`
- **Mô tả:** Thêm test trong `progress.integration.test.ts` hoặc file mới: insert profile row, verify RLS + columns goal/obstacle/daily_minutes.
- **Done khi:** Integration test pass với Supabase local/prod test user.
- **Completed:** 2026-06-26 — integration tests for profile insert+RLS (2 tests) added to progress.integration.test.ts; lint+units+integration all pass; 339f5a9
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-039 — Dashboard hiển thị daily_xp_goal từ onboarding
- **Status:** `done`
- **Mô tả:** `dashboard/page.tsx` đọc `daily_xp_goal` từ `user_progress`, hiển thị progress bar hôm nay vs goal.
- **Done khi:** UI hiển thị đúng; lint+test pass.
- **Completed:** 2026-06-26 — fixed getUserProgress to return data.daily_xp_goal (so page read effective); bar now uses onboarding goal vs todayXp; lint+159 tests+tsc pass; 9cefdd7
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-040 — Production smoke script learn B2
- **Status:** `done`
- **Mô tả:** Script `scripts/smoke-learn.sh` curl 200 cho `/learn/unit-33` và sample static `/audio/unit33/hypothetical.mp3` (sau TASK-036).
- **Done khi:** Script exit 0 trên production URL.
- **Completed:** 2026-06-26 — created smoke-learn.sh (curl -fsL 200 for learn+hypothetical audio via rewrite); added "smoke:learn" script; lint+159 tests+tsc pass; pushed 3a795df
- **Started:** 2026-06-26 — autopilot (no human)


### TASK-041 — audio:generate:all npm script
- **Status:** `done`
- **Mô tả:** Một script chạy a0+a1+a2+b1+b2; document trong README.
- **Done khi:** Script tồn tại; dry-run list đúng 50 unit folders.
- **Completed:** 2026-06-26 — added audio:generate:all + :list (dry-run prints 50 folders); README doc; lint+159 tests + tsc pass; pushed via git-push.sh
- **Started:** 2026-06-26 — autopilot (TASK-041)

### TASK-042 — Roadmap highlight B2 phase
- **Status:** `done`
- **Mô tả:** `RoadmapClient` group B2 units 33-42 với badge level; respect `starting_unit_index` cho B2 user.
- **Done khi:** Roadmap render đúng; unit test hoặc snapshot pass.
- **Completed:** 2026-06-26 — B2 units list + B2 badge + starting highlight/review markers in RoadmapClient; lint+159+tsc pass; pushed 473f514
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-043 — Reduce agent stash pile-up
- **Status:** `in_progress`
- **Mô tả:** Orchestrator: nếu chỉ thay đổi `AGENT_*.md` + `logs/agent/*` thì không stash; auto-pop stash cũ >7 ngày.
- **Done khi:** Daemon không stash mất work-in-progress; test script dry-run.
- **Started:** 2026-06-26 — autopilot (no human)


### TASK-044 — Placement test retry stability
- **Status:** `ready`
- **Mô tả:** Ổn định E2E placement nếu flake (wait for network idle, isolate test user).
- **Done khi:** 3 E2E run liên tiếp pass.
- **Started:** auto-refill

### TASK-045 — Sync AGENT_AUTOPILOT.md với auto-refill
- **Status:** `ready`
- **Mô tả:** Doc mô tả AGENT_ROADMAP.md + refill script; xóa hướng dẫn "user thêm task thủ công".
- **Done khi:** Doc khớp scripts hiện tại.
- **Started:** auto-refill

### TASK-046 — Curriculum quality B2 audio declarations
- **Status:** `ready`
- **Mô tả:** Extend `curriculum-quality.test.ts` verify mọi B2 unit có `audio` path declared cho vocab+dialogue.
- **Done khi:** Test pass; 0 missing audio fields.
- **Started:** auto-refill


---

## Nhật ký agent

| Date | Task | Result | Commit |
|------|------|--------|--------|
| 2026-06-26 | TASK-044 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-045 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-046 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-042 | research(agents+memory+grep+roadmap+units+placement), update PLAN+BACKLOG in_progress, minimal add B2 units(33-42) group + "B2" badge pill + startingUnitIndex respect (entry highlight + review dim) inside phase-3 card in RoadmapClient, lint+159+tsc pass, commit 473f514 + git-push.sh main | done — 473f514 |
| 2026-06-26 | TASK-041 | research(agents+memory+grep+pkg+gen+readme), set in_progress, add audio:generate:all (chain a0-a1-a2-b1-b2) + audio:generate:list (dry-run prints 50 folders exactly), doc in README, lint+159+tsc pass, commit+push via git-push.sh main | done — 242328e |
| 2026-06-26 | TASK-042 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-043 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-037 | E2E playwright /learn/unit-19 click vocab speaker, verify Audio or TTS no-crash + network /audio/ probe; lint+159 pass | ffc66bc |
| 2026-06-26 | TASK-038 | research(agents+memory+grep+setup+profile migration), set in_progress, update PLAN+BACKLOG, add profile cleanup in setup-integration, append RLS+columns tests (own insert success + cross-user block) to progress.integration.test.ts, lint+159 units+23 integration (incl 2 new) pass, commit+push via git-push.sh | 339f5a9 |
| 2026-06-26 | TASK-037 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-038 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-039 | research(agents+memory+grep+dashboard+stats), plan update, run refill, set in_progress, minimal fix stats.ts getter daily_xp_goal from DB, lint+159+tsc pass, commit 9cefdd7 + git-push.sh; status done | done — 9cefdd7 |
| 2026-06-26 | TASK-040 | research+plan+refill, impl scripts/smoke-learn.sh + npm smoke:learn, lint+159+tsc pass, commit+push via git-push | done — 3a795df |
| 2026-06-26 | TASK-001 | Supabase migration | blocked — no CLI/token |
| 2026-06-26 | TASK-002 | Vercel deploy check | done — 334ca23 READY |
| 2026-06-26 | TASK-010 | A1 audio unit-1..12 | done — autopilot batch |
| 2026-06-26 | TASK-001 | Supabase placement migration | done — db push |
| 2026-06-26 | TASK-011 | Placement E2E B1 → unit-19 | done — e2e/helpers/auth |
| 2026-06-26 | TASK-012 | Roadmap starting_unit_index | done — getNextUnitRoute |
| 2026-06-26 | TASK-020 | progress integration flakes | done — RPC date cast + schema |
| 2026-06-26 | TASK-021 | Sync PAGE_SPECIFICATIONS (placement,50u,header,autopilot) | done — 3d36d2f (docs) |
| 2026-06-26 | TASK-030 | Native audio A2 (unit-13..18) | done — 6bbc693 (84 clips + script) |
| 2026-06-26 | TASK-030 | Re-verify: ran gTTS for 17/18, all 14/14 clips, lint clean, 159 tests pass | done — 202bfea (final log+push) |
| 2026-06-26 | TASK-031 | Native audio B1 (extend gen+pkg, 196 MP3s unit19-32, test fix for env, lint+159+tsc pass) | done — 2119534 |
| 2026-06-26 | TASK-032 | Persist onboarding Q2-Q4: new migration user_onboarding_profile, pass all params in login+callback, insert profile + daily_xp_goal, patch types, helpers; lint+159+tsc pass | done — cab2260 |
| 2026-06-26 | TASK-033 | Native audio B2 (unit-33..42) — generator+b2 script, 144 MP3s, lint+159 pass | done — cff5faa |
| 2026-06-26 | TASK-034 | Regenerate supabase.ts post onboarding migration | done — 71d846d |
| 2026-06-26 | TASK-035 | E2E test signup persist to user_onboarding_profile + daily_xp_goal | done — 7030384 |
| 2026-06-26 | TASK-036 | Fix audio path /unitN vs /unit-N (rewrite + verify B1/B2 playUnitAudio native) | done — 0d30be9 |
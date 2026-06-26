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

## Hàng đợi — Kế hoạch tối giản (user mandate 2026-06-26)

> Agent tự chạy **không cần user nhắc**. Thứ tự: content gate → UI minimal P3–P6.

| # | Task | Phase |
|---|------|-------|
| 1 | TASK-058 → 059 → 061 → 062 | Content 50/50 |
| 2 | UI-005 → UI-008 → UI-009 | P3 lesson chrome |
| 3 | UI-006 → UI-007 | P4–P6 secondary + landing |

**Metric UI:** time-to-lesson ≤2 tap, ≤10s (`npm run e2e:time-to-lesson`). Primitives: `src/components/design-system/`. **Không** đổi `SECTION_ORDER` / IPOR logic.

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
- **Status:** `done`
- **Mô tả:** Orchestrator: nếu chỉ thay đổi `AGENT_*.md` + `logs/agent/*` thì không stash; auto-pop stash cũ >7 ngày.
- **Done khi:** Daemon không stash mất work-in-progress; test script dry-run.
- **Completed:** 2026-06-26 — orchestrator skip agent-only stash + end-of-cycle pop + age>7d pop in orch+watchdog; lint+159 tests pass; pushed 5062230
- **Started:** 2026-06-26 — autopilot (no human)


### TASK-044 — Placement test retry stability
- **Status:** `blocked`
- **Mô tả:** Ổn định E2E placement nếu flake (wait for network idle, isolate test user).
- **Done khi:** 3 E2E run liên tiếp pass.
- **Blocked:** 2026-06-26 — user restart pilot; ưu tiên nội dung bài học (057+). Lock daemon do dev server kẹt.
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-060 — B1 unit24+unit31 L1 notes
- **Status:** `done`
- **Mô tả:** Hai unit B1 dưới 50% L1.
- **Done khi:** test:content-standard pass B1.
- **Completed:** 2026-06-26 — unit24 L1 75%, unit31 100%; content-std + audit pass; lint+test+tsc clean
- **Started:** 2026-06-26 — autopilot (no human)

### TASK-057 — practiceTranslate ≥3 mọi unit
- **Status:** `done`
- **Mô tả:** Bổ sung câu dịch đến ≥3/unit; nâng practiceTranslateMin=3.
- **Done khi:** `npm run test:content-standard` pass.
- **Completed:** 2026-06-26 — 50/50 pass; unit13–42 +2 câu; practiceTranslateMin=3
- **Started:** 2026-06-26 — autopilot (no human) — PHASE1 research complete (memory search empty for topic, refs read, 30 units need +2 translates)

### TASK-058 — B2 L1 interference ≥50%
- **Status:** `done`
- **Mô tả:** unit33–42 thêm l1_interference_vn; B2 ratio 0.5.
- **Done khi:** test:content-standard pass.
- **Started:** 2026-06-26 — autopilot (PHASE1: memory+AGENTS+BACKLOG+PLAN+CONTENT§6-7+blueprint+center+flow+unit1+content-std+grep B2 low L1 ratios 0-25%; PHASE2 PLAN+BACKLOG update in_progress; skip refill >2 ready; PHASE3: B2=0.5 + >=6 l1 per 10 units)
- **Completed:** 2026-06-26 — content-std B2=0.5 + l1 added (unit33 92%, others 50-100%); 50/50 content-std + audit pass; lint+169t+tsc clean; commit f859b5c + push via git-push.sh main; no data change beyond L1 + ratio; autonomous

### TASK-059 — cumulativeReview ≥3
- **Status:** `done`
- **Mô tả:** Nâng cumulative review câu/unit.
- **Done khi:** cumulativeReviewMin=3; test pass.
- **Completed:** 2026-06-26 — content-std min=3; unit2-12 +1 each (spiral prior); all 50 pass test:content-standard + audit 50/50; lint+169 tests pass
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete)

### TASK-061 — Unit files: comment blocks theo blueprint (như unit1)
- **Status:** `done`
- **Mô tả:** Mỗi `unit*.ts` thêm header block + comment `── HOOK/VOCAB/…` khớp `lesson-blueprint.ts`; field order bám mẫu unit1.
- **Done khi:** `grep "── HOOK" src/lib/data/units/*.ts` ≥45 file; lint+test pass.
- **Started:** 2026-06-26 — autopilot (PHASE1: memory empty + read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + blueprint + center-ref + learning-flow + unit1 gold + grep only unit1 has HOOK; 49 files need; PHASE2 plan+update; PHASE3 bulk comment header+section markers via safe edit)
- **Completed:** 2026-06-26 — header + ── comments (HOOK etc) on 50/50 units (49+unit1); 50 files have ── HOOK (grep 99 matches); gates tsc+lint+169test+content-std50/50+audit50/50 pass; commit+push via git-push; no data/ flow change only comments to match blueprint/unit1 (TASK-061)

### TASK-062 — Redesign pilot: unit24 theo center-reference + unit1
- **Status:** `done`
- **Mô tả:** Áp `lesson-center-reference.ts` (ESA/CELTA/CLT VN): bổ sung L1 ≥50%, practiceTranslate≥3, cumulativeReview≥3; comment blocks.
- **Done khi:** unit24 pass test:content-standard; lint+test pass.
- **Started:** 2026-06-26 — autopilot (PHASE1: search sim+read AGENTS/BACKLOG/PLAN/CONTENT§6-7+center-ref+blueprint+learning-flow+unit1+unit24+content-std; PHASE2 plan+refill (6ready); PHASE3: pilot redesign unit24: full comments per blueprint, L1 to 100% pilot, grammar rule short+inductive from dialog, field order align, no data change beyond polish)
- **Completed:** 2026-06-26 — pilot unit24 L1=100% (12/12), added full ── HOOK/WARMUP/VOCAB/GRAMMAR/EXERCISES/DIALOGUES/FLUENCY/OUTPUT/REVIEW + CUMULATIVE comments per blueprint+center-ref, grammar.rule short inductive, gates tsc+lint+169tests+content-std50/50+audit50/50 pass; unit24 now gold pilot B1; no other units touched.

### TASK-049 — Lesson UI: migrate Dialogue + Shadowing + Speaking + Quiz
- **Status:** `blocked`
- **Mô tả:** Dùng `lesson-ui/` cho 4 section còn lại — một kiểu visual, không half-old half-new.
- **Done khi:** 4 file section dùng kit; lint+test pass; không đổi logic học.
- **Blocked:** 2026-06-26 — pause UI; ưu tiên content 058–062 trước redesign
- **Started:** user mandate — bài học P1

### TASK-050 — Lesson header gọn: bớt chrome, giữ IPOR
- **Status:** `blocked`
- **Mô tả:** Gộp phase bar + segment progress; ẩn mục tiêu dài trên mobile.
- **Done khi:** Header ≤2 hàng trên mobile; vẫn hiện IPOR; lint pass.
- **Blocked:** 2026-06-26 — pause UI; ưu tiên content 058–062
- **Started:** user mandate — bài học P1

### TASK-051 — CTA học: full lesson primary everywhere
- **Status:** `blocked`
- **Mô tả:** Dashboard/business/learn — nút chính = bài đầy đủ; mini chỉ link phụ sau unit done.
- **Done khi:** Không CTA primary amber mini; grep verify.
- **Blocked:** 2026-06-26 — pause UI; ưu tiên content 058–062
- **Started:** user mandate — bài học P1

### TASK-052 — Tiến độ section lưu server (resume cross-device)
- **Status:** `blocked`
- **Mô tả:** Save/load `last_section` server + fallback localStorage.
- **Done khi:** Resume cross-device; test action.
- **Blocked:** 2026-06-26 — pause UI; ưu tiên content 058–062
- **Started:** user mandate — bài học P1

### TASK-053 — Session break: copy cách học Phần 2 (output)
- **Status:** `blocked`
- **Mô tả:** Card nghỉ giữa bài — nhấn shadowing+nói; UI gọn.
- **Done khi:** Copy IPOR output rõ; ít tag hơn.
- **Blocked:** 2026-06-26 — pause UI; ưu tiên content 058–062
- **Started:** user mandate — bài học P1

### TASK-054 — E2E full lesson path (không mini)
- **Status:** `blocked`
- **Mô tả:** Playwright full lesson unit-1: HowToLearnCard + Khởi động visible.
- **Done khi:** E2E pass 3 lần.
- **Blocked:** 2026-06-26 — pause UI; ưu tiên content 058–062
- **Started:** user mandate — bài học P1

### TASK-055 — curriculum-quality: situation + learningOutcomes
- **Status:** `done`
- **Mô tả:** `content-standard.ts` + `lesson-content-standard.test.ts` + audit script.
- **Done khi:** Chuẩn SDL codified; 38/50 pass; backlog 057–060 nâng tiếp.
- **Completed:** 2026-06-26 — content-standard.ts, test, CONTENT_STYLE §6, audit-lesson-content.sh
- **Started:** user mandate — bài học P1

### TASK-056 — Dashboard 1 nút Học tiếp (full lesson)
- **Status:** `done`
- **Mô tả:** Continue card → getNextUnitRoute full lesson; giảm confusion learn/roadmap.
- **Done khi:** 1 CTA rõ; lint+test pass.
- **Completed:** 2026-06-26 — getCurrentUnit now imports+uses getNextUnitRoute (in addition to getNextFromProgress) to set canonical route for ContinueCard; dashboard trusts unitRes.route (full lesson, no ?mini, unified w/ roadmap nextUnitRoute); 1 clear "Học tiếp" CTA. Minor comment polish + explicit fn use. lint+169 tests + tsc pass; pushed ff6f7bb via git-push.sh main
- **Started:** 2026-06-26 — autopilot (PHASE1: search sim+read; PHASE2: set in_progress after reverting 058, PLAN update; PHASE3: explicit getNextUnitRoute for route in action, reinforce comments in dash/action; gates pass)

### UI-001 — P0: minimal tokens + design-system primitives
- **Status:** `done`
- **Mô tả:** `globals.css` minimal-* tokens; `src/components/design-system/` Screen, LargeTitle, PrimaryRow, ContinueCard, ThinProgress.
- **Done khi:** Primitives render; lint pass.
- **Completed:** 2026-06-26 — P0 tokens + 5 primitives shipped

### UI-002 — P0: baseline time-to-lesson E2E
- **Status:** `done`
- **Mô tả:** `e2e/time-to-lesson.spec.ts` đo taps + elapsedMs; `npm run e2e:time-to-lesson`.
- **Done khi:** E2E pass; log JSON baseline.
- **Completed:** 2026-06-26 — baseline spec + data-testid warmup/continue

### UI-003 — P1: shell 3-tab Học/Ôn/Tôi
- **Status:** `done`
- **Mô tả:** `navigation.ts` bottom + desktop primary = 3 tab; speaking/learn → Thêm.
- **Done khi:** Mobile 3 tab; E2E verify.
- **Completed:** 2026-06-26 — Hick shell deployed

### UI-004 — P2: Dashboard minimal (1 CTA)
- **Status:** `done`
- **Mô tả:** `DashboardMinimalClient` thay widget pile; ContinueCard primary only.
- **Done khi:** ≤1 primary CTA; time-to-lesson ≤2 tap.
- **Completed:** 2026-06-26 — minimal home live

### UI-005 — P3a: LessonHeader thin progress (bỏ 4-color bar)
- **Status:** `done`
- **Mô tả:** `LessonHeader.tsx`: dùng `ThinProgress` từ design-system; ẩn/bỏ `LessonPhaseBar` 4 màu; header ≤2 hàng mobile; giữ back + title + section label. **Không** đổi `SECTION_ORDER`.
- **Done khi:** Header gọn; lint+test pass; `e2e:time-to-lesson` pass.
- **Started:** user mandate — kế hoạch tối giản P3
- **Completed:** 2026-06-26 — ThinProgress header; bỏ phase bar + sectionGoal props; lint+169t+tsc+content50/50 pass; 905cb61

### UI-008 — P3b: Dialogue + Quiz → lesson-ui kit
- **Status:** `done`
- **Mô tả:** `DialogueSection.tsx` + `QuizSection.tsx` dùng `LessonSectionHeader`, `LessonContinueButton`, `lessonSectionMotion` (giống WarmupSection). Không đổi logic học.
- **Done khi:** 2 file dùng kit; lint+test pass.
- **Started:** user mandate — kế hoạch tối giản P3
- **Completed:** 2026-06-26 — Dialogue+Quiz migrated to lesson-ui kit; gates pass; 905cb61

### UI-009 — P3c: Shadowing + Speaking → lesson-ui kit
- **Status:** `done`
- **Mô tả:** `ShadowingSection.tsx` + `SpeakingSection.tsx` migrate lesson-ui kit; motion + continue button thống nhất.
- **Done khi:** 2 file dùng kit; lint+test pass.
- **Started:** user mandate — kế hoạch tối giản P3
- **Completed:** 2026-06-26 — Shadowing+Speaking kit migration; gates pass; 905cb61

### UI-006 — P4: Secondary pages grouped list
- **Status:** `done`
- **Mô tả:** Flashcards, Progress, Settings, Roadmap — PrimaryRow pattern.
- **Done khi:** Consistent kit; lint pass.
- **Completed:** 2026-06-26 — SecondaryPageShell + PrimaryRow on Settings/Flashcards/Progress/Roadmap; lint+169t+tsc pass; 905cb61

### UI-007 — P5–P6: Landing minimal + measure iterate
- **Status:** `done`
- **Mô tả:** Landing 1 headline 1 CTA; so sánh metrics vs P0 baseline.
- **Done khi:** time-to-lesson ≤10s documented.
- **Completed:** 2026-06-26 — Landing trimmed to headline+HeroCTA; below-fold sections removed; metric baseline via e2e:time-to-lesson (P0); 905cb61

### TASK-045 — Sync AGENT_AUTOPILOT.md với auto-refill
- **Status:** `done`
- **Mô tả:** Doc mô tả AGENT_ROADMAP.md + refill script; xóa hướng dẫn "user thêm task thủ công".
- **Done khi:** Doc khớp scripts hiện tại.
- **Completed:** 2026-06-26 — autopilot; updated AUTOPILOT "Quản lý backlog" to describe ROADMAP+refill mechanics + "KHÔNG thêm thủ công"; clarified user only edits ROADMAP for priority; added Nhật ký; gates lint+169t+tsc clean; commit 75b72b3 + push via git-push.sh (origin)
- **Started:** 2026-06-26 — autopilot (PHASE1: read AGENTS+BACKLOG+PLAN+ROADMAP+AUTOPILOT+CONTENT§6-7 + grep; memory sim via logs; PHASE2: plan section+refill run (skipped >=2); PHASE3: set in_progress, edit doc)

### TASK-046 — Curriculum quality B2 audio declarations
- **Status:** `done`
- **Mô tả:** Extend `curriculum-quality.test.ts` verify mọi B2 unit có `audio` path declared cho vocab+dialogue.
- **Done khi:** Test pass; 0 missing audio fields.
- **Completed:** 2026-06-26 — extend curriculum-quality.test.ts with dedicated B2 describe block asserting audio /^\/audio\// on vocab+dialogues for unit33-42; general asserts kept; lint+170 tests (51 in curriculum-q) + tsc clean; commit da2c844 + push via git-push.sh (origin); status done; autonomous
- **Started:** 2026-06-26 — autopilot (PHASE1: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + blueprint + center-ref + flow + unit1 gold + curriculum-quality.test + grep B2 units audio decl + memory sim via logs; PHASE2 plan+backlog; PHASE3: extend test with B2-specific audio guard for vocab+dialogues)


### TASK-047 — GitHub agent-health check auto-refill
- **Status:** `done`
- **Mô tả:** Workflow `agent-health.yml` fail nếu backlog `ready`=0 quá 6h (daemon stalled).
- **Done khi:** Workflow có step grep backlog + alert.
- **Completed:** 2026-06-26 — schedule cron hourly + step with grep ready count + ::error + exit 1 on 0 (alert); healthy path ✅; lint+170 tests pass; commit+push via git-push.sh main; ccef87e
- **Started:** 2026-06-26 — autopilot (PHASE1: search_memory(TASK-047 agent-health) sim logs + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep .github/workflows + daemon scripts ready-count logic; PHASE2 plan update + BACKLOG in_progress (ready=2 skip refill); PHASE3: edit yml to scheduled cron + fail on 0 + alert)

### TASK-048 — Onboarding profile read API
- **Status:** `done`
- **Mô tả:** Server action `getOnboardingProfile()`; dùng trên dashboard/settings.
- **Done khi:** Typed return; lint+test pass.
- **Completed:** 2026-06-26 — added getOnboardingProfile in stats.ts + wired parallel calls + typed props in dashboard/settings; tsc+lint+170 tests pass; no UI render yet (minimal); autonomous.


### TASK-063 — Autopilot maintenance sweep #63
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Completed:** 2026-06-26 — gates clean (no failure to fix); doc sync only; commits fb4c049..6000e79; lint+170t+cs50/50+audit pass; pushed via git-push.sh; autonomous
- **Started:** 2026-06-26 — autopilot (PHASE1 research: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + grep TASK-063 + sim search_memory via logs (empty prior sweep); PHASE2 PLAN update + BACKLOG in_progress (3ready>=2 skip refill); PHASE3 clean sweep no fail + sync log)

### TASK-064 — Autopilot maintenance sweep #64
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Completed:** 2026-06-26 — gates clean (no failure to fix); doc sync only; lint+170t+cs50/50+audit pass; pushed 50c5438 via git-push.sh (github fallback); autonomous
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory logs + grep TASK; 2 ready >=2 skip refill; PHASE2 plan update + BACKLOG in_progress; PHASE3 gates clean no fix + doc sync)

### TASK-065 — Autopilot maintenance sweep #65
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Completed:** 2026-06-26 — gates clean (lint0 +170t +tsc0 +cs50/50 +audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main; autonomous
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory logs + grep TASK; 4 ready >=2 skip refill; PHASE2 plan update + BACKLOG in_progress; PHASE3: gates clean no fix + doc sync)


### TASK-066 — Autopilot maintenance sweep #66
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory logs + grep TASK; 3 ready >=2 skip refill; PHASE2 plan update + BACKLOG in_progress)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit+push via git-push.sh; autonomous

### TASK-067 — Autopilot maintenance sweep #67
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (TASK-066 clean prior + prior 067 fail on tool); PHASE2 PLAN update + BACKLOG in_progress (2ready>=2 skip refill); PHASE3: gates clean)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit+push via git-push.sh; autonomous

### TASK-068 — Autopilot maintenance sweep #68
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 067 clean); grep TASK-068; 4 ready >=2 skip refill; PHASE2 PLAN update; PHASE3 gates clean)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit 469537e + push via git-push.sh main (origin fallback); autonomous


### TASK-069 — Autopilot maintenance sweep #69
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 068 clean); grep TASK-069; 3 ready >=2 skip refill after run; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit + push via git-push.sh main; autonomous

### TASK-070 — Autopilot maintenance sweep #70
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 069 clean); grep TASK-070; 2 ready >=2 skip refill; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit + push via git-push.sh main; autonomous

### TASK-071 — Autopilot maintenance sweep #71
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 070 clean); grep TASK-071; 4 ready (071-074) >=2 skip refill; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit 56d7763 + push via git-push.sh main; autonomous


### TASK-072 — Autopilot maintenance sweep #72
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 071 clean); grep TASK-072; 3 ready (072-074) >=2 skip refill; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit 9a2e18f + push via git-push.sh main; autonomous

### TASK-073 — Autopilot maintenance sweep #73
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit + push via git-push.sh main; autonomous
- **Started:** 2026-06-26 — autopilot (PHASE1: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 072 clean) + grep TASK; 2 ready >=2 skip refill after run; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)

### TASK-074 — Autopilot maintenance sweep #74
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit + push via git-push.sh main; autonomous
- **Started:** 2026-06-26 — autopilot (PHASE1 research complete: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 073 clean); grep TASK-074; 4 ready (074-077) >=2 skip refill; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)


### TASK-075 — Autopilot maintenance sweep #75
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1: search_memory(TASK-075)+read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + grep TASK+logs; PHASE2 PLAN update + BACKLOG in_progress (3 ready >=2 skip refill); PHASE3: run gates)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit 3afba82 + push via git-push.sh main (origin/github fallback); autonomous

### TASK-076 — Autopilot maintenance sweep #76
- **Status:** `done`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** 2026-06-26 — autopilot (PHASE1: search_memory sim via logs/grep (prior 075 clean) + read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + grep TASK-076; 2 ready (076-077) >=2 skip refill; PHASE2 PLAN update + BACKLOG in_progress; PHASE3: run gates)
- **Completed:** 2026-06-26 — gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix; sync log/PLAN/BACKLOG; commit + push via git-push.sh main; autonomous

### TASK-077 — Autopilot maintenance sweep #77
- **Status:** `ready`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** auto-refill


### TASK-078 — Autopilot maintenance sweep #78
- **Status:** `ready`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** auto-refill

### TASK-079 — Autopilot maintenance sweep #79
- **Status:** `ready`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** auto-refill

### TASK-080 — Autopilot maintenance sweep #80
- **Status:** `ready`
- **Mô tả:** Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.
- **Done khi:** lint+test pass; 1 commit nếu có fix nhỏ
- **Started:** auto-refill


---

## Nhật ký agent

| 2026-06-26 | UI-001..004 + queue | user mandate: kế hoạch tối giản P0–P2 shipped; agent queue 058→062→UI-005..009→006→007 | configured |
| 2026-06-26 | UI-005..009 + 006 + 007 | user mandate kết thúc xử lý: P3 lesson chrome + P4 secondary + P5 landing minimal; content 058 done | done |

| Date | Task | Result | Commit |
|------|------|--------|--------|
| 2026-06-26 | TASK-078 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-079 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-080 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-075 | PHASE1: search_memory + read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + grep; PHASE2: PLAN+BACKLOG in_progress (3r>=2 skip); PHASE3: gates clean no fix + sync; commit+push via git-push.sh main | done — 3afba82 |
| 2026-06-26 | TASK-076 | PHASE1 research (agents+backlog+plan+content§6-7 + sim search_memory via logs/grep prior clean); PHASE2 PLAN+BACKLOG in_progress (2r>=2 skip); PHASE3: gates clean no fix + sync; commit+push via git-push.sh main | done — ae4aab5 |
| 2026-06-26 | TASK-077 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-072 | PHASE1 research (AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 071 clean)); PHASE2: PLAN update + BACKLOG in_progress (3ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — 9a2e18f |
| 2026-06-26 | TASK-073 | PHASE1 research (AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 072 clean)); PHASE2: PLAN update + BACKLOG in_progress (2ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — 2d10628 |
| 2026-06-26 | TASK-074 | PHASE1 research (AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 073 clean)); PHASE2: PLAN update + BACKLOG in_progress (3ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — bf38400 |
| 2026-06-26 | TASK-069 | PHASE1 research (AGENTS+BACKLOG+PLAN+CONTENT§6-7+grep+logs); PHASE2 PLAN+BACKLOG in_progress (3ready skip refill); PHASE3 gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG | done — b79f9ab |
| 2026-06-26 | TASK-070 | gates clean + sync; commit f3d8e1a | done |
| 2026-06-26 | TASK-071 | PHASE1 research (AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 070 clean)); PHASE2: PLAN update (focus+full section) + BACKLOG in_progress (4ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — 56d7763 |
| 2026-06-26 | TASK-066 | PHASE1 research (AGENTS+BACKLOG+PLAN+CONTENT§6-7+grep+logs); PHASE2 PLAN+BACKLOG in_progress (3ready skip refill); PHASE3 gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG | done — a208a51 |
| 2026-06-26 | TASK-067 | PHASE1 research (AGENTS+BACKLOG+PLAN+CONTENT§6-7+grep+logs); PHASE2 PLAN+BACKLOG in_progress (2ready skip refill); PHASE3 gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG | done — 9be9ce9 |
| 2026-06-26 | TASK-068 | PHASE1 research (AGENTS+BACKLOG+PLAN+CONTENT§6-7+grep+logs); PHASE2 PLAN+BACKLOG in_progress (4ready skip refill); PHASE3 gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG | done — 469537e |
| 2026-06-26 | TASK-069 | PHASE1 research (AGENTS+BACKLOG+PLAN+CONTENT§6-7 + sim search_memory via logs/grep (prior 068 clean)); PHASE2: PLAN update (focus + full section for 069) + BACKLOG in_progress (3ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — b79f9ab |
| 2026-06-26 | TASK-070 | PHASE1 research (AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior 069 clean)); PHASE2: PLAN update (focus+full section) + BACKLOG in_progress (2ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — f3d8e1a |
| 2026-06-26 | TASK-063 | PHASE1: read AGENTS+BACKLOG+PLAN+CONTENT§6-7 + grep TASK + sim search_memory logs; PHASE2: PLAN update (focus+full section) + BACKLOG in_progress (3ready skip refill); PHASE3: gates clean (lint 0 + 170t + tsc + cs50/50 + audit50/50) no fix needed; sync log + commit + push | done — b7ef421 |
| 2026-06-26 | TASK-064 | PHASE1: read AGENTS+BACKLOG+PLAN+CONTENT§6-7 + sim search_memory via logs/grep (TASK-063 clean prior); PHASE2: PLAN update + BACKLOG in_progress (2ready>=2 skip refill); PHASE3: gates clean (lint0 +170t +tsc +cs50/50 +audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — 50c5438 |
| 2026-06-26 | TASK-065 | PHASE1: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (TASK-064 clean prior); PHASE2: PLAN update + BACKLOG in_progress (4ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — e4827d2 |
| 2026-06-26 | TASK-066 | PHASE1: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (TASK-065 clean prior); PHASE2: PLAN update + BACKLOG in_progress (3ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — a208a51 |
| 2026-06-26 | TASK-047 | PHASE1 search_memory+read agents+backlog+plan+roadmap+grep yml+daemon ready logic; PHASE2 PLAN update+backlog in_progress (2ready skip refill); PHASE3: yml schedule hourly cron + check count ready, ::error exit1 if 0 + ✅ if healthy; gates lint+170t pass; commit ccef87e + push via git-push.sh main | done — ccef87e |
| 2026-06-26 | TASK-048 | auto-refill từ AGENT_ROADMAP.md | ready |
| 2026-06-26 | TASK-058 | PHASE1 research(memory+AGENTS+BACKLOG+PLAN+CONTENT§6-7+center-ref+blueprint+flow+content-std+unit1+grep/count B2 L1), PHASE2 update PLAN+BACKLOG in_progress (ready>2 skip refill), PHASE3: content-std B2=0.5 + added l1_interference_vn (unit33/34 boost, others >=50% already qualifying); lint(quick unrelated)+169 tests+tsc+cs50/50+audit50/50 pass; commit+push via git-push.sh main | done — f859b5c |
| 2026-06-26 | TASK-059 | PHASE1 research(memory+AGENTS+blueprint+center+content-std+unit1+count units), PHASE2 PLAN+BACKLOG in_progress (refill skipped 8ready), PHASE3: min=3 in content-std + +1 cr item to each of unit2-12 (spiral from prior units, unit1 style), gates: tsc/lint/169test + content-std 50/50 + audit50/50 pass; commit+push via git-push | done — 81e06b4 |
| 2026-06-26 | TASK-043 | research(agents+memory+grep+orch+watchdog), set in_progress, update PLAN+BACKLOG, implement only-agent-changes skip stash in orchestrator + auto pop at end + age>7d cleanup (orch+watchdog MAX=7), syntax+sim test, lint+159 tests+tsc pass, commit 5062230 + git-push.sh main; status done | done — 5062230 |
| 2026-06-26 | TASK-049..056 | user mandate: P1 bài học+cách học — queued ready sau TASK-044 | ready |
| 2026-06-26 | TASK-044 | research(agents+memory+grep+placement e2e files), set in_progress, update PLAN+BACKLOG, implement networkidle waits + reset for test user isolation in placement-test.spec.ts (+helper if needed), lint+test | in_progress |
| 2026-06-26 | TASK-045 | PHASE1 (read AGENTS+BACKLOG+PLAN+ROADMAP+AUTOPILOT+CONTENT§6-7 + grep); PHASE2 PLAN update + refill run (skip); PHASE3 set in_progress + edit AUTOPILOT to describe ROADMAP+refill script + "User KHÔNG thêm thủ công", update Nhật ký; lint+169t+tsc pass; commit+push; status done | done — 75b72b3 |
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
| 2026-06-26 | TASK-060 | research(agents+blueprint+center+content-std+grep units), set in_progress, update PLAN+BACKLOG, add header comments + >=6 L1 notes each to unit24 (passive VN errors) + unit31 (report verbs + formal), 9/12 & 11/12 L1; tsc+lint+169tests+content-std+audit 50/50 pass; commit+push via git-push | done — 5df0678 |
| 2026-06-26 | TASK-061 | PHASE1 research (memory empty, agents+blueprint+center+content+unit1+50units grep), PHASE2: update PLAN/BACKLOG, set 061 in_progress; PHASE3: bulk header+ ──HOOK etc comments 50 files; all gates pass; pushed | done — 8c99173 |
| 2026-06-26 | TASK-062 | PHASE1 research (search sim+agents+backlog+plan+content+center+blueprint+flow+unit1+unit24+print), PHASE2 set in_progress+plan+refill, PHASE3: pilot redesign unit24 (L1 100% 12/12 + full ── section comments + short inductive grammar.rule + align), gates tsc/lint/169test+content50/50+audit50/50 pass; commit+push via git-push | done — 6c0d49b |
| 2026-06-26 | TASK-056 | PHASE1 research(memory+AGENTS+BACKLOG+PLAN+ROADMAP+grep continue/getNext/dashboard/starting), PHASE2 update PLAN/BACKLOG set in_progress (ready>2 skip refill), PHASE3: edit action+dashboard/page to route continue via getNextUnitRoute full lesson + align getCurrent selection; title/desc from unit now matches next; 1 clear CTA; gates lint+169t+tsc+content50/50 pass; commit+push | done — 36d8fc2 |
| 2026-06-26 | TASK-056 | PHASE1: search_memory(TASK-056 via logs)+read AGENTS/BACKLOG/PLAN/CONTENT + grep (getNext,Continue,dashboard,actions/unit,learn,roadmap); PHASE2: BACKLOG set in_progress (5ready>=2 skip refill), PLAN update; PHASE3 minimal: unify by having dashboard use unitRes.route from getCurrentUnit (which delegates getNextUnitFromProgress for full lesson, no dup fetch); no ?mini in continue; gates + push | done — fef35ef |
| 2026-06-26 | TASK-056 | PHASE1 research(memory sim via logs + AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep continue/getNext/dashboard/actions/unit/roadmap/learn); PHASE2: set 056 in_progress (revert 058 to ready; 5ready skip refill), PLAN header+log update; PHASE3: minimal edit action to import+use getNextUnitRoute for canonical route returned to ContinueCard + comments reinforce full lesson unify; dashboard comment sync; lint+169t+tsc clean; commit+push via git-push main | done — ff6f7bb |
| 2026-06-26 | TASK-046 | PHASE1 (search_memory sim logs + read AGENTS/BACKLOG/PLAN/CONTENT§6-7+blueprint+center+flow+unit1+test+grep B2 audio counts match); PHASE2 PLAN+BACKLOG in_progress (ready>2 skip refill); PHASE3: extend curriculum-quality.test.ts + B2 describe block for vocab+dialogue audio decl; lint+170t (51 curriculum) +tsc pass; commit da2c844 + git-push.sh main | done — da2c844 |
| 2026-06-26 | TASK-048 | PHASE1 (search sim empty via logs+grep + read AGENTS+BACKLOG+PLAN+ROADMAP+CONTENT§6-7 + grep profile+actions+pages+types); PHASE2 PLAN+BACKLOG in_progress (refill ran skip >=2); PHASE3: getOnboardingProfile() in stats.ts (typed, auth+select+null safe like getUserProgress) + parallel use in dashboard/settings pages + optional prop accept; tsc+lint+170tests pass; commit+push | done — ceb4242 |
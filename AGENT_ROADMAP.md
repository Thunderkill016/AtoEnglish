# Agent Roadmap — Task pool (tự động)

> **Không sửa tay khi đang autopilot.** Daemon đọc file này khi backlog có ít hơn 2 task `ready`,
> tự chèn task mới vào `AGENT_BACKLOG.md` và tiếp tục làm — **không cần user nhắc**.

## Cách hoạt động

1. `scripts/agent-refill-backlog.sh` chạy mỗi cycle (daemon + orchestrator)
2. Nếu `ready` < `MIN_READY` (2) → lấy task từ pool dưới đây chưa có trong backlog
3. Chèn tối đa 4 task `ready`, commit `chore(agent): auto-refill backlog`
4. Headless agent nhận task đầu tiên ngay trong cùng cycle

## Quy tắc thêm task mới vào pool

- Format giống backlog: `### TASK-NNN — Title` + Mô tả + Done khi
- Chỉ thêm số TASK **lớn hơn** mọi TASK đã có trong backlog
- **Ưu tiên (2026-06-26+):** **V2 Minimal Redesign** TASK-081..090 (`MINIMAL_REDESIGN_V2.md`)

---

## Pool — V2 Minimal Redesign (USER MANDATE 2026-06-26)

> Spec: `MINIMAL_REDESIGN_V2.md`. Metric: time-to-lesson ≤2 tap ≤10s. Không đổi IPOR/FSRS.

### TASK-081 — Placement test: test/saving/results minimal shell
- **Mô tả:** `PlacementTestClient.tsx` — migrate stages test/saving/results sang `SecondaryPageShell` + Tailwind; xóa inline `style={{}}` (~63).
- **Done khi:** 0 inline style trong file; lint+test pass.

### TASK-082 — Pronunciation module minimal
- **Mô tả:** `PronunciationClient.tsx` — `SecondaryPageShell` + design-system; xóa inline styles (~63).
- **Done khi:** 0 inline style; lint+test pass.

### TASK-083 — Lesson sections light theme (Grammar/Vocab/Warmup)
- **Mô tả:** Card internals trong 3 section files sang `border-border/60 bg-card` (theo Fluency/Translate).
- **Done khi:** Không `zinc-950`/`text-white` cards; lint+test pass.

### TASK-084 — LessonSectionHeader light tokens
- **Mô tả:** `LessonSectionHeader.tsx` — foreground/muted thay dark island.
- **Done khi:** Khớp light UnitTemplate; lint pass.

### TASK-085 — Login visual minimal
- **Mô tả:** `login/page.tsx` — `MinimalButton` thay gradient; thu gọn desktop panel; giữ 3-step.
- **Done khi:** Không gradient CTA; e2e onboarding pass.

### TASK-086 — Certificate eligible view minimal
- **Mô tả:** `CertificateClient.tsx` eligible — `SecondaryPageShell` + flat card.
- **Done khi:** Dùng design-system; lint+test pass.

### TASK-087 — Legal pages Prose
- **Mô tả:** `terms/page.tsx`, `privacy/page.tsx` — `Screen` + `Prose`.
- **Done khi:** 2 page dùng kit; lint pass.

### TASK-088 — Legacy CSS purge
- **Mô tả:** Xóa `bg-glass`, `bg-grid-pattern`, `border-glass` khỏi `globals.css` nếu không còn dùng trong `src/`.
- **Done khi:** grep src/ không match; lint+test pass.

### TASK-089 — Speaking: tab → sub-routes
- **Mô tả:** `SpeakingClient` 4 tab → PrimaryRow entry + sub-routes theo V2 IA.
- **Done khi:** Không 4-tab trên 1 page; lint+test pass.

### TASK-090 — E2E regression V2
- **Mô tả:** Chạy `e2e:time-to-lesson` + smoke tab paths; fix regression.
- **Done khi:** E2E pass; baseline ghi AGENT_PLAN.

---

## Pool — V2 Phase 2 (post lesson-sections `dc1cd74`)

> Cập nhật 2026-06-27. Lesson sections 5 file đã light; còn login chrome, doc sync, E2E verify.

### TASK-097 — V2 audit: lesson sections no dark islands
- **Mô tả:** `grep` 5 section files (Dialogue/Practice/Speaking/Shadowing/Quiz) + `LessonCard.tsx` — không `zinc-950`, không gradient CTA; fix sót nếu có.
- **Done khi:** grep clean; lint+test pass.

### TASK-098 — Login visual: thu gọn desktop chrome
- **Mô tả:** `login/page.tsx` — bỏ/giảm desktop marketing panel; giữ 3-step + MinimalButton; mobile-first.
- **Done khi:** Không panel >40% width desktop; e2e onboarding pass.

### TASK-099 — MINIMAL_REDESIGN_V2 doc sync
- **Mô tả:** Cập nhật `MINIMAL_REDESIGN_V2.md` §2 hiện trạng + §9 success criteria theo code thực tế post-V2.
- **Done khi:** Doc khớp shipped; không claim task undone đã done.

### TASK-100 — E2E time-to-lesson production baseline
- **Mô tả:** Chạy `npm run e2e:time-to-lesson` + `npm run smoke:learn`; fix flake/regression; ghi baseline AGENT_PLAN.
- **Done khi:** E2E pass 1 lần clean; PLAN có timestamp.

---

## Pool — P1 Kếhoạch tối giản V1 (DONE — archive)

> Metric: time-to-lesson. Primitives: `src/components/design-system/`. UI-001–004 done.

### UI-005 — LessonHeader thin progress
- **Mô tả:** ThinProgress thay LessonPhaseBar; header ≤2 hàng mobile.
- **Done khi:** lint+test; e2e:time-to-lesson pass.

### UI-008 — Dialogue + Quiz lesson-ui kit
- **Mô tả:** Migrate 2 section files to lesson-ui kit.
- **Done khi:** lint+test pass.

### UI-009 — Shadowing + Speaking lesson-ui kit
- **Mô tả:** Migrate 2 section files to lesson-ui kit.
- **Done khi:** lint+test pass.

### UI-006 — Secondary pages PrimaryRow
- **Mô tả:** Flashcards, Progress, Settings, Roadmap — design-system PrimaryRow.
- **Done khi:** lint pass.

### UI-007 — Landing minimal + metrics
- **Mô tả:** Landing 1 headline 1 CTA; document time-to-lesson vs baseline.
- **Done khi:** metric documented.

---

## Pool — P1 Bài học & cách học (content)

> Mục tiêu: trải nghiệm học 1 đường rõ, bài đầy đủ, polish section, không ôn nhanh mặc định.

### TASK-049 — Lesson UI: migrate Dialogue + Shadowing + Speaking + Quiz
- **Mô tả:** Dùng `lesson-ui/` (LessonSectionHeader, LessonContinueButton, lessonSectionMotion) cho 4 section còn lại. Một kiểu visual, không half-old half-new.
- **Done khi:** 4 file section dùng kit; lint+test pass; không đổi logic học.

### TASK-050 — Lesson header gọn: bớt chrome, giữ IPOR
- **Mô tả:** `LessonHeader`: gộp phase bar + segment progress; ẩn mục tiêu dài trên mobile; 1 dòng tiến độ rõ.
- **Done khi:** Header ≤2 hàng trên mobile; vẫn hiện IPOR; lint pass.

### TASK-051 — CTA học: full lesson primary everywhere
- **Mô tả:** Dashboard `UnitCard`, business track, learn list — nút chính = bài đầy đủ; `?mini=1` chỉ link phụ "Ôn lại" sau khi unit done.
- **Done khi:** Không còn CTA primary màu amber mini; grep `mini=1` chỉ secondary links.

### TASK-052 — Tiến độ section lưu server (resume cross-device)
- **Mô tả:** `user_lesson_progress` hoặc cột mới: `last_section`, `mini`. Server action save/load; fallback localStorage.
- **Done khi:** Đổi máy resume đúng section; integration test hoặc unit test action.

### TASK-053 — Session break: copy cách học Phần 2 (output)
- **Mô tả:** Card nghỉ giữa bài: nhấn shadowing+nói bắt buộc; bỏ tag cloud rối; CTA rõ.
- **Done khi:** Copy tiếng Việt ngắn, đúng IPOR output; UI gọn hơn.

### TASK-054 — E2E full lesson path (không mini)
- **Mô tả:** Playwright: auth test user → `/learn/unit-1` không `mini` → thấy HowToLearnCard + SituationCard + section Khởi động.
- **Done khi:** E2E pass 3 lần; không flake.

### TASK-055 — curriculum-quality: bắt buộc situation + learningOutcomes
- **Mô tả:** Extend test: mọi unit phải có `situation` + `learningOutcomes` length≥2 (hoặc enrich-unit fallback documented).
- **Done khi:** Test pass 50 units.

### TASK-057 — Chuẩn content: practiceTranslate ≥3 mọi unit
- **Mô tả:** 30 unit chỉ có 1 câu translate — bổ sung đến ≥3, sát vocab+grammar unit đó.
- **Done khi:** `test:content-standard` pass; LESSON_CONTENT_STANDARD.practiceTranslateMin=3.

### TASK-058 — Chuẩn content: B2 L1 interference ≥50%
- **Mô tả:** unit33–42: thêm `l1_interference_vn` cho từ vựng (lỗi người Việt hay mắc).
- **Done khi:** l1MinRatioByLevel.B2=0.5; test:content-standard pass.

### TASK-059 — Chuẩn content: cumulativeReview ≥3
- **Mô tả:** Nâng cumulativeReviewQuestions từ 1–2 lên ≥3 câu/unit.
- **Done khi:** cumulativeReviewMin=3; test pass.

### TASK-060 — Fix B1 unit24 + unit31 L1 notes
- **Mô tả:** Hai unit B1 dưới 50% L1 — bổ sung ghi chú đủ 50%.
- **Done khi:** test:content-standard pass với B1 min 0.5.

### TASK-056 — Gộp roadmap: 1 nút "Học tiếp" từ dashboard
- **Mô tả:** Dashboard continue card dùng `getNextUnitRoute` + full lesson; ẩn duplicate path /learn vs /roadmap confusion trong copy.
- **Done khi:** 1 CTA rõ; lint+test pass.

---

## Pool — P2 Chất lượng

### TASK-037 — E2E native audio probe on learn page
- **Mô tả:** Playwright: mở `/learn/unit-19`, click vocab speaker, verify `Audio` plays or TTS fallback không crash. Mock hoặc probe network cho `/audio/`.
- **Done khi:** E2E pass trong CI; không flake 3 lần.

### TASK-038 — Integration test user_onboarding_profile
- **Mô tả:** Thêm test trong `progress.integration.test.ts` hoặc file mới: insert profile row, verify RLS + columns goal/obstacle/daily_minutes.
- **Done khi:** Integration test pass với Supabase local/prod test user.

### TASK-039 — Dashboard hiển thị daily_xp_goal từ onboarding
- **Mô tả:** `dashboard/page.tsx` đọc `daily_xp_goal` từ `user_progress`, hiển thị progress bar hôm nay vs goal.
- **Done khi:** UI hiển thị đúng; lint+test pass.

### TASK-040 — Production smoke script learn B2
- **Mô tả:** Script `scripts/smoke-learn.sh` curl 200 cho `/learn/unit-33` và sample static `/audio/unit33/hypothetical.mp3` (sau TASK-036).
- **Done khi:** Script exit 0 trên production URL.

---

## Pool — P3 Mở rộng

### TASK-041 — audio:generate:all npm script
- **Mô tả:** Một script chạy a0+a1+a2+b1+b2; document trong README.
- **Done khi:** Script tồn tại; dry-run list đúng 50 unit folders.

### TASK-042 — Roadmap highlight B2 phase
- **Mô tả:** `RoadmapClient` group B2 units 33-42 với badge level; respect `starting_unit_index` cho B2 user.
- **Done khi:** Roadmap render đúng; unit test hoặc snapshot pass.

### TASK-043 — Reduce agent stash pile-up
- **Mô tả:** Orchestrator: nếu chỉ thay đổi `AGENT_*.md` + `logs/agent/*` thì không stash; auto-pop stash cũ >7 ngày.
- **Done khi:** Daemon không stash mất work-in-progress; test script dry-run.

### TASK-044 — Placement test retry stability
- **Mô tả:** Ổn định E2E placement nếu flake (wait for network idle, isolate test user).
- **Done khi:** 3 E2E run liên tiếp pass.

### TASK-045 — Sync AGENT_AUTOPILOT.md với auto-refill
- **Mô tả:** Doc mô tả AGENT_ROADMAP.md + refill script; xóa hướng dẫn "user thêm task thủ công".
- **Done khi:** Doc khớp scripts hiện tại.

### TASK-046 — Curriculum quality B2 audio declarations
- **Mô tả:** Extend `curriculum-quality.test.ts` verify mọi B2 unit có `audio` path declared cho vocab+dialogue.
- **Done khi:** Test pass; 0 missing audio fields.

### TASK-047 — GitHub agent-health check auto-refill
- **Mô tả:** Workflow `agent-health.yml` fail nếu backlog `ready`=0 quá 6h (daemon stalled).
- **Done khi:** Workflow có step grep backlog + alert.

### TASK-048 — Onboarding profile read API
- **Mô tả:** Server action `getOnboardingProfile()`; dùng trên dashboard/settings.
- **Done khi:** Typed return; lint+test pass.
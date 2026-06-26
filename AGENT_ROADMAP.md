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
- Ưu tiên: P1 sản phẩm → P2 chất lượng → P3 mở rộng

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
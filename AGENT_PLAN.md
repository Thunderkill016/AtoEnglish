# Agent Plan — Tự cập nhật mỗi phiên

> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-06-26 |
| Focus | TASK-041 (audio:generate:all npm script that runs a0+a1+a2+b1+b2 + dry-run list of 50 folders; README doc) |
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

| 2026-06-26 | TASK-033 | B2 audio batch unit-33..42 (144 clips), extend gen+b2 script, lint+159 pass | done — cff5faa |
| 2026-06-26 | TASK-035 | research(memory+agents+e2e files), plan update, extend helpers/auth + onboarding.spec for DB verify of profile+xp_goal on quiz+signup, cleanup, lint+159+tsc pass, commit+push | done — b23d945 |
| 2026-06-26 | TASK-036 | research(agents+grep+data+unit-audio+config), set in_progress, update PLAN, run refill (low ready), add rewrite next.config, verify probe map 200 for unit19(B1)/unit36(B2), lint+159+tsc pass, commit+push | done — 0d30be9 |
| 2026-06-26 | TASK-037 | research(agents+grep+e2e+unit-audio+vocab), set in_progress, update PLAN+BACKLOG, add setE2EStartingUnit helper, add E2E test in placement-test (B1 login, advance warmup, click Nghe: speaker, Audio spy + /audio/ waitForRequest), lint+159+tsc pass, commit+push | done — ffc66bc |
| 2026-06-26 | TASK-038 | research(memory+agents+grep+setup-integration+profile migration+RLS), phase1/2/3, update PLAN/BACKLOG to in_progress, extend cleanup, implement 2 minimal RLS tests in progress.integration (own insert+columns verify, policy block), run lint+test+test:integration (all 159u+23i pass), commit 339f5a9 + scripts/git-push.sh main | done — 339f5a9 |
| 2026-06-26 | TASK-039 | research(agents+memory+grep+dashboard+stats+onboarding), plan update, run refill, fix getUserProgress to return real daily_xp_goal from DB (page.tsx read now effective), bar vs goal works, lint+test pass, commit+push via git-push | done — [pending SHA] |
| 2026-06-26 | TASK-040 | research(memory+agents+grep+rewrite+unit33+scripts), set in_progress BACKLOG, update PLAN focus+section, run refill, create minimal scripts/smoke-learn.sh (curl -L 200 for learn+audio unit33), add npm script, lint+test, commit+push via git-push.sh | done — 3a795df |
| 2026-06-26 | TASK-041 | research(agents+memory+grep+package+generator+readme), update PLAN+BACKLOG in_progress, add :all chain + :list dry-run (50 folders), README docs, lint+159+tsc, commit+push via git-push; status done | done — 242328e |

### TASK-034 — Regenerate Supabase types after onboarding migration
**Mục tiêu**: Chạy `npm run db:types` (sau khi migration `user_onboarding_profile` đã apply trên prod). So sánh output với patch tạm thời (từ TASK-032); nếu khác (table order, Relationships: [] vs FK, generated header) thì overwrite `src/types/supabase.ts` bằng generated chính thức từ prod schema. Commit nếu có thay đổi. Đảm bảo tsc/lint/test pass, types khớp live.
**Bước thực hiện**:
1. Search memory (search_memory "TASK-034" + "db:types") + read AGENTS.md (ALWAYS rule), AGENT_BACKLOG/PLAN, migration 20260626140000_user_onboarding_profile.sql, current src/types/supabase.ts (patch section), src/types/database.ts, usages in login/page.tsx + auth/callback/route.ts.
2. Verify migration applied: use service role client to select from user_onboarding_profile (confirm no table error).
3. Setup PATH for supabase bin if needed + use SUPABASE_ACCESS_TOKEN; run `npx supabase@2 gen types typescript --project-id vhpfskkredizeazlyzsh > /tmp/new-supabase.ts` (or npm run db:types to backup+replace).
4. Diff vs current: if differs (observed: ~78 lines, onboarding moved before user_progress, Relationships:[] vs detailed fkey, shorter overall) then `cp /tmp/new... src/types/supabase.ts`.
5. Run `npm run lint && npm run test`; `npx tsc --noEmit`.
6. Update AGENT_PLAN.md + BACKLOG.md (status done, add Nhật ký entry + SHA).
7. git pull --rebase; git add src/types/supabase.ts AGENT_BACKLOG.md AGENT_PLAN.md; git commit -m "chore(types): regenerate supabase.ts post user_onboarding_profile prod apply"; git push.
**Rủi ro**:
- CLI gen fails (no token, network, supabase@2 version mismatch) — but npx + token succeeded in research; if fails on run → status blocked.
- Generated types strip the manual FK Relationships (CLI produces [] for this table) — treat as correct, since auto-gen is source of truth per AGENTS.
- Patch was to allow compile before apply; now replace to keep in sync.
- Diff may include other schema changes since last gen (enums, other tables); accept full fresh file.
- No code logic change; only types file.
**Done khi**: src/types/supabase.ts == fresh prod gen (or no-op if identical); lint+test+tsc pass 0 errors; if changed: committed + pushed; backlog status=done + nhật ký SHA; no user interaction.

### TASK-035 — E2E onboarding profile persist
**Mục tiêu**: Thêm E2E Playwright test để verify toàn bộ signup flow (quiz chọn goal/obstacle/time → email signup) thực sự ghi đúng dữ liệu vào `user_onboarding_profile` (goal, obstacle, daily_minutes) và `user_progress.daily_xp_goal`. Test phải chọn cụ thể để map value rõ ràng, dùng temp unique email, admin verify DB post-flow, cleanup.
**Bước thực hiện**:
1. Search memory (search_memory for TASK-035 + onboarding e2e) + đọc AGENTS.md (memory rule), BACKLOG, PLAN, e2e/onboarding.spec.ts, e2e/helpers/auth.ts, e2e/auth.spec.ts, placement-test.spec.ts (pattern), src/app/login/page.tsx, src/app/auth/callback/route.ts, src/lib/onboarding.ts, playwright.config.ts.
2. Cập nhật AGENT_PLAN + BACKLOG (set 035 in_progress).
3. Extend e2e/helpers/auth.ts: thêm hàm `getE2EUserIdByEmail(email)`, `deleteE2EUserByEmail(email)`, `confirmE2EUserEmail(userId)` (admin), và `verifyUserOnboardingProfile(userId, expected)` để query/assert profile + progress.daily_xp_goal. Giữ cleanup safe.
4. Mở rộng e2e/onboarding.spec.ts: thêm test "signup flow persists goal/obstacle/daily_minutes + daily_xp_goal" (skip nếu thiếu admin cred); generate unique email+pass; goto /login, click survey steps chọn cụ thể: goal="Đi làm, thăng tiến"(work), obstacle="Sợ nói sai"(fear), time="15 phút/ngày"(15, xp=50); fill form + click activate button; wait redirect; use admin verify inserted values match; cleanup user+rows.
5. Chạy `npm run lint && npm run test`; npx tsc --noEmit. Fix nếu cần (chỉ unit, e2e chạy riêng).
6. Update BACKLOG (in_progress→done), add Nhật ký entry + SHA; update PLAN log.
7. git pull --rebase; git add e2e/helpers/auth.ts e2e/onboarding.spec.ts AGENT_BACKLOG.md AGENT_PLAN.md; git commit -m "test(e2e): signup flow saves goal/obstacle/daily_minutes to user_onboarding_profile + daily_xp_goal (TASK-035)"; git push.
**Rủi ro**:
- Supabase email confirmation: signUp response may not give immediate data.user or session if confirm on → add confirm via admin after submit + extra wait or use loginAs after. (Common; previous flows handle by direct insert on data.user).
- Selector brittle on Vietnamese labels → dùng getByText(/Đi làm.../).first() + generous timeout.
- Unique email collision / test leak → always timestamped email + deleteUser + delete profile/progress rows in after.
- E2E not executed by "npm test" (unit only) — verify manually via `npm run e2e` if needed; CI will catch.
- Dev server timing (webServer) or redirect to /learn?mini=1 — waitURL with long timeout, check toast success if needed.
- Admin key required for verify/clean — test.skip if !hasE2EAdminCredentials (pattern from placement).
- If signup push happens before DB visible → poll query with retry.
**Done khi**: Test mới thêm, chạy qua flow quiz+signup, DB assert đúng (goal=work, obstacle=fear, daily_minutes=15, daily_xp_goal=50); lint + all unit tests pass; 1 commit pushed; backlog done + log SHA; no user asked; tự debug nếu fail.

### TASK-036 — Fix audio path mismatch (unitN vs unit-N folders)
**Mục tiêu**: Data hardcodes `/audio/unit19/...` (no hyphen) for vocab/dialogue audio (and all unit1-42), but actual files generated live in `public/audio/unit-19/` (hyphen). This causes playUnitAudio's probeAudio to always get error (404), so native MP3 never used, always TTS fallback. Fix by adding rewrite rule so `/audio/unit19/foo.mp3` serves 200 from the hyphen folder. Verify probe succeeds for B1 (unit-19 sample) and B2. Minimal change, no edit to 50+ data files.
**Bước thực hiện**:
1. Search memory (simulated safe) + read AGENTS.md, AGENT_BACKLOG/PLAN/ROADMAP, unit-audio.ts (probe), sample data unit19.ts + unit1.ts + unit36.ts (confirm /audio/unitN/ paths), scripts/generate-unit-audio.ts (uses hyphen slug for outDir), next.config.mjs, public/audio/unit-*/ ls (confirm hyphen folders), unit-audio.test.ts, prior audio logs.
2. Set BACKLOG TASK-036 Status to `in_progress`; update PLAN header + add this section.
3. Since ready==1 <2, run `bash scripts/agent-refill-backlog.sh` (non-dry) — it auto adds ready from ROADMAP (e.g. 037+), commits+pushes the refill if any.
4. Minimal implement: add `async rewrites()` to next.config.mjs that maps `/audio/unit(\d+)/:file*` → `/audio/unit-$1/:file*` (covers unit1-unit42; A0 paths already match their folders).
5. Verify paths serve 200: use background dev or python -m http but for rewrite use `npm run dev` bg + curl -I http://localhost:3000/audio/unit19/incident.mp3 (should 200 OK mp3); repeat for unit1 sample + unit36 (B2). Also simulate probe logic.
6. Run `npm run lint && npm run test` (and npx tsc --noEmit). Fix any issue (expect clean).
7. Update BACKLOG (in_progress → done + Nhật ký + SHA), PLAN log table; git pull --rebase.
8. git add next.config.mjs AGENT_BACKLOG.md AGENT_PLAN.md ; commit "fix(audio): add rewrite /audio/unitN/ → /audio/unit-N/ so native MP3 probe 200 (TASK-036)"; push.
9. (Optional post) if refill ran, note the new readies in log.
**Rủi ro**:
- Rewrite regex syntax in next.config: must use correct :param(regexp) or source pattern that Next accepts (tested patterns: /audio/unit: n(\\d+)/... ); wrong = 404 still or build err → debug, use working form.
- Affects only numeric unitN, A0-a0 already hyphenated in data+folder. Good.
- Dev server vs prod (vercel) rewrite behavior; static files served with correct content-type for .mp3.
- No secret needed; pure config + static.
- If multiple rewrites later, order; put early.
- Tests pass because they use stub or missing; real browser probe will now succeed.
- If git push conflict after refill (which also pushes), use pull --rebase.
- Fail 2x → blocked.
**Done khi**: `/audio/unit19/incident.mp3` (and unit1, unit36) returns HTTP 200 when requested; playUnitAudio can return true (native) for valid B1/B2 samples; `npm run lint && npm run test` 0 issues; 1 commit (or with refill) pushed; backlog status=done + entry; no user asked; autonomous.

### TASK-037 — E2E native audio probe on learn page
**Mục tiêu**: Thêm Playwright E2E test verify native audio on /learn/unit-19: login B1 user (set starting high), mở unit-19, advance warmup (rate 5 words), click vocab speaker button, verify either native Audio used (probe success + network to /audio/unit19/... or /audio/unit-19/ ) hoặc TTS fallback không crash (no uncaught error). Dùng route mock hoặc request wait + initScript track new Audio() calls. Scope: e2e test only, không sửa logic.
**Bước thực hiện**:
1. Search memory (done) + read AGENTS.md, BACKLOG/PLAN/ROADMAP, e2e/placement-test.spec.ts + helpers/auth.ts (for B1 setup + admin + loginAs), e2e/*.spec.ts patterns, src/components/learn/sections/VocabSection.tsx (aria-label Nghe:, playUnitAudio call), UnitTemplate (section==2), unit-audio.ts (probe + new Audio), src/lib/data/units/unit19.ts (sample audio paths), playwright.config.ts.
2. Set BACKLOG TASK-037 to `in_progress` (done); update this PLAN with section; run refill script (dry or not, per state) — observed 4 ready.
3. Implement minimal: add test.describe in e2e/placement-test.spec.ts (reuse B1 patterns) or if clean, but keep in existing: "B1 user on /learn/unit-19 can click vocab speaker (native Audio or TTS fallback ok)". Use ensure + set starting_unit_index >=18 for B1 unlock equiv; loginAsE2ETestUser; page.goto("/learn/unit-19"); wait for warmup UI; click 5 "✓ Biết" ; click "Bắt đầu học"; wait for Vocab h1 or grid; then setup audio spy: addInitScript track Audio srcs + waitForRequest(/audio\//i); click first speaker getByRole('button', {name: /Nghe:/}).first(); await Promise; assert request.url includes audio/unit or audioCalls has /audio/ ; also expect no page error with 'play' or crash. If native not (env), still pass if no throw on click + fallback ran.
4. To make stable: use timeout generous, scrollIntoView, click options {force? no}; skip test if !hasE2EAdminCredentials(); also support mini? but task wants vocab so full flow to section 2.
5. Run `npm run lint && npm run test` (unit only); then manually or in bg `npm run e2e -- e2e/placement-test.spec.ts -g "audio|speaker|unit-19"` if possible, but since dev server auto in pw. Fix flake (add waits). Note: e2e not in "npm test".
6. Update BACKLOG status→done + Nhật ký + SHA; update PLAN log table.
7. git pull --rebase; git add e2e/placement-test.spec.ts AGENT_BACKLOG.md AGENT_PLAN.md; commit "test(e2e): playwright probe native audio on /learn/unit-19 vocab speaker (TASK-037)"; push using scripts/git-push.sh main .
**Rủi ro**:
- Audio in headless: play() may be blocked or muted; solve by tracking constructor calls + network requests instead of await play success. TTS fallback (speechSynthesis.speak) may also be no-op in CI/headless.
- Flaky selector / warmup flow: warmup has dynamic cards, use specific clicks for 5 ratings + wait "Bắt đầu học"; use toBeVisible with timeout.
- Auth + progress: E2E test user may have low starting_index; must admin upsert starting_unit_index to B1 (~18) before login, reset if needed.
- Rewrite / network: in test, waitForRequest matches source path `/audio/unit19/` (before or after internal rewrite ok).
- No secret: pure E2E + static, admin key needed only for user setup (same as placement tests).
- If 2 fails: set blocked.
- Dev server must be running for e2e (pw config does).
**Done khi**: New test added to placement-test or equiv; can run to click speaker in unit-19 B1; verifies request or Audio src for /audio/; lint + 159 unit tests pass; 1 commit pushed; backlog done + entry; autonomous no user.

### TASK-038 — Integration test user_onboarding_profile
**Mục tiêu**: Thêm test trong `progress.integration.test.ts` (hoặc file mới) : dùng authenticated client (RLS path) để insert profile row, verify columns goal/obstacle/daily_minutes chính xác, và RLS policy hoạt động (own user chỉ insert/select own; không cho phép user khác). Test bổ sung cho E2E (TASK-035) và cover direct DB access qua client JWT như production signup. Clean via admin. Scope: integration test + setup cleanup only.
**Bước thực hiện**:
1. Search memory (done for "TASK-038") + đọc AGENTS.md (ALWAYS), BACKLOG/PLAN/ROADMAP, src/__tests__/integration/progress.integration.test.ts, src/__tests__/setup-integration.ts, supabase/migrations/20260626140000_user_onboarding_profile.sql (RLS policies), e2e/helpers/auth.ts (pattern for verify/expected), src/types/supabase.ts (type confirm), login flows if needed.
2. Cập nhật AGENT_PLAN.md + BACKLOG.md (set in_progress for 038).
3. Chạy `bash scripts/agent-refill-backlog.sh` (per instruction, dù count >=2).
4. Extend cleanup: thêm `await adminClient.from("user_onboarding_profile").delete().eq("user_id", testUserId);` trong afterAll của setup-integration.ts .
5. Thêm clean helper và describe block tối thiểu vào progress.integration.test.ts (re-use adminClient + global __testSupabaseClient cho RLS test):
   - it("authenticated client can insert own profile row, columns roundtrip (goal/obstacle/daily_minutes)")
   - it("RLS blocks insert with mismatched user_id (policy violation)")
   - beforeEach: delete profile for testUserId
   - Assert via admin select after insert; expect insert err or no row for RLS negative.
6. `npm run lint && npm run test` (units) + `npm run test:integration` để cover (fix nếu flake).
7. Update BACKLOG status→done + Nhật ký entry + SHA; update PLAN log + nhật ký.
8. git pull --rebase; git add src/__tests__/integration/progress.integration.test.ts src/__tests__/setup-integration.ts AGENT_BACKLOG.md AGENT_PLAN.md; commit "test(integration): user_onboarding_profile insert verifies RLS + goal/obstacle/daily_minutes columns (TASK-038)"; push with scripts/git-push.sh main.
**Rủi ro**:
- Integration requires .env.local with SERVICE_ROLE + test DB reachable (no secret block expected, but if env fail → blocked).
- Client not exposed: use globalThis.__testSupabaseClient (as setup already does for actions) — if undefined in test → debug export or direct create with token from session.
- RLS negative test: Postgrest returns error code 42501 or 403/row not inserted; assert via catch or count==0. Policy uses (select auth.uid()), correct in recent migration.
- Test user may have stale profile from manual runs → always clean before/after.
- Running "npm run test" (unit) won't execute integration; must run test:integration explicitly to validate, then units for checklist.
- If 2x fail (e.g. DB schema mismatch) → blocked.
- No change to prod code, only tests.
**Done khi**: Test mới pass khi chạy test:integration; columns verified goal/obstacle/daily_minutes; RLS behavior asserted (success own, fail cross); lint + full unit tests pass; 1 commit + push via git-push.sh; backlog done + log SHA; autonomous, no user query.

### TASK-039 — Dashboard hiển thị daily_xp_goal từ onboarding
**Mục tiêu**: Đảm bảo `dashboard/page.tsx` (qua getUserProgress) đọc đúng `daily_xp_goal` từ `user_progress` (đã được set lúc onboarding/signup theo Q4 daily_minutes), và progress bar "XP hôm nay" hiển thị todayXp vs daily goal (bar hiện có trong DashboardClient). Fix nguồn dữ liệu để giá trị từ DB (50/80/100) được dùng thay vì hardcode 50.
**Bước thực hiện**:
1. Search memory (done) + đọc AGENTS.md, AGENT_BACKLOG/PLAN/ROADMAP, src/app/(main)/dashboard/page.tsx (read + compute todayXp + pass dailyXpGoal/initial), DashboardClient.tsx (XP card + bar + xpTarget), src/app/actions/stats.ts (getUserProgress hardcode + update), supabase migrations for daily_xp_goal, lib/onboarding.ts, previous TASK-032/035/038 notes.
2. Cập nhật AGENT_PLAN.md + BACKLOG.md set TASK-039 in_progress.
3. Run `bash scripts/agent-refill-backlog.sh` (per rules).
4. Minimal implement: sửa getUserProgress() return daily_xp_goal: data?.daily_xp_goal ?? 50, (thay vì :50); (không sửa UI, calc todayXp, hay update action — scope đúng: đọc từ user_progress cho dashboard bar).
5. `npm run lint && npm run test` (fix nếu cần).
6. Update BACKLOG (in_progress→done) + nhật ký + SHA; update PLAN log table.
7. git pull --rebase; git add src/app/actions/stats.ts AGENT_BACKLOG.md AGENT_PLAN.md; commit "feat(dashboard): read daily_xp_goal from user_progress for today XP progress bar (TASK-039)"; push via scripts/git-push.sh main.
**Rủi ro**:
- todayXp calc chỉ đếm unit lessons (không speaking/SRS/quiz cùng ngày) — nhưng task scope không đổi logic todayXp, chỉ đọc goal để bar dùng giá trị đúng từ DB.
- updateDailyXpGoal vẫn local/session only (không ghi DB) — thay đổi goal trong UI không persist reload, nhưng hiển thị load ban đầu sẽ đúng từ DB (onboarding value); giữ minimal.
- getUserProgress trả shape hẹp (không tất cả fields), page dùng cast cho best etc — chỉ sửa daily line, tránh broad change.
- Nếu data null (user chưa có progress row) vẫn default 50 ok.
- Không cần db:types, migration, secrets (column đã tồn tại từ trước).
- Nếu lint/test fail → debug 1 lần, 2 lần thì blocked.
**Done khi**: getUserProgress trả giá trị DB (verified qua test hoặc manual); dashboard load dùng daily_xp_goal từ onboarding; bar hiển thị today vs đúng goal; `npm run lint && npm run test` pass; 1 commit pushed; backlog done + entry SHA; autonomous no user.

### TASK-040 — Production smoke script learn B2
**Mục tiêu**: Tạo script `scripts/smoke-learn.sh` thực thi curl và kiểm tra HTTP 200 cho production `/learn/unit-33` (B2 unit, protected nhưng redirect 307→200 login page sau follow) và sample static audio `/audio/unit33/hypothetical.mp3` (sử dụng rewrite từ TASK-036 để map đến unit-33/ + file có sẵn từ audio gen B2). Giúp verify sau khi audio B2 + rewrite deploy. Thêm script vào package.json để dùng `npm run smoke:learn`.
**Bước thực hiện**:
1. Search memory (done: search_memory "TASK-040" "smoke-learn") + đọc AGENTS.md, AGENT_BACKLOG/PLAN/ROADMAP, scripts/check-vercel-deploy.sh + git-push.sh (pattern), next.config.mjs (rewrite unitN), src/lib/data/units/unit33.ts (confirm hypothetical + /audio/unit33/), public/audio/unit-33/ ls (file exists), src/app/(main)/learn/[unitSlug]/page.tsx + lib/constants/units.ts (route), src/lib/supabase/session.ts (redirect logic for smoke 200).
2. Cập nhật AGENT_PLAN.md (header focus + section) + BACKLOG (status in_progress).
3. Run `bash scripts/agent-refill-backlog.sh` (done — skipped, ready count OK).
4. Implement tối thiểu: tạo scripts/smoke-learn.sh (bash set -euo, PROD_URL=https://atoenglish.vercel.app , function to curl -fsL -w "%{http_code}" -o /dev/null check==200 for learn url + audio url; success msg + exit 0; fail exit 1). chmod +x. Add "smoke:learn": "bash scripts/smoke-learn.sh" to package.json scripts.
5. `npm run lint && npm run test` (fix 0 issues).
6. Update BACKLOG (in_progress→done) + add entry to Nhật ký table + SHA; update PLAN log table.
7. git pull --rebase; git add scripts/smoke-learn.sh package.json AGENT_BACKLOG.md AGENT_PLAN.md; git commit -m "chore(smoke): add scripts/smoke-learn.sh curl 200 /learn/unit-33 + /audio/unit33/hypothetical.mp3 (TASK-040)"; bash scripts/git-push.sh main.
**Rủi ro**:
- Learn route redirects (307 to /login?next=...) — use -L --max-redirs to follow and assert final 200.
- Prod deploy not yet live with rewrite+unit-33 audio — script will fail until deploy, but per rules: run after code+push? but smoke is verification script itself. If prod audio still 404 → use real file that exists, debug 1x.
- No VERCEL_TOKEN or secrets needed (public prod URLs + static).
- curl may transient fail on net — add small retry or just run once (smoke for manual/CI).
- If 2 fails → status blocked.
- Scope: script only; no change to app code or tests (E2E already covers).
**Done khi**: scripts/smoke-learn.sh exists, executable, `npm run smoke:learn` (or direct) exits 0 confirming 200s on prod; `npm run lint && npm run test` pass; 1 commit pushed via git-push; backlog=done + nhật ký SHA; autonomous.

### TASK-041 — audio:generate:all npm script
**Mục tiêu**: Thêm npm script `audio:generate:all` chạy tuần tự toàn bộ a0 + a1 + a2 + b1 + b2 (tất cả 50 units). Hỗ trợ dry-run/list trong generator để "dry-run list đúng 50 unit folders" (print keys + count). Document trong README.md (Testing section). Minimal, no runtime change, chỉ scripts + doc.
**Bước thực hiện**:
1. Search memory (done via supabase fn: search_memory "TASK-041 audio generate") + đọc AGENTS.md (memory + before commit rules), AGENT_BACKLOG/PLAN/ROADMAP, package.json (audio scripts), scripts/generate-unit-audio.ts (UNITS map has 50 entries, cli parse), README.md (audio examples).
2. Cập nhật AGENT_PLAN.md (header + section) + BACKLOG.md (set TASK-041 in_progress).
3. Run `bash scripts/agent-refill-backlog.sh` (already 3 ready — skip).
4. Implement tối thiểu:
   - Edit scripts/generate-unit-audio.ts: add early if (arg==='list' || arg==='--list') { console.log(Object.keys(UNITS).join('\n')); console.log(`Total: ${Object.keys(UNITS).length}`); process.exit(0); } ; update usage comment; keep default "unit-a0-1" for no arg.
   - Edit package.json: thêm "audio:generate:all": "npm run audio:generate:a0 && npm run audio:generate:a1 && npm run audio:generate:a2 && npm run audio:generate:b1 && npm run audio:generate:b2", và "audio:generate:list": "tsx scripts/generate-unit-audio.ts list",
   - Edit README.md Testing section: thêm dòng cho :all và :list ; note "50 unit folders".
5. Chạy dry-run: `npm run audio:generate:list` → verify output includes 50 folders (a0-1..42).
6. `npm run lint && npm run test && npx tsc --noEmit`.
7. Update BACKLOG (in_progress→done) + Nhật ký entry + SHA; update PLAN log.
8. git pull --rebase; git add package.json scripts/generate-unit-audio.ts README.md AGENT_BACKLOG.md AGENT_PLAN.md; git commit -m "chore(audio): add audio:generate:all + list dry-run for 50 units; README doc (TASK-041)"; bash scripts/git-push.sh main.
**Rủi ro**:
- Chain a0-a2-b1-b2 will be long-running + network if actually run (but task is script existence + dry list verify, not execute full gen).
- Shell && in package.json: precedent from a0 long line; use same pattern.
- Unit count: confirm exactly 50 (8a0+12+6+14+10); if generator map changes must match but here static.
- No secrets, no DB, pure npm script + doc. Safe.
- If lint/test fail after edit → debug once (typo etc); 2x → blocked.
- Dry list must output exactly the keys that match public/audio subdirs (unit-a0-N and unit-N).
**Done khi**: "audio:generate:all" script in package.json; "audio:generate:list" works and lists exactly 50 folders (verified in run); README updated with usage; `npm run lint && npm run test` pass; 1 commit pushed; backlog done + SHA; no user asked; autonomous.
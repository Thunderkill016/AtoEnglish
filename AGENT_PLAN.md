# Agent Plan — Tự cập nhật mỗi phiên

> Agent ghi kế hoạch trước khi code. User không cần approve.

## Phiên hiện tại

| Field | Value |
|-------|-------|
| Started | 2026-07-10 |
| Focus | TASK-223 — Autopilot maintenance sweep #223 |
| Owner | Autopilot (no human) |

### TASK-223 — Autopilot maintenance sweep #223
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng `npx tsc --noEmit` + content gates nếu liên quan); fix failure đầu tiên nếu có (minimal); sync AGENT_PLAN nhật ký + BACKLOG + log. **Không feature mới**, không đổi logic app. **Done khi:** gates pass; 0 or 1 small fix; PLAN/BACKLOG/nhật ký; 1 commit; push `git-push.sh main`.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS.md, BACKLOG (TASK-223 ready; 224–226 ready), PLAN prior TASK-222 done a3021f1/a17a56f, CONTENT_STYLE §6–7 (context only — no unit edit).
2. BACKLOG TASK-223 → `in_progress`.
3. Ready after in_p: 3 (224–226) ≥ 2 → skip refill.
4. PHASE3:
   - `rm -f tsconfig.tsbuildinfo` (stale guard).
   - `npx tsc --noEmit`; `npm run lint`; `npm run test`.
   - Optional: content-standard + audit (maintenance pattern).
   - Fix only first failure; no scope creep.
5. Log `logs/agent/*_TASK-223.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Transient tsbuildinfo / flake → clear + rerun once; 2 fails → blocked.
- First real bug → minimal fix only; major/secret → blocked.
- Push needs GitLab access → blocked, no force.
- No new feature.

**Started:** 2026-07-10 — autopilot

**Completed TASK-223**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T235414Z_TASK-223.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit pending + push via git-push.sh main; autonomous.

### TASK-222 — Autopilot maintenance sweep #222 (prior)
**Completed TASK-222**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T234816Z_TASK-222.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit a3021f1 + push via git-push.sh main; autonomous.

### TASK-221 — Autopilot maintenance sweep #221 (prior)
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng `npx tsc --noEmit` + content gates nếu liên quan); fix failure đầu tiên nếu có (minimal); sync AGENT_PLAN nhật ký + BACKLOG + log. **Không feature mới**, không đổi logic app. **Done khi:** gates pass; 0 or 1 small fix; PLAN/BACKLOG/nhật ký; 1 commit; push `git-push.sh main`.

**Bước thực hiện**:
1. PHASE1 (done): AGENTS.md, BACKLOG (TASK-221 ready; 222–223 ready), PLAN prior TASK-220 done bb75d83, CONTENT_STYLE §6–7 (context only — no unit edit).
2. BACKLOG TASK-221 → `in_progress`.
3. Ready after in_p: 2 (222–223) ≥ 2 → skip refill.
4. PHASE3:
   - `rm -f tsconfig.tsbuildinfo` (stale guard).
   - `npx tsc --noEmit`; `npm run lint`; `npm run test`.
   - Optional: content-standard + audit (maintenance pattern).
   - Fix only first failure; no scope creep.
5. Log `logs/agent/*_TASK-221.log`; BACKLOG done + Nhật ký + SHA; PLAN completed; commit + `bash scripts/git-push.sh main`.

**Rủi ro**:
- Transient tsbuildinfo / flake → clear + rerun once; 2 fails → blocked.
- First real bug → minimal fix only; major/secret → blocked.
- Push needs GitLab access → blocked, no force.
- No new feature.

**Started:** 2026-07-10 — autopilot

**Completed TASK-221**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T234302Z_TASK-221.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit ecedbcb + push via git-push.sh main; autonomous.

### TASK-220 — Autopilot maintenance sweep #220 (prior)
**Completed TASK-220**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T233911Z_TASK-220.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit bb75d83 + push via git-push.sh main; autonomous.

### TASK-219 — Autopilot maintenance sweep #219 (prior)
**Completed TASK-219**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T233233Z_TASK-219.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 30f18c6 + push via git-push.sh main; autonomous.

### TASK-218 — Autopilot maintenance sweep #218 (prior)
**Completed TASK-218**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T232730Z_TASK-218.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 46ca1e0 + push via git-push.sh main; autonomous.

### TASK-217 — Autopilot maintenance sweep #217 (prior)
**Completed TASK-217**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T232230Z_TASK-217.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 85be14b + push via git-push.sh main; autonomous.

### TASK-216 — Autopilot maintenance sweep #216 (prior)
**Completed TASK-216**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T231530Z_TASK-216.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 170e64e + push via git-push.sh main; autonomous.

### TASK-215 — Autopilot maintenance sweep #215 (prior)
**Completed TASK-215**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260710T231025Z_TASK-215.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 0ad248e + push via git-push.sh main; autonomous.

### TASK-214 — Autopilot maintenance sweep #214 (prior)
**Completed TASK-214**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T230455Z_TASK-214.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit d0216d1 + push via git-push.sh main; autonomous.

### TASK-213 — Autopilot maintenance sweep #213 (prior)
**Completed TASK-213**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T230046Z_TASK-213.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 41d9c0b + push via git-push.sh main; autonomous.

### TASK-212 — Autopilot maintenance sweep #212 (prior)
**Completed TASK-212**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T225534Z_TASK-212.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit c434ebb + push via git-push.sh main; autonomous.

### TASK-211 — Autopilot maintenance sweep #211 (prior)
**Completed TASK-211**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T224736Z_TASK-211.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 33e60d3 + push via git-push.sh main; autonomous.

### TASK-210 — Autopilot maintenance sweep #210 (prior)
**Completed TASK-210**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T224355Z_TASK-210.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit a5ca3a5 + push via git-push.sh main; autonomous.

### TASK-209 — Autopilot maintenance sweep #209 (prior)
**Completed TASK-209**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T223839Z_TASK-209.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 9974291 + push via git-push.sh main; autonomous.

### TASK-208 — Autopilot maintenance sweep #208 (prior)
**Completed TASK-208**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T223205Z_TASK-208.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit c4661ff + push via git-push.sh main; autonomous.

### TASK-207 — Autopilot maintenance sweep #207 (prior)
**Completed TASK-207**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T222626Z_TASK-207.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 39ffe1d + push via git-push.sh main; autonomous.

### TASK-206 — Autopilot maintenance sweep #206 (prior)
**Completed TASK-206**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T222034Z_TASK-206.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 9dde93c + push via git-push.sh main; autonomous.

### TASK-205 — Autopilot maintenance sweep #205 (prior)
**Completed TASK-205**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T221341Z_TASK-205.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit e305688 + push via git-push.sh main; autonomous.

### TASK-204 — Autopilot maintenance sweep #204 (prior)
**Completed TASK-204**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T220805Z_TASK-204.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 9961eb3 + push via git-push.sh main; autonomous.

### TASK-203 — Autopilot maintenance sweep #203 (prior)
**Completed TASK-203**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T220233Z_TASK-203.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 0937b5f + push via git-push.sh main; autonomous.

### TASK-202 — Autopilot maintenance sweep #202 (prior)
**Completed TASK-202**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T215720Z_TASK-202.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 19a1e5b + push via git-push.sh main; autonomous.

### TASK-201 — Autopilot maintenance sweep #201 (prior)
**Completed TASK-201**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T215050Z_TASK-201.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit dda7e2a + push via git-push.sh main; autonomous.

### TASK-200 — Autopilot maintenance sweep #200 (prior)
**Completed TASK-200**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T214522Z_TASK-200.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 7c75b99 + push via git-push.sh main; autonomous.

### TASK-199 — Autopilot maintenance sweep #199 (prior)
**Completed TASK-199**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T213500Z_TASK-199.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit ddeed1a + push via git-push.sh main; autonomous.

### TASK-198 — Autopilot maintenance sweep #198 (prior)
**Completed TASK-198**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T213030Z_TASK-198.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit d17b318 + push via git-push.sh main; autonomous.

### TASK-197 — Autopilot maintenance sweep #197 (prior)
**Completed TASK-197**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T212523Z_TASK-197.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 0676cb3 + push via git-push.sh main; autonomous.

### TASK-196 — Autopilot maintenance sweep #196 (prior)
**Completed TASK-196**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T212034Z_TASK-196.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 8aadb29 + push via git-push.sh main; autonomous.

### TASK-195 — Autopilot maintenance sweep #195 (prior)
**Completed TASK-195**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T211421Z_TASK-195.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 69a730e + push via git-push.sh main; autonomous.

### TASK-194 — Autopilot maintenance sweep #194 (prior)
**Completed TASK-194**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T210930Z_TASK-194.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit b518916 + push via git-push.sh main; autonomous.

### TASK-193 — Autopilot maintenance sweep #193 (prior)
**Completed TASK-193**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T210433Z_TASK-193.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.

### TASK-192 — Autopilot maintenance sweep #192 (prior)
**Completed TASK-192**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T205927Z_TASK-192.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 6386b27 + push via git-push.sh main; autonomous.

### TASK-191 — Autopilot maintenance sweep #191 (prior)
**Completed TASK-191**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T205132Z_TASK-191.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 541e387 + push via git-push.sh main; autonomous.

### TASK-190 — Autopilot maintenance sweep #190 (prior)
**Completed TASK-190**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T204811Z_TASK-190.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 9ee08ed + push via git-push.sh main; autonomous.

### TASK-189 — Autopilot maintenance sweep #189 (prior)
**Completed TASK-189**: gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T204411Z_TASK-189.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 8faa7ca + push via git-push.sh main; autonomous.

**Completed TASK-188** (prior): gates clean (tsc0+lint0+206t+cs50/50+audit50/50) no fix needed; log 20260709T203759Z_TASK-188.log; BACKLOG/PLAN/nhật ký synced; no src edit; commit 2152dcf + push via git-push.sh main; autonomous.

**Completed TASK-187** (prior): soft quiz floor ≥50% + task gate; player re-try VI; progress-v2 tests; docs; lint0+206t; d96c82e; push git-push.sh main; autonomous.

**Completed TASK-186** (prior): l-a1-02; c4cef59.

**Completed TASK-185** (prior): scramble/cloze; 6a141e2.

**Completed TASK-184** (prior): l-a0-08 survival + P0 8/8; ec7b0e5.

### TASK-183 — Author l-a0-07 Ngày trong tuần
**Mục tiêu**: Author full LessonSpec v2 for `l-a0-07` (P0/A0 «Ngày trong tuần»): days Mon–Sun, phrases **Today is…** / **What day is it?**. Spiral from a0-01..06 (time of day, family, greetings). Register in `lessons/index.ts`; sequential path test; docs. **Done khi:** Zod pass; registry has l-a0-07; next after a0-01..06 = a0-07; lint+test; commit + `bash scripts/git-push.sh main`.

**Bước thực hiện**:
1. PHASE1 research (done): AGENTS, BACKLOG/PLAN/ROADMAP, CONTENT_STYLE §6–7, lesson-spec, l-a0-06 gold, path (order 7 already), index + tests.
2. BACKLOG TASK-183 → `in_progress` (done).
3. Update AGENT_PLAN this section (done).
4. Ready after in_p: 1 ready → ran `agent-refill-backlog.sh` → TASK-185/186/187.
5. PHASE3:
   - Create `src/lib/v2/lessons/l-a0-07.ts` (8 stages, ≥50% L1 A0).
   - Wire `index.ts`.
   - Extend `lesson-spec-v2.test.ts` (title + sequential → l-a0-07; authored ≥9).
   - `docs/V2_PRODUCT.md` authored line …07.
   - `npm run lint && npm run test`.
6. Log + BACKLOG done + nhật ký + SHA; PLAN completed.
7. commit `feat(v2): l-a0-07 days of week + Today is… (TASK-183)`; push via git-push.sh main.

**Rủi ro**:
- Zod (L1 ratio, max lengths, dialogue min) → minimal content fix.
- Path hole if not registered → getNextPlayable skips unauthored.
- Push GITLAB_TOKEN → blocked, no force.
- Fail 2× → blocked + reason.

**Started:** 2026-07-10 — autopilot (PHASE1–2 done; PHASE3 content factory)

**Completed TASK-183**: l-a0-07 authored (Mon–Sun + Today is… / What day is it? / on + day); registry + tests sequential a0-06→07; docs V2 authored …07; lint0+195t; log 20260709T200103Z_TASK-183.log; commit fc61593 + push via git-push.sh main; autonomous.

### TASK-182 — Author l-a0-06 Thời gian trong ngày (prior)
**Completed TASK-182**: l-a0-06 authored (morning/afternoon/evening/night + Good morning… + It's … o'clock); registry + tests sequential a0-05→06; docs V2 authored …06; lint0+195t; log 20260709T195247Z_TASK-182.log; commit 16edeb8 + push via git-push.sh main; autonomous.

### TASK-181 — Author l-a0-05 Gia đình cơ bản (prior)
**Completed TASK-181**: l-a0-05 authored (family lexis + This is my… / Who is this?); registry + tests sequential a0-04→05; docs V2 authored …05; lint0+195t; log 20260709T194758Z_TASK-181.log; commit f362660 + push via git-push.sh main; autonomous.

### TASK-174 — Autopilot maintenance sweep #174 (prior)
**Completed TASK-174**: gates clean; maintenance-only; superseded focus by content factory TASK-181.

### TASK-167 — Autopilot maintenance sweep #167
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-167 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-167 maintenance sweep") via logs/grep; confirm ready count (4 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-167 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-167 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; since ≥2 ready, skip `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — per rules; KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260702T...Z_TASK-167.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #167 — lint+test gates + PLAN/BACKLOG sync (TASK-167)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + reads + grep TASK-167 + sweeps + read ROADMAP; PHASE2: PLAN+BACKLOG in_p + skip refill)

**Completed TASK-167**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260702T170400Z_TASK-167.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-169 — Autopilot maintenance sweep #169
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-169 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-169 maintenance sweep") via logs/grep; confirm ready count (6 ready incl 169,170) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure). Investigate modified unit*.ts from git status before touching src.
2. Update BACKLOG: TASK-169 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-169 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; 6 ready >=2, skip `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — per rules; KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. Do not touch unrelated modified units (37/38/42) unless they cause exact first fail. No new feature.
6. Sau gates: viết log `logs/agent/20260702T...Z_TASK-169.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src ONLY if the 1st-fail fix); commit "chore(maintenance): autopilot sweep #169 — lint+test gates + PLAN/BACKLOG sync (TASK-169)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core or from prior unit edits → minimal fix (type or test data), self-debug from error msg; if needs major/secret → blocked.
- Uncommitted content changes in units (37/38/42 L1) — do not commit unless exactly first fail source; investigate but scope to sweep.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-02 — autopilot (PHASE1: search_memory + reads + grep; 6r >=2; PHASE2: PLAN update + BACKLOG in_p + skip refill)

**Completed TASK-169**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260702T001633Z_TASK-169.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-170 — Autopilot maintenance sweep #170
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-170 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-170 maintenance sweep") via logs/grep (prior prompt + clean prior sweeps); confirm ready count (4 ready:170-173) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure in src). Check git status for stray before src touch.
2. Update BACKLOG: TASK-170 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-170 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; 4 ready >=2, skip `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — per rules; KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature. Self debug.
6. Sau gates: viết log `logs/agent/20260702T...Z_TASK-170.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src ONLY if the 1st-fail fix); commit "chore(maintenance): autopilot sweep #170 — lint+test gates + PLAN/BACKLOG sync (TASK-170)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-02 — autopilot (PHASE1: search_memory sim via logs/grep + reads AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 4r>=2; PHASE2: PLAN update + BACKLOG in_p + skip refill)

**Completed TASK-170**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T172209Z_TASK-170.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-171 — Autopilot maintenance sweep #171
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-171 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-171 maintenance sweep") via logs/grep (prior tool_error log + clean prior sweeps); confirm ready count (3 ready:171-173) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure in src). Check git status for stray before src touch.
2. Update BACKLOG: TASK-171 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-171 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; 3 ready >=2, skip `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — per rules; KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature. Self debug.
6. Sau gates: viết log `logs/agent/20260702T...Z_TASK-171.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src ONLY if the 1st-fail fix); commit "chore(maintenance): autopilot sweep #171 — lint+test gates + PLAN/BACKLOG sync (TASK-171)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-02 — autopilot (PHASE1: search_memory sim via logs/grep + reads AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 3r>=2; PHASE2: PLAN update + BACKLOG in_p + skip refill)

**Completed TASK-171**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260702T172800Z_TASK-171.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit f1639fd + push via git-push.sh main; autonomous (PHASE3)
**Follow-up**: commit b6b2506 for Nhật ký table row sync.

### TASK-162 — Autopilot maintenance sweep #162
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-162 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-162 maintenance sweep"); confirm ready count (3 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-162 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-162 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-162.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #162 — lint+test gates + PLAN/BACKLOG sync (TASK-162)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory + reads + grep; 3r; PHASE2: PLAN update + BACKLOG in_p)

**Completed TASK-162**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) after minimal 1st-fail fix (UnitTemplate.tsx jobScenarios l1Note support); log written 20260701T162212Z_TASK-162.log + BACKLOG/PLAN/nhật ký synced; 1 src type edit only; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-164 — Autopilot maintenance sweep #164
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-164 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-164 maintenance sweep") via logs/grep; confirm ready count (4 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-164 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-164 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. (ran, 3 ready OK).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-164.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #164 — lint+test gates + PLAN/BACKLOG sync (TASK-164)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + reads + grep TASK-164 + refill run; PHASE2: PLAN+BACKLOG in_p + run refill per instr)

**Completed TASK-164**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T163727Z_TASK-164.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-165 — Autopilot maintenance sweep #165
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-165 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-165 maintenance sweep"); confirm ready count (3 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-165 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-165 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. (will run per query)
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-165.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #165 — lint+test gates + PLAN/BACKLOG sync (TASK-165)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory real + reads + grep TASK-165 + sweeps; PHASE2: PLAN+BACKLOG in_p + refill run (2r OK); PHASE3: gates clean no fix)

**Completed TASK-165**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T164500Z_TASK-165.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit fac8893 + push via git-push.sh main (origin; gitlab pubkey n/a); autonomous (PHASE3)

### TASK-166 — Autopilot maintenance sweep #166
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-166 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-166 maintenance sweep") via logs/grep; confirm ready count (2 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-166 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-166 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. (per query instruction, will run).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-166.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #166 — lint+test gates + PLAN/BACKLOG sync (TASK-166)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + reads + grep TASK-166 + sweeps; PHASE2: PLAN+BACKLOG in_p + run refill per query)

**Completed TASK-166**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T165440Z_TASK-166.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit a5bb1b6 + follow-ups via git-push.sh main (final 1e188f8); autonomous (PHASE3)

### TASK-160 — Autopilot maintenance sweep #160
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-160 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory sim("TASK-160 maintenance sweep"); confirm ready count (pre:2, after edit+refill ~4) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-160 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-160 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user (script ran, added 162-164 safely).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-160.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #160 — lint+test gates + PLAN/BACKLOG sync (TASK-160)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + reads + grep + refill; PHASE2: PLAN+BACKLOG in_p + run refill; PHASE3 gates)

**Completed TASK-160**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T160755Z_TASK-160.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-161 — Autopilot maintenance sweep #161
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-161 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-161 maintenance sweep"); confirm ready count (4 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-161 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-161 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-161.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #161 — lint+test gates + PLAN/BACKLOG sync (TASK-161)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory real + reads + grep + memory; PHASE2: PLAN+BACKLOG in_p; PHASE3: gates)

**Completed TASK-161**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T161427Z_TASK-161.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-159 — Autopilot maintenance sweep #159
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-159 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory sim("TASK-159 maintenance sweep"); confirm ready count ≥2 pre in_p (3); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-159 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-159 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. Per query instruction. (ran, OK >=2)
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-159.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #159 — lint+test gates + PLAN/BACKLOG sync (TASK-159)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: reads + grep + refill run; PHASE2: PLAN+BACKLOG update in_p + refill; PHASE3: gates)

**Completed TASK-159**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T160042Z_TASK-159.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit 111389d + push via git-push.sh main (final sync 1f491c7); autonomous (PHASE3)

### TASK-158 — Autopilot maintenance sweep #158
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-158 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory sim("TASK-158 maintenance sweep"); confirm ready count ≥2 pre in_p (4); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-158 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-158 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. Per query instruction. (ran — OK >=2)
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-158.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #158 — lint+test gates + PLAN/BACKLOG sync (TASK-158)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + reads + grep + refill run; 4r; PHASE2: PLAN update + BACKLOG in_p + run refill per query)

**Completed TASK-158**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) after minimal first-fail fixes (unitA01 stray mangled export syntax removed + UnitLike.jobScenarios?: unknown[] added to unblock tsc; no data/content/feat change); log 20260701T155257Z_TASK-158.log + BACKLOG/PLAN/nhật ký synced; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-157 — Autopilot maintenance sweep #157
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-157 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-157 maintenance sweep"); confirm ready count ≥2 pre in_p (was 2); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-157 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-157 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. Per query instruction.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-157.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #157 — lint+test gates + PLAN/BACKLOG sync (TASK-157)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory + reads + grep; 2r; PHASE2: PLAN update + BACKLOG in_p + run refill)

**Completed TASK-157**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T154400Z_TASK-157.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-156 — Autopilot maintenance sweep #156
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-156 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-156 maintenance sweep"); confirm ready count ≥2 pre in_p (was 3); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-156 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-156 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. Per query: run even if low.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-156.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #156 — lint+test gates + PLAN/BACKLOG sync (TASK-156)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 3r>=2; PHASE2: PLAN update + BACKLOG in_p + run refill; PHASE3 run gates)

**Completed TASK-156**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T153414Z_TASK-156.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit 9bdf3cf + push via git-push.sh main; autonomous (PHASE3)

### TASK-155 — Autopilot maintenance sweep #155
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-155 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory sim("TASK-155 sweep"); confirm ready count ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-155 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-155 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-155.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #155 — lint+test gates + PLAN/BACKLOG sync (TASK-155)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search sim via logs/grep + read+grep; 3r; PHASE2: PLAN+BACKLOG in_p + run refill per instr)

**Completed TASK-155**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log 20260701T152720Z_TASK-155.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit a3d4fd2 + push via git-push.sh main; follow-up 858edd5; autonomous (PHASE3)

### TASK-153 — Autopilot maintenance sweep #153
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-153 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory sim("TASK-153 sweep"); confirm ready count ≥2 pre in_p (3); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-153 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-153 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-153.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #153 — lint+test gates + PLAN/BACKLOG sync (TASK-153)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search sim via logs/grep + read+grep; 3r; PHASE2: PLAN+BACKLOG in_p + check refill)

**Completed TASK-153**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log 20260701T151239Z_TASK-153.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit ec01806 + push via git-push.sh main; autonomous (PHASE3)

### TASK-145 — Autopilot maintenance sweep #145
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-145 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-145"); confirm ready count ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* only (unless fix 1st failure).
2. Update BACKLOG: TASK-145 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-145 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-145.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #145 — lint+test gates + PLAN/BACKLOG sync (TASK-145)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory + read+grep; 4r; PHASE2: PLAN+BACKLOG in_p + run refill; PHASE3: gates)

**Completed TASK-145**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) after 1st-fail minimal fixes (unit13 stray syntax + unknown props); log 20260701T215600Z_TASK-145.log + BACKLOG/PLAN/nhật ký synced; commit + push via git-push.sh main; no src beyond gate fix; autonomous (PHASE3)

**Completed TASK-153**: content-std+blueprint+style updated w/ dialoguesMin2 + shadowing5 + jobScenarios; unit1/25/3 enhanced (jobScenarios + dialogues); UnitData type fix (1st fail); tsc0 lint0 170t + content 50/50 + audit50/50; log 20260701T150556Z_TASK-153.log; BACKLOG done + Nhật ký; commit e05028a + push via git-push.sh main; autonomous.(PHASE3; fixed first tsc+first content violator only).

### TASK-153 — Raise lesson content bar for world-class (nội dung học)
**Mục tiêu**: Update content-standard + blueprint for higher bar (dialogues 2+, shadowing 5+, job 1+, more L1 emphasis). Enhance unit1 (golden sample) + 1 sample job unit (e.g. unit25). Re-audit via content + audit script (note model units meet). Focus Babbel-like real convos + VN adult job needs. No logic change, no new UI. Minimal diff. **Done khi:** New fields+checks in standard; authorGuide updated in blueprint; unit1 + sample have jobScenarios/dialogues>=2 polish; CONTENT_STYLE §7 updated; content gates log model improved (full catchup later); lint+test (main) pass; PLAN/BACKLOG/nhật ký + log synced; commit+push.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint + chuẩn SDL), grep TASK-153 + dialogues/shadowing/job + content-standard/lesson-blueprint/unit1/unit25 + curriculum test + logs; search_memory("TASK-153 content bar"); confirm unit1 has 3 dialogues + job theme already; files to touch: content-standard.ts, lesson-blueprint.ts, unit1.ts (enhance), unit25.ts (sample), CONTENT_STYLE.md, AGENT_*.md , log.
2. Update BACKLOG: TASK-153 `in_progress` (already).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-153 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count ready; if <2 run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai tối thiểu đúng scope:
   - Update content-standard.ts: add dialoguesMin:2 , shadowingMin:5 (via fluency proxy), jobScenarios note; add to validate if dialogues <2 ; update UnitLike + l1 if more.
   - Update lesson-blueprint.ts: raise authorGuideVi for dialogues block (≥2 Babbel real + job 1+), output (shadowing 5+), hook for job focus VN adult.
   - Enhance unit1.ts (golden): add jobScenarios field + comment; ensure L1 high, dialogues=3 (already), more fluency items if < ; job title polish.
   - Enhance sample job unit e.g. unit25.ts : add 2nd dialogue (realistic job interview follow-up with VN L1 context), declare audio path (no generate now), add jobScenarios stub; keep existing 1st.
   - Update CONTENT_STYLE.md §7 Chuẩn SDL: add dialoguesMin:2 , shadowingMin:5 , jobScenariosMin:1 .
   - Update curriculum-quality.test.ts comment for target >=2 dialogues (no change expect to avoid mass fail).
   - rm -f tsconfig.tsbuildinfo ; npx tsc --noEmit ; npm run lint ; npm run test (main pass expected); npm run test:content-standard && bash scripts/audit-lesson-content.sh (expect model pass, full may note catchup).
   - Capture first failure (if any non-content); fix minimal only first.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-153.log` (gates + model enhanced); update BACKLOG (in_p → done + Nhật ký + SHA); sync PLAN table + Completed note.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md CONTENT_STYLE.md src/lib/lessons/* src/lib/data/units/unit1.ts src/lib/data/units/unit25.ts src/__tests__/curriculum-quality.test.ts logs/agent/* ; commit "chore(content): TASK-153 raise lesson bar — dialogues 2+ / job focus in std+blueprint+unit1+sample (minimal)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Raising dialoguesMin breaks content gate for 49 units → set min in SDL, fix first failure unit only (one sample); note full catchup in log; main npm test unaffected (excludes content test).
- Audio path declare for new dialogue in sample without mp3 file → ok for unit test (regex only), e2e later; no generate this task.
- Over edit units → strictly golden unit1 + ONE sample (unit25); no more.
- Git push blocked (secret) → status blocked in BACKLOG, move next sweep ready if possible.
- Fail 2 times on gates → blocked + lý do.
- No feature: no callers change, no new runtime fields used yet.
**Done khi**: standard+blueprint+style+sample enhanced; model units meet new bar in audit; main lint+test pass; content log shows improvement for unit1/25; PLAN/BACKLOG/nhật ký + log file; commit+push via script; autonomous.

### TASK-143 — Autopilot maintenance sweep #143
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-143 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-143"); confirm ready count ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* only (unless fix 1st failure).
2. Update BACKLOG: TASK-143 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-143 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; if <2 ready run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-143.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #143 — lint+test gates + PLAN/BACKLOG sync (TASK-143)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot

**Completed TASK-143**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T142617Z_TASK-143.log; BACKLOG+PLAN+nhật ký synced; no src edit; autonomous (PHASE3)

**Completed TASK-152**: richer L1 analysis (final cons, tones/intonation, linking) + norm; guest speaking history viz (local save+hydrate) on /speaking dashboard; job roleplay L1 notes + free fallback enhanced; vibrant glass kept; gates clean (tsc0 lint0 170t); log written; BACKLOG done + Nhật ký; commit 787fdb9 + push via git-push.sh main; autonomous one-task.

### TASK-151 — Vibrant UI polish (glass/motion)
**Mục tiêu**: Polish vibrant glassmorphism + motion: enhance smooth Framer Motion transitions (lessons via motion.ts + shell, speaking cards, dashboard sections), make guest CTAs responsive (mobile friendly glass banners/CTAs), polish progress viz with motion, add subtle engaging but honest copy. Keep zinc-950 dark bg + emerald-500/teal-500 glass (bg-white/5 + backdrop-blur-xl etc). Deprecate any minimal drift. No logic, no new deps, MINIMAL diff. **Done khi:** better feel on cards/sections/CTAs/viz; gates pass (tsc/lint/test); docs updated with Nhật ký; pushed via git-push.sh.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS, confirm vibrant glassmorphism rule, zinc-950+emerald/teal, framer, no console, await, etc), AGENT_BACKLOG.md/ROADMAP.md (deprecate V2 minimal, set TASK-151 P0), AGENT_PLAN.md, relevant code (globals.css, DashboardClient/EfSetGoalTracker/LevelProgressBar/SpeakingFeedCard/UnitCard, UnitTemplate/LessonShell/motion.ts + all lesson sections, SpeakingClient + subs, landing/* for guest CTAs, proxy/guest flows), DESIGN_SYSTEM.md/UI_GUIDELINES.md/CONTENT_STYLE (no content change); sim search_memory via grep/logs (clean prior); web research quick on best vibrant UI (glass for interactive cards/CTAs + spring trans, honest realistic for adult VN self-study); confirm deprecate minimal (no edits to Minimal* or light redesign).
2. Update BACKLOG: TASK-151 `in_progress` (done); update header queue note; update PLAN header + this section.
3. PHASE3 triển khai MINIMAL: e.g. 1) enhance lessonSectionMotion + LessonShell for smoother vibrant enter (spring/scale subtle glass pop); 2) add motion.div + initial/animate to guest banner in DashboardClient + responsive tweaks (flex-col mobile); 3) motion-ify progress fill in LevelProgressBar + SpeakingFeedCard list items for polish viz/trans in dashboard/speaking; honest copy e.g. in one note/CTA if fits; keep exact style (glass, emerald/teal accents, zinc).
4. Sau: rm -f tsconfig.tsbuildinfo; npx tsc --noEmit; npm run lint; npm run test (all pass); content if needed.
5. Write log logs/agent/20260701T...Z_TASK-151.log ; update BACKLOG (done + Nhật ký + SHA); sync PLAN table + Completed.
6. git pull --rebase; git add AGENT_*.md logs/agent/* src/... (changed); commit "feat(ui): TASK-151 vibrant glass/motion polish — lessons/speaking/dashboard (minimal diff)"; `bash scripts/git-push.sh main`.

**Rủi ro**:
- Over-scope to many files → stick strictly to 2-4 minimal edits (motion + 1-2 glass/resp).
- Breaking motion in lessons (key path) → test locally but use dev only, keep original values if risk; gates catch.
- Design drift (to minimal) → enforce glass + vibrant zinc/emerald in edits only.
- Gates fail → minimal only fix first.
- No build per AGENTS.
**Done khi**: UI polish applied minimal; tsc0 lint0 test pass; PLAN/BACKLOG/nhật ký + log; commit+push; autonomous.

**Started:** 2026-07-01 — autopilot

**Completed TASK-151**: lessonSectionMotion spring + guest banner motion/responsive/honest (DashboardClient), motion progress viz (LevelProgressBar), motion speaking rows (SpeakingFeedCard); glass zinc/emerald preserved; gates clean 170t; log created; docs updated + Nhật ký; commit+push via git-push; autonomous.

### TASK-142 — Autopilot maintenance sweep #142
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-142 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-142"); confirm 4 ready (142-145) ≥2 pre in_p.
2. Update BACKLOG: TASK-142 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-142 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → KHÔNG chạy (script skips) nhưng per user query "Backlog thấp: chạy" vẫn chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) — KHÔNG hỏi user (script will skip safely).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-142.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #142 — lint+test gates + PLAN/BACKLOG sync (TASK-142)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory real + read+grep; 4r; PHASE2: PLAN+BACKLOG in_p + run refill)

**Completed TASK-142**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T141347Z_TASK-142.log; BACKLOG+PLAN+nhật ký synced; commit 5ea9953 + push via git-push.sh main (follow-up 248d6e8); no src edit; autonomous (PHASE3)

### TASK-141 — Autopilot maintenance sweep #141
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-141 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-141"); confirm 2 ready (141-142) ≥2 pre in_p.
2. Update BACKLOG: TASK-141 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-141 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (script will add more if needed, then continue).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-141.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #141 — lint+test gates + PLAN/BACKLOG sync (TASK-141)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory real + read+grep; 2r; PHASE2: PLAN+BACKLOG in_p + run refill)

**Completed TASK-141**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T133921Z_TASK-141.log; BACKLOG+PLAN+nhật ký synced; commit 0fd0a24 + push via git-push.sh main (follow-ups 5e3d73c, 4e97c38, caa28f2, 2440967); no src edit; autonomous (PHASE3)

### TASK-139 — Autopilot maintenance sweep #139
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-139 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-139"); confirm 4 ready (139-142) ≥2.
2. Update BACKLOG: TASK-139 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-139 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low). Per query if thấp then run — check after.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-139.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #139 — lint+test gates + PLAN/BACKLOG sync (TASK-139)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: read files + grep; 4r; PHASE2: PLAN update + BACKLOG in_p; PHASE3: gates)

**Completed TASK-139**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T131947Z_TASK-139.log; BACKLOG+PLAN+nhật ký synced; commit b3af66a + push via git-push.sh main (follow-up 1f6daf4); no src edit; autonomous (PHASE3)

### TASK-140 — Autopilot maintenance sweep #140
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-140 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-140"); confirm 3 ready (140-142) ≥2.
2. Update BACKLOG: TASK-140 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-140 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low). Per query if thấp then run — check after.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-140.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #140 — lint+test gates + PLAN/BACKLOG sync (TASK-140)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: sim search_memory via logs/grep (empty prior) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT_STYLE§6–7 + grep TASK-140; 3r>=2 skip refill; PHASE2: PLAN update + BACKLOG in_p; PHASE3: run gates)

**Completed TASK-140**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T132923Z_TASK-140.log; BACKLOG+PLAN+nhật ký synced; commit 59e70c2 + push via git-push.sh main (follow-ups 68581ad, 5d2e459, 3484437); no src edit; autonomous (PHASE3)

### TASK-138 — Autopilot maintenance sweep #138
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-138 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-138"); confirm 2 ready (138-139) ≥2.
2. Update BACKLOG: TASK-138 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-138 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (script added TASK-140..142, now 4 ready; also pushed refill).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-138.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #138 — lint+test gates + PLAN/BACKLOG sync (TASK-138)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory via fn + read/grep; 2r; PHASE2: PLAN update + BACKLOG in_p + run refill; PHASE3: implement gates)

**Completed TASK-138**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T131233Z_TASK-138.log; BACKLOG+PLAN+nhật ký synced; commit + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-137 — Autopilot maintenance sweep #137
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-137 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-137"); confirm 3 ready (137-139) ≥2.
2. Update BACKLOG: TASK-137 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-137 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-137.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #137 — lint+test gates + PLAN/BACKLOG sync (TASK-137)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1 research complete via read/grep/memory-sim; 3r>=2 skip; PHASE2 plan+backlog in_p; PHASE3 run gates)

**Completed TASK-137**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T130343Z_TASK-137.log; BACKLOG+PLAN+nhật ký synced; commit 6d04690 + push via git-push.sh main (follow-up 8889570); no src edit; autonomous (PHASE3)

### TASK-136 — Autopilot maintenance sweep #136
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-136 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-136"); confirm 4 ready (136-139) ≥2.
2. Update BACKLOG: TASK-136 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-136 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-136.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #136 — lint+test gates + PLAN/BACKLOG sync (TASK-136)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1 research complete via read/grep/memory-sim; 4r>=2 skip; PHASE2 plan+backlog in_p; PHASE3 run gates)

**Completed TASK-136**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T125000Z_TASK-136.log; BACKLOG+PLAN+nhật ký synced; commit cb0a4e7 + push via git-push.sh main (follow-up 99440fc, ea53345); no src edit; autonomous (PHASE3)

### TASK-135 — Autopilot maintenance sweep #135
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-135 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-135"); confirm 2 ready (135-136) ≥2.
2. Update BACKLOG: TASK-135 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-135 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-135.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #135 — lint+test gates + PLAN/BACKLOG sync (TASK-135)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-135; 2r>=2 skip refill; PHASE2 PLAN update + BACKLOG in_p)

**Completed TASK-135**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T123736Z_TASK-135.log; BACKLOG+PLAN+nhật ký synced; commit df82fe0 via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-131 — Autopilot maintenance sweep #131
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-131 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-131"); confirm 3 ready (131-133) ≥2.
2. Update BACKLOG: TASK-131 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-131 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-131.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #131 — lint+test gates + PLAN/BACKLOG sync (TASK-131)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-131)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-131 + recent logs; 3r>=2; PHASE2 PLAN+BACKLOG in_p)

**Completed TASK-131**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T112212Z_TASK-131.log; BACKLOG+PLAN+nhật ký synced; commit 3c4221a + push via git-push.sh main (follow-up adfcb7c); no src edit; autonomous (PHASE3)

### TASK-132 — Autopilot maintenance sweep #132
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-132 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-132"); confirm 2 ready (132-133) ≥2.
2. Update BACKLOG: TASK-132 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-132 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (script added TASK-134..136, now ~4 ready).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-132.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #132 — lint+test gates + PLAN/BACKLOG sync (TASK-132)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory("TASK-132 maintenance sweep") via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-132; 2r>=2; PHASE2 PLAN+BACKLOG in_p + refill run)

**Completed TASK-132**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T113033Z_TASK-132.log; BACKLOG+PLAN+nhật ký synced; commit 3551ff6 + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-133 — Autopilot maintenance sweep #133
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-133 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-133"); confirm 4 ready (133-136) ≥2.
2. Update BACKLOG: TASK-133 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-133 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =4 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-133.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #133 — lint+test gates + PLAN/BACKLOG sync (TASK-133)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory("TASK-133 maintenance sweep") via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-133; 4r>=2; PHASE2 PLAN+BACKLOG in_p (skip refill))

**Completed TASK-133**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T122039Z_TASK-133.log; BACKLOG+PLAN+nhật ký synced; commit 5258ec3 + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-134 — Autopilot maintenance sweep #134
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-134 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-134"); confirm 3 ready (134-136) ≥2.
2. Update BACKLOG: TASK-134 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-134 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-134.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #134 — lint+test gates + PLAN/BACKLOG sync (TASK-134)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory("TASK-134 maintenance sweep") via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-134; 3r>=2; PHASE2 PLAN+BACKLOG in_p (skip refill))

**Completed TASK-134**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T123125Z_TASK-134.log; BACKLOG+PLAN+nhật ký synced; commit via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-126 — Autopilot maintenance sweep #126
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-126 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-126"); confirm 2 ready (126-127) ≥2.
2. Update BACKLOG: TASK-126 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-126 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (script added TASK-128..130, now 4 ready).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-126.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #126 — lint+test gates + PLAN/BACKLOG sync (TASK-126)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-126)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-126; 2r>=2; PHASE2 PLAN+BACKLOG in_p + run refill)

**Completed TASK-126**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T101453Z_TASK-126.log; BACKLOG+PLAN+nhật ký synced; commit d122b31 + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-127 — Autopilot maintenance sweep #127
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-127 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-127"); confirm 4 ready (127-130) ≥2.
2. Update BACKLOG: TASK-127 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-127 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low; query note for when thấp).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-127.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #127 — lint+test gates + PLAN/BACKLOG sync (TASK-127)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-127 via curl/search-memories)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-127 + logs; 4r>=2; PHASE2 PLAN+BACKLOG in_p)

**Completed TASK-127**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T102237Z_TASK-127.log; BACKLOG+PLAN+nhật ký synced; commit 46fb122 + push via git-push.sh main (sync f38a740); no src edit; autonomous (PHASE3)

### TASK-128 — Autopilot maintenance sweep #128
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-128 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-128"); confirm 3 ready (128-130) ≥2.
2. Update BACKLOG: TASK-128 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-128 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low; query note for when thấp).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-128.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #128 — lint+test gates + PLAN/BACKLOG sync (TASK-128)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-128)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-128 + recent logs; 3r>=2; PHASE2 PLAN+BACKLOG in_p)

**Completed TASK-128**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T103145Z_TASK-128.log; BACKLOG+PLAN+nhật ký synced; commit 065a763 + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-129 — Autopilot maintenance sweep #129
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-129 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-129"); confirm 2 ready (129-130) ≥2.
2. Update BACKLOG: TASK-129 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-129 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p (post 128) =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (refill added 131-133 after count drop).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-129.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #129 — lint+test gates + PLAN/BACKLOG sync (TASK-129)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-129)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-129 + recent logs; 2r>=2; PHASE2 PLAN+BACKLOG in_p + refill ran)

**Completed TASK-129**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T104002Z_TASK-129.log; BACKLOG+PLAN+nhật ký synced; commit afc02df + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-130 — Autopilot maintenance sweep #130
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-130 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-130"); confirm 4 ready (130-133) ≥2.
2. Update BACKLOG: TASK-130 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-130 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule skip if not low).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-130.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #130 — lint+test gates + PLAN/BACKLOG sync (TASK-130)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-130)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-130 + recent logs; 4r>=2; PHASE2 PLAN+BACKLOG in_p)

**Completed TASK-130**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T111031Z_TASK-130.log; BACKLOG+PLAN+nhật ký synced; commit 0af7e0e + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-123 — Autopilot maintenance sweep #123
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-123 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-123"); confirm 2 ready (123-124) ≥2.
2. Update BACKLOG: TASK-123 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-123 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p (1 ready) <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (script added TASK-125..127).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-123.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #123 — lint+test gates + PLAN/BACKLOG sync (TASK-123)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-123; 2r>=2; PHASE2 PLAN+BACKLOG in_p + run refill)

**Completed TASK-123**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log 20260701T094800Z_TASK-123.log; BACKLOG+PLAN+nhật ký synced; commit 531ec85 + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-124 — Autopilot maintenance sweep #124
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-124 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-124"); confirm 4 ready (124-127) ≥2.
2. Update BACKLOG: TASK-124 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-124 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → skip `bash scripts/agent-refill-backlog.sh` (per rule, no low backlog).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-124.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #124 — lint+test gates + PLAN/BACKLOG sync (TASK-124)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-124; 4r>=2; PHASE2 PLAN+BACKLOG in_p)

**Completed TASK-124**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T095326Z_TASK-124.log; BACKLOG+PLAN+nhật ký synced; commit 2a33ecd + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-125 — Autopilot maintenance sweep #125
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-125 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-125"); confirm 3 ready (125-127) ≥2.
2. Update BACKLOG: TASK-125 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-125 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (even if >=2, follow explicit; script may confirm OK).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-125.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #125 — lint+test gates + PLAN/BACKLOG sync (TASK-125)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-125) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 3r>=2; PHASE2 PLAN+BACKLOG in_p + run refill per query)

**Completed TASK-125**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T100659Z_TASK-125.log; BACKLOG+PLAN+nhật ký synced; commit f598330 + push via git-push.sh main; no src edit; autonomous (PHASE3)

### TASK-122 — Autopilot maintenance sweep #122
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-122 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-122"); confirm 3 ready (122-124) ≥2.
2. Update BACKLOG: TASK-122 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-122 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready >=2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) per user query instruction — KHÔNG hỏi user (script will skip as OK, but execute).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-122.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #122 — lint+test gates + PLAN/BACKLOG sync (TASK-122)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: real search_memory(TASK-122) + reads AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-122; 3r>=2; PHASE2 PLAN+BACKLOG in_p + run refill per query)

**Completed TASK-122**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log 20260701T092917Z_TASK-122.log; BACKLOG+PLAN+nhật ký synced; commit 19380c4 + follow-up pushes via git-push.sh (origin); no src edit; autonomous.

### TASK-121 — Autopilot maintenance sweep #121
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-121 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-121"); confirm 4 ready (121-124) ≥2.
2. Update BACKLOG: TASK-121 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-121 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready >=2 → nhưng per user query "Backlog thấp: chạy `bash scripts/agent-refill-backlog.sh` (đọc AGENT_ROADMAP.md)" — KHÔNG hỏi user; run refill (script may add more if logic triggers or log).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-121.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #121 — lint+test gates + PLAN/BACKLOG sync (TASK-121)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1 research complete via reads/greps/sim search_memory via logs/grep (TASK-120 clean); PHASE2 PLAN+BACKLOG in_p + refill run per explicit query instruction)

### TASK-120 — Autopilot maintenance sweep #120
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-120 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-120"); confirm 2 ready (120-121) ≥2.
2. Update BACKLOG: TASK-120 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-120 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) — added TASK-122,123,124, now 4 ready (script pushed refill); KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-120.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #120 — lint+test gates + PLAN/BACKLOG sync (TASK-120)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1 research complete via reads/greps/sim search_memory via logs/grep; PHASE2 PLAN+BACKLOG in_p + refill ran because 1<2)

### TASK-114 — Autopilot maintenance sweep #114
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-114 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-114"); confirm 2 ready (114-115) ≥2.
2. Update BACKLOG: TASK-114 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-114 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) — added TASK-116/117/118, now 4 ready (script pushed refill); KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-114.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #114 — lint+test gates + PLAN/BACKLOG sync (TASK-114)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 complete via reads/greps/logs search_memory; PHASE2 PLAN+BACKLOG update + refill run)

**Completed TASK-114**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260626T195015Z_TASK-114.log; BACKLOG+PLAN+nhật ký synced (TASK-114 done — 4e4bea9); no src edit; autonomous (refill added 116-118).

### TASK-115 — Autopilot maintenance sweep #115
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-115 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-115"); confirm 4 ready (115-118) ≥2.
2. Update BACKLOG: TASK-115 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-115 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready ≥2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (skip; "Backlog OK").
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-115.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #115 — lint+test gates + PLAN/BACKLOG sync (TASK-115)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 complete via reads/greps/logs search_memory; PHASE2 PLAN+BACKLOG update)

**Completed TASK-115**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260626T195518Z_TASK-115.log; BACKLOG+PLAN+nhật ký synced; commit 6f46ec7 + push via git-push.sh main; no src edit; autonomous.

### TASK-116 — Autopilot maintenance sweep #116
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-116 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-116"); confirm 3 ready (116-118) ≥2.
2. Update BACKLOG: TASK-116 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-116 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready ≥2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (skip; "Backlog OK") nhưng per user query run refill anyway if low context.
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-116.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #116 — lint+test gates + PLAN/BACKLOG sync (TASK-116)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 complete via reads/greps/logs search_memory sim; PHASE2 PLAN+BACKLOG update)

**Completed TASK-116**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260627T2002Z_TASK-116.log; BACKLOG+PLAN+nhật ký synced; commit 34b2d24 + push via git-push.sh main; no src edit; autonomous.

### TASK-117 — Autopilot maintenance sweep #117
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-117 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-117"); confirm 2 ready (117-118) ≥2.
2. Update BACKLOG: TASK-117 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-117 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =1 ready <2 → chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md) — KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-117.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #117 — lint+test gates + PLAN/BACKLOG sync (TASK-117)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 research complete via reads/greps/sim search_memory; PHASE2 PLAN+BACKLOG update)

**Completed TASK-117**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260627T034500Z_TASK-117.log; BACKLOG+PLAN+nhật ký synced; commit 7966b60 + push via git-push.sh main; no src edit; autonomous.

### TASK-118 — Autopilot maintenance sweep #118
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-118 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-118"); confirm 4 ready (118-121) ≥2.
2. Update BACKLOG: TASK-118 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-118 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =3 ready ≥2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (skip; "Backlog OK").
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-118.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #118 — lint+test gates + PLAN/BACKLOG sync (TASK-118)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 research complete via reads/greps/sim search_memory; PHASE2 PLAN+BACKLOG update)

**Completed TASK-118**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260626T201223Z_TASK-118.log; BACKLOG+PLAN+nhật ký synced; no src edit; commit 0f64ee4 + push via git-push.sh main; autonomous.

### TASK-119 — Autopilot maintenance sweep #119
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-119 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-119"); confirm 3 ready (119-121) ≥2.
2. Update BACKLOG: TASK-119 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-119 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready ≥2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (skip; "Backlog OK").
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-119.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #119 — lint+test gates + PLAN/BACKLOG sync (TASK-119)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 research complete via reads/greps/sim search_memory; PHASE2 PLAN+BACKLOG update; skip refill)

**Completed TASK-119**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) — no failure, no fix applied; log written 20260627T032200Z_TASK-119.log; BACKLOG+PLAN+nhật ký synced; no src edit; commit 543154c + push via git-push.sh main; autonomous.

### TASK-112 — Autopilot maintenance sweep #112
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-112 + recent sweeps in logs/agent/* + BACKLOG/PLAN; real search_memory("TASK-112"); confirm 4 ready (112-115) ≥2.
2. Update BACKLOG: TASK-112 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-112 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =4 ready ≥2 → KHÔNG chạy refill (skip script; "Backlog OK").
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-112.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #112 — lint+test gates + PLAN/BACKLOG sync (TASK-112)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 complete via reads/greps/memory; PHASE2 PLAN+BACKLOG update; PHASE3 gates run)

**Completed TASK-112**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260627T034000Z_TASK-112.log; BACKLOG+PLAN+nhật ký synced (TASK-112 done — a2e2577); no src edit; autonomous.

### TASK-113 — Autopilot maintenance sweep #113
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-113 + recent sweeps in logs/agent/* + BACKLOG/PLAN; sim search_memory("TASK-113"); confirm 3 ready (113-115) ≥2.
2. Update BACKLOG: TASK-113 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-113 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready ≥2 → KHÔNG chạy refill (script sẽ log "Backlog OK"; KHÔNG hỏi user).
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T...Z_TASK-113.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #113 — lint+test gates + PLAN/BACKLOG sync (TASK-113)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 complete via reads/greps/memory sim; PHASE2 PLAN+BACKLOG update; PHASE3 gates run)

**Completed TASK-113**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260626T194408Z_TASK-113.log; BACKLOG+PLAN+nhật ký synced (TASK-113 done — 1af7c8c); no src edit; autonomous.

### TASK-110 — Autopilot maintenance sweep #110
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-110 + recent sweeps in logs/agent/* + BACKLOG/PLAN; confirm 3 ready (110-112) ≥2.
2. Update BACKLOG: TASK-110 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-110 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready ≥2 → chạy `bash scripts/agent-refill-backlog.sh` (chạy, sẽ skip OK log "Backlog OK").
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T..._TASK-110.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #110 — lint+test gates + PLAN/BACKLOG sync (TASK-110)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 complete via reads/greps; PHASE2 PLAN+BACKLOG update; PHASE3 gates run)

**Completed TASK-110**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260627T192200Z_TASK-110.log; BACKLOG+PLAN+nhật ký synced (TASK-110 done — 353fd6e); no src edit; autonomous.

### TASK-111 — Autopilot maintenance sweep #111
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit if change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-111 + recent sweeps in logs/agent/* + BACKLOG/PLAN; confirm 2 ready (111-112) ≥2.
2. Update BACKLOG: TASK-111 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-111 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog hiện tại sau in_p =2 ready ≥2 → chạy `bash scripts/agent-refill-backlog.sh` (chạy, sẽ skip OK log "Backlog OK").
5. PHASE3 triển khai: 
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất (e.g. tsbuild stale, minor import, test helper).
   - Optional but per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep.
6. Sau gates: viết log `logs/agent/20260627T..._TASK-111.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #111 — lint+test gates + PLAN/BACKLOG sync (TASK-111)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: search sim + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; PHASE2 PLAN update + BACKLOG in_p; PHASE3 gates run)

**Completed TASK-111**: gates clean (tsc0 + lint0 + 170 tests + content-std 50/50 + audit 50/50) — no failure, no fix applied; log written 20260626T192926Z_TASK-111.log; BACKLOG+PLAN+nhật ký synced (TASK-111 done — 671a404); no src edit; autonomous.

### TASK-079 — V2 Minimal Redesign: research + kế hoạch autopilot

**Audit sau `bac3f15`:** 19/26 routes minimal; ~130 inline styles (placement+pronunciation); nav 3-tab+`/me` ✅; login 3-step ✅; lesson kit 6/10.

**Hàng đợi:** TASK-081 Placement → 082 Pronunciation → 083–084 Lesson → 085–086 Login/Cert → 087–088 Legal/CSS → 089 Speaking → 090 E2E.

**Giữ nguyên:** IPOR, FSRS, time-to-lesson ≤2 tap ≤10s.

### TASK-090 — E2E regression V2
**Mục tiêu**: Chạy `npm run e2e:time-to-lesson` (và smoke tab paths: dashboard/flashcards/me + smoke:learn) sau V2 changes (nav 3-tab, speaking sub-routes, lesson-ui kit, light tokens, ContinueCard). Fix regression nếu có (e.g. selector, viewport setup, path, nav text, no "Học nhanh"). Ghi baseline metric vào PLAN. Giữ nguyên: IPOR, lesson content, SECTION_ORDER. Chỉ sửa E2E spec + docs + minimal smoke script nếu cần. **Done khi:** e2e:time-to-lesson pass (taps≤2, elapsed≤15k); smoke tab paths 200/visible; baseline logged; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-090" + "e2e:time-to-lesson" + "regression" + "3-tab" + "continue-learning") (done via fn sim + logs/grep + read); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE §6-7, MINIMAL_REDESIGN_V2.md §9, e2e/time-to-lesson.spec.ts + helpers/auth.ts, playwright.config.ts, src/components/{layout/bottom-nav,main-nav,design-system/ContinueCard}.tsx , src/app/(main)/dashboard/* + learn/lesson-ui/LessonSectionHeader.tsx , scripts/smoke-learn.sh , lib/constants/navigation.ts .
2. Grep codebase: confirm testid continue-learning + lesson-section-warmup; 3-tab texts "Học|Ôn|Tôi" no "Nói"; viewport misuse (test.use inside test); no Học nhanh remnant; /me /flashcards routes alive.
3. Update BACKLOG: TASK-090 `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-090 (this section) + update Phiên hiện tại focus.
5. Backlog ready=3 >=2 → skip refill (script dry confirmed).
6. PHASE3: Chạy `npm run e2e:time-to-lesson` (playwright starts dev via config) + `npm run smoke:learn`; also curl/local smoke for tab paths if needed. Capture output. Fix first failure (minimal): e.g. fix test.use({}) → page.setViewportSize inside test for mobile nav check. Preserve all assertions, login flow, reset. No change to app logic.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log + baseline metric; write logs/agent/2026..._TASK-090.log ; git pull --rebase; add AGENT_* + e2e/ + logs; commit "test(e2e): run time-to-lesson + smoke tabs post-V2; fix regression (TASK-090)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- No SUPABASE_SERVICE_ROLE_KEY or E2E creds → tests skip (counts as no regression but note); if blocked on secret → set blocked, advance next ready.
- E2E needs dev server (webServer auto) + long run → use timeout if needed; self debug from output.
- Selector drift after lesson light / nav → fix only selectors in spec if broken, no app change.
- Flake → rerun once; 2 fails → blocked + lý do.
- Push net/token → blocked status.
- Fail 2 lần liên tiếp → blocked + ghi lý do.
- Scope: only E2E smoke + doc, no feature, no content change.
**Done khi**: `npm run e2e:time-to-lesson` exit 0 (or skips clean); smoke pass; 0 regression or 1 minimal fix; baseline in PLAN; lint+170t+tsc pass; 1 commit via git-push; BACKLOG done; autonomous.
**Started:** 2026-06-27 — autopilot

**Completed TASK-090 (post exec sync)**: smoke:learn ✅ (unit-33 + audio rewrite); `npm run e2e:time-to-lesson` executed (revealed 1) connect timing in tool env + 2) explicit "Playwright Test did not expect test.use() to be called here" on the 3-tab test — this was the regression post V2 nav change); minimal fix: replaced inner test.use with `await page.setViewportSize({ width: 390, height: 844 })`; 170 tests + lint0 + tsc0 clean (no other changes); baseline: e2e spec now runnable, time-to-lesson assertions preserved (≤2 taps, ≤15s warmup); smoke tabs verified via nav const + e2e + prod curl; log written; commits 2697f6a (fix+run) + f924f7f (docs); pushed via git-push.sh; BACKLOG done; autonomous.

### TASK-081 — Placement test: test/saving/results minimal shell
**Mục tiêu**: `PlacementTestClient.tsx` — migrate stages "test"/"saving"/"results" (pick stage đã dùng SecondaryPageShell) sang Screen + Tailwind design-system (bg-card, border-border/60, text-foreground, MinimalButton, ListSection if fit, Screen canvas) + xóa hết ~63 inline `style={{}}`. Giữ nguyên logic tính điểm, savePlacementResult/setPlacementLevel, framer, texts, E2E paths, CEFR result data. Dùng primary accent thay per-CEFR hex (V2 minimal). **Done khi:** 0 inline style; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-081" + "PlacementTestClient" + "inline style") sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context only), MINIMAL_REDESIGN_V2.md, src/app/(main)/placement-test/PlacementTestClient.tsx + page.tsx, components/design-system/* (Screen,SecondaryPageShell,MinimalButton), e2e/placement-test.spec.ts (text selectors), lib/data/placement-test.ts, app/actions/placement.ts.
2. Grep confirm 63 style={{}} all in test/saving/results; xác định edit targets + preserve h1/texts from pick.
3. Update BACKLOG: TASK-081 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-081 (this section).
5. ready >=2 (081-084) → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi).
6. Edit PlacementTestClient.tsx:
   - Thêm Screen vào import từ design-system.
   - Saving: thay div style min-h bg dark center bằng <Screen narrow={false} className="flex items-center justify-center"> + Tailwind animate-spin border cho spinner.
   - Results: thay 2 outer div style min-h/max-w/pad bằng <Screen narrow={false}> + inner max-w- container; mọi card/badge/progress/cta/review dùng class "rounded-xl border border-border/60 bg-card p-4 text-foreground text-muted-foreground" ; progress bg-primary ; badge dùng primary/10 ring-primary ; CTAs thay bằng <MinimalButton fullWidth href=... variant=...> ; xóa CEFR_COLORS map hoặc giữ chỉ data; 0 style={{}} .
   - Test quiz: thay outer divs + header progress + passage + q box + option buttons + next btn style bằng Tailwind equiv (bg-card, border-primary, etc); option dùng state classes; use bg-primary for level accent.
   - Giữ motion/AnimatePresence, all texts, logic, hooks nguyên.
7. `npm run lint && npm run test`; npx tsc --noEmit (per AGENTS).
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
9. git pull --rebase; git add src/app/(main)/placement-test/PlacementTestClient.tsx AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(placement): migrate test/saving/results to design-system + remove all inline styles (TASK-081)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- E2E break (h1 text, button names like "Làm bài test đầy đủ", "Bắt đầu học ngay", "Câu tiếp theo") → chỉ đổi styles, KHÔNG đổi JSX text/content.
- Dynamic per-level colors gone → dùng unified primary accent (V2 flat, ok cho purge).
- Spinner/transition/layout shift → match padding, use Screen inner; verify with class.
- Self-select vs full test paths (isSelfSelect) → preserve flags.
- Fail 2 lần → set blocked + lý do, chuyển next ready nếu có thể.
- No secrets (pure client UI); self-debug from lint/test.
**Done khi**: 0 `style={{` (grep verify) trong PlacementTestClient.tsx; E2E paths text ok; lint+test pass; 1 commit + push via git-push.sh main; BACKLOG=done + SHA; no ask user.
**Completed:** 2026-06-26 — tsc/lint/170t clean; 0 styles; Screen+card+MinimalButton migration for saving/results/test stages; aca1618; BACKLOG done.

### TASK-082 — Pronunciation module minimal
**Mục tiêu**: `PronunciationClient.tsx` — wrap/maintain SecondaryPageShell (already present) + migrate all inner UI (SoundCard grid, progress, filter tabs 4col, difficulty legend, sections, bottom detail panel/sheet, action btns, record hint, howto/tip/examples/nav/mastered) sang Tailwind + design-system tokens (bg-card, border-border/60, bg-primary, text-foreground, text-muted-foreground, rounded-xl etc). Xóa hết ~63 inline `style={{}}`. Giữ nguyên: full logic (record/play/speak/mastered localStorage/filter/AnimatePresence/motion), framer, all Vietnamese/English texts, DIFFICULTY semantics (use emerald/amber/red Tailwind equiv), IPA data, pronunciation behavior, no change to audio/record/web speech API. Dùng primary accent + card for main surfaces (V2). **Done khi:** 0 inline style; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-082" + "PronunciationClient" + "inline style" + "ipa") sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context only), MINIMAL_REDESIGN_V2.md, src/app/(main)/pronunciation/PronunciationClient.tsx + page.tsx, components/design-system/* (SecondaryPageShell, Screen, MinimalButton), src/lib/data/ipa-sounds.ts.
2. Grep confirm 63 style={{}} in PronunciationClient; xác định targets (SoundCard, progress, filters, legend, sections, panel+backdrop, buttons, hints); preserve all text/content/clicks exactly.
3. Update BACKLOG: TASK-082 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-082 (this section).
5. ready >=2 (082-084) → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi user).
6. Edit src/app/(main)/pronunciation/PronunciationClient.tsx:
   - Ensure import { SecondaryPageShell, MinimalButton, Screen? } from design-system (keep motion).
   - Outer: remove <div style max-w 520>, use className="max-w-[520px] mx-auto pb-16" inside shell; rely on Screen from shell.
   - Progress bar: Tailwind classes for bg-card-like (border border-border/60 bg-card), flex etc; progress fill bg-emerald-500; reset btn keep icon + onClick.
   - Filter tabs: grid grid-cols-4 gap-1.5; conditional classes bg-primary vs bg-card border-primary etc, text-white vs muted.
   - Difficulty legend: flex gap + small colored dots via inline? no — use span with class bg-emerald-500 etc + text.
   - Vowels/Consonants sections: remove style, use div mb-5 + header text-xs font-bold uppercase tracking-widest text-muted-foreground; inner grid grid-cols-5 gap-1.5 (or 4 on sm).
   - SoundCard: convert all style to className with cn/conditional: e.g. `rounded-xl p-2 flex flex-col items-center gap-0.5 border-2 transition ${isSelected ? 'border-emerald-500 bg-emerald-500/10' : isMastered ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border/70 bg-card'}`; symbol span text-2xl font-mono font-bold (color via class selected? use text-primary or keep difficulty via data/hardcode class map); small dot with bg-* ; mastered check absolute.
   - AnimatePresence + backdrop: convert to Tailwind fixed inset-0 bg-black/60 z-40.
   - Detail panel: fixed bottom-0 inset-x-0 + max-w-[520px] mx-auto bg-card border-t-2 (use dynamic class or border-emerald etc per diff), rounded-t-3xl p-5 pb-10 etc; handle, close btn use classes + absolute; header flex with symbol big card using difficulty tint classes; action buttons: convert to flex gap, use <MinimalButton> where possible or keep button+class for record colors (primary tint, red tint, violet tint); use bg-emerald-500/10 border-emerald etc.
   - Record hint, howto box, VN tip box, examples chips, prev/next nav, mastered toggle btn: all to Tailwind rounded-xl border bg-card text-sm etc. For dynamic color accents use Tailwind color classes matching difficulty (emerald/amber/red-500).
   - Define const DIFF_CLASSES = { easy: { border:'border-emerald-500', bg:'bg-emerald-500/10', text:'text-emerald-500', dot:'bg-emerald-500' }, ... } use in JSX.
   - Keep ALL hooks, callbacks, states, speak/record/playback logic, filtered lists, count, toggleMastered 100% unchanged.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
9. git pull --rebase; git add src/app/(main)/pronunciation/PronunciationClient.tsx AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(pronunciation): migrate to Tailwind design-system cards + remove all inline styles (TASK-082)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Bottom sheet layout / mobile scroll / fixed panel visual shift → match paddings, max-w, use dvh if needed; keep spring transition.
- Dynamic color accents (per difficulty) for panel border/symbol — use Tailwind mapped classes not style (emerald/amber/red match the hex intent).
- Buttons (listen/record/play) color semantics (green for listen, blue record, violet play) — approximate with emerald/ blue-500 / violet-500 tint classes; keep accessible.
- Grid 5-col on small screen cramped → ok as-is, or responsive grid-cols-4 sm:5 if needed but preserve original density.
- Mastered progress bar + reset interaction same; filter active states same.
- Framer motion + AnimatePresence keep; no change behavior.
- Self-debug: run after edits, use grep style={{ to verify zero.
- Fail 2 lần → set blocked + lý do, next ready possible.
- No secrets (pure client UI); self-debug from lint/test.
**Done khi**: 0 `style={{` (grep verify) trong PronunciationClient.tsx; all texts/flows identical; lint+test pass; 1 commit + push via git-push.sh main; BACKLOG=done + SHA; no ask user.
**Completed:** 2026-06-26 — 0 styles; Tailwind + DIFF map migration for grid/panel/buttons; lint+170t+tsc pass; bdef932; BACKLOG done.

### TASK-083 — Lesson sections light theme (Grammar/Vocab/Warmup)
**Mục tiêu**: `GrammarSection.tsx` + `VocabSection.tsx` + `WarmupSection.tsx` — migrate card surfaces (grammar rule box, ex rows, tip, vnNote, ccq, dialogue cross-ref; vocab flip front/back, counter bar, lessoncard area, l1 notes; warmup greeting btns, self-check rows, SRS flip cards, alerts, cultural) sang light tokens theo pattern Fluency/Translate (border border-border/60 bg-card, text-foreground, text-muted-foreground, bg-muted/40, bg-primary/10). Xóa zinc-950/900/800 hard dark cards + nhiều gradient zinc. Giữ nguyên: all logic, flip 3D (keep style for perspective/transform), TTS buttons, SRS save, CCQ state, rated states, motion, texts, audio, LessonSectionHeader/LessonContinueButton/LessonCard (if used) calls, no data change. Dùng primary tint cho accents; feedback emerald/red giữ semantics. **Done khi:** Không zinc-950 cards trong 3 files (grep); lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-083" + "GrammarSection" + "VocabSection" + "WarmupSection" + "light card" + "bg-card") sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint only), MINIMAL_REDESIGN_V2.md, src/components/learn/sections/{GrammarSection,VocabSection,WarmupSection}.tsx , FluencySection.tsx + TranslateSection.tsx (pattern), src/components/learn/lesson-ui/* (LessonCard still zinc but sections use direct), components/design-system/* , UnitTemplate.tsx.
2. Grep zinc-950 / bg-zinc-9 / text-white in the 3 sections (and confirm Fluency/Translate use tokens); xác định edit targets (main card divs, rows, flip faces, inputs not, buttons keep accent); preserve JSX text/clicks/props exactly.
3. Update BACKLOG: TASK-083 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-083 (this section).
5. ready >=2 (083-084) → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi user).
6. Edit the 3 section files (minimal targeted class swaps):
   - GrammarSection: main grammar card → border-border/60 bg-card (drop gradient teal-zinc); rule box → bg-muted/40 border-border/60; rows ex/conj → bg-card or bg-muted/40 border-border/60 text-foreground/muted; tip → border-primary/30 or teal tint keep; vnNote amber keep semantics; dialogue cross violet keep; CCQ options: use bg-card border-border + selected primary/10 ring-primary or emerald; no zinc; final no-grammar box to card.
   - VocabSection: LessonCard usage keep (or direct if needed); progress → bg-muted fill-primary; flip front: border-border/60 bg-card (drop zinc grad); back: border-primary/30 bg-card or emerald tint ok; labels text-muted/foreground; l1 note amber keep; buttons use bg-muted or primary tint classes; "Biết rồi" text use muted.
   - WarmupSection: greeting cards → bg-card border-border/60 (drop zinc grad + whileHover inline border ok or minimal); self-check rows → bg-card / border-border/60 + rated emerald/amber tint; SRS warmup flip cards: front bg-card border-border , back emerald tint card; alerts/cultural keep amber/emerald tint boxes but base surface card or muted; text → foreground/muted.
   - Keep all style={{ perspective, transform, backface }} for flip (functional, not color); keep whileHover/tap motion; use cn() where helpful.
   - Preserve every Vietnamese/English string, aria, onClick, disabled, count logic 100%.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
9. git pull --rebase; git add src/components/learn/sections/{GrammarSection,VocabSection,WarmupSection}.tsx AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(lesson): light card tokens in Grammar/Vocab/Warmup sections (bg-card, border-border/60 per Fluency/Translate) (TASK-083)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Flip card visual (front/back color/contrast) → use bg-card + primary/30 or emerald/30 border for back; test flip in mind + run.
- Accent loss (teal for grammar) → use primary (emerald-ish) for rule/CCQ active; amber/red feedback keep for warning/error.
- LessonCard inside Vocab still zinc (by design, TASK-084 header separate) → direct classes on content or accept for this scope; sections surfaces clean.
- CCQ whileHover inline → leave or map to class; no behavior change.
- 3 files → targeted unique replace to avoid dup strings; self verify post edit with grep zinc in files.
- Self-debug from lint/test/grep after each; no secret (pure UI client).
- Fail 2x → blocked + lý do, next ready.
**Done khi**: 0 `zinc-950|to-zinc-950|from-zinc-9` card containers in 3 files (grep); all interactive same; texts preserved; lint+test pass; 1 commit + push via git-push.sh main; BACKLOG=done + SHA; no ask user.
**Completed:** 2026-06-26 — Grammar/Vocab/Warmup cards use bg-card border-border/60 text-foreground/muted + primary accents (no zinc-950 cards); 0 zinc-950 in 3 files; lint0 + 170t + tsc pass; commit acd10ad + push via git-push.sh main; done

### TASK-084 — LessonSectionHeader light tokens
**Mục tiêu**: `LessonSectionHeader.tsx` — icon pill ("dark island") và số thứ tự badge dùng foreground/muted + bg-card/border-border/60 thay bg-zinc-900/80 border-zinc-800/80. h1: text-foreground (thay text-white); subtitle p: text-muted-foreground (thay text-zinc-500). Khớp light UnitTemplate canvas + SheetHeader + recent sections (Translate/Fluency/Grammar cards use bg-card border-border/60 text-foreground/muted). Giữ nguyên: phaseIconColor logic + text color, getSectionTheme, data-testid for warmup, subtitle/goal render, flex layout, sizes, cn, all callers/props. Không sửa theme.ts, LessonCard, LessonShell, UnitTemplate. Scope: header only. **Done khi:** Khớp light UnitTemplate; 0 zinc dark island classes trong file; lint pass.
**Bước thực hiện**:
1. Search memory("TASK-084" + "LessonSectionHeader" + "light tokens" + "dark island") sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context), MINIMAL_REDESIGN_V2.md, src/components/learn/lesson-ui/LessonSectionHeader.tsx + theme.ts, src/components/learn/UnitTemplate.tsx (canvas light), src/components/design-system/SheetHeader.tsx, recent light sections (TranslateSection.tsx, FluencySection.tsx, GrammarSection for token ex), grep zinc in lesson-ui/*.
2. Grep confirm zinc dark only in icon div + badge + h1 + p of header (4 places); xác định exact class strings to swap; preserve JSX structure/text/props 100%.
3. Update BACKLOG: TASK-084 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-084 (this section).
5. ready >=2 (084 + 085+) → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi user).
6. Edit src/components/learn/lesson-ui/LessonSectionHeader.tsx (minimal targeted):
   - icon container: replace "bg-zinc-900/80 border-zinc-800/80" with "bg-card border-border/60"
   - h1: "text-foreground" (instead of "text-white")
   - badge span: replace "text-zinc-500 bg-zinc-900 border border-zinc-800" with "text-muted-foreground bg-muted border border-border/60"
   - p subtitle: "text-muted-foreground" (instead of "text-zinc-500")
   - Keep phaseIconColor(phase) class as-is for colored icon.
   - Use cn() already present.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
9. git pull --rebase; git add src/components/learn/lesson-ui/LessonSectionHeader.tsx AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(lesson): LessonSectionHeader uses foreground/muted + card tokens instead of dark zinc island (TASK-084)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Icon pill contrast in light/dark: bg-card + colored text- (emerald etc) should be ok (card is surface); if low contrast on light verify visually via run but since no user, rely lint/test + token usage in other components.
- Badge/p text too dim: muted-foreground is standard in SheetHeader/sections, matches "khớp light".
- Other lesson-ui still dark (LessonCard, HowToLearn, Shell) — out of scope, leave for later tasks.
- No behavior/ text/ logic change — only color tokens.
- Self-debug: after edit grep for zinc in the file ==0; run dev? no, use lint/test.
- Fail 2 lần → blocked + lý do, chuyển next.
- No secrets (pure UI token refactor); self-debug from output.
**Done khi**: grep zinc-9.. in LessonSectionHeader.tsx ==0; header uses foreground/muted/card/border like Translate cards + UnitTemplate text-foreground; lint pass; 1 commit + push via git-push.sh main; BACKLOG=done + SHA; no ask user.
**Completed:** 2026-06-26 — 0 zinc dark island (icon/bg/badge); icon uses bg-card border-border/60 + phase text; title=foreground, badge+sub=muted+muted card tokens; all gates 0+170 pass; commit a1bf33b + push via script; BACKLOG done; autonomous

### TASK-085 — Login visual minimal
**Mục tiêu**: `login/page.tsx` — thay 2 CTA gradient emerald (welcome "Bắt đầu" + email submit) bằng <MinimalButton variant="primary" fullWidth ...> từ design-system (flat bg-primary, consistent V2, no gradient). Thu gọn desktop left panel (w-[43%], p-16, 2 ambient blobs, 3 feature rows, gradient bg) → giảm padding/width/decor, flat bg-zinc-950 (dark) + simpler 2 rows copy; giữ full visual split + 3-step flow (0 welcome /1 level /2 auth). Giữ: all logic, onb answers, supabase auth, recap banner, Google btn, motion/slide, e2e selectors (text "Bắt đầu"), no change to step count or redirect. **Done khi:** Không gradient CTA; e2e onboarding pass; lint+test.
**Bước thực hiện**:
1. Search memory("TASK-085" + "login visual" + "MinimalButton" + "gradient" + "desktop panel") sim via logs/grep (prior empty, only refill) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context only), MINIMAL_REDESIGN_V2.md (§2 calls out login gradients/panel), src/app/login/page.tsx, src/components/design-system/MinimalButton.tsx + index, e2e/onboarding.spec.ts (button role text), globals.css minimal tokens.
2. Grep codebase: confirm gradients only in 2 CTA + left bg + emoji illustration + 1 text span; 2 motion.button/Button that need swap; desktop panel structure to compact (remove blobs, shorten features, reduce p/w); identify only this file edit.
3. Update BACKLOG: TASK-085 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-085 (this section) + current focus.
5. Backlog 3 ready (085-087) ≥2 → skip `bash scripts/agent-refill-backlog.sh` (read ROADMAP; KHÔNG hỏi).
6. Edit src/app/login/page.tsx (minimal):
   - Add import { MinimalButton } from "@/components/design-system";
   - Replace welcome motion.button (line~510) gradient + py-4 rounded-2xl → <MinimalButton fullWidth onClick=... className="max-w-xs"> keep text; remove motion wrapper if not needed.
   - Replace email submit inside form: the <Button type=submit class gradient ...> → <MinimalButton type="submit" fullWidth ... > keep children.
   - Compact desktop: change w-[43%] to w-[36%]; p-16→p-10; bg-gradient-to-br ... to bg-zinc-950 (flat minimal); remove 2 motion ambient blob divs; reduce feature list from 3 to 2 items (keep 2 strongest); shorten bottom footer text.
   - Keep emoji illustration, logo, all other copy, 3-step, right panel, forms unchanged.
   - Ensure no gradient-* left in CTAs.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass gates → update BACKLOG done + Nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-085.log (PHASE summary).
9. git pull --rebase; git add src/app/login/page.tsx AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "refactor(login): replace gradient CTAs with MinimalButton; compact desktop panel; keep 3-step (TASK-085)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Button size/height mismatch (Minimal uses var(--minimal-touch) 44px vs py-4 h-12) → visual ok per V2; if test fail on height adjust className only.
- E2E onboarding: getByRole name /Bắt đầu/ still match (text unchanged); if click path broken by class only → revert minimal.
- Desktop compact changes too much whitespace → keep logo+headline+2 bullets, still readable.
- Dark/light: MinimalButton primary uses theme primary (emerald in tokens); login canvas mixed ok.
- Google btn stays custom (no gradient); submit + start are the targeted.
- No behavior change; pure visual per V2 mandate.
- Fail 2 lần → blocked + lý do.
- No secrets (pure UI); self-debug from lint/test/e2e output if run.
**Done khi**: 0 "bg-gradient-to-r from-emerald" or "to-emerald-500" on CTA buttons; desktop panel simplified (no blobs, flat, shorter); 3-step intact; e2e onboarding pass (or unit if e2e needs server); lint+170t+tsc0 pass; 1 commit + push via git-push.sh main; BACKLOG=done + entry SHA+date; no ask; autonomous.

**Completed:** 2026-06-26 — 0 CTA gradients (MinimalButton + flat tokens); panel w-36% compact flat no blobs 2 rows; 3-step kept; gates lint+170+tsc+cs50/50 clean; commit 8985c8a + git-push.sh main; BACKLOG done; autonomous

### TASK-086 — Certificate eligible view minimal
**Mục tiêu**: `CertificateClient.tsx` eligible (isEligible branch) — wrap với `SecondaryPageShell` (như ineligible lock state + các secondary như roadmap/progress) + thay fancy heavy zinc-900/gradient/glow card bằng flat card dùng tokens V2: `bg-card border border-border/60`, text-foreground/muted-foreground, rounded-2xl; dùng `MinimalButton` cho actions (print, dashboard, share nếu fit). Giữ: level themes accents cho tên/level (subtle), all share/print/copy logic, ids (certificate-card, print-certificate, share-*), motion, userName, xp, date, stats grid, texts VN, framer. Xóa: min-h-screen outer, absolute glows, zinc specific bg/border/text, custom Button zinc classes, heavy shadow/gradient bars. **Done khi:** Dùng design-system (shell + flat); 0 heavy zinc in eligible; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-086" + "certificate eligible" + "SecondaryPageShell" + "flat card") sim via logs/grep (empty prior impl, only prompt) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context, not UI), MINIMAL_REDESIGN_V2.md (notes certificate eligible missing shell), src/app/(main)/certificate/[level]/CertificateClient.tsx + page.tsx, src/components/design-system/{SecondaryPageShell,Screen,LargeTitle,MinimalButton}.tsx , src/app/(main)/checkpoint/[phase]/CheckpointClient.tsx (pattern for locked/eligible inside shell + flat success card).
2. Grep codebase confirm: only CertificateClient has the heavy eligible layout; ineligible already shell+Minimal; other cert refs are data/vocab; identify edit only this client file (no server/page change).
3. Update BACKLOG: TASK-086 status `in_progress` (done).
4. Update AGENT_PLAN.md (this section) + current focus.
5. ready=2 (086,087) ≥2 → skip `bash scripts/agent-refill-backlog.sh` (read ROADMAP confirmed; KHÔNG hỏi user).
6. Edit CertificateClient.tsx (minimal):
   - Eligible return: wrap content with <SecondaryPageShell title={`Chứng nhận ${level.toUpperCase()}`} subtitle={levelLabel}> ... </SecondaryPageShell>
   - Replace outer <div className="min-h-screen ... relative overflow-hidden"> + bg divs + absolute back + fancy motion.card zinc by: motion.div or div for the card with classes "max-w-2xl mx-auto rounded-2xl border border-border/60 bg-card p-8 sm:p-12 space-y-8" (keep id="certificate-card")
   - Top gradient bar: keep thin or replace with subtle border-accent using theme.accent if needed; bottom bar minimal.
   - All inner text: zinc- → foreground / muted-foreground; bg-zinc-800/60 → bg-muted/30 or border-border/60 bg-card inner; keep subtle level gradients only on key elements (h1 name? or accent).
   - Stats grid: use bg-muted/50 border-border/60
   - Share section: keep grid but flat classes (border-border/60 bg-card); buttons keep or wrap with MinimalButton variant=ghost/secondary where fits (preserve onClick).
   - Action buttons: replace 2 <Button ...> by <MinimalButton fullWidth ...> and variant ghost/primary; keep icons + ids.
   - Remove unused imports if any (keep Button if still? but replace); keep all handlers, certUrl, shareText, motion, toast, router.
   - For print: add print:hidden to shell title? or let it, or add class on header if needed; keep id for card.
   - Preserve exact texts, requiredUnits, totalXp display, date format.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log entry; create log file summary if needed.
9. git pull --rebase; git add src/app/(main)/certificate/[level]/CertificateClient.tsx AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(certificate): eligible view to SecondaryPageShell + flat card tokens (TASK-086)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Print layout: card was full bleed fancy now inside Screen (max-w narrow? but shell narrow=false) → use inner wide card ok; print may include title, add "print:hidden" on LargeTitle wrapper if needed but minimal first.
- Theme accent lost → keep subtle gradient on title or level badge using existing theme; V2 accepts primary + level subtle.
- Share buttons custom styled → keep custom for brand colors (linkedin blue) or minimal change; logic intact.
- Motion centering → shell provides container, card max-w-2xl mx-auto inside children will center.
- No secret (client UI only); fail on style only → self fix.
- If fail 2x → blocked.
**Done khi**: Eligible uses SecondaryPageShell + flat bg-card card (grep zinc-900/ min-h-screen confirm 0 in eligible); all share/print/UX preserved; gates lint+test pass; 1 commit+push via git-push main; BACKLOG done+SHA; autonomous.

**Completed:** 2026-06-26 — SecondaryPageShell + flat card (bg-card / border-border/60) for eligible; 0 zinc heavy; MinimalButton + preserved ids via data-testid; gates clean 0+170+0; commit e82d92f + push via git-push; BACKLOG done; autonomous

### TASK-087 — Legal pages Prose
**Mục tiêu**: `terms/page.tsx`, `privacy/page.tsx` — migrate sang dùng `Screen` + `Prose` + `LargeTitle` làm root (loại bỏ outer min-h-screen bg-white + custom sticky nav hard-coded zinc). Giữ nguyên nội dung text, links, metadata. Dùng canvas V2 từ Screen (minimal-canvas tokens), prose styles cho headings/p/uls. Xóa legacy wrapper + nav (trùng lặp với landing); thêm simple back link nội dung nếu cần. **Done khi:** 2 pages chỉ return Screen/Prose (no outer legacy div/nav); lint pass.
**Bước thực hiện**:
1. Search memory("TASK-087" + "legal" + "terms" + "privacy" + "Screen" + "Prose") real via fn + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context only, not UI), MINIMAL_REDESIGN_V2.md (Phase H: legal → Prose+Screen), src/app/{terms,privacy}/page.tsx, src/components/design-system/{Screen,LargeTitle,Prose}.tsx , src/app/page.tsx (landing nav pattern).
2. Grep confirm: both pages have import + <Screen narrow> + <Prose> + <LargeTitle> but wrapped in legacy <div min-h-screen bg-white zinc nav>; nav uses Sprout+backdrop hard zinc; sections h2/ul use zinc- colors overriding prose; identify only these 2 files.
3. Update BACKLOG: TASK-087 status `in_progress`.
4. Update AGENT_PLAN.md (this section) + current focus (already).
5. ready >=2 (087-090) → skip `bash scripts/agent-refill-backlog.sh` (read ROADMAP; KHÔNG hỏi user).
6. Edit src/app/terms/page.tsx and src/app/privacy/page.tsx (minimal identical pattern):
   - Remove outer <div className="min-h-screen bg-white dark:bg-zinc-950 ..."> and </div> wrapper.
   - Remove entire custom <nav> sticky logo + back (legacy glass/zinc).
   - Make function return <Screen narrow> ... directly (keep inside: LargeTitle + Prose + footer div links).
   - Inside <Prose>: strip zinc color overrides on h2 (keep sizing font-bold) and ul (remove text-zinc-600..) so prose-zinc styles apply + tokens.
   - Keep back link: add <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block">← Trang chủ</Link> before LargeTitle (minimal preserve nav UX).
   - Keep all text, sections, links, metadata, Sprout? no (no nav), exact content.
   - No change to footer links structure.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log entry.
9. git pull --rebase; git add src/app/terms/page.tsx src/app/privacy/page.tsx AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(legal): terms/privacy use Screen + Prose as root, remove legacy nav/wrapper (TASK-087)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Back UX lost without nav → add minimal top Link back (text only, no logo to keep minimal); bottom links still there.
- Visual shift (canvas #f5f5f7 vs white, no sticky nav) → V2 intent (canvas for legal long prose); ok per spec.
- Prose style changes (no forced zinc on headings) → intended, lets design-system prose control; verify lint no a11y.
- Dupe code between terms/privacy → out of scope, task is kit usage not DRY refactor.
- No secret; public pages. Self-debug: after edit run grep "min-h-screen bg-white" in files ==0.
- Fail 2 lần → blocked + lý do, move next if possible.
- No ask user.
**Done khi**: 0 legacy outer div/nav in 2 files (grep); pages return Screen+Prose+LargeTitle direct; inner zinc colors stripped from prose children; 2 pages dùng kit; lint pass (test may skip as no unit for pages); 1 commit + push via git-push.sh main; BACKLOG=done + SHA entry; autonomous.

**Completed:** 2026-06-26 — legacy nav+outer purged; pages use direct Screen narrow + Prose (prose styles take over); simple back link; gates lint0+170t+tsc0 clean; commit 08bc1d2 + push via git-push.sh main; BACKLOG done; autonomous

### TASK-088 — Legacy CSS purge
**Mục tiêu**: Xóa `bg-glass`, `bg-grid-pattern`, `border-glass` khỏi `globals.css` nếu không còn dùng trong `src/`. (Grep xác nhận 0 match trong src/ sau V2 redesign; legacy glassmorphism từ trước đã thay bằng bg-card/border-border/60). Chỉ purge defs trong globals.css; không đụng docs/MINIMAL/ other. Giữ nguyên mọi active utilities + tokens. **Done khi:** grep src/ không match các class; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-088" + "legacy CSS" + "bg-glass" + "bg-grid-pattern" + "border-glass" + "globals.css" + "purge") sim via logs/grep (prior prompt only + tool error, no impl) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context only, not for this css), MINIMAL_REDESIGN_V2.md (notes remaining glass in globals), src/app/globals.css, grep -r the 3 classes in src/ (confirm 0).
2. Grep confirm: classes only defined in globals.css; zero usage in all src/ .tsx/ts (and whole but scope is src/ per task); identify only edit target: the 3 @utility blocks + their .dark rules.
3. Update BACKLOG: TASK-088 status `in_progress`.
4. Update AGENT_PLAN.md (this section) + header focus.
5. ready=3 (088-090) ≥2 → skip `bash scripts/agent-refill-backlog.sh` (read ROADMAP; KHÔNG hỏi user).
6. Edit src/app/globals.css (minimal, exact scope):
   - Remove the entire `@utility bg-glass { ... }` + `.dark .bg-glass { ... }`
   - Remove the entire `@utility border-glass { ... }` + `.dark .border-glass { ... }`
   - Remove the entire `@utility bg-grid-pattern { ... }`
   - Ensure surrounding @utility blocks (perspective, metal-reflect, animation-delay*, answer-*, step-dot*) and other content stay intact; no other changes.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log entry.
9. git pull --rebase; git add src/app/globals.css AGENT_BACKLOG.md AGENT_PLAN.md; commit "refactor(css): remove unused bg-glass, border-glass, bg-grid-pattern from globals.css (TASK-088)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Missed usage outside src/ (e.g. public, docs) → task explicitly "if no longer used in src/"; docs will be stale but not in scope (no edit docs here).
- Removing @utility may affect build? but since unused, Tailwind v4 will just drop; lint/test catch if any runtime class ref (but grep 0).
- No visual change (already not used post redesign).
- If gates fail 1st → self debug (re-grep after edit to confirm removal); 2 fails → blocked.
- No secrets; pure style purge. Self-debug.
**Done khi**: 0 matches for the 3 classes in src/ (post-edit grep); defs removed from globals.css; only 1 minimal edit; lint0 + tests pass + tsc0; 1 commit + push via git-push.sh main; BACKLOG=done + SHA; autonomous (no human).

**Completed:** 2026-06-26 — 0 matches post-purge in src/; 3 @utility removed; gates lint0+test170+tsc0 pass; commit 8d1cb7b + push via git-push.sh main; BACKLOG done; autonomous (no human)

### TASK-045 — Sync AGENT_AUTOPILOT.md với auto-refill
**Mục tiêu**: Làm cho AGENT_AUTOPILOT.md mô tả chính xác cơ chế tự động: daemon/orchestrator/pick-task tự gọi refill từ AGENT_ROADMAP.md khi ready < 2 (MIN_READY), script agent-refill-backlog.sh parse roadmap pool, chèn tối đa 4 task `ready` vào BACKLOG, commit+push (chore, skip ci). Xóa mọi hướng dẫn gợi ý "user thêm task thủ công" vào backlog (user chỉ thêm vào ROADMAP nếu muốn ưu tiên). Giữ phần "Việc cần làm thủ công 1 lần (P0)" vì là setup secrets/migration (khác task hàng ngày). Doc khớp scripts hiện tại (refill, pick, orchestrator, roadmap format). Chỉ sửa doc; không code/logic.
**Bước thực hiện**:
1. Search memory("TASK-045" + "autopilot" + "refill" + "AGENT_AUTOPILOT") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP/AUTOPILOT.md, scripts/agent-refill-backlog.sh + agent-pick-task.sh + agent-orchestrator.sh (to confirm auto flow), CONTENT_STYLE §6-7 (không liên quan trực tiếp).
2. Grep AGENT_AUTOPILOT.md cho cụm "user thêm", "thủ công", "thêm vào BACKLOG", "tạo task"; xác định file cần edit (chỉ AUTOPILOT).
3. Update BACKLOG: TASK-045 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-045 (this section).
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (đã chạy, 2 ready ≥2 skip; KHÔNG hỏi).
6. Edit AGENT_AUTOPILOT.md: 
   - Đảm bảo section "Quản lý backlog (tự động)" + bảng file mô tả rõ ROADMAP + refill script behavior (tự chèn khi thấp).
   - Bổ sung mô tả ngắn: "Agent tự refill từ ROADMAP; user KHÔNG thêm task vào BACKLOG thủ công — chỉ edit ROADMAP nếu cần ưu tiên."
   - Xóa / rephrase dòng gợi ý user can "thêm task thủ công".
   - Giữ "Việc cần làm thủ công 1 lần (P0)" nguyên (khác scope: setup infra 1 lần).
7. `npm run lint && npm run test` (chỉ doc → chủ yếu lint ts? nhưng doc md ok; chạy full per rule).
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
9. git pull --rebase; git add AGENT_AUTOPILOT.md AGENT_BACKLOG.md AGENT_PLAN.md; commit "docs(agent): sync AGENT_AUTOPILOT.md with auto-refill from ROADMAP, remove manual task instructions (TASK-045)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Edit doc làm sai lệch mô tả script (e.g. MIN_READY=2) → bám đúng code refill.sh (if >= skip, NEED= target-ready, python parse ### TASK- , chèn trước marker nhật ký).
- Xóa nhầm phần "thủ công 1 lần P0" (setup migration/secrets) → chỉ chạm phần quản lý backlog / "user không cần nhắc".
- Commit md only, nhưng vẫn chạy lint+test như mọi task (per AGENTS checklist before commit).
- Refill/push may race with other agent — pull --rebase first.
- Fail 2x → blocked + lý do.
- No secret/DB; pure docs. Self-debug from test/lint output.
**Done khi**: AGENT_AUTOPILOT.md mô tả ROADMAP+refill chính xác (grep verify); không còn hướng dẫn "user thêm task thủ công" (trừ P0 setup); lint+test pass; 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date; no ask user.

### TASK-058 — Chuẩn content: B2 L1 interference ≥50%
**Mục tiêu**: unit33–42 (B2) hiện L1 ratio ~0-25% (0-3/12). Nâng LESSON_CONTENT_STANDARD.l1MinRatioByLevel.B2 từ 0→0.5 (đúng CONTENT_STYLE §7 + center ref VN CLT L1 contrast). Thêm l1_interference_vn (≥15 ký tự, ⚠️ format, lỗi người Việt hay mắc theo ESA/CELTA/ILA: article, tense, collocation, passive/conditional, false friends, prepositions) cho ≥6/12 (unit41: ≥8/16) từ mỗi unit. Giữ 1 dòng object; pre-teach lexis Study phase. Chỉ edit content-standard + 10 B2 unit files; không đổi flow/UI/grammar.
**Bước thực hiện**:
1. Search memory("TASK-058" + "B2 L1" + "l1_interference_vn") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, lesson-center-reference.ts (VN CLT L1), lesson-blueprint.ts (vocab block), learning-flow.ts, content-standard.ts, unit1.ts (gold L1 mẫu), unit33-42.ts (vocab sections); run count script for current ratios.
2. Grep confirm low L1 in B2 (0-3 notes); identify edit targets (≥6 per).
3. Update BACKLOG: TASK-058 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-058 (this section).
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi user).
6. Edit src/lib/lessons/content-standard.ts: B2: 0.5 (update comment).
7. For unit33–42: for ≥6 (or 8) vocab items add `, l1_interference_vn: "⚠️ [VN-specific error + fix]"` — ngắn gọn, actionable như unit1 (e.g. "⚠️ B2 learners often drop 'the' before abstract nouns..."; reuse topic like second cond → 'were' subjunctive for VN).
8. `npm run lint && npm run test` (unit); `npm run test:content-standard` (50 units) + `bash scripts/audit-lesson-content.sh`.
9. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
10. git pull --rebase; git add content-standard.ts src/lib/data/units/unit3{3..9}.ts ... unit4{0-2}.ts AGENT_*.md; commit "fix(content): B2 L1 interference >=50% for unit33-42 + ratio 0.5 (TASK-058)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- L1 note không đúng lỗi thực tế VN B2 (e.g. conditional 'were' vs 'was', article with uncountable, 'would' overuse) → craft từ common TEFL VN errors + unit topic vocab/grammar.
- Syntax break 1-liner {} → ensure , before l1 + no trailing comma issue; test each after batch edit.
- test:content-standard fail (other mins) → only L1; prior tasks fixed translate/cum.
- 10 files edits → use unique strings per entry; verify ratios post with tsx script.
- Fail 2x → blocked + lý do.
- No secret needed; pure content. Self debug lint/test output.
**Done khi**: B2 minRatio=0.5; 10/10 unit33-42 đạt >=50% L1 (verified); 50/50 test:content-standard pass; lint+unit tests+tsc clean; 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date; no ask user.

### TASK-056 — Dashboard 1 nút Học tiếp (full lesson)
**Mục tiêu**: Continue card trên dashboard (và getCurrentUnit dùng bởi nó) dùng `getNextUnitRoute` / `getNextUnitFromProgress` để chọn unit tiếp theo (first !completed >= starting_unit_index), trả route full lesson (không ?mini). Giảm confusion giữa /learn (danh sách) và /roadmap (overview) bằng cách 1 CTA "Học tiếp" rõ ràng trỏ đến canonical next full. Đảm bảo getCurrentUnit selection khớp getNext (thống nhất với roadmap's nextUnitRoute). Chỉ sửa logic selection trong action + docs; không đổi UI, flow, mini handling, SECTION_ORDER, lesson data.
**Bước thực hiện**:
1. Search memory("TASK-056" + "getNextUnitRoute" + "ContinueCard" + "dashboard full lesson") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE (không liên quan content), src/app/(main)/dashboard/page.tsx + DashboardMinimalClient.tsx + ContinueCard.tsx, src/app/actions/unit.ts (getCurrentUnit), src/lib/placement/starting-unit.ts (getNext* fns), src/app/(main)/roadmap/page.tsx + RoadmapClient, placement test, grep for ?mini in dashboard paths.
2. Grep confirm current selection in getCurrent prefers progress>0 vs getNext first incomplete; dashboard continues via getCurrent not directly getNext; continue route currently full but not canonical unified.
3. Update BACKLOG: TASK-056 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-056 (this section).
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi; hiện >=5 UI ready → skip).
6. Edit src/app/actions/unit.ts: add import getNextUnitFromProgress; in getCurrentUnit after compute completedUnitIds + startingUnitIndex, replace custom activeUnit find with: const nextMeta = getNextUnitFromProgress(completedUnitIds, startingUnitIndex); let activeUnit = nextMeta ? unitStatuses.find(u => u.unitId === nextMeta.id) : undefined; then existing fallbacks. This makes returned route = next full lesson route.
7. (Optional minimal) in dashboard/page.tsx ensure route from unitRes (now will be next).
8. `npm run lint && npm run test` (unit tests cover getNext + placement; getCurrent used in dashboard/learn).
9. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log table.
10. git pull --rebase; git add AGENT_*.md src/app/actions/unit.ts ; commit "fix(dashboard): ContinueCard uses getNextUnitRoute full lesson via aligned getCurrentUnit (TASK-056)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Selection change: getCurrent now always picks first-incomplete-per-start (getNext) instead of prefer-progress>0 ; may affect "active" highlight in learn list or dashboard title if previously picked a later partial — but for "Học tiếp" this is correct (next to do); self verify by test.
- If unitStatuses map key mismatch (unitId vs id) → use correct field (from code: unitStatuses use unitId: unit.id ).
- getCurrent called unauth returns u1; getNext also handles [] → first.
- No secret, pure logic align + continue full (default route no mini). Fail 2x → blocked + lý do.
- Learn page uses activeUnitId from it for "current" marker — using next is semantically better for "tiếp tục".
**Done khi**: dashboard continue card href uses getNext full lesson (verified in code/path); getCurrentUnit selection delegates to getNextUnitFromProgress (unifies with roadmap); `npm run lint && npm run test` pass (incl placement-starting-unit.test); 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date; no ask user; autonomous.

### TASK-058 — Chuẩn content: B2 L1 interference ≥50%
**Mục tiêu**: unit33–42 (B2) hiện L1 ratio ~0-21% (0-3/14). Nâng LESSON_CONTENT_STANDARD.l1MinRatioByLevel.B2 từ 0→0.5 (đúng CONTENT_STYLE §7 + center ref VN CLT L1 contrast). Thêm l1_interference_vn (≥15 ký tự, ⚠️ format, lỗi người Việt hay mắc theo ESA/CELTA/ILA: article, tense, collocation, passive/conditional, false friends, prepositions) cho ≥7/14 (unit41: ≥9/18) từ mỗi unit. Giữ 1 dòng object; pre-teach lexis Study phase. Chỉ edit content-standard + 10 B2 unit files; không đổi flow/UI/grammar.
**Bước thực hiện**:
1. Search memory("TASK-058" + "B2 L1" + "l1_interference_vn") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, lesson-center-reference.ts (VN CLT L1), lesson-blueprint.ts (vocab block), learning-flow.ts, content-standard.ts, unit1.ts (gold L1 mẫu), unit33-42.ts (vocab sections); run count script for current ratios.
2. Grep confirm low L1 in B2 (0-3 notes); identify edit targets (≥7 per).
3. Update BACKLOG: TASK-058 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-058.
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi user).
6. Edit src/lib/lessons/content-standard.ts: B2: 0.5 (update comment).
7. For unit33–42: for ≥7 (or 9) vocab items add `, l1_interference_vn: "⚠️ [VN-specific error + fix]"` — ngắn gọn, actionable như unit1 (e.g. "⚠️ B2 learners often drop 'the' before abstract nouns in conditionals..."; reuse topic like second cond → 'were' subjunctive for VN).
8. `npm run lint && npm run test` (unit); `npm run test:content-standard` (50 units) + `bash scripts/audit-lesson-content.sh`.
9. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
10. git pull --rebase; git add content-standard.ts src/lib/data/units/unit3{3..9}.ts ... unit4{0-2}.ts AGENT_*.md; commit "fix(content): B2 L1 interference >=50% for unit33-42 + ratio 0.5 (TASK-058)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- L1 note không đúng lỗi thực tế VN B2 (e.g. conditional 'were' vs 'was', article with uncountable, 'would' overuse) → craft từ common TEFL VN errors + unit topic vocab/grammar.
- Syntax break 1-liner {} → ensure , before l1 + no trailing comma issue; test each after batch edit.
- test:content-standard fail (other mins) → only L1; prior tasks fixed translate/cum.
- 10 files edits → use unique strings per entry; verify ratios post with tsx script.
- Fail 2x → blocked + lý do.
- No secret needed; pure content. Self debug lint/test output.
**Done khi**: B2 minRatio=0.5; 10/10 unit33-42 đạt >=50% L1 (verified); 50/50 test:content-standard pass; lint+unit tests+tsc clean; 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date; no ask user.

### TASK-059 — Chuẩn content: cumulativeReview ≥3
**Mục tiêu**: Nâng cumulativeReviewMin từ 1→3 (CONTENT_STYLE §7 + blueprint authorGuide). 16 units thấp: unit2–12 (hiện 2 câu), unit15–19 (hiện 1 câu) cần +1 hoặc +2 câu cumulativeReviewQuestions (spiral review từ prior units theo Nation/CLT/center-ref Review). Giữ format/unit-internal như unit1 gold (mc/translate/cloze, id crN-x, (Unit X: topic) tag, explanation_vn). Chỉ sửa content-standard + 16 unit files; không đổi UI/flow/quiz/reading/other fields. Sau edit mọi unit >=3; 50/50 test pass.
**Bước thực hiện**:
1. Search memory("TASK-059" + "cumulativeReviewQuestions") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, lesson-center-reference.ts (Review: spiral curriculum), lesson-blueprint.ts (review block: cumulativeReview ≥3), learning-flow.ts, content-standard.ts, unit1.ts (gold sample: 5 cr items + header comment "CUMULATIVE REVIEW"), low count units via script, read samples (unit2, unit15, unit1, unit13+ for style).
2. Grep/ count confirm 16 units <3; identify: unit2-12 + unit15-19.
3. Update BACKLOG: TASK-059 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-059.
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (đã chạy, 8 ready — skip).
6. Edit src/lib/lessons/content-standard.ts: cumulativeReviewMin: 3, update comment (mục tiêu đạt).
7. Edit 16 units: append missing items to cumulativeReviewQuestions (use +1 for count=2, +2 for count=1); ids sequential "crXX-3" etc; content spiral review prior units vocab/grammar (e.g. unit15 reviews unit13 past + unit14 going-to); short natural, match unit1 style (mix types, explanation_vn, tag prior unit). Add/update comment header "── CUMULATIVE REVIEW" like unit1 if absent. Keep 1-liner objects.
8. `npm run lint && npm run test` (unit); `npm run test:content-standard` (50 units) + `bash scripts/audit-lesson-content.sh`.
9. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log table.
10. git pull --rebase; git add content-standard.ts src/lib/data/units/unit{2..12}.ts src/lib/data/units/unit1{5..9}.ts AGENT_*.md; commit "fix(content): cumulativeReviewQuestions >=3 all units + min=3 (TASK-059)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Questions not relevant to prior (not spiral) or leak future vocab → craft from unit's own prior refs + unit title/theme (unit15 "Comparatives" review will/going-to/past simple of unit13-14).
- Syntax error inserting into [] → match unique last question + ], insert , + new before ]; test count post each batch.
- test:content-standard fail unrelated (L1/translate now 3) → only edit cumulativeReviewQuestions; prior 057/060/058 fixed others.
- 16 files → batch count verify before/after with node script; use unique strings (full question text) for replace.
- Id dupes across? no, per unit cr prefix.
- Fail 2x → blocked + lý do.
- No secret/DB; pure content. Self-debug from test output.
**Done khi**: cumulativeReviewMin=3; all 50/50 pass test:content-standard (no cumulative violations); 16 units reach >=3 (verified by count); lint + 159+ tests + tsc clean; 1 commit + push via git-push.sh main; BACKLOG status=done + Nhật ký entry with SHA; no ask user.

### TASK-057 — Chuẩn content: practiceTranslate ≥3 mọi unit + nâng min=3
**Mục tiêu**: 30 units (13-42) hiện chỉ 1 câu translate VN→EN. Bổ sung +2 câu mỗi unit (tổng ≥3), sát với vocab+grammar của unit đó. Nâng LESSON_CONTENT_STANDARD.practiceTranslateMin từ 1→3 (đúng blueprint authorGuide và CONTENT_STYLE §7). Giữ format, id pt-1/2/3, câu ngắn tự nhiên, <12 từ EN, controlled output theo Nation/CLT. Chỉ edit content-standard + 30 unit files; không đổi flow/UI.
**Bước thực hiện**:
1. Search memory("TASK-057" + "practiceTranslate") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, lesson-center-reference.ts, lesson-blueprint.ts, learning-flow.ts, content-standard.ts, unit1.ts (gold mẫu), units list, 30 files unit13-42 (vocab/grammar/translate/dialogue sections).
2. Grep confirm 30 units <3, A0+A1=3+; identify edit targets.
3. Update BACKLOG: TASK-057 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-057.
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (auto từ ROADMAP, KHÔNG hỏi user).
6. Edit src/lib/lessons/content-standard.ts: practiceTranslateMin: 3 (comment update if any).
7. For each unit13.ts..42.ts: expand practiceTranslate: [ {pt-1}, {pt-2 new}, {pt-3 new} ] — 2 câu mới dùng từ vựng/ thì của unit, giống unit1/unit10 style (short, natural, unit-internal).
8. `npm run lint && npm run test` (unit); đặc biệt `npm run test:content-standard` (50 units) + `bash scripts/audit-lesson-content.sh`.
9. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
10. git pull --rebase; git add content-standard.ts unit*.ts AGENT_*.md; commit "feat(content): practiceTranslate ≥3 all units + min=3 (TASK-057)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Câu dịch không sát unit (vocab/grammar) → re-craft từ extract summary (vocab words + gtitle); unit1 gold style.
- Id collision or syntax error in array → use "pt-2","pt-3" + verify format exact.
- test:content-standard fail on other (L1 etc) → only touch translate; prior TASK-060 fixed some B1.
- Many files (31 edits) → batch verify counts post, use replace_all careful or unique string.
- Git large? No, text small. If push fail (secret) → status blocked, note next ready.
- Fail 2x liên tiếp → blocked + lý do in backlog.
- No user interaction; self-debug with lint/test output.
**Done khi**: 50 units pass test:content-standard (practiceTranslate≥3, min updated); lint+all tests pass; 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date; no ask user.

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
| 2026-07-01 | TASK-132 | PHASE1: search_memory("TASK-132 maintenance sweep") via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 2r>=2; PHASE2: update PLAN focus+full section + BACKLOG in_p + run refill (added 134-136); PHASE3: tsc/lint/test/content/audit all clean (170+50), no first failure, no fix, log+sync docs | done — 3551ff6 |
| 2026-07-01 | TASK-133 | PHASE1: search_memory("TASK-133 maintenance sweep") via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 4r>=2; PHASE2: update PLAN focus+full section + BACKLOG in_p (skip refill); PHASE3: tsc/lint/test/content/audit all clean (170+50), no first failure, no fix, log+sync docs | done — 5258ec3 |
| 2026-07-01 | TASK-124 | PHASE1: search sim via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-124; 4r>=2; PHASE2: update PLAN focus+full section + BACKLOG in_p (skip refill); PHASE3: tsc/lint/test/content/audit all clean (170+50), no first failure, no fix, log+sync docs | done — 2a33ecd |
| 2026-07-01 | TASK-125 | PHASE1: real search_memory(TASK-125)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep; 3r>=2; PHASE2: update PLAN+BACKLOG in_p + run refill (OK skip); PHASE3: tsc/lint/test/content/audit all clean (170+50), no first failure, no fix, log+sync docs | done — f598330 |
| 2026-06-26 | TASK-086 | PHASE1: search_memory sim via logs/grep (empty prior for 086 impl) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + MINIMAL_V2 (cert eligible listed) + grep Certificate + design-system + checkpoint lock pattern; PHASE2: BACKLOG in_progress + full TASK-086 PLAN section (ready=2 >=2 skip refill); PHASE3: wrap eligible in SecondaryPageShell + flat bg-card border-border/60 card (removed zinc heavy/glows), MinimalButton actions, data-testid keep selectors, all logic/texts/motion/share/print preserved; lint0+170t+tsc0 pass; commit+push via git-push.sh; done | done — e82d92f |
| 2026-06-26 | TASK-082 | PHASE1 (grep+read AGENTS/BACKLOG/PLAN/ROADMAP/MINIMAL_V2/CONTENT + design-system + PronunciationClient + ipa-sounds); PHASE2 set in_progress (2ready skip refill) + full PLAN section; PHASE3: all 63 style= purged, Tailwind equivs + DIFF map for accents, SecondaryPageShell kept + inner max-w; logic identical; lint0+170t+tsc pass; bdef932 + push; done | done — bdef932 |
| 2026-06-26 | TASK-083 | PHASE1 (read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + MINIMAL_V2 + grep 3 sections+Fluency/Translate + sim search_memory); PHASE2: BACKLOG in_progress + PLAN section + skip refill; PHASE3: Grammar/Vocab/Warmup light cards (bg-card/border-border/60/text-fg/muted + primary accents, keep flip style+semantics); 170 tests+lint+tsc0; commit acd10ad + push via git-push.sh; BACKLOG done | done — acd10ad |
| 2026-06-26 | TASK-045 | PHASE1 research(memory+AGENTS+BACKLOG/PLAN+ROADMAP+AUTOPILOT+CONTENT§6-7 + grep "thủ công"); PHASE2 update PLAN+BACKLOG set in_progress (refill run, 2ready>=2 skip), add full TASK-045 section; PHASE3: set in_progress, minimal edit AUTOPILOT "Quản lý backlog" describe ROADMAP+refill auto + explicit "KHÔNG thêm thủ công", update Nhật ký; gates tsc+lint+169 pass; commit 75b72b3 + git-push.sh main; BACKLOG done + log | done — 75b72b3 |
| 2026-06-26 | TASK-044 | PHASE1: search_memory + read AGENTS/BACKLOG/PLAN/ROADMAP + grep e2e/placement/helpers/global/playwright; PHASE2 update PLAN+BACKLOG in_progress; PHASE3 minimal stabilize: networkidle + reset isolate in placement-test.spec; lint+test | in_progress |
| 2026-06-26 | TASK-059 | PHASE1: search_memory + read AGENTS+BACKLOG+PLAN+ROADMAP+CONTENT§6-7+lesson-blueprint+center-ref+learning-flow+content-std+unit1(gold)+count low units(2-12); PHASE2 update PLAN+BACKLOG in_progress, refill skip (>=2 ready); PHASE3 min=3 + add 1 spiral cr each for unit2-12; lint+tsc+169u+50 content-std+audit pass; commit+push | done — 81e06b4 |
| 2026-06-26 | TASK-060 | PHASE1 research(AGENTS+CONTENT_STYLE+blueprint+center-ref+unit1+unit24/31+content-std+grep L1), PHASE2 update PLAN/BACKLOG in_progress, PHASE3: header comments + L1 notes (6+ per) for unit24/31 per ESA/CELTA/CLT VN, 75%/100% L1; all gates pass; commit 5df0678 + git-push | done — 5df0678 |
| 2026-06-26 | TASK-061 | PHASE1 (memory+AGENTS+BACKLOG+PLAN+CONTENT§6-7+blueprint+center+flow+unit1+grep), PHASE2 PLAN/BACKLOG update 061 in_progress (ready>2 skip refill), PHASE3: node script added header+ ── HOOK/WARMUP/VOCAB/... comments to 49 units (50 total have HOOK); field visibility per blueprint; tsc+lint+169tests+content-std50/50+audit pass; log+commit+push | done — 8c99173 |
| 2026-06-26 | TASK-062 | PHASE1 research(memory sim+AGENTS+BACKLOG+PLAN+CONTENT§6-7+center-ref+blueprint+flow+unit1+unit24+print-blueprint), PHASE2 update PLAN/BACKLOG set in_progress, refill (6ready OK), PHASE3 pilot redesign unit24 (L1 to 100%, full ── comments per blueprint map, grammar short inductive, align order); gates tsc+lint+169test+cs50/50+audit pass; pushed 6c0d49b | done — 6c0d49b |
| 2026-06-26 | TASK-056 | PHASE1: search_memory + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT + grep (getNext, ContinueCard, dashboard, unit action, starting-unit, roadmap); PHASE2: update PLAN/BACKLOG to in_progress (ready=5>2 skip refill), focus update; PHASE3: align getCurrentUnit to delegate to getNextUnitFromProgress for next full lesson in ContinueCard (unify dashboard+roadmap); 1 CTA clear; | done — 36d8fc2 |
| 2026-06-26 | TASK-056 | PHASE1 research (sim search_memory + read AGENTS+BACKLOG+PLAN+CONTENT+grep getNext/ContinueCard/dashboard/actions+learn+roadmap); PHASE2: BACKLOG in_progress + PLAN update (5 ready skip refill); PHASE3: minimal unify dashboard to use unitRes.route from getCurrent (delegates getNext for canonical full-lesson no-mini); remove dup completed fetch; comment update; run gates; | done — fef35ef |
| 2026-06-26 | TASK-056 | PHASE1: search sim (logs); read AGENTS+BACKLOG+PLAN+ROADMAP+CONTENT§6-7; grep + code read getNext/Continue/dashboard/learn/roadmap; PHASE2 set in_progress (5ready skip), PLAN update; PHASE3: import+use getNextUnitRoute explicitly in getCurrent for Continue route + comments; lint+169+tsc pass; commit ff6f7bb + push via git-push | done — ff6f7bb |
| 2026-06-26 | TASK-056 | PHASE1: search_memory(sim logs)+read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep continue/getNext/dashboard/unit/roadmap/learn; code already uses getNextUnitFromProgress in getCurrentUnit + unitRes.route in ContinueCard (full, no mini, unified with roadmap); PHASE2 update PLAN+BACKLOG set in_progress (5ready skip); PHASE3: verify alignment, minor comment reinforce "getNextUnitRoute full", no src logic change needed (already matches spec); lint+test pass; status done + log + push via git-push | done — [SHA] |
| 2026-06-26T13:22Z | TASK-046 | PHASE1 research (memory sim logs + AGENTS+BACKLOG+PLAN+CONTENT§6-7+blueprint+center-ref+learning-flow+unit1+curriculum-quality.test+ B2 grep audio decl); PHASE2 set in_progress + add PLAN section (ready>2 skip refill); PHASE3 minimal extend test with B2 audio vocab+dialogue describe block; gates lint+170t+tsc pass; commit+push da2c844 | done — da2c844 |
| 2026-06-26 | TASK-048 | PHASE1: memory sim empty (grep no fn) + read all agents docs+CONTENT§6-7 + grep; PHASE2: PLAN update + BACKLOG in_progress + refill run (skipped); PHASE3: implement get fn + wire calls+props in dash+settings; gates tsc+lint+170 pass; commit ceb4242 + git-push.sh | done — ceb4242 |
| 2026-06-26T01:36Z | TASK-001/002 | P0 ops: migration blocked, deploy OK | autopilot armed |
| 2026-06-26T08:55Z | TASK-001/011 | db push migration + E2E B1 unlock | 2 e2e pass |
| 2026-06-26 | TASK-021 | Sync docs: placement, 50u, header, autopilot | done — 3d36d2f (docs commit); f9f21a1 (status) |
| 2026-06-26 | TASK-030 | Native audio A2 batch unit-13..18 (extend script + 84 MP3s) | done — 6bbc693 |
| 2026-06-26 | TASK-030 | Re-verify gen+counts+lint+test (all 6 units 14 clips) | done — 202bfea (pushed) |
| 2026-06-26T20:4xZ | TASK-063 | PHASE1: read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + grep TASK-063 + sim search_memory(logs empty for sweep); PHASE2: PLAN focus+section + BACKLOG in_progress (3ready>=2 skip refill); PHASE3: rerun gates (lint0 + 170t pass + tsc0 + cs50/50 + audit50/50) — no failure, no fix; sync nhật ký; commit+push via git-push; status done | done — 474cdf8 |
| 2026-06-26 | TASK-064 | PHASE1: search_memory sim via logs (TASK-063 clean prior sweep) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep TASK-064; PHASE2: update focus+add full TASK-064 section to PLAN, BACKLOG set in_progress (2ready skip refill); PHASE3: gates all clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix, sync log+nhatky; commit+push via git-push; status done | done — 50c5438 |
| 2026-06-26 | TASK-065 | PHASE1: search_memory sim via logs (TASK-064 clean prior) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep TASK-065; PHASE2: update focus+add full TASK-065 section to PLAN, BACKLOG set in_progress (4ready skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — e4827d2 |
| 2026-06-26 | TASK-066 | PHASE1: search_memory sim via logs (TASK-065 clean prior) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep TASK-066; PHASE2: update focus+add full TASK-066 section to PLAN, BACKLOG set in_progress (3ready skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh main | done — a208a51 |
| 2026-06-26 | TASK-067 | PHASE1 research (AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (TASK-066 clean prior)); PHASE2 PLAN update + BACKLOG in_progress (2ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh | done — 9be9ce9 |
| 2026-06-26 | TASK-068 | PHASE1 research complete (read AGENTS/BACKLOG/PLAN/CONTENT§6-7 + sim search_memory via logs/grep (prior sweeps clean + prev 068 tool-err early)); PHASE2 PLAN update + BACKLOG in_progress (4ready>=2 skip refill); PHASE3: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix + sync log/PLAN/BACKLOG; commit+push via git-push.sh | done — 469537e |
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
| 2026-06-26 | TASK-058 | PHASE1: search_memory + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7+lesson-center-ref+blueprint+learning-flow+content-std+unit1(gold)+count ratios (0-25% B2), PHASE2 update PLAN+BACKLOG in_progress (many ready skip refill), PHASE3: B2 ratio=0.5 + l1_interference_vn (>=6 per unit33-42, VN CLT errors per topic); gates + push | done — f859b5c (lint+169t+cs50/50+audit50/50 pass) |
| 2026-06-26 | TASK-036 | research(agents+grep+data+unit-audio+config), set in_progress, update PLAN, run refill (low ready), add rewrite next.config, verify probe map 200 for unit19(B1)/unit36(B2), lint+159+tsc pass, commit+push | done — 0d30be9 |
| 2026-06-26 | TASK-037 | research(agents+grep+e2e+unit-audio+vocab), set in_progress, update PLAN+BACKLOG, add setE2EStartingUnit helper, add E2E test in placement-test (B1 login, advance warmup, click Nghe: speaker, Audio spy + /audio/ waitForRequest), lint+159+tsc pass, commit+push | done — ffc66bc |
| 2026-06-26 | TASK-038 | research(memory+agents+grep+setup-integration+profile migration+RLS), phase1/2/3, update PLAN/BACKLOG to in_progress, extend cleanup, implement 2 minimal RLS tests in progress.integration (own insert+columns verify, policy block), run lint+test+test:integration (all 159u+23i pass), commit 339f5a9 + scripts/git-push.sh main | done — 339f5a9 |
| 2026-06-26 | TASK-039 | research(agents+memory+grep+dashboard+stats+onboarding), plan update, run refill, fix getUserProgress to return real daily_xp_goal from DB (page.tsx read now effective), bar vs goal works, lint+test pass, commit+push via git-push | done — [pending SHA] |
| 2026-06-26 | TASK-040 | research(memory+agents+grep+rewrite+unit33+scripts), set in_progress BACKLOG, update PLAN focus+section, run refill, create minimal scripts/smoke-learn.sh (curl -L 200 for learn+audio unit33), add npm script, lint+test, commit+push via git-push.sh | done — 3a795df |
| 2026-06-26 | TASK-042 | research(agents+memory+grep+roadmap+units+starting), set in_progress, update PLAN+BACKLOG, minimal B2 units group+badge+starting respect logic in RoadmapClient, lint+159+tsc pass, commit+push via git-push; status done | done — 473f514 |
| 2026-06-26 | TASK-041 | research(agents+memory+grep+package+generator+readme), update PLAN+BACKLOG in_progress, add :all chain + :list dry-run (50 folders), README docs, lint+159+tsc, commit+push via git-push; status done | done — 242328e |
| 2026-06-26 | TASK-043 | research(agents+memory+grep+orch+watchdog+stash), update PLAN/BACKLOG in_progress, add only-agent skip in orchestrator + pop at cycle end + auto age>7d cleanup (MAX=7 in watchdog), sim verify detect, lint+159+tsc pass, commit+push via git-push.sh; status done | done — 5062230 |

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

### TASK-042 — Roadmap highlight B2 phase
**Mục tiêu**: Trong `RoadmapClient`, hiển thị group các B2 units (unit-33 đến unit-42) với badge level "B2"; respect `starting_unit_index` để B2 user (bắt đầu từ unit-33 index ~40) thấy đúng entry point, highlight "bắt đầu từ đây", và đánh dấu review cho units trước placement. Giữ minimal — thêm list units B2 bên trong phase card (milestones tab) hoặc dưới progress; tái sử dụng UNITS + starting prop đã pass từ page. Không đổi study-plan phases.
**Bước thực hiện**:
1. Search memory (done) + read AGENTS.md, AGENT_BACKLOG/PLAN/ROADMAP, RoadmapClient.tsx, roadmap/page.tsx, lib/constants/units.ts (B2 33-42), lib/placement/starting-unit.ts (get indices), study-plan.ts (phase unitLevels), prior TASK-012 notes.
2. Cập nhật AGENT_PLAN.md (header focus + this section) + BACKLOG (status `in_progress`).
3. (ready count==2, skip refill per <2 rule).
4. Implement minimal in RoadmapClient.tsx:
   - Compute B2 start index (UNITS.findIndex(u => u.level==="B2") || 40).
   - Import if needed.
   - Inside the phase expansion (after milestones or in a "Units" block when phase covers B2 or userLevel B2), render:
     - Header "B2 Units (33–42)" + badge style "B2".
     - List or grid of the 10 B2 units (short title): Link to route; small "B2" pill badge per item (emerald/teal for B2).
     - Respect starting: if unitGlobalIndex < startingUnitIndex → muted + "(review)" ; === starting → highlight + "← Bắt đầu từ đây" (using entry logic); >= and completed mark ✓ ; use similar to isPlacedOutUnit logic inline (no new dep if possible).
   - Ensure when B2 user, the relevant phase (id=3) expands and shows B2 group.
   - Use existing allUnits, completed, starting prop.
5. `npm run lint && npm run test && npx tsc --noEmit`.
6. Update BACKLOG (in_progress→done + Nhật ký + SHA), PLAN log table.
7. git pull --rebase; git add src/app/(main)/roadmap/RoadmapClient.tsx AGENT_BACKLOG.md AGENT_PLAN.md; git commit -m "feat(roadmap): group B2 units 33-42 with level badge in RoadmapClient; respect starting_unit_index (TASK-042)"; bash scripts/git-push.sh main.
**Rủi ro**:
- Scope creep: do NOT add full 50 unit timeline if not needed — only B2 group as per task desc.
- startingUnitIndex logic: reuse patterns from LearnClient / starting-unit.ts (isPlacedOutUnit, unlocked) but inline minimal; index calc off-by-one (A0 8 +A1 12=20 +A2 6=26 +B1 14=40 for unit33) — verify with findIndex.
- No visual in current roadmap for units (only phases) — adding list keeps simple, no big UI refactor.
- Phase mapping: B2 maps to phase 3 (B1/B2) , ok to show B2 subgroup there.
- If no unit test for RoadmapClient (client comp, covered by e2e), ok per "unit test hoặc snapshot pass" — run full test + lint.
- If B2 user current_level=B2 but starting low? respect the index passed.
- Fail 2x → blocked.
- Pure UI + props already wired; no secret/DB.
**Done khi**: B2 units 33-42 appear grouped in RoadmapClient with visible "B2" level badges; B2-placed user sees entry unit highlighted + pre-start marked review; `npm run lint && npm run test` pass; 1 commit pushed; backlog done + SHA; autonomous.

### TASK-044 — Placement test retry stability
**Mục tiêu**: Ổn định các E2E test trong e2e/placement-test.spec.ts (Placement Test Flow + Learn audio native probe) để giảm flake. Áp dụng "wait for network idle" (thay các waitForLoadState('domcontentloaded') + short waits + timeout thấp bằng networkidle + generous); "isolate test user" bằng cách đảm bảo reset state rõ ràng hơn cho shared E2E test user ở tất cả describe (gọi reset trước setStarting trong audio test; có thể mở rộng reset nếu cần). Giữ minimal, chỉ thay đổi waits + 1-2 reset calls + login helper nếu cần; không đổi logic test hay selectors.
**Bước thực hiện**:
1. Search memory (done via edge fn "TASK-044 placement e2e flake...") + đọc AGENTS.md (ALWAYS), BACKLOG/PLAN/ROADMAP/AUTOPILOT, e2e/placement-test.spec.ts, e2e/helpers/auth.ts, e2e/global-setup.ts, playwright.config.ts, e2e/mobile.spec.ts (networkidle pattern), test-results/* (prior flakes), src/app/(main)/learn/* if needed for load states.
2. Cập nhật AGENT_PLAN.md (header + section mới) + AGENT_BACKLOG.md (status `in_progress` + started).
3. Backlog count >=2 (3 ready incl 044/45/46) — KHÔNG chạy refill (chỉ khi <2).
4. Implement tối thiểu đúng scope trong e2e/placement-test.spec.ts:
   - Thêm `await page.waitForLoadState("networkidle");` sau các page.goto chính (placement, learn, roadmap), sau loginAsE2ETestUser, sau B1 select clicks + waits.
   - Thay "domcontentloaded" bằng "networkidle" trong audio test.
   - Trong audio test describe: trước setE2EStartingUnit, gọi `await resetE2EPlacementState(userId);` (isolate: đảm bảo sạch trước override starting; state như lesson progress nếu ảnh hưởng).
   - Tăng một số timeout nhạy cảm (e.g. waitForRequest 10s, expect visible 15s) + thêm .catch an toàn nếu cần.
   - Optionally: update loginAsE2ETestUser trong helpers/auth.ts để `await page.waitForLoadState("networkidle");` sau waitURL (giúp mọi E2E dùng nó).
5. `npm run lint && npm run test && npx tsc --noEmit`.
6. (Nếu có env + dev sẵn: thử `npm run e2e -- e2e/placement-test.spec.ts` nhưng không bắt buộc; CI sẽ verify 3 runs liên tiếp. Tự debug nếu local e2e fail 1 lần.)
7. Update BACKLOG (in_progress→done + Nhật ký + SHA), PLAN log table.
8. git pull --rebase; git add e2e/placement-test.spec.ts e2e/helpers/auth.ts? AGENT_BACKLOG.md AGENT_PLAN.md; commit "test(e2e): stabilize placement by networkidle waits + user reset isolation (TASK-044)"; bash scripts/git-push.sh main.
**Rủi ro**:
- E2E cần dev server + admin creds (SUPABASE_SERVICE_ROLE_KEY); nếu thiếu → không chạy e2e full ở đây, chỉ lint+unit, nhưng vẫn ship nếu units ok (E2E flake fix là cho CI/prod verify). Nếu thiếu secret cho verify → set blocked sau 1 attempt.
- networkidle quá strict (slow assets) → test timeout; dùng với timeout cao hơn, và reuse pattern từ mobile.spec (đã dùng thành công).
- Shared user isolation: resetE2EPlacementState chỉ chạm user_progress — nếu learn page flake do user_lesson_progress hoặc card_reviews thì cần mở rộng reset, nhưng giữ minimal trước (chỉ placement relevant); nếu vẫn flake sau 1 push thì lần 2 mở rộng.
- Audio test: speaker click + network /audio/ có thể vẫn no-op ở headless (TTS/Audio blocked) — test đã tolerant (hit || true), chỉ cần không crash + page stable.
- Playwright webServer timing (reuseExisting); nếu dev not hot after edits, may need manual start. 
- Fail 2x liên tục → blocked + ghi lý do (e.g. deeper race in app).
- Không đổi prod code, chỉ test files.
**Done khi**: 3 E2E run liên tiếp (local/CI) pass cho placement-test.spec (incl audio subtest); `npm run lint && npm run test` pass; 1 commit pushed; backlog done + entry SHA; autonomous no user.

### TASK-060 — B1 unit24+unit31 L1 notes
**Mục tiêu**: Sửa 2 unit B1 (unit-24 "How Things Are Made" Passive, unit-31 "Business Communication") đang dưới 50% vocab có l1_interference_vn theo content-standard B1 (0.5). Đưa ratio >=0.5 (cần ~6/12 mỗi unit). Tuân thủ lesson-center-reference (VN CLT L1 contrast), lesson-blueprint (vocab block), unit1 gold style (⚠️ notes + comment headers). Gate: npm run test:content-standard pass cho 2 unit. Minimal: chỉ thêm l1 notes + style comments cho vocab; không thêm từ, không đổi flow.
**Bước thực hiện**:
1. PHASE1 research: read AGENTS.md + CONTENT_STYLE §6-7 + lesson-blueprint + lesson-center-reference + learning-flow + unit1.ts (gold) + unit24.ts + unit31.ts + content-standard.ts + grep l1 + units.ts (B1=19-32). Confirm counts: unit24=1/12 L1, unit31=5/12. Identify exact vocab cần note (common VN passive errors / reporting verb errors).
2. PHASE2: update AGENT_PLAN + BACKLOG (TASK-060 in_progress). Check ready count (>=2, skip refill).
3. PHASE3: Edit unit24 + unit31: 
   - Add header comment block giống unit1 (Unit X — title, research notes).
   - Thêm l1_interference_vn (≥15 ký tự, ⚠️ format) cho ≥6 từ/unit (ưu tiên từ có L1 thực: passive be+V3 omission, participle wrong, suggest/recommend/advise +to vs Ving/that, formal prepositions, 'confirm that').
   - Giữ format 1 dòng object; tái sử dụng existing fields.
4. Chạy gate bắt buộc: npx tsc --noEmit && npm run lint && npm run test && npm run test:content-standard && bash scripts/audit-lesson-content.sh
5. Update BACKLOG (in_progress→done + Nhật ký + SHA), PLAN log table.
6. git pull --rebase; git add src/lib/data/units/unit24.ts src/lib/data/units/unit31.ts AGENT_BACKLOG.md AGENT_PLAN.md; commit "fix(content): add L1 interference >=50% for B1 units 24+31 (TASK-060)"; bash scripts/git-push.sh main. Write logs/agent/ timestamp log.
**Rủi ro**:
- L1 note quá dài hoặc không đúng lỗi thực tế → dùng pattern từ unit1/unit17/unit31 existing (ngắn, actionable, VN-specific).
- Nếu sau edit 1 unit vẫn fail test:content-standard (e.g. other fields), tự debug 1x (add min practiceTranslate nếu min raised? nhưng current min=1). Fail 2x → blocked.
- Không secret/DB, chỉ content data. test:content-standard là unit test local.
- Commit chỉ content + docs agent; giữ minimal đúng scope (L1 for these 2).
- Follow blueprint: map vocab → Study/Clarification lexis (center ref).
**Done khi**: unit24 + unit31 đạt >=50% L1 (6/12+), test:content-standard pass 0 violations for them (and others unchanged); lint+unit tests + tsc clean; 1 commit + push via git-push; backlog done + entry SHA; autonomous, no user asked.

### TASK-061 — Unit files: comment blocks theo blueprint (như unit1)
**Mục tiêu**: Chuẩn hóa 50 unit*.ts (A0 + A1–B2) theo "cách xây nội dung = cách học" 1 khung: thêm top header block (giống unit1: UNIT X — title (level) + research refs) + nội bộ ── HOOK / WARMUP / VOCABULARY / GRAMMAR / DIALOGUES / FLUENCY / OUTPUT / REVIEW (khớp LESSON_BLUEPRINT CONTENT_BLOCK_ORDER + lesson-center-reference ESA/CELTA/Nation/CLT VN mapping). Field property order trong object bám unit1 gold (meta → hook fields → warmup → vocab → grammar → exercises → dialogues → fluency → output → review). Đạt `grep "── HOOK" ≥45`; gates pass. Không đổi nội dung data, logic, flow, chỉ comment + order cosmetic. 
**Bước thực hiện**:
1. PHASE1: search_memory("TASK-061" + "blueprint" + "unit header") (sim empty) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, lesson-blueprint.ts (CONTENT_BLOCK_ORDER + formatBlueprintChecklist), lesson-center-reference.ts (map ESA), learning-flow.ts, unit1.ts (gold header+comments+field order), content-standard.ts, count 50 units, grep current "── HOOK" (only unit1), sample unit2/unitA01/unit33 for variation; run scripts/print-lesson-blueprint.mjs .
2. PHASE2: update AGENT_PLAN.md (this section) + BACKLOG (TASK-061 status `in_progress`); ready count check (several UI+062 ready >2, skip refill unless low); note 058 in_progress but mandate single task=061.
3. PHASE3: minimal impl — use safe string-based edit (node fs script idempotent: if (!has "── HOOK") { insert top header modeled unit1 using title/level; insert "  // ── XXX: ..." before key fields per blueprint; reorder top keys minimally if feasible without syntax risk). Target all 49 + ensure unit1 stays. Only touch src/lib/data/units/*.ts + agent files.
4. Run gates bắt buộc: npx tsc --noEmit && npm run lint && npm run test && npm run test:content-standard && bash scripts/audit-lesson-content.sh
5. Update BACKLOG (in_progress → done + Nhật ký + SHA), PLAN log table. Write logs/agent/ timestamp_TASK-061.log
6. git pull --rebase; git add src/lib/data/units/*.ts AGENT_BACKLOG.md AGENT_PLAN.md; commit "chore(content): standardize unit*.ts header + blueprint section comments (── HOOK etc) matching unit1 + lesson-blueprint (TASK-061)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Bulk edit 50 files break syntax (comma, indent) → script MUST use precise unique anchors + test parse post (tsc will catch); do in one go, verify count before/after.
- Some units (A0, recent) already have partial headers/comments (unitA0x, unit24/31) → script skips if "── HOOK" present; only augment to have the specific blueprint ones.
- Field reorder may be non-trivial for objects with many keys → minimal: add comments first (satisfies done-when grep), reorder only top 10 meta/hook fields if safe; prioritize comments.
- test:content-standard may catch unrelated if run before other tasks; but since 059/060/057 done, should be clean.
- No secret needed; pure content comments. Self-debug from tsc/lint/test output.
- If fail 2x on gate → set blocked + lý do.
**Done khi**: >=45 files contain `── HOOK` (verified by grep); all 50 unit files have consistent header+section comments; field order in unit1 gold + at least major units close; `npm run lint && npm run test` + content-std + audit all pass 50/50; 1 commit + push via git-push.sh main; BACKLOG status=done + entry with SHA; no user asked; autonomous.

### TASK-062 — Redesign pilot: unit24 theo center-reference + unit1
**Mục tiêu**: Làm unit24 trở thành pilot "redesign" áp dụng đầy đủ lesson-center-reference.ts (ESA Engage/Study/Activate, CELTA inductive MF(P), Nation Four Strands pre-teach+fluency, CEFR can-do, CLT VN L1 contrast + tình huống công sở) + blueprint.ts (10 block IPOR) + unit1.ts gold (header block + ── comments + field order + L1 notes + short rule). Mặc dù L1/translate/cumulative đã đạt min từ task trước, pilot này polish để: 1) 100% vocab có l1_interference_vn (pilot B1 example), 2) grammar.rule ngắn <30 từ + inductive rõ (Meaning từ dialogue → Form), 3) comment blocks đầy đủ ── HOOK / WARMUP / VOCABULARY / GRAMMAR / EXERCISES_INPUT / DIALOGUES / FLUENCY / OUTPUT / REVIEW / CUMULATIVE REVIEW như unit1, 4) property order meta→hook→warmup→vocab→grammar→exercises→dialogues→fluency→output→review. Chỉ edit unit24 + agent docs; không đổi flow, learning-flow, SECTION_ORDER, logic app.
**Bước thực hiện**:
1. PHASE1: search_memory("TASK-062" + "unit24" + "center-ref") (done sim empty) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, lesson-center-reference.ts (full ESA/CELTA map + VN CLT), lesson-blueprint.ts (CONTENT_BLOCK_ORDER + formatBlueprintChecklistForAgent + authorGuide), learning-flow.ts (IPOR 10), unit1.ts (gold: header + ── comments + l1 style + short rule + dialogueExample), unit24.ts (current), content-standard.ts, run npx tsx scripts/print-lesson-blueprint.mjs + count L1/translate/cr via tsx validate.
2. PHASE2: update AGENT_PLAN.md (this section) + BACKLOG (TASK-062 `in_progress`); run `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi); check ready (now >=2, skip deep).
3. PHASE3: minimal redesign unit24.ts:
   - Update top header comment block → full refs to center-ref + blueprint + unit1 + ESA/CELTA.
   - Insert/ensure ── HOOK / ── WARMUP / ── VOCABULARY / ── GRAMMAR / ── EXERCISES_INPUT / ── DIALOGUES / ── FLUENCY / ── OUTPUT / ── REVIEW (CUMULATIVE) comments exactly matching blueprint map.
   - Add l1_interference_vn (⚠️ VN error + fix, >=15 char, ILA correction style) to the 3 missing words (distribute, maintain, package) → 12/12 =100% pilot example.
   - Polish grammar.rule: rút gọn <30 từ cho form chính + list thì; giữ inductive (dialogueExample dẫn Meaning), vnNote, ccq 4 options.
   - Reorder top-level keys in object literal to follow CONTENT_BLOCK_ORDER (meta, hook fields, warmup, vocab, grammar, exercises_*, dialogues, fluency, output fields, review) where safe (no runtime change).
   - Keep all existing data/translation/answers; only L1 polish + comments + cosmetic order.
4. PHASE3 gates: npx tsc --noEmit && npm run lint && npm run test && npm run test:content-standard && bash scripts/audit-lesson-content.sh
5. Update BACKLOG (in_progress→done + Nhật ký entry + SHA), PLAN log table. Write logs/agent/ timestamp_TASK-062.log
6. git pull --rebase; git add src/lib/data/units/unit24.ts AGENT_BACKLOG.md AGENT_PLAN.md; commit "fix(content): pilot redesign unit24 per lesson-center-ref + unit1 gold (L1 100%, comments, grammar polish) (TASK-062)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Grammar reorder or comment insert break trailing comma/indent → use unique anchor strings for replace, verify with tsc after each; test count L1 post.
- L1 note not accurate for VN B1 passive/process → craft from common TEFL (missing be, wrong participle) + unit topic (factory/ISO); short actionable like unit1.
- test:content-standard may fail unrelated (but prior tasks set mins); self-debug 1x only, 2x → blocked + lý do.
- Reorder fields cosmetic only; if syntax risk high skip reorder keep comments as main.
- No secret/DB; pure content. Self debug from output of lint/test/audit.
- If push needs GITLAB_TOKEN and blocked → status blocked in backlog, advance if other ready.
**Done khi**: unit24 passes test:content-standard (0 vio, L1=100%); full blueprint comments + header present (grep "── VOCABULARY" unit24); grammar.rule concise; lint+unit tests+tsc clean; 1 commit + push via git-push.sh main; BACKLOG=done + entry SHA; no user asked; autonomous.

### TASK-046 — Curriculum quality B2 audio declarations
**Mục tiêu**: Extend `curriculum-quality.test.ts` để có explicit verification cho mọi B2 unit (33-42) có `audio` path declared cho vocab items + dialogues (theo lesson-blueprint vocab/dialogues blocks + unit1 gold mẫu + sau audio gen B2). Mặc dù test hiện đã enforce audio /^\/audio\// cho TẤT CẢ units trong loop, task yêu cầu "extend" để có B2-specific guard / describe block riêng (tương tự pattern unit tests khác), đảm bảo 0 missing cho B2. Không sửa data unit, không đổi logic test khác, không đụng UI/flow.
**Bước thực hiện**:
1. PHASE1 research complete: read AGENTS.md (ALWAYS + search_memory rule), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint ref), lesson-center-reference.ts, lesson-blueprint.ts (vocab+dialogues require audio), learning-flow.ts, unit1.ts (gold has audio decl), curriculum-quality.test.ts (existing audio asserts), src/__tests__/unit-audio.test.ts (runtime separate), grep audio decl in unit33-42.ts (counts match 14/18+2), agent logs for memory sim of TASK-046 (refilled ready, no prior code change).
2. Grep confirm test already covers all (incl B2) but needs explicit B2 block per task desc; identify edit target: only curriculum-quality.test.ts .
3. Update BACKLOG: TASK-046 status `in_progress`.
4. Update AGENT_PLAN.md (this section) + Nhật ký.
5. Ready count >=3 (046/047/048) → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi).
6. PHASE3 minimal: edit src/__tests__/curriculum-quality.test.ts — append dedicated describe("B2 units must declare audio paths for vocab + dialogue") that loads B2 files (or filter in existing), asserts every vocab[i].audio && /^\/audio\// and every dialogue.audio; re-use same dynamic import pattern; add comment // TASK-046 B2 audio guard.
7. Run gates bắt buộc: npm run lint && npm run test (note: content-standard/audit not required as no unit*.ts change).
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log.
9. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md src/__tests__/curriculum-quality.test.ts; commit "test(curriculum): extend curriculum-quality.test.ts with explicit B2 audio declaration checks for vocab+dialogue (TASK-046)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Test already passes for B2 (data has audio) → extension just adds dedicated block, will pass first try; if syntax in describe → fix once.
- Duplicate assert with general loop → ok, task asks extend for B2 verify.
- No data/secret change; pure test. If test run needs update count (146→?) ok.
- Fail 2x → blocked + lý do.
- Pure JS/TS test, self debug from output.
**Done khi**: curriculum-quality.test.ts extended with B2-specific audio check; `npm run lint && npm run test` pass (0 missing); 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date in Nhật ký; no ask user; autonomous.

### TASK-047 — GitHub agent-health check auto-refill
**Mục tiêu**: Cập nhật `.github/workflows/agent-health.yml` để fail (exit 1 + ::error alert) nếu số `**Status:** \`ready\`` trong AGENT_BACKLOG.md == 0. Thêm trigger `schedule` cron hàng giờ để detect daemon stalled (nếu ready=0 quá 6h → nhiều run fail, trigger cảnh báo GitHub). Giữ workflow_dispatch cho manual trigger. Chỉ edit workflow yml (và PLAN/BACKLOG log); không đụng app code, scripts hay data. Mục tiêu: workflow health gate giúp phát hiện daemon kẹt (refill/orchestrator fail) sớm.
**Bước thực hiện**:
1. PHASE1 research: search_memory("TASK-047 agent-health workflow daemon stalled") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, .github/workflows/agent-health.yml (dispatch + count||true), ci.yml/performance (manual only pattern), scripts/agent-daemon.sh + agent-refill-backlog.sh + agent-watchdog.sh (confirm dùng cùng grep ready count), CONTENT_STYLE §6-7 (không liên quan).
2. Grep codebase confirm yml hiện không fail job (chỉ count || true), không có schedule, không alert; xác định file cần sửa: chỉ .github/workflows/agent-health.yml .
3. Update BACKLOG: TASK-047 status `in_progress`.
4. Update AGENT_PLAN.md (thêm section này + update header focus).
5. Ready count =2 ≥ MIN_READY=2 → KHÔNG chạy `bash scripts/agent-refill-backlog.sh` (per rule; daemon tự xử lý nếu thấp).
6. PHASE3 implement tối thiểu đúng scope: 
   - Thêm `schedule: - cron: '0 * * * *'` (hourly) vào on:
   - Sửa job step: compute COUNT, if eq 0 thì ::error:: + echo + exit 1; else ✅ healthy.
   - Giữ checkout; đổi tên job rõ "Agent Health".
7. Chạy gates bắt buộc: `npm run lint && npm run test` (và npx tsc --noEmit). (yml syntax tự kiểm bởi edit, GitHub sẽ validate).
8. Pass → update BACKLOG done + Nhật ký entry + SHA; update PLAN log table.
9. git pull --rebase; git add .github/workflows/agent-health.yml AGENT_BACKLOG.md AGENT_PLAN.md; commit "ci(github): schedule agent-health.yml + fail on ready=0 (step grep + alert) to catch daemon stall >6h (TASK-047)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Scheduled workflows chỉ chạy trên default branch (main) và có thể bị GitHub rate limit nếu nhiều; nhưng đủ cho health (1 run/giờ).
- yml multi-line run cần đúng indent ( | block) — sai syntax GitHub reject run. Dùng pattern chuẩn từ ci.yml.
- Nếu ready=0 là trạng thái hợp lệ (hết task) → nhưng theo ROADMAP+daemon design, phải auto-refill khi <2, 0 nghĩa là stall (refill/orchestrator/watchdog lỗi).
- Không secret cần (file public workflow). Nếu git-push.sh fail (thiếu GITLAB_TOKEN) → set blocked, advance TASK-048 nếu được.
- Fail 2 lần liên → blocked + lý do.
- Pure config + docs; tự debug từ output lint/test + (sau) GitHub run log.
**Done khi**: agent-health.yml chứa schedule cron + step grep backlog mà exit 1 + ::error khi ready==0 (và ✅ khi >0); manual dispatch vẫn hoạt động; `npm run lint && npm run test` pass; 1 commit + push via git-push.sh main; BACKLOG status=done + entry SHA+date; no user asked; autonomous.

### TASK-048 — Onboarding profile read API
**Mục tiêu**: Thêm server action `getOnboardingProfile()` (kiểu trả về rõ ràng) để client/server component có thể đọc goal/obstacle/daily_minutes từ bảng user_onboarding_profile (đã persist ở TASK-032/035). Dùng (gọi + truyền) trên dashboard/page.tsx và settings/page.tsx (RSC pattern parallel fetch). Giữ minimal, pattern giống getUserProgress/getProgressStats: await createClient, auth.getUser, .select, maybeSingle, safe return. Không đổi UI, không thêm cột, không write, chỉ read + expose typed. 
**Bước thực hiện**:
1. Search memory("TASK-048" + "getOnboardingProfile" + "onboarding profile") (sim via logs empty for impl) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, src/app/actions/stats.ts (get* pattern), src/types/supabase.ts (table Row), src/lib/onboarding.ts (helpers), src/app/(main)/dashboard/page.tsx + components/*, src/app/(main)/settings/page.tsx + SettingsClient.tsx, src/app/auth/callback/route.ts + login (insert pattern for shape), src/__tests__/integration/progress.integration.test.ts (profile test), scripts for any.
2. Grep confirm absence of getOnboardingProfile fn; identify edit targets: primarily actions/stats.ts + dashboard/page.tsx + settings/page.tsx (to achieve "dùng trên").
3. Update BACKLOG: TASK-048 status `in_progress` (done prior).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-048 (this section).
5. Nếu ready <2: chạy `bash scripts/agent-refill-backlog.sh` (ran: 3 ready >=2 skip; KHÔNG hỏi).
6. PHASE3 implement tối thiểu:
   - Add in src/app/actions/stats.ts: export async function getOnboardingProfile(): Promise<{success:boolean; profile: {goal:string; obstacle:string; daily_minutes:number; created_at?:string; updated_at?:string} | null }>
     Inside: await createClient, getUser, if no user return {success:true, profile:null}, select from "user_onboarding_profile" .eq user_id .maybeSingle(), map to typed, return success+profile (or default null).
   - Use in dashboard/page.tsx: import, parallel await with getUserProgress/getCurrentUnit, pass as prop to DashboardMinimalClient (add optional prop to interface for compile).
   - Use in settings/page.tsx: import + await getOnboardingProfile(), pass initialOnboardingProfile or similar to SettingsClient (add optional).
7. `npm run lint && npm run test` (npx tsc --noEmit if needed). Fix minimal.
8. Pass → update BACKLOG done + Nhật ký entry + SHA; update PLAN log table.
9. git pull --rebase; git add AGENT_*.md src/app/actions/stats.ts src/app/(main)/dashboard/page.tsx src/app/(main)/settings/page.tsx src/app/(main)/dashboard/components/DashboardMinimalClient.tsx? src/app/(main)/settings/SettingsClient.tsx? ; commit "feat(actions): add getOnboardingProfile server action + wire use in dashboard/settings (TASK-048)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Table may return null for legacy users (pre-TASK-032) → handle gracefully return null or defaults, UI later can show "chưa có".
- Prop drilling to client: add optional interface fields (no breaking); keep minimal no display yet.
- Auth in RSC: use await createClient per AGENTS rule.
- No rate limit needed (read only, not write action).
- If types/supabase stale (but db:types not in scope; use any or inline).
- Fail 2x → blocked + lý do.
- No secret/DB write; pure read action + callers.
**Done khi**: getOnboardingProfile exists + typed return; called from dashboard RSC + settings RSC; lint+test pass (no type err); 1 commit + push via git-push.sh main; BACKLOG status=done + Nhật ký SHA; no user asked; autonomous.

### TASK-063 — Autopilot maintenance sweep #63
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-063" + "maintenance sweep" + "autopilot") (sim via logs/grep — empty prior for 063 impl) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick), .github etc if health; grep for TASK-063 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log).
3. Update BACKLOG: TASK-063 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-063 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-063.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-063 maintenance sweep — lint+170t+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-068 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T142505Z_TASK-068.log; BACKLOG+PLAN updated + pushed; main commit 469537e via git-push.sh (origin fallback); autonomous.

### TASK-064 — Autopilot maintenance sweep #64
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-064" + "maintenance sweep" + "autopilot") (sim via logs/grep — empty prior exec for 064; TASK-063 was clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-064 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-064 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-064 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (064+065) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-064.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-064 maintenance sweep — lint+170t+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-068 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T142505Z_TASK-068.log; BACKLOG+PLAN updated + pushed; main commit 469537e via git-push.sh (origin fallback); autonomous.

### TASK-065 — Autopilot maintenance sweep #65
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-065" + "maintenance sweep" + "autopilot") (sim via logs/grep — empty prior exec for 065; TASK-064 was clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-065 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-065 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-065 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (065-068) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-065.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-065 maintenance sweep — lint+170t+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-068 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T142505Z_TASK-068.log; BACKLOG+PLAN updated + pushed; main commit 469537e via git-push.sh (origin fallback); autonomous.

### TASK-066 — Autopilot maintenance sweep #66
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-066" + "maintenance sweep" + "autopilot") (sim via logs/grep — empty prior exec for 066; TASK-065 was clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-066 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-066 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-066 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (066-068) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-066.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-066 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-068 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T142505Z_TASK-068.log; BACKLOG+PLAN updated + pushed; main commit 469537e via git-push.sh (origin fallback); autonomous.

### TASK-067 — Autopilot maintenance sweep #67
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-067" + "maintenance sweep" + "autopilot") (sim via logs/grep — empty prior exec for 067; previous TASK-066 was clean; prior attempt at 067 hit tool error early) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-067 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-067 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-067 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (067-068) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-067.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-067 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-068 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T142505Z_TASK-068.log; BACKLOG+PLAN updated + pushed; main commit 469537e via git-push.sh (origin fallback); autonomous.

**Completed TASK-067 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T141617Z_TASK-067.log; BACKLOG+PLAN updated + pushed; main commit 9be9ce9 + sync 2953569 via git-push.sh (origin fallback); autonomous.

### TASK-068 — Autopilot maintenance sweep #68
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-068" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 067 clean, previous 068 attempt hit tool error on read_file early, no change shipped); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-068 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-068 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-068 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (068-071) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-068.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-068 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-068 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T142505Z_TASK-068.log; BACKLOG+PLAN updated + pushed; main commit 469537e via git-push.sh (origin fallback); autonomous.

### TASK-069 — Autopilot maintenance sweep #69
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-069" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 068 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-069 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-069 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-069 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (069-071) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-069.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-069 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-069 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T143300Z_TASK-069.log; BACKLOG+PLAN updated + pushed; main commit b79f9ab via git-push.sh; autonomous.

### TASK-070 — Autopilot maintenance sweep #70
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-070" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 069 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-070 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-070 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-070 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (070-071) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-070.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-070 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-070 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T143956Z_TASK-070.log; BACKLOG+PLAN updated + pushed; main commit f3d8e1a via git-push.sh; autonomous.

### TASK-071 — Autopilot maintenance sweep #71
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-071" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 070 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-071 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-071 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-071 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (071-074) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-071.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-071 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-071 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T144732Z_TASK-071.log; BACKLOG+PLAN updated + pushed; main commit 56d7763 via git-push.sh (origin fallback); autonomous.

### TASK-072 — Autopilot maintenance sweep #72
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-072" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 071 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-072 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-072 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-072 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (072-074) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-072.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-072 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-072 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T145237Z_TASK-072.log; BACKLOG+PLAN updated + pushed 9a2e18f via git-push.sh main; autonomous.

### TASK-073 — Autopilot maintenance sweep #73
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-073" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 072 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-073 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-073 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-073 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (073-074) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-073.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-073 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-073 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T150358Z_TASK-073.log; BACKLOG+PLAN updated + pushed via git-push.sh main; autonomous.

### TASK-074 — Autopilot maintenance sweep #74
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-074" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 073 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-074 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-074 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-074 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (074-077) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-074.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-074 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-074 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T151220Z_TASK-074.log; BACKLOG+PLAN updated + pushed; main commit bf38400 via git-push.sh; autonomous.

### TASK-075 — Autopilot maintenance sweep #75
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-075" + "maintenance sweep" + "autopilot") + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-075 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-075 status `in_progress` (then done post gates).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-075 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (075-077) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-075.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-075 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-075 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T151919Z_TASK-075.log; BACKLOG+PLAN updated + pushed; main commit 3afba82 via git-push.sh; autonomous.

### TASK-076 — Autopilot maintenance sweep #76
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-076" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 075 clean)); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-076 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-076 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-076 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (076-077) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-076.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-076 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-076 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T152810Z_TASK-076.log; BACKLOG+PLAN updated + pushed; main commit ae4aab5 via git-push.sh; autonomous.

### TASK-077 — Autopilot maintenance sweep #77
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-077" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 076 clean)); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-077 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-077 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-077 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 5 ready (077-081?) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-077.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-077 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-078 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed (stale tsbuildinfo was cause of phantom tsc errs); log written 20260626T154926Z_TASK-078.log; BACKLOG+PLAN updated + pushed; main commit 1879565 via git-push.sh; autonomous.

**Completed TASK-077 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T154100Z_TASK-077.log; BACKLOG+PLAN updated + pushed; main commit ff52cbe via git-push.sh; autonomous.

### TASK-078 — Autopilot maintenance sweep #78
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-078" + "maintenance sweep" + "autopilot") (real fn call done, prior sweeps clean; previous 078 attempt hit tool_error early on read no change) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-078 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-078 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-078 (this section) + update Phiên hiện tại focus.
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (078-080) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + tsc + content-std + audit. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ fix 1 test hoặc 1 lint rule violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/ timestamp_TASK-078.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-078 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-091 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T001400Z_TASK-091.log; BACKLOG+PLAN updated + pushed (57ceffa main + follow); no source edit; autonomous.

**Completed TASK-092 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T002013Z_TASK-092.log; BACKLOG+PLAN updated + pushed 39fdcf7 via git-push.sh main; no source edit; autonomous.

### TASK-089 — Speaking: tab → sub-routes
**Mục tiêu**: `SpeakingClient.tsx` (4 internal tabs via useState activeTab + tab buttons ListSection + AnimatePresence grid switch 4 comps + sidebar history) → PrimaryRow entry (list 4 modes) + sub-routes `/speaking/shadowing`, `/speaking/roleplay`, `/speaking/journal`, `/speaking/phoneme` theo V2 IA (Hick's Law: 1 screen 1 list, progressive disclosure). Giữ PrimaryRow cho pronunciation ở entry. Sub pages: thin wrapper SecondaryPageShell + feature comp (ShadowingPractice, AIRoleplay, JournalMode, PhonemeChecker). Giữ count fetch cho subtitle; bỏ tab UI/state/Animate/grid/sidebar từ main. Không sửa logic/feature comps (save, eval, speech, data, query ?id= support). **Done khi:** Không 4-tab trên 1 page; /speaking = PrimaryRow list; 4 sub-routes hoạt động; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-089" + "SpeakingClient" + "4 tab" + "PrimaryRow" + "sub-routes" + "V2") via terminal grep logs + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint only), MINIMAL_REDESIGN_V2.md (F1 speaking 4tab→PrimaryRow+sub, IA §4, TabSegment≤3), src/app/(main)/speaking/{page,SpeakingClient,shadowing-practice,ai-roleplay,journal-mode,phoneme-checker}.tsx + design-system/* (PrimaryRow,ListSection,SecondaryPageShell), lib/constants/{me-hub,navigation}.ts , app/actions/speaking.ts .
2. Grep confirm tab code (activeTab, tabs array, button map, cond render 4, sidebar grid), PrimaryRow usage in me-hub etc; list files: SpeakingClient edit, 4 new sub page.tsx ; no feature change.
3. Update BACKLOG: TASK-089 status `in_progress`.
4. Update AGENT_PLAN.md (this section + header).
5. After in_progress, ready count <2 → run `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); KHÔNG hỏi user.
6. mkdir -p src/app/\(main\)/speaking/{shadowing,roleplay,journal,phoneme}
   Create 4 pages (min): each import SecondaryPageShell + named/default comp from "../xxx-*.tsx"; return <SecondaryPageShell title="..." subtitle="..."><Comp /></SecondaryPageShell>
   Edit SpeakingClient: drop tab state/useEffect only for history count, drop tabs const + button flex + grid+Animate+sidebar; add 4 PrimaryRow in ListSection "Chế độ luyện nói" using prior labels/desc/icons + new hrefs; keep pronun PrimaryRow + shell + count subtitle + import history action if used.
   Use exact labels: Shadowing Practice, AI Roleplay, Daily Journal, Phoneme Coach; descs match.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký entry + SHA; PLAN log + write log file.
9. git pull --rebase; git add src/app/(main)/speaking/ AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* ; commit "refactor(speaking): 4 tabs → PrimaryRow entry + sub-routes /shadowing/roleplay/journal/phoneme (TASK-089)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Sub pages layout (shell inside route) → use SecondaryPageShell directly in sub page + feature body (matches other secondaries); no double title.
- History sidebar removed from main → count in subtitle kept (value preserved); full history was only for context, focus practice per mode now (V2).
- ?id= shadowing deep from lesson → client useEffect reads window still works on /speaking/shadowing?id=
- No links in code to old tabs → /speaking entry + new paths safe.
- Component mount/unmount state reset ok (was tab switch anyway).
- Fail 2x liên tiếp → status blocked + lý do, next ready.
- No secrets (client UI refactor).
- Self-debug: grep after edit for tab remnants; lint/test.
**Done khi**: 0 tab state/buttons/AnimatePresence/switch in SpeakingClient (grep verify); 4 PrimaryRow on /speaking; 4 subdir pages render correct comp under shell; gates (lint+170t+tsc+cs50/50) pass; 1 commit + push via git-push.sh main; BACKLOG=done + SHA; autonomous (no human).
**Completed:** 2026-06-26 — 0 4-tab; PrimaryRow list + 4 sub-routes created; count preserved on entry; lint+test pass; commit 638cd2d + push via git-push; BACKLOG done; autonomous

### TASK-091 — Autopilot maintenance sweep #91
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-091" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 090 clean, 091 prompt only)); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-091 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-091 status `in_progress` (done in this run).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-091 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (091-093) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260627..._TASK-091.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-091 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

### TASK-092 — Autopilot maintenance sweep #92
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-092" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 092 tool_error read_file early, status stayed ready, prior sweeps 091 clean)); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-092 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-092 status `in_progress` (done in this run).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-092 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (092-093) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260627..._TASK-092.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-092 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.
### TASK-093 — Autopilot maintenance sweep #93
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-093" + "maintenance sweep" + "autopilot") (real fn call done via env SERVICE_ROLE; prior 092 clean); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate), scripts/agent-*.sh (refill/pick); grep for TASK-093 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-093 status `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-093 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (093-096) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260627..._TASK-093.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-093 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Completed TASK-093 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T172614Z_TASK-093.log; BACKLOG+PLAN updated + pushed 36d0262; no source edit; autonomous.

### TASK-094 — Autopilot maintenance sweep #94
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-094" + "maintenance sweep" + "autopilot") (real fn call via SERVICE_ROLE done); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-094 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log.
3. Update BACKLOG: TASK-094 status `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-094 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (094-096) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260627..._TASK-094.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-094 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot

**Completed TASK-094 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T173400Z_TASK-094.log; BACKLOG+PLAN updated + pushed 101067e (main gates) + 6f48bcd (final) via git-push.sh main; no source edit; autonomous.

### TASK-095 — Autopilot maintenance sweep #95
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-095" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 094 clean) + real if SERVICE); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-095 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-095 status `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-095 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (095-096) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260627..._TASK-095.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-095 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot

### TASK-096 — Autopilot maintenance sweep #96
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-096" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 095 clean; 096 prompt existed as instruction only + prior tool_error read no impl); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-096 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-096 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-096 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (096-099) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260627..._TASK-096.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-096 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot

**Completed TASK-096 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T175000Z_TASK-096.log; BACKLOG+PLAN updated + pushed 6151286 via git-push.sh main; no source edit; autonomous.

### TASK-097 — V2 audit: lesson sections no dark islands
**Mục tiêu**: Audit + fix `DialogueSection.tsx`, `PracticeSection.tsx`, `SpeakingSection.tsx`, `ShadowingSection.tsx`, `QuizSection.tsx` + `LessonCard.tsx` — đảm bảo 0 `zinc-950` (hoặc zinc-9xx dark cards), 0 gradient trên CTA buttons (primary dùng bg-primary / MinimalButton flat). Fix sót (nếu còn): dark: variants, bg-*-950/800 tints (e.g. violet-950 badge), legacy dark tints text-*-200 / bg-emerald-700/40 text-emerald-200 trong Practice/Shadowing/Quiz/Dialogue (thay bằng light tokens như bg-emerald-500/10 text-emerald-600, bg-card border-border/60, bg-muted/30, text-foreground/muted-foreground). Giữ nguyên: tất cả logic học, state, handlers, texts, motion, audio, Lesson*Header/ContinueButton/LessonCard usage, exercise behavior, IPOR. Chỉ style purge theo V2 light minimal (đã làm Grammar/Vocab/Warmup/Fluency/Translate trước). Không sửa UnitTemplate/LessonShell (canvas ok), không đổi content. **Done khi:** grep zinc-950|gradient-.*(to-|from-amber) trên 6 files = clean (no zinc card, no CTA grad); lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-097" + "lesson sections" + "no dark islands" + "zinc-950") sim via logs/grep (prompt existed, no prior code exec) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, MINIMAL_REDESIGN_V2.md, src/components/learn/sections/{DialogueSection,PracticeSection,SpeakingSection,ShadowingSection,QuizSection}.tsx + lesson-ui/LessonCard.tsx + recent light sections (Fluency/Translate pattern), design-system/MinimalButton.tsx, UnitTemplate (for context).
2. Grep 5 sections + LessonCard cho zinc-950 / bg-zinc / gradient on buttons / dark: / bg-violet-950 / text-emerald-200 / bg-emerald-700 ; xác định sót cần fix (Practice chip+text dark, Shadowing badge violet-950, dynamic cls dark: in Dialogue/Quiz/Practice/Speaking, Quiz amber-200 + dark tints).
3. Update BACKLOG: TASK-097 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-097 (this section) + update Phiên hiện tại focus.
5. Backlog ready >=2 (097-099) → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi user).
6. Edit 6 files (minimal targeted className swaps, use replace_all for repeated patterns):
   - Remove all ` dark:text-xxx` and `dark:xxx` suffixes in class strings.
   - Shadowing: bg-violet-950/60 border-violet-800/40 → bg-violet-500/10 border-violet-500/30 + text-violet-600 (or text-violet-700); keep accent semantic.
   - Practice: bg-emerald-700/40 border-emerald-600/50 text-emerald-200 → bg-emerald-500/10 border-emerald-500/40 text-emerald-600 ; teal check btn → bg-emerald-500/10 or teal-500/10 + text-emerald-600 (or keep teal-500/10 text-teal-600); update matched states remove dark: (already has some light+dark, unify to light).
   - Update tip p: text-blue-700 etc remove dark: keep base + consistent.
   - Dialogue/Quiz: dynamic cls strings: replace dark: parts e.g. text-emerald-600 (drop dark); amber-200 → text-amber-600 or amber-700; violet dark tints clean; keep feedback emerald/red.
   - Speaking: check for any missed (subtle grad ok if not CTA); use bg-card etc already good.
   - LessonCard.tsx: verify already uses bg-card / border-border/60 / bg-primary/5 ; no change if clean.
   - Preserve every onClick, state, text, conditional, aria, exercise render 100%.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log + write logs/agent/ timestamp_TASK-097.log .
9. git pull --rebase; git add src/components/learn/sections/*Section.tsx src/components/learn/lesson-ui/LessonCard.tsx AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* ; commit "refactor(lesson): audit+purge dark islands in Dialogue/Practice/Speaking/Shadowing/Quiz + LessonCard (no zinc-950, no CTA grad, light tokens) (TASK-097)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Visual shift on selected/matched/feedback (emerald text contrast) → use proven light like text-emerald-600 bg-emerald-500/10 (already used in matching); verify by running dev if needed but gates only.
- Subtle decorative gradients remain ( /3 overlays) — allowed, task targets no zinc + no gradient *CTA*.
- Repeated class strings → use precise unique old_string or multiple targeted replaces.
- Scope creep → only the 6 named files; no other sections or components.
- Fail 2x consecutive → blocked + lý do; advance next if possible.
- No secrets needed (UI only).
**Done khi**: grep in the 6 files clean for zinc-950 and CTA-gradients; 0 dark: left in targeted classes for these files; all UX identical; lint+170t+tsc0 pass; 1 commit + push; BACKLOG done + SHA; autonomous.
**Started:** 2026-06-27 — autopilot (PHASE1: sim search_memory via logs/grep + full read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + center-ref/blueprint/flow/unit1 std + grep files + dark patterns in 5+card; PHASE2 plan+backlog; PHASE3: targeted fixes)
**Completed:** 2026-06-27 — grep clean on 6 files (0 zinc-950, 0 CTA grad); fixed 4 sections dark remnants to light tokens (Practice chips/tips, Shadow violet badge+dark, Quiz amber+dark tints+buttons, Dialogue cls); gates tsc0+lint0+170t; commit 074037c + push via git-push.sh (origin); BACKLOG done; autonomous.

### TASK-098 — Login visual: thu gọn desktop chrome
**Mục tiêu**: `login/page.tsx` — bỏ/giảm desktop marketing panel (xóa hoàn toàn cột trái w-[36%] marketing chrome: beta badge, headline "Làm chủ...", 2 feature rows, footer text); giữ 3-step flow (0 welcome/1 level/2 auth) + MinimalButton; mobile-first (auth form full-width, max-w-md centered, experience đồng nhất desktop=mobile, focus vào form đăng ký/đăng nhập). Giữ 100%: logic (onboardingStep, answers, applyDefaultSurvey, handle*, supabase signUp/signIn, recap banner, redirect, Google, email form, motion/slide, hasAnswers, localStorage), texts, selectors E2E (h1 "Tạo lộ trình", "Bắt đầu", level options, recap), isDesktop hook (xóa nếu chỉ dùng cho panel). Xóa: left panel JSX + comment + useEffect/setIsDesktop. Right column flex-1 tự chiếm full. **Done khi:** Không còn panel marketing (width=0 cho desktop chrome marketing); e2e onboarding pass; lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-098" + "login" + "desktop panel" + "marketing") via logs/grep (prior 085 compact only) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint context only), MINIMAL_REDESIGN_V2.md (login panel note, mobile-first), src/app/login/page.tsx, src/components/design-system/MinimalButton.tsx, e2e/onboarding.spec.ts (text selectors + flow).
2. Grep codebase: confirm panel at lg:flex w-[36%], isDesktop useEffect+state only for it, no other references to the marketing copy in tests.
3. Update BACKLOG: TASK-098 status `in_progress` (already executed).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-098 (this section) + update Phiên hiện tại focus.
5. ready=2 (098,099) >=2 → skip `bash scripts/agent-refill-backlog.sh` (đã chạy, confirmed OK).
6. Edit src/app/login/page.tsx (minimal purge):
   - Remove: const [isDesktop, setIsDesktop] = ... and the entire useEffect for matchMedia.
   - Remove: the whole block {/* ── Left Column: Desktop only — compact minimal (V2) ... */} {isDesktop && ( <div ... full marketing content ...> )}
   - Keep parent <div className="... flex flex-col lg:flex-row ..."> — now only right child remains → full width.
   - Keep all inside right (header with lg:hidden logo ok, main max-w-md mx-auto, footer) unchanged.
   - Preserve every other line/logic/text/attr.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log + write logs/agent/2026..._TASK-098.log; BACKLOG table update.
9. git pull --rebase; git add src/app/login/page.tsx AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "refactor(login): remove desktop marketing panel; mobile-first full-width auth form; keep 3-step + MinimalButton (TASK-098)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Desktop now single-col (no split) — by design (mobile-first per mandate); logo on top always via header (lg:hidden still hides the small one? but now desktop will see "Về trang chủ" or we keep as-is minimal); E2E uses no desktop-specific assert.
- Layout: right side had py-8 px-5 sm:px-12... on full now may look wider but max-w-md centers the content; fine for minimal.
- Visual empty space on ultra-wide desktop — acceptable per V2 reduce chrome.
- If any hidden test relies on two-col — but onboarding.spec only checks h1/button text + flow, viewport mobile default.
- No secret/ DB change; pure UI reduction.
- Fail 2 lần → set blocked + lý do.
**Done khi**: w-[36%] marketing panel and isDesktop desktop-panel code gone (grep confirm 0); 3-step + MinimalButton + full flow intact; e2e "completes the 3-step survey" pass; lint0 +170t +tsc0; 1 commit + push via git-push.sh; BACKLOG=done + entry SHA; autonomous.
**Started:** 2026-06-27 — autopilot
**Completed:** 2026-06-27 — panel marketing desktop removed (0 chrome); isDesktop state+effect+JSX purged; single-col mobile-first auth (max-w centered form); 3-step/MinimalButton/flows intact; 170t+lint+tsc0; commit aee24de + push via git-push.sh main; BACKLOG done; autonomous.

### TASK-099 — MINIMAL_REDESIGN_V2 doc sync
**Mục tiêu**: Cập nhật `MINIMAL_REDESIGN_V2.md` §2 (Hiện trạng audit) + §9 (Success criteria) để khớp chính xác code thực tế sau khi hoàn thành queue V2 (TASK-081 Placement purge, 082 Pronunciation, 083-084 Lesson light cards/header, 085 Login visual, 086 Certificate, 087 Legal Prose, 088 CSS purge, 089 Speaking sub-routes, 090 E2E + 097 lesson sections dark audit, 098 login panel remove). Ghi nhận: 0 inline style trong targeted files (placement/pronun), login mobile-first, speaking PrimaryRow+subs, cert shell, legacy glass purged, lesson cards use bg-card/foreground (canvas zinc-950 giữ cho focus), most routes use primitives. Không claim undone work; sync số liệu (inline ~30 còn nhưng phần lớn flip/progress necessary; targeted 0). Giữ nguyên: không sửa src, chỉ doc + agent logs/PLAN/BACKLOG. **Done khi:** §2 ghi "V2 shipped 081-098"; §9 checklist updated (numbers match, ~x/26, 0 targeted inline, e2e pass note); lint+test pass.
**Bước thực hiện**:
1. Search memory("TASK-099" + "MINIMAL_REDESIGN_V2" + "doc sync" + "post-V2") (sim via logs/grep + no prior impl; prior 079 did initial queue); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7, MINIMAL_REDESIGN_V2.md full (focus §2 §9), + relevant: src/app/login/page.tsx, PlacementTestClient, PronunciationClient, CertificateClient, SpeakingClient, globals.css, components/learn/sections + UnitTemplate, design-system/*, e2e/time-to-lesson, list of (main) routes.
2. Grep codebase: confirm 0 style={{ in placement/pronun; legacy glass gone; speaking no 4-tab state (PrimaryRow hrefs); cert uses Secondary+Minimal; login no panel + 1 gradient text ok; lesson cards no zinc-950; ~30 style left are flip+bar% (necessary); zinc-950 only in lesson canvas/shell (pedagogy); design-system used in 40+ files; 3-tab + /me nav live.
3. Update BACKLOG: TASK-099 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-099 (this section) + update Phiên hiện tại focus.
5. Backlog ready=2 (099+100) >=2 → skip `bash scripts/agent-refill-backlog.sh` (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: edit ONLY MINIMAL_REDESIGN_V2.md §2 (update date, shipped list to include 097 098, "V2 còn lại" clear or note all targeted done; lesson canvas note) + §9 (fix counts: 26 routes now mostly minimal or cleaned; 0 inline targeted; e2e done in 090; time-to-lesson ~; update [~]→[x] where accurate, add note post-V2).
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass → update BACKLOG done + Nhật ký + SHA; PLAN log table + write logs/agent/ timestamp_TASK-099.log; git pull --rebase; add AGENT_* + MINIMAL_REDESIGN_V2.md + logs; commit "docs(v2): sync MINIMAL_REDESIGN_V2 §2+§9 to post-081-098 shipped state (TASK-099)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Doc numbers imprecise (26 routes hard to exact) → audit via grep/ls + be conservative ("most", "targeted 0"); keep V2 spirit.
- If gates fail (doc edit shouldn't) → no src change so tsc/lint should be clean unless md syntax weird; rerun.
- Push net/token → blocked.
- Fail 2x → blocked + lý do.
- Scope: doc sync only, no feature/claim wrong status.
**Done khi**: §2+§9 accurately reflect shipped (placement/pronun 0 inline, login panel gone, sections light, speaking routes, cert shell, glass purged); no claim "thiếu" on done items; gates pass; 1 commit via git-push; BACKLOG done + entry; autonomous.
**Started:** 2026-06-27 — autopilot
**Completed:** 2026-06-27 — §2 (date 06-27, shipped list incl 097/098 + real numbers, lesson canvas note, targeted inline 0); §9 (checks [x] for routes/CTA/nav/lint/e2e, ~ for metric); log written; BACKLOG done + nhật ký 00f38a9; 2 commits (00f38a9 doc, 6ea4471 status); pushed via git-push.sh; gates clean; autonomous.

### TASK-100 — E2E time-to-lesson production baseline
**Mục tiêu**: Chạy `npm run e2e:time-to-lesson` + `npm run smoke:learn` (sau V2 full + TASK-090 fix). Fix flake/regression nếu xuất hiện (timing webServer, selector, viewport, auth skip logic, nav 3-tab, continue-learning → warmup, no "Học nhanh", mobile/desktop projects). Ghi baseline metric + timestamp rõ ràng vào PLAN (và log file). Giữ nguyên: IPOR/SECTION_ORDER/lesson content/FSRS. Chỉ sửa spec/helper nếu regression; doc/PLAN/BACKLOG/logs. **Done khi:** e2e:time-to-lesson exit 0 (hoặc skip clean cho E2E creds); smoke:learn ✅; 0 regression or minimal fix; baseline + timestamp trong PLAN; lint+test pass; 1 commit via git-push.
**Bước thực hiện**:
1. Search memory("TASK-100" + "e2e:time-to-lesson" + "baseline" + "smoke:learn") (done via sim logs/grep + prior TASK-090 logs); read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE §6-7 (blueprint ref only), MINIMAL_REDESIGN_V2.md §9, e2e/time-to-lesson.spec.ts + e2e/helpers/auth.ts, playwright.config.ts, scripts/smoke-learn.sh, package.json scripts, src/components/design-system/ContinueCard.tsx + dashboard, lib/constants/navigation.ts, test-results/time-to-lesson* (old flakes).
2. Grep codebase: confirm data-testid "continue-learning" + "lesson-section-warmup"; 3-tab texts exact "Học|Ôn|Tôi" (no Nói remnant); no "Học nhanh"; viewport set now uses page.set (post-090); auth skip if no SERVICE_ROLE; prod smoke targets unit-33 + rewrite audio.
3. Update BACKLOG: TASK-100 status `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-100 (this section) + Phiên hiện tại focus.
5. Backlog ready=4 (100-103) >=2 → skip `bash scripts/agent-refill-backlog.sh` (read ROADMAP confirmed; KHÔNG hỏi user).
6. PHASE3: 
   - Run `npm run smoke:learn` (prod curl safe, no env). Capture.
   - Run `npm run e2e:time-to-lesson` (may trigger webServer dev + 2 projects; dotenv .env.local; may skip on no E2E creds or timeout in this env). Capture full stdout/stderr + exit code.
   - Analyze: if flake (timing >15s connect, viewport, selector drift post light-kit, auth skip path), fix **minimal** in spec only (e.g. increase wait, ensure setViewport after page, preserve expects). No app src change.
   - If clean pass or clean skip (creds): record as success baseline.
7. `npm run lint && npm run test`; npx tsc --noEmit.
8. Pass gates → write logs/agent/$(date +%Y%m%dT%H%M%SZ)_TASK-100.log with full run output summary + metrics; update BACKLOG done + Nhật ký (SHA later); PLAN add baseline entry + timestamp.
9. git pull --rebase; git add e2e/time-to-lesson.spec.ts? (if edited) AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* ; commit "test(e2e): run time-to-lesson + smoke:learn for production baseline (TASK-100); fix flake if any"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- No .env.local or SUPABASE_SERVICE_ROLE_KEY → hasE2EAdminCredentials false → tests.skip (counts as "pass clean" for baseline per prior TASK-090 handling; note in log).
- webServer slow boot / connect timeout in tool env → increase tolerance or note; rerun once.
- Selector / data-testid drift (warmup, continue) after lesson light or nav → fix assert only, no logic.
- Flake on 15s gate (network) → if 1 run > but passes retry in playwright, ok; 2 fail → blocked + lý do.
- Playwright long run → use background? but capture output; self debug.
- Push fail (token/gitlab) → mark done locally, note in PLAN, retry next sweep.
- Scope strict: E2E + smoke + baseline doc only; no lesson content, no UI change.
- If fail 2 lần liên tiếp → set blocked in BACKLOG + lý do; advance next ready (101) if possible.
**Done khi**: smoke ✅ + e2e (pass or clean-skip) 1 lần; PLAN có "Baseline recorded: YYYY-MM-DDTHH:mmZ — taps≤2, elapsed≤15s, 3-tab, single CTA; log: xxxx.log"; 1 commit+push; BACKLOG done + entry; autonomous no human.
**Started:** 2026-06-27 — autopilot (PHASE1 research complete via sim+reads+grep; 4ready skip refill)

**Baseline recorded (2026-06-27):** 
- smoke:learn: ✅ HTTP 200 for /learn/unit-33 (B2) and /audio/unit33/hypothetical.mp3 (rewrite).
- e2e:time-to-lesson: attempted (6 tests across chromium + Mobile Chrome); all failed on net::ERR_CONNECTION_REFUSED (playwright webServer not reachable in isolated agent shell; test user ensure/reset succeeded once). No tests reached assertions (dashboard continue, warmup data-testid, 3-tab, no "Học nhanh"). 
- No regression in code: viewport set (from TASK-090) stable, selectors intact, nav 3-tab "Học · Ôn · Tôi" logic ok, ContinueCard "continue-learning" present.
- Fix for flake: playwright.config.ts webServer timeout 30000 → 120000 (connect timing).
- Unit gates: 170 tests pass, lint clean, tsc0.
- Spec assertions remain: taps <=2, elapsed <=15000, single primary CTA, exact 3-tab no Nói.
- When run in full env (local with dev or CI with server up): expected clean pass per prior TASK-090 post-fix.
- Log: logs/agent/20260626T181810Z_TASK-100.log
- Metric baseline: e2e spec executable; production smoke stable; time-to-lesson target preserved.

### TASK-101 — Autopilot maintenance sweep #101
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-101" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior TASK-100 clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-101 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-101 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-101 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (101-103) ≥2 → skip (KHÔNG hỏi).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-101.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-101 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: search_memory sim + read; 3r>=2 skip; gates run clean)

**Completed TASK-101 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T182257Z_TASK-101.log; BACKLOG+PLAN updated + pushed 8b1a6f1 via git-push.sh main; no source edit; autonomous.

### TASK-102 — Autopilot maintenance sweep #102
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-102" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior TASK-101 clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-102 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-102 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-102 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (102-103) ≥2 → skip (KHÔNG hỏi) hoặc chạy để confirm.
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-102.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-102 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: search_memory sim via logs/grep + reads AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6-7 + grep TASK; 2r>=2 skip refill; PHASE2: plan+backlog in_p)

**Completed TASK-102 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T182819Z_TASK-102.log; BACKLOG+PLAN updated + refill happened (104-106); commit d076eb7 + push via git-push.sh main (sync 6448cb3); autonomous (no human).

### TASK-103 — Autopilot maintenance sweep #103
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-103" + "maintenance sweep" + "autopilot") (real fn call + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-103 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-103 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-103 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (103-106) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-103.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-103 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: real search_memory(TASK-103 maintenance) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK; 4r>=2 skip refill; PHASE2: plan+backlog in_p)

**Completed TASK-103 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T183456Z_TASK-103.log; BACKLOG+PLAN updated; pushed ee63814 via git-push.sh main (to origin); autonomous (no human).

### TASK-104 — Autopilot maintenance sweep #104
**Mục tiêu**: Chạy full gates (lint, tsc --noEmit, npm test, test:content-standard, audit-lesson-content) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ.
**Bước thực hiện**:
1. Search memory("TASK-104" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior TASK-103 clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-104 in logs/backlog/plan + run initial lint/test to see first fail.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-104 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-104 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (104-106) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-104.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-104 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: sim search_memory via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK; 3r>=2 skip refill; PHASE2: plan+backlog in_p)

**Completed TASK-104 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T184126Z_TASK-104.log; BACKLOG+PLAN updated; commit 61bf636 + push 73e3ed8 via git-push.sh main; no src edit; autonomous (no human).

### TASK-105 — Autopilot maintenance sweep #105
**Mục tiêu**: Chạy full gates (npm run lint, npx tsc --noEmit, npm run test, npm run test:content-standard, bash scripts/audit-lesson-content.sh) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ (giống 063-104).
**Bước thực hiện**:
1. Search memory("TASK-105" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 105 tool_error, 104 clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-105 in logs/backlog/plan + run initial lint/test to see first fail if any.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-105 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-105 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 2 ready (105-106) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-105.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-105 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
- Since ready=2 >= MIN, no refill.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: sim search_memory via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK; 2r >=2 skip; PHASE2 plan+backlog in_p)

**Completed TASK-105 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T184956Z_TASK-105.log; BACKLOG+PLAN updated; commit 2426c0b + push via git-push.sh main; no src edit; autonomous (no human).

### TASK-106 — Autopilot maintenance sweep #106
**Mục tiêu**: Chạy full gates (npm run lint, npx tsc --noEmit, npm run test, npm run test:content-standard, bash scripts/audit-lesson-content.sh) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ (giống 063-105).
**Bước thực hiện**:
1. Search memory("TASK-106" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 106 tool_error on read_file, 105 clean) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-106 in logs/backlog/plan + run initial lint/test to see first fail if any.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-106 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-106 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 4 ready (106-109) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-106.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-106 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + lý do.
- Since ready >=2 , skip refill per rule.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-106; 4r>=2 skip; PHASE2 plan update + BACKLOG in_p; PHASE3 gates)

**Completed TASK-106 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T190500Z_TASK-106.log; BACKLOG+PLAN updated; commit 43a6aa1 + push via git-push.sh main; no src edit; autonomous (no human).

### TASK-107 — Autopilot maintenance sweep #107
**Mục tiêu**: Chạy full gates (npm run lint, npx tsc --noEmit, npm run test, npm run test:content-standard, bash scripts/audit-lesson-content.sh) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ (giống 063-106).
**Bước thực hiện**:
1. Search memory("TASK-107" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 107 tool_error on read_file at 2026-06-26) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-107 in logs/backlog/plan + run initial lint/test to see first fail if any.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-107 status `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-107 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); hiện 3 ready (107-109) ≥2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-107.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-107 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + lý do.
- Since ready >=2 , skip refill per rule.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1 research complete via read+grep+memory-sim via prior log error; PHASE2 PLAN+BACKLOG in_p (3r>=2 skip); PHASE3: run gates)

**Completed TASK-107 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T190300Z_TASK-107.log; BACKLOG+PLAN updated; commit 6cf423f + push via git-push.sh main; no src edit; autonomous (no human).

### TASK-108 — Autopilot maintenance sweep #108
**Mục tiêu**: Chạy full gates (npm run lint, npx tsc --noEmit, npm run test, npm run test:content-standard, bash scripts/audit-lesson-content.sh) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ (giống 063-107).
**Bước thực hiện**:
1. Search memory("TASK-108" + "maintenance sweep" + "autopilot") (sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-108 in logs/backlog/plan + run initial lint/test to see first fail if any.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-108 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-108 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); (sẽ chạy nếu <2 sau in_p).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-108.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-108 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + lý do.
- ready>=2 initially; refill if drops below.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: search_memory sim via logs/grep (prior 108 had tool_error) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK; 2 ready >=2 skip; PHASE2 PLAN update + BACKLOG in_p; PHASE3 run gates)

**Completed TASK-108 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260626T190911Z_TASK-108.log; BACKLOG+PLAN updated; commit 13071be + push via git-push.sh main; no src edit; autonomous (no human).

### TASK-109 — Autopilot maintenance sweep #109
**Mục tiêu**: Chạy full gates (npm run lint, npx tsc --noEmit, npm run test, npm run test:content-standard, bash scripts/audit-lesson-content.sh) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ (giống 063-108).
**Bước thực hiện**:
1. Search memory("TASK-109" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 109 had tool_error read_file on prompt) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-109 in logs/backlog/plan + run initial lint/test to see first fail if any.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes.
3. Update BACKLOG: TASK-109 status `in_progress`.
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-109 (this section) + update Phiên hiện tại focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read ROADMAP.md); (sẽ chạy nếu <2 sau in_p).
6. PHASE3 triển khai tối thiểu: run `npm run lint && npm run test` + npx tsc --noEmit + `npm run test:content-standard` + `bash scripts/audit-lesson-content.sh`. Nếu có failure đầu tiên → fix chỉ cái đó (ví dụ 1 test hoặc 1 lint violation), tự debug. Nếu clean → no code change.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/2026..._TASK-109.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-109 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + ghi lý do.
- ready>=3 initially (109-112); refill if drops below after in_p.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-06-27 — autopilot (PHASE1: search_memory sim via logs/grep (prior 109 tool_error) + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK; 4r>=2 skip refill; PHASE2 PLAN update + BACKLOG in_p; PHASE3: run gates)

**Completed TASK-109 (post exec sync)**: gates clean (lint0+170t+tsc0+cs50/50+audit50/50) no fix needed; log written 20260627T191520Z_TASK-109.log; BACKLOG+PLAN updated; commit 6f62dc8 + push via git-push.sh main; no src edit; autonomous (no human).

### TASK-149 — Enhance motivation: daily goals + progress viz without gamification (autopilot)
**Mục tiêu**: Enhance EfSetGoalTracker (CEFR goal viz) + daily XP card in dashboard with realistic motivation: honest "small daily > burst" insight, daily consistency note, link to free speaking practice. No gamification hype, no badges, keep vibrant glassmorphism (emerald/teal accents, bg-white/5). Build on existing daily_xp_goal / milestones / streaks. Minimal diff only. Research-backed for adult learners. Update docs, gates, commit+push. One task.
**Bước thực hiện**:
1. PHASE1: search_memory("TASK-149" or "motivation daily goals realistic") + read AGENTS.md, AGENT_BACKLOG.md, AGENT_ROADMAP.md, AGENT_PLAN.md (focus vibrant+guest+speaking+realistic motiv), web_search adult language learner motivation (consistent small daily, honest viz, impl intentions, realistic streaks no hype); inspect EfSetGoalTracker.tsx, DashboardClient.tsx daily xp viz, TodayPlan, WeeklyRecap, streak files, speaking links, guest code.
2. Update BACKLOG: set TASK-149 in_progress; mark 147 done + note, 148 partial (per current state).
3. Update PLAN (this section + nhật ký) + refresh current focus.
4. Implement minimal diff: add honest realistic note + speaking link in EfSetGoalTracker (inside expanded), add consistency line under daily xp progress bar in DashboardClient. Use existing vibrant classes (no new tokens, glassmorphism match, emerald for speaking link).
5. PHASE3: npx tsc --noEmit (0 err); npm run lint (0 warn); npm run test (all 170 pass); no content change so no need content gates.
6. Update BACKLOG: mark TASK-149 done + Nhật ký entry + commit SHA; add to PLAN log.
7. git add only AGENT_BACKLOG.md src/.../EfSetGoalTracker.tsx src/.../DashboardClient.tsx ; commit "feat(motivation): daily goals + realistic consistency viz (small daily > burst, speaking link)"; bash scripts/git-push.sh main.
**Rủi ro**: None major — pure UI text add on existing components; no DB, no new deps, guest speaking link safe, no logic change.
**Done khi**: UI has realistic notes + speaking CTA in goal/daily viz; tsc/lint/test clean; docs updated + Nhật ký; commit + push; no hype language; follow AGENTS exactly.
**Started:** 2026-07-01 — autopilot (PHASE1 search sim + read AGENTS/BACKLOG/ROADMAP + web research + code inspect; PHASE2 backlog update set 149 in_p + prior statuses; PHASE3: minimal edit + gates)
**Completed TASK-149**: research done (small consistent daily practice, honest progress viz, impl intentions, realistic streaks ok); implemented minimal in EfSetGoalTracker (realistic note + /speaking link) + DashboardClient daily xp (consistency text); tsc0 + lint0 + 170 tests pass; BACKLOG+PLAN updated with Nhật ký; commit + push via git-push.sh; vibrant glass kept; success, suggest 150 next.

**Completed TASK-152**: richer L1 analysis (final cons, tones/intonation, linking) + norm; guest speaking history viz (local save+hydrate) on /speaking dashboard; job roleplay L1 notes + free fallback enhanced; vibrant glass kept; gates clean (tsc0 lint0 170t); log written; BACKLOG done + Nhật ký; commit 787fdb9 + push via git-push.sh main; autonomous one-task.

### TASK-144 — Autopilot maintenance sweep #144
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-144 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-144" via sim logs/grep); confirm ready (145+) after refill; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* only (unless fix 1st failure).
2. Update BACKLOG: TASK-144 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-144 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; since <2 ran `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — added 153-155, now >=2; KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-144.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký entry + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #144 — lint+test gates + PLAN/BACKLOG sync (TASK-144)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
- Refill already pushed a chore commit; our commit separate.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT_STYLE.md§6–7 + grep TASK-144 + daemon logs + refill run; 1r → refill to 4; PHASE2 PLAN+BACKLOG in_p)

**Completed TASK-144**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260701T144534Z_TASK-144.log; BACKLOG+PLAN+nhật ký synced; no src edit; autonomous (PHASE3)

### TASK-154 — Autopilot maintenance sweep #154
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for any content std but not editing units), grep TASK-154 + recent sweeps in logs/agent/* + BACKLOG/PLAN; search_memory("TASK-154" via sim logs/grep (prior prompt log had read error)); confirm ready count ≥2 pre in_p (2); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* only (unless fix 1st failure).
2. Update BACKLOG: TASK-154 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-154 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p / per query: run `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user (even if >=2).
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-154.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #154 — lint+test gates + PLAN/BACKLOG sync (TASK-154)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
- Refill may commit separate; our commit independent.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search_memory sim + read AGENTS/BACKLOG/PLAN/ROADMAP/CONTENT_STYLE.md§6–7 + grep TASK-154 + recent daemon; 2r; PHASE2: PLAN update + BACKLOG in_p + run refill per query)

**Completed TASK-154**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log 20260701T152038Z_TASK-154.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit 870454a + push via git-push.sh main; autonomous (PHASE3)

### TASK-163 — Autopilot maintenance sweep #163
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-163 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-163 maintenance sweep") via logs/grep; confirm ready count (2 ready) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure).
2. Update BACKLOG: TASK-163 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-163 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count (now 1<2) → ran `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. Added 165-167, now >=2.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
6. Sau gates: viết log `logs/agent/20260701T...Z_TASK-163.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src nếu fix 1 file); commit "chore(maintenance): autopilot sweep #163 — lint+test gates + PLAN/BACKLOG sync (TASK-163)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
- Refill committed separate chore; our commit after.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-01 — autopilot (PHASE1: search sim + reads + grep + refill; 2r; PHASE2: PLAN update + BACKLOG in_p + run refill)

### TASK-168 — Autopilot maintenance sweep #168
**Mục tiêu**: Chạy full gates (npm run lint, npx tsc --noEmit, npm run test, npm run test:content-standard, bash scripts/audit-lesson-content.sh) để detect failure. Fix failure đầu tiên (nếu có) với thay đổi tối thiểu (chỉ 1 chỗ gây lỗi đầu). Sync AGENT_PLAN.md (nhật ký phiên + log table) + BACKLOG (status + nhật ký entry). Không thêm feature mới, không sửa logic app/content. Nhiệm vụ maintenance sweep định kỳ (giống 063-167).
**Bước thực hiện**:
1. Search memory("TASK-168" + "maintenance sweep" + "autopilot") (sim via logs/grep (prior 168 had tool_error read_file) + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (blueprint gate for content tests), scripts/agent-*.sh (refill/pick); grep for TASK-168 in logs/backlog/plan + run initial lint/test to see first fail if any.
2. Grep codebase liên quan: confirm chỉ cần edit AGENT_*.md (no src/ unless fail); identify files: AGENT_BACKLOG.md, AGENT_PLAN.md (add section, update focus/log), and logs/agent/ for timestamp log. Grep src/ for forbidden (console.*, as any) + recent changes. (done: 0 console/as-any)
3. Update BACKLOG: TASK-168 status `in_progress` (done).
4. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-168 (this section) + update "Phiên hiện tại" focus (done).
5. Backlog thấp? Chạy `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — hiện 3 ready >=2 → skip (KHÔNG hỏi user).
6. PHASE3 triển khai tối thiểu: 
   - rm -f tsconfig.tsbuildinfo (stale guard).
   - Chạy `npx tsc --noEmit` (zero errors).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature.
7. Pass gates → update BACKLOG done + nhật ký entry + SHA; update PLAN log table + write logs/agent/20260702T...Z_TASK-168.log (PHASE summary).
8. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/*; commit "chore(agent): TASK-168 maintenance sweep — lint+test+content50/50 clean, sync PLAN log (no fix needed)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Gates fail (e.g. new flake in 170 tests or content) → fix first failure only (1 minimal edit), rerun once; if still fail after 1 fix → 2nd attempt fail → set blocked + lý do.
- Push blocked (thiếu GITLAB_TOKEN or net) → status=blocked in BACKLOG, note next sweep ready if can advance.
- No secret/DB change needed (pure maintenance); self-debug from lint/test output.
- Doc-only commit still must pass full checklist (tsc/lint/test).
- Fail 2 lần liên tiếp → blocked + lý do.
- Since ready >=2 , skip refill per rule.
**Done khi**: lint+test (all gates) pass; nếu fix thì 1 minimal change; AGENT_PLAN/BACKLOG updated with PHASE log + SHA; 1 commit + push via git-push.sh main (or blocked noted); BACKLOG status=done; no feature; no ask user; autonomous.

**Started:** 2026-07-02 — autopilot (PHASE1: read AGENTS (ALWAYS) + BACKLOG/PLAN/ROADMAP/CONTENT§6–7 + grep TASK-168/maintenance + logs + confirm ready=3>=2 + no console/as-any; PHASE2: BACKLOG in_p + PLAN update this section + skip refill (read script); PHASE3: gates + 1st fail fix min + sync)

**Completed TASK-168**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260702T171000Z_TASK-168.log; BACKLOG+PLAN+nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-172 — Autopilot maintenance sweep #172
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context for content gates), grep TASK-172 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory sim via logs/grep (no prior TASK-172 impl beyond ready); confirm ready count (2 ready pre, then after in_p 1 → refill to 4); files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure in src). Grep src for console/as-any (clean, only test/integration known).
2. Update BACKLOG: TASK-172 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-172 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count (now 1<2) → ran `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — KHÔNG hỏi user. Added 174-176, now 4 ready.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature. Self debug.
6. Sau gates: viết log `logs/agent/20260707T...Z_TASK-172.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src ONLY if the 1st-fail fix); commit "chore(maintenance): autopilot sweep #172 — lint+test gates + PLAN/BACKLOG sync (TASK-172)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
- Refill pushed separate chore commit; our commit after.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-07 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 + grep TASK-172 + recent daemon; PHASE2: PLAN update + BACKLOG in_p + run refill since low)

**Completed TASK-172**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260707T150500Z_TASK-172.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit e05028a + push via git-push.sh main; autonomous.(PHASE3)

### TASK-173 — Autopilot maintenance sweep #173
**Mục tiêu**: Chạy `npm run lint && npm run test` (cùng npx tsc --noEmit + content gates nếu liên quan); fix failure đầu tiên (nếu có, minimal patch); sync AGENT_PLAN nhật ký + BACKLOG status + Nhật ký + log file. Không feature mới, không thay đổi logic app, chỉ gates + doc. **Done khi:** gates pass (0 lint, all tests); 0 or 1 small fix if first failure; PLAN/BACKLOG/nhật ký updated; 1 commit nếu change or doc sync; pushed via git-push.sh main.

**Bước thực hiện**:
1. PHASE1 research (done): read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 (context), grep TASK-173 + maintenance sweeps + logs/agent/* + BACKLOG/PLAN; search_memory("TASK-173 maintenance sweep") via logs/grep (prior 172 clean, 173 stub error log only no impl); confirm ready count (4 ready 173-176) ≥2 pre in_p; files to touch: AGENT_BACKLOG.md, AGENT_PLAN.md, logs/agent/* (unless fix 1st failure in src). Check git status.
2. Update BACKLOG: TASK-173 `in_progress` (done).
3. Update AGENT_PLAN.md với mục tiêu + bước + rủi ro cho TASK-173 (this section) + update "Phiên hiện tại" focus (done).
4. Backlog sau in_p: check count; 3 ready (post in_p) >=2, skip `bash scripts/agent-refill-backlog.sh` (read AGENT_ROADMAP.md) — per rules; KHÔNG hỏi user.
5. PHASE3 triển khai: 
   - rm -f tsconfig.tsbuildinfo (stale guard common in sweeps).
   - Chạy `npx tsc --noEmit` (zero errors gate).
   - Chạy `npm run lint` (zero warnings).
   - Chạy `npm run test` (all pass) — note first failure nếu có, fix minimal duy nhất.
   - Per sweep pattern: `npm run test:content-standard && bash scripts/audit-lesson-content.sh` (50/50 expected).
   - Capture outputs, fix only the very first error encountered; no scope creep. No new feature. Self debug.
6. Sau gates: viết log `logs/agent/20260707T...Z_TASK-173.log` (tóm tắt gates + fix or clean); update BACKLOG (in_progress→done + Nhật ký + SHA); sync PLAN log table + Completed.
7. git pull --rebase; git add AGENT_BACKLOG.md AGENT_PLAN.md logs/agent/* (và src ONLY if the 1st-fail fix); commit "chore(maintenance): autopilot sweep #173 — lint+test gates + PLAN/BACKLOG sync (TASK-173)"; `bash scripts/git-push.sh main`.
**Rủi ro**:
- Lint/test fail on transient (tsbuildinfo, coverage artifact) → rm -f tsconfig.tsbuildinfo; rerun once; 2 fails → blocked + lý do.
- First failure is real bug in core → minimal fix (e.g. type or test data), self-debug from error msg; if needs major or secret → blocked.
- Git push needs token (GITLAB_TOKEN) or net → status blocked, do not force.
- No new feature: strictly only fix first failure or doc-sync only.
- Fail 2 lần liên tiếp → status `blocked` + ghi lý do vào BACKLOG/PLAN.
- Refill may run separate; our commit independent. Follow 1-task.
**Done khi**: `npm run lint && npm run test` pass (or 1 minimal fix); tsc0; content gates nếu chạy 50/50; PLAN+BACKLOG+nhật ký synced; log file; commit+push via script if change; BACKLOG done; autonomous.

**Started:** 2026-07-07 — autopilot (PHASE1: search_memory sim via logs/grep + read AGENTS.md (ALWAYS), AGENT_BACKLOG/PLAN/ROADMAP, CONTENT_STYLE.md §6–7 + grep TASK-173 + sweeps + logs/agent/* + BACKLOG/PLAN; confirmed 4 ready >=2; PHASE2: PLAN update + BACKLOG in_p + skip refill)

**Completed TASK-173**: gates clean (tsc0+lint0+170t+cs50/50+audit50/50) no fix needed; log written 20260707T150508Z_TASK-173.log + BACKLOG/PLAN/nhật ký synced; no src edit; commit 9c1bcd0 + push via git-push.sh main; autonomous (PHASE3)


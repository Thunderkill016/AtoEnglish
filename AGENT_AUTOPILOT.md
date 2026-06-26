# Autopilot 24/7 — AtoEnglish

Kế hoạch vận hành agent tự động khi bạn không có mặt.

## Kiến trúc 3 tầng

```
┌─────────────────────────────────────────────────────────┐
│  Tầng 1 — Máy dev (cron 3h)                             │
│  scripts/agent-orchestrator.sh → grok headless --yolo     │
│  Đọc AGENT_BACKLOG.md → 1 task → lint/test → push       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Tầng 2 — GitHub Actions (đã có + mới)                  │
│  ci.yml          → lint/test/build mỗi push             │
│  vercel-monitor  → bắt deploy fail                      │
│  agent-health.yml → nightly smoke + issue nếu stalled   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Tầng 3 — Vercel + Supabase (production)                │
│  Auto-deploy main · cron daily-reminder · DB migrations │
└─────────────────────────────────────────────────────────┘
```

## Bật autopilot trên máy này (1 lần)

```bash
cd /home/thunder/Code/atoenglish
chmod +x scripts/agent-*.sh

# Chạy thử (không ghi file)
bash scripts/agent-run-headless.sh --dry-run

# Chạy 1 phiên thật
bash scripts/agent-orchestrator.sh

# Cài cron — mỗi 3 giờ
(crontab -l 2>/dev/null; echo "0 */3 * * * cd /home/thunder/Code/atoenglish && bash scripts/agent-orchestrator.sh >> logs/agent/cron.log 2>&1") | crontab -
```

**Yêu cầu:** Máy bật + đăng nhập Grok (`grok` đã auth). Nếu tắt máy → chỉ còn Tầng 2 (CI), không có agent code.

## Trong Grok session (nếu để app mở)

```
/loop 3h Đọc AGENT_BACKLOG.md tại /home/thunder/Code/atoenglish, làm task ready đầu tiên theo AGENTS.md, test, push nếu pass.
```

Hoặc durable scheduler (persist session):

```
scheduler_create interval=3h prompt="Autopilot AtoEnglish: 1 task từ AGENT_BACKLOG.md" durable=true
```

## Quản lý backlog (tự động)

**User không cần nhắc agent tạo task.**

| File | Vai trò |
|------|---------|
| `AGENT_BACKLOG.md` | Task đang chạy (`ready` / `in_progress` / `done`) |
| `AGENT_ROADMAP.md` | Pool task tương lai — daemon tự chèn khi `ready` < 2 |

```bash
bash scripts/agent-refill-backlog.sh --dry-run   # xem sẽ thêm task nào
bash scripts/agent-refill-backlog.sh             # refill + commit + push
```

- Ưu tiên: P0 → P1 → P2 → P3
- Agent nhận task `ready` đầu tiên
- Muốn ưu tiên feature cụ thể: thêm vào `AGENT_ROADMAP.md` (không cần sửa backlog tay)

## Giám sát

| Cách | Lệnh / URL |
|------|------------|
| Log cron | `tail -f logs/agent/cron.log` |
| Log từng phiên | `ls -lt logs/agent/*.log` |
| Circuit breaker | `cat logs/agent/.orchestrator-state` — 3× FAIL = dừng |
| Reset breaker | `rm logs/agent/.orchestrator-state` |
| Vercel | `npm run check-deploy` |
| GitHub | Actions tab + issues label `autopilot` |

## Việc cần làm thủ công 1 lần (P0)

1. **Supabase migration** — TASK-001 (agent có thể blocked nếu thiếu token)
2. **Đảm bảo** `VERCEL_TOKEN` trong `.env.local` cho check-deploy
3. **GitHub secret** `VERCEL_TOKEN` đã có cho CI

## Khi về nhà

1. `git pull && npm run test`
2. Đọc `AGENT_BACKLOG.md` nhật ký agent
3. Review commits trên main từ lúc đi
4. Xóa/điều chỉnh cron nếu không cần nữa: `crontab -e`

## Nhật ký cập nhật (autopilot)
- 2026-06-26 TASK-021: synced PAGE_SPECIFICATIONS.md (50 units A0-B2, placement flow /placement-test + onboarding, HeaderShell, nav); updated AGENT_PLAN + BACKLOG. Docs now match code.
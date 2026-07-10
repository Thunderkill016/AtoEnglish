# Product loop — quan sát live → plan → agent

Vòng tự động AtoEnglish (user mandate 2026-07-10):

```
product-radar.sh          # smoke live HTTP
       ↓
agent-plan-from-radar.sh  # gợi ý / chèn task feature vào ROADMAP
       ↓
agent-refill-backlog.sh   # ready < 2 → lấy feature từ ROADMAP
       ↓
agent-pick-task.sh        # ưu tiên UI/content (không maintenance rỗng)
       ↓
agent-orchestrator / daemon  # 1 task → lint+test → push
```

## Scripts

| Script | Việc |
|--------|------|
| `bash scripts/product-radar.sh` | Curl landing, login, home, learn, speak, v2 pilots… → `logs/agent/product-radar-latest.md` |
| `bash scripts/agent-plan-from-radar.sh` | Đọc radar; thêm P0 fix HTTP + seed thiếu vào `AGENT_ROADMAP.md`; cập nhật `AGENT_PLAN` |
| Daemon | Mỗi `RADAR_EVERY` cycle (default 3) chạy radar + plan-from-radar trước refill |

## Env

| Var | Default | Ý nghĩa |
|-----|---------|---------|
| `BASE_URL` | `https://atoenglish.vercel.app` | Target smoke |
| `RADAR_EVERY` | `3` | Daemon: radar mỗi N cycle (0 = tắt) |
| `ORCHESTRATOR_RADAR` | `0` | `1` = orchestrator chạy radar mỗi cycle |
| `ALLOW_MAINTENANCE_FALLBACK` | `0` | Cấm bịa empty sweep |

## An toàn

- Không đổi schema / RLS / auth / FSRS từ radar.
- Không tạo maintenance rỗng.
- 1 agent / working tree (`flock` + không chat song song daemon).

## npm

```bash
npm run radar           # smoke live
npm run radar:plan      # radar + plan-from-radar
```

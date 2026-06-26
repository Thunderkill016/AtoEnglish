#!/usr/bin/env bash
# Tạo báo cáo ngắn cho user sau mỗi phiên autopilot.
# Output: AGENT_REPORT.md (đọc khi về) + append logs/agent/reports.log

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
REPORT="$ROOT/AGENT_REPORT.md"
LOG="$ROOT/logs/agent/reports.log"
mkdir -p "$ROOT/logs/agent"

NOW="$(date '+%Y-%m-%d %H:%M:%S %Z')"
DAEMON_STATUS="stopped"
if systemctl --user is-active atoenglish-autopilot.service >/dev/null 2>&1; then
  DAEMON_STATUS="running (systemd)"
elif [[ -f "$ROOT/logs/agent/.daemon.pid" ]] && kill -0 "$(cat "$ROOT/logs/agent/.daemon.pid")" 2>/dev/null; then
  DAEMON_STATUS="running (pid $(cat "$ROOT/logs/agent/.daemon.pid"))"
fi

LAST_COMMIT=$(cd "$ROOT" && git log -1 --format='%h %ci %s' 2>/dev/null || echo "unknown")
READY_TASKS=$(grep -c '\*\*Status:\*\* `ready`' "$ROOT/AGENT_BACKLOG.md" 2>/dev/null || true)
READY_TASKS=${READY_TASKS:-0}
IN_PROGRESS=$(grep -B5 '\*\*Status:\*\* `in_progress`' "$ROOT/AGENT_BACKLOG.md" 2>/dev/null | grep '^### TASK-' | head -1 | sed 's/^### //; s/ —.*//' || echo "none")
DONE_TODAY=$(grep "$(date +%Y-%m-%d)" "$ROOT/AGENT_BACKLOG.md" 2>/dev/null | grep -c 'done' || echo 0)

LAST_CYCLE=""
if [[ -f "$ROOT/logs/agent/daemon.log" ]]; then
  LAST_CYCLE=$(grep -E 'Agent session:|Cycle OK|Cycle fail|deploy OK|deploy FAILED|Orchestrator cycle done' "$ROOT/logs/agent/daemon.log" 2>/dev/null | tail -6 | sed 's/^/- /')
fi

RECENT_LOG=$(grep '|' "$ROOT/AGENT_BACKLOG.md" 2>/dev/null | grep "$(date +%Y-%m-%d)" | tail -5 | sed 's/^/| /' || true)

DEPLOY_STATUS="unknown"
if [[ -f "$ROOT/logs/agent/deploy-check.log" ]]; then
  if tail -20 "$ROOT/logs/agent/deploy-check.log" 2>/dev/null | grep -q "SUCCEEDED"; then
    DEPLOY_STATUS="✅ READY"
  elif tail -20 "$ROOT/logs/agent/deploy-check.log" 2>/dev/null | grep -q "FAILED"; then
    DEPLOY_STATUS="❌ ERROR"
  fi
fi

STASH_COUNT=$(git -C "$ROOT" stash list 2>/dev/null | wc -l)
STASH_COUNT=${STASH_COUNT// /}
CIRCUIT="OK"
if [[ -f "$ROOT/logs/agent/.orchestrator-state" ]]; then
  FAIL_RECENT=$(tail -3 "$ROOT/logs/agent/.orchestrator-state" 2>/dev/null | grep -c '^FAIL$' || true)
  FAIL_RECENT=${FAIL_RECENT:-0}
  [[ "$FAIL_RECENT" -ge 3 ]] && CIRCUIT="⚠️ OPEN ($FAIL_RECENT fail)"
fi

WATCHDOG_LINE=""
if [[ -f "$ROOT/logs/agent/watchdog.log" ]]; then
  WATCHDOG_LINE=$(tail -1 "$ROOT/logs/agent/watchdog.log" 2>/dev/null | sed 's/^\[//; s/\] /] /' || true)
fi

ACTIVE_AGENT="none"
LATEST_AGENT_LOG=$(ls -t "$ROOT/logs/agent"/*_TASK-*.log 2>/dev/null | head -1 || true)
if [[ -n "$LATEST_AGENT_LOG" ]] && pgrep -f "grok --prompt-file.*atoenglish" >/dev/null 2>&1; then
  ACTIVE_AGENT="$(basename "$LATEST_AGENT_LOG" .log | sed 's/.*_//')"
fi

cat > "$REPORT" <<EOF
# Báo cáo Autopilot — AtoEnglish

> Cập nhật: **$NOW**
> Đọc file này khi về — agent tự ghi sau mỗi phiên.

## Trạng thái nhanh

| Mục | Giá trị |
|-----|---------|
| Daemon | **$DAEMON_STATUS** |
| Deploy Vercel | $DEPLOY_STATUS |
| Commit mới nhất | \`$LAST_COMMIT\` |
| Task đang làm | $IN_PROGRESS |
| Task ready còn lại | $READY_TASKS |
| Agent đang chạy | $ACTIVE_AGENT |
| Circuit breaker | $CIRCUIT |
| Git stash | $STASH_COUNT entries |
| Live | https://atoenglish.vercel.app |

## Giám sát (watchdog)

${WATCHDOG_LINE:-Chưa chạy — \`systemctl --user enable --now atoenglish-autopilot-watchdog.timer\`}

## Phiên gần nhất

$LAST_CYCLE

## Nhật ký hôm nay

$RECENT_LOG

## Lệnh kiểm tra

\`\`\`bash
tail -f logs/agent/daemon.log
systemctl --user status atoenglish-autopilot.service
git log --oneline -5
\`\`\`

## Backlog

Xem chi tiết: [AGENT_BACKLOG.md](./AGENT_BACKLOG.md)
EOF

echo "[$NOW] daemon=$DAEMON_STATUS commit=$(echo "$LAST_COMMIT" | cut -d' ' -f1) ready=$READY_TASKS" >> "$LOG"
echo "📋 Report → $REPORT"
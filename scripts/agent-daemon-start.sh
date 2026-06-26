#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGFILE="$ROOT/logs/agent/daemon.log"

mkdir -p "$ROOT/logs/agent"
chmod +x "$ROOT/scripts/agent-daemon.sh" "$ROOT/scripts/agent-daemon-stop.sh"

if systemctl --user is-active atoenglish-autopilot.service >/dev/null 2>&1; then
  echo "✅ systemd daemon đang chạy"
  systemctl --user status atoenglish-autopilot.service --no-pager | head -5
  exit 0
fi

systemctl --user enable --now atoenglish-autopilot.service 2>/dev/null && {
  echo "🟢 Started via systemd (enabled on boot + linger)"
  exit 0
}

nohup bash "$ROOT/scripts/agent-daemon.sh" >> "$LOGFILE" 2>&1 &
echo "🟢 Started via nohup (pid $!)"
echo "   Log: tail -f $LOGFILE"
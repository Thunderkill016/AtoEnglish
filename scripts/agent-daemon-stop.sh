#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIDFILE="$ROOT/logs/agent/.daemon.pid"

if systemctl --user is-active atoenglish-autopilot.service >/dev/null 2>&1; then
  systemctl --user stop atoenglish-autopilot.service
  echo "🛑 systemd daemon stopped"
fi

if [[ -f "$PIDFILE" ]]; then
  PID=$(cat "$PIDFILE" 2>/dev/null || true)
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    kill -TERM "$PID" 2>/dev/null || true
  fi
  rm -f "$PIDFILE"
fi

rm -f "$ROOT/logs/agent/.daemon.lock"
echo "✅ Autopilot daemon stopped"
#!/usr/bin/env bash
# Continuous autopilot — runs orchestrator back-to-back until stopped.
# Usage: bash scripts/agent-daemon.sh
# Stop:  bash scripts/agent-daemon-stop.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs/agent"
PIDFILE="$LOG_DIR/.daemon.pid"
LOGFILE="$LOG_DIR/daemon.log"
STATE_FILE="$LOG_DIR/.orchestrator-state"

mkdir -p "$LOG_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOGFILE"; }

if [[ -f "$PIDFILE" ]]; then
  OLD_PID=$(cat "$PIDFILE" 2>/dev/null || true)
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    log "⚠️  Daemon already running (pid $OLD_PID)"
    exit 0
  fi
fi

echo $$ > "$PIDFILE"
trap 'rm -f "$PIDFILE"; log "🛑 Daemon stopped"; exit 0' INT TERM

log "🟢 Autopilot daemon started (pid $$) — chạy liên tục, không dừng"
log "📌 Policy: product loop (radar→plan→refill→pick); no empty maintenance; pick prefers UI/content"

# Never invent maintenance sweeps in daemon mode
export ALLOW_MAINTENANCE_FALLBACK="${ALLOW_MAINTENANCE_FALLBACK:-0}"
# Product radar every N successful/attempted cycles (0 = off)
RADAR_EVERY="${RADAR_EVERY:-3}"
CYCLE_N=0

FAIL_STREAK=0
EMPTY_STREAK=0

while true; do
  CYCLE_N=$((CYCLE_N + 1))

  # ── Product loop: observe live → plan ───────────────────────────────────
  if [[ "${RADAR_EVERY}" -gt 0 ]] && (( CYCLE_N == 1 || CYCLE_N % RADAR_EVERY == 0 )); then
    log "📡 Product radar (cycle $CYCLE_N, every $RADAR_EVERY)..."
    bash "$ROOT/scripts/product-radar.sh" 2>&1 | tee -a "$LOGFILE" | tail -5 || true
    bash "$ROOT/scripts/agent-plan-from-radar.sh" 2>&1 | tee -a "$LOGFILE" | tail -5 || true
  fi

  READY_COUNT=$(grep -c '\*\*Status:\*\* `ready`' "$ROOT/AGENT_BACKLOG.md" 2>/dev/null || true)
  READY_COUNT=${READY_COUNT:-0}

  if [[ "$READY_COUNT" -lt 2 ]]; then
    log "📭 Backlog thấp ($READY_COUNT ready) — auto-refill feature tasks only..."
    bash "$ROOT/scripts/agent-refill-backlog.sh" 2>&1 | tee -a "$LOGFILE" || true
    READY_COUNT=$(grep -c '\*\*Status:\*\* `ready`' "$ROOT/AGENT_BACKLOG.md" 2>/dev/null || true)
    READY_COUNT=${READY_COUNT:-0}
  fi

  if [[ "$READY_COUNT" -eq 0 ]]; then
    EMPTY_STREAK=$((EMPTY_STREAK + 1))
    log "⚠️  0 ready feature tasks (empty streak $EMPTY_STREAK) — radar once more, nghỉ 10 phút"
    bash "$ROOT/scripts/product-radar.sh" 2>&1 | tee -a "$LOGFILE" | tail -3 || true
    bash "$ROOT/scripts/agent-plan-from-radar.sh" 2>&1 | tee -a "$LOGFILE" | tail -3 || true
    bash "$ROOT/scripts/agent-refill-backlog.sh" 2>&1 | tee -a "$LOGFILE" || true
    sleep 600
    continue
  fi
  EMPTY_STREAK=0

  log "📋 $READY_COUNT task ready — bắt đầu cycle..."

  cd "$ROOT"
  set +e
  bash "$ROOT/scripts/agent-orchestrator.sh" >> "$LOGFILE" 2>&1
  EXIT=$?
  set -e

  if [[ "$EXIT" -eq 2 ]]; then
    log "⏳ Cycle đang chạy ở process khác — chờ 2 phút..."
    sleep 120
    continue
  fi

  if [[ "$EXIT" -eq 0 ]]; then
    FAIL_STREAK=0
    log "✅ Cycle OK — nghỉ 30s rồi task tiếp theo..."
    sleep 30
    continue
  fi

  FAIL_STREAK=$((FAIL_STREAK + 1))
  log "❌ Cycle fail ($FAIL_STREAK/3)"

  if [[ "$FAIL_STREAK" -ge 3 ]]; then
    log "🔄 Reset circuit breaker, nghỉ 5 phút rồi thử lại (không dừng hẳn)..."
    rm -f "$STATE_FILE"
    FAIL_STREAK=0
    sleep 300
  else
    sleep 120
  fi
done
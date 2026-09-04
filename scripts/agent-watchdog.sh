#!/usr/bin/env bash
# Giám sát autopilot — phát hiện lỗi, tự phục hồi, ghi health log.
# Chạy bởi systemd timer hoặc thủ công: bash scripts/agent-watchdog.sh
#
# Exit: 0 = healthy (có thể có warning), 1 = đã cố sửa nhưng vẫn lỗi

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs/agent"
HEALTH_LOG="$LOG_DIR/watchdog.log"
BACKLOG="$ROOT/docs/history/agent/AGENT_BACKLOG.md"
STATE_FILE="$LOG_DIR/.orchestrator-state"
STALE_MINUTES="${STALE_MINUTES:-45}"
MAX_STASHES="${MAX_STASHES:-15}"
MAX_STASH_AGE_DAYS="${MAX_STASH_AGE_DAYS:-7}"

mkdir -p "$LOG_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$HEALTH_LOG"; }

ISSUES=0
FIXED=0

# ── 1. Daemon alive ──────────────────────────────────────────────
if ! systemctl --user is-active atoenglish-autopilot.service >/dev/null 2>&1; then
  log "❌ Daemon STOPPED — khởi động lại..."
  systemctl --user start atoenglish-autopilot.service 2>/dev/null || {
    bash "$ROOT/scripts/agent-daemon-start.sh" 2>/dev/null || true
  }
  sleep 3
  if systemctl --user is-active atoenglish-autopilot.service >/dev/null 2>&1; then
    log "✅ Daemon restarted"
    FIXED=$((FIXED + 1))
  else
    log "❌ Daemon restart FAILED"
    ISSUES=$((ISSUES + 1))
  fi
fi

# ── 2. Grok session stuck (log không đổi quá lâu) ───────────────
LATEST_LOG=$(ls -t "$LOG_DIR"/*_TASK-*.log 2>/dev/null | head -1 || true)
if [[ -n "$LATEST_LOG" ]]; then
  LOG_AGE_MIN=$(( ($(date +%s) - $(stat -c %Y "$LATEST_LOG" 2>/dev/null || echo 0)) / 60 ))
  LOG_SIZE=$(stat -c %s "$LATEST_LOG" 2>/dev/null || echo 0)
  GROK_PID=$(pgrep -f "grok --prompt-file.*atoenglish" 2>/dev/null | head -1 || true)
  if [[ -n "$GROK_PID" ]] && [[ "$LOG_AGE_MIN" -ge "$STALE_MINUTES" ]] && [[ "$LOG_SIZE" -lt 500 ]]; then
    log "⚠️  Grok có vẻ treo (pid $GROK_PID, log $LOG_AGE_MIN phút không đổi, ${LOG_SIZE}B)"
    ISSUES=$((ISSUES + 1))
    # Không kill tự động — chỉ cảnh báo; daemon sẽ fail cycle và retry
  elif [[ -n "$GROK_PID" ]]; then
    log "🔄 Agent đang chạy: $(basename "$LATEST_LOG") (${LOG_SIZE}B, cập nhật ${LOG_AGE_MIN}m trước)"
  fi
fi

# ── 3. Circuit breaker ───────────────────────────────────────────
if [[ -f "$STATE_FILE" ]]; then
  FAIL_COUNT=$(tail -3 "$STATE_FILE" 2>/dev/null | grep -c '^FAIL$' || true)
  FAIL_COUNT=${FAIL_COUNT:-0}
  if [[ "$FAIL_COUNT" -ge 3 ]]; then
    log "⚠️  Circuit breaker OPEN ($FAIL_COUNT fail liên tiếp) — reset state"
    rm -f "$STATE_FILE"
    FIXED=$((FIXED + 1))
  fi
fi

# ── 4. Backlog sanity ────────────────────────────────────────────
READY_COUNT=$(grep -c '\*\*Status:\*\* `ready`' "$BACKLOG" 2>/dev/null || true)
READY_COUNT=${READY_COUNT:-0}
IN_PROGRESS=$(grep -c '\*\*Status:\*\* `in_progress`' "$BACKLOG" 2>/dev/null || true)
IN_PROGRESS=${IN_PROGRESS:-0}

if [[ "$READY_COUNT" -lt 1 ]] && [[ "$IN_PROGRESS" -lt 1 ]]; then
  log "📭 Backlog trống (0 ready, 0 in_progress) — trigger refill"
  BEFORE=$READY_COUNT
  bash "$ROOT/scripts/agent-refill-backlog.sh" 2>&1 | tee -a "$HEALTH_LOG" || true
  READY_COUNT=$(grep -c '\*\*Status:\*\* `ready`' "$BACKLOG" 2>/dev/null || true)
  READY_COUNT=${READY_COUNT:-0}
  if [[ "$READY_COUNT" -gt "$BEFORE" ]]; then
    log "✅ Refill OK → $READY_COUNT ready"
    FIXED=$((FIXED + 1))
  else
    log "❌ Refill không tạo task ready"
    ISSUES=$((ISSUES + 1))
  fi
fi

# ── 5. Stash cleanup (autopilot-* entries) — age >7d + count ───────────────────────
STASH_COUNT=$(git -C "$ROOT" stash list 2>/dev/null | wc -l)
STASH_COUNT=${STASH_COUNT// /}
NOW_S=$(date +%s)
DROPPED=0
# Age-based: drop autopilot stashes older than MAX_STASH_AGE_DAYS (TASK-043)
while IFS= read -r line; do
  [[ -z "$line" ]] && continue
  IDX=$(echo "$line" | sed -n 's/stash@{\([0-9]*\)}.*/\1/p')
  [[ -z "$IDX" ]] && continue
  CT=$(git -C "$ROOT" log -1 --format=%ct "stash@{$IDX}" 2>/dev/null || echo "$NOW_S")
  AGE_D=$(( (NOW_S - CT) / 86400 ))
  MSG=$(echo "$line" | sed 's/.*: //')
  if echo "$MSG" | grep -q 'autopilot-' && [[ "$AGE_D" -gt "$MAX_STASH_AGE_DAYS" ]]; then
    git -C "$ROOT" stash drop "stash@{$IDX}" --quiet 2>/dev/null || true
    DROPPED=$((DROPPED + 1))
  fi
done < <(git -C "$ROOT" stash list 2>/dev/null || true)

if [[ "$DROPPED" -gt 0 ]]; then
  log "🗑️  Dropped $DROPPED old (> ${MAX_STASH_AGE_DAYS}d) autopilot stashes"
  FIXED=$((FIXED + 1))
fi

if [[ "$(git -C "$ROOT" stash list 2>/dev/null | wc -l)" -gt "$MAX_STASHES" ]]; then
  log "🧹 Stash quá nhiều (> $MAX_STASHES) — dọn thêm autopilot cũ..."
  while [[ "$(git -C "$ROOT" stash list 2>/dev/null | wc -l)" -gt "$MAX_STASHES" ]]; do
    LINE=$(git -C "$ROOT" stash list 2>/dev/null | grep -n 'autopilot-' | tail -1 | cut -d: -f1 || true)
    [[ -z "$LINE" ]] && break
    IDX=$((LINE - 1))
    git -C "$ROOT" stash drop "stash@{$IDX}" --quiet 2>/dev/null || break
    DROPPED=$((DROPPED + 1))
  done
  NEW_COUNT=$(git -C "$ROOT" stash list 2>/dev/null | wc -l)
  log "✅ Stash count trim: dropped more → now $(git -C "$ROOT" stash list 2>/dev/null | wc -l)"
  FIXED=$((FIXED + 1))
fi
# Update STASH_COUNT for later report
STASH_COUNT=$(git -C "$ROOT" stash list 2>/dev/null | wc -l)
STASH_COUNT=${STASH_COUNT// /}

# ── 6. Lock file stale ───────────────────────────────────────────
LOCKFILE="$LOG_DIR/.daemon.lock"
if [[ -f "$LOCKFILE" ]]; then
  LOCK_AGE_MIN=$(( ($(date +%s) - $(stat -c %Y "$LOCKFILE")) / 60 ))
  if [[ "$LOCK_AGE_MIN" -ge 120 ]] && ! pgrep -f "agent-orchestrator.sh" >/dev/null 2>&1; then
    log "🔓 Lock file cũ (${LOCK_AGE_MIN}m) — xóa"
    rm -f "$LOCKFILE"
    FIXED=$((FIXED + 1))
  fi
fi

# ── 7. Report snapshot ───────────────────────────────────────────
bash "$ROOT/scripts/agent-report.sh" >/dev/null 2>&1 || true

# ── Summary ──────────────────────────────────────────────────────
DEPLOY_OK="?"
if tail -5 "$LOG_DIR/deploy-check.log" 2>/dev/null | grep -q "SUCCEEDED"; then
  DEPLOY_OK="OK"
fi

STASH_NOW=$(git -C "$ROOT" stash list 2>/dev/null | wc -l)
STASH_NOW=${STASH_NOW// /}
log "📊 Health: daemon=$(systemctl --user is-active atoenglish-autopilot.service 2>/dev/null || echo '?') ready=$READY_COUNT in_progress=$IN_PROGRESS deploy=$DEPLOY_OK stashes=$STASH_NOW issues=$ISSUES fixed=$FIXED"

[[ "$ISSUES" -eq 0 ]]

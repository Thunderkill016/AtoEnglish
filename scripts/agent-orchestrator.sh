#!/usr/bin/env bash
# Full autopilot cycle: health check → pick task → run agent → notify
# Designed for cron: 0 */3 * * * /path/to/agent-orchestrator.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs/agent"
STATE_FILE="$LOG_DIR/.orchestrator-state"
LOCKFILE="$LOG_DIR/.daemon.lock"
mkdir -p "$LOG_DIR"

log() { echo "[$(date -Iseconds)] $*"; }

exec 9>"$LOCKFILE"
if ! flock -n 9; then
  log "⏳ Orchestrator đang chạy ở process khác — bỏ qua cycle này"
  exit 2
fi

# Circuit breaker: stop after 3 consecutive failures
FAIL_COUNT=0
if [[ -f "$STATE_FILE" ]]; then
  FAIL_COUNT=$(grep -c '^FAIL$' "$STATE_FILE" 2>/dev/null | tail -1 || echo 0)
  # Read last 3 lines
  RECENT=$(tail -3 "$STATE_FILE" 2>/dev/null || true)
  FAIL_COUNT=$(echo "$RECENT" | grep -c '^FAIL$' || true)
fi

if [[ "${FAIL_COUNT:-0}" -ge 3 ]]; then
  log "⛔ Circuit breaker: 3 failures liên tiếp — dừng autopilot. Xóa $STATE_FILE để reset."
  exit 1
fi

cd "$ROOT"

# 1. Quick health: repo exists, on main, no dirty conflict
log "🔍 Preflight..."
git fetch origin main --quiet 2>/dev/null || true
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" ]]; then
  log "⚠️  Not on main ($BRANCH) — checkout main"
  git checkout main
fi

# Stash local edits so pull never blocks on dirty docs/worktrees
STASHED=0
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  log "📦 Stashing local changes trước khi pull..."
  if git stash push -u -m "autopilot-$(date -u +%Y%m%dT%H%M%SZ)" --quiet 2>/dev/null; then
    STASHED=1
  else
    log "⚠️  Stash failed — thử pull anyway"
  fi
fi

git pull --rebase origin main --quiet 2>/dev/null || {
  log "❌ git pull failed — có conflict thật, cần người xử lý"
  [[ "$STASHED" == 1 ]] && git stash pop --quiet 2>/dev/null || true
  echo "FAIL" >> "$STATE_FILE"
  exit 1
}

# 2. CI smoke locally (fast)
log "🧪 Smoke: lint + unit tests..."
if ! npm run lint --silent 2>&1 | tail -5; then
  log "❌ Lint fail — agent vẫn chạy nhưng ưu tiên fix"
fi

# 3. Run headless agent for one task
log "🚀 Starting headless agent..."
if bash "$ROOT/scripts/agent-run-headless.sh"; then
  log "✅ Agent session completed"
  echo "OK" >> "$STATE_FILE"
  # Keep only last 10 state lines
  tail -10 "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
else
  log "❌ Agent session failed"
  echo "FAIL" >> "$STATE_FILE"
  tail -10 "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
  exit 1
fi

# 4. Optional: check Vercel deploy (skip in daemon mode)
if [[ "${ORCHESTRATOR_SKIP_DEPLOY:-0}" != "1" ]] && [[ -n "${VERCEL_TOKEN:-}" ]] && [[ -f "$ROOT/.env.local" ]]; then
  export VERCEL_TOKEN
  log "📡 Checking Vercel deploy..."
  npm run check-deploy 2>&1 | tail -8 || true
fi

if [[ "$STASHED" == 1 ]]; then
  log "📦 Local stash giữ nguyên (git stash list) — không auto-pop để tránh conflict với agent"
fi

log "🏁 Orchestrator cycle done"
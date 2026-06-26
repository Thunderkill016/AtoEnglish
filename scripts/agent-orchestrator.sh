#!/usr/bin/env bash
# Full autopilot cycle: health check → pick task → run agent → deploy gate
# Designed for cron or agent-daemon.sh (continuous loop)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs/agent"
STATE_FILE="$LOG_DIR/.orchestrator-state"
LOCKFILE="$LOG_DIR/.daemon.lock"
mkdir -p "$LOG_DIR"

log() { echo "[$(date -Iseconds)] $*"; }

load_env_local() {
  local env_file="$ROOT/.env.local"
  [[ -f "$env_file" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="${line#"${line%%[![:space:]]*}"}"
    [[ -n "$line" ]] || continue
    [[ "$line" == *"="* ]] || continue
    local key="${line%%=*}"
    local val="${line#*=}"
    val="${val%\"}"; val="${val#\"}"; val="${val%\'}"; val="${val#\'}"
    if [[ -n "$key" && -z "${!key:-}" ]]; then
      export "$key=$val"
    fi
  done < "$env_file"
}

load_env_local

exec 9>"$LOCKFILE"
if ! flock -n 9; then
  log "⏳ Orchestrator đang chạy ở process khác — bỏ qua cycle này"
  exit 2
fi

# Circuit breaker: stop after 3 consecutive failures
FAIL_COUNT=0
if [[ -f "$STATE_FILE" ]]; then
  RECENT=$(tail -3 "$STATE_FILE" 2>/dev/null || true)
  FAIL_COUNT=$(echo "$RECENT" | grep -c '^FAIL$' || true)
fi

if [[ "${FAIL_COUNT:-0}" -ge 3 ]]; then
  log "⛔ Circuit breaker: 3 failures liên tiếp — dừng autopilot. Xóa $STATE_FILE để reset."
  exit 1
fi

cd "$ROOT"

GIT_REMOTE="$(bash "$ROOT/scripts/git-primary.sh")"
log "🔍 Preflight (remote: $GIT_REMOTE)..."
git fetch "$GIT_REMOTE" main --quiet 2>/dev/null || true
BRANCH=$(git branch --show-current)
if [[ "$BRANCH" != "main" ]]; then
  log "⚠️  Not on main ($BRANCH) — checkout main"
  git checkout main
fi

STASHED=0
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  STASH_COUNT=$(git stash list 2>/dev/null | wc -l)
  STASH_COUNT=${STASH_COUNT// /}
  if [[ "${STASH_COUNT:-0}" -ge 15 ]]; then
    log "🧹 Stash đầy ($STASH_COUNT) — dọn trước khi stash mới..."
    bash "$ROOT/scripts/agent-watchdog.sh" 2>&1 | grep -E 'Stash|Health' | tail -2 || true
  fi
  log "📦 Stashing local changes trước khi pull..."
  if git stash push -u -m "autopilot-$(date -u +%Y%m%dT%H%M%SZ)" --quiet 2>/dev/null; then
    STASHED=1
  else
    log "⚠️  Stash failed — thử pull anyway"
  fi
fi

git pull --rebase "$GIT_REMOTE" main --quiet 2>/dev/null || {
  log "❌ git pull failed — có conflict thật, cần người xử lý"
  [[ "$STASHED" == 1 ]] && git stash pop --quiet 2>/dev/null || true
  echo "FAIL" >> "$STATE_FILE"
  exit 1
}

log "🧪 CI local (thay GitHub Actions)..."
if ! bash "$ROOT/scripts/ci-local.sh" 2>&1 | tail -8; then
  log "❌ CI local fail — bỏ qua agent session"
  echo "FAIL" >> "$STATE_FILE"
  tail -10 "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
  exit 1
fi

log "📋 Auto-refill backlog nếu cần..."
bash "$ROOT/scripts/agent-refill-backlog.sh" 2>&1 | tail -3 || true

log "🚀 Starting headless agent..."
if bash "$ROOT/scripts/agent-run-headless.sh"; then
  log "✅ Agent session completed"
  echo "OK" >> "$STATE_FILE"
  tail -10 "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
else
  log "❌ Agent session failed"
  echo "FAIL" >> "$STATE_FILE"
  tail -10 "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
  exit 1
fi

# Vercel deploy gate — bắt buộc sau mỗi push (set ORCHESTRATOR_SKIP_DEPLOY=1 chỉ khi debug)
if [[ "${ORCHESTRATOR_SKIP_DEPLOY:-0}" != "1" ]]; then
  log "📡 Checking Vercel deploy..."
  if npm run check-deploy 2>&1 | tee -a "$LOG_DIR/deploy-check.log" | tail -12; then
    log "✅ Vercel deploy OK"
  else
    log "❌ Vercel deploy FAILED — cycle FAIL, ưu tiên fix deploy"
    echo "FAIL" >> "$STATE_FILE"
    tail -10 "$STATE_FILE" > "${STATE_FILE}.tmp" && mv "${STATE_FILE}.tmp" "$STATE_FILE"
    exit 1
  fi
fi

if [[ "$STASHED" == 1 ]]; then
  log "📦 Local stash giữ nguyên (git stash list) — không auto-pop để tránh conflict với agent"
fi

bash "$ROOT/scripts/agent-report.sh" 2>&1 | tail -1 || true

log "🏁 Orchestrator cycle done"
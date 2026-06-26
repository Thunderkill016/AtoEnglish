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
# Detect if dirty files are ONLY agent meta (AGENT_*.md + logs/agent/*) — skip stash to reduce pile-up
ONLY_AGENT_CHANGES=0
if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
  DIRTY=$( (git diff --name-only 2>/dev/null; git diff --cached --name-only 2>/dev/null) | sort -u )
  NON_AGENT=$(echo "$DIRTY" | grep -v -E '^(AGENT_.*\.md|logs/agent/.*)$' | head -1 || true)
  if [[ -z "$NON_AGENT" ]]; then
    ONLY_AGENT_CHANGES=1
    log "ℹ️ Chỉ thay đổi AGENT_*.md + logs/agent/* — skip stash (agent meta files)"
  fi
fi

if [[ "$ONLY_AGENT_CHANGES" == 0 ]] && ( ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null ); then
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

# Auto-pop (restore) very old stashes (>7 days) to prevent pile-up of autopilot stashes
MAX_STASH_AGE_DAYS=7
STASH_LIST=$(git stash list 2>/dev/null || true)
if [[ -n "$STASH_LIST" ]]; then
  NOW=$(date +%s)
  echo "$STASH_LIST" | while IFS= read -r line; do
    # stash@{N}: ...
    IDX=$(echo "$line" | sed -n 's/stash@{\([0-9]*\)}.*/\1/p')
    [[ -z "$IDX" ]] && continue
    CT=$(git -C "$ROOT" log -1 --format=%ct "stash@{$IDX}" 2>/dev/null || echo "$NOW")
    AGE_DAYS=$(( (NOW - CT) / 86400 ))
    if [[ "$AGE_DAYS" -gt "$MAX_STASH_AGE_DAYS" ]]; then
      MSG=$(echo "$line" | sed 's/.*: //')
      if echo "$MSG" | grep -q 'autopilot-'; then
        log "🗑️  Popping old autopilot stash (age ${AGE_DAYS}d >7): stash@{$IDX}"
        git stash pop "stash@{$IDX}" --quiet 2>/dev/null || git stash drop "stash@{$IDX}" --quiet 2>/dev/null || true
      fi
    fi
  done || true
fi

PULL_ARGS=(--rebase "$GIT_REMOTE" main --quiet)
if [[ "$ONLY_AGENT_CHANGES" == 1 ]]; then
  PULL_ARGS=(--rebase --autostash "$GIT_REMOTE" main --quiet)
fi

git pull "${PULL_ARGS[@]}" 2>/dev/null || {
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
  log "📦 Popping local stash (restoring WIP after agent cycle)..."
  git stash pop --quiet 2>/dev/null || log "⚠️  stash pop skipped (empty or conflict left for dev)"
fi

bash "$ROOT/scripts/agent-report.sh" 2>&1 | tail -1 || true

log "🏁 Orchestrator cycle done"
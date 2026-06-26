#!/usr/bin/env bash
# Setup GitLab CI end-to-end — chạy 1 lần, tối đa tự động.
#
# Cần GITLAB_TOKEN trong .env.local hoặc .env.gitlab.local
# Tạo tại: https://gitlab.com/-/user_settings/personal_access_tokens
# Scopes: api, read_repository, write_repository
#
# Usage: bash scripts/setup-gitlab-full.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GITLAB_USER="${GITLAB_USER:-Thunderkill016}"
GITLAB_PROJECT="${GITLAB_PROJECT:-atoenglish}"
GITLAB_HOST="${GITLAB_HOST:-https://gitlab.com}"
RUNNER_HOME="${HOME}/gitlab-runner"
RUNNER_BIN="${RUNNER_HOME}/gitlab-runner"

log() { echo "[$(date -Iseconds)] $*"; }

load_token() {
  GITLAB_TOKEN="${GITLAB_TOKEN:-}"
  for f in "$ROOT/.env.gitlab.local" "$ROOT/.env.local"; do
    [[ -f "$f" ]] || continue
    val=$(grep -E '^GITLAB_TOKEN=' "$f" 2>/dev/null | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" || true)
    [[ -n "$val" ]] && GITLAB_TOKEN="$val"
  done
  export GITLAB_TOKEN
}

api() {
  local method="$1" path="$2"
  shift 2
  curl -fsS -X "$method" \
    -H "PRIVATE-TOKEN: ${GITLAB_TOKEN}" \
    -H "Content-Type: application/json" \
    "${GITLAB_HOST}/api/v4${path}" "$@"
}

load_token

# ─── 1. gitlab-runner binary ───────────────────────────────────────────────
if [[ ! -x "$RUNNER_BIN" ]]; then
  log "📥 Download gitlab-runner..."
  mkdir -p "$RUNNER_HOME"
  curl -fsSL -o "$RUNNER_BIN" \
    "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-linux-amd64"
  chmod +x "$RUNNER_BIN"
fi
log "✅ gitlab-runner $($RUNNER_BIN --version 2>&1 | head -1)"

# ─── 2. gitlab-ci-local (chạy CI ngay không cần GitLab cloud) ─────────────
if ! npm ls gitlab-ci-local --depth=0 &>/dev/null; then
  log "📦 Installing gitlab-ci-local..."
  npm install -D gitlab-ci-local --legacy-peer-deps --silent
fi
log "🧪 Test pipeline local (gitlab-ci-local lint-test)..."
npx gitlab-ci-local lint-test 2>&1 | tail -15 || log "⚠️  gitlab-ci-local cần Docker hoặc shell executor — bỏ qua"

# ─── 3. GitLab cloud (cần token) ───────────────────────────────────────────
if [[ -z "${GITLAB_TOKEN:-}" ]]; then
  log ""
  log "⚠️  Chưa có GITLAB_TOKEN — bỏ qua push GitLab cloud."
  log "   Thêm vào .env.local:"
  log "   GITLAB_TOKEN=glpat-xxx   # scopes: api, write_repository"
  log "   Rồi chạy lại: bash scripts/setup-gitlab-full.sh"
  log ""
  log "✅ Local CI sẵn sàng: bash scripts/ci-local.sh"
  exit 0
fi

log "🔑 GITLAB_TOKEN found — setup GitLab cloud..."

# SSH key trên GitLab account
PUBKEY=$(cat "${HOME}/.ssh/id_ed25519.pub" 2>/dev/null || cat "${HOME}/.ssh/id_rsa.pub")
KEY_TITLE="thunder-vivobook-$(hostname -s)"
if [[ -n "$PUBKEY" ]]; then
  if ! api GET "/user/keys" | python3 -c "import sys,json; keys=json.load(sys.stdin); exit(0 if any('${KEY_TITLE}' in k.get('title','') for k in keys) else 1)" 2>/dev/null; then
    log "🔐 Thêm SSH key lên GitLab..."
    api POST "/user/keys" \
      -d "$(python3 -c "import json; print(json.dumps({'title':'$KEY_TITLE','key':'''$PUBKEY'''}))")" >/dev/null || log "⚠️  SSH key có thể đã tồn tại"
  fi
fi

# Tạo project nếu chưa có
PROJECT_PATH="${GITLAB_USER}/${GITLAB_PROJECT}"
if ! api GET "/projects/${GITLAB_USER}%2F${GITLAB_PROJECT}" >/dev/null 2>&1; then
  log "📁 Tạo project ${PROJECT_PATH}..."
  api POST "/projects" \
    -d "$(python3 -c "import json; print(json.dumps({'name':'AtoEnglish','path':'${GITLAB_PROJECT}','visibility':'private','initialize_with_readme':False}))")" >/dev/null
fi
PROJECT_ID=$(api GET "/projects/${GITLAB_USER}%2F${GITLAB_PROJECT}" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
log "✅ Project id: $PROJECT_ID"

# CI/CD variables từ .env.local
set_var() {
  local key="$1" val="$2"
  [[ -n "$val" ]] || return 0
  api POST "/projects/${PROJECT_ID}/variables" \
    -d "$(python3 -c "import json; print(json.dumps({'key':'$key','value':'''$val''','protected':False,'masked':True}))")" >/dev/null 2>&1 \
    || api PUT "/projects/${PROJECT_ID}/variables/${key}" \
    -d "$(python3 -c "import json; print(json.dumps({'value':'''$val''','protected':False,'masked':True}))")" >/dev/null 2>&1 || true
}

if [[ -f "$ROOT/.env.local" ]]; then
  log "📋 Sync CI/CD variables..."
  while IFS= read -r line; do
    line="${line%%#*}"
    [[ "$line" == *"="* ]] || continue
    key="${line%%=*}"; val="${line#*=}"
    val="${val%\"}"; val="${val#\"}"; val="${val%\'}"; val="${val#\'}"
    case "$key" in
      NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)
        set_var "$key" "$val"
        ;;
    esac
  done < "$ROOT/.env.local"
fi

# Git remote + push
if ! git remote get-url gitlab &>/dev/null; then
  git remote add gitlab "git@${GITLAB_HOST#https://}:${GITLAB_USER}/${GITLAB_PROJECT}.git"
fi
log "📤 Push main → gitlab..."
git config --local atoenglish.git.primary gitlab 2>/dev/null || true
bash "$ROOT/scripts/git-push.sh" main

# Runner registration
log "🏃 Đăng ký self-hosted runner..."
REG_TOKEN=$(api POST "/projects/${PROJECT_ID}/runners" \
  -d '{"runner_type":"project_type","description":"thunder-vivobook"}' 2>/dev/null \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null || true)

if [[ -z "$REG_TOKEN" ]]; then
  log "⚠️  Lấy runner token thủ công: GitLab → Settings → CI/CD → Runners → New project runner"
  log "   Rồi: ${RUNNER_BIN} register --url ${GITLAB_HOST} --token TOKEN --executor shell --tag-list atoenglish"
else
  sudo -n "${RUNNER_BIN}" register --non-interactive \
    --url "$GITLAB_HOST" \
    --token "$REG_TOKEN" \
    --executor "shell" \
    --description "thunder-vivobook" \
    --tag-list "atoenglish,linux,self-hosted" \
    --run-untagged="false" 2>/dev/null \
  || "${RUNNER_BIN}" register --non-interactive \
    --url "$GITLAB_HOST" \
    --token "$REG_TOKEN" \
    --executor "shell" \
    --description "thunder-vivobook-user" \
    --tag-list "atoenglish,linux,self-hosted" \
    --run-untagged="false" \
    --config "${RUNNER_HOME}/config.toml" 2>/dev/null || true
fi

git config --local alias.pushall '!bash scripts/push-all-remotes.sh'

# User-level runner service
SERVICE_DST="${HOME}/.config/systemd/user/gitlab-runner-atoenglish.service"
mkdir -p "${HOME}/.config/systemd/user"
sed "s|%h|${HOME}|g" "$ROOT/scripts/gitlab-runner-user.service" > "$SERVICE_DST"
systemctl --user daemon-reload
systemctl --user enable gitlab-runner-atoenglish.service 2>/dev/null || true
if [[ -f "${RUNNER_HOME}/config.toml" ]]; then
  systemctl --user restart gitlab-runner-atoenglish.service 2>/dev/null || true
  log "✅ gitlab-runner user service started"
fi

log "✅ GitLab setup hoàn tất — https://gitlab.com/${PROJECT_PATH}"
log "   Push cả hai: git pushall"
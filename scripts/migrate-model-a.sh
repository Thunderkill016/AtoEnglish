#!/usr/bin/env bash
# Model A: GitLab = git chính + CI, Vercel connect GitLab (bỏ GitHub deploy).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
GITLAB_USER="${GITLAB_USER:-Thunderkill016}"
GITLAB_PROJECT="${GITLAB_PROJECT:-atoenglish}"
GITLAB_SSH="git@gitlab.com:${GITLAB_USER}/${GITLAB_PROJECT}.git"

log() { echo "[$(date -Iseconds)] $*"; }

log "🔄 Model A — GitLab primary + Vercel GitLab"

# 1. GitLab cloud setup (project, SSH key, variables, push)
if bash "$ROOT/scripts/setup-gitlab-full.sh"; then
  log "✅ setup-gitlab-full done"
else
  log "⚠️  setup-gitlab-full incomplete — cần GITLAB_TOKEN trong .env.local"
fi

# 2. Remotes: gitlab/origin = GitLab, github = archive
if git remote get-url github &>/dev/null; then
  log "✅ Remote github (archive) đã có"
elif git remote get-url origin &>/dev/null; then
  ORIGIN_URL=$(git remote get-url origin)
  if [[ "$ORIGIN_URL" == *"github.com"* ]]; then
    log "📦 Đổi origin → github (archive)"
    git remote rename origin github
  fi
fi

if git remote get-url gitlab &>/dev/null; then
  GL_URL=$(git remote get-url gitlab)
  log "✅ Remote gitlab: $GL_URL"
elif git remote get-url origin &>/dev/null && [[ "$(git remote get-url origin)" == *"gitlab.com"* ]]; then
  git remote rename origin gitlab 2>/dev/null || true
else
  log "➕ Thêm remote gitlab"
  git remote add gitlab "$GITLAB_SSH"
fi

# origin trỏ GitLab (chuẩn git)
if git remote get-url origin &>/dev/null; then
  if [[ "$(git remote get-url origin)" != *"gitlab.com"* ]]; then
    git remote remove origin 2>/dev/null || git remote rename origin github 2>/dev/null || true
  fi
fi
if ! git remote get-url origin &>/dev/null; then
  git remote add origin "$GITLAB_SSH"
  log "✅ origin → GitLab"
fi

# 3. Push GitLab (chỉ bật primary sau khi push OK)
log "📤 Push main → GitLab..."
if bash "$ROOT/scripts/git-push.sh" main; then
  git config --local atoenglish.git.primary gitlab
  git config --local atoenglish.gitlab.ready 1
  git config --local alias.pushmain '!bash scripts/git-push.sh'
  git branch --set-upstream-to=gitlab/main main 2>/dev/null || true
  log "✅ GitLab primary activated"
else
  log "❌ Push GitLab fail — autopilot vẫn dùng github cho đến khi có GITLAB_TOKEN"
  log "   Thêm GITLAB_TOKEN vào .env.local rồi chạy lại script này"
  exit 1
fi

log ""
log "══════════════════════════════════════════════════════════"
log " ✅ Code trên GitLab — bước cuối: Vercel connect GitLab"
log "══════════════════════════════════════════════════════════"
log ""
log "1. https://vercel.com/thunderkill016/atoenglish/settings/git"
log "2. Disconnect GitHub"
log "3. Connect GitLab → chọn ${GITLAB_USER}/${GITLAB_PROJECT}"
log "4. Production branch: main"
log ""
log "Sau đó mỗi push GitLab → Vercel tự deploy."
log "Autopilot: bash scripts/git-push.sh"
log ""
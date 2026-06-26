#!/usr/bin/env bash
# GitLab self-hosted runner — unlimited CI minutes.
set -euo pipefail

echo "GitLab Self-Hosted Runner — unlimited CI"
echo "Lấy token: GitLab → Settings → CI/CD → Runners → New runner"
echo ""

read -r -p "GitLab URL [https://gitlab.com]: " GITLAB_URL
GITLAB_URL="${GITLAB_URL:-https://gitlab.com}"
read -r -p "Registration token: " RUNNER_TOKEN
[[ -n "$RUNNER_TOKEN" ]] || exit 1

if ! command -v gitlab-runner &>/dev/null; then
  curl -fsSL "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
  sudo apt-get install -y gitlab-runner
fi

sudo gitlab-runner register \
  --non-interactive \
  --url "$GITLAB_URL" \
  --token "$RUNNER_TOKEN" \
  --executor "shell" \
  --description "thunder-vivobook-atoenglish" \
  --tag-list "atoenglish,linux,self-hosted" \
  --run-untagged="false"

echo "✅ Runner registered — tag: atoenglish"
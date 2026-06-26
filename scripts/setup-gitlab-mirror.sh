#!/usr/bin/env bash
# Thêm GitLab làm remote CI — giữ GitHub cho Vercel, push cả hai.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "GitLab mirror — CI thay GitHub Actions"
echo "GitHub giữ nguyên (Vercel deploy). GitLab chạy CI."
echo ""

if git remote get-url gitlab &>/dev/null; then
  echo "✅ Remote gitlab: $(git remote get-url gitlab)"
else
  read -r -p "GitLab SSH URL (git@gitlab.com:USER/AtoEnglish.git): " GITLAB_URL
  [[ -n "$GITLAB_URL" ]] || exit 1
  git remote add gitlab "$GITLAB_URL"
fi

git push gitlab main

echo ""
echo "Tiếp theo:"
echo "  bash scripts/setup-gitlab-runner.sh"
echo "  GitLab → CI/CD → Variables: NEXT_PUBLIC_SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY"
echo "  git config alias.pushall '!bash scripts/push-all-remotes.sh'"
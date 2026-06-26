#!/usr/bin/env bash
# Model A: chỉ push GitLab. Legacy: push github archive nếu có.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
BRANCH="${1:-main}"

bash "$ROOT/scripts/git-push.sh" "$BRANCH"

if git remote get-url github &>/dev/null; then
  git push github "$BRANCH" 2>/dev/null && echo "📦 Mirrored → github (archive)" || true
fi
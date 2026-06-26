#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
BRANCH="${1:-main}"
git push origin "$BRANCH"
if git remote get-url gitlab &>/dev/null; then
  git push gitlab "$BRANCH"
  echo "✅ Pushed origin + gitlab"
else
  echo "✅ Pushed origin (no gitlab remote)"
fi
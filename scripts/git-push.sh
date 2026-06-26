#!/usr/bin/env bash
# Push lên remote chính (GitLab khi ready, else GitHub).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
BRANCH="${1:-main}"
REMOTE="$(bash "$ROOT/scripts/git-primary.sh")"
git push "$REMOTE" "$BRANCH"
echo "✅ Pushed $BRANCH → $REMOTE"
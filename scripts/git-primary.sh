#!/usr/bin/env bash
# Remote git chính — model A: gitlab (khi ready), fallback github.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

use_gitlab() {
  git remote get-url gitlab &>/dev/null \
    && git config --local --get atoenglish.gitlab.ready 2>/dev/null | grep -q '^1$'
}

PRIMARY=$(git config --local --get atoenglish.git.primary 2>/dev/null || true)
if [[ "$PRIMARY" == "gitlab" ]] && use_gitlab; then
  echo "gitlab"
  exit 0
fi

if git remote get-url github &>/dev/null; then
  echo "github"
  exit 0
fi
echo "origin"
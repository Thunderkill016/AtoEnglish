#!/usr/bin/env bash
# Legacy compatibility command.
#
# This script intentionally performs no repository mutation. The previous
# implementation generated placeholder maintenance tasks, edited backlog files,
# committed them, and pushed directly to main. That behavior created repository
# noise and bypassed review.
#
# Backlog changes must now be made deliberately on a feature branch and reviewed
# through a pull request.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKLOG="$ROOT/docs/history/agent/AGENT_BACKLOG.md"

if [[ ! -f "$BACKLOG" ]]; then
  echo "ERROR: missing archived AGENT_BACKLOG.md" >&2
  exit 1
fi

READY_COUNT=$(grep -c '\*\*Status:\*\* `ready`' "$BACKLOG" 2>/dev/null || true)
READY_COUNT=${READY_COUNT:-0}

echo "Backlog check only: ${READY_COUNT} task(s) ready."
echo "Automatic refill, commit, and push are disabled."
echo "Create or update tasks manually on a branch and open a pull request."

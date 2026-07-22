#!/usr/bin/env bash
# Continuous autopilot is intentionally disabled. See .agent-autopilot-disabled.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLE_FILE="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLE_FILE" ]]; then
  echo "[$(date -Iseconds)] 🛑 AtoEnglish agent daemon is disabled by the project owner."
  exit 0
fi

echo "[$(date -Iseconds)] Refusing to start: the autonomous daemon has been retired."
exit 0

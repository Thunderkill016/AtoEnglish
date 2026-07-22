#!/usr/bin/env bash
# Autopilot is intentionally disabled. See .agent-autopilot-disabled.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLE_FILE="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLE_FILE" ]]; then
  echo "[$(date -Iseconds)] 🛑 AtoEnglish autopilot is disabled by the project owner."
  echo "Remove $DISABLE_FILE through an intentional reviewed change before running agents again."
  exit 3
fi

echo "[$(date -Iseconds)] Refusing to run: the autonomous orchestrator has been retired."
exit 3

#!/usr/bin/env bash
# Retired legacy headless execution compatibility command.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLED_MARKER="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLED_MARKER" ]]; then
  echo "ERROR: legacy headless execution is retired; the autopilot kill switch." >&2
else
  echo "ERROR: legacy headless execution remains retired; no autonomous replacement is installed." >&2
fi

exit 2

#!/usr/bin/env bash
# Retired legacy autopilot reporting compatibility command.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLED_MARKER="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLED_MARKER" ]]; then
  echo "ERROR: legacy autopilot reporting is retired; historical documents are immutable." >&2
else
  echo "ERROR: legacy autopilot reporting remains retired; use non-governed logs for operational state." >&2
fi

exit 2

#!/usr/bin/env bash
# Retired legacy autopilot watchdog compatibility command.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLED_MARKER="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLED_MARKER" ]]; then
  echo "ERROR: legacy autopilot watchdog is retired; it cannot restart or mutate operational state." >&2
else
  echo "ERROR: legacy autopilot watchdog remains retired; explicit reviewed restoration is required." >&2
fi

exit 2

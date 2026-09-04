#!/usr/bin/env bash
# Retired legacy picker compatibility command.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLED_MARKER="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLED_MARKER" ]]; then
  echo "ERROR: legacy picker is retired; archived Markdown is not executable authority." >&2
else
  echo "ERROR: legacy picker remains retired; use an owner-authorized Spec Kit task." >&2
fi

exit 2

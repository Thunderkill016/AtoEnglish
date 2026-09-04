#!/usr/bin/env bash
# Retired legacy backlog refill compatibility command.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DISABLED_MARKER="$ROOT/.agent-autopilot-disabled"

if [[ -f "$DISABLED_MARKER" ]]; then
  echo "ERROR: legacy backlog refill is retired; archived Markdown cannot supply active work." >&2
else
  echo "ERROR: legacy backlog refill remains retired; use an owner-authorized Spec Kit task." >&2
fi

exit 2

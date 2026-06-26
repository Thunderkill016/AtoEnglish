#!/usr/bin/env bash
# Pick the next ready task from AGENT_BACKLOG.md
# Usage: eval "$(bash scripts/agent-pick-task.sh)"

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKLOG="$ROOT/AGENT_BACKLOG.md"

if [[ ! -f "$BACKLOG" ]]; then
  echo "echo 'ERROR: AGENT_BACKLOG.md not found'" >&2
  exit 1
fi

TASK_ID=""
TASK_DESC=""

python3 - "$BACKLOG" <<'PY'
import re, sys
path = sys.argv[1]
text = open(path, encoding="utf-8").read()
blocks = re.split(r"(?=^### TASK-\d+)", text, flags=re.M)
for block in blocks:
    m = re.match(r"^### (TASK-\d+)", block)
    if not m:
        continue
    if re.search(r"- \*\*Status:\*\* `ready`", block):
        tid = m.group(1)
        desc_m = re.search(r"- \*\*Mô tả:\*\* (.+)", block)
        desc = desc_m.group(1).strip() if desc_m else ""
        print(f'TASK_ID="{tid}"')
        # Escape quotes for bash eval
        desc_esc = desc.replace("\\", "\\\\").replace('"', '\\"')
        print(f'TASK_DESC="{desc_esc}"')
        break
else:
    print('TASK_ID=""')
    print('TASK_DESC=""')
PY
#!/usr/bin/env bash
# Pick the next ready task from AGENT_BACKLOG.md
# Writes JSON to logs/agent/.next-task.json

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKLOG="$ROOT/AGENT_BACKLOG.md"
OUT="$ROOT/logs/agent/.next-task.json"
mkdir -p "$(dirname "$OUT")"

if [[ ! -f "$BACKLOG" ]]; then
  echo '{"task_id":"","task_desc":""}' > "$OUT"
  exit 1
fi

# Tự refill trước khi pick — không cần user nhắc
READY_PRE=$(grep -c '\*\*Status:\*\* `ready`' "$BACKLOG" 2>/dev/null || true)
READY_PRE=${READY_PRE:-0}
if [[ "$READY_PRE" -lt 2 ]]; then
  bash "$(dirname "$0")/agent-refill-backlog.sh" >/dev/null 2>&1 || true
fi

python3 - "$BACKLOG" "$OUT" <<'PY'
import json, re, sys

path, out = sys.argv[1], sys.argv[2]
text = open(path, encoding="utf-8").read()
result = {"task_id": "", "task_desc": ""}

for block in re.split(r"(?=^### TASK-\d+)", text, flags=re.M):
    m = re.match(r"^### (TASK-\d+)", block)
    if not m:
        continue
    if re.search(r"- \*\*Status:\*\* `ready`", block):
        result["task_id"] = m.group(1)
        desc_m = re.search(r"- \*\*Mô tả:\*\* (.+)", block)
        if desc_m:
            result["task_desc"] = desc_m.group(1).strip()
        break

with open(out, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False)
PY

# For shell callers that need env vars (safe — no eval)
TASK_ID=$(python3 -c "import json; print(json.load(open('$OUT'))['task_id'])")
TASK_DESC=$(python3 -c "import json; print(json.load(open('$OUT'))['task_desc'])")
echo "TASK_ID=\"$TASK_ID\""
# Desc may contain quotes — only print id for legacy; runners should read JSON
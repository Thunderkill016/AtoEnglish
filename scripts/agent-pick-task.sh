#!/usr/bin/env bash
# Pick the next ready task from AGENT_BACKLOG.md
# Prefer product work (UI / content / player) over empty maintenance sweeps.
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
import json
import re
import sys

path, out = sys.argv[1], sys.argv[2]
text = open(path, encoding="utf-8").read()

def is_maint(title: str, desc: str) -> bool:
    blob = f"{title} {desc}".lower()
    return any(
        k in blob
        for k in (
            "maintenance sweep",
            "autopilot maintenance",
            "không feature mới",
            "no feature mới",
            "gates only",
        )
    )

def score(title: str, desc: str) -> int:
    """Lower = better (picked first among ready)."""
    if is_maint(title, desc):
        return 100
    blob = f"{title} {desc}".lower()
    if re.search(r"\bui\b|ato surface|home redesign|header|bottom.?nav|speaking hub", blob):
        return 0
    if re.search(r"author|l-a[012]|l-b1|lesson.?spec|content", blob):
        return 1
    if re.search(r"player|quiz floor|scramble|cloze|progress", blob):
        return 2
    return 10

candidates = []
for block in re.split(r"(?=^### TASK-\d+)", text, flags=re.M):
    m = re.match(r"^### (TASK-\d+) — (.+)$", block, re.M)
    if not m:
        continue
    if not re.search(r"- \*\*Status:\*\* `ready`", block):
        continue
    tid = m.group(1)
    title = m.group(2).strip()
    desc_m = re.search(r"- \*\*Mô tả:\*\* (.+)", block)
    desc = desc_m.group(1).strip() if desc_m else ""
    num = int(tid.split("-")[1])
    candidates.append((score(title, desc), num, tid, desc))

candidates.sort(key=lambda x: (x[0], x[1]))
result = {"task_id": "", "task_desc": ""}
if candidates:
    # Prefer non-maintenance; only pick maint if nothing else ready
    non_maint = [c for c in candidates if c[0] < 100]
    pick = non_maint[0] if non_maint else candidates[0]
    result["task_id"] = pick[2]
    result["task_desc"] = pick[3]

with open(out, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False)
PY

TASK_ID=$(python3 -c "import json; print(json.load(open('$OUT'))['task_id'])")
TASK_DESC=$(python3 -c "import json; print(json.load(open('$OUT'))['task_desc'])")
echo "TASK_ID=\"$TASK_ID\""

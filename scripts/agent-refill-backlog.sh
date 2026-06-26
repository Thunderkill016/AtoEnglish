#!/usr/bin/env bash
# Tự thêm task ready từ AGENT_ROADMAP.md khi backlog thấp.
# Không cần user — daemon/orchestrator gọi mỗi cycle.
#
# Usage: bash scripts/agent-refill-backlog.sh [--dry-run]
# Env: MIN_READY=2 (default), REFILL_TARGET=4

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKLOG="$ROOT/AGENT_BACKLOG.md"
ROADMAP="$ROOT/AGENT_ROADMAP.md"
LOG_DIR="$ROOT/logs/agent"
DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1
export DRY_RUN

MIN_READY="${MIN_READY:-2}"
REFILL_TARGET="${REFILL_TARGET:-4}"

mkdir -p "$LOG_DIR"
log() { echo "[$(date -Iseconds)] $*"; }

if [[ ! -f "$BACKLOG" ]]; then
  log "❌ Missing $BACKLOG"
  exit 1
fi

READY_COUNT=$(grep -c '\*\*Status:\*\* `ready`' "$BACKLOG" 2>/dev/null || true)
READY_COUNT=${READY_COUNT:-0}

if [[ "$READY_COUNT" -ge "$MIN_READY" ]]; then
  log "✅ Backlog OK ($READY_COUNT ready ≥ $MIN_READY) — skip refill"
  exit 0
fi

NEED=$((REFILL_TARGET - READY_COUNT))
log "📭 Backlog thấp ($READY_COUNT ready) — refill tối đa $NEED task từ roadmap..."

RESULT=$(python3 - "$BACKLOG" "$ROADMAP" "$NEED" <<'PY'
import re, sys

backlog_path, roadmap_path, need_s = sys.argv[1:4]
need = int(need_s)

backlog = open(backlog_path, encoding="utf-8").read()
roadmap = open(roadmap_path, encoding="utf-8").read() if __import__("os").path.isfile(roadmap_path) else ""

existing_ids = set(re.findall(r"^### (TASK-\d+)", backlog, re.M))
ready_count = len(re.findall(r"- \*\*Status:\*\* `ready`", backlog))

pool_blocks = []
for block in re.split(r"(?=^### TASK-\d+)", roadmap, flags=re.M):
    m = re.match(r"^### (TASK-\d+) — (.+)$", block, re.M)
    if not m:
        continue
    tid, title = m.group(1), m.group(2).strip()
    if tid in existing_ids:
        continue
    desc_m = re.search(r"- \*\*Mô tả:\*\* (.+)", block)
    done_m = re.search(r"- \*\*Done khi:\*\* (.+)", block)
    if not desc_m:
        continue
    pool_blocks.append((tid, title, desc_m.group(1).strip(), done_m.group(1).strip() if done_m else "lint+test pass"))

# Sort by task number
def task_num(tid):
    return int(tid.split("-")[1])

pool_blocks.sort(key=lambda x: task_num(x[0]))

to_add = pool_blocks[:need]
if not to_add:
    # Fallback: generate maintenance tasks beyond max id
    max_n = max((task_num(t) for t in existing_ids), default=0)
    for i in range(1, need + 1):
        n = max_n + i
        tid = f"TASK-{n:03d}"
        if tid in existing_ids:
            continue
        to_add.append((
            tid,
            f"Autopilot maintenance sweep #{n}",
            "Chạy lint+test; fix failure đầu tiên; sync AGENT_PLAN nhật ký. Không feature mới.",
            "lint+test pass; 1 commit nếu có fix nhỏ",
        ))
        if len(to_add) >= need:
            break

if not to_add:
    print("ADDED=0")
    sys.exit(0)

entries = []
for tid, title, desc, done in to_add:
    entries.append(
        f"### {tid} — {title}\n"
        f"- **Status:** `ready`\n"
        f"- **Mô tả:** {desc}\n"
        f"- **Done khi:** {done}\n"
        f"- **Started:** auto-refill\n"
    )

marker = "\n---\n\n## Nhật ký agent"
if marker not in backlog:
    print("ERROR=no_marker", file=sys.stderr)
    sys.exit(1)

insert = "\n".join(entries) + "\n"
new_backlog = backlog.replace(marker, "\n" + insert + marker, 1)

today = __import__("datetime").date.today().isoformat()
log_rows = "".join(
    f"| {today} | {tid} | auto-refill từ AGENT_ROADMAP.md | ready |\n"
    for tid, *_ in to_add
)

# Append log after header row of nhật ký table (first data row)
nhật_ký_header = "| Date | Task | Result | Commit |\n|------|------|--------|--------|\n"
if nhật_ký_header in new_backlog:
    new_backlog = new_backlog.replace(nhật_ký_header, nhật_ký_header + log_rows, 1)

if not __import__("os").environ.get("DRY_RUN"):
    open(backlog_path, "w", encoding="utf-8").write(new_backlog)

ids = ",".join(t[0] for t in to_add)
print(f"ADDED={len(to_add)} IDS={ids}")
PY
)

ADDED=$(echo "$RESULT" | grep -oE 'ADDED=[0-9]+' | head -1 | cut -d= -f2)
ADDED=${ADDED:-0}
IDS=$(echo "$RESULT" | grep -oE 'IDS=[^ ]+' | head -1 | cut -d= -f2-)
IDS=${IDS:-}

if [[ "$ADDED" -eq 0 ]]; then
  log "⚠️  Không thêm được task (roadmap hết hoặc lỗi parse)"
  exit 0
fi

log "➕ Đã thêm $ADDED task: $IDS"

if [[ "$DRY_RUN" == 1 ]]; then
  log "(dry-run — không commit)"
  exit 0
fi

cd "$ROOT"
git add AGENT_BACKLOG.md
if git diff --cached --quiet; then
  log "⚠️  Không có diff sau refill"
  exit 0
fi

git commit -m "chore(agent): auto-refill backlog ($IDS) [skip ci]" --quiet
bash "$ROOT/scripts/git-push.sh" main 2>/dev/null || {
  log "⚠️  Push refill failed — task vẫn local, cycle tiếp sẽ retry"
  exit 0
}

log "✅ Refill committed + pushed"
#!/usr/bin/env bash
# Run one Grok headless agent session for the next backlog task.
# Usage: bash scripts/agent-run-headless.sh [--dry-run]

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs/agent"
mkdir -p "$LOG_DIR"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

eval "$(bash "$ROOT/scripts/agent-pick-task.sh")"

if [[ -z "${TASK_ID:-}" ]]; then
  echo "✅ Không còn task ready trong AGENT_BACKLOG.md"
  exit 0
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG_FILE="$LOG_DIR/${STAMP}_${TASK_ID}.log"

PROMPT=$(cat <<EOF
Bạn là autopilot agent 24/7 cho AtoEnglish tại $ROOT. User KHÔNG có mặt — tuyệt đối không hỏi, tự quyết.

PHASE 1 — NGHIÊN CỨU (5 phút):
- Đọc AGENTS.md, AGENT_BACKLOG.md, AGENT_PLAN.md
- Grep codebase liên quan task; xác định file cần sửa

PHASE 2 — LẬP KẾ HOẠCH:
- Cập nhật AGENT_PLAN.md: mục tiêu, bước, rủi ro cho $TASK_ID
- Nếu backlog trống: tự thêm 1–2 task P1 hợp lý vào AGENT_BACKLOG.md rồi làm task đầu

PHASE 3 — TRIỂN KHAI (task duy nhất): $TASK_ID
$TASK_DESC

Quy trình:
1. Status → in_progress trong AGENT_BACKLOG.md
2. Implement tối thiểu, đúng phạm vi
3. npm run lint && npm run test
4. Pass → commit + push main; status done + nhật ký + SHA
5. Blocked (thiếu secret) → status blocked, chuyển task tiếp theo ready nếu có thể
6. Fail 2 lần → blocked + ghi lý do

Không chờ user. Tự debug. Ưu tiên ship từng task nhỏ.
EOF
)

echo "🤖 Agent session: $TASK_ID"
echo "📝 Log: $LOG_FILE"

if [[ "$DRY_RUN" == 1 ]]; then
  echo "--- DRY RUN PROMPT ---"
  echo "$PROMPT"
  exit 0
fi

if ! command -v grok >/dev/null 2>&1; then
  echo "❌ grok CLI not found. Install or add to PATH."
  exit 1
fi

cd "$ROOT"

# Headless autopilot — auto-approve tools, cap turns, high effort
set +e
grok -p "$PROMPT" \
  --cwd "$ROOT" \
  --yolo \
  --max-turns 80 \
  --effort high \
  --output-format plain \
  2>&1 | tee "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}
set -e

echo "exit_code=$EXIT_CODE" >> "$LOG_FILE"
exit "$EXIT_CODE"
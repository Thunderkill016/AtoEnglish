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
Bạn là autopilot agent cho repo AtoEnglish tại $ROOT.

ĐỌC TRƯỚC:
- AGENTS.md
- AGENT_BACKLOG.md

NHIỆM VỤ DUY NHẤT: $TASK_ID
$TASK_DESC

Quy trình bắt buộc:
1. Đổi status task trong AGENT_BACKLOG.md thành in_progress
2. Implement đúng phạm vi task — không refactor lan man
3. Chạy: npm run lint && npm run test (npm run build chỉ khi đổi build-critical)
4. Nếu pass: commit + push origin main; đổi status done + ghi nhật ký agent
5. Nếu fail 2 lần: status blocked + ghi lý do

Không hỏi user. Tự debug và hoàn thành.
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
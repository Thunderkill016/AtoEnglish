#!/usr/bin/env bash
# Run one Grok headless agent session for the next backlog task.
# Usage: bash scripts/agent-run-headless.sh [--dry-run]

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_DIR="$ROOT/logs/agent"
TASK_FILE="$LOG_DIR/.next-task.json"
mkdir -p "$LOG_DIR"

DRY_RUN=0
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN=1

bash "$ROOT/scripts/agent-pick-task.sh" >/dev/null

TASK_ID=$(python3 -c "import json; print(json.load(open('$TASK_FILE'))['task_id'])")
TASK_DESC=$(python3 -c "import json; print(json.load(open('$TASK_FILE'))['task_desc'])")

if [[ -z "$TASK_ID" ]]; then
  echo "✅ Không còn task ready trong AGENT_BACKLOG.md"
  exit 0
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG_FILE="$LOG_DIR/${STAMP}_${TASK_ID}.log"
PROMPT_FILE="$LOG_DIR/${STAMP}_${TASK_ID}.prompt.txt"

BLUEPRINT_BLOCK=""
if echo "$TASK_ID $TASK_DESC" | grep -qiE 'unit|content|lesson|curriculum|practiceTranslate|cumulative|l1_|blueprint|SDL'; then
  BLUEPRINT_BLOCK="$(cd "$ROOT" && npx tsx scripts/print-lesson-blueprint.mjs 2>/dev/null || true)"
fi

UI_MINIMAL_BLOCK=""
if echo "$TASK_ID" | grep -qiE '^UI-'; then
  UI_MINIMAL_BLOCK="1"
fi

python3 - "$ROOT" "$TASK_ID" "$TASK_DESC" "$PROMPT_FILE" "$BLUEPRINT_BLOCK" "$UI_MINIMAL_BLOCK" <<'PY'
import sys
root, task_id, task_desc, out, blueprint, ui_flag = sys.argv[1:7]
content_rules = ""
ui_rules = ""
if ui_flag.strip():
    ui_rules = """
KẾ HOẠCH TỐI GIẢN (research-backed — bắt buộc UI-*):
- Metric chính: time-to-lesson ≤2 tap, ≤10s tới section Khởi động
- Primitives: src/components/design-system/ (Screen, LargeTitle, ContinueCard, PrimaryRow, ThinProgress)
- Hick: ≤1 primary CTA mỗi màn; progressive disclosure
- Cognitive load: xóa extraneous chrome (widget, gradient, 4-color bar) — giữ germane load (IPOR steps)
- KHÔNG đổi SECTION_ORDER, learning-flow.ts, UnitTemplate logic học
- Tham chiếu: WarmupSection.tsx + lesson-ui/ đã migrate
- Verify: npm run lint && npm run test; UI task có e2e → npm run e2e:time-to-lesson
- Shell 3-tab đã ship: Học/Ôn/Tôi — không revert
"""
if blueprint.strip():
    content_rules = f"""
CHUẨN BÀI HỌC (bắt buộc khi sửa unit*.ts):
- Tham chiếu trung tâm: lesson-center-reference.ts (BC ESA, CELTA, CEFR, Nation, CLT VN)
- Cách xây nội dung = cách học — 1 khung: lesson-blueprint.ts
- Mẫu vàng: src/lib/data/units/unit1.ts (comment block + field)
- Luồng app: learning-flow.ts (IPOR 10 bước)
- Gate: npm run test:content-standard + bash scripts/audit-lesson-content.sh

{blueprint}
"""
prompt = f"""Bạn là autopilot agent 24/7 cho AtoEnglish tại {root}. User KHÔNG có mặt — tuyệt đối không hỏi, tự quyết.

PHASE 1 — NGHIÊN CỨU (5 phút):
- Đọc AGENTS.md, AGENT_BACKLOG.md, AGENT_PLAN.md, CONTENT_STYLE.md §6–7
- Grep codebase liên quan task; xác định file cần sửa
{content_rules}{ui_rules}
PHASE 2 — LẬP KẾ HOẠCH:
- Cập nhật AGENT_PLAN.md: mục tiêu, bước, rủi ro cho {task_id}
- Backlog thấp: chạy `bash scripts/agent-refill-backlog.sh` (đọc AGENT_ROADMAP.md) — KHÔNG hỏi user

PHASE 3 — TRIỂN KHAI (task duy nhất): {task_id}
{task_desc}

Quy trình:
1. Status → in_progress trong AGENT_BACKLOG.md
2. Implement tối thiểu, đúng phạm vi
3. npm run lint && npm run test
4. Pass → commit + `bash scripts/git-push.sh main` (GitLab primary); status done + nhật ký + SHA
5. Blocked (thiếu secret) → status blocked, chuyển task tiếp theo ready nếu có thể
6. Fail 2 lần → blocked + ghi lý do

Không chờ user. Tự debug. Ưu tiên ship từng task nhỏ.
"""
open(out, "w", encoding="utf-8").write(prompt)
PY

echo "🤖 Agent session: $TASK_ID"
echo "📝 Log: $LOG_FILE"

if [[ "$DRY_RUN" == 1 ]]; then
  cat "$PROMPT_FILE"
  exit 0
fi

if ! command -v grok >/dev/null 2>&1; then
  echo "❌ grok CLI not found. Install or add to PATH."
  exit 1
fi

cd "$ROOT"

set +e
grok --prompt-file "$PROMPT_FILE" \
  --cwd "$ROOT" \
  --yolo \
  --max-turns 80 \
  --output-format plain \
  2>&1 | tee "$LOG_FILE"
EXIT_CODE=${PIPESTATUS[0]}
set -e

echo "exit_code=$EXIT_CODE" >> "$LOG_FILE"
exit "$EXIT_CODE"
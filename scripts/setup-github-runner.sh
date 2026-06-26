#!/usr/bin/env bash
# Self-hosted GitHub Actions runner — KHÔNG tính vào 2000 phút/tháng (private repo).
#
# Chạy 1 lần trên máy dev (laptop luôn bật khi autopilot chạy):
#   bash scripts/setup-github-runner.sh
#
# Sau đó trong .github/workflows/ci.yml đổi runs-on: self-hosted (hoặc dùng label).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
RUNNER_DIR="${HOME}/actions-runner-atoenglish"
REPO="Thunderkill016/AtoEnglish"

echo "═══════════════════════════════════════════════════════════"
echo " GitHub Self-Hosted Runner — AtoEnglish"
echo " Private repo: runner KHÔNG tốn GitHub Actions minutes"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "Bước 1: Lấy registration token"
echo "  → https://github.com/${REPO}/settings/actions/runners/new"
echo "  → Chọn Linux → copy token (hết hạn sau ~1 giờ)"
echo ""

read -r -p "Paste registration token: " RUNNER_TOKEN
[[ -n "$RUNNER_TOKEN" ]] || { echo "Token required"; exit 1; }

mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [[ ! -f ./config.sh ]]; then
  echo "📥 Downloading runner..."
  RUNNER_VERSION="2.321.0"
  curl -fsSL -o actions-runner.tar.gz \
    "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz"
  tar xzf actions-runner.tar.gz
  rm actions-runner.tar.gz
fi

./config.sh \
  --url "https://github.com/${REPO}" \
  --token "$RUNNER_TOKEN" \
  --name "thunder-vivobook-atoenglish" \
  --labels "self-hosted,linux,atoenglish" \
  --work "_work" \
  --unattended \
  --replace

echo ""
echo "📦 Cài systemd user service..."
SERVICE_DIR="${HOME}/.config/systemd/user"
mkdir -p "$SERVICE_DIR"

cat > "$SERVICE_DIR/github-runner-atoenglish.service" <<EOF
[Unit]
Description=GitHub Actions Runner (AtoEnglish self-hosted)
After=network.target

[Service]
Type=simple
WorkingDirectory=${RUNNER_DIR}
ExecStart=${RUNNER_DIR}/run.sh
Restart=always
RestartSec=10

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable github-runner-atoenglish.service
systemctl --user start github-runner-atoenglish.service

echo ""
echo "✅ Runner installed!"
echo "   Status: systemctl --user status github-runner-atoenglish.service"
echo ""
echo "Để CI dùng runner này, sửa workflow:"
echo "   runs-on: [self-hosted, linux, atoenglish]"
echo ""
echo "Lưu ý: máy tắt = runner offline; autopilot local vẫn chạy lint+test trước push."
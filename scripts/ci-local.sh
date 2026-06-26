#!/usr/bin/env bash
# CI chạy trên máy local — thay GitHub Actions (0 phút quota).
# Orchestrator gọi script này TRƯỚC mỗi agent session.
#
# Usage:
#   bash scripts/ci-local.sh           # lint + tsc + test
#   CI_LOCAL_BUILD=1 bash scripts/ci-local.sh   # + build (chậm, ~2 phút)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "🔍 CI local — lint..."
npm run lint --silent

echo "🔍 CI local — typecheck..."
npx tsc --noEmit

echo "🔍 CI local — unit tests..."
npm run test --silent

if [[ "${CI_LOCAL_BUILD:-0}" == "1" ]]; then
  echo "🔍 CI local — build..."
  npm run build
fi

echo "✅ CI local pass"
#!/usr/bin/env bash
# scripts/smoke-learn.sh
# Production smoke test for /learn B2 unit (post TASK-036 audio rewrite).
# Verifies curl 200 for learn page (follows redirect) and sample static audio.
# Usage: bash scripts/smoke-learn.sh
# Or: npm run smoke:learn
# Env: SMOKE_URL to override (default prod)

set -euo pipefail

PROD_URL="${SMOKE_URL:-https://atoenglish.vercel.app}"

echo "🧪 AtoEnglish smoke: learn B2 + native audio (TASK-040)"
echo "   Target: $PROD_URL"
echo ""

check_200() {
  local url="$1"
  local label="$2"
  echo -n "  • $label ... "
  local code
  # -f fail on http>=400, -s silent, -L follow, --max-redirs, -o discard, -w code only
  code=$(curl -fsL --max-redirs 5 --connect-timeout 10 --max-time 20 -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  if [[ "$code" == "200" ]]; then
    echo "✅ HTTP $code"
    return 0
  else
    echo "❌ HTTP $code"
    return 1
  fi
}

ok=1
check_200 "${PROD_URL}/learn/unit-33" "/learn/unit-33 (B2 protected → login 200 after follow)" || ok=0
check_200 "${PROD_URL}/audio/unit33/hypothetical.mp3" "/audio/unit33/hypothetical.mp3 (static MP3 via unitN→unit-N rewrite)" || ok=0

echo ""
if [[ "$ok" == "1" ]]; then
  echo "✅ Smoke passed: both 200 OK on production."
  exit 0
else
  echo "❌ Smoke FAILED — see above."
  echo "   (If just-deployed, wait for Vercel + retry; or check https://atoenglish.vercel.app)"
  exit 1
fi

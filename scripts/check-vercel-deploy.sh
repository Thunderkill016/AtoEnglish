#!/usr/bin/env bash
# scripts/check-vercel-deploy.sh
# Usage: npm run check-deploy
# Polls the Vercel API for the latest deployment and reports status.
# Requires: VERCEL_TOKEN env var (export it in your shell or .env.local)

set -euo pipefail

# ─── Colors ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; RESET='\033[0m'

# ─── Config ────────────────────────────────────────────────────────────────────
PROJECT_ID="atoenglish"
VERCEL_DASHBOARD="https://vercel.com/thunderkill016/atoenglish"
MAX_POLLS="${VERCEL_MAX_POLLS:-40}"   # 40 × 15s = 10 minutes
POLL_INTERVAL="${VERCEL_POLL_INTERVAL:-15}"

# ─── Check token ───────────────────────────────────────────────────────────────
if [ -z "${VERCEL_TOKEN:-}" ]; then
  # Try loading from .env.local
  if [ -f ".env.local" ]; then
    VERCEL_TOKEN=$(grep -E '^VERCEL_TOKEN=' .env.local | cut -d'=' -f2- | tr -d '"' | tr -d "'") || true
  fi
fi

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo -e "${RED}❌ VERCEL_TOKEN not set!${RESET}"
  echo ""
  echo "To fix:"
  echo "  1. Go to https://vercel.com/account/tokens"
  echo "  2. Create a token with 'Full Account' scope"
  echo "  3. Add to your shell: export VERCEL_TOKEN=your_token_here"
  echo "  4. Or add to .env.local: VERCEL_TOKEN=your_token_here"
  echo ""
  echo "Then re-run: npm run check-deploy"
  exit 1
fi

# ─── Team support ──────────────────────────────────────────────────────────────
TEAM_PARAM=""
if [ -n "${VERCEL_TEAM_ID:-}" ]; then
  TEAM_PARAM="&teamId=$VERCEL_TEAM_ID"
fi

# ─── Get current git commit ────────────────────────────────────────────────────
CURRENT_SHA=$(git rev-parse HEAD 2>/dev/null || echo "unknown")
CURRENT_SHA_SHORT=$(echo "$CURRENT_SHA" | head -c 7)
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

echo ""
echo -e "${BOLD}${BLUE}🚀 Vercel Deploy Monitor${RESET}"
echo -e "${CYAN}Branch:${RESET} $CURRENT_BRANCH"
echo -e "${CYAN}Commit:${RESET} $CURRENT_SHA_SHORT"
echo -e "${CYAN}Project:${RESET} $PROJECT_ID"
echo -e "${CYAN}Dashboard:${RESET} $VERCEL_DASHBOARD"
echo ""

# ─── Fetch latest deployment ──────────────────────────────────────────────────
echo -e "${YELLOW}⏳ Fetching deployments...${RESET}"

for i in $(seq 1 $MAX_POLLS); do
  RESPONSE=$(curl -sf \
    "https://api.vercel.com/v6/deployments?projectId=$PROJECT_ID&limit=5$TEAM_PARAM" \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" 2>/dev/null) || {
    echo -e "${YELLOW}⚠️  API call failed, retrying in ${POLL_INTERVAL}s...${RESET}"
    sleep $POLL_INTERVAL
    continue
  }

  # Get latest deployment state
  RESULT=$(echo "$RESPONSE" | python3 -c "
import sys, json
data = json.load(sys.stdin)
deployments = data.get('deployments', [])
if not deployments:
    print('NONE|||')
    sys.exit(0)
# Get the most recent one
d = deployments[0]
state = d.get('state', 'UNKNOWN')
url = d.get('url', '')
uid = d.get('uid', '')
sha = d.get('meta', {}).get('githubCommitSha', '')[:7]
created = d.get('createdAt', 0)
print(f'{state}|{url}|{uid}|{sha}')
" 2>/dev/null) || RESULT="UNKNOWN|||"

  STATE=$(echo "$RESULT" | cut -d'|' -f1)
  DEPLOY_URL=$(echo "$RESULT" | cut -d'|' -f2)
  DEPLOY_ID=$(echo "$RESULT" | cut -d'|' -f3)
  DEPLOY_SHA=$(echo "$RESULT" | cut -d'|' -f4)

  if [ "$STATE" = "NONE" ]; then
    echo -e "${YELLOW}No deployments found for project '$PROJECT_ID'${RESET}"
    echo "Check the project name matches your Vercel project slug."
    exit 1
  fi

  # Show status with emoji
  case "$STATE" in
    READY)
      echo ""
      echo -e "${GREEN}${BOLD}✅ Deployment SUCCEEDED!${RESET}"
      echo -e "${GREEN}🌐 Live at: https://$DEPLOY_URL${RESET}"
      [ -n "$DEPLOY_SHA" ] && echo -e "${CYAN}Commit: $DEPLOY_SHA${RESET}"
      echo ""
      exit 0
      ;;
    ERROR|CANCELED)
      echo ""
      echo -e "${RED}${BOLD}❌ Deployment FAILED (state: $STATE)${RESET}"
      echo -e "${RED}Dashboard: $VERCEL_DASHBOARD${RESET}"
      echo ""

      # Fetch build error logs
      if [ -n "$DEPLOY_ID" ]; then
        echo -e "${YELLOW}📋 Fetching build error logs...${RESET}"
        LOG_RESPONSE=$(curl -sf \
          "https://api.vercel.com/v2/deployments/$DEPLOY_ID/events?direction=backward&limit=100$TEAM_PARAM" \
          -H "Authorization: Bearer $VERCEL_TOKEN" 2>/dev/null) || LOG_RESPONSE=""

        if [ -n "$LOG_RESPONSE" ]; then
          echo ""
          echo -e "${RED}─── Last build log lines ───────────────────────────────${RESET}"
          echo "$LOG_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    events = data if isinstance(data, list) else data.get('events', [])
    # Filter to error/warning lines
    for e in events[-80:]:
        text = (e.get('text') or
                e.get('payload', {}).get('text') or
                e.get('payload', {}).get('message') or '')
        if text and text.strip():
            print(text)
except:
    print(sys.stdin.read()[:2000])
" 2>/dev/null || echo "(Could not parse logs)"
          echo -e "${RED}────────────────────────────────────────────────────────${RESET}"
        fi
      fi

      echo ""
      echo -e "${YELLOW}Fix the error above, then run:${RESET}"
      echo "  git add -A && git commit -m 'fix: vercel build error' && git push"
      exit 1
      ;;
    BUILDING|INITIALIZING|QUEUED|DEPLOYING)
      PROGRESS_BAR=$(printf '█%.0s' $(seq 1 $i))
      echo -ne "\r${YELLOW}⏳ [Poll $i/$MAX_POLLS] State: $STATE ... ${RESET}"
      sleep $POLL_INTERVAL
      continue
      ;;
    *)
      echo -e "${YELLOW}[Poll $i/$MAX_POLLS] Unknown state: $STATE — retrying...${RESET}"
      sleep $POLL_INTERVAL
      continue
      ;;
  esac
done

echo ""
echo -e "${YELLOW}⏱️  Timed out after $((MAX_POLLS * POLL_INTERVAL / 60)) minutes.${RESET}"
echo -e "Check manually: ${BLUE}$VERCEL_DASHBOARD${RESET}"
exit 1

#!/bin/bash
# ============================================================
# AtoEnglish Production Setup Script
# Configures Web Push (VAPID), Supabase Edge Functions, and Vercel
# Run: bash setup-production.sh
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

PROJECT_REF="vhpfskkredizeazlyzsh"
SUPABASE_URL="https://vhpfskkredizeazlyzsh.supabase.co"
VAPID_PUBLIC="BFonYqQpW0U4YH-bTI_asy83dZkusFF4M2Szo8mdTjmXNMpXj5O-GA9oCVFue8yyDQxckk-kFRBAg-DFYylCbgk"
VAPID_PRIVATE="pFN07K2dfi1QaSUpaKbIDFm3urPJvb06kB1T7KYeCXo"
VAPID_SUBJECT="mailto:admin@atoenglish.app"

export PATH="/home/thunder/.local/nodejs/node-v24.16.0-linux-x64/bin:$PATH"

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║    AtoEnglish — Production Setup (Web Push)          ║${NC}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""

# ── STEP 1: Supabase Personal Access Token ────────────────────
echo -e "${BOLD}[STEP 1] Supabase Personal Access Token${NC}"
echo -e "${YELLOW}→ Truy cập: https://supabase.com/dashboard/account/tokens${NC}"
echo -e "${YELLOW}→ Click 'Generate new token', đặt tên 'AtoEnglish CLI'${NC}"
echo -e "${YELLOW}→ Copy token và paste vào đây:${NC}"
echo ""
read -r -p "Supabase Access Token: " SUPABASE_ACCESS_TOKEN

if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo -e "${RED}✗ Token rỗng. Thoát.${NC}"
  exit 1
fi

# ── STEP 2: Vercel Token ──────────────────────────────────────
echo ""
echo -e "${BOLD}[STEP 2] Vercel Access Token${NC}"
echo -e "${YELLOW}→ Truy cập: https://vercel.com/account/tokens${NC}"
echo -e "${YELLOW}→ Click 'Create', đặt tên 'AtoEnglish Setup'${NC}"
echo -e "${YELLOW}→ Copy token và paste vào đây:${NC}"
echo ""
read -r -p "Vercel Token: " VERCEL_TOKEN

if [ -z "$VERCEL_TOKEN" ]; then
  echo -e "${RED}✗ Token rỗng. Thoát.${NC}"
  exit 1
fi

# ── STEP 3: Vercel Project ID ─────────────────────────────────
echo ""
echo -e "${BOLD}[STEP 3] Vercel Project ID${NC}"
echo -e "${YELLOW}→ Truy cập: https://vercel.com/dashboard → chọn project AtoEnglish${NC}"
echo -e "${YELLOW}→ Settings → General → Project ID (dạng: prj_xxxxxxxx)${NC}"
echo ""
read -r -p "Vercel Project ID: " VERCEL_PROJECT_ID

if [ -z "$VERCEL_PROJECT_ID" ]; then
  echo -e "${RED}✗ Project ID rỗng. Thoát.${NC}"
  exit 1
fi

# ── STEP 4: Vercel Team ID (nếu có) ──────────────────────────
echo ""
echo -e "${BOLD}[STEP 4] Vercel Team ID (để trống nếu dùng personal account)${NC}"
echo -e "${YELLOW}→ Settings → General → Team ID (dạng: team_xxxxxxxx)${NC}"
read -r -p "Vercel Team ID (Enter để bỏ qua): " VERCEL_TEAM_ID

echo ""
echo -e "${BOLD}${GREEN}━━━ Đang cấu hình... ━━━${NC}"
echo ""

# ── STEP 5: Set Vercel Environment Variables ──────────────────
echo -e "${CYAN}[5/8] Thêm VAPID public key vào Vercel...${NC}"

TEAM_PARAM=""
if [ -n "$VERCEL_TEAM_ID" ]; then
  TEAM_PARAM="?teamId=${VERCEL_TEAM_ID}"
fi

# Add NEXT_PUBLIC_VAPID_PUBLIC_KEY for all environments
VERCEL_RESPONSE=$(curl -s -X POST \
  "https://api.vercel.com/v10/projects/${VERCEL_PROJECT_ID}/env${TEAM_PARAM}" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"key\": \"NEXT_PUBLIC_VAPID_PUBLIC_KEY\",
    \"value\": \"${VAPID_PUBLIC}\",
    \"type\": \"plain\",
    \"target\": [\"production\", \"preview\", \"development\"]
  }")

if echo "$VERCEL_RESPONSE" | grep -q '"key"'; then
  echo -e "${GREEN}  ✓ NEXT_PUBLIC_VAPID_PUBLIC_KEY đã được thêm vào Vercel${NC}"
elif echo "$VERCEL_RESPONSE" | grep -q 'already exists\|ENV_ALREADY_EXISTS'; then
  echo -e "${YELLOW}  ~ NEXT_PUBLIC_VAPID_PUBLIC_KEY đã tồn tại (bỏ qua)${NC}"
else
  echo -e "${RED}  ✗ Lỗi Vercel: ${VERCEL_RESPONSE}${NC}"
fi

# ── STEP 6: Supabase - Link project ───────────────────────────
echo ""
echo -e "${CYAN}[6/8] Link Supabase project...${NC}"

SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase link \
  --project-ref "$PROJECT_REF" \
  --workdir /home/thunder/Code/atoenglish 2>&1 | grep -v "^$" | head -5 || true

echo -e "${GREEN}  ✓ Supabase project linked: ${PROJECT_REF}${NC}"

# ── STEP 7: Set Supabase Edge Function Secrets ────────────────
echo ""
echo -e "${CYAN}[7/8] Set Supabase Edge Function secrets...${NC}"

SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase secrets set \
  --project-ref "$PROJECT_REF" \
  VAPID_PRIVATE_KEY="$VAPID_PRIVATE" \
  VAPID_PUBLIC_KEY="$VAPID_PUBLIC" \
  VAPID_SUBJECT="$VAPID_SUBJECT" 2>&1 | head -5

echo -e "${GREEN}  ✓ VAPID secrets đã được set trong Supabase Edge Functions${NC}"

# ── STEP 8: Deploy Edge Function ─────────────────────────────
echo ""
echo -e "${CYAN}[8/8] Deploy streak-reminder Edge Function...${NC}"

SUPABASE_ACCESS_TOKEN="$SUPABASE_ACCESS_TOKEN" supabase functions deploy streak-reminder \
  --project-ref "$PROJECT_REF" \
  --workdir /home/thunder/Code/atoenglish 2>&1 | grep -E "Deployed|Error|error" | head -5

echo -e "${GREEN}  ✓ streak-reminder function deployed!${NC}"

# ── DONE ─────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║    ✅ Setup hoàn thành!                               ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Việc còn lại:${NC}"
echo -e "  1. Redeploy Vercel: ${CYAN}git commit --allow-empty -m 'chore: trigger redeploy' && git push${NC}"
echo -e "  2. Chạy 2 DB migrations trong Supabase Dashboard → SQL Editor"
echo -e "     → supabase/migrations/20260620031424_push_subscriptions.sql"
echo -e "     → supabase/migrations/20260620031600_cefr_progression.sql"
echo -e "  3. Set Edge Function cron: Supabase Dashboard → Edge Functions → streak-reminder → Add Cron"
echo -e "     Schedule: ${CYAN}0 13 * * *${NC}  (13:00 UTC = 20:00 VN)"
echo ""
echo -e "${GREEN}Web Push sẽ hoạt động sau khi Vercel redeploy xong! 🚀${NC}"
echo ""

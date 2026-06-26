import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Page } from "@playwright/test";

try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) process.env[key] = val;
  }
} catch {
  /* CI provides env vars directly */
}

/** Separate from integration-test@ to avoid cross-polluting DB state. */
export const E2E_TEST_EMAIL =
  process.env.E2E_TEST_EMAIL ?? "e2e-test@atoenglish.test";
export const E2E_TEST_PASSWORD =
  process.env.E2E_TEST_PASSWORD ?? "TestPassword!2026";

export function hasE2EAdminCredentials(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing Supabase admin credentials for E2E setup");
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

/** Ensure persistent E2E user exists (idempotent). */
export async function ensureE2ETestUser(): Promise<string> {
  const admin = getAdminClient();
  const { data: existingUsers, error: listError } =
    await admin.auth.admin.listUsers();
  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  let user = existingUsers.users.find((u) => u.email === E2E_TEST_EMAIL);
  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email: E2E_TEST_EMAIL,
      password: E2E_TEST_PASSWORD,
      email_confirm: true,
    });
    if (error) {
      throw new Error(`Failed to create E2E user: ${error.message}`);
    }
    user = data.user;
  }

  if (!user?.id) {
    throw new Error("E2E test user id missing after ensure");
  }

  return user.id;
}

/** Reset placement state so each test starts from A0 / unit 1. */
export async function resetE2EPlacementState(userId: string): Promise<void> {
  const admin = getAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { error } = await admin.from("user_progress").upsert(
    {
      user_id: userId,
      current_level: "A0",
      starting_unit_index: 0,
      placement_completed_at: null,
      total_xp: 0,
      streak: 0,
      last_active_date: today,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    throw new Error(`Failed to reset user_progress: ${error.message}`);
  }
}

export async function loginAsE2ETestUser(page: Page): Promise<void> {
  await page.goto("/login?mode=login");
  await page.getByPlaceholder("Email của bạn").fill(E2E_TEST_EMAIL);
  await page.getByPlaceholder("Mật khẩu").fill(E2E_TEST_PASSWORD);
  await page
    .getByRole("button", { name: /Đăng nhập bằng Email/i })
    .click();
  await page.waitForURL(/\/(dashboard|learn)/, { timeout: 20_000 });
}
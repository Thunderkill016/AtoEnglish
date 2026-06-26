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

/** Set user to B1+ so /learn/unit-19 is in unlocked range (UI + for test realism). */
export async function setE2EStartingUnit(userId: string, startingIndex: number, level = "B1"): Promise<void> {
  const admin = getAdminClient();
  const today = new Date().toISOString().split("T")[0];
  const { error } = await admin.from("user_progress").upsert(
    {
      user_id: userId,
      current_level: level,
      starting_unit_index: startingIndex,
      total_xp: 300,
      streak: 1,
      last_active_date: today,
    },
    { onConflict: "user_id" },
  );
  if (error) {
    throw new Error(`Failed to set starting unit: ${error.message}`);
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

/** Find user id by email (for post-signup verification). */
export async function getE2EUserIdByEmail(email: string): Promise<string | null> {
  const admin = getAdminClient();
  const { data: users, error } = await admin.auth.admin.listUsers();
  if (error) {
    throw new Error(`listUsers failed: ${error.message}`);
  }
  const match = users.users.find((u) => u.email === email);
  return match?.id ?? null;
}

/** Create temp confirmed user via admin (avoids client signUp rate limits + email confirm in E2E). */
export async function createTempConfirmedE2EUser(email: string, password: string): Promise<string> {
  const admin = getAdminClient();
  // cleanup prior if any
  await deleteE2EUserByEmail(email);
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data?.user?.id) {
    throw new Error(`createTempConfirmedE2EUser failed: ${error?.message}`);
  }
  return data.user.id;
}

/** Force email confirm so signUp flow can proceed in E2E without mailbox. */
export async function forceConfirmE2EUserEmail(userId: string): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (error) {
    // non-fatal in some flows; log but continue
    console.warn(`[e2e] forceConfirm warning for ${userId}: ${error.message}`);
  }
}

/** Delete a temp E2E signup user (and let RLS/cascade handle profile rows). */
export async function deleteE2EUserByEmail(email: string): Promise<void> {
  const admin = getAdminClient();
  const { data: users } = await admin.auth.admin.listUsers();
  const user = users.users.find((u) => u.email === email);
  if (!user?.id) return;
  // Best effort delete profile/progress first (admin bypasses RLS)
  await admin.from("user_onboarding_profile").delete().eq("user_id", user.id);
  await admin.from("user_progress").delete().eq("user_id", user.id);
  await admin.auth.admin.deleteUser(user.id);
}

/** Verify the persisted values from signup flow. */
export async function verifyOnboardingPersistence(
  userId: string,
  expected: { goal: string; obstacle: string; daily_minutes: number; daily_xp_goal: number },
): Promise<void> {
  const admin = getAdminClient();
  const { data: profile, error: pErr } = await admin
    .from("user_onboarding_profile")
    .select("goal, obstacle, daily_minutes")
    .eq("user_id", userId)
    .single();
  if (pErr || !profile) {
    throw new Error(`user_onboarding_profile not found or error: ${pErr?.message}`);
  }
  if (
    profile.goal !== expected.goal ||
    profile.obstacle !== expected.obstacle ||
    profile.daily_minutes !== expected.daily_minutes
  ) {
    throw new Error(
      `profile mismatch: got ${JSON.stringify(profile)} want ${JSON.stringify(expected)}`,
    );
  }

  const { data: progress, error: prErr } = await admin
    .from("user_progress")
    .select("daily_xp_goal")
    .eq("user_id", userId)
    .single();
  if (prErr || !progress) {
    throw new Error(`user_progress not found: ${prErr?.message}`);
  }
  if (progress.daily_xp_goal !== expected.daily_xp_goal) {
    throw new Error(
      `daily_xp_goal mismatch: got ${progress.daily_xp_goal} want ${expected.daily_xp_goal}`,
    );
  }
}

/** Simulate the persist side-effect that /auth/callback (or instant signUp) performs for new onboarding signups.
 * Used in E2E when email confirm prevents direct data.user path; emulates the query param values.
 */
export async function simulateCallbackOnboardingPersist(
  userId: string,
  target: string,
  obstacle: string,
  dailyMinutes: number,
  dailyXpGoal: number,
  mappedLevel = "A0",
): Promise<void> {
  const admin = getAdminClient();

  // Clean prior rows for this test user to ensure fresh values (idempotent for E2E)
  await admin.from("user_onboarding_profile").delete().eq("user_id", userId);
  await admin.from("user_progress").delete().eq("user_id", userId);

  await admin.from("user_progress").upsert(
    {
      user_id: userId,
      current_level: mappedLevel,
      starting_unit_index: 0,
      streak: 0,
      total_xp: 0,
      daily_xp_goal: dailyXpGoal,
    },
    { onConflict: "user_id" },
  );

  await admin.from("user_onboarding_profile").upsert(
    {
      user_id: userId,
      goal: target,
      obstacle: obstacle,
      daily_minutes: dailyMinutes,
    },
    { onConflict: "user_id" },
  );
}
/**
 * Integration Test Setup
 *
 * Strategy:
 * - Create a persistent test user via Supabase Admin API
 * - Sign in as that user to get a real JWT
 * - Mock Next.js server-only modules with vi.mock (hoisted)
 * - Mock @/lib/supabase/server via globalThis reference so the factory can
 *   return a client that is set asynchronously in beforeAll
 * - Each test suite cleans up its own DB rows in afterAll
 */

// Load env FIRST — Vitest fork workers don't inherit process.env from config
// Use fs directly for maximum reliability across fork/thread workers
import { readFileSync } from "fs";
import { resolve } from "path";

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
} catch { /* .env.local not found — CI uses real env vars */ }

import { createClient } from "@supabase/supabase-js";
import { vi, beforeAll, afterAll } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// ── Env ─────────────────────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const TEST_EMAIL = "integration-test@atoenglish.test";
const TEST_PASSWORD = "TestPassword!2026";

// ── Admin client (bypasses RLS) ───────────────────────────────────────────
export const adminClient = createClient<Database>(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Test user client (set in beforeAll, referenced via globalThis) ─────────
export let testUserId: string;

// globalThis bridge: vi.mock factory runs at import time (hoisted),
// but createClient() is called at test runtime — AFTER beforeAll sets the client.
declare global {
   
  var __testSupabaseClient: SupabaseClient<Database> | undefined;
   
  var __testUserId: string | undefined;
}

// ── Mock Next.js modules (hoisted by Vitest) ─────────────────────────────
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: unknown) => fn),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers({
    "x-forwarded-for": "127.0.0.1",
  })),
  cookies: vi.fn().mockResolvedValue(new Map()),
}));

vi.mock("@/lib/security/rate-limit", () => ({
  createRateLimiter: vi.fn(() => ({
    check: vi.fn().mockResolvedValue({ success: true, remaining: 99 }),
  })),
}));

// ── KEY MOCK: @/lib/supabase/server ───────────────────────────────────────
// The factory returns a function — when createClient() is called at test
// runtime, globalThis.__testSupabaseClient is already set by beforeAll.
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => globalThis.__testSupabaseClient),
}));

// ── Setup ────────────────────────────────────────────────────────────────
beforeAll(async () => {
  // 1. Ensure test user exists
  const { data: existingUsers } = await adminClient.auth.admin.listUsers();
  let user = existingUsers?.users?.find((u) => u.email === TEST_EMAIL);

  if (!user) {
    const { data, error } = await adminClient.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    });
    if (error) throw new Error(`Failed to create test user: ${error.message}`);
    user = data.user;
  }
  testUserId = user!.id;
  globalThis.__testUserId = user!.id;

  // 2. Sign in as test user to get real JWT
  const { data: session, error: signInError } = await createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  ).auth.signInWithPassword({ email: TEST_EMAIL, password: TEST_PASSWORD });

  if (signInError || !session.session) {
    throw new Error(`Failed to sign in test user: ${signInError?.message}`);
  }

  // 3. Build authenticated client and expose via globalThis
  globalThis.__testSupabaseClient = createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      global: { headers: { Authorization: `Bearer ${session.session.access_token}` } },
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );

  // 4. Ensure test user has user_progress row
  await adminClient.from("user_progress").upsert(
    {
      user_id: testUserId,
      current_level: "A1",
      total_xp: 0,
      streak: 0,
      last_active_date: new Date().toISOString().split("T")[0],
    },
    { onConflict: "user_id" }
  );
});

afterAll(async () => {
  await adminClient.from("user_lesson_progress").delete().eq("user_id", testUserId);
  await adminClient.from("speaking_sessions").delete().eq("user_id", testUserId);
  await adminClient.from("card_review_logs").delete().eq("user_id", testUserId);
  await adminClient.from("challenge_results").delete().eq("user_id", testUserId);
  await adminClient.from("quiz_results").delete().eq("user_id", testUserId);
  globalThis.__testSupabaseClient = undefined;
});

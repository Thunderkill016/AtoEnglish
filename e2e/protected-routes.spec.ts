import { test, expect } from "@playwright/test";

/**
 * Protected routes: redirect to /login when unauthenticated.
 * Source of truth: src/lib/supabase/session.ts → protectedRoutes array
 * Keep this list in sync whenever new routes are added to app/(main)/
 */
const PROTECTED_ROUTES = [
  "/dashboard",
  "/learn/unit-1",
  "/learn/unit-a01",
  "/flashcards",
  "/speaking",
  "/progress",
  "/roadmap",
  "/writing",
  "/leaderboard",
  "/grammar",
  "/business",
  "/challenge",
  "/pronunciation",
  "/placement-test",
  "/invite",
  "/settings",
  "/quiz",
];

/**
 * Public routes: accessible without authentication (return 200).
 */
const PUBLIC_ROUTES = [
  { path: "/", titleMatcher: /AtoEnglish/ },
  { path: "/login", titleMatcher: /AtoEnglish/ },
];

test.describe("Protected Routes — Unauthenticated Redirects", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects to /login when not logged in`, async ({ page }) => {
      await page.goto(route);
      // Should land at /login (possibly with ?next= param)
      await expect(page).toHaveURL(/\/login/, { timeout: 8000 });
    });
  }
});

test.describe("Public Routes — Accessible Without Auth", () => {
  for (const { path, titleMatcher } of PUBLIC_ROUTES) {
    test(`${path} loads without auth (200)`, async ({ page }) => {
      const res = await page.goto(path);
      // /login is the auth redirect destination — it's expected to be at /login
      // Other public pages should not redirect to /login
      if (path !== "/login") {
        expect(page.url()).not.toMatch(/\/login/);
      }
      // Should have a valid AtoEnglish title
      await expect(page).toHaveTitle(titleMatcher, { timeout: 8000 });
      // Status should be OK (200)
      expect(res?.status()).toBe(200);
    });
  }
});

test.describe("Landing Page — Key Elements", () => {
  test("has hero heading in Vietnamese", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Học tiếng Anh");
  });

  test("has CTA button linking to login", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /Bắt đầu học/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /login/);
  });

  test("has microstats trust bar", async ({ page }) => {
    await page.goto("/");
    // HeroCTA is a client component — wait for hydration then check stat pills
    // Text is split across two spans so check both separately
    await expect(page.getByText(/Miễn phí/i).first()).toBeVisible({ timeout: 10000 });
  });

  test("footer has privacy and terms links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /Bảo mật|Privacy/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Điều khoản|Terms/i })).toBeVisible();
  });
});

test.describe("API Health Check", () => {
  test("/api/health returns valid JSON status", async ({ request }) => {
    const res = await request.get("/api/health");
    // Accept 200 (healthy) or 503 (degraded/no-DB in test env)
    expect([200, 503]).toContain(res.status());
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(["ok", "degraded", "error"]).toContain(body.status);
    expect(body).toHaveProperty("timestamp");
  });
});

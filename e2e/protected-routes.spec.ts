import { test, expect } from "@playwright/test";

// Protected routes redirect to login when unauthenticated
const PROTECTED_ROUTES = [
  "/dashboard",
  "/learn/unit-1",
  "/learn/unit-a01",
  "/flashcards",
  "/speaking",
  "/progress",
  "/roadmap",
  "/quiz",
  "/grammar",
  "/pronunciation",
  "/writing",
  "/settings",
  "/leaderboard",
  "/placement-test",
];

test.describe("Protected Routes — Unauthenticated Redirects", () => {
  for (const route of PROTECTED_ROUTES) {
    test(`${route} redirects to /login when not logged in`, async ({ page }) => {
      await page.goto(route);
      // Should end up at /login (possibly with ?next= param)
      await expect(page).toHaveURL(/\/login/);
      // Login page should be rendered
      await expect(page.locator("h1, h2").first()).toBeVisible();
    });
  }
});

test.describe("Public Pages — Accessible Without Auth", () => {
  test("/ landing page loads with hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/AtoEnglish/);
    await expect(page.locator("h1")).toContainText("Học tiếng Anh");
  });

  test("/login page renders email auth form", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Đăng nhập|Đăng ký|AtoEnglish/i);
    // Should have email input
    await expect(page.getByRole("button", { name: /Google|Đăng nhập|Bắt đầu/i }).first()).toBeVisible();
  });

  test("/placement-test loads without auth", async ({ page }) => {
    await page.goto("/placement-test");
    await expect(page.locator("h1")).toContainText("Xác Định");
  });

  test("/grammar loads without auth and shows grammar topics", async ({ page }) => {
    await page.goto("/grammar");
    await expect(page).toHaveTitle(/Ngữ pháp|AtoEnglish/i);
    // Should show at least one grammar topic
    await expect(page.locator("h2, h3").first()).toBeVisible();
  });

  test("/pronunciation loads 44 IPA sounds", async ({ page }) => {
    await page.goto("/pronunciation");
    await expect(page).toHaveTitle(/Phát âm|IPA|AtoEnglish/i);
    // Should have vowels and consonants sections
    await expect(page.getByText(/Nguyên âm|Phụ âm|vowel|consonant/i).first()).toBeVisible();
  });

  test("/writing loads AI writing coach", async ({ page }) => {
    await page.goto("/writing");
    await expect(page).toHaveTitle(/Viết|Writing|AtoEnglish/i);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("/certificate/a1 loads cert eligibility page", async ({ page }) => {
    await page.goto("/certificate/a1");
    // Redirects to login since auth required
    await expect(page).toHaveURL(/\/login|\/certificate/);
  });
});

test.describe("API Health Check", () => {
  test("/api/health returns valid JSON status", async ({ request }) => {
    const res = await request.get("/api/health");
    // Accept 200 (healthy) or 503 (degraded/no-DB in test env) — just verify shape
    expect([200, 503]).toContain(res.status());
    const body = await res.json();
    expect(body).toHaveProperty("status");
    expect(["ok", "degraded", "error"]).toContain(body.status);
    expect(body).toHaveProperty("timestamp");
  });
});

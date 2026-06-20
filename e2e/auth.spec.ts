import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders login page without crashing", async ({ page }) => {
    await expect(page).toHaveURL(/login/);
    // Should not show a 500 error
    await expect(page.locator("body")).not.toContainText("Internal Server Error");
    await expect(page.locator("body")).not.toContainText("Application error");
  });

  test("shows onboarding survey step 1 by default", async ({ page }) => {
    // Step 1 asks about learning goals
    await expect(page.locator("body")).toContainText(/mục tiêu|học tiếng Anh|goal/i);
  });

  test("?mode=login skips survey to auth form", async ({ page }) => {
    await page.goto("/login?mode=login");
    // Should show email input directly
    await expect(page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i))).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Auth Redirects", () => {
  test("unauthenticated user visiting /dashboard is redirected to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user visiting /flashcards is redirected to /login", async ({ page }) => {
    await page.goto("/flashcards");
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/login/);
  });

  test("unauthenticated user visiting /learn is redirected to /login", async ({ page }) => {
    await page.goto("/learn");
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/login/);
  });
});

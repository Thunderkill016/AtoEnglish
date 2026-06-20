import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero section with headline", async ({ page }) => {
    await expect(page).toHaveTitle(/AtoEnglish/);
    // Check Vietnamese headline
    await expect(page.locator("h1")).toContainText("Học tiếng Anh");
  });

  test("has Start Learning CTA button", async ({ page }) => {
    const cta = page.getByRole("link", { name: /Bắt đầu học/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", /login/);
  });

  test("has navigation with logo", async ({ page }) => {
    await expect(page.locator("nav")).toBeVisible();
    await expect(page.locator("nav").getByText("AtoEnglish")).toBeVisible();
  });

  test("shows stats bar with Open Beta badge", async ({ page }) => {
    // Target the stats bar specifically (first exact match)
    await expect(
      page.locator("text=Open Beta").first()
    ).toBeVisible();
  });

  test("footer has links to privacy and terms", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /Bảo mật|Privacy/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Điều khoản|Terms/i })
    ).toBeVisible();
  });
});

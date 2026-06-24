import { test, expect } from "@playwright/test";

test.describe("Placement Test Flow", () => {
  test("starts the test and answers first few questions", async ({ page }) => {
    await page.goto("/placement-test");

    // Intro Stage
    await expect(page.locator("h1")).toContainText("Xác Định Trình Độ Tiếng Anh");
    const startBtn = page.getByRole("button", { name: /Bắt Đầu Test/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Test Stage - Question 1 — use specific text matcher, not broad locator('span')
    await expect(page.getByText("1/40")).toBeVisible();

    // Choose Option A (the first answer option — skip logo/nav buttons)
    const firstOption = page.getByRole("button", { name: /^A / }).first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // The Next button should become enabled
    const nextBtn = page.getByRole("button", { name: /Câu tiếp theo/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Should transition to Question 2
    await expect(page.getByText("2/40")).toBeVisible();
  });
});

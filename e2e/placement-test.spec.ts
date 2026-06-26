import { test, expect } from "@playwright/test";

test.describe("Placement Test Flow", () => {
  test("starts the test and answers first few questions", async ({ page }) => {
    await page.goto("/placement-test");

    // Pick stage — choose full test path
    await expect(page.locator("h1")).toContainText("Chọn Điểm Bắt Đầu Học");
    const startBtn = page.getByRole("button", { name: /Làm Bài Test Đầy Đủ/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Test Stage - Question 1
    await expect(page.getByText(/^1\/\d+$/)).toBeVisible();

    // Choose Option A (the first answer option — skip logo/nav buttons)
    const firstOption = page.getByRole("button", { name: /^A / }).first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // The Next button should become enabled
    const nextBtn = page.getByRole("button", { name: /Câu tiếp theo/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Should transition to Question 2
    await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
  });
});

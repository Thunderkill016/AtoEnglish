import { test, expect } from "@playwright/test";

test.describe("Placement Test Flow", () => {
  test("starts the test and answers first few questions", async ({ page }) => {
    await page.goto("/placement-test");

    // Intro Stage
    await expect(page.locator("h1")).toContainText("Xác Định Trình Độ Tiếng Anh");
    const startBtn = page.getByRole("button", { name: /Bắt Đầu Test/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Test Stage - Question 1
    await expect(page.locator("span")).toContainText("1/40");
    
    // Choose Option A (the first option)
    const firstOption = page.locator("button").first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    // The Next button should become enabled
    const nextBtn = page.getByRole("button", { name: /Câu tiếp theo/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    // Should transition to Question 2
    await expect(page.locator("span")).toContainText("2/40");
  });
});

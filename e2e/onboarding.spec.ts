import { test, expect } from "@playwright/test";

test.describe("Onboarding Flow", () => {
  test("completes the 5-step survey and lands on email auth", async ({ page }) => {
    await page.goto("/login");

    // Welcome Screen
    await expect(page.locator("h1")).toContainText("Tạo lộ trình học tiếng Anh");
    const startBtn = page.getByRole("button", { name: /Bắt đầu/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Step 1: Level
    await expect(page.locator("h1")).toContainText("Trình độ tiếng Anh");
    const levelOpt = page.getByText("Mất gốc / Chưa biết gì").first();
    await expect(levelOpt).toBeVisible();
    await levelOpt.click();

    // Step 2: Goal
    await expect(page.locator("h1")).toContainText("Mục tiêu học");
    const goalOpt = page.getByText("Đi làm, thăng tiến").first();
    await expect(goalOpt).toBeVisible();
    await goalOpt.click();

    // Step 3: Obstacle
    await expect(page.locator("h1")).toContainText("Khó khăn lớn nhất");
    const obstacleOpt = page.getByText("Sợ nói sai").first();
    await expect(obstacleOpt).toBeVisible();
    await obstacleOpt.click();

    // Step 4: Time
    await expect(page.locator("h1")).toContainText("Bạn có thể dành");
    const timeOpt = page.getByText("15 phút/ngày").first();
    await expect(timeOpt).toBeVisible();
    await timeOpt.click();

    // Step 5: Loading / Processing
    await expect(page.locator("h1")).toContainText("Đang thiết lập lộ trình");

    // Step 6: Auth Form (should wait for loading timer to finish)
    await expect(page.locator("h1")).toContainText("Lộ trình của bạn đã sẵn sàng", { timeout: 10000 });
    await expect(page.locator("body")).toContainText("Cấp độ: Mất gốc");
    await expect(page.locator("body")).toContainText("Mục tiêu: Đi làm");
    await expect(page.locator("body")).toContainText("Học tập: 15 phút/ngày");
  });
});

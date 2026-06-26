import { test, expect } from "@playwright/test";
import {
  hasE2EAdminCredentials,
  getE2EUserIdByEmail,
  forceConfirmE2EUserEmail,
  deleteE2EUserByEmail,
  verifyOnboardingPersistence,
} from "./helpers/auth";

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

test.describe("Onboarding Signup Persist (E2E DB)", () => {
  test("signup flow saves goal/obstacle/daily_minutes to user_onboarding_profile and daily_xp_goal on user_progress", async ({ page }) => {
    test.skip(
      !hasE2EAdminCredentials(),
      "Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY for DB verify",
    );

    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const email = `e2e-onboard-${ts}-${rand}@atoenglish.test`;
    const password = "E2ETestPass123!";

    // Expected values from selections below
    const expected = { goal: "work", obstacle: "fear", daily_minutes: 15, daily_xp_goal: 50 };

    try {
      await page.goto("/login");

      // Welcome
      const startBtn = page.getByRole("button", { name: /Bắt đầu/i });
      await expect(startBtn).toBeVisible({ timeout: 5000 });
      await startBtn.click();

      // Step 1 level
      await expect(page.locator("h1")).toContainText("Trình độ tiếng Anh", { timeout: 5000 });
      await page.getByText("Mất gốc / Chưa biết gì").first().click();

      // Step 2: Goal (work)
      await expect(page.locator("h1")).toContainText("Mục tiêu học");
      await page.getByText("Đi làm, thăng tiến").first().click();

      // Step 3: Obstacle (fear)
      await expect(page.locator("h1")).toContainText("Khó khăn lớn nhất");
      await page.getByText("Sợ nói sai").first().click();

      // Step 4: Time (15min → 15, 50xp)
      await expect(page.locator("h1")).toContainText("Bạn có thể dành");
      await page.getByText("15 phút/ngày").first().click();

      // Loader → auth form
      await expect(page.locator("h1")).toContainText("Lộ trình của bạn đã sẵn sàng", { timeout: 12000 });

      // Fill auth form (signup path)
      await page.getByPlaceholder("Email của bạn").fill(email);
      await page.getByPlaceholder("Mật khẩu").fill(password);

      // Activate / signup button (text varies but contains activate or signup)
      const submitBtn = page.getByRole("button", { name: /Kích hoạt|Đăng ký/i });
      await expect(submitBtn).toBeVisible({ timeout: 5000 });
      await submitBtn.click();

      // Wait for client-side redirect after signup (may be /learn/... or /dashboard)
      await page.waitForURL(/\/(learn|dashboard)/, { timeout: 25000 }).catch(() => {
        // continue; DB check is authoritative
      });

      // Give DB writes a moment (client insert after signUp)
      await page.waitForTimeout(800);

      // Ensure user exists (signUp created it); force confirm in case email gate
      let userId = await getE2EUserIdByEmail(email);
      if (userId) {
        await forceConfirmE2EUserEmail(userId);
      } else {
        // fallback: poll a bit
        for (let i = 0; i < 5 && !userId; i++) {
          await page.waitForTimeout(400);
          userId = await getE2EUserIdByEmail(email);
        }
      }

      expect(userId, "user created by signup flow").toBeTruthy();

      // Verify exact persisted data from Q2/Q3/Q4 + daily_xp_goal
      await verifyOnboardingPersistence(userId!, expected);
    } finally {
      // Always cleanup temp user to keep DB clean
      await deleteE2EUserByEmail(email).catch(() => {});
    }
  });
});

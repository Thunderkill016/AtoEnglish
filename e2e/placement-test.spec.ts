import { test, expect } from "@playwright/test";
import {
  hasE2EAdminCredentials,
  loginAsE2ETestUser,
  resetE2EPlacementState,
  ensureE2ETestUser,
} from "./helpers/auth";

test.describe("Placement Test Flow", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(
      !hasE2EAdminCredentials(),
      "Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY",
    );

    const userId = await ensureE2ETestUser();
    await resetE2EPlacementState(userId);
    await loginAsE2ETestUser(page);
  });

  test("starts the test and answers first few questions", async ({ page }) => {
    await page.goto("/placement-test");

    await expect(page.locator("h1")).toContainText("Chọn Điểm Bắt Đầu Học");
    const startBtn = page.getByRole("button", { name: /Làm Bài Test Đầy Đủ/i });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    await expect(page.getByText(/^1\/\d+$/)).toBeVisible();

    const firstOption = page.getByRole("button", { name: /^A / }).first();
    await expect(firstOption).toBeVisible();
    await firstOption.click();

    const nextBtn = page.getByRole("button", { name: /Câu tiếp theo/i });
    await expect(nextBtn).toBeEnabled();
    await nextBtn.click();

    await expect(page.getByText(/^2\/\d+$/)).toBeVisible();
  });

  test("self-select B1 unlocks unit-19 on /learn", async ({ page }) => {
    await page.goto("/placement-test");
    await expect(page.locator("h1")).toContainText("Chọn Điểm Bắt Đầu Học");

    const b1Option = page
      .getByRole("button")
      .filter({ hasText: "B1" })
      .filter({ hasText: "Trung cấp" });
    await expect(b1Option).toBeVisible();
    await b1Option.click();

    await expect(
      page.getByRole("link", { name: /Bắt đầu học ngay/i }),
    ).toBeVisible({ timeout: 15_000 });
    await expect(page.locator("body")).not.toContainText(
      "chưa lưu được DB",
    );

    await page.goto("/learn");
    await expect(page.locator("h1")).toContainText("Học tiếng Anh");

    const unit1Card = page
      .locator("div")
      .filter({ hasText: "Unit 1:" })
      .filter({ hasText: "Đã xác định" })
      .first();
    await expect(unit1Card).toBeVisible({ timeout: 10_000 });

    const unit19Heading = page.getByRole("heading", {
      name: /Unit 19: Stories & Narratives/i,
    });
    await unit19Heading.scrollIntoViewIfNeeded();
    await expect(unit19Heading).toBeVisible();

    const unit19Card = unit19Heading.locator(
      "xpath=ancestor::div[contains(@class,'rounded-2xl')][1]",
    );
    await expect(
      unit19Card.getByRole("link", { name: /Học tiếp|Bắt đầu/i }),
    ).toBeVisible();
    await expect(unit19Card.getByText("Chưa mở khóa")).toHaveCount(0);

    const unit20Heading = page.getByRole("heading", {
      name: /Unit 20: News & Current Events/i,
    });
    await unit20Heading.scrollIntoViewIfNeeded();
    const unit20Card = unit20Heading.locator(
      "xpath=ancestor::div[contains(@class,'rounded-2xl')][1]",
    );
    await expect(unit20Card.getByText("Chưa mở khóa")).toBeVisible();
  });
});
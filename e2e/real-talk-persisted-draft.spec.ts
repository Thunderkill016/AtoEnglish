import { writeFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

import { loginAsE2ETestUser } from "./helpers/auth";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function completePreWatch(page: import("@playwright/test").Page) {
  await page
    .getByRole("button", { name: /Tiếp tục: Học từ vựng cốt lõi/i })
    .click();
  await expect(page.getByRole("heading", { name: "Từ vựng quan trọng" })).toBeVisible();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Dự đoán" })).toBeVisible();
  const prediction = page.locator("button:visible").filter({
    hasNotText: /Kiểm tra|Tiếp tục/,
  });
  await prediction.first().click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Chú ý phát âm" })).toBeVisible();
  await page.locator("button:visible").last().click();
}

async function completeWhileWatch(page: import("@playwright/test").Page) {
  await expect(page.getByText("Xem hiểu ý chính", { exact: true })).toBeVisible();
  const gistOptions = page.locator("button:visible").filter({
    hasNotText: /Kiểm tra|Tiếp tục/,
  });
  await gistOptions.first().click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page
    .getByRole("button", { name: /Tiếp tục: Xem chi tiết/i })
    .click();
  await page
    .getByRole("button", { name: /Tiếp tục: Phân tích/i })
    .click();
  await page.getByRole("button", { name: /Làm bài tập/i }).click();
}

async function completePostWatch(page: import("@playwright/test").Page) {
  while (await page.getByText(/^Câu \d+\/\d+$/).isVisible()) {
    const section = page
      .locator("section")
      .filter({ has: page.getByText(/^Câu \d+\/\d+$/) })
      .first();
    await section.locator("button").first().click();
    await section.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await section
      .getByRole("button", { name: "Câu tiếp theo", exact: true })
      .click();
  }

  while (await page.getByText(/^Tự gọi lại \d+\/\d+$/).isVisible()) {
    const section = page
      .locator("section")
      .filter({ has: page.getByText(/^Tự gọi lại \d+\/\d+$/) })
      .first();
    await section.getByPlaceholder("Nhập phần còn thiếu").fill("controlled answer");
    await section.getByRole("button", { name: "Kiểm tra", exact: true }).click();
    await section.getByRole("button", { name: "Tiếp tục", exact: true }).click();
  }

  while (await page.getByText(/^Nói thành tiếng \d+\/\d+$/).isVisible()) {
    const section = page
      .locator("section")
      .filter({ has: page.getByText(/^Nói thành tiếng \d+\/\d+$/) })
      .first();
    await section
      .getByRole("button", { name: /Tôi đã nói thành tiếng/i })
      .click();
  }

  await page
    .getByPlaceholder(/Tự phản hồi theo tình huống mới/i)
    .fill("I can respond differently now");
  await page
    .getByLabel(/Tôi đã tự tạo phản hồi trước khi xem lại transcript/i)
    .check();
  await page
    .getByRole("button", { name: /Ghi nhận lượt transfer/i })
    .click();
  await page.getByRole("button", { name: /Hoàn thành bài học/i }).click();
}

test("authenticated owner previews and completes one persisted private draft", async ({
  page,
}, testInfo) => {
  const slug = requiredEnv("SPEC001_T074_SLUG");
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await loginAsE2ETestUser(page);
  await page.goto(`/real-talk/${slug}`, { waitUntil: "networkidle" });

  await expect(page.getByText("AI draft", { exact: true })).toBeVisible();
  await expect(page.getByText("Môi trường giao tiếp", { exact: true })).toBeVisible();
  await expect(page.getByText("Việc cần làm ngoài đời", { exact: true })).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);

  await page.screenshot({
    path: testInfo.outputPath("persisted-draft-initial.png"),
    fullPage: true,
  });

  await completePreWatch(page);
  await completeWhileWatch(page);
  await completePostWatch(page);

  await expect(
    page.getByRole("heading", { name: "Đã hoàn thành chu trình Real Talk" }),
  ).toBeVisible();
  await expect(page.getByText(/Mục tiêu luyện tập:/i)).toBeVisible();
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);

  await page.screenshot({
    path: testInfo.outputPath("persisted-draft-completed.png"),
    fullPage: true,
  });

  writeFileSync(
    testInfo.outputPath("evidence.json"),
    `${JSON.stringify(
      {
        project: testInfo.project.name,
        authenticatedSession: true,
        persistedDraftSlug: slug,
        ownerPrivateRouteLoaded: true,
        environmentBriefVisible: true,
        fullLessonLoopCompleted: true,
        transferCompleted: true,
        completionScreenVisible: true,
        noNextErrorOverlay: true,
        noPageErrors: pageErrors.length === 0,
        noHorizontalOverflow: true,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
});

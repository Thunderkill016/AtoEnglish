import { writeFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

import { loginAsE2ETestUser } from "./helpers/auth";

// Permanent regression coverage retained after the hosted T074 desktop/mobile run.
function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

async function completePreWatch(page: Page) {
  await page
    .getByRole("button", { name: /Tiếp tục: Học từ vựng cốt lõi/i })
    .click();
  await expect(
    page.getByRole("heading", { name: "Từ vựng quan trọng" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();

  await expect(page.getByRole("heading", { name: "Dự đoán" })).toBeVisible();
  await page.getByRole("button", { name: "Làm quen", exact: true }).click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Chú ý phát âm" }),
  ).toBeVisible();
  await page.locator("button:visible").last().click();
}

async function completeWhileWatch(page: Page) {
  await expect(
    page.getByRole("heading", {
      name: "Điều gì xảy ra trong cuộc trò chuyện?",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Một người yêu cầu nhắc lại",
      exact: true,
    })
    .click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page
    .getByRole("button", { name: /Tiếp tục: Xem chi tiết/i })
    .click();
  await page
    .getByRole("button", { name: /Tiếp tục: Phân tích/i })
    .click();
  await page.getByRole("button", { name: /Làm bài tập/i }).click();
}

async function completePostWatch(page: Page) {
  await expect(page.getByText("Câu 1/1", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Alex", exact: true }).click();
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page
    .getByRole("button", { name: "Câu tiếp theo", exact: true })
    .click();

  await expect(page.getByText("Tự gọi lại 1/1", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Nhập phần còn thiếu").fill("repeat");
  await page.getByRole("button", { name: "Kiểm tra", exact: true }).click();
  await page.getByRole("button", { name: "Tiếp tục", exact: true }).click();

  await expect(
    page.getByText("Nói thành tiếng 1/2", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Tôi đã nói thành tiếng/i })
    .click();
  await expect(
    page.getByText("Nói thành tiếng 2/2", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Tôi đã nói thành tiếng/i })
    .click();

  const transfer = page.getByPlaceholder(
    /Tự phản hồi theo tình huống mới/i,
  );
  await expect(transfer).toBeVisible();
  await transfer.fill("I can respond differently now");
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
  test.setTimeout(90_000);

  const slug = requiredEnv("SPEC001_T074_SLUG");
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await loginAsE2ETestUser(page);
  await page.goto(`/real-talk/${slug}`, { waitUntil: "networkidle" });

  await expect(page.getByText("AI draft", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Môi trường giao tiếp", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Việc cần làm ngoài đời", { exact: true }),
  ).toBeVisible();
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

  const completionHeading = page.getByRole("heading", {
    name: "Đã hoàn thành chu trình Real Talk",
  });
  await expect(completionHeading).toBeVisible();
  await expect(page.getByText(/Mục tiêu luyện tập:/i)).toBeVisible();
  await page.waitForTimeout(1_500);
  await expect(completionHeading).toHaveCSS("opacity", "1");
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
        completionAnimationSettled: true,
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

import { expect, test } from "@playwright/test";

function protectedPreviewPath(path: string) {
  const shareToken = process.env.VERCEL_SHARE_TOKEN;
  if (!shareToken) return path;

  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}_vercel_share=${encodeURIComponent(shareToken)}`;
}

const completeResponse =
  "Hi, I'm Minh. I work as a developer. What's your name? Sorry, I didn't catch that. Could you say that again?";

test.describe("Autonomous mastery tutor guest journey", () => {
  test("diagnoses, teaches only gaps and requires cold transfer", async ({
    page,
  }) => {
    await page.goto(protectedPreviewPath("/learn/unit-a0-1"));

    await expect(
      page.getByRole("heading", { name: "Gặp đồng nghiệp mới" }),
    ).toBeVisible();
    await page
      .getByPlaceholder("Tự viết bằng những gì bạn đang biết...")
      .fill("Hi, I'm Minh. I work developer.");
    await page
      .getByRole("button", {
        name: "Chẩn đoán phần tôi thực sự cần học",
      })
      .click();

    await expect(
      page.getByRole("heading", { name: "Chỉ học đúng phần bạn còn thiếu" }),
    ).toBeVisible();
    await expect(page.getByText("Đã tự làm được")).toBeVisible();
    await page.getByRole("button", { name: "Học đúng phần còn thiếu" }).click();

    await expect(page.getByRole("heading", { name: /Chỉ 3 ý cần học/ })).toBeVisible();
    await page
      .getByRole("button", { name: "Ẩn mẫu và bắt đầu tự nhớ" })
      .click();

    const retrievalAnswers = [
      "I work as a developer.",
      "What's your name?",
      "Could you say that again?",
    ];

    for (const answer of retrievalAnswers) {
      await page.getByPlaceholder("Tự viết câu trả lời...").fill(answer);
      await page
        .getByRole("button", { name: "Kiểm tra khả năng tự nhớ" })
        .click();
    }

    await expect(
      page.getByRole("heading", { name: "Không còn câu mẫu" }),
    ).toBeVisible();
    await page
      .getByPlaceholder("Tự hoàn thành toàn bộ nhiệm vụ...")
      .fill(completeResponse);
    await page
      .getByRole("button", { name: "Kiểm tra và yêu cầu tôi tự sửa" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Tình huống chưa được luyện nguyên mẫu",
      }),
    ).toBeVisible();
    await page
      .getByPlaceholder("Tự xử lý tình huống mới...")
      .fill(completeResponse);
    await page
      .getByRole("button", { name: "Chấm khả năng chuyển giao" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Bạn đã dùng được kỹ năng trong tình huống mới",
      }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Lưu bằng chứng và đến checkpoint" })
      .click();

    await expect(page).toHaveURL(
      /\/login\?mode=login&next=%2Flearn%2Funit-a0-1%2Fcheckpoint/,
    );
  });

  test("does not pass a cold task that misses required intents", async ({
    page,
  }) => {
    await page.goto(protectedPreviewPath("/learn/unit-a0-1"));
    await page
      .getByPlaceholder("Tự viết bằng những gì bạn đang biết...")
      .fill(completeResponse);
    await page
      .getByRole("button", {
        name: "Chẩn đoán phần tôi thực sự cần học",
      })
      .click();
    await page.getByRole("button", { name: "Làm tình huống mới ngay" }).click();

    await page
      .getByPlaceholder("Tự xử lý tình huống mới...")
      .fill("Hi, I'm Minh. I work as a developer.");
    await page
      .getByRole("button", { name: "Chấm khả năng chuyển giao" })
      .click();

    await expect(
      page.getByRole("heading", {
        name: "Chưa đạt chuyển giao — hệ thống không cho qua giả",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: "Chỉ học lại phần cold task còn thiếu",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Lưu bằng chứng và đến checkpoint" }),
    ).toHaveCount(0);
  });
});
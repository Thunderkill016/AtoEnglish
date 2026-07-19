import { test, expect, type Page } from "@playwright/test";

/**
 * TASK-281 — v2 guest lesson smoke + soft complete (quiz floor ≥50%).
 *
 * Guest path: `/learn` is not in protectedRoutes (session.ts) — no auth required.
 * Gold pilot: `l-a1-01` (LessonPlayerV2 stages + task gate + review quiz).
 *
 * If webServer cannot start and PLAYWRIGHT_BASE_URL is unreachable, Playwright
 * fails the run; local non-CI uses playwright.config webServer (`npm run dev`).
 */

const LESSON_PATH = "/learn/v2/l-a1-01";

/** Correct answers for l-a1-01 review.quiz (src/lib/v2/lessons/l-a1-01.ts). */
const QUIZ_ANSWERS = [
  { kind: "option" as const, text: "My" },
  { kind: "option" as const, text: "from" },
  { kind: "option" as const, text: "True" },
  { kind: "option" as const, text: "I'm fine, thanks." },
  { kind: "cloze" as const, text: "am" },
];

/** Stages before task: engage → lexis → grammar → controlled → input → fluency (6× Tiếp tục). */
const STAGES_BEFORE_TASK = 6;

async function openPilot(page: Page) {
  const res = await page.goto(LESSON_PATH, { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByRole("heading", { name: /Chào hỏi/i })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByTestId("lesson-stage-card")).toBeVisible();
  await expect(page.getByTestId("lesson-next")).toBeVisible();
}

async function clickNext(page: Page) {
  await page.getByTestId("lesson-next").click();
}

async function advanceToTask(page: Page) {
  for (let i = 0; i < STAGES_BEFORE_TASK; i++) {
    await expect(page.getByTestId("lesson-next")).toBeEnabled();
    await clickNext(page);
    await expect(page.getByTestId("lesson-stage-card")).toBeVisible();
  }
  await expect(page.getByTestId("task-done")).toBeVisible({ timeout: 10_000 });
}

async function answerReviewQuiz(page: Page) {
  for (const ans of QUIZ_ANSWERS) {
    if (ans.kind === "cloze") {
      const input = page.getByPlaceholder("Điền đáp án...");
      await expect(input).toBeVisible();
      await input.fill(ans.text);
    } else {
      await page
        .getByRole("button", { name: ans.text, exact: true })
        .click();
    }
  }
}

test.describe("v2 lesson guest smoke — l-a1-01", () => {
  test("stage smoke: pilot loads engage + next advances", async ({ page }) => {
    await openPilot(page);

    await expect(page.getByText(/1\/8 · Bắt đầu/i)).toBeVisible();
    await expect(page.getByText(/Tình huống/i).first()).toBeVisible();

    await clickNext(page);
    await expect(page.getByText(/2\/8 · Từ vựng/i)).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("lesson-stage-card")).toBeVisible();
  });

  test("complete flow: task + quiz floor → lesson-complete", async ({
    page,
  }) => {
    await openPilot(page);
    await advanceToTask(page);

    // Task gate: next disabled until speak ack
    await expect(page.getByTestId("lesson-next")).toBeDisabled();
    await page.getByTestId("task-done").click();
    await expect(page.getByTestId("lesson-next")).toBeEnabled();
    await clickNext(page);

    // Review
    await expect(page.getByText(/8\/8 · Tổng kết/i)).toBeVisible({
      timeout: 10_000,
    });
    await answerReviewQuiz(page);

    await expect(page.getByTestId("lesson-next")).toContainText(/Chấm quiz/i);
    await clickNext(page);

    await expect(page.getByTestId("quiz-floor-result")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("quiz-floor-result")).toContainText(
      /Đạt sàn/i,
    );
    await expect(page.getByTestId("quiz-floor-result")).toContainText(
      /5\/5|Quiz 5/,
    );

    await expect(page.getByTestId("lesson-next")).toContainText(
      /Hoàn thành bài/i,
    );
    await clickNext(page);

    await expect(page.getByTestId("lesson-complete")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("lesson-complete")).toContainText(
      /Hoàn thành/i,
    );
    await expect(page.getByTestId("lesson-complete")).toContainText(/5\/5/);

    // TASK-315: guest SSOT progress key updated after mark-complete
    const progressRaw = await page.evaluate(() =>
      localStorage.getItem("ato_v2_progress"),
    );
    expect(progressRaw).toBeTruthy();
    const progress = JSON.parse(progressRaw!) as {
      completed?: Record<string, unknown>;
    };
    expect(progress.completed?.["l-a1-01"]).toBeTruthy();
  });
});

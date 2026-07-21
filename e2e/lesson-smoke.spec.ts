import { expect, test, type Page } from "@playwright/test";

const UNIT_ROUTE = "/learn/unit-a0-1";
const PROGRESS_KEY = "lesson-progress-unit-a0-1";

async function readSavedSection(page: Page): Promise<number | null> {
  return page.evaluate((key) => {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as { section?: unknown };
      return typeof parsed.section === "number" ? parsed.section : null;
    } catch {
      return null;
    }
  }, PROGRESS_KEY);
}

test.describe("Lesson production smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((key) => window.localStorage.removeItem(key), PROGRESS_KEY);
  });

  test("guest learner can render the A0 warmup without an auth redirect", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const response = await page.goto(UNIT_ROUTE);

    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(UNIT_ROUTE);
    await expect(page.getByTestId("lesson-section-warmup")).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: "Tiến độ bài học: bước 1 / 10" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Ôn nhanh/i })).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("starting the lesson opens vocabulary and persists section 2", async ({ page }) => {
    await page.goto(UNIT_ROUTE);

    await page.getByRole("button", { name: "Bắt đầu học", exact: true }).click();

    await expect(page.getByRole("heading", { name: "Từ vựng", exact: true })).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: "Tiến độ bài học: bước 2 / 10" }),
    ).toBeVisible();
    await expect.poll(() => readSavedSection(page)).toBe(2);
  });

  test("quick review opens practice and persists section 4", async ({ page }) => {
    await page.goto(UNIT_ROUTE);

    await page.getByRole("button", { name: /Ôn nhanh/i }).click();

    await expect(page.getByRole("heading", { name: "Luyện tập", exact: true })).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: "Tiến độ bài học: bước 4 / 10" }),
    ).toBeVisible();
    await expect.poll(() => readSavedSection(page)).toBe(4);
  });
});

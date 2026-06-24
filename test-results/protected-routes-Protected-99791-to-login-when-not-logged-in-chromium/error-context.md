# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: protected-routes.spec.ts >> Protected Routes — Unauthenticated Redirects >> /quiz redirects to /login when not logged in
- Location: e2e/protected-routes.spec.ts:23:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://localhost:3000/quiz"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    12 × unexpected value "http://localhost:3000/quiz"

```

```yaml
- link "Chuyển đến nội dung chính":
  - /url: "#main-content"
- banner:
  - link "AtoEnglish Grow every day":
    - /url: /
  - navigation "Main navigation":
    - link "Dashboard":
      - /url: /dashboard
    - link "Learn":
      - /url: /learn
    - link "Speaking":
      - /url: /speaking
    - link "Writing":
      - /url: /writing
    - link "Flashcards":
      - /url: /flashcards
    - link "Progress":
      - /url: /progress
    - link "Leaderboard":
      - /url: /leaderboard
    - link "Roadmap":
      - /url: /roadmap
  - button "Switch to dark mode"
  - link "Đăng nhập":
    - /url: /login?mode=login
    - button "Đăng nhập"
- main:
  - main:
    - heading "Kiểm tra Từ vựng" [level=1]
    - paragraph: Chọn unit để bắt đầu quiz trắc nghiệm từ vựng
    - 'button "Unit A0-1: Bảng Chữ Cái & Âm Cơ Bản 9 từ vựng · A0 A0"'
    - 'button "Unit A0-2: Số Đếm & Đếm Số 10 từ vựng · A0 A0"'
    - 'button "Unit A0-3: Màu Sắc & Mô Tả 10 từ vựng · A0 A0"'
    - 'button "Unit A0-4: Chào Hỏi & Câu Xã Giao 10 từ vựng · A0 A0"'
    - 'button "Unit A0-5: Thông Tin Cá Nhân 10 từ vựng · A0 A0"'
    - 'button "Unit A0-6: Gia Đình & Những Người Thân 10 từ vựng · A0 A0"'
    - 'button "Unit A0-7: Thời Gian, Ngày & Tháng 10 từ vựng · A0 A0"'
    - 'button "Unit A0-8: Khẩn Cấp & Cụm Từ Sinh Tồn 10 từ vựng · A0 A0"'
    - 'button "Unit 1: Greetings & Self-Introduction 10 từ vựng · A1 A1"'
    - 'button "Unit 2: Personal Information 12 từ vựng · A1 A1"'
    - 'button "Unit 3: Family & Friends 12 từ vựng · A1 A1"'
    - 'button "Unit 4: Daily Routines 12 từ vựng · A1 A1"'
    - 'button "Unit 5: Free Time & Hobbies 12 từ vựng · A1 A1"'
    - 'button "Unit 6: Home & Daily Life 12 từ vựng · A1 A1"'
    - 'button "Unit 7: Shopping & Prices 12 từ vựng · A1 A1"'
    - 'button "Unit 8: Food & Ordering 12 từ vựng · A1 A1"'
    - 'button "Unit 9: Places & Directions 12 từ vựng · A1 A1"'
    - 'button "Unit 10: Abilities & Daily Skills 12 từ vựng · A1 A1"'
    - 'button "Unit 11: Health & Feelings 12 từ vựng · A1 A1"'
    - 'button "Unit 12: Review & Real-life Application 12 từ vựng · A1 A1"'
    - 'button "Unit 13: Past Experiences 12 từ vựng · A2 A2"'
    - 'button "Unit 14: Future Plans & Predictions 12 từ vựng · A2 A2"'
    - 'button "Unit 15: Shopping & Comparing 12 từ vựng · A2 A2"'
    - 'button "Unit 16: Travel & Directions 12 từ vựng · A2 A2"'
    - 'button "Unit 17: Experiences & Present Perfect 12 từ vựng · A2 A2"'
    - 'button "Unit 18: A2 Review & Real-life Communication 12 từ vựng · A2 A2"'
    - 'button "Unit 19: Stories & Narratives 12 từ vựng · B1 B1"'
    - 'button "Unit 20: News & Current Events 12 từ vựng · B1 B1"'
    - 'button "Unit 21: Predictions & Trends 12 từ vựng · B1 B1"'
    - 'button "Unit 22: Rules & Obligations 12 từ vựng · B1 B1"'
    - 'button "Unit 23: If & When 12 từ vựng · B1 B1"'
    - 'button "Unit 24: How Things Are Made 12 từ vựng · B1 B1"'
    - 'button "Unit 25: Describing People & Places 12 từ vựng · B1 B1"'
    - 'button "Unit 26: Likes, Dislikes & Preferences 12 từ vựng · B1 B1"'
    - 'button "Unit 27: Get Things Done 12 từ vựng · B1 B1"'
    - 'button "Unit 28: How Long Have You Been...? 12 từ vựng · B1 B1"'
    - 'button "Unit 29: Problems & Solutions 12 từ vựng · B1 B1"'
    - 'button "Unit 30: Health & Global Issues 12 từ vựng · B1 B1"'
    - 'button "Unit 31: Business Communication 12 từ vựng · B1 B1"'
    - 'button "Unit 32: B1 Review & Mock Test 12 từ vựng · B1 B1"'
    - 'button "Unit 33: Imagining & Hypothesizing 12 từ vựng · B2 B2"'
    - 'button "Unit 34: Past Regrets & What-ifs 12 từ vựng · B2 B2"'
    - 'button "Unit 35: Advanced Conditions 11 từ vựng · B2 B2"'
    - 'button "Unit 36: Academic & Formal Passive 12 từ vựng · B2 B2"'
    - 'button "Unit 37: Concise & Precise Language 12 từ vựng · B2 B2"'
    - 'button "Unit 38: Emphasis & Persuasion 12 từ vựng · B2 B2"'
    - 'button "Unit 39: Speculation & Deduction 12 từ vựng · B2 B2"'
    - 'button "Unit 40: Linking & Cohesion 12 từ vựng · B2 B2"'
    - 'button "Unit 41: IELTS & TOEIC Topics 16 từ vựng · B2 B2"'
    - 'button "Unit 42: B2 Final Assessment 12 từ vựng · B2 B2"'
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | // Protected routes redirect to login when unauthenticated
  4  | const PROTECTED_ROUTES = [
  5  |   "/dashboard",
  6  |   "/learn/unit-1",
  7  |   "/learn/unit-a01",
  8  |   "/flashcards",
  9  |   "/speaking",
  10 |   "/progress",
  11 |   "/roadmap",
  12 |   "/quiz",
  13 |   "/grammar",
  14 |   "/pronunciation",
  15 |   "/writing",
  16 |   "/settings",
  17 |   "/leaderboard",
  18 |   "/placement-test",
  19 | ];
  20 | 
  21 | test.describe("Protected Routes — Unauthenticated Redirects", () => {
  22 |   for (const route of PROTECTED_ROUTES) {
  23 |     test(`${route} redirects to /login when not logged in`, async ({ page }) => {
  24 |       await page.goto(route);
  25 |       // Should end up at /login (possibly with ?next= param)
> 26 |       await expect(page).toHaveURL(/\/login/);
     |                          ^ Error: expect(page).toHaveURL(expected) failed
  27 |       // Login page should be rendered
  28 |       await expect(page.locator("h1, h2").first()).toBeVisible();
  29 |     });
  30 |   }
  31 | });
  32 | 
  33 | test.describe("Public Pages — Accessible Without Auth", () => {
  34 |   test("/ landing page loads with hero", async ({ page }) => {
  35 |     await page.goto("/");
  36 |     await expect(page).toHaveTitle(/AtoEnglish/);
  37 |     await expect(page.locator("h1")).toContainText("Học tiếng Anh");
  38 |   });
  39 | 
  40 |   test("/login page renders email auth form", async ({ page }) => {
  41 |     await page.goto("/login");
  42 |     await expect(page).toHaveTitle(/Đăng nhập|Đăng ký|AtoEnglish/i);
  43 |     // Should have email input
  44 |     await expect(page.getByRole("button", { name: /Google|Đăng nhập|Bắt đầu/i }).first()).toBeVisible();
  45 |   });
  46 | 
  47 |   test("/placement-test loads without auth", async ({ page }) => {
  48 |     await page.goto("/placement-test");
  49 |     await expect(page.locator("h1")).toContainText("Xác Định");
  50 |   });
  51 | 
  52 |   test("/grammar loads without auth and shows grammar topics", async ({ page }) => {
  53 |     await page.goto("/grammar");
  54 |     await expect(page).toHaveTitle(/Ngữ pháp|AtoEnglish/i);
  55 |     // Should show at least one grammar topic
  56 |     await expect(page.locator("h2, h3").first()).toBeVisible();
  57 |   });
  58 | 
  59 |   test("/pronunciation loads 44 IPA sounds", async ({ page }) => {
  60 |     await page.goto("/pronunciation");
  61 |     await expect(page).toHaveTitle(/Phát âm|IPA|AtoEnglish/i);
  62 |     // Should have vowels and consonants sections
  63 |     await expect(page.getByText(/Nguyên âm|Phụ âm|vowel|consonant/i).first()).toBeVisible();
  64 |   });
  65 | 
  66 |   test("/writing loads AI writing coach", async ({ page }) => {
  67 |     await page.goto("/writing");
  68 |     await expect(page).toHaveTitle(/Viết|Writing|AtoEnglish/i);
  69 |     await expect(page.locator("h1, h2").first()).toBeVisible();
  70 |   });
  71 | 
  72 |   test("/certificate/a1 loads cert eligibility page", async ({ page }) => {
  73 |     await page.goto("/certificate/a1");
  74 |     // Redirects to login since auth required
  75 |     await expect(page).toHaveURL(/\/login|\/certificate/);
  76 |   });
  77 | });
  78 | 
  79 | test.describe("API Health Check", () => {
  80 |   test("/api/health returns valid JSON status", async ({ request }) => {
  81 |     const res = await request.get("/api/health");
  82 |     // Accept 200 (healthy) or 503 (degraded/no-DB in test env) — just verify shape
  83 |     expect([200, 503]).toContain(res.status());
  84 |     const body = await res.json();
  85 |     expect(body).toHaveProperty("status");
  86 |     expect(["ok", "degraded", "error"]).toContain(body.status);
  87 |     expect(body).toHaveProperty("timestamp");
  88 |   });
  89 | });
  90 | 
```
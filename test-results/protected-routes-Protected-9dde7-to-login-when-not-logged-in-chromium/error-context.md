# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: protected-routes.spec.ts >> Protected Routes — Unauthenticated Redirects >> /pronunciation redirects to /login when not logged in
- Location: e2e/protected-routes.spec.ts:23:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/login/
Received string:  "http://localhost:3000/pronunciation"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://localhost:3000/pronunciation"

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
    - heading "🔤 44 Âm IPA Tiếng Anh" [level=1]
    - paragraph: Nhấn vào âm để xem hướng dẫn · Nghe audio · Luyện giọng
    - text: Đã thuộc 0/44
    - button "Reset tiến độ"
    - button "Tất cả 44"
    - button "Vowels 20"
    - button "Consonants 24"
    - button "🇻🇳 Khó 8"
    - text: Dễ Vừa Khó Nguyên âm (Vowels) — 20 âm
    - button "ɪ sit"
    - button "e bed"
    - button "æ cat"
    - button "ʌ cup"
    - button "ɒ hot"
    - button "ʊ book"
    - button "ə about"
    - button "iː see"
    - button "ɑː car"
    - button "ɔː door"
    - button "uː food"
    - button "ɜː bird"
    - button "eɪ day"
    - button "aɪ my"
    - button "ɔɪ boy"
    - button "aʊ now"
    - button "əʊ go"
    - button "ɪə ear"
    - button "eə air"
    - button "ʊə tour"
    - text: Phụ âm (Consonants) — 24 âm
    - button "p pen"
    - button "b bag"
    - button "t ten"
    - button "d dog"
    - button "k cat"
    - button "ɡ go"
    - button "f fish"
    - button "v van"
    - button "θ think"
    - button "ð this"
    - button "s sun"
    - button "z zoo"
    - button "ʃ she"
    - button "ʒ measure"
    - button "h hat"
    - button "tʃ chair"
    - button "dʒ jump"
    - button "m man"
    - button "n no"
    - button "ŋ sing"
    - button "l leg"
    - button "r red"
    - button "j yes"
    - button "w wet"
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
from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    file = Path(path)
    text = file.read_text()
    if old in text:
        file.write_text(text.replace(old, new, 1))
        return
    if new not in text:
        raise SystemExit(f"Expected text not found in {path}: {old[:100]!r}")


replace(
    "src/app/layout.tsx",
    '    "Nền tảng tự học tiếng Anh cá nhân hóa với phương pháp IPOR, luyện nói phản xạ và ôn tập thông minh FSRS. Miễn phí hoàn toàn.",',
    '    "Hành trình luyện nói 28 ngày cho người Việt mất gốc: mỗi ngày 10–15 phút để luyện giới thiệu bản thân và công việc bằng tiếng Anh.",',
)
replace("src/app/layout.tsx", '    "A1 B1 B2",', '    "tiếng Anh cho người mất gốc",')
replace(
    "src/app/layout.tsx",
    '      "Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0. Miễn phí hoàn toàn.",',
    '      "Hành trình luyện nói 28 ngày, mỗi ngày 10–15 phút, dành cho người Việt bắt đầu từ mất gốc.",',
)
replace(
    "src/app/layout.tsx",
    '      "Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0.",',
    '      "Luyện giới thiệu bản thân và công việc bằng tiếng Anh trong hành trình 28 ngày.",',
)

replace(
    "src/app/page.tsx",
    '    "Nền tảng tự học tiếng Anh cá nhân hóa với phương pháp IPOR, luyện nói phản xạ và ôn tập thông minh FSRS. Miễn phí hoàn toàn.",',
    '    "Hành trình luyện nói 28 ngày cho người Việt mất gốc: mỗi ngày 10–15 phút để luyện giới thiệu bản thân và công việc bằng tiếng Anh.",',
)
replace(
    "src/app/page.tsx",
    '      "Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0. Miễn phí hoàn toàn trong giai đoạn Open Beta.",',
    '      "Hành trình luyện nói 28 ngày, mỗi ngày 10–15 phút, dành cho người Việt bắt đầu từ mất gốc.",',
)
replace(
    "src/app/page.tsx",
    '''  const stats = [
    { value: "Open Beta", label: "Thử nghiệm mở" },
    { value: "15 phút", label: "Mỗi bài học hàng ngày" },
    { value: "A1 - C1", label: "Lộ trình đầy đủ" },
  ];''',
    '''  const stats = [
    { value: "28 ngày", label: "Một mục tiêu nói thực tế" },
    { value: "10–15 phút", label: "Mỗi ngày" },
    { value: "A0", label: "Bắt đầu từ mất gốc" },
  ];''',
)
replace(
    "src/app/page.tsx",
    '        "description": "Nền tảng tự học tiếng Anh cá nhân hóa với phương pháp IPOR và FSRS",',
    '        "description": "Hành trình luyện nói 28 ngày cho người Việt mất gốc, mỗi ngày 10–15 phút",',
)
replace(
    "src/app/page.tsx",
    '        "description": "Học tiếng Anh để nói được, không chỉ để biết",',
    '        "description": "Luyện nhiệm vụ nói công việc đầu tiên trong hành trình 28 ngày",',
)
replace(
    "src/app/page.tsx",
    '''        "sameAs": [],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "VND",
          "availability": "https://schema.org/InStock",
          "description": "Miễn phí hoàn toàn trong giai đoạn Open Beta",
        },''',
    '''        "sameAs": [],''',
)
replace(
    "src/app/page.tsx",
    '              "text": "Hoàn toàn học được! Lộ trình của AtoEnglish được thiết kế đặc biệt từ cơ bản nhất (A1). Phương pháp 4 bước (IPOR) giúp chia nhỏ bài học: bạn sẽ tích lũy từ vựng qua hình ảnh/âm thanh, luyện tập viết câu phản xạ và thực hành nói nhại giọng (Shadowing) mà không bị áp lực ngữ pháp hàn lâm.",',
    '              "text": "Có. Hành trình đầu tiên bắt đầu từ A0 và tập trung vào một nhiệm vụ thực tế: giới thiệu bản thân, công việc và biết xin người đối diện nhắc lại hoặc nói chậm hơn.",',
)
replace(
    "src/app/page.tsx",
    '              "text": "Chỉ 15–20 phút mỗi ngày là đủ để tạo ra tiến bộ thực sự. Mỗi bài học được thiết kế hoàn chỉnh trong khoảng 40 phút, nhưng bạn hoàn toàn có thể học theo từng phần nhỏ. Hệ thống nhắc nhở thông minh và streak sẽ giúp bạn duy trì thói quen học hàng ngày một cách tự nhiên.",',
    '              "text": "Mục tiêu là 10–15 phút mỗi ngày trong 28 ngày. Mỗi buổi tập trung vào một bước nhỏ: nghe mẫu, luyện cụm từ, nói có hướng dẫn và ôn lại nội dung cần nhớ.",',
)
replace(
    "src/app/page.tsx",
    '            "name": "Sản phẩm có thực sự miễn phí không?",',
    '            "name": "Tôi có thể học thử trước khi tham gia pilot không?",',
)
replace(
    "src/app/page.tsx",
    '              "text": "Có, hoàn toàn miễn phí! Hiện tại AtoEnglish đang trong giai đoạn thử nghiệm mở (Open Beta). Chúng tôi cam kết mở khóa toàn bộ các bài học giao tiếp, công cụ ôn tập lật thẻ SRS và bài tập luyện nói phản xạ cơ bản miễn phí 100% cho tất cả người học.",',
    '              "text": "Có. Bạn có thể học thử bài đầu tiên trước khi quyết định tham gia. Điều kiện, lịch học và chi phí của pilot 28 ngày sẽ được thông báo rõ trước khi mở tuyển.",',
)
replace("src/app/page.tsx", "                  Phương pháp học thế hệ mới", "                  Thử nghiệm hành trình nói 28 ngày")
replace(
    "src/app/page.tsx",
    '''                Luyện phản xạ nói thực tế cho người Việt.
                <br className="hidden sm:block" />
                Học theo phương pháp IPOR + FSRS, thực hành ngay từ bài đầu.''',
    '''                Giới thiệu bản thân và công việc bằng tiếng Anh.
                <br className="hidden sm:block" />
                Mỗi ngày 10–15 phút: nghe mẫu, luyện cụm từ và nói có hướng dẫn.''',
)
replace(
    "src/app/page.tsx",
    "              * Dự án đang trong giai đoạn thử nghiệm mở (Open Beta). Mọi bài học đều hoàn toàn miễn phí.",
    "              * AtoEnglish đang thử nghiệm hành trình đầu tiên. Đây là mục tiêu học tập, không phải cam kết kết quả cho mọi người.",
)

replace(
    "src/components/landing/HeroCTA.tsx",
    '''const QUICK_STATS = [
  { icon: "🆓", text: "Miễn phí Open Beta" },
  { icon: "🗣️", text: "Luyện nói Shadowing + Roleplay" },
  { icon: "🔁", text: "Ôn tập bằng FSRS" },
  { icon: "🇻🇳", text: "Dành cho người Việt" },
];''',
    '''const QUICK_STATS = [
  { icon: "🗓️", text: "28 ngày · một mục tiêu nói" },
  { icon: "⏱️", text: "10–15 phút mỗi ngày" },
  { icon: "💼", text: "Luyện nói cho công việc" },
  { icon: "🇻🇳", text: "Dành cho người Việt mất gốc" },
];''',
)
replace(
    "src/components/landing/HeroCTA.tsx",
    '{isLoggedIn ? "Vào Dashboard" : "Học thử ngay"}',
    '{isLoggedIn ? "Vào Dashboard" : "Bắt đầu bài đầu tiên"}',
)

replace(
    "src/components/landing/FaqSection.tsx",
    '      a: "Hoàn toàn học được! Lộ trình của AtoEnglish được thiết kế đặc biệt từ cơ bản nhất (A1). Phương pháp 4 bước (IPOR) giúp chia nhỏ bài học: bạn sẽ tích lũy từ vựng qua hình ảnh/âm thanh, luyện tập viết câu phản xạ và thực hành nói nhại giọng (Shadowing) mà không bị áp lực ngữ pháp hàn lâm.",',
    '      a: "Có. Hành trình đầu tiên bắt đầu từ A0 và tập trung vào một nhiệm vụ thực tế: giới thiệu bản thân, công việc và biết xin người đối diện nhắc lại hoặc nói chậm hơn.",',
)
replace(
    "src/components/landing/FaqSection.tsx",
    '      a: "Chỉ 15–20 phút mỗi ngày là đủ để tạo ra tiến bộ thực sự. Mỗi bài học được thiết kế hoàn chỉnh trong khoảng 40 phút, nhưng bạn hoàn toàn có thể học theo từng phần nhỏ. Hệ thống nhắc nhở thông minh và streak sẽ giúp bạn duy trì thói quen học hàng ngày một cách tự nhiên.",',
    '      a: "Mục tiêu là 10–15 phút mỗi ngày trong 28 ngày. Mỗi buổi tập trung vào một bước nhỏ: nghe mẫu, luyện cụm từ, nói có hướng dẫn và ôn lại nội dung cần nhớ.",',
)
replace(
    "src/components/landing/FaqSection.tsx",
    '      q: "Sản phẩm có thực sự miễn phí không?",',
    '      q: "Tôi có thể học thử trước khi tham gia pilot không?",',
)
replace(
    "src/components/landing/FaqSection.tsx",
    '      a: "Có, hoàn toàn miễn phí! Hiện tại AtoEnglish đang trong giai đoạn thử nghiệm mở (Open Beta). Chúng tôi cam kết mở khóa toàn bộ các bài học giao tiếp, công cụ ôn tập lật thẻ SRS và bài tập luyện nói phản xạ cơ bản miễn phí 100% cho tất cả người học trải nghiệm trong giai đoạn này.",',
    '      a: "Có. Bạn có thể học thử bài đầu tiên trước khi quyết định tham gia. Điều kiện, lịch học và chi phí của pilot 28 ngày sẽ được thông báo rõ trước khi mở tuyển.",',
)
replace(
    "src/components/landing/FaqSection.tsx",
    '      a: "Hoàn toàn phù hợp với người bận rộn! AtoEnglish được thiết kế cho lịch học linh hoạt. Chỉ cần 15 phút mỗi ngày — tương đương một lần đi thang máy hoặc chờ cafe — là đủ để tiến bộ. Hệ thống FSRS tự động điều chỉnh lịch ôn tập, không cần học liên tục mới nhớ được. Nhiều học viên đang làm việc 8 tiếng/ngày vẫn duy trì streak 90+ ngày.",',
    '      a: "Hành trình được thiết kế theo các phiên 10–15 phút. Khi bận, bạn có thể hoàn thành một bước nhỏ rồi tiếp tục ở lần sau; điều quan trọng là quay lại và thực hiện nhiệm vụ nói, không phải giữ streak bằng mọi giá.",',
)

replace("src/components/landing/FinalCtaSection.tsx", "              Sẵn sàng bắt đầu hành trình nói tiếng Anh tự tin?", "              Sẵn sàng luyện nhiệm vụ nói đầu tiên?")
replace(
    "src/components/landing/FinalCtaSection.tsx",
    "              Bạn có thể thử ngay không cần tài khoản. Miễn phí trong giai đoạn Open Beta.",
    "              Bắt đầu bằng bài giới thiệu bản thân và công việc. Mỗi ngày 10–15 phút, học thử bài đầu không cần tài khoản.",
)
replace(
    "src/components/landing/FinalCtaSection.tsx",
    "                Đang trong giai đoạn Open Beta — Hoàn toàn miễn phí",
    "                Hành trình thử nghiệm 28 ngày · Bắt đầu từ A0",
)
replace(
    "src/components/landing/FinalCtaSection.tsx",
    ': "Học thử ngay (không cần đăng nhập)"}',
    ': "Bắt đầu bài đầu tiên"}',
)
replace(
    "src/components/landing/FinalCtaSection.tsx",
    "              Đăng ký nhanh qua Google • Học miễn phí hoàn toàn",
    "              Đăng ký nhanh qua Google • Điều kiện pilot sẽ được thông báo rõ",
)

replace(
    "src/app/login/page.tsx",
    '''                      Tạo lộ trình học tiếng Anh{" "}
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                        riêng cho bạn
                      </span>''',
    '''                      Bắt đầu hành trình nói{" "}
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                        28 ngày
                      </span>''',
)
replace(
    "src/app/login/page.tsx",
    '                      Chỉ <strong className="text-zinc-700 dark:text-zinc-300">1 câu hỏi</strong> về trình độ — AtoEnglish sẽ gợi lộ trình phù hợp.',
    "                      Chọn trình độ gần nhất để AtoEnglish gợi ý điểm bắt đầu cho nhiệm vụ nói đầu tiên.",
)
replace(
    "src/app/login/page.tsx",
    '{["🎯 Lộ trình A1→C1", "⏱ 15 phút/ngày", "🔬 Thuật toán FSRS"].map((tag) => (',
    '{["🗓 28 ngày · 1 mục tiêu nói", "⏱ 10–15 phút/ngày", "🌱 Bắt đầu từ A0"].map((tag) => (',
)
replace("src/app/login/page.tsx", "                    Bắt đầu — Miễn phí 🚀", "                    Chọn điểm bắt đầu 🚀")
replace("src/app/login/page.tsx", "                           <span>Đã thiết lập xong lộ trình tối ưu!</span>", "                           <span>Đã chọn điểm bắt đầu phù hợp</span>")
replace("src/app/login/page.tsx", '? "Lộ trình của bạn đã sẵn sàng!"', '? "Bài học đầu tiên đã sẵn sàng!"')
replace(
    "src/app/login/page.tsx",
    '? "Đăng ký hoặc đăng nhập để bắt đầu bài học đầu tiên thiết kế riêng cho bạn."',
    '? "Đăng ký hoặc đăng nhập để bắt đầu luyện nhiệm vụ nói đầu tiên."',
)
replace(
    "src/app/login/page.tsx",
    '? "Đăng ký nhanh để bắt đầu hành trình học tiếng Anh ngay hôm nay."',
    '? "Đăng ký nhanh để bắt đầu bài học đầu tiên."',
)
replace("src/app/login/page.tsx", '? "Kích hoạt lộ trình học"', '? "Bắt đầu bài học đầu tiên"')

replace(
    "src/app/(main)/dashboard/components/DashboardClient.tsx",
    '''              !
            </h1>
          </div>''',
    '''              !
            </h1>
            <p data-testid="pilot-promise" className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              Mỗi ngày 10–15 phút: tiến thêm một bước trong hành trình nói 28 ngày.
            </p>
          </div>''',
)

replace(
    "e2e/protected-routes.spec.ts",
    '''  test("has microstats trust bar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Miễn phí/i).first()).toBeVisible({ timeout: 10000 });
  });''',
    '''  test("states the focused 28-day pilot promise", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("28 ngày", { exact: true }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("10–15 phút", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("A0", { exact: true }).first()).toBeVisible();
  });''',
)
replace(
    "e2e/protected-routes.spec.ts",
    'test.describe("API Health Check", () => {',
    '''test.describe("Pilot Promise — Consistent Entry Experience", () => {
  test("onboarding repeats the same duration and beginner starting point", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("28 ngày", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/10–15 phút\/ngày/).first()).toBeVisible();
    await expect(page.getByText(/Bắt đầu từ A0/).first()).toBeVisible();
  });

  test("dashboard reinforces the daily speaking step", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page.getByTestId("pilot-promise")).toContainText("10–15 phút");
    await expect(page.getByTestId("pilot-promise")).toContainText("28 ngày");
  });
});

test.describe("API Health Check", () => {''',
)

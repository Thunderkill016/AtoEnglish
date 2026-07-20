import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Sparkles, Sprout } from "lucide-react";

import { Spotlight } from "@/components/ui/spotlight";
import NavbarAuth from "@/components/landing/NavbarAuth";
import { MobileMenuButton, MobileMenu } from "@/components/landing/MobileMenu";
import HeroCTA from "@/components/landing/HeroCTA";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ScienceSection from "@/components/landing/ScienceSection";

// Lazy load heavy client components below the fold
const ProductPreview = dynamic(
  () => import("@/components/landing/ProductPreview"),
  {
    loading: () => (
      <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 h-[400px] rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 animate-pulse" />
    ),
  }
);

const FaqSection = dynamic(
  () => import("@/components/landing/FaqSection")
);

const TestimonialsSection = dynamic(
  () => import("@/components/landing/TestimonialsSection")
);

const FinalCtaSection = dynamic(
  () => import("@/components/landing/FinalCtaSection")
);

export const metadata: Metadata = {
  title: "AtoEnglish — Đạt B1, dùng tiếng Anh độc lập",
  description:
    "Web học tiếng Anh cho người Việt: lộ trình A0→B1, giải thích tiếng Việt, luyện nói có kiểm soát và ôn FSRS. Open Beta miễn phí.",
  openGraph: {
    title: "AtoEnglish — Đạt B1 Independent User",
    description:
      "Từ mất gốc đến dùng được tiếng Anh độc lập. Lộ trình A0→B1, nói thật, nhớ lâu. Miễn phí Open Beta.",
    url: "https://atoenglish.vercel.app",
    siteName: "AtoEnglish",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://atoenglish.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "AtoEnglish — Học tiếng Anh để nói được, không chỉ để biết",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AtoEnglish — Học tiếng Anh để nói được",
    description:
      "Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0.",
    images: ["https://atoenglish.vercel.app/og-image.png"],
  },
  alternates: {
    canonical: "https://atoenglish.vercel.app",
  },
};

export default function LandingPage() {
  const stats = [
    { value: "A0 → B1", label: "Lộ trình Independent User" },
    { value: "42 bài", label: "LessonSpec có can-do đo được" },
    { value: "15–20 phút", label: "Mỗi ngày là đủ để tiến bộ" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://atoenglish.vercel.app/#website",
        "url": "https://atoenglish.vercel.app",
        "name": "AtoEnglish",
        "description": "Nền tảng tự học tiếng Anh cá nhân hóa với phương pháp IPOR và FSRS",
        "inLanguage": "vi",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://atoenglish.vercel.app/learn?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://atoenglish.vercel.app/#organization",
        "name": "AtoEnglish",
        "url": "https://atoenglish.vercel.app",
        "logo": "https://atoenglish.vercel.app/icon-512.png",
        "description": "Học tiếng Anh để nói được, không chỉ để biết",
        "sameAs": [],
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "VND",
          "availability": "https://schema.org/InStock",
          "description": "Miễn phí hoàn toàn trong giai đoạn Open Beta",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://atoenglish.vercel.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Người mất gốc hoặc mới bắt đầu từ con số 0 có học được không?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hoàn toàn học được! Lộ trình của AtoEnglish được thiết kế đặc biệt từ cơ bản nhất (A1). Phương pháp 4 bước (IPOR) giúp chia nhỏ bài học: bạn sẽ tích lũy từ vựng qua hình ảnh/âm thanh, luyện tập viết câu phản xạ và thực hành nói nhại giọng (Shadowing) mà không bị áp lực ngữ pháp hàn lâm.",
            },
          },
          {
            "@type": "Question",
            "name": "Mỗi ngày tôi cần học bao lâu?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Chỉ 15–20 phút mỗi ngày là đủ để tạo ra tiến bộ thực sự. Mỗi bài học được thiết kế hoàn chỉnh trong khoảng 40 phút, nhưng bạn hoàn toàn có thể học theo từng phần nhỏ. Hệ thống nhắc nhở thông minh và streak sẽ giúp bạn duy trì thói quen học hàng ngày một cách tự nhiên.",
            },
          },
          {
            "@type": "Question",
            "name": "AtoEnglish khác gì so với Duolingo hay Babbel?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AtoEnglish tập trung vào giao tiếp thực tế cho người Việt — không gamification hời hợt. Bạn học theo phương pháp khoa học PPP kết hợp FSRS, thực hành nói Shadowing thực sự và roleplay tình huống. Nội dung được thiết kế sát nhu cầu của người học Việt Nam.",
            },
          },
          {
            "@type": "Question",
            "name": "Tôi có phải cài đặt ứng dụng vào điện thoại không?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Không cần. AtoEnglish là một nền tảng Web-App hiện đại, chạy trực tiếp trên trình duyệt web của bạn. Giao diện được tối ưu hóa mượt mà cho cả điện thoại di động, máy tính bảng lẫn máy tính cá nhân. Chỉ cần mở trình duyệt, đăng nhập nhanh bằng Google là học được ngay.",
            },
          },
          {
            "@type": "Question",
            "name": "Sản phẩm có thực sự miễn phí không?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Có, hoàn toàn miễn phí! Hiện tại AtoEnglish đang trong giai đoạn thử nghiệm mở (Open Beta). Chúng tôi cam kết mở khóa toàn bộ các bài học giao tiếp, công cụ ôn tập lật thẻ SRS và bài tập luyện nói phản xạ cơ bản miễn phí 100% cho tất cả người học.",
            },
          },
          {
            "@type": "Question",
            "name": "Thuật toán Ôn tập ngắt quãng (FSRS) là gì?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "FSRS (Free Spaced Repetition Scheduler) là thuật toán khoa học ghi nhớ tiên tiến bậc nhất hiện nay. FSRS đo lường mức độ ghi nhớ của bạn và tự động lên lịch nhắc nhở ôn tập vào đúng thời điểm vàng ngay trước khi bạn chuẩn bị quên. Nhờ đó, bạn ghi nhớ từ vựng lâu hơn đáng kể so với cách học vẹt truyền thống.",
            },
          },
          {
            "@type": "Question",
            "name": "Dữ liệu và tiến độ học của tôi có được bảo mật không?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hoàn toàn bảo mật. AtoEnglish sử dụng Supabase với Row Level Security (RLS) — dữ liệu của bạn chỉ có thể được truy cập bởi chính bạn. Đăng nhập qua Google OAuth 2.0 được mã hóa an toàn. Chúng tôi không bán hay chia sẻ dữ liệu cá nhân với bên thứ ba.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground overflow-x-hidden antialiased">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ===== Navigation Bar ===== */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col text-left leading-none">
              <span className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary">
                AtoEnglish
              </span>
              <span className="text-[9px] font-medium text-muted-foreground">
                A0 → B1 Independent
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Cách học
            </a>
            <a
              href="#science"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Phương pháp
            </a>
            <a
              href="#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Hỏi đáp
            </a>
          </div>

          <div className="flex items-center gap-2">
            <NavbarAuth />
            {/* Hamburger button - mobile only */}
            <MobileMenuButton />
          </div>
        </div>

        {/* Mobile drawer menu */}
        <MobileMenu />
      </nav>

      <main id="main-content">
        {/* ===== Hero Section ===== */}
        <section className="relative px-5 sm:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-28 overflow-hidden">
          {/* Spotlight light beam — hidden on mobile to save GPU paint cost */}
          <div className="hidden sm:block">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="rgb(16 185 129 / 0.15)" />
          </div>

          {/* Mesh gradient backdrops — hidden on mobile to save GPU */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            <div className="hidden sm:block absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/8 dark:bg-emerald-500/4 blur-[120px]" />
            <div className="hidden sm:block absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/8 dark:bg-teal-500/4 blur-[150px]" />
            <div className="hidden md:block absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/3 blur-[100px]" />
          </div>

          <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="space-y-6 sm:space-y-8">
              {/* Badge */}
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary">
                  <Sparkles className="size-3" />
                  Dành cho người Việt · Open Beta
                </span>
              </div>

              <h1 className="animate-fade-in-up animation-delay-75 mx-auto flex max-w-4xl flex-col items-center gap-y-2 px-4 text-2xl font-semibold tracking-tight text-foreground sm:gap-y-3 sm:text-4xl md:text-5xl lg:text-6xl">
                <span className="block lg:whitespace-nowrap">
                  Đạt{" "}
                  <span className="text-primary">B1</span>
                  {" — "}
                  dùng tiếng Anh độc lập
                </span>
                <span className="block text-lg font-medium text-muted-foreground sm:text-2xl md:text-3xl lg:whitespace-nowrap">
                  Lộ trình A0→B1 · giải thích tiếng Việt · luyện nói thật
                </span>
              </h1>

              {/* Subheadline */}
              <p className="animate-fade-in-up animation-delay-150 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-350 max-w-2xl mx-auto leading-relaxed font-normal">
                Luyện phản xạ nói thực tế cho người Việt.
                <br className="hidden sm:block" />
                Học theo phương pháp IPOR + FSRS, thực hành ngay từ bài đầu.
              </p>

              <HeroCTA />
            </div>
          </div>

          {/* Product Preview Mockup */}
          <ProductPreview />

          {/* Stats bar */}
          <div className="animate-fade-in-up animation-delay-300 relative max-w-3xl mx-auto mt-16 sm:mt-24">
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-zinc-200/60 dark:divide-zinc-800/60">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 w-full pt-4 sm:pt-0 sm:px-6 first:pt-0"
                >
                  <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                    {stat.value}
                  </span>
                  <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-semibold mt-1.5 uppercase tracking-wider text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            {/* Footnote */}
            <p className="text-[11px] text-zinc-450 dark:text-zinc-500 mt-5 text-center font-normal tracking-wide">
              * Dự án đang trong giai đoạn thử nghiệm mở (Open Beta). Mọi bài học đều hoàn toàn miễn phí.
            </p>
          </div>
        </section>

        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_600px]">
          <ProblemSection />
        </div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_800px]">
          <HowItWorksSection />
        </div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_600px]">
          <BenefitsSection />
        </div>
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_700px]">
          <ScienceSection />
        </div>

        {/* Below-fold lazy sections — browser can defer rendering */}
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_800px]">
          <TestimonialsSection />
          <FaqSection />
          <FinalCtaSection />
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="border-t border-zinc-200/40 dark:border-zinc-800/40 py-10 sm:py-12 px-5 sm:px-8 bg-zinc-50/20 dark:bg-zinc-950/20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                AtoEnglish
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
                Grow every day
              </span>
            </div>
          </div>

          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
            &copy; {new Date().getFullYear()} AtoEnglish. Bảo lưu mọi quyền.
          </span>

          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-xs text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-normal"
            >
              Bảo mật
            </Link>
            <Link
              href="/terms"
              className="text-xs text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-normal"
            >
              Điều khoản
            </Link>
            <Link
              href="mailto:support@atoenglish.com"
              className="text-xs text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors font-normal"
            >
              Hỗ trợ
            </Link>

          </div>
        </div>
      </footer>
    </div>
  );
}
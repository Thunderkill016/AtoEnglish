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
    ssr: false,
    loading: () => (
      <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 h-[400px] rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 animate-pulse" />
    ),
  }
);

const FaqSection = dynamic(
  () => import("@/components/landing/FaqSection"),
  { ssr: false }
);

const FinalCtaSection = dynamic(
  () => import("@/components/landing/FinalCtaSection"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "AtoEnglish — Học tiếng Anh để nói được, không chỉ để biết",
  description:
    "Nền tảng tự học tiếng Anh cá nhân hóa với phương pháp IPOR, luyện nói phản xạ và ôn tập thông minh FSRS. Miễn phí hoàn toàn.",
  openGraph: {
    title: "AtoEnglish — Học tiếng Anh để nói được",
    description:
      "Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0. Miễn phí hoàn toàn trong giai đoạn Open Beta.",
    url: "https://atoenglish.vercel.app",
    siteName: "AtoEnglish",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AtoEnglish — Học tiếng Anh để nói được",
    description:
      "Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0.",
  },
  alternates: {
    canonical: "https://atoenglish.vercel.app",
  },
};

export default function LandingPage() {
  const stats = [
    { value: "Open Beta", label: "Thử nghiệm mở" },
    { value: "15 phút", label: "Mỗi bài học hàng ngày" },
    { value: "A1 - C1", label: "Lộ trình đầy đủ" },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/40 selection:text-emerald-900 dark:selection:text-emerald-100 overflow-x-hidden antialiased">
      {/* ===== Navigation Bar ===== */}
      <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40 transition-colors duration-300">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                AtoEnglish
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
                Grow every day
              </span>
            </div>
          </Link>

          {/* Middle links - desktop only */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-sm font-bold text-zinc-650 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              Cách học
            </a>
            <a
              href="#science"
              className="text-sm font-bold text-zinc-650 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors duration-200"
            >
              Phương pháp
            </a>
            <a
              href="#faq"
              className="text-sm font-bold text-zinc-650 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors duration-200"
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
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 backdrop-blur-sm border border-emerald-500/20 dark:border-emerald-400/25 px-4 py-1.5 rounded-full uppercase tracking-[0.12em] shadow-sm">
                  <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  Phương pháp học thế hệ mới
                </span>
              </div>

              {/* Headline */}
              <h1 className="animate-fade-in-up animation-delay-75 flex flex-col items-center gap-y-2 sm:gap-y-3 text-xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto px-4">
                <span className="block lg:whitespace-nowrap">
                  Học tiếng Anh để{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300">
                    nói được
                  </span>
                </span>
                <span className="block lg:whitespace-nowrap">
                  không chỉ để biết.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="animate-fade-in-up animation-delay-150 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-350 max-w-2xl mx-auto leading-relaxed font-normal">
                Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0.
                <br className="hidden sm:block" />
                Luyện nói chủ động ngay từ những bài học đầu tiên.
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
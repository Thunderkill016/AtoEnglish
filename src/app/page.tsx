import Link from "next/link";
import { Sparkles } from "lucide-react";

import NavbarAuth from "@/components/landing/NavbarAuth";
import HeroCTA from "@/components/landing/HeroCTA";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ScienceSection from "@/components/landing/ScienceSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";

export default function LandingPage() {
  const stats = [
    { value: "2,500+", label: "Người học" },
    { value: "15 phút", label: "Mỗi ngày là đủ" },
    { value: "94%", label: "Cải thiện sau 30 ngày" },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/40 selection:text-emerald-900 dark:selection:text-emerald-100 overflow-x-hidden">
      {/* ===== Navigation Bar ===== */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-sm">
              A
            </span>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
              AtoEnglish
            </span>
          </Link>

          <NavbarAuth />
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative px-5 sm:px-8 pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">
        {/* Subtle gradient background orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 uppercase tracking-[0.12em] shadow-sm">
                <Sparkles className="size-3" />
                Phương pháp học thế hệ mới
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up animation-delay-75 text-[2.25rem] leading-[1.12] sm:text-5xl sm:leading-[1.1] lg:text-[3.75rem] lg:leading-[1.08] font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl mx-auto">
              Học tiếng Anh để <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">nói được</span>,
              <br />
              không chỉ để biết.
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up animation-delay-150 text-base sm:text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0.
              <br className="hidden sm:block" />
              Luyện nói ngay từ những bài học đầu tiên.
            </p>

            <HeroCTA />
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-in-up animation-delay-300 relative max-w-2xl mx-auto mt-16 sm:mt-20">
          <div className="flex items-center justify-center divide-x divide-zinc-200 dark:divide-zinc-800">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center px-6 sm:px-10 py-2"
              >
                <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProblemSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ScienceSection />
      <FinalCtaSection />

      {/* ===== Footer ===== */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 py-10 sm:py-12 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-xs">
              A
            </span>
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AtoEnglish
            </span>
          </div>

          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
            &copy; {new Date().getFullYear()} AtoEnglish. Bảo lưu mọi quyền.
          </span>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
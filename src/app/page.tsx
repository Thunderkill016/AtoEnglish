import type { Metadata } from "next";
import Link from "next/link";
import { Sprout } from "lucide-react";

import NavbarAuth from "@/components/landing/NavbarAuth";
import { MobileMenuButton, MobileMenu } from "@/components/landing/MobileMenu";
import HeroCTA from "@/components/landing/HeroCTA";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import ScienceSection from "@/components/landing/ScienceSection";
import FaqSection from "@/components/landing/FaqSection";
import FinalCtaSection from "@/components/landing/FinalCtaSection";

export const metadata: Metadata = {
  title: "AtoEnglish — Đạt B1, dùng tiếng Anh độc lập",
  description:
    "Web học tiếng Anh cho người Việt: lộ trình A0→B1, giải thích tiếng Việt, luyện nói có kiểm soát và ôn FSRS. Open Beta miễn phí.",
  openGraph: {
    title: "AtoEnglish — Đạt B1 Independent User",
    description:
      "Từ mất gốc đến dùng được tiếng Anh độc lập. Lộ trình A0→B1, nói thật, nhớ lâu.",
    url: "https://atoenglish.vercel.app",
    siteName: "AtoEnglish",
    locale: "vi_VN",
    type: "website",
  },
  alternates: { canonical: "https://atoenglish.vercel.app" },
};

const STATS = [
  { value: "A0 → B1", label: "Lộ trình Independent User" },
  { value: "42 bài", label: "Có can-do đo được" },
  { value: "15–20 phút", label: "Mỗi ngày là đủ" },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="relative mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              AtoEnglish
            </span>
          </Link>

          <nav
            className="hidden items-center gap-6 md:flex"
            aria-label="Landing"
          >
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Cách học
            </a>
            <a
              href="#science"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Phương pháp
            </a>
            <a
              href="#faq"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Hỏi đáp
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <NavbarAuth />
            <MobileMenuButton />
          </div>
          <MobileMenu />
        </div>
      </header>

      <main id="main-content">
        {/* Hero — first viewport job: understand B1 + CTA */}
        <section className="px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Người Việt · Open Beta
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              Đạt <span className="text-primary">B1</span> — dùng tiếng Anh độc
              lập
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Lộ trình A0→B1, giải thích tiếng Việt, luyện nói có kiểm soát.
              Không gamification rỗng.
            </p>
            <div className="mt-8">
              <HeroCTA />
            </div>
          </div>

          {/* Stats — attached to hero, not orphan strip */}
          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {STATS.map((s) => (
              <div
                key={s.value}
                className="rounded-xl border border-border bg-card px-4 py-4 text-center"
              >
                <dt className="text-lg font-semibold tabular-nums sm:text-xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-muted-foreground">{s.label}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Open Beta — bài học hiện miễn phí.
          </p>
        </section>

        <ProblemSection />
        <HowItWorksSection />
        <BenefitsSection />
        <ScienceSection />
        <FaqSection />
        <FinalCtaSection />
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sprout className="size-3.5" />
            </span>
            <span className="text-sm font-medium">AtoEnglish</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AtoEnglish
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Bảo mật
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Điều khoản
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

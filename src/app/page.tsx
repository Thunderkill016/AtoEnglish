import type { Metadata } from "next";
import Link from "next/link";
import { Sprout } from "lucide-react";

import NavbarAuth from "@/components/landing/NavbarAuth";
import { MobileMenuButton, MobileMenu } from "@/components/landing/MobileMenu";
import HeroCTA from "@/components/landing/HeroCTA";

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://atoenglish.vercel.app/#website",
        url: "https://atoenglish.vercel.app",
        name: "AtoEnglish",
        description:
          "Nền tảng tự học tiếng Anh cá nhân hóa với phương pháp IPOR và FSRS",
        inLanguage: "vi",
      },
      {
        "@type": "EducationalOrganization",
        "@id": "https://atoenglish.vercel.app/#organization",
        name: "AtoEnglish",
        url: "https://atoenglish.vercel.app",
        logo: "https://atoenglish.vercel.app/icon-512.png",
        description: "Học tiếng Anh để nói được, không chỉ để biết",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "VND",
          availability: "https://schema.org/InStock",
          description: "Miễn phí hoàn toàn trong giai đoạn Open Beta",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Sprout className="size-4.5" />
            </span>
            <span className="text-sm font-bold tracking-tight">AtoEnglish</span>
          </Link>
          <div className="flex items-center gap-2">
            <NavbarAuth />
            <MobileMenuButton />
          </div>
        </div>
        <MobileMenu />
      </nav>

      <main id="main-content" className="flex flex-col items-center justify-center px-5 sm:px-8 py-20 sm:py-28 min-h-[calc(100dvh-4rem)]">
        <div className="max-w-xl w-full text-center space-y-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight">
            Học tiếng Anh để{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              nói được
            </span>
            , không chỉ để biết.
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            IPOR + FSRS + Shadowing — 15 phút mỗi ngày. Miễn phí trong Open Beta.
          </p>
          <HeroCTA align="center" />
        </div>
      </main>

      <footer className="border-t border-zinc-200/40 dark:border-zinc-800/40 py-8 px-5 text-center">
        <p className="text-xs text-zinc-500">
          &copy; {new Date().getFullYear()} AtoEnglish ·{" "}
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Bảo mật
          </Link>
          {" · "}
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">
            Điều khoản
          </Link>
        </p>
      </footer>
    </div>
  );
}
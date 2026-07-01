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
    <div className="min-h-screen bg-zinc-950 text-white font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-400 text-white">
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

      <main className="flex flex-col items-center justify-center px-5 sm:px-8 py-20 sm:py-28 text-center">
        <div className="max-w-3xl w-full space-y-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-[-2px]">
            Học tiếng Anh để{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              nói được
            </span>
            , không chỉ để biết.
          </h1>
          <p className="text-xl text-zinc-400 max-w-xl mx-auto">
            IPOR + FSRS + Shadowing. 15 phút mỗi ngày. Bắt đầu ngay không cần tài khoản.
          </p>

          <HeroCTA align="center" />

          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tình huống thực tế", desc: "Công việc, du lịch, phỏng vấn – học để dùng ngay" },
              { title: "Phản xạ nói", desc: "Shadowing + roleplay giúp bật câu tự nhiên" },
              { title: "Ôn tập thông minh", desc: "FSRS nhắc đúng lúc sắp quên, nhớ lâu" },
              { title: "Siêu ngắn gọn", desc: "Bài 10-15 phút, mobile-first, dễ duy trì" },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-left">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-zinc-500 pt-4">50 unit A0→B2 • Miễn phí Open Beta • Dành cho người Việt</p>
        </div>
      </main>

      <footer className="border-t border-white/10 py-8 px-5 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} AtoEnglish · <Link href="/privacy" className="hover:text-white">Bảo mật</Link> · <Link href="/terms" className="hover:text-white">Điều khoản</Link>
      </footer>
    </div>
  );
}
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Captions,
  CheckCircle2,
  Link2,
  LockKeyhole,
  Play,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";

import NavbarAuth from "@/components/landing/NavbarAuth";

export const metadata: Metadata = {
  title: "AtoEnglish — Biến video YouTube thành bài học tiếng Anh riêng",
  description:
    "Dán video YouTube có caption tiếng Anh. AtoEnglish tạo bài nghe–nói riêng tư bằng AI từ chính đoạn hội thoại trong video.",
  openGraph: {
    title: "AtoEnglish — Học tiếng Anh từ video bạn thực sự muốn hiểu",
    description:
      "YouTube → transcript → bài nghe–nói AI riêng tư → lưu và học lại.",
    url: "https://atoenglish.vercel.app",
    siteName: "AtoEnglish",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "https://atoenglish.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "AtoEnglish — tạo bài học riêng từ video YouTube",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AtoEnglish — YouTube thành bài học riêng",
    description:
      "Dán video có caption tiếng Anh và tạo bài nghe–nói riêng tư bằng AI.",
    images: ["https://atoenglish.vercel.app/og-image.png"],
  },
  alternates: { canonical: "https://atoenglish.vercel.app" },
};

const STEPS = [
  {
    icon: Link2,
    title: "Dán link YouTube",
    description:
      "Chọn video bạn thực sự quan tâm. MVP hỗ trợ URL YouTube HTTPS có caption tiếng Anh đọc được.",
  },
  {
    icon: Captions,
    title: "AI tạo bài từ lời thoại",
    description:
      "Hệ thống chọn một đoạn hội thoại ngắn, tạo bài nghe hiểu, nhớ lại câu, luyện nói và transfer.",
  },
  {
    icon: LockKeyhole,
    title: "Lưu riêng trong tài khoản",
    description:
      "Bài là AI draft riêng tư. Nó không tự động xuất bản hoặc xuất hiện trong catalog công khai.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AtoEnglish",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
  url: "https://atoenglish.vercel.app",
  inLanguage: "vi",
  description:
    "Ứng dụng tạo bài học tiếng Anh riêng tư từ video YouTube có caption tiếng Anh.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-zinc-950 selection:bg-emerald-200 dark:bg-zinc-950 dark:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/85 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/85">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <Sprout className="size-5" />
            </span>
            <span className="font-black tracking-tight">AtoEnglish</span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="#how-it-works"
              className="hidden text-sm font-bold text-zinc-600 hover:text-emerald-700 dark:text-zinc-400 dark:hover:text-emerald-300 sm:block"
            >
              Cách hoạt động
            </a>
            <NavbarAuth />
          </div>
        </div>
      </nav>

      <main>
        <section className="relative px-4 pb-20 pt-16 sm:px-8 sm:pb-28 sm:pt-24">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-80 w-[50rem] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-black text-emerald-700 dark:text-emerald-300">
                <Sparkles className="size-4" /> Video của bạn. Bài học của bạn.
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Biến video YouTube thành bài học tiếng Anh riêng.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
                Dán video bạn thực sự muốn hiểu. AtoEnglish dùng caption của video
                để tạo một bài nghe–nói bằng AI, kiểm tra câu với nguồn rồi lưu
                riêng vào tài khoản của bạn.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login?next=%2Freal-talk%2Fcreate"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 font-black text-white shadow-xl shadow-emerald-900/15 transition hover:bg-emerald-500"
                >
                  Dán video đầu tiên <ArrowRight className="size-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-zinc-300 px-6 font-bold text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:text-zinc-300"
                >
                  Xem cách hoạt động
                </a>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-zinc-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Không tải
                  xuống video
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> AI draft
                  riêng tư
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-600" /> Có transfer
                  trước khi hoàn thành
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[2rem] border border-zinc-200 bg-zinc-950 p-4 shadow-2xl shadow-zinc-950/20 dark:border-zinc-800">
                <div className="flex items-center gap-2 px-2 pb-4 text-xs text-zinc-500">
                  <span className="size-2.5 rounded-full bg-red-400" />
                  <span className="size-2.5 rounded-full bg-amber-400" />
                  <span className="size-2.5 rounded-full bg-emerald-400" />
                  <div className="ml-2 flex-1 truncate rounded-lg bg-zinc-900 px-3 py-2">
                    youtube.com/watch?v=your-video
                  </div>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-800 to-emerald-950">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-xl shadow-emerald-950/50">
                      <Play className="ml-1 size-7" fill="currentColor" />
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/10 bg-black/55 p-3 text-sm text-white backdrop-blur">
                    “Could you say that again, please?”
                  </div>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-zinc-900 p-4">
                    <p className="text-xs font-bold text-emerald-400">
                      Mục tiêu giao tiếp
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">
                      Xin người đối diện nhắc lại và tiếp tục cuộc nói chuyện
                    </p>
                  </div>
                  <div className="rounded-2xl bg-zinc-900 p-4">
                    <p className="text-xs font-bold text-purple-400">
                      Transfer
                    </p>
                    <p className="mt-2 text-sm font-bold text-white">
                      Thử câu tương tự với người và thông tin khác
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 rounded-2xl border border-amber-400/25 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-900 shadow-xl dark:bg-amber-950 dark:text-amber-200">
                AI draft · chỉ bạn xem
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="border-y border-zinc-200 bg-zinc-50 px-4 py-20 dark:border-zinc-800 dark:bg-zinc-900/30 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">
                Một vòng giá trị rõ ràng
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                Từ link video đến một lượt luyện tập hoàn chỉnh
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                Không phải chatbot mở hay kho unit cố định. MVP tập trung làm tốt
                một việc: biến nội dung bạn chọn thành bài học riêng có bằng chứng
                từ caption.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {STEPS.map(({ icon: Icon, title, description }, index) => (
                <article
                  key={title}
                  className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <Icon className="size-5" />
                    </span>
                    <span className="text-sm font-black text-zinc-300 dark:text-zinc-700">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-zinc-200 p-7 dark:border-zinc-800 sm:p-9">
              <ShieldCheck className="size-8 text-emerald-600" />
              <h2 className="mt-5 text-2xl font-black">Nói thật về giới hạn AI</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                Caption tự động, người nói, bản dịch và timestamp có thể sai. Mỗi
                bài hiển thị nhãn AI draft và cảnh báo nguồn. AtoEnglish không gọi
                một lượt luyện tập là “thành thạo”, “trôi chảy” hay điểm phát âm.
              </p>
            </div>
            <div className="rounded-3xl border border-zinc-200 p-7 dark:border-zinc-800 sm:p-9">
              <LockKeyhole className="size-8 text-purple-600" />
              <h2 className="mt-5 text-2xl font-black">Riêng tư trước, chia sẻ sau</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                Bài tạo ra gắn với tài khoản và được bảo vệ bằng Row Level Security.
                Việc công khai hoặc đưa vào catalog cần một quy trình review riêng;
                generation cá nhân không tự cấp quyền xuất bản.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-8 sm:pb-28">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-zinc-950 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <Sparkles className="mx-auto size-8 text-emerald-400" />
            <h2 className="mt-5 text-3xl font-black sm:text-5xl">
              Bắt đầu bằng video bạn đang muốn hiểu
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Không cần cam kết một lộ trình dài trước. Hãy thử tạo một bài từ nội
              dung thật sự có ý nghĩa với bạn.
            </p>
            <Link
              href="/login?next=%2Freal-talk%2Fcreate"
              className="mt-7 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-emerald-500 px-6 font-black text-zinc-950 hover:bg-emerald-400"
            >
              Tạo bài học riêng <ArrowRight className="size-5" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 px-4 py-8 text-sm text-zinc-500 dark:border-zinc-800 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 AtoEnglish</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-white">
              Quyền riêng tư
            </Link>
            <Link href="/terms" className="hover:text-zinc-950 dark:hover:text-white">
              Điều khoản
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

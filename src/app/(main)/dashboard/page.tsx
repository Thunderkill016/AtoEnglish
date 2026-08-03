import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Link2,
  LockKeyhole,
  Plus,
  Sparkles,
} from "lucide-react";

import { listOwnerPrivateDrafts } from "@/features/real-talk/server/private-draft-library";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Học từ video của bạn | AtoEnglish",
  description:
    "Dán video YouTube, tạo bài học riêng tư và tiếp tục các bài đã lưu.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?mode=login&next=/dashboard");

  const drafts = await listOwnerPrivateDrafts();
  const firstDraft = drafts[0];
  const displayName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : user.email?.split("@")[0] ?? "bạn";

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            Chào {displayName}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
            Bạn muốn hiểu video nào hôm nay?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
            Không cần chọn unit hay lộ trình cố định. Dán video YouTube bạn quan
            tâm, AtoEnglish sẽ tạo một bài nghe–nói riêng từ caption của video đó.
          </p>
        </header>

        <section className="mt-8 overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xl shadow-emerald-950/10 sm:p-9">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
              <Sparkles className="size-4" /> Hành động chính
            </div>
            <h2 className="mt-5 text-2xl font-black sm:text-4xl">
              Dán một link. Nhận một bài học riêng.
            </h2>
            <p className="mt-3 text-sm leading-6 text-emerald-50/85 sm:text-base">
              Hệ thống đọc caption, chọn đoạn hội thoại, tạo hoạt động nghe–nói,
              kiểm tra bằng chứng rồi lưu thành AI draft chỉ bạn xem được.
            </p>
            <Link
              href="/real-talk/create"
              className="mt-6 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-white px-5 font-black text-emerald-800 transition hover:bg-emerald-50"
            >
              <Link2 className="size-5" /> Dán video YouTube
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Dán video", "Video YouTube HTTPS có caption tiếng Anh"],
            ["2", "AI tạo bài", "Nghe, hiểu, nhớ lại, nói và transfer"],
            ["3", "Lưu riêng", "RLS chỉ cho tài khoản của bạn truy cập"],
          ].map(([step, title, description]) => (
            <div
              key={step}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-sm font-black text-emerald-700 dark:text-emerald-300">
                {step}
              </span>
              <h2 className="mt-4 font-black text-zinc-950 dark:text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-zinc-950 dark:text-white">
                <BookOpen className="size-5 text-emerald-600" />
                <h2 className="text-xl font-black">Bài gần đây</h2>
              </div>
              <p className="mt-1 text-sm text-zinc-500">
                AI draft riêng tư, chưa tự động công khai.
              </p>
            </div>
            <Link
              href="/real-talk"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 dark:text-emerald-300"
            >
              Xem tất cả <ArrowRight className="size-4" />
            </Link>
          </div>

          {firstDraft ? (
            <Link
              href={`/real-talk/${encodeURIComponent(firstDraft.slug)}`}
              className="mt-5 flex flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white transition hover:border-emerald-400 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row"
            >
              <div className="aspect-video shrink-0 bg-zinc-200 sm:w-64">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={firstDraft.thumbnailUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-wide">
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-amber-700 dark:text-amber-300">
                    AI draft
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {firstDraft.level}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-black text-zinc-950 dark:text-white">
                  {firstDraft.titleVi}
                </h3>
                <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                  {firstDraft.title}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-300">
                  Mở bài học <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <LockKeyhole className="mx-auto size-8 text-zinc-400" />
              <h3 className="mt-4 font-black text-zinc-950 dark:text-white">
                Chưa có bài học riêng
              </h3>
              <p className="mt-2 text-sm text-zinc-500">
                Bài đầu tiên sẽ xuất hiện ở đây sau khi được tạo và lưu thành công.
              </p>
              <Link
                href="/real-talk/create"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-600 px-4 font-bold text-white"
              >
                <Plus className="size-4" /> Tạo bài đầu tiên
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

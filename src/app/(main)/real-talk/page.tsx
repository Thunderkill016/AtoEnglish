import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Plus, Sparkles } from "lucide-react";

import { listOwnerPrivateDrafts } from "@/features/real-talk/server/private-draft-library";

export const metadata: Metadata = {
  title: "Bài học YouTube của tôi | AtoEnglish",
  description: "Tạo, tiếp tục và xem lại các bài học riêng tư từ video YouTube.",
};

export const dynamic = "force-dynamic";

export default async function RealTalkLibraryPage() {
  const drafts = await listOwnerPrivateDrafts();

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <LockKeyhole className="size-4" /> Thư viện riêng tư
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Bài học từ video của bạn
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Mỗi bài là AI draft chỉ tài khoản của bạn đọc được. Bài không tự động
              xuất hiện trong catalog công khai.
            </p>
          </div>
          <Link
            href="/real-talk/create"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 font-bold text-white hover:bg-emerald-500"
          >
            <Plus className="size-5" /> Tạo bài mới
          </Link>
        </header>

        {drafts.length === 0 ? (
          <section className="mt-10 rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900 sm:p-12">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
              <Sparkles className="size-7" />
            </div>
            <h2 className="mt-5 text-xl font-black text-zinc-950 dark:text-white">
              Chưa có bài học riêng
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Chọn một video YouTube có caption tiếng Anh. AtoEnglish sẽ tạo bài
              nghe–nói từ chính nội dung đó.
            </p>
            <Link
              href="/real-talk/create"
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-emerald-600 px-5 font-bold text-white hover:bg-emerald-500"
            >
              Dán video đầu tiên <ArrowRight className="size-4" />
            </Link>
          </section>
        ) : (
          <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {drafts.map((draft) => (
              <Link
                key={draft.id}
                href={`/real-talk/${encodeURIComponent(draft.slug)}`}
                className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="relative aspect-video overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={draft.thumbnailUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3 rounded-full bg-zinc-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {draft.level}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-black uppercase text-amber-950">
                    AI draft
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="line-clamp-2 font-black text-zinc-950 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-300">
                    {draft.titleVi}
                  </h2>
                  <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                    {draft.title}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs dark:border-zinc-800">
                    <span className="text-zinc-500">
                      {draft.reviewStatus === "human_verified"
                        ? "Transcript đã xác minh"
                        : "Transcript chưa xác minh"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-300">
                      Mở bài <ArrowRight className="size-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

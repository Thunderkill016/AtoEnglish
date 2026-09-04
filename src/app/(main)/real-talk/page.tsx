import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Radio, ShieldCheck } from "lucide-react";

import { REAL_TALK_LESSONS } from "@/features/real-talk/data/lessons";

export const metadata: Metadata = {
  title: "Real Talk pilot | AtoEnglish",
  description:
    "Học tiếng Anh từ nội dung giao tiếp thật có nguồn và giấy phép rõ ràng.",
};

export default function RealTalkPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Radio className="size-6" />
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-widest text-primary">
            Thử nghiệm có kiểm soát
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Học từ lời người thật đã nói
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Mỗi bài dùng video có nguồn rõ ràng, transcript gắn timestamp và bài
            tập truy xuất trực tiếp từ chính nội dung đó. AI không được tự bịa thêm
            hội thoại.
          </p>
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              Catalog công khai chỉ nhận nội dung AtoEnglish sở hữu, được creator
              cấp quyền, Creative Commons phù hợp hoặc public domain.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <p className="text-xs font-black uppercase tracking-wider text-primary">
              Bài pilot
            </p>
            <h2 className="mt-1 text-2xl font-black">
              Một vertical slice trước khi mở rộng
            </h2>
          </div>

          <div className="grid gap-4">
            {REAL_TALK_LESSONS.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/real-talk/${lesson.id}`}
                className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted-foreground">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                        {lesson.level}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" /> {lesson.estimatedMinutes} phút
                      </span>
                      <span>Public domain</span>
                    </div>
                    <h3 className="mt-3 text-xl font-black group-hover:text-primary">
                      {lesson.titleVi}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {lesson.canDoVi}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Nguồn: {lesson.source.title}
                    </p>
                  </div>
                  <span className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground">
                    Học bài này <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

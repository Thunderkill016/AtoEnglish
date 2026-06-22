import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  ShieldCheck,
  SlidersHorizontal,
  XCircle,
} from "lucide-react";

import {
  LESSON_QUALITY_CRITERIA,
  LESSON_QUALITY_PASS_SCORE,
} from "@/lib/learning/atoenglish-plan";
import { getQualitySummary } from "@/lib/learning/content-quality";

export const metadata: Metadata = {
  title: "Content Quality",
  description: "Kiểm định chất lượng bài học AtoEnglish theo rubric can-do, output, feedback và SRS.",
  robots: { index: false },
};

function scoreTone(score: number) {
  if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (score >= LESSON_QUALITY_PASS_SCORE) return "text-blue-600 dark:text-blue-400";
  if (score >= 65) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function QualityPage() {
  const summary = getQualitySummary();
  const failingReports = summary.reports.filter((report) => !report.passed);
  const strongestReports = [...summary.reports]
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 space-y-6">
      <section className="border-b border-foreground/[0.06] pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              <FileCheck2 className="size-3.5" />
              Lesson quality system
            </span>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Kiểm định chất lượng nội dung
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Trang này chấm toàn bộ unit bằng rubric 100 điểm: can-do outcome,
              input vừa sức, retrieval/output, feedback tiếng Việt, SRS, lỗi đặc
              thù người Việt, cognitive load, assessment và safety.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="rounded-2xl border border-zinc-200/70 bg-white/65 px-4 py-3 dark:border-zinc-800/70 dark:bg-zinc-900/30">
              <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                Trung bình
              </p>
              <p className={`mt-1 text-2xl font-black ${scoreTone(summary.averageScore)}`}>
                {summary.averageScore}
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Đạt
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {summary.passCount}
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Cần sửa
              </p>
              <p className="mt-1 text-2xl font-black text-amber-700 dark:text-amber-300">
                {summary.failCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/65 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Gate xuất bản
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Unit chỉ nên mở rộng nếu đạt ít nhất{" "}
            <strong className="text-foreground">{LESSON_QUALITY_PASS_SCORE}/100</strong>{" "}
            và không có criterion quan trọng dưới 55%.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white/65 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Tiêu chí yếu nhất
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            {summary.weakestCriteria.map((criterion) => (
              <div key={criterion.id}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">{criterion.label}</span>
                  <span className="text-foreground">{criterion.averagePercent}%</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${criterion.averagePercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/70 bg-white/65 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Rubric
            </h2>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {LESSON_QUALITY_CRITERIA.map((criterion) => (
              <span
                key={criterion.id}
                className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:text-blue-300"
              >
                {criterion.label} · {criterion.points}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-zinc-200/70 bg-white/65 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/30">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
                Ưu tiên sửa trước
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Sắp theo điểm thấp nhất để giảm bài học kém hiệu quả trước.
              </p>
            </div>
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 dark:text-amber-300">
              {failingReports.length} unit
            </span>
          </div>

          <div className="space-y-3">
            {failingReports.slice(0, 12).map((report) => (
              <article
                key={report.unitId}
                className="rounded-xl border border-zinc-200/60 bg-zinc-50/70 p-4 dark:border-zinc-800/60 dark:bg-zinc-950/25"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-zinc-200/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {report.level}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {report.unitId}
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-black text-foreground">
                      {report.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className={`text-2xl font-black ${scoreTone(report.score)}`}>
                      {report.score}
                    </span>
                    <Link
                      href={`/learn/${report.unitId}`}
                      className="inline-flex h-9 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 text-xs font-bold text-foreground transition-colors hover:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      Xem bài
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {report.criticalIssues.slice(0, 2).map((issue) => (
                    <p
                      key={issue}
                      className="flex items-start gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-800 dark:text-amber-200"
                    >
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                      {issue}
                    </p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-200/70 bg-white/65 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/30">
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Unit mạnh nhất
            </h2>
            <div className="mt-4 space-y-3">
              {strongestReports.map((report) => (
                <div
                  key={report.unitId}
                  className="flex items-center justify-between gap-3 rounded-xl bg-emerald-500/10 px-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">{report.title}</p>
                    <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {report.strengths.slice(0, 3).join(" · ") || "Balanced lesson"}
                    </p>
                  </div>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                    {report.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/70 bg-white/65 p-5 dark:border-zinc-800/70 dark:bg-zinc-900/30">
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Tất cả unit
            </h2>
            <div className="mt-4 max-h-[520px] space-y-2 overflow-y-auto pr-1">
              {summary.reports.map((report) => (
                <Link
                  key={report.unitId}
                  href={`/learn/${report.unitId}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200/60 px-3 py-2 text-sm transition-colors hover:border-emerald-500/40 dark:border-zinc-800/60"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    {report.passed ? (
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    ) : (
                      <XCircle className="size-4 shrink-0 text-amber-500" />
                    )}
                    <span className="truncate font-semibold text-foreground">
                      {report.title}
                    </span>
                  </span>
                  <span className={`font-black ${scoreTone(report.score)}`}>{report.score}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

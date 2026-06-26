import type { Metadata } from "next";
import Link from "next/link";
import { UNITS } from "@/lib/constants/units";
import { getAllUnitCompletionStatuses } from "@/app/actions/unit";

export const metadata: Metadata = {
  title: "Business English Track | AtoEnglish",
  description: "Lộ trình Tiếng Anh Công sở — 10 bài học thiết yếu cho nghề nghiệp: email, họp, thuyết trình, đàm phán. Dành cho người Việt muốn thăng tiến sự nghiệp.",
};

export const revalidate = 60;

// Business track: 10 units curated for career/workplace English
const BUSINESS_TRACK = [
  { id: "unit-17", icon: "🏆", skill: "Kinh nghiệm & CV",        why: "Present Perfect — nói về thành tích sự nghiệp, CV chuyên nghiệp" },
  { id: "unit-22", icon: "📋", skill: "Quy định & Công sở",       why: "Must/Have to — phân biệt quy định bắt buộc vs khuyến nghị nơi làm việc" },
  { id: "unit-24", icon: "⚙️",  skill: "Quy trình & Báo cáo",    why: "Passive Voice — mô tả quy trình, viết báo cáo không cần chủ ngữ" },
  { id: "unit-25", icon: "🤝", skill: "Mô tả & Networking",       why: "Relative Clauses — giới thiệu công ty, đồng nghiệp, đối tác tự nhiên" },
  { id: "unit-27", icon: "💬", skill: "Phrasal Verbs Công sở",    why: "20 phrasal verbs thiết yếu: carry out, deal with, look into, follow up" },
  { id: "unit-28", icon: "⏳", skill: "Kinh nghiệm Lâu dài",     why: "Pres. Perfect Continuous — 'I've been working here for 3 years'" },
  { id: "unit-29", icon: "🔧", skill: "Giải quyết Vấn đề",       why: "Thảo luận vấn đề, đề xuất giải pháp — TOEIC Part 3 & meetings" },
  { id: "unit-31", icon: "📧", skill: "Email & Văn bản Formal",   why: "Reporting verbs, formal tone, email structure — từ A đến Z" },
  { id: "unit-35", icon: "🤜", skill: "Đàm phán & Hợp đồng",     why: "Advanced Conditionals — unless/provided that trong đàm phán" },
  { id: "unit-40", icon: "🎤", skill: "Thuyết trình & Cohesion",  why: "30 discourse markers — nevertheless, furthermore, thereby — IELTS 6.5" },
];

export default async function BusinessPage() {
  const bulkRes = await getAllUnitCompletionStatuses();
  const completedMap = bulkRes.completedMap;

  const trackUnits = BUSINESS_TRACK.map((bt) => {
    const meta = UNITS.find((u) => u.id === bt.id);
    const done = completedMap.has(bt.id);
    return { ...bt, meta, done };
  });

  const doneCount = trackUnits.filter((u) => u.done).length;
  const progress = Math.round((doneCount / BUSINESS_TRACK.length) * 100);

  // First incomplete unit — CTA target
  const nextUnit = trackUnits.find((u) => !u.done);

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-3xl mx-auto">
      {/* ── Hero ── */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-emerald-600/8 border border-blue-500/15 p-6 sm:p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
            💼
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">
              Lộ trình chuyên biệt
            </p>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 leading-tight">
              Business English Track
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              10 bài học thiết yếu cho sự nghiệp — email, họp, thuyết trình, đàm phán.
              Dành cho người Việt muốn làm việc ở công ty quốc tế.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-zinc-500">Tiến độ</span>
            <span className="text-xs font-black text-blue-500">{doneCount}/{BUSINESS_TRACK.length} bài</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {nextUnit?.meta && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={nextUnit.meta.route}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-black transition-colors shadow-lg shadow-blue-900/20"
            >
              {doneCount === 0 ? "🚀 Bắt đầu track" : "▶ Tiếp tục"} — {nextUnit.icon} {nextUnit.skill}
            </Link>
            <Link
              href={`${nextUnit.meta.route}?mini=1`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm font-bold transition-colors"
            >
              ⚡ Ôn nhanh ~5 phút
            </Link>
          </div>
        )}
        {doneCount === BUSINESS_TRACK.length && (
          <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-black">
            🎉 Hoàn thành toàn bộ Business Track!
          </div>
        )}
      </div>

      {/* ── Track highlights ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { stat: "10", label: "bài công sở thiết yếu" },
          { stat: "B1+", label: "trình độ khuyến nghị" },
          { stat: "5 phút", label: "ôn nhanh mỗi bài" },
        ].map(({ stat, label }) => (
          <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 text-center">
            <span className="text-lg font-black text-blue-600 dark:text-blue-400">{stat}</span>
            <span className="text-[10px] text-zinc-500 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* ── Unit list ── */}
      <h2 className="text-sm font-black text-zinc-700 dark:text-zinc-300 uppercase tracking-widest mb-3">
        10 Bài Học Trong Track
      </h2>
      <div className="space-y-3">
        {trackUnits.map((unit, idx) => (
          <div key={unit.id} className="relative">
            {/* Connector line */}
            {idx < trackUnits.length - 1 && (
              <div className="absolute left-7 top-full h-3 w-px bg-zinc-300 dark:bg-zinc-700 z-10" />
            )}
            <div
              className={`flex flex-col gap-3 p-4 rounded-2xl border transition-all ${
                unit.done
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : "border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                  unit.done
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                }`}>
                  {unit.done ? "✓" : String(idx + 1)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                      {unit.icon} {unit.skill}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {unit.meta?.level}
                    </span>
                    {unit.meta?.xp && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                        +{unit.meta.xp} XP
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">{unit.why}</p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{unit.meta?.title}</p>
                </div>
              </div>

              {unit.meta?.route && (
                <div className="flex flex-wrap gap-2 pl-12">
                  <Link
                    href={unit.meta.route}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/15 border border-blue-500/20 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors"
                  >
                    {unit.done ? "Xem lại" : "Học đầy đủ"} →
                  </Link>
                  <Link
                    href={`${unit.meta.route}?mini=1`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors"
                  >
                    ⚡ Ôn nhanh
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-blue-600/8 to-indigo-600/8 border border-blue-500/15 text-center">
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
          🎓 Hoàn thành track để nhận chứng chỉ Business English
        </p>
        <p className="text-xs text-zinc-500 mb-3">Chia sẻ lên LinkedIn để tăng profile của bạn</p>
        <Link
          href="/progress"
          className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
        >
          Xem chứng chỉ của tôi →
        </Link>
      </div>
    </div>
  );
}

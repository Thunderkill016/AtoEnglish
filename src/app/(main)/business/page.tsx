import {Page, PageHeader, Section, ListRow, StatLine} from "@/components/ui/page";
import type { Metadata } from "next";
import Link from "next/link";
import { UNITS } from "@/lib/constants/units";
import { BUSINESS_TRACK } from "@/lib/constants/business-track";
import { getAllUnitCompletionStatuses } from "@/app/actions/unit";

export const metadata: Metadata = {
  title: "Business English Track | AtoEnglish",
  description: "Lộ trình Tiếng Anh Công sở — 10 bài học thiết yếu cho nghề nghiệp: email, họp, thuyết trình, đàm phán. Dành cho người Việt muốn thăng tiến sự nghiệp.",
};

export const revalidate = 60;

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
    <Page>
      <PageHeader description="10 bài học thiết yếu cho sự nghiệp — email, họp, thuyết trình, đàm phán. Dành cho người Việt muốn làm việc ở công ty quốc tế." />
      <div>
    <div className="space-y-6 pb-16">
      <StatLine value={progress}
        label={`Tiến độ · ${doneCount}/${BUSINESS_TRACK.length} bài`}
      />

      {nextUnit?.meta && (
        <div className="flex flex-wrap gap-2">
          <Link
            href={nextUnit.meta.route}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-colors"
          >
            {doneCount === 0 ? "🚀 Bắt đầu track" : "▶ Tiếp tục"} — {nextUnit.icon} {nextUnit.skill}
          </Link>
          <Link
            href={`${nextUnit.meta.route}?mini=1`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-card text-sm font-semibold transition-colors"
          >
            ⚡ Ôn nhanh ~5 phút
          </Link>
        </div>
      )}
      {doneCount === BUSINESS_TRACK.length && (
        <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
          🎉 Hoàn thành toàn bộ Business Track!
        </div>
      )}

      <div className="rounded-xl border border-border/60 bg-card px-4">
        <StatLine label="Bài công sở thiết yếu" value="10" />
        <StatLine label="Trình độ khuyến nghị" value="B1+" />
        <StatLine label="Ôn nhanh mỗi bài" value="5 phút" />
      </div>

      <Section>
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
      </Section>

      {/* ── Bottom CTA ── */}
      <div className="p-5 rounded-xl border border-border/60 bg-card text-center">
        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1">
          🎓 Hoàn thành track để nhận chứng chỉ Business English
        </p>
        <p className="text-xs text-zinc-500 mb-3">Chia sẻ lên LinkedIn để tăng profile của bạn</p>
        <Link
          href="/certificate/business"
          className="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline"
        >
          {doneCount === BUSINESS_TRACK.length ? "Nhận chứng chỉ Business →" : "Xem tiến độ chứng chỉ →"}
        </Link>
      </div>
    </div>
    </div>
    </Page>
  );
}

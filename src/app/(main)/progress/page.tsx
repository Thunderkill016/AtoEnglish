import type { Metadata } from "next";
import { Suspense } from "react";
import { Flame, Layers, BookOpen, TrendingUp, Trophy, Star, Mic } from "lucide-react";
import { getProgressStats, getWeeklyXpData, getPredictiveScore } from "@/app/actions/progress";
import ProgressClient from "./ProgressClient";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tiến độ học tập",
  description: "Theo dõi tiến độ tự học qua kỹ năng, SRS và speaking — từ A0 đến B1+ Tech English.",
  robots: { index: false },
};

export default async function ProgressPage() {
  const [statsRes, weeklyRes, scoreRes] = await Promise.all([
    getProgressStats(),
    getWeeklyXpData(),
    getPredictiveScore(),
  ]);

  const score = scoreRes.score ?? {
    ielts: 1.0,
    toeic: 10,
    rawIelts: 0.0,
    rawToeic: 10.0,
    skills: { listening: 1.0, reading: 1.0, speaking: 1.0, writing: 1.0 },
    avgSpeakingAccuracy: 0,
    srsRetention: 0,
    completedUnitsCount: 0,
    recommendations: ["Hãy học thêm bài học mới để củng cố kiến thức."]
  };

  const stats = statsRes.stats ?? {
    totalXp: 0,
    streak: 0,
    currentLevel: "A0",
    totalCards: 0,
    cardsByState: { new: 0, learning: 0, review: 0, relearning: 0 },
    completedUnits: 0,
    totalSpeakingSessions: 0,
  };

  const weeklyData = weeklyRes.data?.length
    ? weeklyRes.data
    : ["T2","T3","T4","T5","T6","T7","CN"].map(label => ({ label, xp: 0, pct: 0, day: "" }));

  const avgSkillScore =
    (score.skills.listening + score.skills.reading + score.skills.speaking + score.skills.writing) / 4;
  const b1ReadinessPercent = Math.round(Math.min((avgSkillScore / 6.5) * 100, 100));

  const statCards = [
    {
      label: "Tổng kinh nghiệm",
      value: `${stats.totalXp.toLocaleString()} XP`,
      sub: `Trình độ ${stats.currentLevel}`,
      icon: Trophy,
      color: "text-yellow-500 bg-yellow-500/10",
    },
    {
      label: "Streak hiện tại",
      value: `${stats.streak} ngày`,
      sub: "Chuỗi học liên tiếp",
      icon: Flame,
      color: "text-orange-500 bg-orange-500/10",
    },
    {
      label: "Từ vựng SRS",
      value: `${stats.totalCards} từ`,
      sub: `${stats.cardsByState.review} từ đang ôn`,
      icon: Layers,
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Units hoàn thành",
      value: `${stats.completedUnits} units`,
      sub: "Đã học xong",
      icon: BookOpen,
      color: "text-emerald-500 bg-emerald-500/10",
    },
    {
      label: "Buổi luyện nói",
      value: `${stats.totalSpeakingSessions ?? 0} buổi`,
      sub: "Shadowing, roleplay & nhật ký",
      icon: Mic,
      color: "text-violet-500 bg-violet-500/10",
    },
  ];

  const srsBoxes = [
    { name: "Hộp 1 — Mới nạp", count: stats.cardsByState.new, color: "bg-gradient-to-r from-red-500 to-orange-500" },
    { name: "Hộp 2 — Đang học", count: stats.cardsByState.learning, color: "bg-gradient-to-r from-orange-500 to-amber-500" },
    { name: "Hộp 3 — Ôn tập dài hạn", count: stats.cardsByState.review, color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
    { name: "Hộp 4 — Học lại", count: stats.cardsByState.relearning, color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
  ];
  const totalSrs = Math.max(srsBoxes.reduce((s, b) => s + b.count, 0), 1);

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-5 sm:py-8 sm:px-6 lg:px-8 space-y-5 sm:space-y-8 min-h-screen overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-80 w-[60vw] max-w-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-[60vw] max-w-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="pb-6 border-b border-foreground/[0.05]">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <TrendingUp className="size-3.5" />
          Báo cáo học tập cá nhân
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Tiến độ &amp; Thành tích
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Dữ liệu thực từ hành trình học tập của bạn.
        </p>
      </div>

      {/* B1+ Readiness */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-gradient-to-br from-white/70 via-white/40 to-white/70 dark:from-zinc-900/40 dark:via-zinc-900/20 dark:to-zinc-900/40 backdrop-blur-md p-6 sm:p-8 space-y-6 sm:space-y-8 shadow-xl">
        <div className="absolute -top-24 -right-24 -z-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 -z-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-wider">
              B1+ Readiness
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              Tổng hợp năng lực tự học
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tín hiệu từ {score.completedUnitsCount} bài học, luyện nói và SRS. Mục tiêu: dùng tiếng Anh cho dev work.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-3.5 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 px-5 py-3 rounded-2xl">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.currentLevel}
              </span>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Cấp độ hiện tại</p>
                <p className="text-xs font-semibold text-foreground">Mục tiêu B1+</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5 bg-zinc-50/80 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50 px-5 py-3 rounded-2xl">
              <span className="text-3xl font-black text-primary">
                {score.completedUnitsCount}
              </span>
              <div>
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Bài đã học</p>
                <p className="text-xs font-semibold text-foreground">Trong lộ trình</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 4 Skills */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">4 kỹ năng cần cân bằng</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Nghe (Listening)", score: score.skills.listening, max: 9.0, color: "bg-blue-500" },
                { name: "Đọc (Reading)", score: score.skills.reading, max: 9.0, color: "bg-teal-500" },
                { name: "Nói (Speaking)", score: score.skills.speaking, max: 9.0, color: "bg-emerald-500" },
                { name: "Viết (Writing)", score: score.skills.writing, max: 9.0, color: "bg-purple-500" },
              ].map((skill, idx) => {
                const pct = (skill.score / skill.max) * 100;
                return (
                  <div key={idx} className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 p-3.5 rounded-2xl space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-muted-foreground">{skill.name}</span>
                      <span className="text-foreground">{Math.round(pct)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${skill.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800/50 p-5 rounded-3xl flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Gợi ý tiếp theo</h3>
              <ul className="space-y-2.5">
                {score.recommendations.map((rec: string, idx: number) => (
                  <li key={idx} className="text-xs sm:text-sm text-foreground flex items-start gap-2.5 leading-relaxed">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                      ★
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-semibold">Tiến độ B1+ (ước tính)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{b1ReadinessPercent}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                  style={{ width: `${b1ReadinessPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">Lộ trình</p>
          <p className="mt-2 text-lg font-black text-foreground">12 tháng</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Tự học đều đặn từ A0 lên B1+ Tech English.</p>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">Mỗi ngày</p>
          <p className="mt-2 text-lg font-black text-foreground">45 phút</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Đều đặn &gt; học nhiều nhưng không đều.</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">4 Phases</p>
          <p className="mt-2 text-lg font-black text-foreground">A1 → B1+</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Nền Tảng · Sơ Cấp · Trung Cấp · Tech English.</p>
        </div>
        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4">
          <p className="text-[10px] font-black uppercase tracking-wider text-violet-700 dark:text-violet-300">Mục tiêu</p>
          <p className="mt-2 text-lg font-black text-foreground">B1+</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Đọc docs, viết commit, mock interview được.</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-3xl bg-white/60 dark:bg-zinc-900/30 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm p-4 sm:p-6 space-y-2 sm:space-y-3 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-extrabold text-muted-foreground uppercase tracking-widest truncate">{stat.label}</span>
                <span className={`flex size-8 sm:size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${stat.color}`}>
                  <Icon className="size-5" />
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">{stat.value}</span>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Chart + SRS State */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Weekly XP Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-8 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">XP hàng ngày</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Kinh nghiệm 7 ngày qua</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-xl border border-border/40">
              <Star className="size-3.5" />
              Tuần này
            </span>
          </div>
          <div className="relative h-52">
            <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
              {[0,1,2,3].map(i => (
                <div key={i} className="border-t border-dashed border-foreground/10 w-full" />
              ))}
            </div>
            <div className="absolute inset-0 flex items-end justify-between gap-2 px-1 border-b border-foreground/[0.05]">
              {weeklyData.map((d, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  {d.xp > 0 && (
                    <span className="opacity-0 group-hover:opacity-100 transition-all text-[10px] font-mono font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-lg absolute bottom-full mb-1 whitespace-nowrap">
                      {d.xp} XP
                    </span>
                  )}
                  <div
                    className="w-full max-w-[28px] rounded-t-lg transition-all duration-700 group-hover:opacity-90"
                    style={{
                      height: d.pct > 0 ? `${Math.max(d.pct, 8)}%` : "4px",
                      background: d.pct > 0
                        ? "linear-gradient(to top, #10b981, #34d399)"
                        : "rgb(var(--muted)/0.4)",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground font-bold py-1">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SRS State */}
        <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-8 space-y-4 sm:space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">Trạng thái SRS</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {stats.totalCards} từ vựng trong hộp nhớ
            </p>
          </div>
          <div className="space-y-4">
            {srsBoxes.map((box, idx) => {
              const pct = Math.round((box.count / totalSrs) * 100);
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground truncate max-w-[160px] sm:max-w-none">{box.name}</span>
                    <span className="text-muted-foreground font-mono">{box.count}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${box.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground text-center border-t border-foreground/[0.04] pt-4">
            Ôn flashcard mỗi ngày để đẩy từ lên Hộp 4.
          </p>
        </div>
      </div>

      {/* Achievements */}
      <Suspense fallback={
        <div className="space-y-3 animate-pulse">
          <div className="h-5 w-32 bg-muted rounded-lg" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted/50 rounded-2xl" />
            ))}
          </div>
        </div>
      }>
        <ProgressClient stats={{
          totalCards: stats.totalCards,
          streak: stats.streak,
          completedUnits: stats.completedUnits,
          totalXp: stats.totalXp,
          totalSpeakingSessions: stats.totalSpeakingSessions ?? 0,
        }} />
      </Suspense>
    </div>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Flame, Layers, BookOpen, TrendingUp, Trophy, Star, Mic } from "lucide-react";
import { getProgressStats, getWeeklyXpData } from "@/app/actions/stats";
import { getAchievements } from "@/app/actions/gamification";
import ProgressClient from "./ProgressClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tiến độ học tập",
  description: "Xem tổng quan tiến độ học tiếng Anh: XP, streak, thẻ ôn tập và thành tích của bạn.",
  robots: { index: false },
};

export default async function ProgressPage() {
  const [statsRes, weeklyRes, achievementsRes] = await Promise.all([
    getProgressStats(),
    getWeeklyXpData(),
    getAchievements().catch(() => ({ success: false, achievements: [], unlockedIds: [] as string[] })),
  ]);

  const stats = statsRes.stats ?? {
    totalXp: 0,
    streak: 0,
    currentLevel: "A1",
    totalCards: 0,
    cardsByState: { new: 0, learning: 0, review: 0, relearning: 0 },
    completedUnits: 0,
    totalSpeakingSessions: 0,
  };

  const weeklyData = weeklyRes.data?.length
    ? weeklyRes.data
    : ["T2","T3","T4","T5","T6","T7","CN"].map(label => ({ label, xp: 0, pct: 0, day: "" }));

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
    <div className="relative mx-auto max-w-7xl px-4 py-5 sm:py-8 sm:px-6 lg:px-8 space-y-5 sm:space-y-8 min-h-screen overflow-x-hidden pb-20 sm:pb-0">
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
      {/* Leaderboard CTA banner */}
      <a
        href="/leaderboard"
        className="flex items-center gap-4 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/8 hover:border-yellow-500/35 transition-all duration-200 group"
      >
        <span className="flex size-10 items-center justify-center rounded-xl bg-yellow-500/15 text-2xl shrink-0">🏆</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-0.5">Bảng xếp hạng</p>
          <p className="text-sm font-bold text-foreground">Xem vị trí của bạn trong tuần này</p>
          <p className="text-xs text-muted-foreground">Top học viên theo XP — reset mỗi thứ Hai</p>
        </div>
        <Trophy className="size-5 text-yellow-500/60 group-hover:text-yellow-500 group-hover:translate-x-0.5 transition-all shrink-0" />
      </a>

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

      {/* Achievements section */}
      <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">Thành tích</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {achievementsRes.success
                ? `${achievementsRes.unlockedIds.length} / ${achievementsRes.achievements.length} đã mở khóa`
                : 'Tính năng sắp ra mắt'}
            </p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
            <Trophy className="size-5" />
          </span>
        </div>

        {achievementsRes.success && achievementsRes.achievements.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {achievementsRes.achievements
              .filter(a => achievementsRes.unlockedIds.includes(a.id))
              .map(a => (
                <div
                  key={a.id}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-center"
                >
                  <span className="text-3xl" role="img" aria-label={a.title_en}>{a.emoji}</span>
                  <span className="text-xs font-semibold text-foreground leading-tight">{a.title_vn}</span>
                </div>
              ))}
          </div>
        ) : achievementsRes.success && achievementsRes.achievements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Chưa có thành tích nào. Hãy tiếp tục học! 💪</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {["🔥", "⭐", "📚", "🎯", "💬", "🏆", "🎤", "💡"].map((emoji, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-2xl border border-foreground/[0.06] bg-muted/30 p-3 text-center opacity-40"
              >
                <span className="text-3xl blur-sm">{emoji}</span>
                <span className="text-xs font-semibold text-muted-foreground">Sắp ra mắt</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
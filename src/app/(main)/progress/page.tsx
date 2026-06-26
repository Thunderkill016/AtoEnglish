import type { Metadata } from "next";
import { Suspense } from "react";
import { Flame, Layers, BookOpen, TrendingUp, Trophy, Star, Mic } from "lucide-react";
import { SecondaryPageShell, PrimaryRow, StatLine, ListSection } from "@/components/design-system";
import { getProgressStats, getWeeklyXpData, getDailyActivity } from "@/app/actions/stats";
import { getAchievements } from "@/app/actions/gamification";
import { AchievementsPanel } from "@/components/gamification/AchievementsPanel";
import { ActivityHeatmap } from "@/components/progress/ActivityHeatmap";
import ProgressClient from "./ProgressClient";
import StreakStats from "@/features/streak/components/StreakStats";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tiến Độ Học Tập | AtoEnglish",
  description: "Xem tổng quan tiến độ học tiếng Anh: XP, streak, thẻ ôn tập và thành tích của bạn.",
  robots: { index: false },
};

export default async function ProgressPage() {
  const [statsRes, weeklyRes, achievementsRes, activityRes] = await Promise.all([
    getProgressStats(),
    getWeeklyXpData(),
    getAchievements().catch(() => ({ success: false, achievements: [], unlockedIds: [] as string[] })),
    getDailyActivity(),
  ]);

  const activityDays = activityRes.days ?? [];
  const totalActiveDays = activityDays.filter(d => d.xp > 0).length;
  // Weekly active days: last 7 entries in activityDays
  const last7Days = activityDays.slice(-7);
  const weeklyActiveDays = last7Days.filter(d => d.xp > 0).length;
  // Compute longest streak from activity data
  let longestStreak = 0, curStreak = 0;
  for (const d of activityDays) {
    if (d.xp > 0) { curStreak++; longestStreak = Math.max(longestStreak, curStreak); }
    else curStreak = 0;
  }

  const stats = statsRes.stats ?? {
    totalXp: 0,
    streak: 0,
    bestStreak: 0,
    currentLevel: "A1",
    totalCards: 0,
    cardsByState: { new: 0, learning: 0, review: 0, relearning: 0 },
    completedUnits: 0,
    totalSpeakingSessions: 0,
    streakFreezeCount: 0,
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
      sub: stats.bestStreak > stats.streak
        ? `🏅 Kỷ lục: ${stats.bestStreak} ngày`
        : "🏅 Đang ở kỷ lục!",
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
    <SecondaryPageShell
      title="Tiến độ"
      subtitle={`${stats.totalXp.toLocaleString()} XP · ${stats.streak} ngày streak`}
    >
    <div className="space-y-5 sm:space-y-8 pb-16">

      <ListSection title="Tổng quan">
        <div className="rounded-xl border border-border/60 bg-card px-4">
          {statCards.map((stat) => (
            <StatLine
              key={stat.label}
              label={stat.label}
              value={stat.value}
              caption={stat.sub}
            />
          ))}
        </div>
      </ListSection>

      {/* Activity Heatmap */}
      <ActivityHeatmap
        days={activityDays}
        totalActiveDays={totalActiveDays}
        longestStreak={longestStreak}
      />

      {/* Streak Stats — milestone roadmap, freeze inventory, share card */}
      <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-6 space-y-1">
        <div className="flex items-center gap-2 mb-4">
          <Flame className="size-4 text-orange-500" />
          <h2 className="text-xs font-black text-foreground uppercase tracking-widest">Streak &amp; Milestones</h2>
        </div>
        <StreakStats
          currentStreak={stats.streak}
          bestStreak={stats.bestStreak}
          freezesAvailable={stats.streakFreezeCount ?? 0}
          totalStudyDays={totalActiveDays}
          milestonesAchieved={[3,7,14,30,66,100,365].filter(m => stats.streak >= m).length}
          userLevel={stats.currentLevel}
          completedLessons={stats.completedUnits}
          weeklyActiveDays={weeklyActiveDays}
        />
      </div>

      <div className="space-y-2">
        <PrimaryRow
          href="/leaderboard"
          label="Bảng xếp hạng"
          description="Top học viên theo XP tuần này"
          icon={Trophy}
        />
        <PrimaryRow
          href="/progress/weekly"
          label="Báo cáo tuần"
          description="Tổng kết 7 ngày học tập"
          icon={TrendingUp}
        />
      </div>

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

      {/* Achievements — always show catalog; unlocked states come from DB */}
      <AchievementsPanel
        achievements={achievementsRes.achievements.length > 0
          ? achievementsRes.achievements
          : STATIC_ACHIEVEMENTS}
        unlockedIds={new Set(achievementsRes.unlockedIds)}
      />
    </div>
    </SecondaryPageShell>
  );
}

// Static fallback catalog — mirrors the DB seed in 20260624020000_streak_shield_and_achievements.sql
// Shown when DB query fails or achievements table is empty (pre-migration).
const STATIC_ACHIEVEMENTS = [
  { id: "first_lesson",    title_vn: "Bước Đầu Tiên",      title_en: "First Step",         description_vn: "Hoàn thành bài học đầu tiên!",                 emoji: "🎯",  category: "lesson"    as const, xp_reward: 10,  threshold: 1 },
  { id: "lessons_5",       title_vn: "Học Viên Nhiệt Tình", title_en: "Eager Learner",      description_vn: "Hoàn thành 5 bài học.",                        emoji: "📚",  category: "lesson"    as const, xp_reward: 20,  threshold: 5 },
  { id: "lessons_10",      title_vn: "Học Viên Chăm Chỉ",  title_en: "Dedicated Student",  description_vn: "Hoàn thành 10 bài học.",                       emoji: "🎓",  category: "lesson"    as const, xp_reward: 30,  threshold: 10 },
  { id: "lessons_25",      title_vn: "Chuyên Gia Tiến Bộ", title_en: "Progress Expert",    description_vn: "Hoàn thành 25 bài học.",                       emoji: "⭐",  category: "lesson"    as const, xp_reward: 50,  threshold: 25 },
  { id: "lessons_50",      title_vn: "Học Giả",            title_en: "Scholar",            description_vn: "Hoàn thành 50 bài học!",                       emoji: "🏅",  category: "lesson"    as const, xp_reward: 100, threshold: 50 },
  { id: "streak_3",        title_vn: "Bắt Đầu Chuỗi",     title_en: "On a Roll",          description_vn: "Duy trì chuỗi học 3 ngày liên tiếp!",          emoji: "🔥",  category: "streak"    as const, xp_reward: 15,  threshold: 3 },
  { id: "streak_7",        title_vn: "Một Tuần Kiên Trì",  title_en: "Week Warrior",       description_vn: "Duy trì chuỗi học 7 ngày liên tiếp!",          emoji: "🔥🔥", category: "streak"   as const, xp_reward: 30,  threshold: 7 },
  { id: "streak_14",       title_vn: "Hai Tuần Bất Bại",   title_en: "Fortnight Fighter",  description_vn: "14 ngày học liên tiếp!",                       emoji: "💪",  category: "streak"    as const, xp_reward: 50,  threshold: 14 },
  { id: "streak_30",       title_vn: "Học Viên Tháng",     title_en: "Monthly Master",     description_vn: "30 ngày học liên tiếp — xuất sắc!",            emoji: "🏆",  category: "streak"    as const, xp_reward: 100, threshold: 30 },
  { id: "streak_100",      title_vn: "Huyền Thoại",        title_en: "Legend",             description_vn: "100 ngày học liên tiếp! Bạn là huyền thoại!",  emoji: "👑",  category: "streak"    as const, xp_reward: 300, threshold: 100 },
  { id: "xp_100",          title_vn: "Tích Lũy XP",        title_en: "XP Collector",       description_vn: "Kiếm được 100 XP.",                            emoji: "✨",  category: "xp"        as const, xp_reward: 0,   threshold: 100 },
  { id: "xp_500",          title_vn: "XP Hunter",          title_en: "XP Hunter",          description_vn: "Kiếm được 500 XP.",                            emoji: "💎",  category: "xp"        as const, xp_reward: 20,  threshold: 500 },
  { id: "xp_1000",         title_vn: "Nghìn Điểm",         title_en: "Thousand Points",    description_vn: "Kiếm được 1,000 XP!",                          emoji: "🌟",  category: "xp"        as const, xp_reward: 50,  threshold: 1000 },
  { id: "xp_5000",         title_vn: "Bậc Thầy XP",        title_en: "XP Master",          description_vn: "Kiếm được 5,000 XP!",                          emoji: "🎖️",  category: "xp"       as const, xp_reward: 150, threshold: 5000 },
  { id: "first_speak",     title_vn: "Cất Tiếng Nói",      title_en: "First Words",        description_vn: "Hoàn thành bài luyện nói đầu tiên!",           emoji: "🎤",  category: "speaking"  as const, xp_reward: 15,  threshold: 1 },
  { id: "speak_10",        title_vn: "Người Nói Chuyện",   title_en: "Conversationalist",  description_vn: "Hoàn thành 10 buổi luyện nói.",                emoji: "🗣️",  category: "speaking"  as const, xp_reward: 30,  threshold: 10 },
  { id: "speak_50",        title_vn: "Diễn Giả",           title_en: "Speaker",            description_vn: "Hoàn thành 50 buổi luyện nói!",               emoji: "🎙️",  category: "speaking"  as const, xp_reward: 100, threshold: 50 },
  { id: "first_flashcard", title_vn: "Thẻ Đầu Tiên",       title_en: "First Flashcard",    description_vn: "Ôn tập thẻ flashcard lần đầu!",                emoji: "🃏",  category: "flashcard" as const, xp_reward: 10,  threshold: 1 },
  { id: "flashcards_50",   title_vn: "Người Ôn Luyện",     title_en: "Review Champ",       description_vn: "Ôn tập 50 thẻ flashcard.",                     emoji: "📝",  category: "flashcard" as const, xp_reward: 25,  threshold: 50 },
  { id: "flashcards_200",  title_vn: "Thẻ Bài Cao Thủ",    title_en: "Card Master",        description_vn: "Ôn tập 200 thẻ flashcard!",                    emoji: "🏅",  category: "flashcard" as const, xp_reward: 75,  threshold: 200 },
];
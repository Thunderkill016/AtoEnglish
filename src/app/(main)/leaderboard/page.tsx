import { Suspense } from "react";
import { Trophy, Zap, Flame } from "lucide-react";
import { getLeaderboard } from "@/app/actions/leaderboard";

export const metadata = {
  title: "Bảng Xếp Hạng — AtoEnglish",
  description: "Top học viên theo tổng XP tích lũy. Cạnh tranh lành mạnh để duy trì động lực học tiếng Anh.",
};

// Revalidate every 5 minutes — fresh enough without hammering the DB
export const revalidate = 300;

// ─── Medal colours ────────────────────────────────────────────────────────────
const RANK_STYLES: Record<number, { bg: string; border: string; text: string; medal: string }> = {
  1: { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-400", medal: "🥇" },
  2: { bg: "bg-zinc-400/10", border: "border-zinc-400/40", text: "text-zinc-300", medal: "🥈" },
  3: { bg: "bg-amber-700/10", border: "border-amber-700/40", text: "text-amber-600", medal: "🥉" },
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  A2: "text-teal-400 bg-teal-500/10 border-teal-500/25",
  B1: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  B2: "text-violet-400 bg-violet-500/10 border-violet-500/25",
  C1: "text-rose-400 bg-rose-500/10 border-rose-500/25",
};

// ─── Leaderboard Server Component ─────────────────────────────────────────────
async function LeaderboardList() {
  const res = await getLeaderboard();

  if (!res.success || !res.entries) {
    return (
      <div className="text-center py-16 text-zinc-500 text-sm">
        {res.error ?? "Không thể tải bảng xếp hạng."}
      </div>
    );
  }

  if (res.entries.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500 text-sm">
        Chưa có dữ liệu. Hãy hoàn thành bài học đầu tiên! 🚀
      </div>
    );
  }

  const currentUserEntry = res.entries.find((e) => e.is_current_user);

  return (
    <div className="space-y-4">
      {/* Current user highlight — shown at top if not in top 20 */}
      {currentUserEntry && currentUserEntry.rank > 20 && (
        <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-4">
          <span className="text-zinc-400 font-mono text-sm w-6">#{currentUserEntry.rank}</span>
          <div className="flex-1">
            <p className="text-white font-bold text-sm">Bạn</p>
            <p className="text-zinc-500 text-xs">{currentUserEntry.total_xp.toLocaleString()} XP</p>
          </div>
          <span className="text-xs text-emerald-400">Của bạn</span>
        </div>
      )}

      {/* Top 20 */}
      <div className="space-y-2">
        {res.entries.map((entry) => {
          const rankStyle = RANK_STYLES[entry.rank];
          const levelColor = LEVEL_COLORS[entry.current_level] ?? LEVEL_COLORS.A1;
          const isMe = entry.is_current_user;

          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
                isMe
                  ? "bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/20"
                  : rankStyle
                  ? `${rankStyle.bg} ${rankStyle.border}`
                  : "bg-white/4 border-white/8"
              }`}
            >
              {/* Rank */}
              <div className="w-8 text-center shrink-0">
                {rankStyle ? (
                  <span className="text-xl">{rankStyle.medal}</span>
                ) : (
                  <span className="text-zinc-500 font-mono text-sm font-bold">#{entry.rank}</span>
                )}
              </div>

              {/* Avatar placeholder */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                isMe ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400"
              }`}>
                {entry.display_name.slice(0, 1).toUpperCase()}
              </div>

              {/* Name + level */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className={`font-bold text-sm truncate ${isMe ? "text-emerald-300" : "text-white"}`}>
                    {isMe ? "Bạn" : entry.display_name}
                  </p>
                  {isMe && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      bạn
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${levelColor}`}>
                    {entry.current_level}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <Flame className="w-3 h-3 text-orange-400" />
                    {entry.streak} ngày
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right shrink-0">
                <div className="flex items-center gap-1 justify-end">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className={`font-black text-sm ${rankStyle ? rankStyle.text : "text-zinc-300"}`}>
                    {entry.total_xp.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600">XP</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  return (
    <div className="relative mx-auto max-w-2xl px-4 py-6 sm:py-8 sm:px-6 space-y-6 min-h-screen pb-24">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Trophy className="w-3.5 h-3.5" />
          Bảng xếp hạng
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Top Học Viên
        </h1>
        <p className="text-zinc-400 text-sm">
          Xếp hạng theo tổng XP tích lũy. Cập nhật mỗi 5 phút.
        </p>
      </div>

      {/* Leaderboard */}
      <Suspense
        fallback={
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-white/4 border border-white/8 animate-pulse" />
            ))}
          </div>
        }
      >
        <LeaderboardList />
      </Suspense>

      {/* Footer note */}
      <p className="text-center text-xs text-zinc-600">
        Hoàn thành bài học mỗi ngày để leo hạng 🚀
      </p>
    </div>
  );
}

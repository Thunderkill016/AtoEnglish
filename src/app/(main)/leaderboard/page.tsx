"use client";

import { Page, PageHeader, Section, ListRow } from "@/components/ui/page";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Flame, Calendar, Star, Shield } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getLeaderboard, getWeeklyLeaderboard, type LeaderboardEntry } from "@/app/actions/leaderboard";
import { getMyLeague } from "@/app/actions/leagues";
import { TIER_CONFIG } from "@/lib/leagues";
import type { LeagueData, LeagueTier } from "@/lib/leagues";


export const dynamic = "force-dynamic";

// ─── Medal / level styles ─────────────────────────────────────────────────────
const RANK_STYLES: Record<number, { bg: string; border: string; text: string; medal: string }> = {
  1: { bg: "bg-yellow-500/10", border: "border-yellow-500/40", text: "text-yellow-400", medal: "🥇" },
  2: { bg: "bg-zinc-400/10",   border: "border-zinc-400/40",   text: "text-zinc-300",   medal: "🥈" },
  3: { bg: "bg-amber-700/10",  border: "border-amber-700/40",  text: "text-amber-600",  medal: "🥉" },
};

const LEVEL_COLORS: Record<string, string> = {
  A1: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  A2: "text-teal-400 bg-teal-500/10 border-teal-500/25",
  B1: "text-blue-400 bg-blue-500/10 border-blue-500/25",
  B2: "text-violet-400 bg-violet-500/10 border-violet-500/25",
  C1: "text-rose-400 bg-rose-500/10 border-rose-500/25",
};

// ─── Global leaderboard row ───────────────────────────────────────────────────
function EntryRow({ entry, xpLabel }: { entry: LeaderboardEntry; xpLabel: string }) {
  const rankStyle = RANK_STYLES[entry.rank];
  const levelColor = LEVEL_COLORS[entry.current_level] ?? LEVEL_COLORS.A1;
  const isMe = entry.is_current_user;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
        isMe
          ? "bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/20"
          : rankStyle
          ? `${rankStyle.bg} ${rankStyle.border}`
          : "bg-white/60 dark:bg-white/4 border-zinc-200/60 dark:border-white/8"
      }`}
    >
      <div className="w-8 text-center shrink-0">
        {rankStyle ? (
          <span className="text-xl">{rankStyle.medal}</span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500 font-mono text-sm font-bold">#{entry.rank}</span>
        )}
      </div>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
        isMe ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
      }`}>
        {entry.display_name.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`font-bold text-sm truncate ${isMe ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-900 dark:text-white"}`}>
            {isMe ? "Bạn" : entry.display_name}
          </p>
          {isMe && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">bạn</span>
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
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className={`font-black text-sm ${rankStyle ? rankStyle.text : "text-zinc-700 dark:text-zinc-300"}`}>
            {entry.total_xp.toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">{xpLabel}</p>
      </div>
    </motion.div>
  );
}

// ─── League row ───────────────────────────────────────────────────────────────
function LeagueRow({ member, rank, isPromotionZone, isRelegationZone, totalMembers }: {
  member: LeagueData["members"][0];
  rank: number;
  isPromotionZone: boolean;
  isRelegationZone: boolean;
  totalMembers: number;
}) {
  const rankStyle = RANK_STYLES[rank];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all ${
        member.isMe
          ? "bg-emerald-950/40 border-emerald-500/40 ring-1 ring-emerald-500/20"
          : rankStyle
          ? `${rankStyle.bg} ${rankStyle.border}`
          : isPromotionZone
          ? "bg-emerald-900/10 border-emerald-800/30"
          : isRelegationZone && totalMembers >= 10
          ? "bg-red-900/10 border-red-800/30"
          : "bg-white/60 dark:bg-white/4 border-zinc-200/60 dark:border-white/8"
      }`}
    >
      <div className="w-8 text-center shrink-0">
        {rankStyle ? (
          <span className="text-xl">{rankStyle.medal}</span>
        ) : (
          <span className="text-zinc-400 dark:text-zinc-500 font-mono text-sm font-bold">#{rank}</span>
        )}
      </div>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
        member.isMe ? "bg-emerald-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
      }`}>
        {(member.display_name ?? "?").slice(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm truncate ${member.isMe ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-900 dark:text-white"}`}>
          {member.isMe ? "Bạn" : member.display_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          {isPromotionZone && (
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
              ↑ Thăng hạng
            </span>
          )}
          {isRelegationZone && totalMembers >= 10 && (
            <span className="text-[10px] font-bold text-red-400 flex items-center gap-0.5">
              ↓ Xuống hạng
            </span>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="flex items-center gap-1 justify-end">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className={`font-black text-sm ${rankStyle ? rankStyle.text : member.isMe ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-300"}`}>
            {member.xp_this_week.toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600">XP tuần</p>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-zinc-100 dark:bg-white/4 border border-zinc-200/60 dark:border-white/8 animate-pulse" />
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
type TabId = "alltime" | "weekly" | "league";

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabId) ?? "weekly";

  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [weekStart, setWeekStart] = useState<string | null>(null);
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loading = activeTab !== "league"
    ? entries === null && error === null
    : leagueData === null && error === null;

  const handleTab = (tab: TabId) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setEntries(null);
    setLeagueData(null);
    setError(null);
  };

  useEffect(() => {
    let active = true;

    if (activeTab === "weekly") {
      getWeeklyLeaderboard().then((res) => {
        if (!active) return;
        if (res.success) { setEntries(res.entries ?? []); setWeekStart(res.weekStart ?? null); }
        else { setEntries([]); setError(res.error ?? "Lỗi tải dữ liệu"); }
      });
    } else if (activeTab === "alltime") {
      getLeaderboard().then((res) => {
        if (!active) return;
        if (res.success) setEntries(res.entries ?? []);
        else { setEntries([]); setError(res.error ?? "Lỗi tải dữ liệu"); }
      });
    } else {
      // league tab
      getMyLeague().then((res) => {
        if (!active) return;
        if (res.success) setLeagueData(res.data);
        else setError(res.error ?? "Lỗi tải giải đấu");
      });
    }

    return () => { active = false; };
  }, [activeTab]);

  const weekLabel = weekStart
    ? `Tuần từ ${new Date(weekStart).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}`
    : "Tuần này";

  const tierCfg = leagueData ? TIER_CONFIG[leagueData.tier as LeagueTier] : null;

  return (
    <Page>
      <PageHeader description="Cạnh tranh lành mạnh để duy trì động lực học tiếng Anh mỗi ngày." />
      <div>
    <div className="space-y-6 pb-16">

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleTab("weekly")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            activeTab === "weekly"
              ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-600 dark:text-emerald-300"
              : "bg-white/60 dark:bg-white/5 border-zinc-200/60 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/25"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          {activeTab === "weekly" && weekStart ? weekLabel : "Tuần này"}
        </button>
        <button
          onClick={() => handleTab("alltime")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            activeTab === "alltime"
              ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-600 dark:text-yellow-300"
              : "bg-white/60 dark:bg-white/5 border-zinc-200/60 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/25"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Tất cả thời gian
        </button>
        {/* S2-1: My League tab */}
        <button
          onClick={() => handleTab("league")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            activeTab === "league"
              ? "bg-violet-500/15 border-violet-500/50 text-violet-600 dark:text-violet-300"
              : "bg-white/60 dark:bg-white/5 border-zinc-200/60 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-white/25"
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          {tierCfg ? `${tierCfg.emoji} ${tierCfg.label}` : "Giải đấu của tôi"}
        </button>
      </div>

      {/* League tier header (shown when league tab active and data loaded) */}
      {activeTab === "league" && leagueData && tierCfg && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl bg-gradient-to-r ${tierCfg.gradient} bg-opacity-10`}
          style={{ background: "none" }}
        >
          <div className={`bg-gradient-to-r ${tierCfg.gradient} p-[1px] rounded-2xl`}>
            <div className="bg-zinc-950/90 rounded-[15px] p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tierCfg.gradient} flex items-center justify-center text-2xl shadow-lg shrink-0`}>
                {tierCfg.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-lg font-black bg-gradient-to-r ${tierCfg.gradient} bg-clip-text text-transparent`}>
                  {tierCfg.label} League
                </p>
                <p className="text-zinc-400 text-xs">{leagueData.members.length} học viên · {leagueData.daysLeft} ngày còn lại</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-zinc-500">Hạng của bạn</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">#{leagueData.myRank}</p>
                <p className="text-xs text-emerald-400 font-bold">{leagueData.myXp} XP</p>
              </div>
            </div>
          </div>

          {/* Promotion/relegation notice */}
          {leagueData.isPromotionZone && (
            <p className="text-center text-xs font-bold text-emerald-400 mt-3">
              🎉 Bạn đang trong vùng thăng hạng! Duy trì vị trí top 5.
            </p>
          )}
          {leagueData.isRelegationZone && leagueData.members.length >= 10 && (
            <p className="text-center text-xs font-bold text-red-400 mt-3">
              ⚠️ Bạn đang trong vùng xuống hạng! Hãy học thêm để leo hạng.
            </p>
          )}
        </motion.div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonList />
          </motion.div>
        ) : error ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-red-400 text-sm">
            {error}
          </motion.div>
        ) : activeTab === "league" && leagueData ? (
          <motion.div
            key="league"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {leagueData.members.map((member, i) => {
              const rank = i + 1;
              const isPromotion = rank <= 5;
              const isRelegate = leagueData.members.length >= 10 && rank > leagueData.members.length - 5;
              return (
                <LeagueRow
                  key={member.user_id}
                  member={member}
                  rank={rank}
                  isPromotionZone={isPromotion}
                  isRelegationZone={isRelegate}
                  totalMembers={leagueData.members.length}
                />
              );
            })}
          </motion.div>
        ) : entries && entries.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 text-zinc-500 text-sm">
            {activeTab === "weekly"
              ? "Chưa ai hoàn thành bài học tuần này — hãy là người đầu tiên! 🚀"
              : "Chưa có dữ liệu. Hãy hoàn thành bài học đầu tiên!"}
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {(entries ?? []).map((entry) => (
              <EntryRow
                key={entry.user_id}
                entry={entry}
                xpLabel={activeTab === "weekly" ? "XP tuần" : "XP"}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <p className="text-center text-xs text-zinc-600">
        {activeTab === "weekly"
          ? "Reset vào thứ Hai mỗi tuần 🔄"
          : activeTab === "league"
          ? `Top 5 thăng hạng · Bottom 5 xuống hạng · Reset thứ Hai 🏆`
          : "Top 20 theo tổng XP tích lũy 🏆"}
      </p>
    </div>
    </div>
    </Page>
  );
}

// Wrap in Suspense — required by Next.js 16 for useSearchParams() during build
export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <Page>
      <PageHeader description="Đang tải bảng xếp hạng..." />
      <div>
        <div className="space-y-2 pb-16">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-muted border border-border/60 animate-pulse" />
          ))}
        </div>
      </div>
    </Page>
    }>
      <LeaderboardContent />
    </Suspense>
  );
}

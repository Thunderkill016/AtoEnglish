"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Zap, Flame, Calendar, Star } from "lucide-react";
import { getLeaderboard, getWeeklyLeaderboard, type LeaderboardEntry } from "@/app/actions/leaderboard";

export const dynamic = "force-dynamic";

// ─── Medal / level styles ─────────────────────────────────────────────────────
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

// ─── Entry row component ──────────────────────────────────────────────────────
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

      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
        isMe ? "bg-emerald-500 text-white" : "bg-zinc-800 text-zinc-400"
      }`}>
        {entry.display_name.slice(0, 1).toUpperCase()}
      </div>

      {/* Name + badges */}
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
        <p className="text-[10px] text-zinc-600">{xpLabel}</p>
      </div>
    </motion.div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonList() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-16 rounded-2xl bg-white/4 border border-white/8 animate-pulse" />
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
type TabId = "alltime" | "weekly";

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("weekly");
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [weekStart, setWeekStart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived: loading when entries haven't arrived and no error yet
  const loading = entries === null && error === null;

  // Tab click — resets data state synchronously in event handler (not in effect)
  const handleTab = (tab: TabId) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setEntries(null);
    setError(null);
  };

  // Effect only does async fetch + sets state in async callbacks — never sync setState
  useEffect(() => {
    let active = true;

    if (activeTab === "weekly") {
      getWeeklyLeaderboard().then((res) => {
        if (!active) return;
        if (res.success) {
          setEntries(res.entries ?? []);
          setWeekStart(res.weekStart ?? null);
        } else {
          setEntries([]);
          setError(res.error ?? "Lỗi tải dữ liệu");
        }
      });
    } else {
      getLeaderboard().then((res) => {
        if (!active) return;
        if (res.success) {
          setEntries(res.entries ?? []);
        } else {
          setEntries([]);
          setError(res.error ?? "Lỗi tải dữ liệu");
        }
      });
    }

    return () => { active = false; };
  }, [activeTab]);

  // Format Monday date for display
  const weekLabel = weekStart
    ? `Tuần từ ${new Date(weekStart).toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" })}`
    : "Tuần này";

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-6 sm:py-8 sm:px-6 space-y-6 min-h-screen pb-24">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-yellow-400 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Trophy className="w-3.5 h-3.5" />
          Bảng xếp hạng
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Top Học Viên
        </h1>
        <p className="text-zinc-400 text-sm">
          Cạnh tranh lành mạnh để duy trì động lực học tiếng Anh mỗi ngày.
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTab("weekly")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            activeTab === "weekly"
              ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
              : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/25"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          {activeTab === "weekly" && weekStart ? weekLabel : "Tuần này"}
        </button>
        <button
          onClick={() => handleTab("alltime")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
            activeTab === "alltime"
              ? "bg-yellow-500/15 border-yellow-500/50 text-yellow-300"
              : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/25"
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          Tất cả thời gian
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SkeletonList />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-red-400 text-sm"
          >
            {error}
          </motion.div>
        ) : entries && entries.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-zinc-500 text-sm"
          >
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
          : "Top 20 theo tổng XP tích lũy 🏆"}
      </p>
    </div>
  );
}

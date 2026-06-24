"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { memo } from "react";
import { getMyLeague } from "@/app/actions/leagues";
import { TIER_CONFIG } from "@/lib/leagues";
import type { LeagueData, LeagueTier } from "@/lib/leagues";

function LeagueCard() {
  const [data, setData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLeague()
      .then((res) => { if (res.success) setData(res.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LeagueCardSkeleton />;
  if (!data) return null;

  const tier = TIER_CONFIG[data.tier as LeagueTier];
  const topMembers = data.members.slice(0, 5);
  const myEntry = data.members.find((m) => m.isMe);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl overflow-hidden backdrop-blur-sm"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${tier.gradient} p-[1px]`}>
        <div className="bg-white/95 dark:bg-zinc-900 rounded-t-[15px]">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center text-xl shadow-lg`}>
                {tier.emoji}
              </div>
              <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Giải đấu tuần này</p>
                <p className={`text-base font-black bg-gradient-to-r ${tier.gradient} bg-clip-text text-transparent`}>
                  {tier.label} League
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-zinc-500">Còn lại</p>
              <p className="text-sm font-black text-zinc-900 dark:text-white">{data.daysLeft} ngày</p>
            </div>
          </div>

          {/* My status */}
          <div className="px-4 pb-3 flex items-center gap-3">
            {data.isPromotionZone ? (
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-700/40 px-2.5 py-1 rounded-full">
                <TrendingUp size={11} /> Vùng thăng hạng
              </div>
            ) : data.isRelegationZone ? (
              <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-700/40 px-2.5 py-1 rounded-full">
                <TrendingDown size={11} /> Vùng xuống hạng
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/40 px-2.5 py-1 rounded-full">
                <Minus size={11} /> An toàn
              </div>
            )}
            <span className="text-[11px] text-zinc-500">
              Hạng #{data.myRank} · {data.myXp} XP tuần này
            </span>
          </div>
        </div>
      </div>

      {/* Mini leaderboard — top 5 */}
      <div className="px-4 py-2 space-y-1">
        <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Top 5</p>
        <AnimatePresence>
          {topMembers.map((m, i) => {
            const isMe = m.isMe;
            const rankEmoji = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : null;
            return (
              <motion.div
                key={m.user_id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors border ${
                  isMe
                    ? "bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-700/40"
                    : "bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700/20"
                }`}
              >
                <span className="text-sm w-5 text-center shrink-0">
                  {rankEmoji ?? <span className="text-[11px] font-bold text-zinc-500">#{m.rank}</span>}
                </span>
                <p className={`flex-1 text-sm font-semibold truncate ${isMe ? "text-emerald-600 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-300"}`}>
                  {isMe ? "Bạn" : m.display_name}
                </p>
                <p className={`text-xs font-black tabular-nums ${isMe ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"}`}>
                  {m.xp_this_week} XP
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Show user's own position if not in top 5 */}
        {myEntry && data.myRank > 5 && (
          <>
            <div className="flex items-center gap-2 py-0.5">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-850" />
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">···</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-850" />
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl border bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-700/40">
              <span className="text-[11px] font-bold text-zinc-500 w-5 text-center shrink-0">#{data.myRank}</span>
              <p className="flex-1 text-sm font-semibold text-emerald-600 dark:text-emerald-300 truncate">Bạn</p>
              <p className="text-xs font-black tabular-nums text-emerald-600 dark:text-emerald-400">{data.myXp} XP</p>
            </div>
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4 pt-2">
        <Link
          href="/leaderboard?tab=league"
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-zinc-50 dark:bg-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 text-xs font-bold transition-colors border border-zinc-200 dark:border-zinc-700/50"
        >
          <Trophy size={12} />
          Xem bảng xếp hạng đầy đủ
          <ChevronRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}

function LeagueCardSkeleton() {
  return (
    <div className="bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-700/50 rounded-2xl p-4 space-y-3 animate-pulse backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800" />
        <div className="space-y-1.5 flex-1">
          <div className="h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
          <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-1/2" />
        </div>
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-9 bg-zinc-50/60 dark:bg-zinc-800/60 rounded-xl" />
      ))}
    </div>
  );
}

export default memo(LeagueCard);

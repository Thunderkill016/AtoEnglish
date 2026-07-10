"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, ChevronRight } from "lucide-react";
import WeeklyActivityChart from "@/features/streak/components/WeeklyActivityChart";

interface WeeklyRecapCardProps {
  currentStreak: number;
  totalXp: number;
  completedUnits: number;
  userLevel: string;
  dueCardsCount: number;
  weeklyData: Array<{ day: string; label: string; xp: number; pct: number }>;
}

export default function WeeklyRecapCard({
  currentStreak,
  totalXp,
  completedUnits,
  userLevel,
  dueCardsCount,
  weeklyData,
}: WeeklyRecapCardProps) {
  const [collapsed, setCollapsed] = useState(true);

  const getMotivation = () => {
    if (currentStreak >= 30) return { msg: "Bạn đang ở đẳng cấp huyền thoại! 30+ ngày kiên trì 🏆", color: "text-amber-500" };
    if (currentStreak >= 14) return { msg: "2 tuần không bỏ cuộc — bạn đang tạo thói quen thật sự! 💪", color: "text-purple-500" };
    if (currentStreak >= 7)  return { msg: "1 tuần liên tiếp! Não bạn đang hình thành kết nối mới 🧠", color: "text-blue-500" };
    if (currentStreak >= 3)  return { msg: "3 ngày liên tiếp — tiếp tục giữ đà nhé! 🔥", color: "text-orange-500" };
    if (currentStreak >= 1)  return { msg: "Hôm nay bạn đã học — mỗi ngày 1 bước nhỏ! ✨", color: "text-emerald-500" };
    return { msg: "Hôm nay chưa học? Chỉ cần 10 phút là đủ để giữ streak! ⚡", color: "text-zinc-400" };
  };

  const { msg, color } = getMotivation();

  const stats = [
    { icon: "🔥", label: "Streak hiện tại", value: `${currentStreak} ngày`, sub: currentStreak >= 7 ? "Top học viên!" : "Mỗi ngày 1 bài" },
    { icon: "⚡", label: "Tổng XP", value: totalXp.toLocaleString("vi-VN"), sub: "XP tích lũy" },
    { icon: "📚", label: "Bài đã học", value: `${completedUnits}/50`, sub: `Trình độ ${userLevel}` },
    { icon: "🃏", label: "Thẻ ôn tập", value: dueCardsCount > 0 ? `${dueCardsCount} thẻ` : "✓ Xong", sub: dueCardsCount > 0 ? "Cần ôn hôm nay" : "SRS hoàn thành" },
  ];

  return (
    <div className="rounded-2xl border border-blue-500/15 bg-blue-500/3 dark:bg-blue-500/5 overflow-hidden">
      <button
        onClick={() => setCollapsed(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
          <TrendingUp className="size-5 text-blue-500" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-blue-500 uppercase tracking-widest">Tổng kết của bạn</p>
          <p className={`text-xs font-semibold truncate mt-0.5 ${color}`}>{msg}</p>
        </div>
        <ChevronRight className={`size-4 text-blue-400/60 shrink-0 transition-transform duration-200 ${collapsed ? "" : "rotate-90"}`} />
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 border-t border-blue-500/10 pt-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {stats.map(({ icon, label, value, sub }) => (
                <div key={label} className="flex flex-col gap-1 p-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                  <span className="text-xl">{icon}</span>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider leading-tight">{label}</p>
                  <p className="text-base font-black text-zinc-50 leading-tight">{value}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">{sub}</p>
                </div>
              ))}
            </div>

            {/* Right: Recharts Weekly XP */}
            {weeklyData && weeklyData.length > 0 && (
              <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">XP 7 ngày qua</p>
                  <span className="text-[10px] text-zinc-500 font-bold">Biểu đồ tuần</span>
                </div>
                <WeeklyActivityChart data={weeklyData} />
              </div>
            )}
          </div>

          {/* Share nudge */}
          <div className="mt-3 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <span className="text-base shrink-0">🎓</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-zinc-300">
                Đạt CEFR? Chia sẻ chứng chỉ lên LinkedIn!
              </p>
            </div>
            <Link href="/progress" className="shrink-0 text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline whitespace-nowrap">
              Xem chứng chỉ →
            </Link>
          </div>

          {/* Invite nudge */}
          <div className="mt-2 flex items-center gap-2 p-3 rounded-xl bg-purple-500/5 border border-purple-500/15">
            <span className="text-base shrink-0">👥</span>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-zinc-300">Học cùng bạn bè hiệu quả hơn 40%!</p>
            </div>
            <Link href="/invite" className="shrink-0 text-[10px] font-black text-purple-600 dark:text-purple-400 hover:underline whitespace-nowrap">Mời bạn →</Link>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Layers,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function ProgressPage() {
  const stats = [
    { label: "Tổng kinh nghiệm", value: "1,250 XP", sub: "+120 XP tuần này", icon: Trophy, color: "text-primary bg-primary/10" },
    { label: "Streak hiện tại", value: "5 ngày", sub: "Kỷ lục: 12 ngày", icon: Flame, color: "text-orange-500 bg-orange-500/10" },
    { label: "Từ vựng SRS", value: "120 từ", sub: "92% thẻ thuộc loại tốt", icon: Layers, color: "text-blue-500 bg-blue-500/10" },
    { label: "Bài học hoàn thành", value: "15 bài", sub: "Đạt 40% chặng B1", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  // Weekly study data for the SVG-based chart
  const weeklyData = [
    { day: "T2", xp: 30, pct: 60 },
    { day: "T3", xp: 45, pct: 90 },
    { day: "T4", xp: 15, pct: 30 },
    { day: "T5", xp: 50, pct: 100 },
    { day: "T6", xp: 20, pct: 40 },
    { day: "T7", xp: 0, pct: 0 },
    { day: "CN", xp: 35, pct: 70 },
  ];

  const achievements = [
    {
      title: "Kẻ dậy sớm",
      desc: "Hoàn thành bài học trước 7 giờ sáng",
      unlocked: true,
      reward: "Nhận Huy chương Vàng",
      icon: Sparkles,
      tier: "gold",
    },
    {
      title: "Chiến thần từ vựng",
      desc: "Ghi nhớ thành công 100 từ vựng qua SRS",
      unlocked: true,
      reward: "Nhận Huy chương Vàng",
      icon: Award,
      tier: "gold",
    },
    {
      title: "Không thể cản phá",
      desc: "Đạt chuỗi học tập liên tiếp 7 ngày",
      unlocked: false,
      progress: "5 / 7 ngày",
      reward: "Huy chương Bạc",
      icon: Flame,
      tier: "silver",
    },
    {
      title: "Bậc thầy Output",
      desc: "Đặt 50 câu tiếng Anh thực tế trong các bài học",
      unlocked: false,
      progress: "15 / 50 câu",
      reward: "Huy chương Đồng",
      icon: BookOpen,
      tier: "bronze",
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
      {/* Soft background ambient blurs */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-6 border-b border-foreground/[0.05]"
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <TrendingUp className="size-3.5 animate-pulse" />
          Báo cáo học tập cá nhân
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Tiến độ & Thành tích
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1 font-normal">
          Theo dõi sát sao tiến trình tích lũy ngôn ngữ để tối ưu hiệu quả học tập mỗi ngày.
        </p>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, type: "spring", stiffness: 120 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-3xl bg-glass border border-glass p-6 shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                <span className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${stat.color}`}>
                  <Icon className="size-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-black tracking-tight text-foreground">{stat.value}</span>
                <p className="text-xs text-muted-foreground mt-1 font-bold">{stat.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytics chart and summary */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Weekly Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 rounded-3xl border border-glass bg-glass p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] relative overflow-hidden"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">Lượng XP hàng ngày</h3>
              <p className="text-[11px] text-muted-foreground">Kinh nghiệm thu hoạch trong 7 ngày qua</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/80 px-3 py-1.5 rounded-xl border border-border/40">
              <Calendar className="size-4" />
              Tuần này
            </span>
          </div>

          {/* Chart Core (SVG/Framer Motion Layout) */}
          <div className="relative h-60 pt-6">
            {/* Background horizontal grid lines */}
            <div className="absolute inset-x-0 top-8 bottom-8 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-t border-dashed border-foreground/10 w-full" />
              <div className="border-t border-dashed border-foreground/10 w-full" />
              <div className="border-t border-dashed border-foreground/10 w-full" />
              <div className="border-t border-dashed border-foreground/10 w-full" />
            </div>

            {/* Bars container */}
            <div className="absolute inset-0 flex items-end justify-between gap-3 px-2 border-b border-foreground/[0.05]">
              {weeklyData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative z-10">
                  {/* Tooltip on hover */}
                  <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 text-xs font-mono font-bold bg-primary text-primary-foreground px-2 py-1 rounded-lg shadow-md -translate-y-1 absolute bottom-full mb-1">
                    {data.xp} XP
                  </span>
                  {/* Dynamic height bar with Framer Motion */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                    style={{ 
                      height: `${data.pct}%`, 
                      originY: 1, 
                      minHeight: data.xp > 0 ? "6px" : "0px" 
                    }}
                    className="w-full max-w-[32px] rounded-t-lg bg-gradient-to-t from-primary/80 to-primary group-hover:from-primary group-hover:to-emerald-400 transition-colors duration-300"
                  />
                  {/* Day label */}
                  <span className="text-xs text-muted-foreground font-bold py-2 mt-0.5">
                    {data.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed memory state summary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">Trạng thái hộp bộ nhớ SRS</h3>
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
              Phân phối 120 từ vựng đã học qua Spaced Repetition. Từ sẽ di chuyển sang hộp cao hơn khi bạn phản xạ nhanh.
            </p>
            
            {/* Box progress indicators */}
            <div className="space-y-4 pt-2">
              {[
                { name: "Hộp 1 (Mới nạp)", count: 18, pct: 15, color: "bg-red-500" },
                { name: "Hộp 2 (Bắt đầu nhớ)", count: 32, pct: 27, color: "bg-orange-500" },
                { name: "Hộp 3 (Nhớ tốt)", count: 50, pct: 41, color: "bg-blue-500" },
                { name: "Hộp 4 (Dài hạn)", count: 20, pct: 17, color: "bg-emerald-500" },
              ].map((box, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-foreground">{box.name}</span>
                    <span className="text-muted-foreground font-mono">{box.count} từ ({box.pct}%)</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden relative">
                    <motion.div 
                      className={`h-full rounded-full ${box.color}`} 
                      initial={{ width: 0 }}
                      animate={{ width: `${box.pct}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.08, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 border-t border-foreground/[0.04] text-center">
            <p className="text-[11px] text-muted-foreground font-normal">
              Thực hành ôn tập Flashcard hàng ngày để đẩy các từ sang Hộp 4.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Achievements Gallery */}
      <div className="space-y-5">
        <h3 className="font-bold text-lg sm:text-xl text-foreground">Huy chương đạt được</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            
            // Tier styling
            const tierBorder = 
              ach.unlocked
                ? ach.tier === "gold"
                  ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50"
                  : ach.tier === "silver"
                  ? "border-slate-400/30 bg-slate-400/5 hover:border-slate-400/50"
                  : "border-amber-700/30 bg-amber-700/5 hover:border-amber-700/50"
                : "border-glass bg-muted/10 opacity-70";

            const tierIconColor = 
              ach.unlocked
                ? ach.tier === "gold"
                  ? "text-yellow-500 bg-yellow-500/10"
                  : ach.tier === "silver"
                  ? "text-slate-400 bg-slate-400/10"
                  : "text-amber-700 bg-amber-700/10"
                : "text-muted-foreground bg-muted";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, type: "spring", stiffness: 100 }}
                whileHover={{ rotateY: 8, rotateX: -8, scale: 1.02, boxShadow: "0 25px 50px rgba(0,0,0,0.02)" }}
                className={`group rounded-3xl border p-6 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.005)] metal-reflect transition-all duration-300 ${tierBorder}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className={`flex size-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${tierIconColor}`}>
                      {ach.unlocked ? <Icon className="size-5" /> : <Lock className="size-4" />}
                    </span>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Đã mở khóa
                      </span>
                    ) : (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border/40">
                        Đang khóa
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base text-foreground">{ach.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug font-normal">
                      {ach.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-foreground/[0.05]">
                  {ach.unlocked ? (
                    <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-500 fill-emerald-500/10" />
                      {ach.reward}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>Tiến trình</span>
                        <span className="font-mono">{ach.progress}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden relative">
                        <motion.div 
                          className="h-full rounded-full bg-primary/75" 
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
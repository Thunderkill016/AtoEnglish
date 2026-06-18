"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Flame,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  GraduationCap,
  TrendingUp,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDueCards } from "@/app/actions/cards";
import { getUserProgress, getCompletedUnitsCount, getUnitCompletionStatus } from "@/app/actions/progress";

export default function DashboardPage() {
  const [xpCurrent, setXpCurrent] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [completedUnits, setCompletedUnits] = useState(0);
  const [isUnit4Completed, setIsUnit4Completed] = useState(false);
  const [userLevel, setUserLevel] = useState("B1 Intermediate");
  const [isLoading, setIsLoading] = useState(true);
  const xpTarget = 80;

  const [quests, setQuests] = useState([
    { id: 1, text: "Học 1 bài mới (Input & Processing)", xp: 20, completed: false },
    { id: 2, text: "Ôn tập 10 thẻ từ vựng SRS", xp: 15, completed: false },
    { id: 3, text: "Đặt 3 câu thực tế (Output)", xp: 15, completed: false },
  ]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. Lấy thông tin tiến trình chung
        const progressRes = await getUserProgress();
        if (progressRes.success && progressRes.progress) {
          const p = progressRes.progress;
          setTotalXp(p.total_xp);
          setCurrentStreak(p.streak);
          if (p.current_level) {
            setUserLevel(`${p.current_level} Intermediate`);
          }
        }

        // 2. Lấy số lượng unit đã hoàn thành
        const completedRes = await getCompletedUnitsCount();
        if (completedRes.success) {
          setCompletedUnits(completedRes.count);
        }

        // 3. Lấy số thẻ đến hạn ôn tập
        const cardsRes = await getDueCards();
        if (cardsRes.success && cardsRes.cards) {
          setDueCardsCount(cardsRes.cards.length);
        }

        // 4. Lấy trạng thái của Unit 4
        const unitStatusRes = await getUnitCompletionStatus("unit-4");
        if (unitStatusRes.success) {
          setIsUnit4Completed(unitStatusRes.completed);
          
          if (unitStatusRes.completed) {
            // Đánh dấu quest 1 hoàn thành
            setQuests(prev => prev.map(q => q.id === 1 ? { ...q, completed: true } : q));
            
            // Nếu hoàn thành trong ngày hôm nay, cộng 80 XP vào vòng tròn ngày
            if (unitStatusRes.completedAt) {
              const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
              const completedDateStr = new Date(unitStatusRes.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
              if (completedDateStr === todayStr) {
                setXpCurrent(80);
              }
            }
          }
        }
      } catch (err) {
        console.error("Lỗi tải thông tin dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleToggleQuest = (id: number) => {
    setQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === id) {
          const nextState = !quest.completed;
          if (nextState) {
            // Trigger confetti
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.8 },
              colors: ["#10b981", "#3b82f6", "#f59e0b"],
            });
            // Update XP
            setXpCurrent((prevXp) => Math.min(prevXp + quest.xp, xpTarget));
          } else {
            setXpCurrent((prevXp) => Math.max(prevXp - quest.xp, 0));
          }
          return { ...quest, completed: nextState };
        }
        return quest;
      })
    );
  };

  const completedCount = quests.filter((q) => q.completed).length;

  // SVG parameters for circular progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const xpPercentage = (xpCurrent / xpTarget) * 100;
  const strokeDashoffset = circumference - (Math.min(xpPercentage, 100) / 100) * circumference;

  // Framer Motion variants for Bento Grid items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  } as const;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Đang tải dữ liệu học tập...</p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
      {/* Soft background ambient glow */}
      <div className="absolute top-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl opacity-60 dark:opacity-40 animate-float" />
      <div className="absolute bottom-20 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl opacity-50 dark:opacity-30" />

      {/* Greeting Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-foreground/[0.05]"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>Chào mừng bạn trở lại</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-none">
            Học tập mỗi ngày cùng <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">AtoEnglish</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal max-w-2xl">
            Lộ trình học cá nhân hóa theo mô hình khoa học IPOR & Spaced Repetition (Lặp lại ngắt quãng).
          </p>
        </div>
        
        {/* User Level Badge */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="shrink-0 flex items-center gap-3.5 rounded-2xl bg-glass border border-glass p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">Trình độ</div>
            <div className="text-sm font-bold text-foreground">{userLevel}</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Bento Grid layout */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-6 auto-rows-auto"
      >
        {/* 1. Main Recommended Lesson Card (Bento span: 4 cols, 2 rows equivalent height) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
          className="md:col-span-4 md:row-span-2 rounded-3xl border border-glass bg-glass p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between min-h-[360px] relative overflow-hidden group"
        >
          {/* Animated decorative gradient mesh background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-emerald-500/5 -z-10 group-hover:opacity-75 transition-opacity" />
          
          <div className="absolute -top-10 -right-10 p-10 opacity-[0.06] dark:opacity-[0.08] text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
            <BookOpen className="size-60" />
          </div>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground bg-foreground/[0.03] px-3 py-1 rounded-full">Bài học đề xuất</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                Pha 2: Processing
              </span>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3.5xl font-black text-foreground group-hover:text-primary transition-colors leading-tight">
                Unit 4: Technology & Society
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl font-normal">
                Phân tích cấu trúc câu nâng cao và ý nghĩa của động từ khuyết thiếu trong văn cảnh thời đại số. Thực hành diễn đạt ý kiến trái chiều về tiến bộ công nghệ.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 font-bold uppercase tracking-wider">Từ vựng (+10)</span>
              <span className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 font-bold uppercase tracking-wider">Đọc hiểu</span>
              <span className="text-xs bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/10 font-bold uppercase tracking-wider">Ngữ pháp</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-foreground/[0.04] relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <TrendingUp className="size-4 text-emerald-500" />
              <span>Tiến trình Unit 4: {isUnit4Completed ? "100%" : "40%"} đã hoàn thành</span>
            </div>
            <Link href="/learn">
              <Button className="h-12 px-6 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl flex items-center gap-2 group/btn transition-all duration-300 shadow-lg shadow-primary/10 active:scale-[0.98]">
                <span>Tiếp tục học ngay</span>
                <ArrowRight className="size-4.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 2. XP Daily Circular Chart Card (Bento span: 2 cols) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="md:col-span-2 rounded-3xl border border-glass bg-glass p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center justify-between text-center min-h-[300px]"
        >
          <div className="w-full flex items-center justify-between">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest">
              XP Ngày Hôm Nay
            </h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Hàng ngày
            </span>
          </div>
          
          {/* SVG Circular Ring with dynamic progress animation */}
          <div className="relative size-36 flex items-center justify-center my-2">
            <svg className="size-full transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-muted/40 fill-none"
                strokeWidth="7"
              />
              {/* Active Indicator */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-primary fill-none"
                strokeWidth="8"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: strokeDashoffset }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            {/* Inside Text */}
            <div className="absolute flex flex-col items-center leading-none">
              <span className="text-3xl font-black text-foreground">{Math.round(xpPercentage)}%</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1.5 font-mono">{xpCurrent} / {xpTarget} XP</span>
            </div>
          </div>

          <div className="space-y-1 w-full border-t border-foreground/[0.04] pt-4">
            <p className="text-xs font-bold text-foreground">
              Tổng điểm: {totalXp} XP tích lũy
            </p>
            <p className="text-[11px] text-muted-foreground font-normal">
              {xpCurrent >= xpTarget ? "🎉 Đã hoàn thành mục tiêu ngày!" : `Còn ${xpTarget - xpCurrent} XP nữa để đạt đích hôm nay`}
            </p>
          </div>
        </motion.div>

        {/* 3. Daily Streak Card (Bento span: 2 cols) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="md:col-span-2 rounded-3xl border border-glass bg-glass p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between min-h-[140px]"
        >
          <div className="flex items-center justify-between w-full gap-4">
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Chuỗi tích lũy</span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-foreground">{currentStreak}</span>
                <span className="text-xs text-muted-foreground font-semibold">ngày liên tục</span>
              </div>
            </div>
            {/* Animated SVG Flame */}
            <motion.div 
              className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 shrink-0"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Flame className="size-7 fill-orange-500 filter drop-shadow-[0_0_8px_oklch(0.65_0.23_25_/_0.6)]" />
            </motion.div>
          </div>
          
          <div className="pt-3 border-t border-foreground/[0.04] mt-2 flex items-center justify-between text-xs text-muted-foreground w-full">
            <span>Đã hoàn thành: <strong className="text-foreground font-bold">{completedUnits} Unit</strong></span>
            <span className="text-emerald-500 font-medium">
              {currentStreak > 0 ? "Nhóm top 12% chăm chỉ" : "Bắt đầu học ngay!"}
            </span>
          </div>
        </motion.div>


        {/* 4. Spaced Repetition (SRS Review) (Bento span: 2 cols) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="md:col-span-2 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-[0_8px_30px_rgba(0,0,0,0.015)] flex flex-col justify-between min-h-[220px] group"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-primary/20 text-primary border border-primary/20">
                <Layers className="size-3.5" />
                SRS Spaced Repetition
              </span>
              <span className="text-xs font-bold text-primary font-mono bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">{dueCardsCount} thẻ đến lịch</span>
            </div>
            <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
              Thuật toán SuperMemo-2 tối ưu tần suất lặp lại từ vựng. Đã đến lịch ôn tập để giữ thông tin trong trí nhớ dài hạn.
            </p>
          </div>
          
          <div className="pt-3">
            <Link href="/flashcards">
              <Button className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-xs flex items-center justify-between px-4 group/btn transition-all duration-300 shadow-md shadow-primary/5 active:scale-[0.98]">
                <span>Luyện tập lật thẻ ({dueCardsCount})</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 5. Daily Quests Card (Bento span: 2 cols) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="md:col-span-2 rounded-3xl border border-glass bg-glass p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-foreground/[0.04]">
              <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-widest">Nhiệm vụ hôm nay</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                {completedCount} / {quests.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {quests.map((quest) => (
                <div 
                  key={quest.id} 
                  onClick={() => handleToggleQuest(quest.id)}
                  className="flex items-start gap-3 text-xs py-1.5 px-2 rounded-xl hover:bg-foreground/[0.02] cursor-pointer transition-colors select-none"
                >
                  <span className="shrink-0 text-primary mt-0.5">
                    {quest.completed ? (
                      <CheckCircle2 className="size-4.5 fill-primary text-primary-foreground" />
                    ) : (
                      <Circle className="size-4.5 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110" />
                    )}
                  </span>
                  <div className="flex-1 leading-snug">
                    <p className={quest.completed ? "text-muted-foreground line-through decoration-1" : "text-foreground font-bold"}>
                      {quest.text}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/10 font-mono">+{quest.xp} XP</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
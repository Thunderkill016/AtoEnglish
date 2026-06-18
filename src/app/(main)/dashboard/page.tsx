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
  Play,
  Mic,
  Map,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDueCards } from "@/app/actions/cards";
import { getUserProgress, getCompletedUnitsCount, getUnitCompletionStatus, getCurrentUnit } from "@/app/actions/progress";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Chào buổi sáng";
  if (hour < 18) return "Chào buổi chiều";
  return "Chào buổi tối";
}

export default function DashboardPage() {
  const [xpCurrent, setXpCurrent] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [completedUnits, setCompletedUnits] = useState(0);
  const [userLevel, setUserLevel] = useState("B1 Intermediate");
  const [userName, setUserName] = useState("Học viên");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUnitData, setCurrentUnitData] = useState<{
    unitId: string;
    title: string;
    description: string;
    currentPhase: string;
    progress: number;
    completed: boolean;
    route: string;
  }>({
    unitId: "unit-1",
    title: "Unit 1: Greetings & Self-Introduction",
    description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh.",
    currentPhase: "Pha 1: Input",
    progress: 0,
    completed: false,
    route: "/learn/unit-1",
  });
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
            const levelNames: Record<string, string> = {
              A1: "A1 Beginner",
              A2: "A2 Elementary",
              B1: "B1 Intermediate",
              B2: "B2 Upper-Intermediate",
              C1: "C1 Advanced",
            };
            setUserLevel(levelNames[p.current_level] || `${p.current_level} Learner`);
          }
          if (p.display_name) {
            setUserName(p.display_name);
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

        // 4. Lấy thông tin Unit hiện tại của user
        const unitRes = await getCurrentUnit();
        if (unitRes.success && unitRes.unitId) {
          setCurrentUnitData({
            unitId: unitRes.unitId,
            title: unitRes.title || "",
            description: unitRes.description || "",
            currentPhase: unitRes.currentPhase || "",
            progress: unitRes.progress || 0,
            completed: !!unitRes.completed,
            route: unitRes.route || "/learn/unit-1",
          });

          // Kiểm tra xem các bài học được hoàn thành hôm nay để cộng XP vào vòng tròn ngày
          let todayXp = 0;
          const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

          const status1Res = await getUnitCompletionStatus("unit-1");
          if (status1Res.success && status1Res.completed && status1Res.completedAt) {
            const completedDateStr = new Date(status1Res.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
            if (completedDateStr === todayStr) {
              todayXp += 80;
            }
          }

          const status4Res = await getUnitCompletionStatus("unit-4");
          if (status4Res.success && status4Res.completed && status4Res.completedAt) {
            const completedDateStr = new Date(status4Res.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
            if (completedDateStr === todayStr) {
              todayXp += 80;
            }
          }

          setXpCurrent(Math.min(todayXp, xpTarget));

          // Đánh dấu quest 1 hoàn thành nếu active unit được hoàn tất hôm nay
          const activeStatusRes = await getUnitCompletionStatus(unitRes.unitId);
          if (activeStatusRes.success && activeStatusRes.completed && activeStatusRes.completedAt) {
            const completedDateStr = new Date(activeStatusRes.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
            if (completedDateStr === todayStr) {
              setQuests(prev => prev.map(q => q.id === 1 ? { ...q, completed: true } : q));
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

  // Framer Motion variants for grid items
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

      {/* Welcome Area */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-foreground/[0.05]"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>Chào mừng bạn trở lại</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            {getGreeting()}, <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">{userName}</span>!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Hôm nay bạn muốn học gì?
          </p>
        </div>
        
        {/* Streak Display Badge */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="shrink-0 flex items-center gap-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-5 py-3 shadow-lg shadow-orange-500/5 cursor-pointer"
        >
          <Flame className="size-6 text-orange-500 fill-orange-500 animate-pulse" />
          <span className="text-sm font-black text-orange-600 dark:text-orange-400">{currentStreak} ngày liên tục</span>
        </motion.div>
      </motion.div>

      {/* Main Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (60-65%): Recommended Lesson Card */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
            className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[380px] relative overflow-hidden group"
          >
            {/* Animated decorative gradient mesh background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-emerald-500/5 -z-10 group-hover:opacity-75 transition-opacity" />
            
            <div className="absolute -top-10 -right-10 p-10 opacity-[0.06] dark:opacity-[0.08] text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <BookOpen className="size-60" />
            </div>
            
            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground bg-foreground/[0.03] px-3 py-1 rounded-full">Bài học đang học</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  {currentUnitData.currentPhase}
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                  {currentUnitData.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-normal">
                  {currentUnitData.description}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 font-bold uppercase tracking-wider">
                  Từ vựng (+{currentUnitData.unitId === "unit-1" ? 12 : 3})
                </span>
                <span className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 font-bold uppercase tracking-wider">
                  {currentUnitData.unitId === "unit-1" ? "Giao tiếp" : "Đọc hiểu"}
                </span>
                <span className="text-xs bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/10 font-bold uppercase tracking-wider">
                  {currentUnitData.unitId === "unit-1" ? "Phát âm" : "Ngữ pháp"}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-foreground/[0.04] relative z-10 space-y-6">
              {/* Modern Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-emerald-500" />
                    Tiến trình học tập
                  </span>
                  <span className="text-foreground font-black font-mono">{currentUnitData.progress}%</span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-[2px] border border-foreground/[0.03]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentUnitData.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                <span className="text-xs text-muted-foreground">
                  Hoàn thành toàn bộ Unit để nhận ngay <strong className="text-foreground font-bold">80 XP</strong> và mở khóa bài học mới.
                </span>
                <Link href={currentUnitData.route} className="shrink-0">
                  <Button className="w-full sm:w-auto h-13 px-8 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 group/btn transition-all duration-300 shadow-lg shadow-primary/20 active:scale-[0.98]">
                    <span>Tiếp tục học ngay</span>
                    <ArrowRight className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column (35-40%): Stats Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            
            {/* XP circular tracker */}
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-3xl border border-glass bg-glass p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[260px]"
            >
              <div className="w-full flex items-center justify-between">
                <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest">
                  XP Ngày Hôm Nay
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                  Hàng ngày
                </span>
              </div>
              
              {/* Circular progress ring */}
              <div className="relative size-32 flex items-center justify-center my-3">
                <svg className="size-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-muted/30 fill-none"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    className="stroke-primary fill-none"
                    strokeWidth="7"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-2.5xl font-black text-foreground">{Math.round(xpPercentage)}%</span>
                  <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1 font-mono">{xpCurrent} / {xpTarget} XP</span>
                </div>
              </div>

              <div className="space-y-1 w-full border-t border-foreground/[0.04] pt-3 text-left sm:text-center">
                <p className="text-xs font-bold text-foreground">
                  Tổng điểm: {totalXp} XP tích lũy
                </p>
                <p className="text-[10px] text-muted-foreground font-normal">
                  {xpCurrent >= xpTarget ? "🎉 Đạt mục tiêu ngày!" : `Còn ${xpTarget - xpCurrent} XP để đạt đích`}
                </p>
              </div>
            </motion.div>

            {/* SRS Review Alert and Level details */}
            <div className="space-y-6">
              
              {/* Level summary */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 rounded-3xl bg-glass border border-glass p-5 shadow-sm"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                  <GraduationCap className="size-6" />
                </span>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">Trình độ hiện tại • Đã học xong {completedUnits} Unit</div>
                  <div className="text-base font-black text-foreground tracking-tight">{userLevel}</div>
                </div>
              </motion.div>

              {/* SRS Review box */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-500">
                      <Layers className="size-4" />
                    </span>
                    <span className="text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-wider">Hộp thẻ SRS</span>
                  </div>
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    {dueCardsCount} thẻ đến hạn
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground font-normal leading-relaxed">
                  Thuật toán FSRS đã lên lịch ôn tập. Luyện tập ngay để ghi nhớ từ vựng sâu sắc hơn.
                </p>

                <Link href="/flashcards" className="block">
                  <Button className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-between px-4 transition-all shadow-md shadow-amber-500/10 active:scale-[0.98]">
                    <span>Ôn tập lật thẻ ngay</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              </motion.div>

            </div>

          </div>
        </div>

      </div>

      {/* Bottom area: Daily Quests and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        
        {/* Daily Quests List */}
        <div className="lg:col-span-7 space-y-4">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="show"
            className="rounded-3xl border border-glass bg-glass p-6 sm:p-7 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-foreground/[0.04]">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-foreground tracking-tight">Nhiệm vụ hôm nay</h3>
                <p className="text-xs text-muted-foreground font-normal">Tự giác đánh dấu hoàn thành sau khi hoàn tất thử thách.</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 font-mono">
                {completedCount} / {quests.length} hoàn thành
              </span>
            </div>

            <div className="space-y-3.5">
              {quests.map((quest) => (
                <div 
                  key={quest.id} 
                  onClick={() => handleToggleQuest(quest.id)}
                  className="flex items-start gap-4 text-sm py-2.5 px-3 rounded-2xl hover:bg-foreground/[0.02] cursor-pointer transition-colors select-none border border-transparent hover:border-foreground/[0.03]"
                >
                  <span className="shrink-0 text-primary mt-0.5">
                    {quest.completed ? (
                      <CheckCircle2 className="size-5 fill-primary text-primary-foreground" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110" />
                    )}
                  </span>
                  <div className="flex-1 leading-snug">
                    <p className={quest.completed ? "text-muted-foreground line-through decoration-1" : "text-foreground font-bold"}>
                      {quest.text}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/10 font-mono">+{quest.xp} XP</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-glass bg-glass p-6 sm:p-7 shadow-sm space-y-5">
            <div className="pb-3 border-b border-foreground/[0.04]">
              <h3 className="text-lg font-black text-foreground tracking-tight">Thao tác nhanh</h3>
              <p className="text-xs text-muted-foreground font-normal">Phím tắt chuyển hướng nhanh đến các hoạt động học tập.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3.5">
              
              <Link href={currentUnitData.route}>
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all group/action cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover/action:scale-110 transition-transform">
                      <Play className="size-4.5 fill-primary" />
                    </span>
                    <span className="text-sm font-bold text-foreground">Học 10 phút</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover/action:text-primary transition-colors" />
                </motion.div>
              </Link>

              <Link href="/speaking">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all group/action cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/action:scale-110 transition-transform">
                      <Mic className="size-4.5" />
                    </span>
                    <span className="text-sm font-bold text-foreground">Luyện phát âm</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover/action:text-emerald-500 transition-colors" />
                </motion.div>
              </Link>

              <Link href="/roadmap">
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all group/action cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover/action:scale-110 transition-transform">
                      <Map className="size-4.5" />
                    </span>
                    <span className="text-sm font-bold text-foreground">Xem Roadmap</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover/action:text-blue-500 transition-colors" />
                </motion.div>
              </Link>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LazyMotion, m } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Flame,
  BookOpen,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getDueCards } from "@/app/actions/cards";
import { getUserProgress, getCompletedUnitsCount, getUnitCompletionStatus, getCurrentUnit } from "@/app/actions/progress";

// Dynamic import secondary components to reduce initial JavaScript payload size
const SrsCard = dynamic(() => import("./components/SrsCard"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-100/50 dark:bg-zinc-900/40 animate-pulse rounded-3xl" />,
});

const DailyQuests = dynamic(() => import("./components/DailyQuests"), {
  ssr: false,
  loading: () => <div className="h-64 bg-zinc-100/50 dark:bg-zinc-900/40 animate-pulse rounded-3xl" />,
});

const QuickActions = dynamic(() => import("./components/QuickActions"), {
  ssr: false,
  loading: () => <div className="h-44 bg-zinc-100/50 dark:bg-zinc-900/40 animate-pulse rounded-3xl" />,
});

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

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
        // Fetch stats, progress, units and due cards in parallel using Promise.all
        const [progressRes, completedRes, cardsRes, unitRes] = await Promise.all([
          getUserProgress(),
          getCompletedUnitsCount(),
          getDueCards(),
          getCurrentUnit(),
        ]);

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

        if (completedRes.success) {
          setCompletedUnits(completedRes.count);
        }

        if (cardsRes.success && cardsRes.cards) {
          setDueCardsCount(cardsRes.cards.length);
        }

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

          // Fetch completion statuses in parallel
          const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

          const [status1Res, status4Res, activeStatusRes] = await Promise.all([
            getUnitCompletionStatus("unit-1"),
            getUnitCompletionStatus("unit-4"),
            getUnitCompletionStatus(unitRes.unitId),
          ]);

          let todayXp = 0;

          if (status1Res.success && status1Res.completed && status1Res.completedAt) {
            const completedDateStr = new Date(status1Res.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
            if (completedDateStr === todayStr) {
              todayXp += 80;
            }
          }

          if (status4Res.success && status4Res.completed && status4Res.completedAt) {
            const completedDateStr = new Date(status4Res.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
            if (completedDateStr === todayStr) {
              todayXp += 80;
            }
          }

          setXpCurrent(Math.min(todayXp, xpTarget));

          // Set quest 1 done if active unit completed today
          if (activeStatusRes.success && activeStatusRes.completed && activeStatusRes.completedAt) {
            const completedDateStr = new Date(activeStatusRes.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
            if (completedDateStr === todayStr) {
              setQuests((prev) => prev.map((q) => (q.id === 1 ? { ...q, completed: true } : q)));
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
            // Lazy load canvas-confetti only when completed
            import("canvas-confetti").then((module) => {
              const confettiFn = module.default;
              confettiFn({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8 },
                colors: ["#10b981", "#3b82f6", "#f59e0b"],
              });
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

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  } as const;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-sm font-semibold text-muted-foreground">Đang tải dữ liệu học tập...</p>
      </div>
    );
  }

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
        {/* Soft background ambient glow */}
        <div className="absolute top-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl opacity-60 dark:opacity-40 animate-float" />
        <div className="absolute bottom-20 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl opacity-50 dark:opacity-30" />

        {/* Welcome Area */}
        <m.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-foreground/[0.05]"
        >
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
              <Sparkles className="size-3.5 text-primary animate-pulse" />
              <span>Chào mừng bạn trở lại</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {getGreeting()},{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {userName}
              </span>
              !
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-normal">Hôm nay bạn muốn học gì?</p>
          </div>

          {/* Streak Display Badge */}
          <m.div
            whileHover={{ scale: 1.05 }}
            className="shrink-0 flex items-center gap-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-5 py-3 shadow-lg shadow-orange-500/5 cursor-pointer"
          >
            <Flame className="size-6 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-sm font-black text-orange-600 dark:text-orange-400">{currentStreak} ngày liên tục</span>
          </m.div>
        </m.div>

        {/* Main Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (60-65%): Recommended Lesson Card */}
          <div className="lg:col-span-8 space-y-6">
            <m.div
              variants={itemVariants}
              initial="hidden"
              animate="show"
              whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
              className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[380px] relative overflow-hidden group text-left"
            >
              {/* Animated decorative gradient mesh background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-emerald-500/5 -z-10 group-hover:opacity-75 transition-opacity" />

              <div className="absolute -top-10 -right-10 p-10 opacity-[0.06] dark:opacity-[0.08] text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <BookOpen className="size-60" />
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground bg-foreground/[0.03] px-3 py-1 rounded-full">
                    Bài học đang học
                  </span>
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
                    <m.div
                      initial={{ width: 0 }}
                      animate={{ width: `${currentUnitData.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </m.div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                  <span className="text-xs text-muted-foreground">
                    Hoàn thành toàn bộ Unit để nhận ngay <strong className="text-foreground font-bold">80 XP</strong>{" "}
                    và mở khóa bài học mới.
                  </span>
                  <Link href={currentUnitData.route} className="shrink-0">
                    <Button className="w-full sm:w-auto h-13 px-8 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 group/btn transition-all duration-300 shadow-lg shadow-primary/20 active:scale-[0.98]">
                      <span>Tiếp tục học ngay</span>
                      <ArrowRight className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </m.div>
          </div>

          {/* Right Column (35-40%): Stats Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* XP circular tracker */}
              <m.div
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
                    <circle cx="64" cy="64" r={radius} className="stroke-muted/30 fill-none" strokeWidth="6" />
                    <m.circle
                      cx="64"
                      cy="64"
                      r={radius}
                      className="stroke-primary fill-none"
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: strokeDashoffset }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center leading-none">
                    <span className="text-2.5xl font-black text-foreground">{Math.round(xpPercentage)}%</span>
                    <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1 font-mono">
                      {xpCurrent} / {xpTarget} XP
                    </span>
                  </div>
                </div>

                <div className="space-y-1 w-full border-t border-foreground/[0.04] pt-3 text-left sm:text-center">
                  <p className="text-xs font-bold text-foreground">Tổng điểm: {totalXp} XP tích lũy</p>
                  <p className="text-[10px] text-muted-foreground font-normal">
                    {xpCurrent >= xpTarget
                      ? "🎉 Đạt mục tiêu ngày!"
                      : `Còn ${xpTarget - xpCurrent} XP để đạt đích`}
                  </p>
                </div>
              </m.div>

              {/* Dynamic SrsCard Loader */}
              <SrsCard
                completedUnits={completedUnits}
                userLevel={userLevel}
                dueCardsCount={dueCardsCount}
              />
            </div>
          </div>
        </div>

        {/* Bottom area: Daily Quests and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Daily Quests List */}
          <div className="lg:col-span-7 space-y-4">
            <DailyQuests
              quests={quests}
              handleToggleQuest={handleToggleQuest}
              completedCount={completedCount}
            />
          </div>

          {/* Quick Actions Panel */}
          <div className="lg:col-span-5 space-y-4">
            <QuickActions currentUnitRoute={currentUnitData.route} />
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
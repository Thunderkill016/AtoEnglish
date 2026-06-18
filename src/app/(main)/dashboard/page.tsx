"use client";

import { useState, useEffect } from "react";
import { LazyMotion, m } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Flame,
  Sparkles,
} from "lucide-react";

import { getDueCards } from "@/app/actions/cards";
import { getUserProgress, getCompletedUnitsCount, getUnitCompletionStatus, getCurrentUnit } from "@/app/actions/progress";

// Statically import UnitCard to keep it in the server-rendered HTML payload for optimal LCP/FCP
import UnitCard from "./components/UnitCard";

// Dynamically import client-only or secondary widgets with skeletons
const XpTracker = dynamic(() => import("./components/XpTracker"), {
  ssr: false,
  loading: () => <div className="rounded-3xl border border-glass bg-glass p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[260px] animate-pulse" />,
});

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

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
        {/* Soft background ambient glow */}
        <div className="absolute top-10 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-primary/10 blur-3xl opacity-60 dark:opacity-40 animate-float" />
        <div className="absolute bottom-20 left-10 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl opacity-50 dark:opacity-30" />

        {/* Welcome Area - SSR populated layout */}
        <m.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
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
                {isLoading ? "Học viên" : userName}
              </span>
              !
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-normal">Hôm nay bạn muốn học gì?</p>
          </div>

          {/* Streak Display Badge */}
          <m.div
            whileHover={{ scale: 1.03 }}
            className="shrink-0 flex items-center gap-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-5 py-3 shadow-lg shadow-orange-500/5 cursor-pointer"
          >
            <Flame className="size-6 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="text-sm font-black text-orange-600 dark:text-orange-400">
              {isLoading ? "-" : currentStreak} ngày liên tục
            </span>
          </m.div>
        </m.div>

        {/* Main Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (60-65%): Recommended Lesson Card */}
          <div className="lg:col-span-8 space-y-6">
            <UnitCard isLoading={isLoading} currentUnitData={currentUnitData} />
          </div>

          {/* Right Column (35-40%): Stats Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* XP circular tracker - loaded dynamically */}
              <XpTracker
                isLoading={isLoading}
                xpCurrent={xpCurrent}
                xpTarget={xpTarget}
                totalXp={totalXp}
              />

              {/* Dynamic SrsCard Loader */}
              {!isLoading && (
                <SrsCard
                  completedUnits={completedUnits}
                  userLevel={userLevel}
                  dueCardsCount={dueCardsCount}
                />
              )}
            </div>
          </div>
        </div>

        {/* Bottom area: Daily Quests and Quick Actions */}
        {!isLoading && (
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
        )}
      </div>
    </LazyMotion>
  );
}
"use client";

import { useState, useEffect } from "react";
import { LazyMotion, m } from "framer-motion";
import { Flame, Sparkles } from "lucide-react";

import UnitCard from "./UnitCard";
import XpTracker from "./XpTracker";
import SrsCard from "./SrsCard";
import DailyQuests from "./DailyQuests";
import QuickActions from "./QuickActions";

interface DashboardClientProps {
  userName: string;
  currentStreak: number;
  totalXp: number;
  userLevel: string;
  completedUnits: number;
  dueCardsCount: number;
  currentUnitData: {
    unitId: string;
    title: string;
    description: string;
    currentPhase: string;
    progress: number;
    completed: boolean;
    route: string;
  };
  initialXpCurrent: number;
  initialQuests: Array<{
    id: number;
    text: string;
    xp: number;
    completed: boolean;
  }>;
}

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export default function DashboardClient({
  userName,
  currentStreak,
  totalXp,
  userLevel,
  completedUnits,
  dueCardsCount,
  currentUnitData,
  initialXpCurrent,
  initialQuests,
}: DashboardClientProps) {
  const [xpCurrent, setXpCurrent] = useState(initialXpCurrent);
  const [quests, setQuests] = useState(initialQuests);
  const [greeting, setGreeting] = useState("Chào bạn");
  const xpTarget = 80;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
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
              {greeting},{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                {userName}
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
              {currentStreak} ngày liên tục
            </span>
          </m.div>
        </m.div>

        {/* Main Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (60-65%): Recommended Lesson Card */}
          <div className="lg:col-span-8 space-y-6">
            <UnitCard currentUnitData={currentUnitData} />
          </div>

          {/* Right Column (35-40%): Stats Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {/* XP circular tracker */}
              <XpTracker
                xpCurrent={xpCurrent}
                xpTarget={xpTarget}
                totalXp={totalXp}
              />

              {/* SrsCard */}
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

"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Flame, Star, GraduationCap, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { updateDailyXpGoal } from "@/app/actions/progress";

import UnitCard from "./UnitCard";
import SrsCard from "./SrsCard";
import DailyQuests from "./DailyQuests";
import QuickActions from "./QuickActions";
import LevelUpModal from "@/components/learn/LevelUpModal";

// Dynamic import — NotificationBell uses browser APIs (navigator, ServiceWorker)
const NotificationBell = dynamic(
  () => import("@/components/notifications/NotificationBell"),
  { ssr: false }
);

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
    tags: string[];
  };
  initialXpCurrent: number;
  initialQuests: Array<{
    id: number;
    text: string;
    xp: number;
    completed: boolean;
  }>;
  dailyXpGoal: number;
}

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
  dailyXpGoal,
}: DashboardClientProps) {
  const [xpCurrent, setXpCurrent] = useState(initialXpCurrent);
  const [quests, setQuests] = useState(initialQuests);
  const [greeting, setGreeting] = useState("Chào bạn");
  const [xpTarget, setXpTarget] = useState(dailyXpGoal);
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(false);

  // Level-up detection: check localStorage for pending level-up from UnitTemplate
  const [levelUpModal, setLevelUpModal] = useState<{ prev: string; next: string } | null>(null);
  useEffect(() => {
    const pending = localStorage.getItem("pending-level-up");
    if (pending) {
      try {
        const { prev, next } = JSON.parse(pending) as { prev: string; next: string };
        if (prev && next && prev !== next) setLevelUpModal({ prev, next });
      } catch { /* ignore */ }
      localStorage.removeItem("pending-level-up");
    }
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
  }, []);

  const handleUpdateGoal = async (newGoal: number) => {
    setUpdatingGoal(true);
    try {
      const res = await updateDailyXpGoal(newGoal);
      if (res.success) {
        setXpTarget(newGoal);
        toast.success(res.message);
        setShowGoalSelector(false);
      } else {
        toast.error(res.error || "Không thể cập nhật mục tiêu.");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi cập nhật mục tiêu.");
    } finally {
      setUpdatingGoal(false);
    }
  };

  // localStorage persistence — key by today's date so quests reset on new day
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  const storageKey = `quests-${todayKey}`;

  // Load persisted quest state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const { quests: savedQuests, xp } = JSON.parse(saved);
        if (Array.isArray(savedQuests)) setQuests(savedQuests);
        if (typeof xp === "number") setXpCurrent(xp);
      }
    } catch {
      // localStorage unavailable or corrupt — use server defaults
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleQuest = (id: number) => {
    setQuests((prev) => {
      const next = prev.map((quest) => {
        if (quest.id === id) {
          const nextState = !quest.completed;
          if (nextState) {
            import("canvas-confetti").then((module) => {
              module.default({
                particleCount: 80,
                spread: 60,
                origin: { y: 0.8 },
                colors: ["#10b981", "#3b82f6", "#f59e0b"],
              });
            });
          }
          return { ...quest, completed: nextState };
        }
        return quest;
      });
      // Persist to localStorage
      const newXp = next.reduce((sum, q) => (q.completed ? sum + q.xp : sum), 0);
      const clampedXp = Math.min(newXp, xpTarget);
      setXpCurrent(clampedXp);
      try {
        localStorage.setItem(storageKey, JSON.stringify({ quests: next, xp: clampedXp }));
      } catch { /* ignore */ }
      return next;
    });
  };

  const completedCount = quests.filter((q) => q.completed).length;
  const xpPercent = Math.round((xpCurrent / xpTarget) * 100);

  // Parse short level label (e.g. "B1 Intermediate" → "B1")
  const shortLevel = userLevel.split(" ")[0] ?? userLevel;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      {/* Ambient glow — CSS only, no JS */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/6 dark:bg-emerald-500/4 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[100px]" />

      <div className="space-y-6">
        {/* ── 1. Greeting row ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5">
              Chào mừng bạn trở lại
            </p>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {greeting},{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300">
                {userName}
              </span>
              !
            </h1>
          </div>
          {/* Streak badge + Notification Bell */}
          <div className="shrink-0 flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-4 py-2.5 hover:bg-orange-500/15 transition-colors duration-200">
              <Flame className="size-5 text-orange-500 fill-orange-500" />
              <span className="text-sm font-black text-orange-600 dark:text-orange-400 whitespace-nowrap">
                {currentStreak} ngày
              </span>
            </div>
            <NotificationBell />
          </div>
        </div>

        {/* ── 2. Stats strip ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* XP today */}
          <div
            onClick={() => setShowGoalSelector(true)}
            className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-2 hover:border-emerald-500/30 transition-colors duration-200 cursor-pointer relative overflow-hidden group"
            title="Nhấn để thay đổi mục tiêu daily XP"
          >
            {showGoalSelector && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/95 border border-zinc-800 p-2.5 space-y-1.5 rounded-2xl">
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Mục tiêu XP mới</p>
                <div className="grid grid-cols-2 gap-1 w-full">
                  {[30, 50, 80, 100].map((val) => (
                    <button
                      key={val}
                      disabled={updatingGoal}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateGoal(val);
                      }}
                      className={`py-1 rounded-lg text-[9px] font-extrabold transition-all border ${
                        xpTarget === val
                          ? "bg-emerald-600 text-white border-emerald-500"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-emerald-500/30"
                      }`}
                    >
                      {val} XP
                    </button>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowGoalSelector(false);
                  }}
                  className="text-[8px] text-zinc-500 hover:text-zinc-300 font-bold uppercase transition-colors"
                >
                  Đóng
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Star className="size-3.5 fill-current" />
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">XP hôm nay ⚙️</span>
            </div>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
              {xpCurrent}<span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">/{xpTarget}</span>
            </p>
            {/* Mini progress bar */}
            <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(xpPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Level */}
          <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-2 hover:border-blue-500/30 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <GraduationCap className="size-3.5" />
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Trình độ</span>
            </div>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">{shortLevel}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">{totalXp} XP tích lũy</p>
          </div>

          {/* Units completed */}
          <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-2 hover:border-purple-500/30 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <BookOpen className="size-3.5" />
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Units</span>
            </div>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">{completedUnits}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">đã hoàn thành</p>
          </div>
        </div>

        {/* ── 3. Main content: 2-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Hero lesson card */}
          <div className="lg:col-span-7">
            <UnitCard currentUnitData={currentUnitData} />
          </div>

          {/* Right: SRS + Daily Quests */}
          <div className="lg:col-span-5 space-y-5">
            <SrsCard dueCardsCount={dueCardsCount} />
            <DailyQuests
              quests={quests}
              handleToggleQuest={handleToggleQuest}
              completedCount={completedCount}
            />
          </div>
        </div>


        {/* ── 4. Quick Actions row ── */}
        <QuickActions currentUnitRoute={currentUnitData.route} />
      </div>

      {/* Level-Up Celebration Modal */}
      {levelUpModal && (
        <LevelUpModal
          isOpen={!!levelUpModal}
          previousLevel={levelUpModal.prev}
          newLevel={levelUpModal.next}
          onClose={() => setLevelUpModal(null)}
        />
      )}
    </div>
  );
}

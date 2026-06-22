"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, GraduationCap, BookOpen, Clock, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { updateDailyXpGoal } from "@/app/actions/progress";
import { getPhaseForLevel, DAILY_TIPS } from "@/lib/constants/study-plan";

import UnitCard from "./UnitCard";
import SrsCard from "./SrsCard";
import DailyQuests from "./DailyQuests";
import QuickActions from "./QuickActions";
import WordOfDayCard from "./WordOfDayCard";
import LevelUpModal from "@/components/learn/LevelUpModal";

// Dynamic import — NotificationBell uses browser APIs (navigator, ServiceWorker)
const NotificationBell = dynamic(
  () => import("@/components/notifications/NotificationBell"),
  { ssr: false, loading: () => null }
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
    xp: number;
  };
  initialXpCurrent: number;
  initialQuests: Array<{
    id: number;
    text: string;
    xp: number;
    completed: boolean;
  }>;
  dailyXpGoal: number;
  wordOfDay: {
    word: string;
    phonetic: string;
    meaning_vn: string;
    example_en: string;
    topic: string;
    level: "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
  } | null;
  completedUnitIds: string[];
  allUnits: Array<{ id: string; title: string; level: string; route: string; xp: number }>;
}

const getLevelBadgeStyles = (level: string) => {
  switch (level) {
    case "A0":
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300";
    case "A1":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
    case "A2":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    case "B1":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";
    case "B2":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
    default:
      return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300";
  }
};

const getLevelProgressStyles = (level: string) => {
  switch (level) {
    case "A0":
      return "bg-gradient-to-r from-zinc-500 to-slate-500";
    case "A1":
      return "bg-gradient-to-r from-emerald-500 to-teal-500";
    case "A2":
      return "bg-gradient-to-r from-blue-500 to-violet-500";
    case "B1":
      return "bg-gradient-to-r from-purple-500 to-indigo-500";
    case "B2":
      return "bg-gradient-to-r from-amber-500 to-orange-500";
    default:
      return "bg-gradient-to-r from-zinc-500 to-slate-500";
  }
};

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
  wordOfDay,
  completedUnitIds,
  allUnits,
}: DashboardClientProps) {
  const [xpCurrent, setXpCurrent] = useState(initialXpCurrent);
  const [quests, setQuests] = useState(initialQuests);
  const [greeting, setGreeting] = useState("Chào bạn");

  // Animated count-up for total XP on mount
  const [displayXp, setDisplayXp] = useState(0);
  useEffect(() => {
    if (totalXp === 0) return;
    const steps = 40;
    const duration = 900;
    const increment = totalXp / steps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, totalXp);
       
      setDisplayXp(Math.round(current));
      if (current >= totalXp) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [totalXp]);

  const [xpTarget, setXpTarget] = useState(() => {
    if (typeof window === "undefined") return dailyXpGoal;
    const stored = localStorage.getItem("ato_daily_xp_goal");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return dailyXpGoal;
  });
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [updatingGoal, setUpdatingGoal] = useState(false);
  const [hoursLeft, setHoursLeft] = useState<number | null>(null);

  // Level-up detection: check localStorage for pending level-up from UnitTemplate
  const [levelUpModal, setLevelUpModal] = useState<{ prev: string; next: string } | null>(null);
  useEffect(() => {
    const pending = localStorage.getItem("pending-level-up");
    if (pending) {
      try {
        const { prev, next } = JSON.parse(pending) as { prev: string; next: string };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (prev && next && prev !== next) setLevelUpModal({ prev, next });
      } catch { /* ignore */ }
      localStorage.removeItem("pending-level-up");
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hour < 12) setGreeting("Chào buổi sáng");
     
    else if (hour < 18) setGreeting("Chào buổi chiều");
     
    else setGreeting("Chào buổi tối");
    // Hours left until midnight for streak countdown
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const minsLeft = Math.round((midnight.getTime() - now.getTime()) / 60000);
     
    setHoursLeft(Math.ceil(minsLeft / 60));
  }, []);

  // ─── XP sync: listen for lesson-completion events from UnitTemplate ───────
  useEffect(() => {
    const handleXpEarned = (e: Event) => {
      const xp = (e as CustomEvent<{ xp: number }>).detail.xp;
      setXpCurrent(prev => Math.min(prev + xp, xpTarget));
    };
    window.addEventListener("ato:xp-earned", handleXpEarned);
    return () => window.removeEventListener("ato:xp-earned", handleXpEarned);
  }, [xpTarget]);

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen overflow-x-hidden">
      {/* Ambient glow — CSS only, no JS */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[300px] w-[50vw] max-w-[400px] rounded-full bg-emerald-500/6 dark:bg-emerald-500/4 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[100px]" />

      <div className="space-y-6">
        {/* ── 1. Greeting row ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-0.5 whitespace-nowrap">
              Chào mừng trở lại
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
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-4 py-2.5 hover:bg-orange-500/15 transition-colors duration-200">
                <Flame
                  className={`size-5 text-orange-500 fill-orange-500 ${
                    currentStreak >= 3 ? "animate-pulse" : ""
                  }`}
                />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    {currentStreak} ngày
                  </span>
                  {hoursLeft !== null && hoursLeft <= 8 && (
                    <span className="text-[10px] font-bold text-orange-500/70 dark:text-orange-400/60">
                      Còn {hoursLeft}h
                    </span>
                  )}
                </div>
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
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-sm"
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
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(xpPercent, 100)}%` }}
              />
            </div>
          </div>

          {/* Level */}
          {(() => {
            const levelUnitsAll = allUnits.filter(u => u.level === shortLevel);
            const levelUnitsDone = completedUnitIds.filter(id =>
              allUnits.find(u => u.id === id)?.level === shortLevel
            ).length;
            const levelProgress = levelUnitsAll.length > 0
              ? Math.round((levelUnitsDone / levelUnitsAll.length) * 100)
              : 0;
            const NEXT: Record<string, string> = { A0: "A1", A1: "A2", A2: "B1", B1: "B2", B2: "C1" };
            const nextLevel = NEXT[shortLevel] ?? "";
            return (
              <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-2 hover:border-blue-500/30 transition-colors duration-200">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <GraduationCap className="size-3.5" />
                  </span>
                  <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Trình độ</span>
                </div>
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">{shortLevel}</p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium tabular-nums">{displayXp} XP tích lũy</p>
                {nextLevel && (
                  <>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700"
                        style={{ width: `${levelProgress}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold">
                      {levelUnitsDone}/{levelUnitsAll.length} Đến {nextLevel}
                    </p>
                  </>
                )}
              </div>
            );
          })()}

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

        {/* ── 3. Placement Test Banner ── */}
        <Link
          href="/placement-test"
          className="flex items-center gap-3 p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200 group"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-xl shrink-0">🎯</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-0.5">CEFR Placement Test</p>
            <p className="text-sm font-bold text-foreground">Xác Định Trình Độ Chính Xác</p>
            <p className="text-xs text-muted-foreground">40 câu · Grammar + Vocab + Reading · ~20 phút</p>
          </div>
          <ChevronRight className="size-5 text-violet-400/60 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        {/* ── 4. Today's Study Plan Widget ── */}
        <TodayPlanWidget userLevel={userLevel} />


        {/* ── 4. Main content: 2-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Hero lesson card */}
          <div className="lg:col-span-7">
            <UnitCard currentUnitData={currentUnitData} />
          </div>

          {/* Right: Word of Day + SRS + Daily Quests */}
          <div className="lg:col-span-5 space-y-5">
            {wordOfDay && (
              <WordOfDayCard
                word={wordOfDay.word}
                phonetic={wordOfDay.phonetic}
                meaning_vn={wordOfDay.meaning_vn}
                example_en={wordOfDay.example_en}
                topic={wordOfDay.topic}
                level={wordOfDay.level}
              />
            )}
            <SrsCard dueCardsCount={dueCardsCount} />
            <DailyQuests
              quests={quests}
              handleToggleQuest={handleToggleQuest}
              completedCount={completedCount}
            />
          </div>
        </div>


        {/* ── 5. Quick Actions row ── */}
        <QuickActions currentUnitRoute={currentUnitData.route} />

        {/* ── 6. Curriculum Progress Grid ── */}
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Tiến độ khoá học</h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">{completedUnitIds.length}/{allUnits.length} units</span>
          </div>

          {/* Group by level */}
          {["A0", "A1", "A2", "B1", "B2"].map(level => {
            const levelUnits = allUnits.filter(u => u.level === level);
            const levelDone = levelUnits.filter(u => completedUnitIds.includes(u.id)).length;
            return (
              <div key={level} className="mb-4 last:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${getLevelBadgeStyles(level)}`}>
                    {level}
                  </span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">{levelDone}/{levelUnits.length} hoàn thành</span>
                  <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getLevelProgressStyles(level)}`}
                      style={{ width: `${levelUnits.length ? (levelDone / levelUnits.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5">
                  {levelUnits.map((unit) => {
                    const done = completedUnitIds.includes(unit.id);
                    const isCurrent = unit.id === currentUnitData.unitId;
                    const displayNum = unit.id.split("-").pop();
                    return (
                      <a
                        key={unit.id}
                        href={unit.route}
                        title={unit.title}
                        className={`relative flex items-center justify-center h-9 rounded-xl text-xs font-black transition-all duration-200 border ${
                          done
                            ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-emerald-400/70 shadow-sm shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-500 active:scale-95"
                            : isCurrent
                              ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 border-zinc-700 dark:border-zinc-200 shadow-sm"
                              : "bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400"
                        }`}
                      >
                        {done ? (
                          <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          displayNum
                        )}
                        {isCurrent && !done && (
                          <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400 border-2 border-white dark:border-zinc-900" />
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
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

// ─── Today's Study Plan Widget ───────────────────────────────────────────────
function TodayPlanWidget({ userLevel }: { userLevel: string }) {
  const phase = getPhaseForLevel(userLevel);
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  const checkKey = `study-plan-checks-${todayKey}`;
  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const todayTip = DAILY_TIPS[tipIndex]!;

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(checkKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved) as Record<number, boolean>);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      try { localStorage.setItem(checkKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const doneCount = phase.dailyRoutine.filter((_, i) => checked[i]).length;
  const total = phase.dailyRoutine.length;
  const totalMins = phase.dailyRoutine.reduce((s, a) => s + a.duration, 0);

  const SKILL_COLORS: Record<string, string> = {
    pronunciation: "#f59e0b", vocabulary: "#8b5cf6", grammar: "#3b82f6",
    listening: "#10b981", speaking: "#ef4444", reading: "#06b6d4", writing: "#ec4899",
  };

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{phase.emoji}</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Kế hoạch hôm nay · Phase {phase.id}
            </p>
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {phase.title} — {phase.months}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-base font-black text-zinc-900 dark:text-zinc-50">{doneCount}/{total}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1 justify-end">
              <Clock className="size-3" />{totalMins} phút
            </p>
          </div>
          {/* Progress ring mini */}
          <div className="relative size-10 shrink-0">
            <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-200 dark:text-zinc-800" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={phase.color} strokeWidth="3"
                strokeDasharray={`${(doneCount / total) * 94.2} 94.2`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color: phase.color }}>
              {Math.round((doneCount / total) * 100)}%
            </span>
          </div>
          {collapsed ? <ChevronDown className="size-4 text-zinc-400" /> : <ChevronUp className="size-4 text-zinc-400" />}
        </div>
      </button>

      {!collapsed && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-2">
          {/* Activities checklist */}
          {phase.dailyRoutine.map((act, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
                checked[i]
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/20 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  checked[i] ? "border-emerald-500 bg-emerald-500" : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                {checked[i] && (
                  <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {/* Icon */}
              <span
                className="flex size-8 items-center justify-center rounded-lg text-base shrink-0"
                style={{ background: `${SKILL_COLORS[act.skill] ?? "#52525b"}15` }}
              >
                {act.icon}
              </span>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${
                  checked[i] ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-900 dark:text-zinc-50"
                }`}>
                  {act.title}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">{act.resource}</p>
              </div>
              {/* Duration badge */}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                style={{ color: SKILL_COLORS[act.skill] ?? "#52525b", background: `${SKILL_COLORS[act.skill] ?? "#52525b"}15` }}
              >
                {act.duration}&apos;
              </span>
            </button>
          ))}

          {/* Daily tip */}
          <div className="flex gap-2 items-start p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mt-1">
            <span className="text-base shrink-0">💡</span>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <span className="font-bold text-amber-600 dark:text-amber-400">Tip: </span>
              {todayTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

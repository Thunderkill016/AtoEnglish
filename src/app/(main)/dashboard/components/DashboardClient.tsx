"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, Star, GraduationCap, BookOpen, Clock, ChevronDown, ChevronUp, ChevronRight, ExternalLink, Target, Zap, TrendingUp, Mic } from "lucide-react";
import { toast } from "sonner";
import { updateDailyXpGoal } from "@/app/actions/stats";
import { useStreakFreeze as freezeStreakAction } from "@/app/actions/gamification";
import { getPhaseForLevel, DAILY_TIPS } from "@/lib/constants/study-plan";

import UnitCard from "./UnitCard";
import SrsCard from "./SrsCard";
import DailyQuests from "./DailyQuests";
import QuickActions from "./QuickActions";
import WordOfDayCard from "./WordOfDayCard";
import LeagueCard from "./LeagueCard";
import SpeakingFeedCard from "./SpeakingFeedCard";
import LevelUpModal from "@/components/learn/LevelUpModal";
import { WidgetErrorBoundary } from "@/components/ui/widget-error-boundary";
import { StreakShieldWidget } from "@/components/gamification/StreakShieldWidget";
import StreakCounter from "@/features/streak/components/StreakCounter";
import StreakAtRiskBanner from "@/features/streak/components/StreakAtRiskBanner";
import StreakMilestoneOverlay from "@/features/streak/components/StreakMilestoneOverlay";
import StreakBrokenModal from "@/features/streak/components/StreakBrokenModal";
import WeeklyActivityChart from "@/features/streak/components/WeeklyActivityChart";
import StreakCalendar from "@/features/streak/components/StreakCalendar";
import { useStreakStatus } from "@/features/streak/hooks/useStreakStatus";
import WeeklyRecapCard from "./WeeklyRecapCard";
import EfSetGoalTracker from "./EfSetGoalTracker";
import TodayPlanWidget from "./TodayPlanWidget";
import TodayMission from "./TodayMission";
import LevelProgressBar from "./LevelProgressBar";
import StreakFreezeCard from "@/features/streak/components/StreakFreezeCard";

// Dynamic import — PushPermissionCard uses browser APIs (Notification, PushManager)
const PushPermissionCard = dynamic(
  () => import("@/features/notifications/components/PushPermissionCard"),
  { ssr: false }
);

// Dynamic import — NotificationBell uses browser APIs (navigator, ServiceWorker)
const NotificationBell = dynamic(
  () => import("@/components/notifications/NotificationBell"),
  { ssr: false, loading: () => null }
);

interface DashboardClientProps {
  userName: string;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
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
  streakFreezeCount: number;
  weeklyData: Array<{ day: string; label: string; xp: number; pct: number }>;
  calendarData: Array<{ date: string; xp: number }>;
  allUnits: Array<{ id: string; title: string; level: string; route: string; xp: number }>;
  recentSpeakingSessions: Array<{
    id: string;
    practice_type: "shadowing" | "roleplay" | "journal";
    duration: number;
    accuracy_score: number | null;
    scenario_id: string | null;
    created_at: string;
  }>;
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
  bestStreak,
  lastActiveDate,
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
  streakFreezeCount,
  weeklyData,
  calendarData,
  recentSpeakingSessions,
}: DashboardClientProps) {
  const [xpCurrent, setXpCurrent] = useState(initialXpCurrent);
  const [quests, setQuests] = useState(initialQuests);
  const [greeting, setGreeting] = useState("Chào bạn");

  // Parse short level label (e.g. "B1 Intermediate" → "B1")
  const shortLevel = userLevel.split(" ")[0] ?? userLevel;

  // — Streak state machine (psychology-driven) —
  const streakState = useStreakStatus({
    streak: currentStreak,
    bestStreak,
    lastActiveDate,
    freezeCount: streakFreezeCount,
  });
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [milestoneDismissed, setMilestoneDismissed] = useState(false);
  // StreakBrokenModal: only shown once per session using sessionStorage
  const [brokenModalDismissed, setBrokenModalDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("ato_broken_modal_dismissed") === "1";
  });
  const handleBrokenModalDismiss = () => {
    sessionStorage.setItem("ato_broken_modal_dismissed", "1");
    setBrokenModalDismissed(true);
  };

  const [showPlacementBanner, setShowPlacementBanner] = useState(true);
  const [expandProgressGrid, setExpandProgressGrid] = useState(false);

  useEffect(() => {
    const hidden = localStorage.getItem("ato_hide_placement_banner") === "true";
    const isNotA0 = shortLevel !== "A0";
    if (hidden || isNotA0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowPlacementBanner(false);
    }
  }, [shortLevel]);

  const handleDismissPlacementBanner = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem("ato_hide_placement_banner", "true");
    setShowPlacementBanner(false);
  };

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
      const challengeKey = `ato_challenge_${todayKey}`;
      const challengeDone = !!localStorage.getItem(challengeKey);

      if (saved) {
        const { quests: savedQuests, xp } = JSON.parse(saved) as {
          quests: Array<{ id: number; text: string; xp: number; completed: boolean }>;
          xp: number;
        };
        if (Array.isArray(savedQuests)) {
          // Auto-sync quest #4 (Daily Challenge) with challenge completion state
          const synced = savedQuests.map((q) =>
            q.id === 4 ? { ...q, completed: challengeDone || q.completed } : q
          );
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setQuests(synced);
        }
         
        if (typeof xp === "number") setXpCurrent(xp);
      } else if (challengeDone) {
        // No saved quest state yet, but challenge is done — mark quest 4
         
        setQuests((prev) =>
          prev.map((q) => (q.id === 4 ? { ...q, completed: true } : q))
        );
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

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen overflow-x-hidden pb-20 sm:pb-0">
      {/* Ambient glow — CSS only, no JS */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[300px] w-[50vw] max-w-[400px] rounded-full bg-emerald-500/6 dark:bg-emerald-500/4 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -z-10 h-[300px] w-[300px] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[100px]" />

      {/* — Streak at-risk fixed banner — */}
      {!bannerDismissed && (
        <StreakAtRiskBanner
          state={streakState}
          onActivateFreeze={async () => {
            const result = await freezeStreakAction();
            if (!result.success) throw new Error(result.error ?? "Failed");
          }}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* — Milestone celebration overlay — */}
      {!milestoneDismissed && (
        <StreakMilestoneOverlay
          state={streakState}
          onDismiss={() => setMilestoneDismissed(true)}
        />
      )}

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
          {/* Streak badge (new StreakCounter) + Notification Bell */}
            <div className="flex items-center gap-2 shrink-0">
              <StreakCounter state={streakState} compact />
              <NotificationBell />
            </div>
        </div>

        {/* Streak Shield Widget — shown when user has freeze charges or streak ≥ 5 */}
        {(streakFreezeCount > 0 || currentStreak >= 5) && (
          <WidgetErrorBoundary name="StreakShield">
            <StreakShieldWidget
              currentStreak={currentStreak}
              freezeCount={streakFreezeCount}
              onUseFreeze={async () => {
                const result = await freezeStreakAction();
                if (!result.success) throw new Error(result.error ?? 'Failed');
                toast.success('🛡️ Lá chắn streak đã được dùng!', { description: `Còn lại ${result.freezesRemaining} lá chắn.` });
              }}
            />
          </WidgetErrorBoundary>
        )}


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

            {/* Label — changes based on mode */}
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Star className="size-3.5 fill-current" />
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider group-hover:text-emerald-500 transition-colors">
                {xpCurrent === 0 ? "Mục tiêu hôm nay ⚙️" : "XP hôm nay ⚙️"}
              </span>
            </div>

            {xpCurrent === 0 ? (
              /* ── Opportunity mode: no XP yet today ── */
              <div className="space-y-1.5">
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                  {xpTarget} <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">XP</span>
                </p>
                <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 leading-tight">
                  Học bài đầu tiên →
                </p>
              </div>
            ) : (
              /* ── Progress mode: already earned XP today ── */
              <div className="space-y-1.5">
                <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
                  {xpCurrent}<span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">/{xpTarget}</span>
                </p>
                {/* Mini progress bar — only shown when progress > 0 */}
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(xpPercent, 100)}%` }}
                  />
                </div>
              </div>
            )}
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
              <Link
                href="/roadmap"
                className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-2 hover:border-blue-500/30 transition-colors duration-200 cursor-pointer block"
              >
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
              </Link>
            );
          })()}

          {/* Units completed */}
          <Link
            href="/progress"
            className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-2 hover:border-purple-500/30 transition-colors duration-200 cursor-pointer block"
          >
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <BookOpen className="size-3.5" />
              </span>
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Units</span>
            </div>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">{completedUnits}</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">đã hoàn thành</p>
          </Link>
        </div>

        {/* ── 2b. Weekly active streak calendar ── */}
        {weeklyData && weeklyData.length > 0 && (
          <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Lịch chuỗi học tuần này</p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Luyện tập đều đặn để giữ streak!</span>
            </div>
            <div className="flex justify-between items-center gap-1">
              {weeklyData.map((d, idx) => {
                const isToday = d.day === todayKey;
                const hasLearned = d.xp > 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5">
                    <div className={`relative flex size-8 sm:size-10 items-center justify-center rounded-full border transition-all ${
                      hasLearned
                        ? "bg-gradient-to-br from-orange-500 to-amber-500 border-orange-400 text-white shadow-sm shadow-orange-500/20"
                        : isToday
                          ? "bg-zinc-100 dark:bg-zinc-800 border-emerald-500/50 text-zinc-400 dark:text-zinc-500 ring-2 ring-emerald-500/20"
                          : "bg-zinc-50 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800/60 text-zinc-300 dark:text-zinc-700"
                    }`}>
                      {hasLearned ? (
                        <Flame className="size-4 fill-current animate-pulse text-orange-200" />
                      ) : (
                        <span className="text-xs font-black">·</span>
                      )}
                      {isToday && !hasLearned && (
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>
                    <span className={`text-[10px] font-bold ${
                      isToday ? "text-emerald-600 dark:text-emerald-400 font-black" : "text-zinc-400 dark:text-zinc-500"
                    }`}>
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── 2c. 7-week Streak Calendar Heatmap ── */}
        {calendarData.length > 0 && (
          <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4">
            <StreakCalendar
              dailyXp={calendarData}
              currentStreak={currentStreak}
            />
          </div>
        )}

        {/* ── 2d. CEFR Level Progress Ladder ── */}
        {(() => {
          const levelUnitsAll = allUnits.filter(u => u.level === shortLevel);
          const levelUnitsDone = completedUnitIds.filter(id =>
            allUnits.find(u => u.id === id)?.level === shortLevel
          ).length;
          return (
            <LevelProgressBar
              userLevel={shortLevel}
              levelUnitsDone={levelUnitsDone}
              levelUnitsTotal={levelUnitsAll.length}
            />
          );
        })()}

        {/* ── 3. Placement Test Banner ── */}
        {showPlacementBanner && (
          <div className="relative group">
            <Link
              href="/placement-test"
              className="flex items-center gap-3 p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/30 transition-all duration-200"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-xl shrink-0">🎯</span>
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-0.5">CEFR Placement Test</p>
                <p className="text-sm font-bold text-foreground">Xác Định Trình Độ Chính Xác</p>
                <p className="text-xs text-muted-foreground">40 câu · Reading + Vocab + Language Use · ~20 phút</p>
              </div>
              <ChevronRight className="size-5 text-violet-400/60 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
            <button
              onClick={handleDismissPlacementBanner}
              className="absolute top-3 right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40 transition-colors"
              title="Đóng banner"
            >
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* ── 4. Hero Continue Learning UnitCard (Promoted to Top) ── */}
        <UnitCard currentUnitData={currentUnitData} />

        {/* ── 5. TODAY'S MISSION — Unified daily task hub (replaces "Học nhanh 10 phút") ── */}
        <TodayMission
          currentUnit={{
            title: currentUnitData.title,
            progress: currentUnitData.progress,
            route: currentUnitData.route,
            xp: currentUnitData.xp,
          }}
          dueCardsCount={dueCardsCount}
          xpToday={xpCurrent}
          xpTarget={xpTarget}
          completedQuickWins={quests.filter((q) => q.completed).length}
        />

        {/* ── 6. Daily Quests — promoted above lesson grid ── */}
        <WidgetErrorBoundary name="DailyQuests">
          <DailyQuests
            quests={quests}
            handleToggleQuest={handleToggleQuest}
            completedCount={completedCount}
          />
        </WidgetErrorBoundary>

        {/* ── 7. Bento grid for study plan, progress card, and secondary details ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Study Plan Checklist and EF SET Goal Tracker */}
          <div className="lg:col-span-7 space-y-5">
            <TodayPlanWidget userLevel={shortLevel} />
            <EfSetGoalTracker userLevel={shortLevel} completedUnits={completedUnits} />
          </div>

          {/* Right: SRS review card, Weekly League Card, Word of Day */}
          <div className="lg:col-span-5 space-y-5">
            <WidgetErrorBoundary name="SrsCard">
              <SrsCard dueCardsCount={dueCardsCount} />
            </WidgetErrorBoundary>

            {/* Streak Freeze Card — shown when streak ≥ 3 (worth protecting) or has freezes */}
            {(currentStreak >= 3 || streakFreezeCount > 0) && (
              <WidgetErrorBoundary name="StreakFreezeCard">
                <StreakFreezeCard
                  freezesAvailable={streakFreezeCount}
                  isAtRisk={streakState.status === "at_risk"}
                  onFreezeActivated={() => {
                    void freezeStreakAction();
                  }}
                />
              </WidgetErrorBoundary>
            )}

            <WidgetErrorBoundary name="LeagueCard">
              <LeagueCard />
            </WidgetErrorBoundary>
            {wordOfDay && (
              <WidgetErrorBoundary name="WordOfDay">
                <WordOfDayCard
                  word={wordOfDay.word}
                  phonetic={wordOfDay.phonetic}
                  meaning_vn={wordOfDay.meaning_vn}
                  example_en={wordOfDay.example_en}
                  topic={wordOfDay.topic}
                  level={wordOfDay.level}
                />
              </WidgetErrorBoundary>
            )}

            {/* Push Permission soft-ask — fires after first lesson completion */}
            <PushPermissionCard
              completedLessons={completedUnits}
              showAfterLessons={1}
            />
          </div>
        </div>

        {/* ── 8. Bottom utility sections ── */}
        <Link
          href="/business"
          id="business-track-cta"
          className="flex items-center gap-3 p-4 rounded-2xl border border-blue-500/15 bg-blue-500/3 dark:bg-blue-500/5 hover:bg-blue-500/8 hover:border-blue-500/25 transition-all group"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg">💼</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-zinc-900 dark:text-zinc-50 leading-tight">Business English Track</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">10 bài thiết yếu cho sự nghiệp — email, họp, thuyết trình</p>
          </div>
          <ChevronRight className="size-4 text-blue-400/60 shrink-0 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <WidgetErrorBoundary name="QuickActions">
          <QuickActions currentUnitRoute={currentUnitData.route} />
        </WidgetErrorBoundary>

        {/* ── Speaking Activity Feed ── */}
        {recentSpeakingSessions.length > 0 && (
          <WidgetErrorBoundary name="SpeakingFeed">
            <SpeakingFeedCard sessions={recentSpeakingSessions} />
          </WidgetErrorBoundary>
        )}

        {/* ── Checkpoint Test CTA — appears at 5/10/15/20 unit milestones ── */}
        {[5, 10, 15, 20].includes(completedUnits) && (
          <Link
            href="/placement-test"
            id="checkpoint-test-cta"
            className="flex items-center gap-3 p-4 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-purple-500/5 hover:from-violet-500/10 hover:to-purple-500/10 hover:border-violet-500/30 transition-all group"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-xl shrink-0">🏆</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-0.5">Kiểm tra đột phá!</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Checkpoint Test — {completedUnits} units hoàn thành!
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Đánh giá trình độ của bạn sau {completedUnits} bài học · ~10 phút
              </p>
            </div>
            <Mic className="size-5 text-violet-400/60 group-hover:text-violet-400 group-hover:scale-110 transition-all shrink-0" />
          </Link>
        )}

        <WeeklyRecapCard
          currentStreak={currentStreak}
          totalXp={totalXp}
          completedUnits={completedUnits}
          userLevel={shortLevel}
          dueCardsCount={dueCardsCount}
          weeklyData={weeklyData}
        />

        {/* ── 9. Collapsible Curriculum Progress Grid ── */}
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Tiến độ khoá học</h2>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">{completedUnitIds.length}/{allUnits.length} units</span>
          </div>

          {/* Group by level */}
          {(expandProgressGrid ? ["A0", "A1", "A2", "B1", "B2"] : [shortLevel]).map(level => {
            const levelUnits = allUnits.filter(u => u.level === level);
            const levelDone = levelUnits.filter(u => completedUnitIds.includes(u.id)).length;
            if (levelUnits.length === 0) return null;
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

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-center">
            <button
              onClick={() => setExpandProgressGrid(prev => !prev)}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              {expandProgressGrid ? (
                <>Thu gọn lộ trình</>
              ) : (
                <>Xem toàn bộ lộ trình (A0–B2)</>
              )}
            </button>
          </div>
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

      {/* Streak Broken / Comeback Modal */}
      {!brokenModalDismissed && (
        <StreakBrokenModal
          state={streakState}
          totalXp={totalXp}
          onDismiss={handleBrokenModalDismiss}
          onRepaired={handleBrokenModalDismiss}
        />
      )}
    </div>
  );
}


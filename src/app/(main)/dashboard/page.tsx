import type { Metadata } from "next";
import { getDueCards } from "@/app/actions/cards";
import {
  getUserProgress,
  getWeeklyXpData,
  getDailyActivity,
  getTodayMissionFlags,
} from "@/app/actions/stats";
import { buildDailyMissions } from "@/lib/dashboard/daily-missions";
import {
  getAllUnitCompletionStatuses,
  getCurrentUnit,
} from "@/app/actions/unit";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { UNITS } from "@/lib/constants/units";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import {
  UNIT_A0_1_ACTIVATION_META,
  UNIT_A0_1_ID,
  UNIT_A0_1_WORD_OF_DAY,
  withPilotUnitOverrides,
} from "@/lib/pilot/unit-a0-1-activation";
import DashboardClient from "./components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | AtoEnglish",
  description: "Xem tiến độ học, streak, XP và tiếp tục bài học tiếng Anh của bạn. (Rollback best version + guest self-study)",
};

// P1-1 Fix: ISR 30s — fresh enough for daily dashboard use.
// Eliminates full SSR on every navigation (was causing 200-400ms server latency per visit).
// For real-time streak/XP after lesson completion, UnitTemplate calls router.refresh() directly.
export const revalidate = 30;

const DISPLAY_UNITS = withPilotUnitOverrides(UNITS);

export default async function DashboardPage() {
  // Fetch all data in parallel — single round-trip batch
  const [progressRes, cardsRes, unitRes, speakingRes, bulkRes, weeklyRes, activityRes] =
    await Promise.all([
      getUserProgress(),
      getDueCards(),
      getCurrentUnit(),
      getRecentSpeakingSessions(5),
      getAllUnitCompletionStatuses(),
      getWeeklyXpData(),
      getDailyActivity(),
    ]);

  // Extract speaking sessions for the dashboard feed (narrow practice_type string → union literal)
  const VALID_TYPES = ["shadowing", "roleplay", "journal"] as const;
  type SpeakingPracticeType = typeof VALID_TYPES[number];
  const recentSpeakingSessions = (
    speakingRes.success && speakingRes.sessions ? speakingRes.sessions : []
  )
    .filter((session) => VALID_TYPES.includes(session.practice_type as SpeakingPracticeType))
    .map((session) => ({
      id: session.id,
      practice_type: session.practice_type as SpeakingPracticeType,
      duration: session.duration,
      accuracy_score: session.accuracy_score,
      scenario_id: session.scenario_id,
      created_at: session.created_at,
    }));

  let userName = "Học viên";
  let totalXp = 0;
  let currentStreak = 0;
  let bestStreak = 0;
  let lastActiveDate: string | null = null;
  let userLevel = "A0 Learner";
  let dailyXpGoal = 50;
  let streakFreezeCount = 0;
  const isGuest = !progressRes.success || !progressRes.progress;
  void isGuest;

  if (progressRes.success && progressRes.progress) {
    const progress = progressRes.progress;
    userName = progress.display_name || "Học viên";
    totalXp = progress.total_xp || 0;
    currentStreak = progress.streak || 0;
    bestStreak = (progress as unknown as { best_streak?: number }).best_streak ?? 0;
    lastActiveDate = (progress as unknown as { last_active_date?: string | null }).last_active_date ?? null;
    dailyXpGoal = progress.daily_xp_goal || 50;
    streakFreezeCount = (progress as unknown as { streak_freeze_count?: number }).streak_freeze_count ?? 0;

    const levelNames: Record<string, string> = {
      A0: "A0 Nền tảng",
      A1: "A1 Beginner",
      A2: "A2 Elementary",
      B1: "B1 Intermediate",
      B2: "B2 Upper-Intermediate",
      C1: "C1 Advanced",
    };
    userLevel = levelNames[progress.current_level] || `${progress.current_level} Learner`;
  }

  const dueCardsCount = cardsRes.success && cardsRes.cards ? cardsRes.cards.length : 0;

  const currentUnitData = {
    unitId: UNIT_A0_1_ID,
    title: UNIT_A0_1_ACTIVATION_META.title,
    description: UNIT_A0_1_ACTIVATION_META.description,
    currentPhase: "Bài kích hoạt nói",
    progress: 0,
    completed: false,
    route: UNIT_A0_1_ACTIVATION_META.route,
    tags: UNIT_A0_1_ACTIVATION_META.tags,
    xp: UNIT_A0_1_ACTIVATION_META.xp,
  };

  if (unitRes.success && unitRes.unitId) {
    const displayUnit = DISPLAY_UNITS.find((unit) => unit.id === unitRes.unitId);
    currentUnitData.unitId = unitRes.unitId;
    currentUnitData.title = displayUnit?.title || unitRes.title || "";
    currentUnitData.description = displayUnit?.description || unitRes.description || "";
    currentUnitData.currentPhase =
      unitRes.unitId === UNIT_A0_1_ID
        ? "Bài kích hoạt nói"
        : unitRes.currentPhase || "";
    currentUnitData.progress = unitRes.progress || 0;
    currentUnitData.completed = Boolean(unitRes.completed);
    currentUnitData.route = displayUnit?.route || unitRes.route || "/learn/unit-a0-1";
    currentUnitData.tags = displayUnit?.tags ?? [];
    currentUnitData.xp = displayUnit?.xp ?? 80;
  }

  // Bulk unit completion data — already fetched in parallel above
  const completedMap = bulkRes.completedMap;
  // Derive count from the map — no extra getCompletedUnitsCount() call needed
  const completedUnits = completedMap.size;

  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  let todayXp = 0;

  for (const unit of DISPLAY_UNITS) {
    const entry = completedMap.get(unit.id);
    if (entry?.completedAt) {
      const completedDateStr = new Date(entry.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      if (completedDateStr === todayStr) todayXp += (entry.xpEarned || 80);
    }
  }

  const initialXpCurrent = Math.min(todayXp, dailyXpGoal);

  const missionFlagsRes = await getTodayMissionFlags(currentUnitData.unitId);
  const flags = missionFlagsRes.flags;

  const dailyMissions = buildDailyMissions({
    currentUnit: {
      title: currentUnitData.title,
      progress: currentUnitData.progress,
      route: currentUnitData.route,
      xp: currentUnitData.xp,
    },
    dueCardsCount,
    lessonCompletedToday: flags.lessonCompletedOnCurrentUnit,
    srsReviewedToday: flags.srsReviewedToday,
    quizDoneToday: flags.quizDoneToday,
    speakingDoneToday: flags.speakingDoneToday,
  });

  // Completed unit IDs — for the unit progress grid on dashboard
  const completedUnitIds = DISPLAY_UNITS
    .filter((unit) => completedMap.has(unit.id))
    .map((unit) => unit.id);

  // ── Word of the Day: deterministic by VN date, from current unit vocab ──────
  const allVocab = DISPLAY_UNITS.flatMap((unit) => UNIT_VOCABULARY[unit.id] ?? []);
  const currentUnitVocab = UNIT_VOCABULARY[currentUnitData.unitId] ?? [];
  const vocabPool = currentUnitVocab.length > 0 ? currentUnitVocab : allVocab;
  // P3-6 Fix: Use VN timezone date so word rotates at VN midnight (not UTC midnight = 07:00 VN)
  const vnDateStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  const [vyear, vmonth, vday] = vnDateStr.split("-").map(Number);
  const dayIndex = vyear * 10000 + vmonth * 100 + (vday ?? 0);
  const wordOfDay = currentUnitData.unitId === UNIT_A0_1_ID
    ? UNIT_A0_1_WORD_OF_DAY
    : vocabPool.length > 0
      ? vocabPool[dayIndex % vocabPool.length]
      : null;

  const weeklyData = weeklyRes.success && weeklyRes.data ? weeklyRes.data : [];

  // 49-day calendar data (last 7 weeks) from getDailyActivity
  const calendarData = (activityRes.success && activityRes.days
    ? activityRes.days
    : []
  ).slice(-49).map((day) => ({ date: day.date, xp: day.xp }));

  return (
    <DashboardClient
      userName={userName}
      currentStreak={currentStreak}
      bestStreak={bestStreak}
      lastActiveDate={lastActiveDate}
      totalXp={totalXp}
      userLevel={userLevel}
      completedUnits={completedUnits}
      dueCardsCount={dueCardsCount}
      currentUnitData={currentUnitData}
      initialXpCurrent={initialXpCurrent}
      dailyMissions={dailyMissions}
      dailyXpGoal={dailyXpGoal}
      wordOfDay={wordOfDay}
      completedUnitIds={completedUnitIds}
      streakFreezeCount={streakFreezeCount}
      weeklyData={weeklyData}
      calendarData={calendarData}
      allUnits={DISPLAY_UNITS.map((unit) => ({ id: unit.id, title: unit.title, level: unit.level, route: unit.route, xp: unit.xp }))}
      recentSpeakingSessions={recentSpeakingSessions}
    />
  );
}

import type { Metadata } from "next";
import { getDueCards } from "@/app/actions/cards";
import {
  getUserProgress,
  getCompletedUnitsCount,
  getAllUnitCompletionStatuses,
  getTodayActivitySummary,
  getCurrentUnit,
} from "@/app/actions/progress";
import { resolveDailyXpGoal } from "@/lib/constants/daily-xp-goal";
import { UNITS } from "@/lib/constants/units";

import { getUnitVocabulary } from "@/lib/constants/vocabulary";
import { getVnDayIndex } from "@/lib/utils/vn-date";
import DashboardClient from "./components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Xem tiến độ tự học, review SRS và bài học tiếp theo.",
};

export const revalidate = 0; // Disable server component caching to ensure accurate dashboard data on request

export default async function DashboardPage() {
  // Fetch progress, completion count, cards, and active unit
  const [progressRes, completedRes, cardsRes, unitRes, batchRes, todayRes] =
    await Promise.all([
      getUserProgress(),
      getCompletedUnitsCount(),
      getDueCards(),
      getCurrentUnit(),
      getAllUnitCompletionStatuses(),
      getTodayActivitySummary(),
    ]);

  let userName = "Học viên";
  let totalXp = 0;
  let currentStreak = 0;
  let userLevel = "A0 Foundation"; // Default for new/data-reset users
  let dailyXpGoal = 50;

  if (progressRes.success && progressRes.progress) {
    const p = progressRes.progress;
    userName = p.display_name || "Học viên";
    totalXp = p.total_xp || 0;
    currentStreak = p.streak || 0;
    dailyXpGoal = resolveDailyXpGoal(p.daily_xp_goal);

    const levelNames: Record<string, string> = {
      A0: "A0 Foundation",
      A1: "A1 Beginner",
      A2: "A2 Elementary",
      B1: "B1 Intermediate",
      B2: "B2 Upper-Intermediate",
    };
    userLevel = levelNames[p.current_level] || `${p.current_level} Learner`;
  }

  const completedUnits = completedRes.success ? completedRes.count : 0;
  const dueCardsCount = cardsRes.success && cardsRes.cards ? cardsRes.cards.length : 0;

  const currentUnitData = {
    unitId: "unit-a0-1",
    title: "Unit A0-1: Bảng Chữ Cái & Âm Cơ Bản",
    description: "Bắt đầu từ âm, chữ cái và câu giới thiệu cực ngắn — nền tảng cho toàn bộ hành trình.",
    currentPhase: "Pha 1: Nền tảng A0",
    progress: 0,
    completed: false,
    route: "/learn/unit-a0-1",
    tags: UNITS.find(u => u.id === "unit-a0-1")?.tags ?? [],
    xp: UNITS.find(u => u.id === "unit-a0-1")?.xp ?? 60,
  };

  if (unitRes.success && unitRes.unitId) {
    currentUnitData.unitId = unitRes.unitId;
    currentUnitData.title = unitRes.title || "";
    currentUnitData.description = unitRes.description || "";
    currentUnitData.currentPhase = unitRes.currentPhase || "";
    currentUnitData.progress = unitRes.progress || 0;
    currentUnitData.completed = !!unitRes.completed;
    currentUnitData.route = unitRes.route || "/learn/unit-1";
    currentUnitData.tags = UNITS.find(u => u.id === unitRes.unitId)?.tags ?? [];
    currentUnitData.xp = UNITS.find(u => u.id === unitRes.unitId)?.xp ?? 80;
  }

  const statuses = batchRes.success ? batchRes.statuses : [];
  const todayXp = todayRes.success ? todayRes.totalXp : 0;
  const hasSpeakingToday = todayRes.success ? todayRes.hasSpeakingToday : false;
  const lessonCompletedToday = todayRes.success ? todayRes.lessonCompletedToday : false;
  const hasFlashcardsReviewedToday = todayRes.success
    ? todayRes.hasFlashcardsReviewedToday
    : false;

  const initialXpCurrent = Math.min(todayXp, dailyXpGoal);

  const initialQuests = [
    { id: 1, text: "Hoàn thành 1 bài nền tảng hoặc bài mới", xp: 20, completed: false },
    {
      id: 2,
      text: hasFlashcardsReviewedToday
        ? "Ôn tập thẻ từ vựng SRS (đã xong hôm nay!)"
        : dueCardsCount > 0
          ? `Ôn tập ${dueCardsCount} thẻ từ vựng SRS`
          : "Ôn tập thẻ từ vựng SRS",
      xp: 15,
      completed: hasFlashcardsReviewedToday,
    },
    {
      id: 3,
      text: hasSpeakingToday
        ? "Luyện nói hôm nay (đã hoàn thành!)"
        : "Ghi âm 3 câu ngắn để giữ âm cuối",
      xp: 15,
      completed: hasSpeakingToday,
    },
  ];

  if (lessonCompletedToday) {
    initialQuests[0].completed = true;
  }

  const completedUnitIds = statuses
    .filter((s) => s.success && s.completed)
    .map((s) => s.unitId);

  // ── Word of the Day: deterministic by date, from current unit vocab ────────
  const allVocab = UNITS.flatMap((u) => getUnitVocabulary(u.id));
  const currentUnitVocab = getUnitVocabulary(currentUnitData.unitId);
  const vocabPool = currentUnitVocab.length > 0 ? currentUnitVocab : allVocab;
  const dayIndex = getVnDayIndex();
  const wordOfDay = vocabPool.length > 0
    ? vocabPool[dayIndex % vocabPool.length]
    : null;

  return (
    <DashboardClient
      userName={userName}
      currentStreak={currentStreak}
      totalXp={totalXp}
      userLevel={userLevel}
      completedUnits={completedUnits}
      dueCardsCount={dueCardsCount}
      currentUnitData={currentUnitData}
      initialXpCurrent={initialXpCurrent}
      initialQuests={initialQuests}
      dailyXpGoal={dailyXpGoal}
      wordOfDay={wordOfDay}
      completedUnitIds={completedUnitIds}
      allUnits={UNITS.map(u => ({ id: u.id, title: u.title, level: u.level, route: u.route, xp: u.xp }))}
    />
  );
}

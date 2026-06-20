import type { Metadata } from "next";
import { getDueCards } from "@/app/actions/cards";
import {
  getUserProgress,
  getCompletedUnitsCount,
  getUnitCompletionStatus,
  getCurrentUnit,
} from "@/app/actions/progress";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { UNITS } from "@/lib/constants/units";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import DashboardClient from "./components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Xem tiến độ học, streak, XP và tiếp tục bài học tiếng Anh của bạn.",
};

export const revalidate = 0; // Disable server component caching to ensure accurate dashboard data on request

export default async function DashboardPage() {
  // Fetch progress, completion count, cards, and active unit
  const [progressRes, completedRes, cardsRes, unitRes, speakingRes] =
    await Promise.all([
      getUserProgress(),
      getCompletedUnitsCount(),
      getDueCards(),
      getCurrentUnit(),
      getRecentSpeakingSessions(5),
    ]);

  let userName = "Học viên";
  let totalXp = 0;
  let currentStreak = 0;
  let userLevel = "A1 Beginner"; // Default for new/data-reset users
  let dailyXpGoal = 50;

  if (progressRes.success && progressRes.progress) {
    const p = progressRes.progress;
    userName = p.display_name || "Học viên";
    totalXp = p.total_xp || 0;
    currentStreak = p.streak || 0;
    dailyXpGoal = p.daily_xp_goal || 50;

    const levelNames: Record<string, string> = {
      A1: "A1 Beginner",
      A2: "A2 Elementary",
      B1: "B1 Intermediate",
      B2: "B2 Upper-Intermediate",
      C1: "C1 Advanced",
    };
    userLevel = levelNames[p.current_level] || `${p.current_level} Learner`;
  }

  const completedUnits = completedRes.success ? completedRes.count : 0;
  const dueCardsCount = cardsRes.success && cardsRes.cards ? cardsRes.cards.length : 0;

  const currentUnitData = {
    unitId: "unit-1",
    title: "Unit 1: Greetings & Self-Introduction",
    description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh.",
    currentPhase: "Pha 1: Input",
    progress: 0,
    completed: false,
    route: "/learn/unit-1",
    tags: UNITS.find(u => u.id === "unit-1")?.tags ?? [],
    xp: UNITS.find(u => u.id === "unit-1")?.xp ?? 80,
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

  // Fetch completion status of all units dynamically to compute today's XP
  const statuses = await Promise.all(
    UNITS.map(unit => getUnitCompletionStatus(unit.id))
  );

  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  let todayXp = 0;

  statuses.forEach(status => {
    if (status.success && status.completed && status.completedAt) {
      const completedDateStr = new Date(status.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      if (completedDateStr === todayStr) todayXp += (status.xpEarned || 80);
    }
  });

  // Check if user did any speaking session today
  const hasSpeakingToday = (speakingRes.success && speakingRes.sessions
    ? speakingRes.sessions.some(s => {
        const sessionDate = new Date(s.created_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        return sessionDate === todayStr;
      })
    : false);

  const initialXpCurrent = Math.min(todayXp, dailyXpGoal);

  const initialQuests = [
    { id: 1, text: "Học 1 bài mới (Input & Processing)", xp: 20, completed: false },
    {
      id: 2,
      text: dueCardsCount > 0
        ? `Ôn tập ${dueCardsCount} thẻ từ vựng SRS`
        : "Ôn tập thẻ từ vựng SRS (đã xong hôm nay!)",
      xp: 15,
      completed: dueCardsCount === 0,
    },
    {
      id: 3,
      text: hasSpeakingToday
        ? "Luyện nói hôm nay (đã hoàn thành!)"
        : "Đặt 3 câu thực tế (Output / Speaking)",
      xp: 15,
      completed: hasSpeakingToday,
    },
  ];

  // Resolve active unit completion status from fetched results
  const activeUnitIdx = UNITS.findIndex(u => u.id === currentUnitData.unitId);
  const activeStatusRes = activeUnitIdx !== -1 ? statuses[activeUnitIdx] : null;

  if (activeStatusRes && activeStatusRes.success && activeStatusRes.completed && activeStatusRes.completedAt) {
    const completedDateStr = new Date(activeStatusRes.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    if (completedDateStr === todayStr) initialQuests[0].completed = true;
  }

  // ── Word of the Day: deterministic by date, from current unit vocab ────────
  const allVocab = UNITS.flatMap(u => UNIT_VOCABULARY[u.id] ?? []);
  const currentUnitVocab = UNIT_VOCABULARY[currentUnitData.unitId] ?? [];
  const vocabPool = currentUnitVocab.length > 0 ? currentUnitVocab : allVocab;
  // Stable daily index: rotates vocabulary once per UTC day, no impure Date.now()
  const d = new Date();
  const dayIndex = d.getUTCFullYear() * 1000 + d.getUTCMonth() * 32 + d.getUTCDate();
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
    />
  );
}
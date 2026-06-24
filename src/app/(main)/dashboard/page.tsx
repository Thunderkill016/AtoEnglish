import type { Metadata } from "next";
import { getDueCards } from "@/app/actions/cards";
import { getUserProgress } from "@/app/actions/stats";
import {
  getAllUnitCompletionStatuses,
  getCurrentUnit,
} from "@/app/actions/unit";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { UNITS } from "@/lib/constants/units";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import DashboardClient from "./components/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Xem tiến độ học, streak, XP và tiếp tục bài học tiếng Anh của bạn.",
};

// P1-1 Fix: ISR 30s — fresh enough for daily dashboard use.
// Eliminates full SSR on every navigation (was causing 200-400ms server latency per visit).
// For real-time streak/XP after lesson completion, UnitTemplate calls router.refresh() directly.
export const revalidate = 30;

export default async function DashboardPage() {
  // Fetch all data in parallel — single round-trip batch
  const [progressRes, cardsRes, unitRes, speakingRes, bulkRes] =
    await Promise.all([
      getUserProgress(),
      getDueCards(),
      getCurrentUnit(),
      getRecentSpeakingSessions(5),
      getAllUnitCompletionStatuses(),
    ]);

  let userName = "Học viên";
  let totalXp = 0;
  let currentStreak = 0;
  let userLevel = "A0 Learner"; // Default for new users starting at A0
  let dailyXpGoal = 50;
  let streakFreezeCount = 0;

  if (progressRes.success && progressRes.progress) {
    const p = progressRes.progress;
    userName = p.display_name || "Học viên";
    totalXp = p.total_xp || 0;
    currentStreak = p.streak || 0;
    dailyXpGoal = p.daily_xp_goal || 50;
    // streak_freeze_count added by migration 20260624020000 — cast via unknown
    streakFreezeCount = (p as unknown as { streak_freeze_count?: number }).streak_freeze_count ?? 0;

    const levelNames: Record<string, string> = {
      A0: "A0 Nền tảng",
      A1: "A1 Beginner",
      A2: "A2 Elementary",
      B1: "B1 Intermediate",
      B2: "B2 Upper-Intermediate",
      C1: "C1 Advanced",
    };
    userLevel = levelNames[p.current_level] || `${p.current_level} Learner`;
  }

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

  // Bulk unit completion data — already fetched in parallel above
  const completedMap = bulkRes.completedMap;
  // Derive count from the map — no extra getCompletedUnitsCount() call needed
  const completedUnits = completedMap.size;

  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  let todayXp = 0;

  for (const unit of UNITS) {
    const entry = completedMap.get(unit.id);
    if (entry?.completedAt) {
      const completedDateStr = new Date(entry.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      if (completedDateStr === todayStr) todayXp += (entry.xpEarned || 80);
    }
  }

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

  // Resolve active unit today completion from the map
  const activeEntry = completedMap.get(currentUnitData.unitId);
  if (activeEntry?.completedAt) {
    const completedDateStr = new Date(activeEntry.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    if (completedDateStr === todayStr) initialQuests[0].completed = true;
  }

  // Completed unit IDs — for the unit progress grid on dashboard
  const completedUnitIds = UNITS
    .filter(u => completedMap.has(u.id))
    .map(u => u.id);

  // ── Word of the Day: deterministic by VN date, from current unit vocab ──────
  const allVocab = UNITS.flatMap(u => UNIT_VOCABULARY[u.id] ?? []);
  const currentUnitVocab = UNIT_VOCABULARY[currentUnitData.unitId] ?? [];
  const vocabPool = currentUnitVocab.length > 0 ? currentUnitVocab : allVocab;
  // P3-6 Fix: Use VN timezone date so word rotates at VN midnight (not UTC midnight = 07:00 VN)
  const vnDateStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  const [vyear, vmonth, vday] = vnDateStr.split("-").map(Number);
  const dayIndex = vyear * 10000 + vmonth * 100 + (vday ?? 0);
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
      streakFreezeCount={streakFreezeCount}
      allUnits={UNITS.map(u => ({ id: u.id, title: u.title, level: u.level, route: u.route, xp: u.xp }))}
    />
  );
}
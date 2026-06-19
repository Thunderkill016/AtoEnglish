import { getDueCards } from "@/app/actions/cards";
import {
  getUserProgress,
  getCompletedUnitsCount,
  getUnitCompletionStatus,
  getCurrentUnit,
} from "@/app/actions/progress";
import { UNITS } from "@/lib/constants/units";
import DashboardClient from "./components/DashboardClient";

export const revalidate = 0; // Disable server component caching to ensure accurate dashboard data on request

export default async function DashboardPage() {
  // Fetch progress, completion count, cards, and active unit
  const [progressRes, completedRes, cardsRes, unitRes] =
    await Promise.all([
      getUserProgress(),
      getCompletedUnitsCount(),
      getDueCards(),
      getCurrentUnit(),
    ]);

  let userName = "Học viên";
  let totalXp = 0;
  let currentStreak = 0;
  let userLevel = "A1 Beginner"; // Default for new/data-reset users

  if (progressRes.success && progressRes.progress) {
    const p = progressRes.progress;
    userName = p.display_name || "Học viên";
    totalXp = p.total_xp || 0;
    currentStreak = p.streak || 0;

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
  };

  if (unitRes.success && unitRes.unitId) {
    currentUnitData.unitId = unitRes.unitId;
    currentUnitData.title = unitRes.title || "";
    currentUnitData.description = unitRes.description || "";
    currentUnitData.currentPhase = unitRes.currentPhase || "";
    currentUnitData.progress = unitRes.progress || 0;
    currentUnitData.completed = !!unitRes.completed;
    currentUnitData.route = unitRes.route || "/learn/unit-1";
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
      if (completedDateStr === todayStr) todayXp += 80;
    }
  });

  const initialXpCurrent = Math.min(todayXp, 80);

  const initialQuests = [
    { id: 1, text: "Học 1 bài mới (Input & Processing)", xp: 20, completed: false },
    { id: 2, text: "Ôn tập 10 thẻ từ vựng SRS", xp: 15, completed: false },
    { id: 3, text: "Đặt 3 câu thực tế (Output)", xp: 15, completed: false },
  ];

  // Resolve active unit completion status from fetched results
  const activeUnitIdx = UNITS.findIndex(u => u.id === currentUnitData.unitId);
  const activeStatusRes = activeUnitIdx !== -1 ? statuses[activeUnitIdx] : null;

  if (activeStatusRes && activeStatusRes.success && activeStatusRes.completed && activeStatusRes.completedAt) {
    const completedDateStr = new Date(activeStatusRes.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    if (completedDateStr === todayStr) initialQuests[0].completed = true;
  }

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
    />
  );
}
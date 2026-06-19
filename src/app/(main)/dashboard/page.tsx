import { getDueCards } from "@/app/actions/cards";
import {
  getUserProgress,
  getCompletedUnitsCount,
  getUnitCompletionStatus,
  getCurrentUnit,
} from "@/app/actions/progress";
import DashboardClient from "./components/DashboardClient";

export const revalidate = 0; // Disable server component caching to ensure accurate dashboard data on request

export default async function DashboardPage() {
  // Fetch all base queries in a single parallel round (was previously 2 sequential rounds)
  const [progressRes, completedRes, cardsRes, unitRes, status1Res, status4Res] =
    await Promise.all([
      getUserProgress(),
      getCompletedUnitsCount(),
      getDueCards(),
      getCurrentUnit(),
      getUnitCompletionStatus("unit-1"),
      getUnitCompletionStatus("unit-4"),
    ]);

  let userName = "Học viên";
  let totalXp = 0;
  let currentStreak = 0;
  let userLevel = "B1 Intermediate";

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

  // Resolve active unit completion status — reuse already-fetched results where possible
  const activeUnitId = currentUnitData.unitId;
  let activeStatusRes;
  if (activeUnitId === "unit-1") {
    activeStatusRes = status1Res;
  } else if (activeUnitId === "unit-4") {
    activeStatusRes = status4Res;
  } else {
    // Only fetch if active unit differs from unit-1 and unit-4
    activeStatusRes = await getUnitCompletionStatus(activeUnitId);
  }

  const todayStr = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  let todayXp = 0;

  if (status1Res.success && status1Res.completed && status1Res.completedAt) {
    const completedDateStr = new Date(status1Res.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    if (completedDateStr === todayStr) todayXp += 80;
  }

  if (status4Res.success && status4Res.completed && status4Res.completedAt) {
    const completedDateStr = new Date(status4Res.completedAt).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
    if (completedDateStr === todayStr) todayXp += 80;
  }

  const initialXpCurrent = Math.min(todayXp, 80);

  const initialQuests = [
    { id: 1, text: "Học 1 bài mới (Input & Processing)", xp: 20, completed: false },
    { id: 2, text: "Ôn tập 10 thẻ từ vựng SRS", xp: 15, completed: false },
    { id: 3, text: "Đặt 3 câu thực tế (Output)", xp: 15, completed: false },
  ];

  if (activeStatusRes.success && activeStatusRes.completed && activeStatusRes.completedAt) {
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
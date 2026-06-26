import type { Metadata } from "next";
import { getUserProgress } from "@/app/actions/stats";
import { getCurrentUnit } from "@/app/actions/unit";
import { UNITS } from "@/lib/constants/units";
import DashboardMinimalClient from "./components/DashboardMinimalClient";

export const metadata: Metadata = {
  title: "Học | AtoEnglish",
  description: "Tiếp tục bài học tiếng Anh — một chạm vào Khởi động.",
};

export const revalidate = 30;

export default async function DashboardPage() {
  const [progressRes, unitRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
  ]);

  let userName = "Học viên";
  let currentStreak = 0;

  if (progressRes.success && progressRes.progress) {
    const p = progressRes.progress;
    userName = p.display_name || "Học viên";
    currentStreak = p.streak || 0;
  }

  const currentUnitData = {
    title: "Unit 1: Greetings & Self-Introduction",
    description: "Học cách chào hỏi cơ bản, tự giới thiệu bản thân bằng tiếng Anh.",
    progress: 0,
    route: "/learn/unit-1",
    xp: UNITS.find((u) => u.id === "unit-1")?.xp ?? 80,
  };

  if (unitRes.success && unitRes.unitId) {
    currentUnitData.title = unitRes.title || currentUnitData.title;
    currentUnitData.description = unitRes.description || currentUnitData.description;
    currentUnitData.progress = unitRes.progress || 0;
    currentUnitData.xp = UNITS.find((u) => u.id === unitRes.unitId)?.xp ?? 80;
    // Continue card uses getCurrentUnit (delegates getNextUnitFromProgress)
    // → canonical next full lesson route (no ?mini). Unifies dashboard + roadmap.
    // Reduces confusion: "Học tiếp" always full lesson; /learn = list, /roadmap = overview.
    currentUnitData.route = unitRes.route || currentUnitData.route;
  }

  return (
    <DashboardMinimalClient
      userName={userName}
      currentStreak={currentStreak}
      currentUnitData={currentUnitData}
    />
  );
}
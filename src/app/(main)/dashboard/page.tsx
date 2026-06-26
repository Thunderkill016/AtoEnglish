import type { Metadata } from "next";
import { getUserProgress } from "@/app/actions/stats";
import { getCurrentUnit } from "@/app/actions/unit";
import { UNITS } from "@/lib/constants/units";
import { getNextUnitRoute } from "@/lib/placement/starting-unit";
import { createClient } from "@/lib/supabase/server";
import DashboardMinimalClient from "./components/DashboardMinimalClient";

export const metadata: Metadata = {
  title: "Học | AtoEnglish",
  description: "Tiếp tục bài học tiếng Anh — một chạm vào Khởi động.",
};

export const revalidate = 30;

export default async function DashboardPage() {
  const supabase = await createClient();
  const [progressRes, unitRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
  ]);

  let userName = "Học viên";
  let currentStreak = 0;
  let startingUnitIndex = 0;
  let completedUnitIds: string[] = [];

  if (progressRes.success && progressRes.progress) {
    const p = progressRes.progress;
    userName = p.display_name || "Học viên";
    currentStreak = p.streak || 0;
    startingUnitIndex = p.starting_unit_index ?? 0;
  }

  // Fetch completed to compute canonical next via getNextUnitRoute for ContinueCard (full lesson)
  if (progressRes.success && progressRes.progress) {
    const { data: user } = await supabase.auth.getUser();
    if (user.user) {
      const { data: lessons } = await supabase
        .from("user_lesson_progress")
        .select("unit_id")
        .eq("user_id", user.user.id);
      completedUnitIds = (lessons || []).map((l: { unit_id: string }) => l.unit_id);
    }
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
  }

  // Continue card → getNextUnitRoute full lesson (TASK-056); reduces learn/roadmap path confusion
  currentUnitData.route = getNextUnitRoute(completedUnitIds, startingUnitIndex);

  return (
    <DashboardMinimalClient
      userName={userName}
      currentStreak={currentStreak}
      currentUnitData={currentUnitData}
    />
  );
}
import type { Metadata } from "next";
import { getUserProgress } from "@/app/actions/progress";
import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/constants/units";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình học",
  description: "Bản đồ lộ trình A1 → C1 cá nhân hóa. Xem tiến độ và chinh phục từng chặng CEFR.",
  robots: { index: false },
};

export default async function RoadmapPage() {
  const supabase = await createClient();
  const [progressRes, { data: { user } }] = await Promise.all([
    getUserProgress(),
    supabase.auth.getUser(),
  ]);

  const userCefrLevel =
    progressRes.success && progressRes.progress?.current_level
      ? progressRes.progress.current_level
      : "A1";

  // Per-level unit counts from actual UNITS constants
  const unitCountByLevel: Record<string, number> = {};
  for (const u of UNITS) {
    unitCountByLevel[u.level] = (unitCountByLevel[u.level] ?? 0) + 1;
  }

  // Per-level completed counts from DB
  const completedByLevel: Record<string, number> = {};
  if (user) {
    const { data: completedLessons } = await supabase
      .from("user_lesson_progress")
      .select("unit_id")
      .eq("user_id", user.id);

    if (completedLessons) {
      for (const row of completedLessons) {
        const unit = UNITS.find(u => u.id === row.unit_id);
        if (unit) {
          completedByLevel[unit.level] = (completedByLevel[unit.level] ?? 0) + 1;
        }
      }
    }
  }

  return (
    <main id="main-content">
      <RoadmapClient
        userCefrLevel={userCefrLevel}
        unitCountByLevel={unitCountByLevel}
        completedByLevel={completedByLevel}
      />
    </main>
  );
}
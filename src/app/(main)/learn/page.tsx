import type { Metadata } from "next";
import { getUserProgress, getCurrentUnit } from "@/app/actions/progress";
import { UNITS } from "@/lib/constants/units";
import { getUnitVocabulary } from "@/lib/constants/vocabulary";
import LearnClient from "./components/LearnClient";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bài học | AtoEnglish",
  description:
    "Học tiếng Anh theo lộ trình 12 tháng: 4 phases từ A0 đến B1+ Tech English.",
};

export const revalidate = 0;

export default async function LearnPage() {
  const [progressRes, activeUnitRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
  ]);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userLevel = "A0";
  if (progressRes.success && progressRes.progress) {
    userLevel = progressRes.progress.current_level || "A0";
  }

  // Get completed unit IDs from DB
  const completedUnitIds: string[] = [];
  if (user) {
    const { data: completedLessons } = await supabase
      .from("user_lesson_progress")
      .select("unit_id")
      .eq("user_id", user.id);

    if (completedLessons) {
      completedLessons.forEach((l) => completedUnitIds.push(l.unit_id));
    }
  }

  // Build unit status list
  const unitStatuses = UNITS.map((unit) => {
    const vocab = getUnitVocabulary(unit.id);
    const isCompleted = completedUnitIds.includes(unit.id);
    return {
      id: unit.id,
      title: unit.title,
      description: unit.description,
      level: unit.level,
      route: unit.route,
      xp: unit.xp,
      estimatedTime: unit.estimatedTime,
      completed: isCompleted,
      progress: isCompleted ? 100 : 0,
      vocabCount: vocab.length,
    };
  });

  const activeUnitId =
    activeUnitRes.success && activeUnitRes.unitId
      ? activeUnitRes.unitId
      : "unit-a0-1";

  return (
    <main id="main-content">
      <LearnClient
        userLevel={userLevel}
        completedUnitIds={completedUnitIds}
        activeUnitId={activeUnitId}
        unitStatuses={unitStatuses}
      />
    </main>
  );
}

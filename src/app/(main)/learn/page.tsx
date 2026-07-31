import type { Metadata } from "next";
import { getUserProgress } from "@/app/actions/stats";
import { getCurrentUnit } from "@/app/actions/unit";
import { UNITS } from "@/lib/constants/units";
import { createClient } from "@/lib/supabase/server";
import LearnClient from "./components/LearnClient";

export const metadata: Metadata = {
  title: "Bài A0 | AtoEnglish",
  description: "Lộ trình A0 tối giản cho người Việt mới bắt đầu học tiếng Anh.",
};

export const revalidate = 0;

const PILOT_UNITS = UNITS.slice(0, 6);

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [progressRes, activeUnitRes, completedLessonsRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
    user
      ? supabase
          .from("user_lesson_progress")
          .select("unit_id, xp_earned")
          .eq("user_id", user.id)
          .in(
            "unit_id",
            PILOT_UNITS.map((unit) => unit.id),
          )
      : Promise.resolve({ data: null }),
  ]);

  const completedLessons = completedLessonsRes.data ?? [];
  const completedUnitIds = completedLessons.map((lesson) => lesson.unit_id);
  const completedXp = new Map(
    completedLessons.map((lesson) => [lesson.unit_id, lesson.xp_earned || 0]),
  );
  const firstIncomplete = PILOT_UNITS.find(
    (unit) => !completedUnitIds.includes(unit.id),
  );
  const activeUnitId =
    PILOT_UNITS.some((unit) => unit.id === activeUnitRes.unitId) &&
    !completedUnitIds.includes(activeUnitRes.unitId || "")
      ? activeUnitRes.unitId!
      : firstIncomplete?.id || PILOT_UNITS[0].id;

  return (
    <LearnClient
      userLevel={progressRes.success ? progressRes.progress?.current_level || "A0" : "A0"}
      totalXp={progressRes.success ? progressRes.progress?.total_xp || 0 : 0}
      completedUnitIds={completedUnitIds}
      activeUnitId={activeUnitId}
      isGuest={!user}
      unitStatuses={PILOT_UNITS.map((unit) => {
        const xpEarned = completedXp.get(unit.id) ?? 0;
        const completed = completedUnitIds.includes(unit.id);

        return {
          ...unit,
          completed,
          progress: completed ? 100 : unit.id === activeUnitId ? activeUnitRes.progress || 0 : 0,
          starCount: completed
            ? xpEarned >= unit.xp
              ? 3
              : xpEarned >= Math.round(unit.xp * 0.82)
                ? 2
                : 1
            : 0,
        };
      })}
    />
  );
}

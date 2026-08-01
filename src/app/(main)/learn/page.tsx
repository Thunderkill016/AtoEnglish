import type { Metadata } from "next";

import { getUserProgress } from "@/app/actions/stats";
import { getCurrentUnit } from "@/app/actions/unit";
import { UNITS } from "@/lib/constants/units";
import { PILOT_LESSON_SPECS } from "@/lib/lessons/pilot-lessons";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";
import { selectDueTransferVariant } from "@/lib/missions/mission-evaluator";
import { createClient } from "@/lib/supabase/server";
import LearnClient from "./components/LearnClient";

export const metadata: Metadata = {
  title: "Bài A0 | AtoEnglish",
  description: "Lộ trình A0 tối giản cho người Việt mới bắt đầu học tiếng Anh.",
};

export const revalidate = 0;

const PILOT_UNITS = UNITS.slice(0, 6).map((unit) => {
  const lesson = PILOT_LESSON_SPECS[unit.id];
  return lesson
    ? {
        ...unit,
        title: lesson.title,
        description: lesson.description,
        estimatedTime: lesson.estimatedTime,
      }
    : unit;
});

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    progressRes,
    activeUnitRes,
    completedLessonsRes,
    transferAttemptsRes,
  ] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
    user
      ? supabase
          .from("user_lesson_progress")
          .select("unit_id, xp_earned, completed_at")
          .eq("user_id", user.id)
          .in(
            "unit_id",
            PILOT_UNITS.map((unit) => unit.id),
          )
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("learning_attempts")
          .select("activity_id, score")
          .eq("user_id", user.id)
          .eq("lesson_id", GOLD_MISSION_01.lessonId)
          .like(
            "activity_id",
            `${GOLD_MISSION_01.lessonId}:transfer:%`,
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

  const missionCompletion = completedLessons.find(
    (lesson) => lesson.unit_id === GOLD_MISSION_01.lessonId,
  );
  const transferEvidence = new Map<
    string,
    { attemptCount: number; bestScore: number }
  >();
  for (const attempt of transferAttemptsRes.data ?? []) {
    const current = transferEvidence.get(attempt.activity_id) ?? {
      attemptCount: 0,
      bestScore: 0,
    };
    transferEvidence.set(attempt.activity_id, {
      attemptCount: current.attemptCount + 1,
      bestScore: Math.max(current.bestScore, attempt.score ?? 0),
    });
  }

  const dueVariant = missionCompletion
    ? selectDueTransferVariant(
        GOLD_MISSION_01,
        new Date(missionCompletion.completed_at),
        new Date(),
      )
    : null;
  const dueActivityId = dueVariant
    ? `${GOLD_MISSION_01.lessonId}:transfer:${dueVariant.id}`
    : null;
  const dueEvidence = dueActivityId
    ? transferEvidence.get(dueActivityId)
    : undefined;
  const transferVerified = Boolean(
    dueEvidence &&
      dueEvidence.attemptCount >= 2 &&
      dueEvidence.bestScore >=
        GOLD_MISSION_01.evaluation.requiredIntentPassRatio * 100,
  );
  const dueTransfer =
    dueVariant && !transferVerified
      ? {
          id: dueVariant.id,
          label: `Kiểm tra lại sau ${dueVariant.dueAfterDays} ngày`,
          description: dueVariant.scenarioVi,
          href: `/learn/${GOLD_MISSION_01.lessonId}/transfer/${dueVariant.id}`,
        }
      : null;

  return (
    <LearnClient
      userLevel={
        progressRes.success ? progressRes.progress?.current_level || "A0" : "A0"
      }
      totalXp={progressRes.success ? progressRes.progress?.total_xp || 0 : 0}
      completedUnitIds={completedUnitIds}
      activeUnitId={activeUnitId}
      isGuest={!user}
      dueTransfer={dueTransfer}
      unitStatuses={PILOT_UNITS.map((unit) => {
        const xpEarned = completedXp.get(unit.id) ?? 0;
        const completed = completedUnitIds.includes(unit.id);

        return {
          ...unit,
          completed,
          progress:
            completed
              ? 100
              : unit.id === activeUnitId
                ? activeUnitRes.progress || 0
                : 0,
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

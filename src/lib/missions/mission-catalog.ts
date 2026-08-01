import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";
import { GOLD_MISSION_02 } from "@/lib/missions/gold-mission-02";
import { GOLD_MISSION_03 } from "@/lib/missions/gold-mission-03";
import { GOLD_MISSION_04 } from "@/lib/missions/gold-mission-04";
import { GOLD_MISSION_05 } from "@/lib/missions/gold-mission-05";
import { GOLD_MISSION_06 } from "@/lib/missions/gold-mission-06";
import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const PILOT_MISSIONS = [
  GOLD_MISSION_01,
  GOLD_MISSION_02,
  GOLD_MISSION_03,
  GOLD_MISSION_04,
  GOLD_MISSION_05,
  GOLD_MISSION_06,
] as const satisfies readonly MissionSpecV1[];

export const MISSION_BY_LESSON_ID = Object.fromEntries(
  PILOT_MISSIONS.map((mission) => [mission.lessonId, mission]),
) as Record<string, MissionSpecV1>;

export const MISSION_LESSON_IDS = PILOT_MISSIONS.map(
  (mission) => mission.lessonId,
);

export function getMissionForLesson(lessonId: string) {
  return MISSION_BY_LESSON_ID[lessonId] ?? null;
}

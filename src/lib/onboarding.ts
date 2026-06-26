import {
  getPlacementLearnPath,
  getStartingUnitIndex,
  getStartingUnitSlug,
  normalizePlacementLevel,
  type PlacementCefrLevel,
} from "@/lib/placement/starting-unit";

/** Onboarding quiz answer → first CEFR band for unit selection */
const QUIZ_TO_CEFR: Record<string, PlacementCefrLevel> = {
  "A0-A1": "A0",
  A2: "A2",
  B1: "B1",
  "B2+": "B2",
};

/** Map onboarding quiz level to the first unit slug in the curriculum */
export function getFirstUnitSlug(quizLevel: string): string {
  const cefr = QUIZ_TO_CEFR[quizLevel] ?? "A0";
  return getStartingUnitSlug(cefr);
}

/** Redirect path for new users after onboarding — micro-session for fast first win */
export function getOnboardingRedirectPath(
  quizLevel: string,
  _time?: string,
): string {
  const cefr = QUIZ_TO_CEFR[quizLevel] ?? "A0";
  return getPlacementLearnPath(cefr, true);
}

/** Map onboarding quiz level to stored CEFR level in user_progress */
export function mapQuizLevelToCefr(quizLevel: string): PlacementCefrLevel {
  return QUIZ_TO_CEFR[quizLevel] ?? "A0";
}

/** Starting index in UNITS[] for onboarding / placement level */
export function getOnboardingStartingUnitIndex(quizLevel: string): number {
  return getStartingUnitIndex(mapQuizLevelToCefr(quizLevel));
}

export { normalizePlacementLevel, getStartingUnitIndex, getStartingUnitSlug };
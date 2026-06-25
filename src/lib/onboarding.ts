import { UNITS } from "@/lib/constants/units";

/** Onboarding quiz answer → first CEFR band for unit selection */
const QUIZ_TO_CEFR: Record<string, string> = {
  "A0-A1": "A0",
  A2: "A2",
  B1: "B1",
  "B2+": "B2",
};

/** Map onboarding quiz level to the first unit slug in the curriculum */
export function getFirstUnitSlug(quizLevel: string): string {
  const cefr = QUIZ_TO_CEFR[quizLevel] ?? "A0";
  const first = UNITS.find((u) => u.level === cefr);
  return first?.id ?? "unit-a0-1";
}

/** Redirect path for new users after onboarding — micro-session for fast first win */
export function getOnboardingRedirectPath(
  quizLevel: string,
  _time?: string
): string {
  const slug = getFirstUnitSlug(quizLevel);
  return `/learn/${slug}?mini=1`;
}

/** Map onboarding quiz level to stored CEFR level in user_progress */
export function mapQuizLevelToCefr(
  quizLevel: string
): "A0" | "A1" | "A2" | "B1" | "B2" {
  const map: Record<string, "A0" | "A1" | "A2" | "B1" | "B2"> = {
    "A0-A1": "A0",
    A2: "A2",
    B1: "B1",
    "B2+": "B2",
  };
  return map[quizLevel] ?? "A0";
}
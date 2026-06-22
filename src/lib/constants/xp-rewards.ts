/** XP awarded per speaking practice type (keep in sync with saveSpeakingSession). */
export const SPEAKING_XP_BY_TYPE = {
  shadowing: 5,
  roleplay: 8,
  journal: 5,
} as const;

export type SpeakingPracticeType = keyof typeof SPEAKING_XP_BY_TYPE;

export function getSpeakingXp(practiceType: string): number {
  return SPEAKING_XP_BY_TYPE[practiceType as SpeakingPracticeType] ?? 5;
}

/** Quiz XP scale: ≥80% → 15 | 50–79% → 10 | <50% → 5 */
export function getQuizXp(percent: number): number {
  if (percent >= 80) return 15;
  if (percent >= 50) return 10;
  return 5;
}
/**
 * XP awarded per speaking practice type (used in progress stats + session save).
 * Single source of truth — do not redefine inline.
 */
export const SPEAKING_XP: Readonly<Record<string, number>> = {
  shadowing: 5,
  roleplay: 8,
  journal: 5,
} as const;

export function speakingXpFor(practiceType: string): number {
  return SPEAKING_XP[practiceType] ?? 5;
}

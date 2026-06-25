/** XP scale: ≥80% → 15 XP | 50-79% → 10 XP | <50% → 5 XP */
export function quizXpFromPct(pct: number): number {
  return pct >= 80 ? 15 : pct >= 50 ? 10 : 5;
}
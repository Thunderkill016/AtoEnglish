/**
 * Calculate pronunciation accuracy score comparing target text vs spoken text.
 * Uses word-level fuzzy matching (word overlap ratio).
 * @returns Score 0–100 (percentage of target words found in spoken text)
 */
export function calcSpeechScore(target: string, spoken: string): number {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const targetWords = clean(target);
  const spokenWords = clean(spoken);

  if (targetWords.length === 0) return 100;

  const matches = targetWords.filter((w) => spokenWords.includes(w)).length;
  return Math.round((matches / targetWords.length) * 100);
}

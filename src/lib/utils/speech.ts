/**
 * Compare an ASR transcript with a target sentence.
 * This measures word coverage in text. It is not a pronunciation assessment.
 */
export function calcTranscriptMatchScore(target: string, spoken: string): number {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z\s]/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const targetWords = clean(target);
  const spokenWords = clean(spoken);

  if (targetWords.length === 0) return 0;

  const matches = targetWords.filter((w) => spokenWords.includes(w)).length;
  return Math.round((matches / targetWords.length) * 100);
}

/** @deprecated Use calcTranscriptMatchScore and label the result as transcript match. */
export const calcSpeechScore = calcTranscriptMatchScore;

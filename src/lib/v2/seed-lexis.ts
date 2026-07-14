/**
 * Map v2 LessonSpec lexis + target phrases → FSRS card seed rows.
 * TASK-280 lexis; TASK-314 phrases + lessonToSeedVocab.
 * Pure — safe for unit tests and client/server.
 */

import type { FluencyItem, LexisItem, LessonSpec } from "@/lib/v2/lesson-spec";

/** Max items per seed call — matches SeedVocabSchema. */
export const V2_SEED_LEXIS_MAX = 30;

export interface SeedLexisItem {
  word: string;
  phonetic: string | null;
  meaning_vn: string;
  example_en: string | null;
  /** Origin for debugging / UI badges */
  source?: "lexis" | "phrase";
}

export type LessonSeedSource = Pick<LessonSpec, "lexis" | "fluency">;

/**
 * Convert lesson lexis to upsert-ready vocab rows.
 * Dedupes by lowercased word; trims; caps at V2_SEED_LEXIS_MAX.
 */
export function lexisToSeedVocab(
  lexis: readonly LexisItem[],
  max: number = V2_SEED_LEXIS_MAX,
): SeedLexisItem[] {
  const seen = new Set<string>();
  const out: SeedLexisItem[] = [];

  for (const item of lexis) {
    const word = item.word.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      word,
      phonetic: item.phonetic?.trim() ? item.phonetic.trim() : null,
      meaning_vn: item.meaning_vi.trim(),
      example_en: item.example_en?.trim() ? item.example_en.trim() : null,
      source: "lexis",
    });
    if (out.length >= max) break;
  }

  return out;
}

/**
 * Convert fluency target phrases to seed rows (word = full phrase EN).
 * Dedupes by lowercased en; trims; caps at max.
 */
export function phrasesToSeedVocab(
  phrases: readonly FluencyItem[],
  max: number = V2_SEED_LEXIS_MAX,
): SeedLexisItem[] {
  const seen = new Set<string>();
  const out: SeedLexisItem[] = [];

  for (const item of phrases) {
    const word = item.en.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      word,
      phonetic: null,
      meaning_vn: item.vi.trim(),
      example_en: word,
      source: "phrase",
    });
    if (out.length >= max) break;
  }

  return out;
}

/**
 * Merge seed rows with lexis-first priority, then phrases; dedupe by lowercased word.
 */
export function mergeSeedVocab(
  parts: readonly (readonly SeedLexisItem[])[],
  max: number = V2_SEED_LEXIS_MAX,
): SeedLexisItem[] {
  const seen = new Set<string>();
  const out: SeedLexisItem[] = [];

  for (const group of parts) {
    for (const item of group) {
      const word = item.word.trim();
      if (!word) continue;
      const key = word.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        word,
        phonetic: item.phonetic,
        meaning_vn: item.meaning_vn.trim(),
        example_en: item.example_en,
        source: item.source,
      });
      if (out.length >= max) return out;
    }
  }

  return out;
}

/**
 * Full lesson seed: lexis first (higher priority), then fluency target phrases.
 */
export function lessonToSeedVocab(
  lesson: LessonSeedSource,
  max: number = V2_SEED_LEXIS_MAX,
): SeedLexisItem[] {
  return mergeSeedVocab(
    [
      lexisToSeedVocab(lesson.lexis, max),
      phrasesToSeedVocab(lesson.fluency.items, max),
    ],
    max,
  );
}

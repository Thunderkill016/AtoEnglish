/**
 * Map v2 LessonSpec lexis → FSRS card seed rows (TASK-280).
 * Pure — safe for unit tests and client/server.
 */

import type { LexisItem } from "@/lib/v2/lesson-spec";

/** Max items per seed call — matches SeedVocabSchema. */
export const V2_SEED_LEXIS_MAX = 30;

export interface SeedLexisItem {
  word: string;
  phonetic: string | null;
  meaning_vn: string;
  example_en: string | null;
}

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
    });
    if (out.length >= max) break;
  }

  return out;
}

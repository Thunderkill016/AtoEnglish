"use server";

import { saveCardToSRS } from "@/app/actions/cards";
import type { PreWatchVocab } from "@/types/real-talk";

export interface SaveRealTalkVocabParams {
  vocab: PreWatchVocab;
  videoTitle: string;
  level?: "A0" | "A1" | "A2" | "B1" | "B2" | "C1";
}

/**
 * Saves a vocabulary item learned from a Real Talk video lesson directly into
 * the user's FSRS Flashcards SRS queue.
 */
export async function saveRealTalkVocabToSRS(params: SaveRealTalkVocabParams) {
  try {
    const { vocab, videoTitle, level = "A1" } = params;

    const result = await saveCardToSRS({
      word: vocab.word,
      phonetic: vocab.phonetic,
      meaning_vn: vocab.meaningVi,
      example_en: vocab.contextSentence,
      topic: `Real Talk: ${videoTitle.slice(0, 30)}`,
      level,
    });

    return result;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Lỗi khi lưu từ vựng từ Real Talk: ${msg}`,
    };
  }
}

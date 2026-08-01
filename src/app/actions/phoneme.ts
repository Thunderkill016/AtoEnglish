"use server";

import { unavailableFeedback } from "@/lib/lessons/lesson-spec";

export interface PhonemeError {
  word: string;           // The word with the error
  ipa_target: string;     // Correct IPA for Vietnamese learners to aim for
  common_mistake_vn: string; // What Vietnamese speakers typically say instead
  tip_vn: string;         // Concrete practice tip in Vietnamese
}

export interface PhonemeResult {
  score: number;
  matched: boolean;
  phoneme_errors: PhonemeError[];
  praise_vn: string;      // Positive feedback in Vietnamese
  overall_tip_vn: string; // One overall improvement tip in Vietnamese
}

/**
 * Pronunciation scoring is disabled until it is calibrated against expert raters.
 * An ASR transcript cannot provide phoneme-level evidence by itself.
 */
export async function assessPronunciation(params: {
  target: string;
  spoken: string;
}) {
  void params;
  const feedback = unavailableFeedback(
    "pronunciation-calibration-gate",
    "1.0.0",
    "Chưa thể chấm phát âm đáng tin cậy. Bạn vẫn có thể nghe mẫu và tự luyện.",
  );

  return {
    success: false as const,
    error: feedback.errors[0].messageVi,
    feedback,
  };
}

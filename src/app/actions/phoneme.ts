"use server";

import { unavailableFeedback } from "@/lib/lessons/lesson-spec";

export interface PhonemeError {
  word: string;
  ipa_target: string;
  common_mistake_vn: string;
  tip_vn: string;
}

export interface PhonemeResult {
  score: number;
  matched: boolean;
  phoneme_errors: PhonemeError[];
  praise_vn: string;
  overall_tip_vn: string;
}

export type AssessPronunciationResponse =
  | {
      success: true;
      result: PhonemeResult;
      error: null;
    }
  | {
      success: false;
      result: null;
      error: string;
      feedback: ReturnType<typeof unavailableFeedback>;
    };

/**
 * Pronunciation scoring is disabled until it is calibrated against expert raters.
 * An ASR transcript cannot provide phoneme-level evidence by itself.
 */
export async function assessPronunciation(params: {
  target: string;
  spoken: string;
}): Promise<AssessPronunciationResponse> {
  void params;
  const feedback = unavailableFeedback(
    "pronunciation-calibration-gate",
    "1.0.0",
    "Chưa thể chấm phát âm đáng tin cậy. Bạn vẫn có thể nghe mẫu và tự luyện.",
  );

  return {
    success: false,
    result: null,
    error: feedback.errors[0].messageVi,
    feedback,
  };
}

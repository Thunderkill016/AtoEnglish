export type PronunciationSensorCalibration = "unvalidated";

export type PhoneAlignmentKind =
  | "match"
  | "substitution"
  | "deletion"
  | "insertion";

export type PhoneAlignment = {
  kind: PhoneAlignmentKind;
  expected: string | null;
  observed: string | null;
};

export type LocalPhonemeRuntime = {
  device: "webgpu" | "wasm";
  dtype: "q4f16" | "q8";
};

export type LocalPhoneCandidate = {
  phone: string;
  /** Real posterior probability from the CTC model; top-k is not renormalized. */
  probability: number;
};

export type LocalObservedPhone = {
  candidates: LocalPhoneCandidate[];
  startMs: number;
  endMs: number;
  source: string | null;
};

export type LocalCtcPosteriorSummary = {
  frameCount: number;
  vocabularySize: number;
  blankTokenId: number;
  meanEntropy: number;
  normalizedMeanEntropy: number;
  meanPeakPosterior: number;
  meanTop2Margin: number;
  meanBlankPosterior: number | null;
};

export type LocalPhonemeObservation = {
  calibration: PronunciationSensorCalibration;
  model: {
    id: string;
    revision: string;
    runtime: LocalPhonemeRuntime;
  };
  target: {
    word: string;
    ipa: string;
  };
  expectedPhones: string[];
  observedPhones: string[];
  /**
   * V2 CTC evidence. Optional only while the old top-1 preview is being
   * replaced; BrowserPhonemeRecognizer itself requires these fields.
   */
  phoneEvidence?: LocalObservedPhone[];
  posterior?: LocalCtcPosteriorSummary;
  alignment: PhoneAlignment[];
};

export type PhonemeWorkerProgress = {
  status: string;
  file: string | null;
  progress: number | null;
};

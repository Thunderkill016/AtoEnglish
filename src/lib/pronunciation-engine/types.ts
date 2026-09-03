export type PronunciationCalibrationState =
  | "unvalidated"
  | "calibrating"
  | "validated";

export type PronunciationDecision = "evidence" | "feedback" | "abstain";

export type PhoneCandidate = {
  phone: string;
  /**
   * Calibrated probability when a sensor exposes one. Null means the sensor
   * supplied only a rank/order and the engine must not pretend it is a
   * probability.
   */
  probability: number | null;
};

export type ObservedPhone = {
  candidates: readonly PhoneCandidate[];
  startMs?: number | null;
  endMs?: number | null;
  source?: string | null;
};

export type CanonicalPronunciation = {
  id: string;
  phones: readonly string[];
  /** Optional lexical stress pattern, e.g. [1, 0] for a two-syllable word. */
  stress?: readonly number[] | null;
};

export type PhoneAlignmentKind =
  | "match"
  | "substitution"
  | "deletion"
  | "insertion";

export type ArticulatoryDelta = {
  majorClass?: {
    expected: "consonant" | "vowel";
    observed: "consonant" | "vowel";
  } | null;
  place?: { expected: string; observed: string } | null;
  manner?: { expected: string; observed: string } | null;
  voicing?: { expected: boolean; observed: boolean } | null;
  vowelHeight?: { expected: number; observed: number } | null;
  vowelBackness?: { expected: number; observed: number } | null;
  rounded?: { expected: boolean; observed: boolean } | null;
  rhotic?: { expected: boolean; observed: boolean } | null;
  length?: { expected: number; observed: number } | null;
};

export type PhoneAlignmentEvidence = {
  kind: PhoneAlignmentKind;
  expected: string | null;
  observed: string | null;
  /** 0 = acoustically/phonologically identical, 1 = maximally different. */
  cost: number;
  /** Probability assigned to the selected observed phone, if truly available. */
  observedProbability: number | null;
  /** Top-1 minus top-2 posterior margin, if probabilities are available. */
  posteriorMargin: number | null;
  articulatoryDelta: ArticulatoryDelta | null;
};

export type PronunciationAlignmentResult = {
  pronunciationId: string;
  totalCost: number;
  normalizedCost: number;
  alignment: PhoneAlignmentEvidence[];
};

export type UncalibratedSegmentalEvidence = {
  calibration: "unvalidated";
  selectedPronunciationId: string;
  /** Research-only signal. Never display as a learner-facing score. */
  rawAccuracySignal: number;
  /** Research-only completeness signal based on canonical phone retention. */
  rawCompletenessSignal: number;
  /** Mean confidence margin is useful globally but can hide one weak phone. */
  meanPosteriorMargin: number | null;
  /** Weakest available phone margin; used by conservative abstention gates. */
  minimumPosteriorMargin: number | null;
  deletionCount: number;
  insertionCount: number;
  substitutionCount: number;
  alignment: PhoneAlignmentEvidence[];
};

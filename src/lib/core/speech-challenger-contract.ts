import type { AcousticDiagnosticPayload, PhonemeAlignmentDetail } from "./diagnostics";
import {
  type CoreObservation,
  type ObservationContext,
  canAffectDurableAssessment,
  canBecomeMasteryCandidate,
} from "./observation";

export type SpeechChallengerModelFingerprint = {
  artifact_id: string;
  version: string;
  sha256: string;
  configuration_id: string;
  fingerprint_scope:
    | "package-configuration-only"
    | "package-configuration-plus-checkpoint-bytes"
    | "synthetic-mock-identity";
  checkpoint_sha256: string | null;
};

export type SpeechChallengerRuntimeFingerprint = {
  runtime: string;
  python_version: string;
  sha256: string;
  hardware_tier: string;
  packages: Record<string, string>;
  code_sha256: string;
};

export type SpeechChallengerPhone = {
  expected: string | null;
  heard: string | null;
  confidence: number | null;
};

export type SpeechChallengerWordError = {
  word: string;
  expected: string | null;
  actual: string | null;
  confidence: number | null;
  phones?: SpeechChallengerPhone[];
};

export type SpeechChallengerProsody = {
  f0_mean: number | null;
  f0_std: number | null;
  energy_mean: number | null;
  energy_std: number | null;
};

export type SpeechChallengerResult = {
  provider: {
    name: string;
    version: string;
  };
  model_fingerprint: SpeechChallengerModelFingerprint;
  runtime_fingerprint: SpeechChallengerRuntimeFingerprint;
  execution_status: "completed" | "unavailable";
  evaluation_status: "not_evaluated" | "synthetic_mock_only";
  error_code?: string | null;
  latency_ms: number;
  acoustic_distance: number | null;
  phoneme_error_rate: number | null;
  word_error_rate: number | null;
  errors: SpeechChallengerWordError[];
  prosody_summary: SpeechChallengerProsody;
};

/**
 * Validates that an incoming speech challenger diagnostic record satisfies
 * Nếp epistemic and privacy invariants before ingestion.
 */
export function validateChallengerDiagnosticIntegrity(record: unknown): record is SpeechChallengerResult {
  if (!record || typeof record !== "object") return false;
  const candidate = record as Record<string, unknown>;

  // Strict privacy invariant: reject if raw transcript, raw score, or raw vectors leaked
  const serialized = JSON.stringify(record);
  if (
    "score" in candidate ||
    "candidate_score" in candidate ||
    "transcribe" in candidate ||
    serialized.includes('"transcribe"') ||
    serialized.includes('"feedback"') ||
    serialized.includes('"expected_vector"')
  ) {
    return false;
  }

  if (candidate.execution_status !== "completed" && candidate.execution_status !== "unavailable") {
    return false;
  }
  if (candidate.evaluation_status !== "not_evaluated" && candidate.evaluation_status !== "synthetic_mock_only") {
    return false;
  }
  if (
    candidate.execution_status === "unavailable" &&
    (candidate.acoustic_distance !== null ||
      candidate.phoneme_error_rate !== null ||
      candidate.word_error_rate !== null)
  ) {
    return false;
  }
  if (!candidate.model_fingerprint || typeof candidate.model_fingerprint !== "object") return false;
  if (!candidate.runtime_fingerprint || typeof candidate.runtime_fingerprint !== "object") return false;

  const modelFingerprint = candidate.model_fingerprint as Record<string, unknown>;
  if (
    (modelFingerprint.fingerprint_scope !== "package-configuration-only" &&
      modelFingerprint.fingerprint_scope !== "package-configuration-plus-checkpoint-bytes" &&
      modelFingerprint.fingerprint_scope !== "synthetic-mock-identity") ||
    !("checkpoint_sha256" in modelFingerprint)
  ) {
    return false;
  }

  return true;
}

/**
 * Converts a raw speech challenger diagnostic into a strictly bounded Nếp Core observation.
 *
 * Epistemic Invariant:
 * Speech challengers enter with authority: "none" and validationState: "shadow".
 * They can NEVER mutate learner mastery or affect durable assessment without gold benchmark certification.
 */
export function createChallengerObservation(
  observationId: string,
  targetId: string,
  challengerResult: SpeechChallengerResult,
  context: ObservationContext,
): CoreObservation<AcousticDiagnosticPayload> {
  if (challengerResult.execution_status !== "completed") {
    throw new Error("Unavailable challenger inference cannot become an observation");
  }
  const alignments: PhonemeAlignmentDetail[] = [];

  for (const err of challengerResult.errors) {
    if (err.phones && Array.isArray(err.phones)) {
      for (const p of err.phones) {
        alignments.push({
          expectedPhoneme: p.expected ?? "",
          observedPhoneme: p.heard,
          startTimeSec: 0,
          endTimeSec: 0,
          durationMs: 0,
          acousticScore: challengerResult.acoustic_distance,
          confidence: p.confidence,
          operation: p.expected === p.heard ? "match" : p.heard ? "substitution" : "deletion",
        });
      }
    }
  }

  const payload: AcousticDiagnosticPayload = {
    kind: "acoustic",
    utteranceDurationSec: 0,
    speechDurationSec: 0,
    snrDb: context.snrDb ?? null,
    clippingDetected: false,
    articulationRateSyllablesPerSec: null,
    pairwiseVariabilityIndex: null,
    voiceOnsetLatencyMs: null,
    phonemeAlignments: alignments,
    suspectedFinalConsonantDeletions: [],
    epentheticVowelDetected: null,
  };

  const observation: CoreObservation<AcousticDiagnosticPayload> = {
    observationId,
    targetId,
    activity: "spoken-production",
    payload,
    confidence: null,
    // Challenger is strictly shadow-only with zero authority over learner state
    authority: "none",
    calibration: {
      validationState: "shadow",
      decision: "shadow",
      benchmarkId: null,
      modelFingerprint: challengerResult.model_fingerprint.sha256,
      scope: {
        activity: "spoken-production",
        construct: context.construct,
        requiredPopulationTags: [...context.populationTags],
      },
      metrics: {
        sampleSize: 0,
      },
    },
    provenance: {
      evaluator: challengerResult.provider.name,
      evaluatorKind: "model",
      artifact: {
        artifactId: challengerResult.model_fingerprint.artifact_id,
        version: challengerResult.model_fingerprint.version,
        sha256: challengerResult.model_fingerprint.sha256,
        runtime: challengerResult.runtime_fingerprint.runtime,
        configurationId: challengerResult.model_fingerprint.configuration_id,
      },
    },
    context,
    contextId: null,
    createdAt: new Date().toISOString(),
  };

  // Invariant verification: MUST NOT be eligible for durable assessment or mastery
  if (canAffectDurableAssessment(observation) || canBecomeMasteryCandidate(observation)) {
    throw new Error("Epistemic invariant violation: uncertified challenger observation has learner authority");
  }

  return observation;
}

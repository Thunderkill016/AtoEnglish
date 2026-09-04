import { describe, expect, it } from "vitest";
import {
  canAffectDurableAssessment,
  canBecomeMasteryCandidate,
} from "./observation";
import {
  type SpeechChallengerResult,
  createChallengerObservation,
  validateChallengerDiagnosticIntegrity,
} from "./speech-challenger-contract";

describe("Speech Challenger Core Contract", () => {
  const validMockResult: SpeechChallengerResult = {
    provider: {
      name: "openpronounce",
      version: "0.3.0",
    },
    model_fingerprint: {
      artifact_id: "nep-model-openpronounce",
      version: "0.3.0",
      sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      configuration_id: "cfg-piper-en",
    },
    runtime_fingerprint: {
      runtime: "modal-container",
      python_version: "3.11.0",
      sha256: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
      hardware_tier: "cpu",
    },
    success: true,
    latency_ms: 210,
    acoustic_distance: 4.2,
    phoneme_error_rate: 0.1,
    word_error_rate: 0.0,
    errors: [
      {
        word: "think",
        expected: "θɪŋk",
        actual: "tɪŋk",
        confidence: 0.94,
        phones: [
          { expected: "θ", heard: "t", confidence: 0.94 },
          { expected: "ɪ", heard: "ɪ", confidence: 0.99 },
        ],
      },
    ],
    prosody_summary: {
      f0_mean: 135.0,
      f0_std: 14.2,
      energy_mean: 22.0,
      energy_std: 3.8,
    },
  };

  it("validates integrity and rejects raw scores or transcripts", () => {
    expect(validateChallengerDiagnosticIntegrity(validMockResult)).toBe(true);

    // Reject 0-100 score
    const withScore = { ...validMockResult, score: 85 };
    expect(validateChallengerDiagnosticIntegrity(withScore)).toBe(false);

    // Reject candidate_score
    const withCandidateScore = { ...validMockResult, candidate_score: 85 };
    expect(validateChallengerDiagnosticIntegrity(withCandidateScore)).toBe(false);

    // Reject raw transcribe
    const withTranscribe = { ...validMockResult, transcribe: "TINK" };
    expect(validateChallengerDiagnosticIntegrity(withTranscribe)).toBe(false);
  });

  it("creates observation with authority 'none' and shadow calibration", () => {
    const obs = createChallengerObservation(
      "obs-smoke-001",
      "target-sound-th",
      validMockResult,
      {
        populationTags: ["l1-vi", "learner-adult"],
        construct: "phonology.segmental.acoustic-alignment",
        noiseClass: "clean",
        snrDb: 28,
      },
    );

    // Core Invariant: MUST have zero learner authority
    expect(obs.authority).toBe("none");
    expect(obs.calibration.validationState).toBe("shadow");
    expect(obs.calibration.decision).toBe("shadow");

    // Must be completely ineligible for assessment or mastery
    expect(canAffectDurableAssessment(obs)).toBe(false);
    expect(canBecomeMasteryCandidate(obs)).toBe(false);

    // Preserves provenance and fingerprints
    expect(obs.provenance.evaluator).toBe("openpronounce");
    expect(obs.provenance.evaluatorKind).toBe("model");
    expect(obs.provenance.artifact?.sha256).toBe(validMockResult.model_fingerprint.sha256);
    expect(obs.provenance.artifact?.runtime).toBe("modal-container");

    // Alignments populated
    expect(obs.payload.phonemeAlignments).toHaveLength(2);
    expect(obs.payload.phonemeAlignments[0].expectedPhoneme).toBe("θ");
    expect(obs.payload.phonemeAlignments[0].observedPhoneme).toBe("t");
    expect(obs.payload.phonemeAlignments[0].operation).toBe("substitution");
  });
});

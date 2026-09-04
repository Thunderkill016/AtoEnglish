import { describe, expect, it } from "vitest";

import {
  type AuthorityResolutionRequest,
  type RegisteredAuthorityGrant,
  type RegisteredBenchmarkArtifact,
  createProvenanceAuthorityRegistry,
  resolveCalibrationAuthority,
} from "./authority-registry";
import {
  certifyCoreEvidence,
  validateReferenceCoreEvidence,
} from "./certified-evidence";
import type { CoreObservation } from "./observation";
import type { CoreTaskSpec } from "./task";

describe("Provenance Authority Registry V1", () => {
  const sampleBenchmark: RegisteredBenchmarkArtifact = {
    benchmarkId: "bench-phonology-v1",
    version: "1.0.0",
    immutableFingerprint: "sha256-bench-phonology-digest-12345",
    evidenceLayer: "layer1-benchmark-calibration",
    sourceReferences: [
      {
        sourceId: "nep-phonology-corpus",
        version: "1.0.0",
        locator: "https://corpus.atoryn.internal/phonology/v1.parquet",
      },
    ],
    sampleSize: 150,
    adjudicationProtocol: "dual-adjudication-v1",
    createdAt: "2026-09-01T00:00:00.000Z",
  };

  const activeGrant: RegisteredAuthorityGrant = {
    grantId: "grant-phonology-active-001",
    grantVersion: "1.0.0",
    status: "active",
    benchmarkArtifact: sampleBenchmark,
    evaluatorBinding: {
      evaluatorId: "acoustic-classifier-v1",
      evaluatorKind: "model",
      modelFingerprint: "sha256-model-weights-abcde",
      runtimeFingerprint: "modal-container-py311",
      configurationId: "cfg-piper-en",
    },
    scope: {
      activity: "spoken-production",
      construct: "phonology.minimal-pair",
      requiredPopulationTags: ["l1-vi", "adult"],
      allowedNoiseClasses: ["clean", "office"],
      minimumSnrDb: 15,
      allowedPromptContexts: ["isolated-word", "sentence-read"],
    },
    decision: "assessment",
    authority: "assessment-candidate",
    validFrom: "2026-01-01T00:00:00.000Z",
    validUntil: "2027-01-01T00:00:00.000Z",
  };

  const revokedGrant: RegisteredAuthorityGrant = {
    ...activeGrant,
    grantId: "grant-phonology-revoked-002",
    status: "revoked",
    revokedAt: "2026-09-03T00:00:00.000Z",
    revocationReason: "data-contamination-detected",
  };

  const supersededGrant: RegisteredAuthorityGrant = {
    ...activeGrant,
    grantId: "grant-phonology-superseded-003",
    status: "superseded",
    supersededByGrantId: "grant-phonology-active-001",
  };

  const expiredGrant: RegisteredAuthorityGrant = {
    ...activeGrant,
    grantId: "grant-phonology-expired-004",
    status: "expired",
    validFrom: "2024-01-01T00:00:00.000Z",
    validUntil: "2025-01-01T00:00:00.000Z",
  };

  const registry = createProvenanceAuthorityRegistry([
    activeGrant,
    revokedGrant,
    supersededGrant,
    expiredGrant,
  ]);

  const validTask: CoreTaskSpec = {
    id: "task-spk-001",
    version: 1,
    targetIds: ["target-th-sound"],
    activity: "spoken-production",
    responseModality: "speech",
    allowedEvidenceRoles: ["free-production"],
    support: { level: 0, revealAllowed: false },
    transferDistance: "same-context",
    contextTags: ["minimal-pair"],
    timeConstraintMs: null,
    scoringContractId: "acoustic-v1",
    sources: [],
  };

  const validAuthoritativeObservation: CoreObservation = {
    observationId: "obs-authoritative-001",
    targetId: "target-th-sound",
    activity: "spoken-production",
    payload: {
      kind: "acoustic",
      utteranceDurationSec: 1.5,
      speechDurationSec: 1.2,
      snrDb: 22,
      clippingDetected: false,
      articulationRateSyllablesPerSec: 3.5,
      pairwiseVariabilityIndex: 45,
      voiceOnsetLatencyMs: 120,
      phonemeAlignments: [],
      suspectedFinalConsonantDeletions: [],
      epentheticVowelDetected: false,
    },
    confidence: 0.95,
    calibration: {
      validationState: "benchmarked",
      decision: "assessment",
      benchmarkId: "bench-phonology-v1",
      modelFingerprint: "sha256-model-weights-abcde",
      scope: {
        activity: "spoken-production",
        construct: "phonology.minimal-pair",
        requiredPopulationTags: ["l1-vi", "adult"],
        allowedNoiseClasses: ["clean", "office"],
        minimumSnrDb: 15,
        allowedPromptContexts: ["isolated-word", "sentence-read"],
      },
      metrics: {
        sampleSize: 150,
        precision: 0.94,
        recall: 0.88,
      },
    },
    authority: "assessment-candidate",
    provenance: {
      evaluator: "acoustic-classifier-v1",
      evaluatorKind: "model",
      artifact: {
        artifactId: "model-acoustic",
        version: "1.0.0",
        runtime: "modal-container-py311",
      },
    },
    context: {
      populationTags: ["l1-vi", "adult", "intermediate"],
      construct: "phonology.minimal-pair",
      noiseClass: "clean",
      snrDb: 22,
      promptContext: "isolated-word",
    },
    contextId: "ctx-word-01",
    createdAt: "2026-09-04T00:00:00.000Z",
  };

  it("1. rejects observation when grant ID does not exist in registry", () => {
    const request: AuthorityResolutionRequest = {
      grantId: "grant-non-existent",
      observation: validAuthoritativeObservation,
      task: validTask,
    };
    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("grant-not-found");
    }
  });

  it("2. rejects when benchmark fingerprint does not match registered artifact", () => {
    const alteredObservation: CoreObservation = {
      ...validAuthoritativeObservation,
      calibration: {
        ...validAuthoritativeObservation.calibration,
        benchmarkId: "bench-different-id",
      },
    };
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: alteredObservation,
      task: validTask,
    };
    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("benchmark-fingerprint-mismatch");
    }
  });

  it("3. rejects evaluator identity and kind mismatch", () => {
    const wrongEvaluator: CoreObservation = {
      ...validAuthoritativeObservation,
      provenance: {
        ...validAuthoritativeObservation.provenance,
        evaluator: "untrusted-evaluator",
        evaluatorKind: "deterministic",
      },
    };
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: wrongEvaluator,
      task: validTask,
    };
    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("evaluator-identity-mismatch");
      expect(result.reasonCodes).toContain("evaluator-kind-mismatch");
    }
  });

  it("4. rejects model or runtime fingerprint mismatch", () => {
    const wrongModelFp: CoreObservation = {
      ...validAuthoritativeObservation,
      calibration: {
        ...validAuthoritativeObservation.calibration,
        modelFingerprint: "sha256-altered-model-weights",
      },
      provenance: {
        ...validAuthoritativeObservation.provenance,
        artifact: {
          artifactId: "model-acoustic",
          version: "1.0.0",
          runtime: "different-unsupported-runtime",
        },
      },
    };
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: wrongModelFp,
      task: validTask,
    };
    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("model-fingerprint-mismatch");
      expect(result.reasonCodes).toContain("runtime-fingerprint-mismatch");
    }
  });

  it("5. rejects scope mismatch: population, activity, noise, snr, and promptContext", () => {
    const outOfScopeObservation: CoreObservation = {
      ...validAuthoritativeObservation,
      activity: "reading-reception",
      context: {
        populationTags: ["l1-ja"], // missing required "l1-vi"
        construct: "phonology.minimal-pair",
        noiseClass: "street-mobile", // unallowed noise class
        snrDb: 8, // below minimumSnrDb: 15
        promptContext: "unsupported-conversational-chitchat",
      },
    };
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: outOfScopeObservation,
      task: validTask,
    };
    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("activity-scope-mismatch");
      expect(result.reasonCodes).toContain("population-scope-mismatch");
      expect(result.reasonCodes).toContain("noise-class-unsupported");
      expect(result.reasonCodes).toContain("snr-below-minimum");
      expect(result.reasonCodes).toContain("prompt-context-unsupported");
    }
  });

  it("6. rejects revoked grant fail-closed", () => {
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-revoked-002",
      observation: validAuthoritativeObservation,
      task: validTask,
    };
    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("grant-inactive-revoked");
    }
  });

  it("7. rejects superseded and expired grants", () => {
    const supersededReq: AuthorityResolutionRequest = {
      grantId: "grant-phonology-superseded-003",
      observation: validAuthoritativeObservation,
      task: validTask,
    };
    const supersededRes = resolveCalibrationAuthority(supersededReq, registry);
    expect(supersededRes.ok).toBe(false);
    if (!supersededRes.ok) {
      expect(supersededRes.reasonCodes).toContain("grant-inactive-superseded");
    }

    const expiredReq: AuthorityResolutionRequest = {
      grantId: "grant-phonology-expired-004",
      observation: validAuthoritativeObservation,
      task: validTask,
      atTimestamp: "2026-09-04T00:00:00.000Z",
    };
    const expiredRes = resolveCalibrationAuthority(expiredReq, registry);
    expect(expiredRes.ok).toBe(false);
    if (!expiredRes.ok) {
      expect(expiredRes.reasonCodes).toContain("grant-inactive-expired");
    }
  });

  it("8. resolves active exact matching grant and allows durable certification", () => {
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
    };
    const resolved = resolveCalibrationAuthority(request, registry);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    expect(resolved.resolvedGrant.grantId).toBe("grant-phonology-active-001");
    expect(resolved.resolvedGrant.authority).toBe("assessment-candidate");
    expect(resolved.resolvedGrant.decision).toBe("assessment");

    const candidate = {
      eventId: "ev-spk-001",
      taskId: validTask.id,
      targetId: "target-th-sound",
      role: "free-production" as const,
      observationId: validAuthoritativeObservation.observationId,
      outcome: { kind: "binary" as const, success: true },
      evaluatorConfidence: 0.95,
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: 1200,
        responseModality: "speech" as const,
        contextId: "ctx-word-01",
      },
      occurredAt: "2026-09-04T00:00:01.000Z",
    };

    const certResult = certifyCoreEvidence(
      validTask,
      validAuthoritativeObservation,
      candidate,
      resolved.resolvedGrant,
    );
    expect(certResult.ok).toBe(true);
    if (certResult.ok) {
      expect(certResult.evidence.authorityScope).toBe("durable-assessment");
      expect(certResult.evidence.calibrationBenchmarkId).toBe("bench-phonology-v1");
      expect(certResult.evidence.modelFingerprint).toBe("sha256-model-weights-abcde");
    }
  });

  it("9. rejects unvalidated repository-reference observation from claiming durable authority", () => {
    const referenceObservation: CoreObservation = {
      ...validAuthoritativeObservation,
      calibration: {
        ...validAuthoritativeObservation.calibration,
        validationState: "unvalidated",
        decision: "shadow",
        benchmarkId: null,
      },
      authority: "none",
    };

    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: referenceObservation,
      task: validTask,
    };
    const resolved = resolveCalibrationAuthority(request, registry);
    expect(resolved.ok).toBe(false);
    if (!resolved.ok) {
      expect(resolved.reasonCodes).toContain("unvalidated-reference-cannot-claim-authority");
      expect(resolved.reasonCodes).toContain("observation-not-authoritative");
    }

    // However, reference validation continues to succeed as repository-reference
    const refCandidate = {
      eventId: "ev-ref-001",
      taskId: validTask.id,
      targetId: "target-th-sound",
      role: "free-production" as const,
      observationId: referenceObservation.observationId,
      outcome: { kind: "binary" as const, success: true },
      evaluatorConfidence: 1,
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: 800,
        responseModality: "speech" as const,
        contextId: "ctx-word-01",
      },
      occurredAt: "2026-09-04T00:00:01.000Z",
    };

    const refResult = validateReferenceCoreEvidence(validTask, referenceObservation, refCandidate);
    expect(refResult.ok).toBe(true);
    if (refResult.ok) {
      expect(refResult.evidence.authorityScope).toBe("repository-reference");
      expect(refResult.evidence.calibrationBenchmarkId).toBeNull();
    }
  });

  it("10. rejects ad-hoc un-resolved object passed directly into certifyCoreEvidence", () => {
    const unbrandedFakeGrant = {
      grantId: "grant-phonology-active-001",
      grantVersion: "1.0.0",
      benchmarkId: "bench-phonology-v1",
      modelFingerprint: "sha256-model-weights-abcde",
      authority: "assessment-candidate" as const,
      decision: "assessment" as const,
      scope: validAuthoritativeObservation.calibration.scope,
    };

    const candidate = {
      eventId: "ev-fake-001",
      taskId: validTask.id,
      targetId: "target-th-sound",
      role: "free-production" as const,
      observationId: validAuthoritativeObservation.observationId,
      outcome: { kind: "binary" as const, success: true },
      evaluatorConfidence: 0.95,
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: 1200,
        responseModality: "speech" as const,
        contextId: "ctx-word-01",
      },
      occurredAt: "2026-09-04T00:00:01.000Z",
    };

    // Cast unbranded object to bypass TS compiler; runtime brand check MUST fail closed
    const certResult = certifyCoreEvidence(
      validTask,
      validAuthoritativeObservation,
      candidate,
      unbrandedFakeGrant as never,
    );

    expect(certResult.ok).toBe(false);
    if (!certResult.ok) {
      expect(certResult.problems).toContainEqual({
        type: "independent-authority-not-resolved",
      });
    }
  });

  it("11. preserves bounded-score outcome without synthesizing unauthorized boolean mapping", () => {
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
    };
    const resolved = resolveCalibrationAuthority(request, registry);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;

    const boundedScoreCandidate = {
      eventId: "ev-score-001",
      taskId: validTask.id,
      targetId: "target-th-sound",
      role: "free-production" as const,
      observationId: validAuthoritativeObservation.observationId,
      outcome: { kind: "bounded-score" as const, value: 84.5, min: 0, max: 100 },
      evaluatorConfidence: 0.95,
      attempt: {
        supportLevel: 0,
        revealUsed: false,
        responseLatencyMs: 1200,
        responseModality: "speech" as const,
        contextId: "ctx-word-01",
      },
      occurredAt: "2026-09-04T00:00:01.000Z",
    };

    const certResult = certifyCoreEvidence(
      validTask,
      validAuthoritativeObservation,
      boundedScoreCandidate,
      resolved.resolvedGrant,
    );

    expect(certResult.ok).toBe(true);
    if (certResult.ok) {
      expect(certResult.evidence.outcome.kind).toBe("bounded-score");
      if (certResult.evidence.outcome.kind === "bounded-score") {
        expect(certResult.evidence.outcome.value).toBe(84.5);
      }
      // Strictly asserts no synthesized boolean property exists on the outcome
      expect("success" in certResult.evidence.outcome).toBe(false);
    }
  });
});

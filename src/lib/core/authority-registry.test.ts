import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  type AuthorityResolutionRequest,
  type RegisteredAuthorityGrant,
  type RegisteredBenchmarkArtifact,
  type TrustedAnchor,
  type RawAuthorityAttestation,
  type VerifiedAuthorityAttestation,
  createProvenanceAuthorityRegistry,
  createTestMechanicsAuthorityGrant,
  createTestMechanicsBenchmark,
  createTestMechanicsTrustRoot,
  createTrustedAnchorRegistry,
  computeCanonicalManifestDigest,
  extractGrantManifestPayload,
  verifyAuthorityManifest,
  isProductionEligibleTrustRoot,
  isResolvedContractAuthority,
  isResolvedDurableCalibrationAuthority,
  isTestHarnessTrustRoot,
  isVerifiedAuthorityAttestation,
  parseStrictIso8601,
  resolveCalibrationAuthority,
} from "./authority-registry";
import {
  certifyCoreEvidence,
  validateReferenceCoreEvidence,
} from "./certified-evidence";
import type { CoreObservation } from "./observation";
import type { CoreTaskSpec } from "./task";
import checkedInFixtures from "../../../benchmarks/core/authority-registry-fixtures-v1.json";

describe("Provenance Authority Registry V1", () => {
  // Test-only in-memory trust anchor fixtures
  const testSecret = "secret-key-32-bytes-test-anchor-123456";
  const testAnchorHmac: TrustedAnchor = {
    anchorId: "anchor-test-hmac-01",
    algorithm: "hmac-sha256",
    publicKeyOrSecret: testSecret,
    status: "active",
    validFrom: "2026-01-01T00:00:00.000Z",
    validUntil: "2028-01-01T00:00:00.000Z",
  };

  const { publicKey: edPublicKey, privateKey: edPrivateKey } = crypto.generateKeyPairSync("ed25519", {
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  const testAnchorEd25519: TrustedAnchor = {
    anchorId: "anchor-test-ed25519-01",
    algorithm: "ed25519",
    publicKeyOrSecret: edPublicKey,
    status: "active",
    validFrom: "2026-01-01T00:00:00.000Z",
    validUntil: "2028-01-01T00:00:00.000Z",
  };

  const testAnchorRevoked: TrustedAnchor = {
    anchorId: "anchor-test-revoked-01",
    algorithm: "hmac-sha256",
    publicKeyOrSecret: testSecret,
    status: "revoked",
    validFrom: "2026-01-01T00:00:00.000Z",
    revokedAt: "2026-09-02T00:00:00.000Z",
    revocationReason: "key-compromise",
  };

  const testAnchorExpired: TrustedAnchor = {
    anchorId: "anchor-test-expired-01",
    algorithm: "hmac-sha256",
    publicKeyOrSecret: testSecret,
    status: "expired",
    validFrom: "2024-01-01T00:00:00.000Z",
    validUntil: "2025-01-01T00:00:00.000Z",
  };

  const testAnchorRegistry = createTrustedAnchorRegistry([
    testAnchorHmac,
    testAnchorEd25519,
    testAnchorRevoked,
    testAnchorExpired,
  ]);

  function signAndVerifyTestGrant(
    grant: RegisteredAuthorityGrant,
    anchor: TrustedAnchor = testAnchorHmac,
    secretOrPrivKey: string = testSecret,
    attestedAt = "2026-09-01T00:00:00.000Z",
    evalTime = "2026-09-04T00:00:01.000Z",
  ): VerifiedAuthorityAttestation {
    const payload = extractGrantManifestPayload(grant);
    const digest = computeCanonicalManifestDigest(payload);
    let signature: string;
    if (anchor.algorithm === "hmac-sha256") {
      signature = crypto.createHmac("sha256", secretOrPrivKey).update(digest, "utf8").digest("hex");
    } else {
      signature = crypto.sign(null, Buffer.from(digest, "utf8"), secretOrPrivKey).toString("hex");
    }
    const raw: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: anchor.anchorId,
      manifestDigest: digest,
      signature,
      attestedAt,
    };
    const res = verifyAuthorityManifest(raw, payload, testAnchorRegistry, evalTime);
    if (!res.ok) {
      throw new Error(`Failed to verify test attestation: ${res.reasonCode}`);
    }
    return res.attestation;
  }

  // Production-eligible benchmark fixture for resolver tests
  const sampleBenchmark: RegisteredBenchmarkArtifact = {
    benchmarkId: "bench-phonology-v1",
    version: "1.0.0",
    immutableFingerprint: "sha256-bench-phonology-digest-12345",
    evidenceLayer: "layer1-benchmark-calibration",
    sourceReferences: [
      {
        sourceId: "synthetic-phonology-corpus",
        version: "1.0.0",
        locator: "synthetic://test/phonology/v1",
      },
    ],
    sampleSize: 150,
    adjudicationProtocol: "synthetic-test-harness",
    createdAt: "2026-09-01T00:00:00.000Z",
    productionAuthorityEligible: true,
  };

  const activeGrantBase: RegisteredAuthorityGrant = {
    grantId: "grant-phonology-active-001",
    grantVersion: "1.0.0",
    status: "active",
    benchmarkArtifactId: "bench-phonology-v1",
    expectedBenchmarkFingerprint: "sha256-bench-phonology-digest-12345",
    expectedBenchmarkVersion: "1.0.0",
    productionAuthorityEligible: true,
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

  const activeGrant: RegisteredAuthorityGrant = {
    ...activeGrantBase,
    attestation: signAndVerifyTestGrant(activeGrantBase),
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

  const registry = createProvenanceAuthorityRegistry({
    benchmarks: [sampleBenchmark],
    grants: [activeGrant, revokedGrant, supersededGrant, expiredGrant],
  });

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
        configurationId: "cfg-piper-en",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
          configurationId: "cfg-piper-en",
        },
      },
    };
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: wrongModelFp,
      task: validTask,
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:00.000Z",
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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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

    expect(isResolvedDurableCalibrationAuthority(resolved.resolvedGrant)).toBe(true);
    if (!isResolvedDurableCalibrationAuthority(resolved.resolvedGrant)) return;

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
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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

  it("10. rejects ad-hoc un-resolved object and forged isProductionEligible object passed directly into certifyCoreEvidence", () => {
    const unbrandedFakeGrant = {
      grantId: "grant-phonology-active-001",
      grantVersion: "1.0.0",
      benchmarkId: "bench-phonology-v1",
      modelFingerprint: "sha256-model-weights-abcde",
      authority: "assessment-candidate" as const,
      decision: "assessment" as const,
      scope: validAuthoritativeObservation.calibration.scope,
    };

    const forgedEligibleGrant = {
      ...unbrandedFakeGrant,
      isProductionEligible: true,
      benchmarkFingerprint: "sha256-bench-phonology-digest-12345",
      resolvedAt: "2026-09-04T00:00:01.000Z",
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
    const certResult1 = certifyCoreEvidence(
      validTask,
      validAuthoritativeObservation,
      candidate,
      unbrandedFakeGrant as never,
    );

    expect(certResult1.ok).toBe(false);
    if (!certResult1.ok) {
      expect(certResult1.problems).toContainEqual({
        type: "independent-authority-not-resolved",
      });
    }

    // Forged object with isProductionEligible: true but lacking DURABLE_AUTHORITY_BRAND symbol MUST fail closed
    const certResult2 = certifyCoreEvidence(
      validTask,
      validAuthoritativeObservation,
      candidate,
      forgedEligibleGrant as never,
    );

    expect(certResult2.ok).toBe(false);
    if (!certResult2.ok) {
      expect(certResult2.problems).toContainEqual({
        type: "independent-authority-not-resolved",
      });
    }
  });

  it("11. preserves bounded-score outcome without synthesizing unauthorized boolean mapping", () => {
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
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

    expect(isResolvedDurableCalibrationAuthority(resolved.resolvedGrant)).toBe(true);
    if (!isResolvedDurableCalibrationAuthority(resolved.resolvedGrant)) return;

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

  it("12. grant cannot bootstrap or auto-register missing benchmark into existence fail-closed", () => {
    const grantWithMissingBenchmark: RegisteredAuthorityGrant = {
      grantId: "grant-missing-bench-001",
      grantVersion: "1.0.0",
      status: "active",
      benchmarkArtifactId: "bench-absent-never-registered",
      expectedBenchmarkFingerprint: "sha256-unregistered-bench-fp",
      expectedBenchmarkVersion: "1.0.0",
      productionAuthorityEligible: true,
      evaluatorBinding: activeGrant.evaluatorBinding,
      scope: activeGrant.scope,
      decision: "assessment",
      authority: "assessment-candidate",
      validFrom: "2026-01-01T00:00:00.000Z",
    };

    const emptyBenchmarkRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [],
      grants: [grantWithMissingBenchmark],
    });

    // Verify benchmark was NOT auto-registered into the registry
    expect(emptyBenchmarkRegistry.lookupBenchmark("bench-absent-never-registered")).toBeUndefined();

    const request: AuthorityResolutionRequest = {
      grantId: "grant-missing-bench-001",
      observation: validAuthoritativeObservation,
      task: validTask,
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
    };

    const result = resolveCalibrationAuthority(request, emptyBenchmarkRegistry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("benchmark-not-found");
    }
  });

  it("13. rejects when registered benchmark fingerprint or version mismatches expected values in grant", () => {
    const grantMismatchedFp: RegisteredAuthorityGrant = {
      ...activeGrant,
      grantId: "grant-mismatched-fp",
      expectedBenchmarkFingerprint: "sha256-conflicting-expected-fingerprint",
    };
    const grantMismatchedVersion: RegisteredAuthorityGrant = {
      ...activeGrant,
      grantId: "grant-mismatched-ver",
      expectedBenchmarkVersion: "9.9.9",
    };

    const mismatchRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [grantMismatchedFp, grantMismatchedVersion],
    });

    const resFp = resolveCalibrationAuthority(
      {
        grantId: "grant-mismatched-fp",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      mismatchRegistry,
    );
    expect(resFp.ok).toBe(false);
    if (!resFp.ok) {
      expect(resFp.reasonCodes).toContain("benchmark-fingerprint-mismatch");
    }

    const resVer = resolveCalibrationAuthority(
      {
        grantId: "grant-mismatched-ver",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      mismatchRegistry,
    );
    expect(resVer.ok).toBe(false);
    if (!resVer.ok) {
      expect(resVer.reasonCodes).toContain("benchmark-version-mismatch");
    }
  });

  it("14. checked-in repository fixtures in authority-registry-fixtures-v1.json fail closed by default (ineligible for production authority)", () => {
    const fixtureRegistry = createProvenanceAuthorityRegistry({
      benchmarks: checkedInFixtures.benchmarks as RegisteredBenchmarkArtifact[],
      grants: checkedInFixtures.grants as RegisteredAuthorityGrant[],
    });

    const fixtureTask: CoreTaskSpec = {
      id: "task-choice-01",
      version: 1,
      targetIds: ["listen-ih-vs-iy"],
      activity: "listening-reception",
      responseModality: "choice",
      allowedEvidenceRoles: ["receptive-discrimination"],
      support: { level: 0, revealAllowed: false },
      transferDistance: "same-context",
      contextTags: ["minimal-pair"],
      timeConstraintMs: 3000,
      scoringContractId: "binary-v1",
      sources: [],
    };

    const fixtureObservation: CoreObservation = {
      observationId: "obs-fixture-01",
      targetId: "listen-ih-vs-iy",
      activity: "listening-reception",
      payload: {
        kind: "comprehension",
        taskId: "task-choice-01",
        responseCorrect: true,
        responseLatencyMs: 500,
        supportLevel: 0,
        targetedConstructs: ["listen-ih-vs-iy"],
      },
      confidence: 1,
      calibration: {
        validationState: "benchmarked",
        decision: "assessment",
        benchmarkId: "vi-adult-minpair-v1",
        modelFingerprint: "deterministic-choice@v1",
        scope: {
          activity: "listening-reception",
          construct: "listen-ih-vs-iy",
          requiredPopulationTags: ["l1-vi", "adult", "a1"],
          allowedNoiseClasses: ["clean", "office"],
          minimumSnrDb: 15,
        },
        metrics: {
          sampleSize: 100,
          precision: 0.95,
        },
      },
      authority: "assessment-candidate",
      provenance: {
        evaluator: "binary-answer-key",
        evaluatorKind: "deterministic",
        artifact: {
          artifactId: "choice-key",
          version: "1.0.0",
          runtime: "node-runtime@v22",
          configurationId: "cfg-choice-binary-exact",
        },
      },
      context: {
        populationTags: ["l1-vi", "adult", "a1"],
        construct: "listen-ih-vs-iy",
        noiseClass: "clean",
        snrDb: 20,
      },
      contextId: "ctx-01",
      createdAt: "2026-09-04T00:00:00.000Z",
    };

    // By default (requireProductionAuthority: true), checked-in fixtures MUST fail closed
    const resolution = resolveCalibrationAuthority(
      {
        grantId: "grant-minpair-active-v1",
        observation: fixtureObservation,
        task: fixtureTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      fixtureRegistry,
    );

    expect(resolution.ok).toBe(false);
    if (!resolution.ok) {
      expect(resolution.reasonCodes).toContain("grant-ineligible-for-production-authority");
      expect(resolution.reasonCodes).toContain("benchmark-ineligible-for-production-authority");
    }
  });

  it("15. checked-in repository fixtures can resolve contract-level token when requireProductionAuthority is false", () => {
    const fixtureRegistry = createProvenanceAuthorityRegistry({
      benchmarks: checkedInFixtures.benchmarks as RegisteredBenchmarkArtifact[],
      grants: checkedInFixtures.grants as RegisteredAuthorityGrant[],
    });

    const fixtureTask: CoreTaskSpec = {
      id: "task-choice-01",
      version: 1,
      targetIds: ["listen-ih-vs-iy"],
      activity: "listening-reception",
      responseModality: "choice",
      allowedEvidenceRoles: ["receptive-discrimination"],
      support: { level: 0, revealAllowed: false },
      transferDistance: "same-context",
      contextTags: ["minimal-pair"],
      timeConstraintMs: 3000,
      scoringContractId: "binary-v1",
      sources: [],
    };

    const fixtureObservation: CoreObservation = {
      observationId: "obs-fixture-01",
      targetId: "listen-ih-vs-iy",
      activity: "listening-reception",
      payload: {
        kind: "comprehension",
        taskId: "task-choice-01",
        responseCorrect: true,
        responseLatencyMs: 500,
        supportLevel: 0,
        targetedConstructs: ["listen-ih-vs-iy"],
      },
      confidence: 1,
      calibration: {
        validationState: "benchmarked",
        decision: "assessment",
        benchmarkId: "vi-adult-minpair-v1",
        modelFingerprint: "deterministic-choice@v1",
        scope: {
          activity: "listening-reception",
          construct: "listen-ih-vs-iy",
          requiredPopulationTags: ["l1-vi", "adult", "a1"],
          allowedNoiseClasses: ["clean", "office"],
          minimumSnrDb: 15,
        },
        metrics: {
          sampleSize: 100,
          precision: 0.95,
        },
      },
      authority: "assessment-candidate",
      provenance: {
        evaluator: "binary-answer-key",
        evaluatorKind: "deterministic",
        artifact: {
          artifactId: "choice-key",
          version: "1.0.0",
          runtime: "node-runtime@v22",
          configurationId: "cfg-choice-binary-exact",
        },
      },
      context: {
        populationTags: ["l1-vi", "adult", "a1"],
        construct: "listen-ih-vs-iy",
        noiseClass: "clean",
        snrDb: 20,
      },
      contextId: "ctx-01",
      createdAt: "2026-09-04T00:00:00.000Z",
    };

    const resolution = resolveCalibrationAuthority(
      {
        grantId: "grant-minpair-active-v1",
        observation: fixtureObservation,
        task: fixtureTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
        requireProductionAuthority: false,
      },
      fixtureRegistry,
    );

    expect(resolution.ok).toBe(true);
    if (resolution.ok) {
      expect(resolution.resolvedGrant.isProductionEligible).toBe(false);
      expect(resolution.resolvedGrant.benchmarkId).toBe("vi-adult-minpair-v1");
      expect(resolution.resolvedGrant.resolvedAt).toBe("2026-09-04T00:00:01.000Z");

      // Verify contract brand exists and durable brand does not
      expect(isResolvedContractAuthority(resolution.resolvedGrant)).toBe(true);
      expect(isResolvedDurableCalibrationAuthority(resolution.resolvedGrant)).toBe(false);

      // Adversarial test: attempting to pass contract authority token to certifyCoreEvidence MUST fail closed
      const candidate = {
        eventId: "ev-fixture-001",
        taskId: fixtureTask.id,
        targetId: "listen-ih-vs-iy",
        role: "receptive-discrimination" as const,
        observationId: fixtureObservation.observationId,
        outcome: { kind: "binary" as const, success: true },
        evaluatorConfidence: 1,
        attempt: {
          supportLevel: 0,
          revealUsed: false,
          responseLatencyMs: 500,
          responseModality: "choice" as const,
          contextId: "ctx-01",
        },
        occurredAt: "2026-09-04T00:00:01.000Z",
      };

      const certResult = certifyCoreEvidence(
        fixtureTask,
        fixtureObservation,
        candidate,
        resolution.resolvedGrant as never,
      );

      expect(certResult.ok).toBe(false);
      if (!certResult.ok) {
        expect(certResult.problems).toContainEqual({
          type: "independent-authority-not-durable",
        });
      }
    }
  });

  it("16. deterministic replay: identical inputs yield identical outputs", () => {
    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
      evaluationTimestamp: "2026-09-04T12:34:56.789Z",
    };

    const res1 = resolveCalibrationAuthority(request, registry);
    const res2 = resolveCalibrationAuthority(request, registry);

    expect(res1).toEqual(res2);
    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    if (res1.ok && res2.ok) {
      expect(res1.resolvedGrant.resolvedAt).toBe("2026-09-04T12:34:56.789Z");
      expect(res2.resolvedGrant.resolvedAt).toBe("2026-09-04T12:34:56.789Z");
    }
  });

  it("17. rejects malformed or invalid evaluationTimestamp fail-closed", () => {
    const malformedRequest: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
      evaluationTimestamp: "not-an-iso-date-string",
    };

    const result = resolveCalibrationAuthority(malformedRequest, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("request-timestamp-invalid");
    }

    const missingRequest: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
    };
    const resMissing = resolveCalibrationAuthority(missingRequest, registry);
    expect(resMissing.ok).toBe(false);
    if (!resMissing.ok) {
      expect(resMissing.reasonCodes).toContain("request-timestamp-invalid");
    }
  });

  it("18. rejects malformed grant timestamps with grant-malformed-timestamps", () => {
    const malformedGrant = {
      ...activeGrant,
      grantId: "grant-malformed-ts",
      validFrom: "invalid-timestamp",
    };

    // Resolver detects malformed timestamps even if bypasses construction
    const result = resolveCalibrationAuthority(
      {
        grantId: "grant-malformed-ts",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      {
        lookupGrant: () => malformedGrant as RegisteredAuthorityGrant,
        lookupBenchmark: () => sampleBenchmark,
        listActiveGrantsForConstruct: () => [],
      },
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("grant-malformed-timestamps");
    }
  });

  it("19. registry construction throws on duplicate grant IDs", () => {
    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [sampleBenchmark],
        grants: [activeGrant, { ...activeGrant }],
      });
    }).toThrow(/duplicate grant ID/);
  });

  it("20. registry construction throws unconditionally on duplicate benchmark IDs (order-independent fail-closed)", () => {
    const conflictingBenchmark: RegisteredBenchmarkArtifact = {
      ...sampleBenchmark,
      immutableFingerprint: "sha256-conflicting-fingerprint",
    };

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [sampleBenchmark, conflictingBenchmark],
        grants: [],
      });
    }).toThrow(/Conflict: duplicate benchmark ID/);

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [conflictingBenchmark, sampleBenchmark],
        grants: [],
      });
    }).toThrow(/Conflict: duplicate benchmark ID/);
  });

  it("21. registry construction throws on invalid lifecycle range (validUntil <= validFrom)", () => {
    const invertedRangeGrant: RegisteredAuthorityGrant = {
      ...activeGrant,
      grantId: "grant-inverted-range",
      validFrom: "2026-06-01T00:00:00.000Z",
      validUntil: "2026-01-01T00:00:00.000Z",
    };

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [sampleBenchmark],
        grants: [invertedRangeGrant],
      });
    }).toThrow(/must be strictly after validFrom/);
  });

  it("22. registry construction throws on incoherent lifecycle status (revoked / superseded)", () => {
    const incoherentRevoked: RegisteredAuthorityGrant = {
      ...activeGrant,
      grantId: "grant-incoherent-revoked",
      status: "revoked",
      // Missing revokedAt and revocationReason
    };

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [sampleBenchmark],
        grants: [incoherentRevoked],
      });
    }).toThrow(/revoked grant.*requires valid revokedAt and revocationReason/);

    const incoherentSuperseded: RegisteredAuthorityGrant = {
      ...activeGrant,
      grantId: "grant-incoherent-superseded",
      status: "superseded",
      // Missing supersededByGrantId
    };

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [sampleBenchmark],
        grants: [incoherentSuperseded],
      });
    }).toThrow(/superseded grant.*requires supersededByGrantId/);
  });

  it("23. rejects evaluator configurationId mismatch fail-closed", () => {
    const mismatchedConfigObservation: CoreObservation = {
      ...validAuthoritativeObservation,
      provenance: {
        ...validAuthoritativeObservation.provenance,
        artifact: {
          artifactId: "model-acoustic",
          version: "1.0.0",
          runtime: "modal-container-py311",
          configurationId: "cfg-different-non-matching",
        },
      },
    };

    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: mismatchedConfigObservation,
      task: validTask,
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
    };

    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("evaluator-configuration-mismatch");
    }
  });

  it("24. canonical runtime fingerprint matching does not fall back to sha256", () => {
    // Artifact sets sha256 to the expected runtime string, but runtime field to an unsupported value
    const ambiguousRuntimeObservation: CoreObservation = {
      ...validAuthoritativeObservation,
      provenance: {
        ...validAuthoritativeObservation.provenance,
        artifact: {
          artifactId: "model-acoustic",
          version: "1.0.0",
          sha256: "modal-container-py311", // matches evaluatorBinding.runtimeFingerprint in sha256 field
          runtime: "unsupported-rogue-container", // does NOT match
          configurationId: "cfg-piper-en",
        },
      },
    };

    const request: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: ambiguousRuntimeObservation,
      task: validTask,
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
    };

    const result = resolveCalibrationAuthority(request, registry);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("runtime-fingerprint-mismatch");
    }
  });

  it("25. property: TestHarnessTrustRoot is NEVER production eligible and fails closed under production authority gate", () => {
    const testGrant = createTestMechanicsAuthorityGrant(activeGrant);
    expect(isTestHarnessTrustRoot(testGrant.trustRoot)).toBe(true);
    expect(isProductionEligibleTrustRoot(testGrant.trustRoot)).toBe(false);

    // Round-trip through JSON serializer
    const serialized = JSON.stringify(testGrant);
    const deserialized = JSON.parse(serialized);

    expect(isTestHarnessTrustRoot(deserialized.trustRoot)).toBe(true);
    expect(isProductionEligibleTrustRoot(deserialized.trustRoot)).toBe(false);

    // Loading deserialized grant into registry fails closed under production authority gate
    const untrustedRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [deserialized],
    });

    const res = resolveCalibrationAuthority(
      {
        grantId: testGrant.grantId,
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      untrustedRegistry,
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reasonCodes).toContain("grant-ineligible-for-production-authority");
    }
  });

  it("26. duplicate benchmark ID with identical version and fingerprint but conflicting eligibility or layer throws unconditionally", () => {
    const benchmarkA: RegisteredBenchmarkArtifact = createTestMechanicsBenchmark({
      ...sampleBenchmark,
      benchmarkId: "bench-dupe-check-01",
      evidenceLayer: "layer1-benchmark-calibration",
      productionAuthorityEligible: true,
    });

    const benchmarkB: RegisteredBenchmarkArtifact = {
      ...sampleBenchmark,
      benchmarkId: "bench-dupe-check-01",
      evidenceLayer: "layer0-repository-reference",
      productionAuthorityEligible: false,
    };

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [benchmarkA, benchmarkB],
        grants: [],
      });
    }).toThrow(/Conflict: duplicate benchmark ID 'bench-dupe-check-01'/);

    expect(() => {
      createProvenanceAuthorityRegistry({
        benchmarks: [benchmarkB, benchmarkA],
        grants: [],
      });
    }).toThrow(/Conflict: duplicate benchmark ID 'bench-dupe-check-01'/);
  });

  it("27. strict ISO 8601 validation rejects Date.parse-accepted non-ISO formats and conflicting dual timestamps", () => {
    const nonIsoFormatsAcceptedByDateParse = [
      "2026/09/04",
      "Sep 4, 2026",
      "2026-09-04 12:00:00",
      "2026-02-30T00:00:00.000Z",
      "2026-13-01T00:00:00.000Z",
      "2025-02-29T00:00:00.000Z",
    ];

    for (const ts of nonIsoFormatsAcceptedByDateParse) {
      expect(parseStrictIso8601(ts).ok).toBe(false);

      const res = resolveCalibrationAuthority(
        {
          grantId: "grant-phonology-active-001",
          observation: validAuthoritativeObservation,
          task: validTask,
          evaluationTimestamp: ts,
        },
        registry,
      );
      expect(res.ok).toBe(false);
      if (!res.ok) {
        expect(res.reasonCodes).toContain("request-timestamp-invalid");
      }
    }

    // Conflicting dual timestamps (evaluationTimestamp vs atTimestamp)
    const conflictingDualRequest: AuthorityResolutionRequest = {
      grantId: "grant-phonology-active-001",
      observation: validAuthoritativeObservation,
      task: validTask,
      evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      atTimestamp: "2026-09-04T00:00:02.000Z",
    };

    const resDual = resolveCalibrationAuthority(conflictingDualRequest, registry);
    expect(resDual.ok).toBe(false);
    if (!resDual.ok) {
      expect(resDual.reasonCodes).toContain("request-timestamp-invalid");
    }
  });

  it("28. passing requireProductionAuthority: false on production-eligible grant returns ResolvedContractAuthority and fails durable certification", () => {
    const resolution = resolveCalibrationAuthority(
      {
        grantId: "grant-phonology-active-001",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
        requireProductionAuthority: false,
      },
      registry,
    );

    expect(resolution.ok).toBe(true);
    if (resolution.ok) {
      expect(resolution.resolvedGrant.isProductionEligible).toBe(false);
      expect(isResolvedContractAuthority(resolution.resolvedGrant)).toBe(true);
      expect(isResolvedDurableCalibrationAuthority(resolution.resolvedGrant)).toBe(false);

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
        resolution.resolvedGrant as never,
      );

      expect(certResult.ok).toBe(false);
      if (!certResult.ok) {
        expect(certResult.problems).toContainEqual({
          type: "independent-authority-not-durable",
        });
      }
    }
  });

  it("29. adversarial: TestHarnessTrustRoot cannot mint durable authority even if productionAuthorityEligible: true and attestation attached", () => {
    const maliciousGrantBase: RegisteredAuthorityGrant = {
      ...activeGrantBase,
      grantId: "grant-malicious-test-root-01",
      productionAuthorityEligible: true,
      trustRoot: createTestMechanicsTrustRoot(),
    };
    const maliciousGrant: RegisteredAuthorityGrant = {
      ...maliciousGrantBase,
      attestation: signAndVerifyTestGrant(maliciousGrantBase),
    };

    const maliciousRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [maliciousGrant],
    });

    // Default requireProductionAuthority: true MUST fail closed
    const res = resolveCalibrationAuthority(
      {
        grantId: "grant-malicious-test-root-01",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      maliciousRegistry,
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reasonCodes).toContain("grant-ineligible-for-production-authority");
    }

    // Benchmark with TestHarnessTrustRoot also fails closed under production authority gate
    const maliciousBenchmark: RegisteredBenchmarkArtifact = {
      ...sampleBenchmark,
      benchmarkId: "bench-malicious-test-root-01",
      productionAuthorityEligible: true,
      trustRoot: createTestMechanicsTrustRoot(),
    };
    const grantForMaliciousBenchBase: RegisteredAuthorityGrant = {
      ...activeGrantBase,
      grantId: "grant-malicious-bench-01",
      benchmarkArtifactId: "bench-malicious-test-root-01",
      productionAuthorityEligible: true,
    };
    const grantForMaliciousBench: RegisteredAuthorityGrant = {
      ...grantForMaliciousBenchBase,
      attestation: signAndVerifyTestGrant(grantForMaliciousBenchBase),
    };

    const benchRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [maliciousBenchmark],
      grants: [grantForMaliciousBench],
    });

    const resBench = resolveCalibrationAuthority(
      {
        grantId: "grant-malicious-bench-01",
        observation: {
          ...validAuthoritativeObservation,
          calibration: {
            ...validAuthoritativeObservation.calibration,
            benchmarkId: "bench-malicious-test-root-01",
          },
        },
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      benchRegistry,
    );

    expect(resBench.ok).toBe(false);
    if (!resBench.ok) {
      expect(resBench.reasonCodes).toContain("benchmark-ineligible-for-production-authority");
    }
  });

  it("30. adversarial: module-private brands and WeakSets prevent in-process forging of durable authority tokens", () => {
    const forgedToken = {
      isProductionEligible: true,
      grantId: "grant-phonology-active-001",
      grantVersion: "1.0.0",
      benchmarkId: "bench-phonology-v1",
      benchmarkFingerprint: "sha256-bench-phonology-digest-12345",
      modelFingerprint: "sha256-model-weights-abcde",
      authority: "assessment-candidate" as const,
      decision: "assessment" as const,
      scope: validAuthoritativeObservation.calibration.scope,
      resolvedAt: "2026-09-04T00:00:01.000Z",
    };

    // External caller cannot add to private WeakSet
    expect(isResolvedDurableCalibrationAuthority(forgedToken)).toBe(false);
    expect(isResolvedContractAuthority(forgedToken)).toBe(false);

    const candidate = {
      eventId: "ev-forge-001",
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
      forgedToken as never,
    );

    expect(certResult.ok).toBe(false);
    if (!certResult.ok) {
      expect(certResult.problems).toContainEqual({
        type: "independent-authority-not-resolved",
      });
    }
  });

  it("31. adversarial: self-declared raw attestation cannot bypass verification gate", () => {
    const rawAttestation: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-hmac-01",
      manifestDigest: "sha256:fake-digest-12345",
      signature: "deadbeefcafebabe0123456789abcdef",
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    expect(isVerifiedAuthorityAttestation(rawAttestation)).toBe(false);

    const unverifiedGrant: RegisteredAuthorityGrant = {
      ...activeGrantBase,
      grantId: "grant-unverified-raw-attestation",
      attestation: rawAttestation,
    };

    const unverifiedRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [unverifiedGrant],
    });

    const res = resolveCalibrationAuthority(
      {
        grantId: "grant-unverified-raw-attestation",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      unverifiedRegistry,
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reasonCodes).toContain("grant-attestation-unverified");
    }
  });

  it("32. adversarial: attestation signed by unknown trust anchor fails closed with trust-anchor-unknown", () => {
    const payload = extractGrantManifestPayload(activeGrantBase);
    const digest = computeCanonicalManifestDigest(payload);
    const signature = crypto.createHmac("sha256", "random-secret").update(digest, "utf8").digest("hex");

    const raw: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "unknown-rogue-anchor-999",
      manifestDigest: digest,
      signature,
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    const verifyResult = verifyAuthorityManifest(raw, payload, testAnchorRegistry, "2026-09-04T00:00:01.000Z");
    expect(verifyResult.ok).toBe(false);
    if (!verifyResult.ok) {
      expect(verifyResult.reasonCode).toBe("trust-anchor-unknown");
    }
  });

  it("33. adversarial: attestation valid for Grant A cannot be replayed on Grant B (attestation-payload-mismatch)", () => {
    const grantA = activeGrant;

    const grantBBase: RegisteredAuthorityGrant = {
      ...activeGrantBase,
      grantId: "grant-phonology-other-002",
      validUntil: "2028-01-01T00:00:00.000Z",
    };

    // Attacker steals attestation from grant A and attaches it to grant B
    const grantBSpoofed: RegisteredAuthorityGrant = {
      ...grantBBase,
      attestation: grantA.attestation,
    };

    const spoofRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [grantBSpoofed],
    });

    const res = resolveCalibrationAuthority(
      {
        grantId: "grant-phonology-other-002",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      spoofRegistry,
    );

    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reasonCodes).toContain("attestation-payload-mismatch");
    }
  });

  it("34. adversarial: tampered manifest digest or payload modification fails closed with attestation-payload-mismatch", () => {
    const payload = extractGrantManifestPayload(activeGrantBase);
    const digest = computeCanonicalManifestDigest(payload);
    const signature = crypto.createHmac("sha256", testSecret).update(digest, "utf8").digest("hex");

    const raw: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-hmac-01",
      manifestDigest: digest,
      signature,
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    // Tamper with payload: alter modelFingerprint
    const tamperedPayload = {
      ...payload,
      evaluatorBinding: {
        ...payload.evaluatorBinding,
        modelFingerprint: "sha256-tampered-weights-00000",
      },
    };

    const res = verifyAuthorityManifest(raw, tamperedPayload, testAnchorRegistry, "2026-09-04T00:00:01.000Z");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reasonCode).toBe("attestation-payload-mismatch");
    }
  });

  it("35. adversarial: corrupted cryptographic signatures fail closed with attestation-signature-invalid", () => {
    const payload = extractGrantManifestPayload(activeGrantBase);
    const digest = computeCanonicalManifestDigest(payload);

    // Corrupt HMAC signature
    const badHmacRaw: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-hmac-01",
      manifestDigest: digest,
      signature: "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    const hmacRes = verifyAuthorityManifest(badHmacRaw, payload, testAnchorRegistry, "2026-09-04T00:00:01.000Z");
    expect(hmacRes.ok).toBe(false);
    if (!hmacRes.ok) {
      expect(hmacRes.reasonCode).toBe("attestation-signature-invalid");
    }

    // Corrupt Ed25519 signature
    const badEd25519Raw: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-ed25519-01",
      manifestDigest: digest,
      signature: Buffer.alloc(64, 0xaa).toString("hex"),
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    const edRes = verifyAuthorityManifest(badEd25519Raw, payload, testAnchorRegistry, "2026-09-04T00:00:01.000Z");
    expect(edRes.ok).toBe(false);
    if (!edRes.ok) {
      expect(edRes.reasonCode).toBe("attestation-signature-invalid");
    }
  });

  it("36. adversarial: revoked trust anchor fails closed with trust-anchor-inactive-revoked", () => {
    const payload = extractGrantManifestPayload(activeGrantBase);
    const digest = computeCanonicalManifestDigest(payload);
    const signature = crypto.createHmac("sha256", testSecret).update(digest, "utf8").digest("hex");

    const raw: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-revoked-01",
      manifestDigest: digest,
      signature,
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    const res = verifyAuthorityManifest(raw, payload, testAnchorRegistry, "2026-09-04T00:00:01.000Z");
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.reasonCode).toBe("trust-anchor-inactive-revoked");
    }
  });

  it("37. adversarial: expired trust anchor fails closed with trust-anchor-inactive-expired", () => {
    const payload = extractGrantManifestPayload(activeGrantBase);
    const digest = computeCanonicalManifestDigest(payload);
    const signature = crypto.createHmac("sha256", testSecret).update(digest, "utf8").digest("hex");

    // Static expired anchor
    const rawExpired: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-expired-01",
      manifestDigest: digest,
      signature,
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    const res1 = verifyAuthorityManifest(rawExpired, payload, testAnchorRegistry, "2026-09-04T00:00:01.000Z");
    expect(res1.ok).toBe(false);
    if (!res1.ok) {
      expect(res1.reasonCode).toBe("trust-anchor-inactive-expired");
    }

    // Active anchor evaluated beyond validUntil (2028-01-01)
    const rawActive: RawAuthorityAttestation = {
      kind: "raw-cryptographic-attestation",
      anchorId: "anchor-test-hmac-01",
      manifestDigest: digest,
      signature,
      attestedAt: "2026-09-01T00:00:00.000Z",
    };

    const res2 = verifyAuthorityManifest(rawActive, payload, testAnchorRegistry, "2029-01-01T00:00:00.000Z");
    expect(res2.ok).toBe(false);
    if (!res2.ok) {
      expect(res2.reasonCode).toBe("trust-anchor-inactive-expired");
    }
  });

  it("38. verifies authentic Ed25519 attestation, resolves durable authority and certifies evidence", () => {
    const edGrantBase: RegisteredAuthorityGrant = {
      ...activeGrantBase,
      grantId: "grant-phonology-ed25519-01",
    };

    const verifiedAttestation = signAndVerifyTestGrant(
      edGrantBase,
      testAnchorEd25519,
      edPrivateKey,
      "2026-09-01T00:00:00.000Z",
      "2026-09-04T00:00:01.000Z",
    );

    const edGrant: RegisteredAuthorityGrant = {
      ...edGrantBase,
      attestation: verifiedAttestation,
    };

    const edRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [edGrant],
    });

    const res = resolveCalibrationAuthority(
      {
        grantId: "grant-phonology-ed25519-01",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
      },
      edRegistry,
    );

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    expect(isResolvedDurableCalibrationAuthority(res.resolvedGrant)).toBe(true);
    if (!isResolvedDurableCalibrationAuthority(res.resolvedGrant)) return;

    const candidate = {
      eventId: "ev-ed25519-001",
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

    const cert = certifyCoreEvidence(validTask, validAuthoritativeObservation, candidate, res.resolvedGrant);
    expect(cert.ok).toBe(true);
    if (cert.ok) {
      expect(cert.evidence.authorityScope).toBe("durable-assessment");
    }
  });

  it("39. contract and reference paths remain fully operational with ResolvedContractAuthority", () => {
    const testMechanicsGrant = createTestMechanicsAuthorityGrant({
      ...activeGrantBase,
      grantId: "grant-contract-only-01",
      productionAuthorityEligible: false,
    });

    const contractRegistry = createProvenanceAuthorityRegistry({
      benchmarks: [sampleBenchmark],
      grants: [testMechanicsGrant],
    });

    const res = resolveCalibrationAuthority(
      {
        grantId: "grant-contract-only-01",
        observation: validAuthoritativeObservation,
        task: validTask,
        evaluationTimestamp: "2026-09-04T00:00:01.000Z",
        requireProductionAuthority: false,
      },
      contractRegistry,
    );

    expect(res.ok).toBe(true);
    if (!res.ok) return;

    expect(isResolvedContractAuthority(res.resolvedGrant)).toBe(true);
    expect(isResolvedDurableCalibrationAuthority(res.resolvedGrant)).toBe(false);
    expect(res.resolvedGrant.isProductionEligible).toBe(false);

    const candidate = {
      eventId: "ev-contract-001",
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

    // Must fail closed under durable certification
    const cert = certifyCoreEvidence(validTask, validAuthoritativeObservation, candidate, res.resolvedGrant as never);
    expect(cert.ok).toBe(false);
    if (!cert.ok) {
      expect(cert.problems).toContainEqual({
        type: "independent-authority-not-durable",
      });
    }
  });

  it("40. deterministic replay: canonical manifest digest is key-order independent and reproducible", () => {
    const payloadA = extractGrantManifestPayload(activeGrantBase);

    // Construct payloadB with reverse key insertion order
    const payloadB: any = {};
    for (const key of Object.keys(payloadA).reverse()) {
      payloadB[key] = (payloadA as any)[key];
    }

    const digestA = computeCanonicalManifestDigest(payloadA);
    const digestB = computeCanonicalManifestDigest(payloadB);

    expect(digestA).toBe(digestB);
    expect(digestA.startsWith("sha256:")).toBe(true);
    expect(digestA.length).toBe(71); // "sha256:" + 64 hex chars
  });
});

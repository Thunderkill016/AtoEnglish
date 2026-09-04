import { describe, expect, it } from "vitest";

import {
  VETTED_OSS_CONTRACT_ID,
  VETTED_OSS_CONTRACT_VERSION,
  VETTED_PACKAGE_IDS,
  VETTED_OSS_REGISTRY,
  getVettedPackage,
  listVettedPackages,
  isPermissiveLicense,
  validateLicenseCompatibility,
  validateVettedPackageDescriptor,
  evaluateReuseDecision,
  createVettedCoreObservation,
  FORBIDDEN_OBSERVATION_FIELDS,
  type VettedPackageDescriptor,
} from "./vetted-oss";

import {
  canAffectDurableAssessment,
  canBecomeMasteryCandidate,
  calibrationCoversObservation,
} from "./observation";

import { createMockAsrAdapter } from "./adapters/asr-adapter";
import { createMockVadAdapter } from "./adapters/vad-adapter";
import { createMockLinguisticAdapter } from "./adapters/linguistic-adapter";
import { createMockAlignmentAdapter } from "./adapters/alignment-adapter";
import { computeBktForwardStep, createBktBaselineComparator } from "./adapters/bkt-adapter";

describe("nep.vetted-oss-matrix.v1: Registry Completeness & Cryptographic Provenance", () => {
  it("exports stable contract constants", () => {
    expect(VETTED_OSS_CONTRACT_ID).toBe("nep.vetted-oss-matrix.v1");
    expect(VETTED_OSS_CONTRACT_VERSION).toBe(1);
  });

  it("contains all 12 audited packages with valid 40-character hexadecimal commit SHAs", () => {
    expect(VETTED_PACKAGE_IDS.length).toBe(12);

    const hex40Regex = /^[0-9a-f]{40}$/i;

    for (const id of VETTED_PACKAGE_IDS) {
      const pkg = getVettedPackage(id);
      expect(pkg).toBeDefined();
      if (!pkg) continue;

      expect(pkg.id).toBe(id);
      expect(pkg.name.length).toBeGreaterThan(0);
      expect(pkg.capability.length).toBeGreaterThan(0);
      expect(pkg.upstreamUrl.startsWith("https://github.com/")).toBe(true);
      expect(pkg.pinnedTag.length).toBeGreaterThan(0);

      // P1 Blocker requirement: pinnedCommit must be a full 40-character hexadecimal SHA
      expect(pkg.pinnedCommit).toMatch(hex40Regex);
      expect(pkg.pinnedCommit.length).toBe(40);
      expect(pkg.pinnedCommit.startsWith("v")).toBe(false);

      expect(pkg.runtime.length).toBeGreaterThan(0);
      expect(pkg.footprint.ramMb).toBeGreaterThan(0);
      expect(pkg.footprint.diskMb).toBeGreaterThan(0);
      expect(typeof pkg.offlineSelfHostable).toBe("boolean");
      expect(pkg.attributionNotice.length).toBeGreaterThan(0);
      expect(pkg.adapterContract.length).toBeGreaterThan(0);

      // Explicit uncertainty representations
      expect(pkg.modelLicenseNotes).toBeDefined();
      expect(pkg.footprintNotes).toBeDefined();

      // Descriptor runtime validation passes
      const descriptorCheck = validateVettedPackageDescriptor(pkg);
      expect(descriptorCheck.valid).toBe(true);
    }
  });

  it("filters packages by integration mode and capability substring", () => {
    const directLibs = listVettedPackages({ mode: "direct-library" });
    expect(directLibs.some((p) => p.id === "silero-vad")).toBe(true);
    expect(directLibs.some((p) => p.id === "cmusphinx-cmudict")).toBe(true);
    expect(directLibs.some((p) => p.id === "open-spaced-repetition-ts-fsrs")).toBe(true);

    const isolatedServices = listVettedPackages({ mode: "isolated-service" });
    expect(isolatedServices.some((p) => p.id === "systran-faster-whisper")).toBe(true);
    expect(isolatedServices.some((p) => p.id === "languagetool")).toBe(true);
    expect(isolatedServices.some((p) => p.id === "explosion-spacy")).toBe(true);

    const baselineDonors = listVettedPackages({ mode: "baseline-donor" });
    expect(baselineDonors.some((p) => p.id === "cahlr-pybkt")).toBe(true);
    expect(baselineDonors.some((p) => p.id === "openai-whisper")).toBe(true);

    const speechTools = listVettedPackages({ capabilitySubstring: "speech" });
    expect(speechTools.length).toBeGreaterThanOrEqual(3);
  });
});

describe("nep.vetted-oss-matrix.v1: Descriptor Validation Fail-Closed Defense", () => {
  it("rejects descriptors with short commit SHAs or tag strings stored in commit field", () => {
    const validPkg = getVettedPackage("silero-vad")!;

    // Case 1: Tag name stored in commit field
    const tagInCommit = { ...validPkg, pinnedCommit: "v6.2" };
    const check1 = validateVettedPackageDescriptor(tagInCommit);
    expect(check1.valid).toBe(false);
    expect(check1.reason).toContain("pinnedCommit must be a valid 40-character hexadecimal git commit SHA");

    // Case 2: Short 7-character commit SHA
    const shortSha = { ...validPkg, pinnedCommit: "be95df9" };
    const check2 = validateVettedPackageDescriptor(shortSha);
    expect(check2.valid).toBe(false);
    expect(check2.reason).toContain("pinnedCommit must be a valid 40-character hexadecimal git commit SHA");

    // Case 3: Blank commit
    const blankCommit = { ...validPkg, pinnedCommit: "   " };
    const check3 = validateVettedPackageDescriptor(blankCommit);
    expect(check3.valid).toBe(false);

    // Case 4: Non-hex characters
    const fakeCommit = { ...validPkg, pinnedCommit: "z".repeat(40) };
    const check4 = validateVettedPackageDescriptor(fakeCommit);
    expect(check4.valid).toBe(false);
  });

  it("rejects descriptors with malformed upstream URLs, missing fields, or invalid footprints", () => {
    const validPkg = getVettedPackage("silero-vad")!;

    // Malformed URL
    const badUrl = { ...validPkg, upstreamUrl: "http://insecure-site.com" };
    expect(validateVettedPackageDescriptor(badUrl).valid).toBe(false);

    // Missing attribution
    const noAttr = { ...validPkg, attributionNotice: "" };
    expect(validateVettedPackageDescriptor(noAttr).valid).toBe(false);

    // Zero or negative footprint
    const badFootprint = { ...validPkg, footprint: { ramMb: -10, diskMb: 0, gpuRequired: false } };
    expect(validateVettedPackageDescriptor(badFootprint).valid).toBe(false);
  });
});

describe("nep.vetted-oss-matrix.v1: Independent Code vs Model License Compatibility", () => {
  it("approves permissive code with permissive or not-applicable model licenses", () => {
    expect(isPermissiveLicense("permissive-mit")).toBe(true);
    expect(isPermissiveLicense("permissive-apache2")).toBe(true);
    expect(isPermissiveLicense("permissive-bsd")).toBe(true);
    expect(isPermissiveLicense("copyleft-lgpl")).toBe(false);
    expect(isPermissiveLicense("copyleft-gpl")).toBe(false);

    const check = validateLicenseCompatibility("permissive-mit", "permissive-mit", "direct-library");
    expect(check.valid).toBe(true);
    expect(check.copyleftIsolated).toBe(true);
  });

  it("strictly fails closed when permissive code has copyleft GPL model/data under direct linking", () => {
    // Permissive code must NOT auto-approve incompatible model/data!
    const directGplModel = validateLicenseCompatibility("permissive-mit", "copyleft-gpl", "direct-library");
    expect(directGplModel.valid).toBe(false);
    expect(directGplModel.reason).toContain("Direct bundling of GPL-3.0 model/data into Core TypeScript distribution is forbidden");

    const adaptGplModel = validateLicenseCompatibility("permissive-mit", "copyleft-gpl", "source-adaptation");
    expect(adaptGplModel.valid).toBe(false);
    expect(adaptGplModel.reason).toContain("Direct adaptation of GPL-3.0 data into Core TypeScript repository is forbidden");
  });

  it("strictly fails closed when permissive code has copyleft LGPL model/data under direct linking", () => {
    const directLgplModel = validateLicenseCompatibility("permissive-mit", "copyleft-lgpl", "direct-library");
    expect(directLgplModel.valid).toBe(false);
    expect(directLgplModel.reason).toContain("Direct bundling of LGPL model/data into Core TypeScript distribution is forbidden; must use isolated-service");
  });

  it("strictly rejects direct linking of LGPL into core TS while allowing isolated services", () => {
    const directCheck = validateLicenseCompatibility("copyleft-lgpl", "copyleft-lgpl", "direct-library");
    expect(directCheck.valid).toBe(false);
    expect(directCheck.reason).toContain("Direct bundling of LGPL code into Core TypeScript");

    const isolatedCheck = validateLicenseCompatibility("copyleft-lgpl", "copyleft-lgpl", "isolated-service");
    expect(isolatedCheck.valid).toBe(true);
    expect(isolatedCheck.copyleftIsolated).toBe(true);
  });

  it("strictly rejects direct linking of GPLv3 copyleft code", () => {
    const gplCheck = validateLicenseCompatibility("copyleft-gpl", "copyleft-gpl", "direct-library");
    expect(gplCheck.valid).toBe(false);
    expect(gplCheck.reason).toContain("Direct linking of GPL-3.0 copyleft code");
  });

  it("fails closed on non-commercial or unapproved licenses across code or model", () => {
    const ncCodeCheck = validateLicenseCompatibility("non-commercial", "not-applicable", "direct-library");
    expect(ncCodeCheck.valid).toBe(false);
    expect(ncCodeCheck.reason).toContain("Non-commercial licenses are strictly forbidden");

    const ncModelCheck = validateLicenseCompatibility("permissive-mit", "non-commercial", "direct-library");
    expect(ncModelCheck.valid).toBe(false);
    expect(ncModelCheck.reason).toContain("Non-commercial licenses are strictly forbidden");

    const unapprovedModelCheck = validateLicenseCompatibility("permissive-mit", "unapproved", "isolated-service");
    expect(unapprovedModelCheck.valid).toBe(false);
    expect(unapprovedModelCheck.reason).toContain("Unapproved license is rejected fail-closed");
  });
});

describe("nep.vetted-oss-matrix.v1: 5-Tier Reuse Decision Hierarchy", () => {
  it("correctly assigns tiers across all audited packages", () => {
    const vad = getVettedPackage("silero-vad");
    expect(vad).toBeDefined();
    if (vad) {
      const decision = evaluateReuseDecision(vad);
      expect(decision.decisionTier).toBe(1);
      expect(decision.status).toBe("approved");
      expect(decision.mode).toBe("direct-library");
    }

    const fasterWhisper = getVettedPackage("systran-faster-whisper");
    expect(fasterWhisper).toBeDefined();
    if (fasterWhisper) {
      const decision = evaluateReuseDecision(fasterWhisper);
      expect(decision.decisionTier).toBe(3);
      expect(decision.status).toBe("approved");
      expect(decision.mode).toBe("isolated-service");
    }

    const pyBkt = getVettedPackage("cahlr-pybkt");
    expect(pyBkt).toBeDefined();
    if (pyBkt) {
      const decision = evaluateReuseDecision(pyBkt);
      expect(decision.decisionTier).toBe(4);
      expect(decision.status).toBe("approved");
      expect(decision.mode).toBe("baseline-donor");
    }

    const phonemizer = getVettedPackage("bootphon-phonemizer");
    expect(phonemizer).toBeDefined();
    if (phonemizer) {
      const decision = evaluateReuseDecision(phonemizer);
      expect(decision.decisionTier).toBe(5);
      expect(decision.status).toBe("rejected");
      expect(decision.mode).toBe("rejected");
    }
  });

  it("reconciles openai/whisper as baseline-donor across registry and reuse decision", () => {
    const whisper = getVettedPackage("openai-whisper");
    expect(whisper).toBeDefined();
    if (whisper) {
      expect(whisper.integrationMode).toBe("baseline-donor");
      const decision = evaluateReuseDecision(whisper);
      expect(decision.decisionTier).toBe(4);
      expect(decision.mode).toBe("baseline-donor");
      expect(decision.status).toBe("approved");
    }
  });

  it("fails closed to Tier 5 rejected if package descriptor validation fails", () => {
    const corruptedPkg: VettedPackageDescriptor = {
      ...getVettedPackage("silero-vad")!,
      pinnedCommit: "not-a-40-hex-commit",
    };
    const decision = evaluateReuseDecision(corruptedPkg);
    expect(decision.decisionTier).toBe(5);
    expect(decision.status).toBe("rejected");
    expect(decision.justification).toContain("Descriptor validation failed");
  });
});

describe("nep.vetted-oss-matrix.v1: Adapter Purity & Byte-Deterministic Replay (Blocker 1)", () => {
  const fixedTimestamp = "2026-09-05T00:00:00.000Z";

  it("AsrAdapterContract produces byte-deterministic raw payload given same inputs and explicit timestamp", async () => {
    const asr = createMockAsrAdapter("the quick brown fox");
    const req = {
      audioData: new Uint8Array([1, 2, 3, 4]),
      sampleRateHz: 16000,
      durationMs: 1500,
      occurredAt: fixedTimestamp,
    };

    const res1 = await asr.transcribe(req);
    const res2 = await asr.transcribe(req);

    expect(res1.ok).toBe(true);
    expect(res2.ok).toBe(true);
    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    if (res1.ok) {
      expect(res1.payload.kind).toBe("asr-transcription");
      expect(res1.payload.occurredAt).toBe(fixedTimestamp);
      expect(Object.hasOwn(res1.payload, "mastery")).toBe(false);
      expect(Object.hasOwn(res1.payload, "authority")).toBe(false);
    }
  });

  it("AsrAdapterContract fails closed when occurredAt timestamp is missing or invalid", async () => {
    const asr = createMockAsrAdapter();
    const res = await asr.transcribe({
      audioData: new Uint8Array([1, 2]),
      sampleRateHz: 16000,
      durationMs: 1000,
      occurredAt: "invalid-date-string",
    });
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.code).toBe("invalid-timestamp");
    }
  });

  it("VadAdapterContract produces byte-deterministic raw payload given explicit timestamp", async () => {
    const vad = createMockVadAdapter([{ startMs: 100, endMs: 900 }]);
    const req = {
      audioData: new Float32Array([0.1, 0.2]),
      sampleRateHz: 16000,
      durationMs: 1000,
      occurredAt: fixedTimestamp,
    };

    const res1 = await vad.detectActivity(req);
    const res2 = await vad.detectActivity(req);

    expect(res1.ok).toBe(true);
    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    if (res1.ok) {
      expect(res1.payload.kind).toBe("vad-speech");
      expect(res1.payload.occurredAt).toBe(fixedTimestamp);
    }
  });

  it("LinguisticAdapterContract produces byte-deterministic raw payload given explicit timestamp", async () => {
    const linguistic = createMockLinguisticAdapter();
    const req = {
      text: "she go to school yesterday",
      enableGrammarCheck: true,
      occurredAt: fixedTimestamp,
    };

    const res1 = await linguistic.analyze(req);
    const res2 = await linguistic.analyze(req);

    expect(res1.ok).toBe(true);
    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    if (res1.ok) {
      expect(res1.payload.kind).toBe("linguistic-annotation");
      expect(res1.payload.occurredAt).toBe(fixedTimestamp);
    }
  });

  it("AlignmentAdapterContract produces byte-deterministic raw payload given explicit timestamp", async () => {
    const aligner = createMockAlignmentAdapter();
    const req = {
      audioData: new Uint8Array([10, 20]),
      sampleRateHz: 16000,
      durationMs: 1200,
      transcript: "cat",
      occurredAt: fixedTimestamp,
    };

    const res1 = await aligner.align(req);
    const res2 = await aligner.align(req);

    expect(res1.ok).toBe(true);
    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    if (res1.ok) {
      expect(res1.payload.kind).toBe("phoneme-alignment");
      expect(res1.payload.occurredAt).toBe(fixedTimestamp);
    }
  });

  it("BktAdapterContract produces byte-deterministic forward step given explicit timestamp", () => {
    const bkt = createBktBaselineComparator();
    const req = {
      constructId: "phoneme-ae",
      priorMastery: 0.2,
      correct: true,
      occurredAt: fixedTimestamp,
    };

    const res1 = bkt.step(req);
    const res2 = bkt.step(req);

    expect(JSON.stringify(res1)).toBe(JSON.stringify(res2));
    expect(res1.kind).toBe("bkt-comparator");
    expect(res1.occurredAt).toBe(fixedTimestamp);

    // Verify mathematical calculation fidelity (Corbett & Anderson 1994)
    const calc = computeBktForwardStep(0.2, true, {
      pInit: 0.2,
      pTransit: 0.15,
      pGuess: 0.2,
      pSlip: 0.1,
    });
    expect(calc.posteriorMastery).toBeCloseTo((0.2 * 0.9) / (0.2 * 0.9 + 0.8 * 0.2), 4);
  });
});

describe("nep.vetted-oss-matrix.v1: Canonical CoreObservation Envelope & Anti-Injection Gate (Blocker 2)", () => {
  const fixedTimestamp = "2026-09-05T00:00:00.000Z";

  it("safely wraps an ASR raw payload into a canonical CoreObservation with authority: 'none' and shadow calibration", async () => {
    const asr = createMockAsrAdapter("hello world");
    const result = await asr.transcribe({
      audioData: new Uint8Array([1, 2, 3]),
      sampleRateHz: 16000,
      durationMs: 1000,
      occurredAt: fixedTimestamp,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const coreObs = createVettedCoreObservation({
      targetId: "learner_42",
      activity: "spoken-production",
      payload: result.payload,
      confidence: 0.95,
      evaluator: "systran-faster-whisper",
      construct: "speech-transcription",
      populationTags: ["l1-vi", "cefr-a2"],
      occurredAt: fixedTimestamp,
    });

    // Invariant 1: CoreObservation contract compliance
    expect(coreObs.targetId).toBe("learner_42");
    expect(coreObs.activity).toBe("spoken-production");
    expect(coreObs.createdAt).toBe(fixedTimestamp);
    expect(coreObs.confidence).toBe(0.95);
    expect(coreObs.provenance.evaluator).toBe("systran-faster-whisper");

    // Invariant 2: Strictly unvalidated shadow calibration and authority: "none"
    expect(coreObs.authority).toBe("none");
    expect(coreObs.calibration.validationState).toBe("unvalidated");
    expect(coreObs.calibration.decision).toBe("shadow");
    expect(coreObs.calibration.metrics.sampleSize).toBe(0);

    // Invariant 3: Cannot affect durable assessment or mastery
    expect(canAffectDurableAssessment(coreObs)).toBe(false);
    expect(canBecomeMasteryCandidate(coreObs)).toBe(false);
    expect(calibrationCoversObservation(coreObs)).toBe(false);
  });

  it("strictly fails closed when an adversary attempts to inject authority or mastery fields into payload", () => {
    for (const forbiddenKey of FORBIDDEN_OBSERVATION_FIELDS) {
      const maliciousPayload = {
        kind: "asr-transcription" as const,
        text: "exploit test",
        durationMs: 1000,
        tokens: [],
        noSpeechProbability: 0,
        engine: "mock",
        occurredAt: fixedTimestamp,
        [forbiddenKey]: "injected-value",
      };

      expect(() =>
        createVettedCoreObservation({
          targetId: "learner_exploit",
          activity: "spoken-production",
          payload: maliciousPayload as any,
          evaluator: "mock-attacker",
          construct: "exploit",
          occurredAt: fixedTimestamp,
        })
      ).toThrowError(/Forbidden authority\/mastery field injected/);
    }
  });

  it("strictly fails closed when an adversary attempts to inject authority or mastery fields into options", () => {
    const benignPayload = {
      kind: "asr-transcription" as const,
      text: "test",
      durationMs: 1000,
      tokens: [],
      noSpeechProbability: 0,
      engine: "mock",
      occurredAt: fixedTimestamp,
    };

    expect(() =>
      createVettedCoreObservation({
        targetId: "learner_exploit",
        activity: "spoken-production",
        payload: benignPayload,
        evaluator: "mock-attacker",
        construct: "exploit",
        occurredAt: fixedTimestamp,
        ...({ authority: "mastery-candidate" } as any),
      })
    ).toThrowError(/Forbidden authority\/mastery field injected/);
  });

  it("strictly fails closed on missing or invalid timestamp", () => {
    const benignPayload = {
      kind: "asr-transcription" as const,
      text: "test",
      durationMs: 1000,
      tokens: [],
      noSpeechProbability: 0,
      engine: "mock",
      occurredAt: fixedTimestamp,
    };

    expect(() =>
      createVettedCoreObservation({
        targetId: "learner_exploit",
        activity: "spoken-production",
        payload: benignPayload,
        evaluator: "mock",
        construct: "test",
        occurredAt: "not-a-date",
      })
    ).toThrowError(/Valid occurredAt ISO timestamp string is required/);
  });
});


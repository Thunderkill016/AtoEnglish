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
  evaluateReuseDecision,
} from "./vetted-oss";

import { createMockAsrAdapter } from "./adapters/asr-adapter";
import { createMockVadAdapter } from "./adapters/vad-adapter";
import { createMockLinguisticAdapter } from "./adapters/linguistic-adapter";
import { createMockAlignmentAdapter } from "./adapters/alignment-adapter";
import { computeBktForwardStep, createBktBaselineComparator } from "./adapters/bkt-adapter";

describe("nep.vetted-oss-matrix.v1: Registry Completeness & Provenance", () => {
  it("exports stable contract constants", () => {
    expect(VETTED_OSS_CONTRACT_ID).toBe("nep.vetted-oss-matrix.v1");
    expect(VETTED_OSS_CONTRACT_VERSION).toBe(1);
  });

  it("contains all 12 audited packages with pinned commits and explicit licenses", () => {
    expect(VETTED_PACKAGE_IDS.length).toBe(12);

    for (const id of VETTED_PACKAGE_IDS) {
      const pkg = getVettedPackage(id);
      expect(pkg).toBeDefined();
      if (!pkg) continue;

      expect(pkg.id).toBe(id);
      expect(pkg.name.length).toBeGreaterThan(0);
      expect(pkg.capability.length).toBeGreaterThan(0);
      expect(pkg.upstreamUrl.startsWith("https://github.com/")).toBe(true);
      expect(pkg.pinnedTag.length).toBeGreaterThan(0);
      expect(pkg.pinnedCommit.length).toBeGreaterThan(0);
      expect(pkg.runtime.length).toBeGreaterThan(0);
      expect(pkg.footprint.ramMb).toBeGreaterThan(0);
      expect(pkg.footprint.diskMb).toBeGreaterThan(0);
      expect(typeof pkg.offlineSelfHostable).toBe("boolean");
      expect(pkg.attributionNotice.length).toBeGreaterThan(0);
      expect(pkg.adapterContract.length).toBeGreaterThan(0);
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

describe("nep.vetted-oss-matrix.v1: License Compatibility & Copyleft Isolation", () => {
  it("approves permissive licenses under direct library dependency", () => {
    expect(isPermissiveLicense("permissive-mit")).toBe(true);
    expect(isPermissiveLicense("permissive-apache2")).toBe(true);
    expect(isPermissiveLicense("permissive-bsd")).toBe(true);
    expect(isPermissiveLicense("copyleft-lgpl")).toBe(false);
    expect(isPermissiveLicense("copyleft-gpl")).toBe(false);

    const check = validateLicenseCompatibility("permissive-mit", "permissive-mit", "direct-library");
    expect(check.valid).toBe(true);
    expect(check.copyleftIsolated).toBe(true);
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

  it("fails closed on non-commercial or unapproved licenses", () => {
    const ncCheck = validateLicenseCompatibility("non-commercial", "not-applicable", "direct-library");
    expect(ncCheck.valid).toBe(false);
    expect(ncCheck.reason).toContain("Non-commercial licenses are strictly forbidden");

    const unapprovedCheck = validateLicenseCompatibility("unapproved", "not-applicable", "isolated-service");
    expect(unapprovedCheck.valid).toBe(false);
    expect(unapprovedCheck.reason).toContain("Unapproved license is rejected fail-closed");
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
});

describe("nep.vetted-oss-matrix.v1: Adapter Contracts & Observation Boundaries", () => {
  it("AsrAdapterContract produces raw observation without authority fields", async () => {
    const asr = createMockAsrAdapter("the quick brown fox");
    const res = await asr.transcribe({
      audioData: new Uint8Array([1, 2, 3]),
      sampleRateHz: 16000,
      durationMs: 1500,
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.observation.observationType).toBe("asr-transcription");
      expect(res.observation.text).toBe("the quick brown fox");
      expect(res.observation.tokens.length).toBe(4);
      expect(Object.hasOwn(res.observation, "mastery")).toBe(false);
      expect(Object.hasOwn(res.observation, "calibrationGrant")).toBe(false);
    }

    const failRes = await asr.transcribe({
      audioData: new Uint8Array(),
      sampleRateHz: 16000,
      durationMs: 0,
    });
    expect(failRes.ok).toBe(false);
  });

  it("VadAdapterContract detects speech activity intervals deterministically", async () => {
    const vad = createMockVadAdapter([{ startMs: 100, endMs: 900 }]);
    const res = await vad.detectActivity({
      audioData: new Float32Array([0.1, 0.2]),
      sampleRateHz: 16000,
      durationMs: 1000,
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.observation.observationType).toBe("vad-speech-detection");
      expect(res.observation.isSpeech).toBe(true);
      expect(res.observation.intervals).toEqual([{ startMs: 100, endMs: 900 }]);
      expect(res.observation.speechDurationMs).toBe(800);
      expect(Object.hasOwn(res.observation, "mastery")).toBe(false);
    }
  });

  it("LinguisticAdapterContract produces tokens and identifies grammatical issues", async () => {
    const linguistic = createMockLinguisticAdapter();
    const res = await linguistic.analyze({
      text: "she go to school yesterday",
      enableGrammarCheck: true,
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.observation.observationType).toBe("linguistic-annotation");
      expect(res.observation.tokens.length).toBe(5);
      expect(res.observation.grammarDiagnostics).toBeDefined();
      expect(res.observation.grammarDiagnostics?.length).toBe(1);
      expect(res.observation.grammarDiagnostics?.[0].ruleId).toBe("SUBJECT_VERB_AGREEMENT");
      expect(Object.hasOwn(res.observation, "mastery")).toBe(false);
    }

    const emptyRes = await linguistic.analyze({ text: "   " });
    expect(emptyRes.ok).toBe(false);
  });

  it("AlignmentAdapterContract time-aligns phonemes to speech frames", async () => {
    const aligner = createMockAlignmentAdapter();
    const res = await aligner.align({
      audioData: new Uint8Array([10, 20]),
      sampleRateHz: 16000,
      durationMs: 1200,
      transcript: "cat",
    });

    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.observation.observationType).toBe("phoneme-alignment");
      expect(res.observation.words.length).toBe(1);
      expect(res.observation.words[0].phonemes.length).toBe(3);
      expect(res.observation.words[0].phonemes[0].phone).toBe("c");
      expect(Object.hasOwn(res.observation, "mastery")).toBe(false);
    }
  });

  it("BktAdapterContract computes Corbett & Anderson forward step and isolates baseline", () => {
    const bkt = createBktBaselineComparator({
      pInit: 0.1,
      pTransit: 0.2,
      pGuess: 0.25,
      pSlip: 0.1,
      pForget: 0.0,
    });

    // Step 1: correct response
    const obs1 = bkt.step("phoneme-ae", 0.1, true);
    expect(obs1.observationType).toBe("bkt-baseline-comparator");
    expect(obs1.priorMastery).toBe(0.1);
    expect(obs1.posteriorMastery).toBeGreaterThan(0.1);
    expect(obs1.pNextState).toBeGreaterThan(obs1.posteriorMastery);
    expect(Object.hasOwn(obs1, "authority")).toBe(false);

    // Step 2: incorrect response drops posterior
    const obs2 = bkt.step("phoneme-ae", 0.8, false);
    expect(obs2.posteriorMastery).toBeLessThan(0.8);

    // Verify mathematical forward calculation
    const calc = computeBktForwardStep(0.2, true, {
      pInit: 0.2,
      pTransit: 0.15,
      pGuess: 0.2,
      pSlip: 0.1,
    });
    expect(calc.posteriorMastery).toBeCloseTo((0.2 * 0.9) / (0.2 * 0.9 + 0.8 * 0.2), 4);
  });
});

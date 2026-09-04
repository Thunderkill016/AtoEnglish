import { describe, expect, it } from "vitest";

import {
  isAllowedPronunciationAudioType,
  parseOpenPronounceProviderPayload,
  resolvePronunciationShadowTarget,
  toPronunciationShadowObservation,
} from "./openpronounce-shadow";

describe("OpenPronounce shadow boundary", () => {
  it("resolves the expected word from canonical IPA data instead of browser text", () => {
    const target = resolvePronunciationShadowTarget("th-voiceless");

    expect(target).not.toBeNull();
    expect(target?.soundId).toBe("th-voiceless");
    expect(target?.word.length).toBeGreaterThan(0);
    expect(target?.ipa).toContain("/");
    expect(resolvePronunciationShadowTarget("not-a-real-sound")).toBeNull();
  });

  it("accepts bounded browser audio types and rejects arbitrary uploads", () => {
    expect(isAllowedPronunciationAudioType("audio/webm;codecs=opus")).toBe(true);
    expect(isAllowedPronunciationAudioType("audio/wav")).toBe(true);
    expect(isAllowedPronunciationAudioType("application/octet-stream")).toBe(false);
    expect(isAllowedPronunciationAudioType("text/plain")).toBe(false);
  });

  it("parses the private provider payload and strips score/transcript from the public observation", () => {
    const target = resolvePronunciationShadowTarget("th-voiceless");
    expect(target).not.toBeNull();
    if (!target) return;

    const provider = parseOpenPronounceProviderPayload({
      provider: { name: "openpronounce", version: "0.3.0" },
      candidate_score: 81.3,
      acoustic_distance: 7.2,
      phoneme_error_rate: 0.18,
      word_error_rate: 0,
      errors: [
        {
          word: target.word,
          expected: "θɪŋk",
          actual: "tɪŋk",
          confidence: 0.91,
          phones: [
            { expected: "θ", heard: "t", confidence: 0.91 },
            { expected: "ɪ", heard: "ɪ", confidence: 0.97 },
          ],
        },
      ],
      prosody_summary: {
        f0_mean: 142.1,
        f0_std: 19.4,
        energy_mean: 0.08,
        energy_std: 0.02,
      },
      transcript: "this field is intentionally ignored by the schema boundary",
    });

    expect(provider).not.toBeNull();
    if (!provider) return;

    const observation = toPronunciationShadowObservation(target, provider);
    const serialized = JSON.stringify(observation);

    expect(observation.calibration).toBe("shadow-unvalidated");
    expect(observation.suspectedErrors[0]).toMatchObject({
      expectedPhones: "θɪŋk",
      observedPhones: "tɪŋk",
      confidence: 0.91,
    });
    expect(serialized).not.toContain("candidate_score");
    expect(serialized).not.toContain("transcript");
    expect(serialized).not.toContain("81.3");
  });

  it("fails closed on malformed or overconfident provider payloads", () => {
    expect(
      parseOpenPronounceProviderPayload({
        provider: { name: "openpronounce", version: "0.3.0" },
        errors: [{ word: "think", confidence: 4.2 }],
      }),
    ).toBeNull();

    expect(
      parseOpenPronounceProviderPayload({
        provider: { name: "some-other-provider", version: "1" },
      }),
    ).toBeNull();
  });

  it("enforces that client cannot author canonical target word or IPA", () => {
    // Target resolution strictly relies on soundId; client cannot supply an arbitrary word
    const valid = resolvePronunciationShadowTarget("th-voiceless");
    expect(valid).toEqual({
      soundId: "th-voiceless",
      word: "think",
      ipa: "/θɪŋk/",
    });

    // Malformed, oversized, or malicious soundIds fail closed
    expect(resolvePronunciationShadowTarget("")).toBeNull();
    expect(resolvePronunciationShadowTarget("   ")).toBeNull();
    expect(resolvePronunciationShadowTarget("a".repeat(81))).toBeNull();
    expect(resolvePronunciationShadowTarget("<script>alert(1)</script>")).toBeNull();
    expect(resolvePronunciationShadowTarget("DROP TABLE sounds;")).toBeNull();
  });

  it("strictly rejects executable, script, html, or arbitrary MIME types", () => {
    expect(isAllowedPronunciationAudioType("")).toBe(false);
    expect(isAllowedPronunciationAudioType("application/javascript")).toBe(false);
    expect(isAllowedPronunciationAudioType("text/html")).toBe(false);
    expect(isAllowedPronunciationAudioType("application/x-sh")).toBe(false);
    expect(isAllowedPronunciationAudioType("application/json")).toBe(false);
    expect(isAllowedPronunciationAudioType("image/png")).toBe(false);
    expect(isAllowedPronunciationAudioType("video/mp4")).toBe(false);
  });

  it("strips all raw scores, waveforms, transcripts, vectors, and feedback from the learner observation", () => {
    const target = resolvePronunciationShadowTarget("th-voiceless");
    expect(target).not.toBeNull();
    if (!target) return;

    const providerPayload = parseOpenPronounceProviderPayload({
      provider: { name: "openpronounce", version: "0.3.0" },
      candidate_score: 95.0,
      acoustic_distance: 3.5,
      phoneme_error_rate: 0.05,
      word_error_rate: 0.0,
      errors: [],
      // Adversarial extra fields injected by untrusted provider
      raw_score: 95,
      score: 95,
      transcript: "THINK",
      transcribe: "THINK",
      feedback: "Great job!",
      expected_vector: [0.1, 0.2],
      transcribed_vector: [0.1, 0.25],
      waveform: [0.01, -0.02],
      alignment: { start: 0, end: 100 },
    });

    expect(providerPayload).not.toBeNull();
    if (!providerPayload) return;

    const observation = toPronunciationShadowObservation(target, providerPayload);
    const serialized = JSON.stringify(observation);

    // Verify bounded fields exist
    expect(observation.source).toBe("openpronounce");
    expect(observation.calibration).toBe("shadow-unvalidated");
    expect(observation.diagnostics.acousticDistance).toBe(3.5);

    // Verify zero leakage of scores, vectors, or transcripts
    const forbiddenStrings = [
      "candidate_score",
      "raw_score",
      "95",
      "THINK",
      "transcript",
      "transcribe",
      "feedback",
      "expected_vector",
      "transcribed_vector",
      "waveform",
      "alignment",
    ];

    for (const forbidden of forbiddenStrings) {
      expect(serialized).not.toContain(forbidden);
    }
  });

  it("handles null or missing prosody gracefully without fabricating values", () => {
    const target = resolvePronunciationShadowTarget("th-voiceless");
    expect(target).not.toBeNull();
    if (!target) return;

    const providerPayload = parseOpenPronounceProviderPayload({
      provider: { name: "openpronounce", version: "0.3.0" },
      acoustic_distance: null,
      phoneme_error_rate: null,
      word_error_rate: null,
      errors: [],
      prosody_summary: null,
    });

    expect(providerPayload).not.toBeNull();
    if (!providerPayload) return;

    const observation = toPronunciationShadowObservation(target, providerPayload);
    expect(observation.diagnostics.prosody).toBeNull();
    expect(observation.diagnostics.acousticDistance).toBeNull();
    expect(observation.diagnostics.phonemeErrorRate).toBeNull();
    expect(observation.diagnostics.wordErrorRate).toBeNull();
  });
});

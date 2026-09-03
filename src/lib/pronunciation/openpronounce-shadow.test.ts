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
});

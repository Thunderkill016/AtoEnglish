import { describe, expect, it } from "vitest";

import { analyzeSignalQuality } from "./signal";

function sineWave(
  frequency: number,
  durationSeconds: number,
  sampleRate = 16_000,
  amplitude = 0.2,
) {
  const samples = new Float32Array(Math.round(durationSeconds * sampleRate));
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] =
      amplitude * Math.sin((2 * Math.PI * frequency * index) / sampleRate);
  }
  return samples;
}

describe("pronunciation-engine signal quality", () => {
  it("accepts a clean non-clipping voiced signal as usable evidence", () => {
    const result = analyzeSignalQuality(sineWave(200, 0.5), 16_000);

    expect(result.durationSeconds).toBeCloseTo(0.5);
    expect(result.peakAmplitude).toBeCloseTo(0.2, 2);
    expect(result.rmsAmplitude).toBeGreaterThan(0.1);
    expect(result.clippingFraction).toBe(0);
    expect(result.activeSpeechFraction).toBeGreaterThan(0.9);
    expect(result.warnings).toEqual([]);
    expect(result.recommendAbstain).toBe(false);
  });

  it("abstains on near-silent input before pronunciation inference", () => {
    const result = analyzeSignalQuality(new Float32Array(8_000), 16_000);

    expect(result.warnings).toContain("too_quiet");
    expect(result.warnings).toContain("insufficient_active_speech");
    expect(result.recommendAbstain).toBe(true);
  });

  it("detects materially clipped recordings", () => {
    const samples = sineWave(200, 0.5, 16_000, 1.2);
    const result = analyzeSignalQuality(samples, 16_000);

    expect(result.clippingFraction).toBeGreaterThan(0.002);
    expect(result.warnings).toContain("clipping");
  });

  it("detects a recording that is too short", () => {
    const result = analyzeSignalQuality(sineWave(200, 0.05), 16_000);
    expect(result.warnings).toContain("too_short");
  });

  it("does not invent an SNR estimate when continuous speech has no noise-only frames", () => {
    const result = analyzeSignalQuality(sineWave(200, 0.5), 16_000);
    expect(result.snrProxyDb).toBeNull();
  });

  it("rejects invalid sample rates and non-finite samples", () => {
    expect(() => analyzeSignalQuality(sineWave(200, 0.5), 0)).toThrow(
      "invalid_signal_sample_rate",
    );

    const invalid = sineWave(200, 0.5);
    invalid[10] = Number.NaN;
    expect(() => analyzeSignalQuality(invalid, 16_000)).toThrow(
      "signal_samples_must_be_finite",
    );
  });
});

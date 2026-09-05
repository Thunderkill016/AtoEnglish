import { describe, expect, it } from "vitest";

import { analyzeProsody } from "./prosody";

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

function concatenate(...parts: Float32Array[]) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Float32Array(length);
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

describe("pronunciation-engine prosody", () => {
  it("recovers the pitch of a clean synthetic voiced signal", () => {
    const result = analyzeProsody(sineWave(200, 0.5), 16_000);

    expect(result.pitch.medianHz).not.toBeNull();
    expect(result.pitch.medianHz as number).toBeCloseTo(200, 0);
    expect(result.pitch.meanConfidence).toBeGreaterThan(0.9);
    expect(result.voicedFraction).toBeGreaterThan(0.9);
    expect(result.pauseFraction).toBeLessThan(0.1);
  });

  it("does not hallucinate pitch for silence", () => {
    const result = analyzeProsody(new Float32Array(8_000), 16_000);

    expect(result.pitch.medianHz).toBeNull();
    expect(result.pitch.rangeSemitones).toBeNull();
    expect(result.voicedFraction).toBe(0);
    expect(result.pauseFraction).toBe(1);
  });

  it("captures a wider pitch range when the signal changes frequency", () => {
    const samples = concatenate(sineWave(120, 0.3), sineWave(240, 0.3));
    const result = analyzeProsody(samples, 16_000);

    expect(result.pitch.p10Hz).not.toBeNull();
    expect(result.pitch.p90Hz).not.toBeNull();
    expect(result.pitch.rangeSemitones).not.toBeNull();
    expect(result.pitch.rangeSemitones as number).toBeGreaterThan(8);
  });

  it("captures pauses separately from voiced pitch", () => {
    const samples = concatenate(
      sineWave(180, 0.25),
      new Float32Array(4_000),
      sineWave(180, 0.25),
    );
    const result = analyzeProsody(samples, 16_000);

    expect(result.pauseFraction).toBeGreaterThan(0.2);
    expect(result.pauseFraction).toBeLessThan(0.7);
    expect(result.pitch.medianHz as number).toBeCloseTo(180, 0);
  });

  it("reports energy dynamics without turning them into a prosody score", () => {
    const samples = concatenate(
      sineWave(200, 0.25, 16_000, 0.05),
      sineWave(200, 0.25, 16_000, 0.3),
    );
    const result = analyzeProsody(samples, 16_000);

    expect(result.energy.dynamicRangeDb).toBeGreaterThan(8);
    expect(result.energy.p90Dbfs).toBeGreaterThan(result.energy.p10Dbfs);
  });

  it("rejects invalid audio inputs", () => {
    expect(() => analyzeProsody(new Float32Array([0.1]), 0)).toThrow(
      "invalid_prosody_sample_rate",
    );
    expect(() => analyzeProsody(new Float32Array(), 16_000)).toThrow(
      "prosody_samples_required",
    );
  });
});

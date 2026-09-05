import { describe, expect, it } from "vitest";

import { alignCanonicalPronunciation } from "./alignment";
import { composeUnvalidatedPronunciationAssessment } from "./assessment";
import { deriveUncalibratedSegmentalEvidence } from "./evidence";
import { analyzeSignalQuality } from "./signal";

function sineWave(durationSeconds = 0.5, sampleRate = 16_000) {
  const samples = new Float32Array(Math.round(durationSeconds * sampleRate));
  for (let index = 0; index < samples.length; index += 1) {
    samples[index] =
      0.2 * Math.sin((2 * Math.PI * 200 * index) / sampleRate);
  }
  return samples;
}

function segmentalWithThetaCandidates(
  thetaProbability: number | null,
  sProbability: number | null,
) {
  const alignment = alignCanonicalPronunciation(
    { id: "think", phones: ["θ", "ɪ", "ŋ", "k"] },
    [
      {
        candidates: [
          { phone: "θ", probability: thetaProbability },
          { phone: "s", probability: sProbability },
        ],
      },
      { candidates: [{ phone: "ɪ", probability: thetaProbability === null ? null : 1 }] },
      { candidates: [{ phone: "ŋ", probability: thetaProbability === null ? null : 1 }] },
      { candidates: [{ phone: "k", probability: thetaProbability === null ? null : 1 }] },
    ],
  );

  return deriveUncalibratedSegmentalEvidence(alignment);
}

describe("pronunciation-engine assessment composition", () => {
  it("keeps all learner-facing numeric scores null while unvalidated", () => {
    const assessment = composeUnvalidatedPronunciationAssessment({
      signalQuality: analyzeSignalQuality(sineWave(), 16_000),
      segmental: segmentalWithThetaCandidates(0.8, 0.2),
    });

    expect(assessment.calibration).toBe("unvalidated");
    expect(assessment.decision).toBe("evidence");
    expect(assessment.scores).toEqual({
      pronunciation: null,
      completeness: null,
      stress: null,
      fluency: null,
      prosody: null,
      total: null,
    });
  });

  it("abstains when the signal-quality gate fails", () => {
    const assessment = composeUnvalidatedPronunciationAssessment({
      signalQuality: analyzeSignalQuality(new Float32Array(8_000), 16_000),
      segmental: segmentalWithThetaCandidates(0.8, 0.2),
    });

    expect(assessment.decision).toBe("abstain");
    expect(assessment.uncertainty.reasons).toContain("signal_quality");
  });

  it("records rank-only model output as uncertain without inventing a probability", () => {
    const assessment = composeUnvalidatedPronunciationAssessment({
      signalQuality: analyzeSignalQuality(sineWave(), 16_000),
      segmental: segmentalWithThetaCandidates(null, null),
    });

    expect(assessment.decision).toBe("evidence");
    expect(assessment.uncertainty.meanPosteriorMargin).toBeNull();
    expect(assessment.uncertainty.reasons).toContain(
      "sensor_probabilities_unavailable",
    );
  });

  it("can abstain on a weak calibrated posterior margin when an experiment supplies a threshold", () => {
    const assessment = composeUnvalidatedPronunciationAssessment(
      {
        signalQuality: analyzeSignalQuality(sineWave(), 16_000),
        segmental: segmentalWithThetaCandidates(0.55, 0.45),
      },
      { minPosteriorMargin: 0.2 },
    );

    expect(assessment.decision).toBe("abstain");
    expect(assessment.uncertainty.reasons).toContain("weak_sensor_margin");
  });
});

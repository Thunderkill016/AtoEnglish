export type ProsodyFrame = {
  timeMs: number;
  rms: number;
  dbfs: number;
  pitchHz: number | null;
  pitchConfidence: number | null;
  voiced: boolean;
};

export type ProsodySummary = {
  durationSeconds: number;
  frameCount: number;
  voicedFraction: number;
  pauseFraction: number;
  pitch: {
    medianHz: number | null;
    p10Hz: number | null;
    p90Hz: number | null;
    rangeSemitones: number | null;
    meanConfidence: number | null;
  };
  energy: {
    medianDbfs: number;
    p10Dbfs: number;
    p90Dbfs: number;
    dynamicRangeDb: number;
  };
  frames: ProsodyFrame[];
};

export type ProsodyOptions = {
  frameDurationMs?: number;
  hopDurationMs?: number;
  minPitchHz?: number;
  maxPitchHz?: number;
  minVoicedRms?: number;
  minPitchCorrelation?: number;
};

const DEFAULT_OPTIONS: Required<ProsodyOptions> = {
  frameDurationMs: 40,
  hopDurationMs: 20,
  minPitchHz: 70,
  maxPitchHz: 400,
  minVoicedRms: 0.004,
  minPitchCorrelation: 0.45,
};

const FUNDAMENTAL_PEAK_SCORE_TOLERANCE = 0.03;

function percentile(values: readonly number[], probability: number) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const bounded = Math.min(1, Math.max(0, probability));
  const index = bounded * (sorted.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const lower = sorted[lowerIndex] ?? 0;
  const upper = sorted[upperIndex] ?? lower;
  return lower + (index - lowerIndex) * (upper - lower);
}

function frameRms(samples: Float32Array, start: number, end: number) {
  let squareSum = 0;
  for (let index = start; index < end; index += 1) {
    const value = samples[index] ?? 0;
    squareSum += value * value;
  }
  return Math.sqrt(squareSum / Math.max(1, end - start));
}

function normalizedAutocorrelationAtLag(
  frame: Float32Array,
  mean: number,
  lag: number,
) {
  let numerator = 0;
  let leftEnergy = 0;
  let rightEnergy = 0;
  const length = frame.length - lag;

  for (let index = 0; index < length; index += 1) {
    const left = (frame[index] ?? 0) - mean;
    const right = (frame[index + lag] ?? 0) - mean;
    numerator += left * right;
    leftEnergy += left * left;
    rightEnergy += right * right;
  }

  const denominator = Math.sqrt(leftEnergy * rightEnergy);
  return denominator <= 1e-12 ? 0 : numerator / denominator;
}

function chooseFundamentalLag(
  scores: ReadonlyMap<number, number>,
  minLag: number,
  maxLag: number,
  bestLag: number,
  bestScore: number,
  minimumCorrelation: number,
) {
  // Periodic signals can have equally strong autocorrelation peaks at 2x/3x
  // the true period. Taking the absolute maximum therefore creates false
  // subharmonics. Prefer the earliest strong local maximum whose score is
  // essentially tied with the global best; this is a transparent YIN-like
  // fundamental prior without hiding the confidence value.
  const qualifyingScore = Math.max(
    minimumCorrelation,
    bestScore - FUNDAMENTAL_PEAK_SCORE_TOLERANCE,
  );

  for (let lag = minLag + 1; lag < maxLag; lag += 1) {
    const left = scores.get(lag - 1);
    const center = scores.get(lag);
    const right = scores.get(lag + 1);

    if (
      left !== undefined &&
      center !== undefined &&
      right !== undefined &&
      center >= qualifyingScore &&
      center >= left &&
      center >= right
    ) {
      return lag;
    }
  }

  return bestLag;
}

function estimatePitch(
  frame: Float32Array,
  sampleRate: number,
  options: Required<ProsodyOptions>,
) {
  let mean = 0;
  for (const value of frame) mean += value;
  mean /= frame.length;

  const minLag = Math.max(1, Math.floor(sampleRate / options.maxPitchHz));
  const maxLag = Math.min(
    frame.length - 2,
    Math.ceil(sampleRate / options.minPitchHz),
  );

  if (maxLag <= minLag) return null;

  const scores = new Map<number, number>();
  let bestLag = minLag;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (let lag = minLag; lag <= maxLag; lag += 1) {
    const score = normalizedAutocorrelationAtLag(frame, mean, lag);
    scores.set(lag, score);

    if (score > bestScore) {
      bestScore = score;
      bestLag = lag;
    }
  }

  if (!Number.isFinite(bestScore) || bestScore < options.minPitchCorrelation) {
    return null;
  }

  const selectedLag = chooseFundamentalLag(
    scores,
    minLag,
    maxLag,
    bestLag,
    bestScore,
    options.minPitchCorrelation,
  );
  const selectedScore = scores.get(selectedLag) ?? bestScore;
  const left = scores.get(selectedLag - 1);
  const center = scores.get(selectedLag);
  const right = scores.get(selectedLag + 1);
  let refinedLag = selectedLag;

  if (left !== undefined && center !== undefined && right !== undefined) {
    const denominator = left - 2 * center + right;
    if (Math.abs(denominator) > 1e-8) {
      const adjustment = (0.5 * (left - right)) / denominator;
      refinedLag += Math.max(-0.5, Math.min(0.5, adjustment));
    }
  }

  return {
    pitchHz: sampleRate / refinedLag,
    confidence: Math.max(0, Math.min(1, selectedScore)),
  };
}

function decibelsFromRms(rms: number) {
  return 20 * Math.log10(Math.max(rms, 1e-8));
}

/**
 * Extracts a transparent suprasegmental evidence stream from local PCM audio.
 * It intentionally returns descriptive pitch/energy/pause features, not a
 * learner-facing prosody or fluency score.
 */
export function analyzeProsody(
  samples: Float32Array,
  sampleRate: number,
  options: ProsodyOptions = {},
): ProsodySummary {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error("invalid_prosody_sample_rate");
  }
  if (samples.length === 0) throw new Error("prosody_samples_required");
  for (const value of samples) {
    if (!Number.isFinite(value)) throw new Error("prosody_samples_must_be_finite");
  }

  const config = { ...DEFAULT_OPTIONS, ...options };
  if (
    config.minPitchHz <= 0 ||
    config.maxPitchHz <= config.minPitchHz ||
    config.frameDurationMs <= 0 ||
    config.hopDurationMs <= 0
  ) {
    throw new Error("invalid_prosody_options");
  }

  const frameLength = Math.max(
    4,
    Math.round((sampleRate * config.frameDurationMs) / 1_000),
  );
  const hopLength = Math.max(
    1,
    Math.round((sampleRate * config.hopDurationMs) / 1_000),
  );

  const frameDescriptors: Array<{
    start: number;
    end: number;
    rms: number;
  }> = [];

  for (let start = 0; start < samples.length; start += hopLength) {
    const end = Math.min(samples.length, start + frameLength);
    if (end - start < Math.min(frameLength, Math.round(sampleRate * 0.02))) break;
    frameDescriptors.push({ start, end, rms: frameRms(samples, start, end) });
    if (end === samples.length) break;
  }

  if (frameDescriptors.length === 0) throw new Error("prosody_audio_too_short");

  const frameRmsList = frameDescriptors.map((frame) => frame.rms);
  const lowEnergy = percentile(frameRmsList, 0.2) ?? 0;
  const highEnergy = percentile(frameRmsList, 0.8) ?? 0;
  const activeThreshold = Math.max(
    config.minVoicedRms,
    Math.min(
      lowEnergy > 0 ? lowEnergy * 2 : config.minVoicedRms,
      highEnergy > 0 ? highEnergy * 0.5 : config.minVoicedRms,
    ),
  );

  const frames: ProsodyFrame[] = frameDescriptors.map((descriptor) => {
    const active = descriptor.rms >= activeThreshold;
    const frame = samples.slice(descriptor.start, descriptor.end);
    const pitch = active ? estimatePitch(frame, sampleRate, config) : null;

    return {
      timeMs: ((descriptor.start + descriptor.end) / 2 / sampleRate) * 1_000,
      rms: descriptor.rms,
      dbfs: decibelsFromRms(descriptor.rms),
      pitchHz: pitch?.pitchHz ?? null,
      pitchConfidence: pitch?.confidence ?? null,
      voiced: pitch !== null,
    };
  });

  const voicedFrames = frames.filter((frame) => frame.voiced);
  const pitchValues = voicedFrames
    .map((frame) => frame.pitchHz)
    .filter((value): value is number => value !== null);
  const confidenceValues = voicedFrames
    .map((frame) => frame.pitchConfidence)
    .filter((value): value is number => value !== null);
  const dbValues = frames.map((frame) => frame.dbfs);

  const p10Pitch = percentile(pitchValues, 0.1);
  const p90Pitch = percentile(pitchValues, 0.9);
  const p10Db = percentile(dbValues, 0.1) ?? -160;
  const p90Db = percentile(dbValues, 0.9) ?? -160;
  const activeFrameCount = frameDescriptors.filter(
    (frame) => frame.rms >= activeThreshold,
  ).length;

  return {
    durationSeconds: samples.length / sampleRate,
    frameCount: frames.length,
    voicedFraction: voicedFrames.length / frames.length,
    pauseFraction: 1 - activeFrameCount / frames.length,
    pitch: {
      medianHz: percentile(pitchValues, 0.5),
      p10Hz: p10Pitch,
      p90Hz: p90Pitch,
      rangeSemitones:
        p10Pitch !== null && p90Pitch !== null && p10Pitch > 0
          ? 12 * Math.log2(p90Pitch / p10Pitch)
          : null,
      meanConfidence:
        confidenceValues.length === 0
          ? null
          : confidenceValues.reduce((sum, value) => sum + value, 0) /
            confidenceValues.length,
    },
    energy: {
      medianDbfs: percentile(dbValues, 0.5) ?? -160,
      p10Dbfs: p10Db,
      p90Dbfs: p90Db,
      dynamicRangeDb: p90Db - p10Db,
    },
    frames,
  };
}

export const pronunciationProsodyDefaults = Object.freeze({ ...DEFAULT_OPTIONS });

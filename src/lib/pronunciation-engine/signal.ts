export type SignalQualityWarning =
  | "too_short"
  | "too_long"
  | "too_quiet"
  | "clipping"
  | "low_snr"
  | "insufficient_active_speech";

export type SignalQualityEvidence = {
  durationSeconds: number;
  peakAmplitude: number;
  rmsAmplitude: number;
  dcOffset: number;
  clippingFraction: number;
  activeSpeechFraction: number;
  noiseFloorRms: number;
  activeRms: number;
  snrProxyDb: number | null;
  warnings: SignalQualityWarning[];
  recommendAbstain: boolean;
};

export type SignalQualityOptions = {
  minDurationSeconds?: number;
  maxDurationSeconds?: number;
  minRms?: number;
  clippingAmplitude?: number;
  maxClippingFraction?: number;
  minSnrProxyDb?: number;
  minActiveSpeechFraction?: number;
  frameDurationMs?: number;
};

const DEFAULT_OPTIONS: Required<SignalQualityOptions> = {
  minDurationSeconds: 0.2,
  maxDurationSeconds: 15,
  minRms: 0.004,
  clippingAmplitude: 0.995,
  maxClippingFraction: 0.002,
  minSnrProxyDb: 6,
  minActiveSpeechFraction: 0.05,
  frameDurationMs: 20,
};

function rms(values: readonly number[]) {
  if (values.length === 0) return 0;
  let squareSum = 0;
  for (const value of values) squareSum += value * value;
  return Math.sqrt(squareSum / values.length);
}

function percentile(sorted: readonly number[], probability: number) {
  if (sorted.length === 0) return 0;
  const bounded = Math.min(1, Math.max(0, probability));
  const index = bounded * (sorted.length - 1);
  const lowerIndex = Math.floor(index);
  const upperIndex = Math.ceil(index);
  const lower = sorted[lowerIndex] ?? 0;
  const upper = sorted[upperIndex] ?? lower;
  const fraction = index - lowerIndex;
  return lower + fraction * (upper - lower);
}

function frameRmsValues(
  samples: Float32Array,
  sampleRate: number,
  frameDurationMs: number,
) {
  const frameLength = Math.max(
    1,
    Math.round((sampleRate * frameDurationMs) / 1_000),
  );
  const values: number[] = [];

  for (let start = 0; start < samples.length; start += frameLength) {
    const end = Math.min(samples.length, start + frameLength);
    let squareSum = 0;

    for (let index = start; index < end; index += 1) {
      const value = samples[index] ?? 0;
      squareSum += value * value;
    }

    values.push(Math.sqrt(squareSum / Math.max(1, end - start)));
  }

  return values;
}

function mergeOptions(options: SignalQualityOptions): Required<SignalQualityOptions> {
  return { ...DEFAULT_OPTIONS, ...options };
}

/**
 * Produces signal-quality evidence before any pronunciation inference.
 * Thresholds are deliberately transparent research priors and must be tuned on
 * recorded learner/device data. The quality gate may abstain; it never scores
 * pronunciation itself.
 */
export function analyzeSignalQuality(
  samples: Float32Array,
  sampleRate: number,
  options: SignalQualityOptions = {},
): SignalQualityEvidence {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error("invalid_signal_sample_rate");
  }
  if (samples.length === 0) throw new Error("signal_samples_required");

  const config = mergeOptions(options);
  const durationSeconds = samples.length / sampleRate;

  let peakAmplitude = 0;
  let squareSum = 0;
  let sum = 0;
  let clippingSamples = 0;

  for (const value of samples) {
    if (!Number.isFinite(value)) throw new Error("signal_samples_must_be_finite");
    const absolute = Math.abs(value);
    peakAmplitude = Math.max(peakAmplitude, absolute);
    squareSum += value * value;
    sum += value;
    if (absolute >= config.clippingAmplitude) clippingSamples += 1;
  }

  const rmsAmplitude = Math.sqrt(squareSum / samples.length);
  const dcOffset = sum / samples.length;
  const clippingFraction = clippingSamples / samples.length;

  const frames = frameRmsValues(samples, sampleRate, config.frameDurationMs);
  const sortedFrames = [...frames].sort((left, right) => left - right);
  const noiseFloorRms = percentile(sortedFrames, 0.2);
  const activeRms = percentile(sortedFrames, 0.8);
  const activeThreshold = Math.max(
    config.minRms,
    noiseFloorRms > 0 ? noiseFloorRms * 2 : config.minRms,
  );
  const activeFrameCount = frames.filter((value) => value >= activeThreshold).length;
  const activeSpeechFraction =
    frames.length === 0 ? 0 : activeFrameCount / frames.length;

  const snrProxyDb =
    noiseFloorRms <= 1e-8
      ? activeRms > config.minRms
        ? 60
        : null
      : 20 * Math.log10(Math.max(activeRms, 1e-8) / noiseFloorRms);

  const warnings: SignalQualityWarning[] = [];
  if (durationSeconds < config.minDurationSeconds) warnings.push("too_short");
  if (durationSeconds > config.maxDurationSeconds) warnings.push("too_long");
  if (rmsAmplitude < config.minRms) warnings.push("too_quiet");
  if (clippingFraction > config.maxClippingFraction) warnings.push("clipping");
  if (snrProxyDb !== null && snrProxyDb < config.minSnrProxyDb) {
    warnings.push("low_snr");
  }
  if (activeSpeechFraction < config.minActiveSpeechFraction) {
    warnings.push("insufficient_active_speech");
  }

  return {
    durationSeconds,
    peakAmplitude,
    rmsAmplitude,
    dcOffset,
    clippingFraction,
    activeSpeechFraction,
    noiseFloorRms,
    activeRms,
    snrProxyDb,
    warnings,
    recommendAbstain: warnings.length > 0,
  };
}

export const pronunciationSignalQualityDefaults = Object.freeze({
  ...DEFAULT_OPTIONS,
});

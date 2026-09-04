export type VadSpeechInterval = {
  readonly startMs: number;
  readonly endMs: number;
};

export type VadAudioSegmentRequest = {
  readonly audioData: Uint8Array | Float32Array;
  readonly sampleRateHz: number;
  readonly durationMs: number;
  readonly threshold?: number;
};

export type VadSpeechObservation = {
  readonly observationType: "vad-speech-detection";
  readonly isSpeech: boolean;
  readonly speechProbability: number;
  readonly intervals: readonly VadSpeechInterval[];
  readonly totalDurationMs: number;
  readonly speechDurationMs: number;
  readonly engine: string;
  readonly occurredAt: string;
};

export type VadAdapterResult =
  | { readonly ok: true; readonly observation: VadSpeechObservation }
  | { readonly ok: false; readonly error: string; readonly code: "audio-corrupt" | "invalid-sample-rate" };

export interface VadAdapterContract {
  readonly engineName: string;
  detectActivity(request: VadAudioSegmentRequest): Promise<VadAdapterResult>;
}

export function createMockVadAdapter(
  defaultIntervals: VadSpeechInterval[] = [{ startMs: 200, endMs: 1800 }],
  engineName = "mock-silero-vad"
): VadAdapterContract {
  return {
    engineName,
    async detectActivity(request: VadAudioSegmentRequest): Promise<VadAdapterResult> {
      if (request.durationMs <= 0) {
        return Object.freeze({
          ok: false,
          error: "Invalid audio duration",
          code: "audio-corrupt",
        });
      }

      const totalSpeechMs = defaultIntervals.reduce(
        (sum, iv) => sum + Math.max(0, iv.endMs - iv.startMs),
        0
      );

      return Object.freeze({
        ok: true,
        observation: Object.freeze({
          observationType: "vad-speech-detection",
          isSpeech: defaultIntervals.length > 0,
          speechProbability: defaultIntervals.length > 0 ? 0.98 : 0.05,
          intervals: Object.freeze(defaultIntervals),
          totalDurationMs: request.durationMs,
          speechDurationMs: totalSpeechMs,
          engine: engineName,
          occurredAt: new Date().toISOString(),
        }),
      });
    },
  };
}

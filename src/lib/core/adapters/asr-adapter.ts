export type AsrToken = {
  readonly token: string;
  readonly startMs: number;
  readonly endMs: number;
  readonly confidence: number;
};

export type AsrTranscriptionRequest = {
  readonly audioData: Uint8Array | ArrayBuffer;
  readonly sampleRateHz: number;
  readonly durationMs: number;
  readonly language?: string;
  readonly promptContext?: string;
};

export type AsrTranscriptionObservation = {
  readonly observationType: "asr-transcription";
  readonly text: string;
  readonly durationMs: number;
  readonly tokens: readonly AsrToken[];
  readonly noSpeechProbability: number;
  readonly engine: string;
  readonly occurredAt: string;
};

export type AsrAdapterResult =
  | { readonly ok: true; readonly observation: AsrTranscriptionObservation }
  | { readonly ok: false; readonly error: string; readonly code: "audio-corrupt" | "unsupported-format" | "timeout" };

export interface AsrAdapterContract {
  readonly engineName: string;
  transcribe(request: AsrTranscriptionRequest): Promise<AsrAdapterResult>;
}

export function createMockAsrAdapter(
  defaultTranscript = "hello world",
  engineName = "mock-faster-whisper"
): AsrAdapterContract {
  return {
    engineName,
    async transcribe(request: AsrTranscriptionRequest): Promise<AsrAdapterResult> {
      if (request.durationMs <= 0) {
        return Object.freeze({
          ok: false,
          error: "Invalid audio duration",
          code: "audio-corrupt",
        });
      }

      const words = defaultTranscript.trim().split(/\s+/);
      const stepMs = Math.floor(request.durationMs / Math.max(1, words.length));
      const tokens: AsrToken[] = words.map((w, idx) =>
        Object.freeze({
          token: w,
          startMs: idx * stepMs,
          endMs: (idx + 1) * stepMs,
          confidence: 0.95,
        })
      );

      return Object.freeze({
        ok: true,
        observation: Object.freeze({
          observationType: "asr-transcription",
          text: defaultTranscript,
          durationMs: request.durationMs,
          tokens: Object.freeze(tokens),
          noSpeechProbability: 0.02,
          engine: engineName,
          occurredAt: new Date().toISOString(),
        }),
      });
    },
  };
}

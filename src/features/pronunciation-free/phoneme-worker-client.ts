import type {
  LocalCtcPosteriorSummary,
  LocalObservedPhone,
  LocalPhonemeRuntime,
  PhonemeWorkerProgress,
} from "./types";

export type PhonemeWorkerEvent =
  | {
      type: "progress";
      progress: PhonemeWorkerProgress;
    }
  | {
      type: "runtime";
      state: "loading" | "ready" | "fallback";
      runtime: LocalPhonemeRuntime;
      message: string | null;
    };

export type PhonemeRecognitionResult = {
  text: string;
  observations: LocalObservedPhone[];
  posterior: LocalCtcPosteriorSummary;
  runtime: LocalPhonemeRuntime;
};

type PendingRequest = {
  resolve(value: PhonemeRecognitionResult): void;
  reject(error: Error): void;
};

type WorkerMessage = Record<string, unknown>;

function isWorkerMessage(value: unknown): value is WorkerMessage {
  return typeof value === "object" && value !== null;
}

function parseRuntime(value: unknown): LocalPhonemeRuntime | null {
  if (!isWorkerMessage(value)) return null;

  const { device, dtype } = value;

  if (device === "webgpu" && dtype === "q4f16") {
    return { device, dtype };
  }

  if (device === "wasm" && dtype === "q8") {
    return { device, dtype };
  }

  return null;
}

function parseProgress(value: unknown): PhonemeWorkerProgress | null {
  if (!isWorkerMessage(value) || typeof value.status !== "string") {
    return null;
  }

  return {
    status: value.status,
    file: typeof value.file === "string" ? value.file : null,
    progress:
      typeof value.progress === "number" && Number.isFinite(value.progress)
        ? value.progress
        : null,
  };
}

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function unitNumber(value: unknown) {
  const number = finiteNumber(value);
  return number !== null && number >= 0 && number <= 1 ? number : null;
}

function nonNegativeNumber(value: unknown) {
  const number = finiteNumber(value);
  return number !== null && number >= 0 ? number : null;
}

function positiveInteger(value: unknown) {
  const number = finiteNumber(value);
  return number !== null && Number.isInteger(number) && number > 0
    ? number
    : null;
}

function nonNegativeInteger(value: unknown) {
  const number = finiteNumber(value);
  return number !== null && Number.isInteger(number) && number >= 0
    ? number
    : null;
}

function parseObservation(value: unknown): LocalObservedPhone | null {
  if (!isWorkerMessage(value) || !Array.isArray(value.candidates)) return null;

  const startMs = nonNegativeNumber(value.startMs);
  const endMs = nonNegativeNumber(value.endMs);
  if (startMs === null || endMs === null || endMs <= startMs) return null;

  const candidates = value.candidates
    .map((candidate) => {
      if (!isWorkerMessage(candidate) || typeof candidate.phone !== "string") {
        return null;
      }
      const phone = candidate.phone.normalize("NFC").trim();
      const probability = unitNumber(candidate.probability);
      if (!phone || probability === null) return null;
      return { phone, probability };
    })
    .filter(
      (candidate): candidate is { phone: string; probability: number } =>
        candidate !== null,
    );

  if (candidates.length === 0 || candidates.length > 32) return null;

  const probabilityMass = candidates.reduce(
    (sum, candidate) => sum + candidate.probability,
    0,
  );
  if (probabilityMass > 1.001) return null;

  return {
    candidates,
    startMs,
    endMs,
    source: typeof value.source === "string" ? value.source : null,
  };
}

function parsePosterior(value: unknown): LocalCtcPosteriorSummary | null {
  if (!isWorkerMessage(value)) return null;

  const frameCount = positiveInteger(value.frameCount);
  const vocabularySize = positiveInteger(value.vocabularySize);
  const blankTokenId = nonNegativeInteger(value.blankTokenId);
  const meanEntropy = nonNegativeNumber(value.meanEntropy);
  const normalizedMeanEntropy = unitNumber(value.normalizedMeanEntropy);
  const meanPeakPosterior = unitNumber(value.meanPeakPosterior);
  const meanTop2Margin = unitNumber(value.meanTop2Margin);
  const meanBlankPosterior =
    value.meanBlankPosterior === null ? null : unitNumber(value.meanBlankPosterior);

  if (
    frameCount === null ||
    vocabularySize === null ||
    blankTokenId === null ||
    blankTokenId >= vocabularySize ||
    meanEntropy === null ||
    normalizedMeanEntropy === null ||
    meanPeakPosterior === null ||
    meanTop2Margin === null ||
    meanBlankPosterior === undefined
  ) {
    return null;
  }

  return {
    frameCount,
    vocabularySize,
    blankTokenId,
    meanEntropy,
    normalizedMeanEntropy,
    meanPeakPosterior,
    meanTop2Margin,
    meanBlankPosterior,
  };
}

export class BrowserPhonemeRecognizer {
  private readonly worker: Worker;
  private readonly pending = new Map<number, PendingRequest>();
  private requestId = 0;

  constructor(onEvent?: (event: PhonemeWorkerEvent) => void) {
    this.worker = new Worker("/workers/pronunciation-phoneme-worker.mjs", {
      type: "module",
      name: "atoenglish-pronunciation-phoneme",
    });

    this.worker.addEventListener("message", (event: MessageEvent<unknown>) => {
      const message = event.data;
      if (!isWorkerMessage(message) || typeof message.type !== "string") return;

      if (message.type === "progress") {
        const progress = parseProgress(message.progress);
        if (progress) onEvent?.({ type: "progress", progress });
        return;
      }

      if (message.type === "runtime") {
        const runtime = parseRuntime(message.runtime);
        const state = message.state;

        if (
          runtime &&
          (state === "loading" || state === "ready" || state === "fallback")
        ) {
          onEvent?.({
            type: "runtime",
            state,
            runtime,
            message: typeof message.message === "string" ? message.message : null,
          });
        }
        return;
      }

      const id = message.id;
      if (typeof id !== "number") return;

      const request = this.pending.get(id);
      if (!request) return;

      if (message.type === "result") {
        const runtime = parseRuntime(message.runtime);
        const text = message.text;
        const observations = Array.isArray(message.observations)
          ? message.observations
              .map(parseObservation)
              .filter(
                (observation): observation is LocalObservedPhone =>
                  observation !== null,
              )
          : [];
        const posterior = parsePosterior(message.posterior);

        if (
          !runtime ||
          typeof text !== "string" ||
          observations.length === 0 ||
          !posterior
        ) {
          this.pending.delete(id);
          request.reject(new Error("invalid_phoneme_worker_result"));
          return;
        }

        this.pending.delete(id);
        request.resolve({ text, observations, posterior, runtime });
        return;
      }

      if (message.type === "error") {
        this.pending.delete(id);
        request.reject(
          new Error(
            typeof message.message === "string"
              ? message.message
              : "phoneme_worker_error",
          ),
        );
      }
    });

    this.worker.addEventListener("error", () => {
      const error = new Error("phoneme_worker_crashed");

      for (const request of this.pending.values()) {
        request.reject(error);
      }

      this.pending.clear();
    });
  }

  recognize(samples: Float32Array) {
    if (samples.length === 0) {
      return Promise.reject(new Error("empty_phoneme_audio"));
    }

    const id = ++this.requestId;

    return new Promise<PhonemeRecognitionResult>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({
        type: "recognize",
        id,
        sampleRate: 16_000,
        samples,
      });
    });
  }

  terminate() {
    this.worker.terminate();

    const error = new Error("phoneme_worker_terminated");
    for (const request of this.pending.values()) {
      request.reject(error);
    }
    this.pending.clear();
  }
}

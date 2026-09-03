import type {
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

  if (device === "wasm" && dtype === "q4") {
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

        if (!runtime || typeof text !== "string") {
          this.pending.delete(id);
          request.reject(new Error("invalid_phoneme_worker_result"));
          return;
        }

        this.pending.delete(id);
        request.resolve({ text, runtime });
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

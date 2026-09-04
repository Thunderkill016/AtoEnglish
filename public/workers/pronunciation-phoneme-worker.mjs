import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";

const MODEL_ID = "onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX";
const MODEL_REVISION = "c69750f";

let recognizerPromise = null;

function errorMessage(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "phoneme_model_error";
}

function sanitizeProgress(progress) {
  const value = progress && typeof progress === "object" ? progress : {};

  return {
    status: typeof value.status === "string" ? value.status : "loading",
    file: typeof value.file === "string" ? value.file : null,
    progress:
      typeof value.progress === "number" && Number.isFinite(value.progress)
        ? value.progress
        : null,
  };
}

async function loadWithRuntime(runtime) {
  self.postMessage({
    type: "runtime",
    state: "loading",
    runtime,
    message: null,
  });

  const recognizer = await pipeline(
    "automatic-speech-recognition",
    MODEL_ID,
    {
      revision: MODEL_REVISION,
      device: runtime.device,
      dtype: runtime.dtype,
      progress_callback: (progress) => {
        self.postMessage({
          type: "progress",
          progress: sanitizeProgress(progress),
        });
      },
    },
  );

  self.postMessage({
    type: "runtime",
    state: "ready",
    runtime,
    message: null,
  });

  return { recognizer, runtime };
}

async function createRecognizer() {
  const attempts = [];

  if ("gpu" in navigator) {
    attempts.push({
      device: "webgpu",
      dtype: "q4f16",
    });
  }

  // q8 is the safer/default quantized path for WASM in Transformers.js.
  // The previous q4 fallback was smaller, but more aggressive quantization is
  // not worth sacrificing browser compatibility for this falsification test.
  attempts.push({
    device: "wasm",
    dtype: "q8",
  });

  let lastError = null;

  for (const runtime of attempts) {
    try {
      return await loadWithRuntime(runtime);
    } catch (error) {
      lastError = error;

      self.postMessage({
        type: "runtime",
        state: "fallback",
        runtime,
        message: errorMessage(error),
      });
    }
  }

  throw lastError ?? new Error("phoneme_model_unavailable");
}

function getRecognizer() {
  if (!recognizerPromise) {
    recognizerPromise = createRecognizer().catch((error) => {
      // A failed first load must not permanently poison the worker. This lets a
      // later retry succeed after a transient network/cache/runtime failure.
      recognizerPromise = null;
      throw error;
    });
  }

  return recognizerPromise;
}

function extractText(output) {
  const candidate = Array.isArray(output) ? output[0] : output;

  if (
    !candidate ||
    typeof candidate !== "object" ||
    typeof candidate.text !== "string"
  ) {
    throw new Error("invalid_phoneme_model_output");
  }

  return candidate.text.trim();
}

self.addEventListener("message", async (event) => {
  const message = event.data;

  if (
    !message ||
    typeof message !== "object" ||
    message.type !== "recognize"
  ) {
    return;
  }

  const { id, sampleRate, samples } = message;

  if (
    typeof id !== "number" ||
    sampleRate !== 16_000 ||
    !(samples instanceof Float32Array) ||
    samples.length === 0
  ) {
    if (typeof id === "number") {
      self.postMessage({
        type: "error",
        id,
        message: "invalid_phoneme_audio",
      });
    }
    return;
  }

  try {
    const { recognizer, runtime } = await getRecognizer();
    const output = await recognizer(samples);

    self.postMessage({
      type: "result",
      id,
      text: extractText(output),
      runtime,
    });
  } catch (error) {
    self.postMessage({
      type: "error",
      id,
      message: errorMessage(error),
    });
  }
});

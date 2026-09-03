import {
  AutoModelForCTC,
  AutoProcessor,
  AutoTokenizer,
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0";

const MODEL_ID = "onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX";
const MODEL_REVISION = "c69750f";
const TOP_K = 5;

let recognizerPromise = null;
let assetsPromise = null;

function errorMessage(error) {
  if (error instanceof Error && error.message) return error.message;
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

function progressCallback(progress) {
  self.postMessage({
    type: "progress",
    progress: sanitizeProgress(progress),
  });
}

async function getStaticAssets() {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      AutoProcessor.from_pretrained(MODEL_ID, {
        revision: MODEL_REVISION,
        progress_callback: progressCallback,
      }),
      AutoTokenizer.from_pretrained(MODEL_ID, {
        revision: MODEL_REVISION,
        progress_callback: progressCallback,
      }),
    ]).catch((error) => {
      assetsPromise = null;
      throw error;
    });
  }

  return assetsPromise;
}

async function loadWithRuntime(runtime) {
  self.postMessage({
    type: "runtime",
    state: "loading",
    runtime,
    message: null,
  });

  const [processor, tokenizer] = await getStaticAssets();
  const model = await AutoModelForCTC.from_pretrained(MODEL_ID, {
    revision: MODEL_REVISION,
    device: runtime.device,
    dtype: runtime.dtype,
    progress_callback: progressCallback,
  });

  self.postMessage({
    type: "runtime",
    state: "ready",
    runtime,
    message: null,
  });

  return { model, processor, tokenizer, runtime };
}

async function createRecognizer() {
  const attempts = [];

  if ("gpu" in navigator) {
    attempts.push({ device: "webgpu", dtype: "q4f16" });
  }

  attempts.push({ device: "wasm", dtype: "q8" });

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
      recognizerPromise = null;
      throw error;
    });
  }
  return recognizerPromise;
}

function finiteDimension(value, label) {
  const number = Number(value);
  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`invalid_phoneme_logits_${label}`);
  }
  return number;
}

function logitsShape(logits) {
  if (!logits || typeof logits !== "object" || !Array.isArray(logits.dims)) {
    throw new Error("invalid_phoneme_logits");
  }

  if (logits.dims.length !== 3) {
    throw new Error("invalid_phoneme_logits_rank");
  }

  const batch = finiteDimension(logits.dims[0], "batch");
  const frames = finiteDimension(logits.dims[1], "frames");
  const vocabulary = finiteDimension(logits.dims[2], "vocabulary");

  if (batch !== 1) throw new Error("invalid_phoneme_logits_batch");

  const data = logits.data;
  if (!data || typeof data.length !== "number") {
    throw new Error("invalid_phoneme_logits_data");
  }
  if (data.length !== frames * vocabulary) {
    throw new Error("invalid_phoneme_logits_size");
  }

  return { data, frames, vocabulary };
}

function softmaxPosteriorMatrix(logits) {
  const { data, frames, vocabulary } = logitsShape(logits);
  const probabilities = new Float32Array(frames * vocabulary);
  const topIds = new Int32Array(frames);
  let entropySum = 0;
  let peakSum = 0;
  let top2MarginSum = 0;

  for (let frame = 0; frame < frames; frame += 1) {
    const offset = frame * vocabulary;
    let maximum = -Infinity;

    for (let token = 0; token < vocabulary; token += 1) {
      const value = Number(data[offset + token]);
      if (!Number.isFinite(value)) throw new Error("phoneme_logits_not_finite");
      maximum = Math.max(maximum, value);
    }

    let denominator = 0;
    for (let token = 0; token < vocabulary; token += 1) {
      denominator += Math.exp(Number(data[offset + token]) - maximum);
    }
    if (!Number.isFinite(denominator) || denominator <= 0) {
      throw new Error("invalid_phoneme_softmax_denominator");
    }

    let first = -Infinity;
    let second = -Infinity;
    let firstId = 0;
    let entropy = 0;

    for (let token = 0; token < vocabulary; token += 1) {
      const probability =
        Math.exp(Number(data[offset + token]) - maximum) / denominator;
      probabilities[offset + token] = probability;
      if (probability > 0) entropy -= probability * Math.log(probability);

      if (probability > first) {
        second = first;
        first = probability;
        firstId = token;
      } else if (probability > second) {
        second = probability;
      }
    }

    topIds[frame] = firstId;
    entropySum += entropy;
    peakSum += first;
    top2MarginSum += first - (Number.isFinite(second) ? second : 0);
  }

  return {
    probabilities,
    topIds,
    frames,
    vocabulary,
    meanEntropy: entropySum / frames,
    meanPeakPosterior: peakSum / frames,
    meanTop2Margin: top2MarginSum / frames,
  };
}

function numericTokenId(value) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function specialTokenIds(model, tokenizer, blankTokenId) {
  const ids = new Set([blankTokenId]);
  const sources = [model?.config, tokenizer];
  const names = [
    "pad_token_id",
    "bos_token_id",
    "eos_token_id",
    "unk_token_id",
    "sep_token_id",
    "cls_token_id",
  ];

  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    for (const name of names) {
      const id = numericTokenId(source[name]);
      if (id !== null) ids.add(id);
    }
  }

  return ids;
}

function tokenDecoder(tokenizer) {
  const cache = new Map();

  return (tokenId) => {
    if (cache.has(tokenId)) return cache.get(tokenId);

    let decoded = "";
    try {
      decoded = tokenizer.decode([tokenId], {
        skip_special_tokens: true,
        clean_up_tokenization_spaces: false,
      });
    } catch {
      decoded = "";
    }

    const label = typeof decoded === "string" ? decoded.normalize("NFC").trim() : "";
    cache.set(tokenId, label);
    return label;
  };
}

function aggregateSegmentCandidates(
  posterior,
  startFrame,
  endFrameExclusive,
  ignoredTokenIds,
  decodeToken,
) {
  const frameCount = endFrameExclusive - startFrame;
  const averages = new Float64Array(posterior.vocabulary);

  for (let frame = startFrame; frame < endFrameExclusive; frame += 1) {
    const offset = frame * posterior.vocabulary;
    for (let token = 0; token < posterior.vocabulary; token += 1) {
      averages[token] += posterior.probabilities[offset + token] / frameCount;
    }
  }

  const ranked = Array.from({ length: posterior.vocabulary }, (_, tokenId) => ({
    tokenId,
    probability: averages[tokenId],
  })).sort((left, right) => right.probability - left.probability);

  const candidates = [];
  for (const candidate of ranked) {
    if (candidates.length >= TOP_K) break;
    if (ignoredTokenIds.has(candidate.tokenId) || candidate.probability <= 0) continue;

    const phone = decodeToken(candidate.tokenId);
    if (!phone) continue;

    candidates.push({
      phone,
      probability: candidate.probability,
    });
  }

  return candidates;
}

function collapseCtcSegments(
  posterior,
  tokenizer,
  model,
  audioDurationMs,
  blankTokenId,
) {
  const ignoredTokenIds = specialTokenIds(model, tokenizer, blankTokenId);
  const decodeToken = tokenDecoder(tokenizer);
  const frameDurationMs = audioDurationMs / posterior.frames;
  const observations = [];
  const emittedPhones = [];

  let cursor = 0;
  while (cursor < posterior.frames) {
    const tokenId = posterior.topIds[cursor];
    let end = cursor + 1;
    while (end < posterior.frames && posterior.topIds[end] === tokenId) end += 1;

    if (!ignoredTokenIds.has(tokenId)) {
      const phone = decodeToken(tokenId);
      if (phone) {
        const candidates = aggregateSegmentCandidates(
          posterior,
          cursor,
          end,
          ignoredTokenIds,
          decodeToken,
        );

        if (candidates.length > 0) {
          observations.push({
            candidates,
            startMs: cursor * frameDurationMs,
            endMs: end * frameDurationMs,
            source: `${MODEL_ID}@${MODEL_REVISION}:ctc-posterior-top${TOP_K}`,
          });
          emittedPhones.push(phone);
        }
      }
    }

    cursor = end;
  }

  return { observations, emittedPhones };
}

function meanBlankPosterior(posterior, blankTokenId) {
  if (blankTokenId < 0 || blankTokenId >= posterior.vocabulary) return null;

  let sum = 0;
  for (let frame = 0; frame < posterior.frames; frame += 1) {
    sum += posterior.probabilities[frame * posterior.vocabulary + blankTokenId];
  }
  return sum / posterior.frames;
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
      self.postMessage({ type: "error", id, message: "invalid_phoneme_audio" });
    }
    return;
  }

  try {
    const { model, processor, tokenizer, runtime } = await getRecognizer();
    const inputs = await processor(samples);
    const output = await model(inputs);
    const logits = output?.logits;
    const posterior = softmaxPosteriorMatrix(logits);

    const blankTokenId =
      numericTokenId(model?.config?.pad_token_id) ??
      numericTokenId(tokenizer?.pad_token_id) ??
      0;

    if (blankTokenId >= posterior.vocabulary) {
      throw new Error("phoneme_blank_token_out_of_range");
    }

    const audioDurationMs = (samples.length / sampleRate) * 1_000;
    const { observations, emittedPhones } = collapseCtcSegments(
      posterior,
      tokenizer,
      model,
      audioDurationMs,
      blankTokenId,
    );

    if (observations.length === 0) {
      throw new Error("empty_phoneme_observation");
    }

    self.postMessage({
      type: "result",
      id,
      text: emittedPhones.join(" "),
      observations,
      posterior: {
        frameCount: posterior.frames,
        vocabularySize: posterior.vocabulary,
        blankTokenId,
        meanEntropy: posterior.meanEntropy,
        normalizedMeanEntropy:
          posterior.vocabulary > 1
            ? posterior.meanEntropy / Math.log(posterior.vocabulary)
            : 0,
        meanPeakPosterior: posterior.meanPeakPosterior,
        meanTop2Margin: posterior.meanTop2Margin,
        meanBlankPosterior: meanBlankPosterior(posterior, blankTokenId),
      },
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

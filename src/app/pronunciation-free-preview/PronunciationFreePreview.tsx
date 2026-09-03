"use client";

import { Cpu, Mic, RotateCcw, ShieldCheck, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  LOCAL_PRONUNCIATION_MAX_SECONDS,
  startLocalPronunciationRecording,
  type LocalRecordingResult,
  type LocalRecordingSession,
} from "@/features/pronunciation-free/audio";
import {
  alignPhoneSequences,
  parseObservedPhonemes,
  tokenizeExpectedIpa,
} from "@/features/pronunciation-free/ipa";
import {
  BrowserPhonemeRecognizer,
  type PhonemeWorkerEvent,
} from "@/features/pronunciation-free/phoneme-worker-client";
import type {
  LocalPhonemeObservation,
  LocalPhonemeRuntime,
  PhonemeWorkerProgress,
  PhoneAlignment,
} from "@/features/pronunciation-free/types";

const MODEL_ID = "onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX";
const MODEL_REVISION = "c69750f";

type Phase =
  | "idle"
  | "recording"
  | "ready"
  | "analyzing"
  | "result"
  | "error";

type PreviewTarget = {
  word: string;
  ipa: string;
  howTo: string;
  vietnameseTip: string | null;
};

function alignmentLabel(alignment: PhoneAlignment) {
  switch (alignment.kind) {
    case "match":
      return "khớp";
    case "substitution":
      return "model nghi thay âm";
    case "deletion":
      return "model nghi thiếu âm";
    case "insertion":
      return "model nghi thêm âm";
  }
}

function recordingErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message === "microphone_recording_unavailable") {
    return "Trình duyệt này chưa hỗ trợ cách ghi âm cần cho thử nghiệm.";
  }

  if (message === "recording_too_short") {
    return "Đoạn ghi âm quá ngắn. Nói từ mục tiêu rõ một lần rồi dừng.";
  }

  if (message === "recording_too_long") {
    return "Đoạn ghi âm dài hơn giới hạn của thử nghiệm.";
  }

  return "Không hoàn tất được đoạn ghi âm. Kiểm tra quyền microphone rồi thử lại.";
}

function inferenceErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("Failed to fetch") || message.includes("fetch")) {
    return "Không tải được model cục bộ. Kiểm tra mạng hoặc Content Security Policy rồi thử lại.";
  }

  return "Model phoneme chưa chạy được trên trình duyệt này. Không có điểm phát âm nào được tạo.";
}

export function PronunciationFreePreview({ target }: { target: PreviewTarget }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [recording, setRecording] = useState<LocalRecordingResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [observation, setObservation] = useState<LocalPhonemeObservation | null>(
    null,
  );
  const [workerProgress, setWorkerProgress] =
    useState<PhonemeWorkerProgress | null>(null);
  const [runtime, setRuntime] = useState<LocalPhonemeRuntime | null>(null);
  const [runtimeMessage, setRuntimeMessage] = useState<string | null>(null);

  const sessionRef = useRef<LocalRecordingSession | null>(null);
  const recognizerRef = useRef<BrowserPhonemeRecognizer | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const handleWorkerEvent = (event: PhonemeWorkerEvent) => {
      if (event.type === "progress") {
        setWorkerProgress(event.progress);
        return;
      }

      setRuntime(event.runtime);

      if (event.state === "fallback") {
        setRuntimeMessage(
          event.runtime.device === "webgpu"
            ? "WebGPU không dùng được; đang thử WASM trên CPU."
            : "WASM cũng không khởi tạo được.",
        );
        return;
      }

      if (event.state === "ready") {
        setRuntimeMessage(
          event.runtime.device === "webgpu"
            ? "Model đang chạy cục bộ bằng WebGPU."
            : "Model đang chạy cục bộ bằng WASM trên CPU.",
        );
      }
    };

    try {
      recognizerRef.current = new BrowserPhonemeRecognizer(handleWorkerEvent);
    } catch {
      setPhase("error");
      setMessage("Không khởi tạo được Web Worker cho pronunciation sensor.");
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      sessionRef.current?.cancel();
      sessionRef.current = null;

      recognizerRef.current?.terminate();
      recognizerRef.current = null;

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const revokeAudioUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  const stopRecording = async () => {
    const session = sessionRef.current;
    if (!session) return;

    clearTimer();

    try {
      const result = await session.stop();
      sessionRef.current = null;

      revokeAudioUrl();
      const nextAudioUrl = URL.createObjectURL(result.recording);
      audioUrlRef.current = nextAudioUrl;

      setRecording(result);
      setAudioUrl(nextAudioUrl);
      setObservation(null);
      setPhase("ready");
      setMessage(
        `Đã chuẩn hóa ${result.durationSeconds.toFixed(2)} giây audio thành mono 16 kHz ngay trong trình duyệt.`,
      );
    } catch (error) {
      sessionRef.current = null;
      setRecording(null);
      setObservation(null);
      setPhase("error");
      setMessage(recordingErrorMessage(error));
    }
  };

  const startRecording = async () => {
    clearTimer();
    sessionRef.current?.cancel();
    sessionRef.current = null;

    revokeAudioUrl();
    setAudioUrl(null);
    setRecording(null);
    setObservation(null);
    setWorkerProgress(null);
    setMessage(null);

    try {
      const session = await startLocalPronunciationRecording();
      sessionRef.current = session;
      setPhase("recording");
      setMessage(`Nói “${target.word}” một lần tự nhiên, rồi bấm Dừng.`);

      timerRef.current = setTimeout(() => {
        void stopRecording();
      }, LOCAL_PRONUNCIATION_MAX_SECONDS * 1_000);
    } catch (error) {
      setPhase("error");
      setMessage(recordingErrorMessage(error));
    }
  };

  const analyze = async () => {
    const currentRecording = recording;
    const recognizer = recognizerRef.current;

    if (!currentRecording || !recognizer || phase === "analyzing") {
      return;
    }

    setPhase("analyzing");
    setMessage(
      "Đang chạy phoneme model trên thiết bị. Lần đầu cần tải model lớn nên có thể chờ khá lâu.",
    );
    setObservation(null);
    setWorkerProgress(null);

    try {
      const result = await recognizer.recognize(currentRecording.samples);
      const expectedPhones = tokenizeExpectedIpa(target.ipa);
      const observedPhones = parseObservedPhonemes(result.text);

      if (observedPhones.length === 0) {
        throw new Error("empty_phoneme_observation");
      }

      const nextObservation: LocalPhonemeObservation = {
        calibration: "unvalidated",
        model: {
          id: MODEL_ID,
          revision: MODEL_REVISION,
          runtime: result.runtime,
        },
        target: {
          word: target.word,
          ipa: target.ipa,
        },
        expectedPhones,
        observedPhones,
        alignment: alignPhoneSequences(expectedPhones, observedPhones),
      };

      setRuntime(result.runtime);
      setObservation(nextObservation);
      setPhase("result");
      setMessage(null);
    } catch (error) {
      setPhase("error");
      setMessage(inferenceErrorMessage(error));
    }
  };

  const reset = () => {
    clearTimer();
    sessionRef.current?.cancel();
    sessionRef.current = null;

    revokeAudioUrl();
    setAudioUrl(null);
    setRecording(null);
    setObservation(null);
    setWorkerProgress(null);
    setMessage(null);
    setPhase("idle");
  };

  const progressPercent =
    workerProgress?.progress === null || workerProgress?.progress === undefined
      ? null
      : Math.min(100, Math.max(0, workerProgress.progress));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-8 sm:px-6 sm:py-12">
        <header className="flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Pronunciation · free sensor V1
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Nghe phoneme cục bộ trước, chưa chấm điểm phát âm.
            </h1>
          </div>
          <ShieldCheck className="mt-1 hidden size-8 shrink-0 text-muted-foreground sm:block" />
        </header>

        <section className="mt-10 rounded-3xl border bg-card p-5 shadow-sm sm:p-8">
          <div className="rounded-2xl border bg-muted/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Từ thử nghiệm
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-2">
              <p className="text-5xl font-semibold tracking-tight">{target.word}</p>
              <p className="pb-1 font-mono text-xl text-muted-foreground">
                {target.ipa}
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {target.howTo}
            </p>
            {target.vietnameseTip ? (
              <p className="mt-2 text-sm leading-6">{target.vietnameseTip}</p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startRecording}
              disabled={phase === "recording" || phase === "analyzing"}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Mic className="size-4" />
              Ghi một lượt
            </button>

            <button
              type="button"
              onClick={() => void stopRecording()}
              disabled={phase !== "recording"}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Square className="size-4" />
              Dừng
            </button>

            <button
              type="button"
              onClick={() => void analyze()}
              disabled={
                !recording || phase === "recording" || phase === "analyzing"
              }
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Cpu className="size-4" />
              {phase === "analyzing" ? "Đang phân tích…" : "Phân tích cục bộ"}
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={phase === "analyzing"}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="size-4" />
              Reset
            </button>
          </div>

          {audioUrl ? (
            <audio
              className="mt-6 w-full"
              controls
              preload="metadata"
              src={audioUrl}
            />
          ) : null}

          {message ? (
            <div className="mt-5 rounded-2xl border bg-muted/40 p-4 text-sm leading-6">
              {message}
            </div>
          ) : null}

          {phase === "analyzing" && workerProgress ? (
            <div className="mt-5 rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
                <span>{workerProgress.status}</span>
                {progressPercent !== null ? (
                  <span>{progressPercent.toFixed(0)}%</span>
                ) : null}
              </div>
              {progressPercent !== null ? (
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-foreground transition-[width]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              ) : null}
              {workerProgress.file ? (
                <p className="mt-2 break-all text-xs text-muted-foreground">
                  {workerProgress.file}
                </p>
              ) : null}
            </div>
          ) : null}

          {runtimeMessage ? (
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              {runtimeMessage}
            </p>
          ) : null}

          {observation ? (
            <div className="mt-7 space-y-5 rounded-2xl border p-5">
              <div>
                <p className="text-sm font-semibold">
                  Candidate phoneme evidence · chưa hiệu chuẩn
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Đây là điều model nghe được, không phải kết luận bạn phát âm đúng hay sai.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Expected
                  </p>
                  <p className="mt-2 font-mono text-xl">
                    {observation.expectedPhones.join(" ")}
                  </p>
                </div>
                <div className="rounded-xl bg-muted/40 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Model observed
                  </p>
                  <p className="mt-2 font-mono text-xl">
                    {observation.observedPhones.join(" ")}
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border">
                {observation.alignment.map((item, index) => (
                  <div
                    key={`${item.kind}-${index}-${item.expected ?? "none"}-${item.observed ?? "none"}`}
                    className="grid grid-cols-[1fr_1fr_2fr] gap-3 border-b px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="font-mono">{item.expected ?? "—"}</span>
                    <span className="font-mono">{item.observed ?? "—"}</span>
                    <span
                      className={
                        item.kind === "match"
                          ? "text-muted-foreground"
                          : "font-medium"
                      }
                    >
                      {alignmentLabel(item)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="text-xs leading-5 text-muted-foreground">
                Model: {observation.model.id} · revision {observation.model.revision}
                {runtime
                  ? ` · ${runtime.device}/${runtime.dtype}`
                  : ""}
                {` · calibration: ${observation.calibration}`}
              </div>
            </div>
          ) : null}
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <p className="text-sm font-semibold">Bài test cố ý</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Ghi một lượt “think”, rồi thử cố ý nói gần “sink” và “tink”. Sensor chỉ đáng đi tiếp nếu chuỗi phoneme thay đổi theo hướng hợp lý.
            </p>
          </div>
          <div className="rounded-2xl border p-5">
            <p className="text-sm font-semibold">Privacy / chi phí</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Audio được xử lý trên thiết bị và không upload qua API AtoEnglish. Lần đầu trình duyệt vẫn phải tải runtime và model miễn phí, khoảng vài trăm MB.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import { Cpu, Mic, RotateCcw, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  LOCAL_PRONUNCIATION_MAX_SECONDS,
  startLocalPronunciationRecording,
  type LocalRecordingResult,
  type LocalRecordingSession,
} from "@/features/pronunciation-free/audio";
import {
  BrowserPhonemeRecognizer,
  type PhonemeWorkerEvent,
} from "@/features/pronunciation-free/phoneme-worker-client";
import type {
  LocalCtcPosteriorSummary,
  LocalObservedPhone,
  LocalPhonemeRuntime,
  PhonemeWorkerProgress,
} from "@/features/pronunciation-free/types";
import { tokenizeExpectedIpa } from "@/features/pronunciation-free/ipa";
import {
  alignCanonicalPronunciation,
  analyzeProsody,
  analyzeSignalQuality,
  composeUnvalidatedPronunciationAssessment,
  deriveUncalibratedSegmentalEvidence,
  type PhoneAlignmentEvidence,
  type ProsodySummary,
  type SignalQualityEvidence,
  type UnvalidatedPronunciationAssessment,
} from "@/lib/pronunciation-engine";

const MODEL_ID = "onnx-community/wav2vec2-lv-60-espeak-cv-ft-ONNX";
const MODEL_REVISION = "c69750f";
const SAMPLE_RATE = 16_000;

type Phase = "idle" | "recording" | "ready" | "analyzing" | "result" | "error";

type PreviewTarget = {
  word: string;
  ipa: string;
  howTo: string;
  vietnameseTip: string | null;
};

type EvidenceResult = {
  runtime: LocalPhonemeRuntime;
  observations: LocalObservedPhone[];
  posterior: LocalCtcPosteriorSummary;
  alignment: PhoneAlignmentEvidence[];
  signal: SignalQualityEvidence;
  prosody: ProsodySummary;
  assessment: UnvalidatedPronunciationAssessment;
};

function percent(value: number | null, digits = 1) {
  return value === null ? "—" : `${(value * 100).toFixed(digits)}%`;
}

function safeErrorCode(error: unknown) {
  const value = error instanceof Error ? error.message : String(error ?? "unknown_error");
  return value.replace(/[\r\n\t]+/gu, " ").slice(0, 220);
}

function recordingError(error: unknown) {
  const code = safeErrorCode(error);
  if (code === "recording_too_short") return "Đoạn ghi âm quá ngắn.";
  if (code === "recording_too_long") return "Đoạn ghi âm quá dài.";
  if (code === "recording_signal_missing") return "Microphone không thu được tín hiệu giọng nói đủ rõ.";
  return `Không ghi âm được · ${code}`;
}

function alignmentLabel(item: PhoneAlignmentEvidence) {
  if (item.kind === "match") return "khớp top-1";
  if (item.kind === "substitution") return "candidate substitution";
  if (item.kind === "deletion") return "candidate deletion";
  return "candidate insertion";
}

export function PronunciationEvidencePreview({ target }: { target: PreviewTarget }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [recording, setRecording] = useState<LocalRecordingResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<PhonemeWorkerProgress | null>(null);
  const [runtimeMessage, setRuntimeMessage] = useState<string | null>(null);
  const [result, setResult] = useState<EvidenceResult | null>(null);

  const sessionRef = useRef<LocalRecordingSession | null>(null);
  const recognizerRef = useRef<BrowserPhonemeRecognizer | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      sessionRef.current?.cancel();
      recognizerRef.current?.terminate();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const clearAudioUrl = () => {
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    audioUrlRef.current = null;
    setAudioUrl(null);
  };

  const onWorkerEvent = (event: PhonemeWorkerEvent) => {
    if (event.type === "progress") {
      setProgress(event.progress);
      return;
    }

    if (event.state === "fallback") {
      setRuntimeMessage(
        `${event.runtime.device}/${event.runtime.dtype} thất bại${event.message ? ` · ${event.message.slice(0, 140)}` : ""}`,
      );
      return;
    }

    if (event.state === "ready") {
      setRuntimeMessage(`CTC model sẵn sàng · ${event.runtime.device}/${event.runtime.dtype}`);
    }
  };

  const recognizer = () => {
    if (!recognizerRef.current) {
      recognizerRef.current = new BrowserPhonemeRecognizer(onWorkerEvent);
    }
    return recognizerRef.current;
  };

  const stopRecording = async () => {
    const session = sessionRef.current;
    if (!session) return;
    clearTimer();

    try {
      const nextRecording = await session.stop();
      sessionRef.current = null;
      clearAudioUrl();
      const nextUrl = URL.createObjectURL(nextRecording.recording);
      audioUrlRef.current = nextUrl;
      setAudioUrl(nextUrl);
      setRecording(nextRecording);
      setResult(null);
      setPhase("ready");
      setMessage(
        `Audio local: ${nextRecording.durationSeconds.toFixed(2)}s · 16 kHz mono · RMS ${nextRecording.rmsAmplitude.toFixed(4)}`,
      );
    } catch (error) {
      sessionRef.current = null;
      setRecording(null);
      setResult(null);
      setPhase("error");
      setMessage(recordingError(error));
    }
  };

  const startRecording = async () => {
    clearTimer();
    sessionRef.current?.cancel();
    sessionRef.current = null;
    clearAudioUrl();
    setRecording(null);
    setResult(null);
    setProgress(null);
    setMessage(null);

    try {
      const session = await startLocalPronunciationRecording();
      sessionRef.current = session;
      setPhase("recording");
      setMessage(`Nói “${target.word}” một lần tự nhiên.`);
      timerRef.current = setTimeout(() => void stopRecording(), LOCAL_PRONUNCIATION_MAX_SECONDS * 1_000);
    } catch (error) {
      setPhase("error");
      setMessage(recordingError(error));
    }
  };

  const analyze = async () => {
    if (!recording || phase === "analyzing") return;

    setPhase("analyzing");
    setResult(null);
    setProgress(null);
    setMessage(
      "Đang chạy CTC trực tiếp và giữ posterior top-k thật. Lần đầu có thể phải tải model lớn.",
    );

    try {
      const signal = analyzeSignalQuality(recording.samples, SAMPLE_RATE);
      const prosody = analyzeProsody(recording.samples, SAMPLE_RATE);
      const recognition = await recognizer().recognize(recording.samples);
      const expectedPhones = tokenizeExpectedIpa(target.ipa);

      const alignmentResult = alignCanonicalPronunciation(
        { id: `${target.word}-preview`, phones: expectedPhones },
        recognition.observations,
      );
      const segmental = deriveUncalibratedSegmentalEvidence(alignmentResult);
      const assessment = composeUnvalidatedPronunciationAssessment({
        signalQuality: signal,
        segmental,
        prosody,
      });

      setResult({
        runtime: recognition.runtime,
        observations: recognition.observations,
        posterior: recognition.posterior,
        alignment: alignmentResult.alignment,
        signal,
        prosody,
        assessment,
      });
      setPhase("result");
      setMessage(null);
    } catch (error) {
      setPhase("error");
      setMessage(`Phân tích thất bại · ${safeErrorCode(error)}`);
    }
  };

  const reset = () => {
    clearTimer();
    sessionRef.current?.cancel();
    sessionRef.current = null;
    clearAudioUrl();
    setRecording(null);
    setProgress(null);
    setRuntimeMessage(null);
    setResult(null);
    setMessage(null);
    setPhase("idle");
  };

  const progressPercent =
    progress?.progress === null || progress?.progress === undefined
      ? null
      : Math.min(100, Math.max(0, progress.progress));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            AtoEnglish pronunciation evidence R&D
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            {target.word} <span className="font-mono text-muted-foreground">{target.ipa}</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
            Đây là màn hình đo evidence, không phải máy cho điểm. CTC posterior, chất lượng tín hiệu,
            alignment và prosody được giữ riêng; điểm người học vẫn bị khóa cho tới khi hiệu chuẩn với human raters.
          </p>
        </header>

        <section className="mt-8 rounded-3xl border bg-card p-5 sm:p-7">
          <p className="text-sm leading-6">{target.howTo}</p>
          {target.vietnameseTip ? (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{target.vietnameseTip}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startRecording}
              disabled={phase === "recording" || phase === "analyzing"}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background disabled:opacity-40"
            >
              <Mic className="size-4" /> Ghi
            </button>
            <button
              type="button"
              onClick={() => void stopRecording()}
              disabled={phase !== "recording"}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold disabled:opacity-40"
            >
              <Square className="size-4" /> Dừng
            </button>
            <button
              type="button"
              onClick={() => void analyze()}
              disabled={!recording || phase === "recording" || phase === "analyzing"}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold disabled:opacity-40"
            >
              <Cpu className="size-4" /> {phase === "analyzing" ? "Đang chạy…" : "Phân tích evidence"}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={phase === "analyzing"}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold disabled:opacity-40"
            >
              <RotateCcw className="size-4" /> Reset
            </button>
          </div>

          {audioUrl ? <audio className="mt-5 w-full" controls src={audioUrl} /> : null}
          {message ? <p className="mt-5 rounded-2xl border bg-muted/40 p-4 text-sm">{message}</p> : null}
          {runtimeMessage ? <p className="mt-3 break-words text-xs text-muted-foreground">{runtimeMessage}</p> : null}

          {phase === "analyzing" && progress ? (
            <div className="mt-5 rounded-2xl border p-4 text-xs text-muted-foreground">
              <div className="flex justify-between gap-4">
                <span>{progress.status}</span>
                <span>{progressPercent === null ? "…" : `${progressPercent.toFixed(0)}%`}</span>
              </div>
              {progress.file ? <p className="mt-2 break-all">{progress.file}</p> : null}
            </div>
          ) : null}
        </section>

        {result ? (
          <div className="mt-6 space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border p-4">
                <p className="text-xs text-muted-foreground">Signal decision</p>
                <p className="mt-2 font-semibold">{result.assessment.decision}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs text-muted-foreground">CTC entropy</p>
                <p className="mt-2 font-semibold">{percent(result.posterior.normalizedMeanEntropy)}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs text-muted-foreground">Top-2 margin</p>
                <p className="mt-2 font-semibold">{percent(result.posterior.meanTop2Margin)}</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-xs text-muted-foreground">Blank posterior</p>
                <p className="mt-2 font-semibold">{percent(result.posterior.meanBlankPosterior)}</p>
              </div>
            </section>

            <section className="rounded-3xl border p-5 sm:p-7">
              <h2 className="text-lg font-semibold">CTC phone segments · posterior thật</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Top-k không được renormalize thành 100%; phần xác suất bị bỏ vẫn được coi là uncertainty.
              </p>
              <div className="mt-4 space-y-3">
                {result.observations.map((observation, index) => (
                  <div key={`${index}-${observation.startMs}`} className="rounded-2xl bg-muted/40 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="font-mono text-xl">{observation.candidates[0]?.phone ?? "—"}</span>
                      <span className="text-xs text-muted-foreground">
                        {observation.startMs.toFixed(0)}–{observation.endMs.toFixed(0)} ms
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {observation.candidates.map((candidate) => (
                        <span key={`${candidate.phone}-${candidate.probability}`} className="rounded-full border px-3 py-1 font-mono text-xs">
                          {candidate.phone} {percent(candidate.probability)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border p-5 sm:p-7">
              <h2 className="text-lg font-semibold">Posterior-aware alignment</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border">
                {result.alignment.map((item, index) => (
                  <div
                    key={`${index}-${item.kind}-${item.expected ?? "none"}-${item.observed ?? "none"}`}
                    className="grid grid-cols-[0.8fr_0.8fr_1.7fr] gap-3 border-b px-4 py-3 text-sm last:border-b-0"
                  >
                    <span className="font-mono">{item.expected ?? "—"}</span>
                    <span className="font-mono">{item.observed ?? "—"}</span>
                    <span>
                      {alignmentLabel(item)} · cost {item.cost.toFixed(3)} · p {item.observedProbability?.toFixed(3) ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border p-5">
                <h2 className="font-semibold">Signal quality</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  RMS {result.signal.rmsAmplitude.toFixed(4)} · active {percent(result.signal.activeSpeechFraction)} · SNR proxy {result.signal.snrProxyDb?.toFixed(1) ?? "—"} dB
                </p>
                <p className="mt-2 text-sm">Warnings: {result.signal.warnings.join(", ") || "none"}</p>
              </div>
              <div className="rounded-3xl border p-5">
                <h2 className="font-semibold">Prosody evidence</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  voiced {percent(result.prosody.voicedFraction)} · pause {percent(result.prosody.pauseFraction)} · median F0 {result.prosody.pitch.medianHz?.toFixed(1) ?? "—"} Hz
                </p>
                <p className="mt-2 text-sm">Pitch range {result.prosody.pitch.rangeSemitones?.toFixed(1) ?? "—"} st · dynamic range {result.prosody.energy.dynamicRangeDb.toFixed(1)} dB</p>
              </div>
            </section>

            <section className="rounded-3xl border border-dashed p-5 text-sm leading-6 text-muted-foreground">
              Learner scores: pronunciation=null · completeness=null · stress=null · fluency=null · prosody=null · total=null.
              Calibration vẫn là <span className="font-mono">{result.assessment.calibration}</span>. Runtime: {result.runtime.device}/{result.runtime.dtype}. Model: {MODEL_ID}@{MODEL_REVISION}.
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

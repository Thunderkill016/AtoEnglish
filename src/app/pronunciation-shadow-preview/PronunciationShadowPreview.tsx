"use client";

import Link from "next/link";
import { AlertTriangle, Headphones, Loader2, Mic, RotateCcw, ShieldCheck, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type {
  PronunciationShadowObservation,
  PronunciationShadowTarget,
} from "@/lib/pronunciation/openpronounce-shadow";

type ObserveResponse =
  | {
      success: true;
      observation: PronunciationShadowObservation;
      error: null;
    }
  | {
      success: false;
      observation: null;
      error: string;
    };

type Phase = "idle" | "recording" | "ready" | "analyzing" | "result" | "error";

function preferredRecorderMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return candidates.find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? "";
}

function recordingFilename(contentType: string) {
  if (contentType.includes("mp4")) return "recording.mp4";
  if (contentType.includes("ogg")) return "recording.ogg";
  if (contentType.includes("wav")) return "recording.wav";
  return "recording.webm";
}

function confidenceLabel(confidence: number | null) {
  if (confidence === null) return "model confidence chưa có";
  return `model confidence ${Math.round(confidence * 100)}%`;
}

export function PronunciationShadowPreview({
  target,
}: {
  target: PronunciationShadowTarget;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [observation, setObservation] = useState<PronunciationShadowObservation | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingBlobRef = useRef<Blob | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const clearRecordingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const revokeAudioUrl = () => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearRecordingTimeout();
      stopTracks();
      revokeAudioUrl();
    };
  }, []);

  const reset = () => {
    clearRecordingTimeout();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    stopTracks();
    revokeAudioUrl();
    chunksRef.current = [];
    recordingBlobRef.current = null;
    setAudioUrl(null);
    setHasRecording(false);
    setObservation(null);
    setMessage(null);
    setNeedsLogin(false);
    setPhase("idle");
  };

  const stopRecording = () => {
    clearRecordingTimeout();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const startRecording = async () => {
    setMessage(null);
    setObservation(null);
    setNeedsLogin(false);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setPhase("error");
      setMessage("Browser này chưa hỗ trợ microphone recording cần cho acoustic preview.");
      return;
    }

    try {
      clearRecordingTimeout();
      stopTracks();
      revokeAudioUrl();
      chunksRef.current = [];
      recordingBlobRef.current = null;
      setAudioUrl(null);
      setHasRecording(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      streamRef.current = stream;

      const mimeType = preferredRecorderMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      });

      recorder.addEventListener("stop", () => {
        clearRecordingTimeout();
        const finalType = recorder.mimeType || chunksRef.current[0]?.type || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: finalType });
        stopTracks();

        if (blob.size === 0) {
          recordingBlobRef.current = null;
          setHasRecording(false);
          setPhase("error");
          setMessage("Recording rỗng. Thử lại và nói gần microphone hơn.");
          return;
        }

        recordingBlobRef.current = blob;
        const nextAudioUrl = URL.createObjectURL(blob);
        audioUrlRef.current = nextAudioUrl;
        setAudioUrl(nextAudioUrl);
        setHasRecording(true);
        setPhase("ready");
        setMessage("Audio chỉ đang nằm trong browser. Bấm phân tích để gửi transiently tới shadow service.");
      });

      recorder.start();
      setPhase("recording");
      setMessage(`Nói từ “${target.word}” một lần tự nhiên, rồi dừng.`);
      timeoutRef.current = setTimeout(stopRecording, 10_000);
    } catch {
      stopTracks();
      setPhase("error");
      setMessage("Không mở được microphone. Kiểm tra quyền microphone rồi thử lại.");
    }
  };

  const analyze = async () => {
    const audio = recordingBlobRef.current;
    if (!audio || phase === "analyzing") return;

    setPhase("analyzing");
    setMessage("Đang lấy acoustic observation thử nghiệm…");
    setObservation(null);
    setNeedsLogin(false);

    const formData = new FormData();
    formData.set("soundId", target.soundId);
    formData.set("audio", audio, recordingFilename(audio.type));

    try {
      const response = await fetch("/api/pronunciation/observe", {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        cache: "no-store",
      });

      const payload = (await response.json()) as ObserveResponse;
      if (!response.ok || !payload.success) {
        setNeedsLogin(response.status === 401);
        setPhase("error");
        setMessage(payload.error || "Acoustic observation chưa dùng được cho lượt này.");
        return;
      }

      setObservation(payload.observation);
      setPhase("result");
      setMessage(null);
    } catch {
      setPhase("error");
      setMessage("Không gửi được recording tới acoustic observation service.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f4ed] text-[#171713]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a5b00]">
              Pronunciation · acoustic shadow V1
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Có acoustic signal thật, chưa gọi nó là sự thật về phát âm.
            </h1>
          </div>
          <ShieldCheck className="hidden size-8 text-[#2d6a4f] sm:block" />
        </header>

        <section className="flex flex-1 flex-col justify-center py-10">
          <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,30,20,.07)] sm:p-8">
            <div className="rounded-2xl bg-[#f5f3ec] p-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-black/35">Canonical target</p>
              <div className="mt-3 flex items-end gap-4">
                <p className="text-4xl font-semibold">{target.word}</p>
                <p className="pb-1 font-mono text-lg text-black/50">{target.ipa}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {phase !== "recording" ? (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={phase === "analyzing"}
                  className="flex items-center gap-2 rounded-full bg-[#171713] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
                >
                  <Mic className="size-4" /> Ghi một lượt
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="flex items-center gap-2 rounded-full bg-[#8f2d24] px-5 py-3 text-sm font-semibold text-white"
                >
                  <Square className="size-4" /> Dừng
                </button>
              )}

              {hasRecording && phase !== "recording" ? (
                <button
                  type="button"
                  onClick={analyze}
                  disabled={phase === "analyzing"}
                  className="flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-3 text-sm font-semibold text-white disabled:opacity-30"
                >
                  {phase === "analyzing" ? <Loader2 className="size-4 animate-spin" /> : <Headphones className="size-4" />}
                  Phân tích thử nghiệm
                </button>
              ) : null}

              <button
                type="button"
                onClick={reset}
                disabled={phase === "analyzing"}
                className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-3 text-sm font-semibold disabled:opacity-40"
              >
                <RotateCcw className="size-4" /> Reset
              </button>
            </div>

            {phase === "analyzing" && (
              <div className="mt-5 flex items-center gap-2 text-sm text-black/55">
                <Loader2 className="size-4 animate-spin" /> OpenPronounce đang xử lý audio transiently.
              </div>
            )}

            {audioUrl && phase !== "recording" && (
              <audio className="mt-5 w-full" controls src={audioUrl} preload="metadata" />
            )}

            {message && (
              <div className="mt-5 rounded-2xl bg-[#fff7e6] p-4 text-sm leading-6 text-[#6f4d00]">
                {message}
              </div>
            )}

            {needsLogin && (
              <Link
                href="/login?mode=login&next=/pronunciation-shadow-preview"
                className="mt-4 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"
              >
                Đăng nhập để chạy shadow analysis
              </Link>
            )}

            {observation && (
              <div className="mt-6 rounded-2xl border border-[#8a5b00]/20 bg-[#fffaf0] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[#8a5b00]" />
                  <div>
                    <p className="font-semibold">Acoustic observation · chưa hiệu chuẩn cho người Việt</p>
                    <p className="mt-1 text-sm leading-6 text-black/55">
                      Đây là model observation, không phải điểm phát âm, không ghi mastery và không xác nhận bạn phát âm đúng/sai.
                    </p>
                  </div>
                </div>

                {observation.suspectedErrors.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {observation.suspectedErrors.map((error, errorIndex) => (
                      <div key={`${error.word}-${errorIndex}`} className="rounded-xl bg-white p-4">
                        <p className="text-xs font-bold uppercase tracking-[.14em] text-black/35">Candidate observation</p>
                        <p className="mt-2 text-sm leading-6">
                          Model nghe <span className="font-mono font-semibold">/{error.observedPhones ?? "?"}/</span>{" "}
                          trong khi target provider dùng <span className="font-mono font-semibold">/{error.expectedPhones ?? "?"}/</span>.
                        </p>
                        <p className="mt-1 text-xs text-black/40">{confidenceLabel(error.confidence)}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl bg-white p-4 text-sm leading-6 text-black/60">
                    Provider không flag candidate error rõ trong lượt này. Điều đó chưa đủ để kết luận phát âm đúng.
                  </p>
                )}

                <div className="mt-4 text-xs leading-5 text-black/35">
                  Provider {observation.provider.name} {observation.provider.version} · calibration: {observation.calibration}
                </div>
              </div>
            )}
          </div>
        </section>

        <footer className="mt-auto pt-6 text-center text-[11px] leading-5 text-black/35">
          Raw audio không được persist bởi AtoEnglish V1. Raw provider transcript và score không đi qua learner-facing contract.
        </footer>
      </div>
    </main>
  );
}

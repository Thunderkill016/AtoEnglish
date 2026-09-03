"use client";

import Link from "next/link";
import {
  ArrowRight,
  CircleAlert,
  Headphones,
  Loader2,
  LogIn,
  Mic2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getNếpAdaptivePracticeQueue } from "@/app/actions/adaptive-practice";
import { recordNếpPracticeAttempt } from "@/app/actions/learning-evidence";
import type { NếpPracticeEnvelope } from "@/lib/nep/practice-execution.v1";
import {
  connectRealtimeVoice,
  type RealtimeVoiceConnection,
} from "@/lib/realtime/webrtc-client";

import { adaptiveVoiceModeForPractice } from "./adaptive-voice-policy";

type SurfacePhase =
  | "idle"
  | "planning"
  | "active"
  | "complete"
  | "empty"
  | "auth-required"
  | "error";

type SaveState = "idle" | "saving" | "evidence" | "attempt" | "not-saved" | "error";
type SpeechTransport = "conversation" | "capture" | "browser" | null;

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const browserWindow = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function realtimeVoiceSupported() {
  return (
    typeof window !== "undefined" &&
    typeof RTCPeerConnection !== "undefined" &&
    typeof navigator !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia)
  );
}

function saveLabel(state: SaveState) {
  if (state === "saving") return "Đang lưu attempt…";
  if (state === "evidence") return "Attempt + mastery evidence đã được ghi.";
  if (state === "attempt") return "Attempt đã được ghi; lần này không tạo mastery evidence.";
  if (state === "not-saved") return "Phiên đăng nhập không còn hợp lệ; kết quả chưa được lưu.";
  if (state === "error") return "Attempt chưa lưu được. Có thể thử gửi lại.";
  return null;
}

export function AdaptivePracticePreview() {
  const [phase, setPhase] = useState<SurfacePhase>("idle");
  const [practices, setPractices] = useState<NếpPracticeEnvelope[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answerSource, setAnswerSource] = useState<"speech" | "text" | null>(null);
  const [supportUsed, setSupportUsed] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechTransport, setSpeechTransport] = useState<SpeechTransport>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const attemptStartedAt = useRef<number | null>(null);
  const realtimeConnectionRef = useRef<RealtimeVoiceConnection | null>(null);
  const realtimeCaptureTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const learnerTranscriptSeenRef = useRef(false);
  const postLearnerAssistantSeenRef = useRef(false);

  const practice = practices[index] ?? null;
  const saving = saveState === "saving";
  const speechAvailable = realtimeVoiceSupported() || recognitionCtor() !== null;
  const persistedLabel = saveLabel(saveState);
  const voiceMode = practice ? adaptiveVoiceModeForPractice(practice) : null;

  const stopRealtimeCapture = () => {
    if (realtimeCaptureTimeoutRef.current) {
      clearTimeout(realtimeCaptureTimeoutRef.current);
      realtimeCaptureTimeoutRef.current = null;
    }
    realtimeConnectionRef.current?.close();
    realtimeConnectionRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (realtimeCaptureTimeoutRef.current) {
        clearTimeout(realtimeCaptureTimeoutRef.current);
      }
      realtimeConnectionRef.current?.close();
    };
  }, []);

  const resetResponse = () => {
    stopRealtimeCapture();
    learnerTranscriptSeenRef.current = false;
    postLearnerAssistantSeenRef.current = false;
    setAnswer("");
    setAnswerSource(null);
    setSupportUsed(false);
    setListening(false);
    setSpeechTransport(null);
    setFeedback(null);
    setEvaluationSuccess(null);
    setSaveState("idle");
    setSubmitted(false);
    attemptStartedAt.current = Date.now();
  };

  const loadQueue = async () => {
    setPhase("planning");
    setError(null);
    setPractices([]);
    setIndex(0);

    const result = await getNếpAdaptivePracticeQueue(2);
    if (!result.success) {
      setError(result.error);
      setPhase(result.authRequired ? "auth-required" : "error");
      return;
    }

    if (result.practices.length === 0) {
      setPhase("empty");
      return;
    }

    setPractices(result.practices);
    setIndex(0);
    setPhase("active");
    resetResponse();
  };

  const selectChoice = (choice: string) => {
    if (saving || submitted) return;
    setAnswer(choice);
    setAnswerSource(null);
    setFeedback(null);
    setEvaluationSuccess(null);
    setSaveState("idle");
  };

  const startBrowserSpeech = (fallbackMessage?: string) => {
    const Recognition = recognitionCtor();
    if (!Recognition) return false;

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      setAnswer(event.results[0]?.[0]?.transcript ?? "");
      setAnswerSource("speech");
      setListening(false);
      setSpeechTransport("browser");
      setFeedback(fallbackMessage ?? null);
      setEvaluationSuccess(null);
      setSaveState("idle");
    };
    recognition.onerror = () => {
      setListening(false);
      setFeedback("Không lấy được transcript. Thử mic lại hoặc dùng text fallback.");
    };
    recognition.onend = () => setListening(false);

    setSpeechTransport("browser");
    setListening(true);
    if (fallbackMessage) setFeedback(fallbackMessage);
    recognition.start();
    return true;
  };

  const startCaptureSpeech = async (fallbackMessage?: string) => {
    stopRealtimeCapture();
    setSpeechTransport("capture");
    setListening(true);
    setFeedback(fallbackMessage ?? "Đang mở realtime speech capture…");

    try {
      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }

      const connection = await connectRealtimeVoice({
        audioElement: audioElementRef.current,
        mode: "capture",
        onSignal: (signal) => {
          if (signal.kind === "learner-transcript") {
            const transcript = signal.transcript.trim();
            stopRealtimeCapture();
            setListening(false);
            setSpeechTransport("capture");

            if (!transcript) {
              setFeedback("Realtime không nghe rõ câu vừa nói. Thử lại một lần nữa.");
              return;
            }

            setAnswer(transcript);
            setAnswerSource("speech");
            setFeedback(fallbackMessage ?? null);
            setEvaluationSuccess(null);
            setSaveState("idle");
            return;
          }

          if (signal.kind === "provider-error") {
            stopRealtimeCapture();
            setListening(false);
            setFeedback("Realtime voice gặp lỗi. Có thể thử lại hoặc dùng text fallback.");
          }
        },
        onStateChange: (state) => {
          if (state === "connected" && !fallbackMessage) {
            setFeedback("Realtime đang nghe. Nói tự nhiên và kết thúc câu khi sẵn sàng.");
          }
        },
      });

      realtimeConnectionRef.current = connection;
      realtimeCaptureTimeoutRef.current = setTimeout(() => {
        stopRealtimeCapture();
        setListening(false);
        setFeedback("Không nhận được câu nói sau 25 giây. Thử mic lại khi sẵn sàng.");
      }, 25_000);
    } catch (captureError) {
      stopRealtimeCapture();
      setListening(false);
      const message = captureError instanceof Error ? captureError.message : "Realtime voice chưa dùng được.";
      const browserFallback = startBrowserSpeech(
        fallbackMessage
          ? `${fallbackMessage} Realtime capture cũng chưa dùng được (${message}); đã chuyển sang speech recognition của browser.`
          : `Realtime chưa dùng được (${message}). Đã chuyển sang speech recognition của browser.`,
      );
      if (!browserFallback) {
        setFeedback(`${message} Có thể dùng text fallback, nhưng text không tạo speaking evidence.`);
      }
    }
  };

  const startConversationSpeech = async () => {
    if (!practice) return;

    stopRealtimeCapture();
    learnerTranscriptSeenRef.current = false;
    postLearnerAssistantSeenRef.current = false;
    setSpeechTransport("conversation");
    setListening(true);
    setFeedback("Đang mở roleplay realtime có server-side budget guard…");

    try {
      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }

      const connection = await connectRealtimeVoice({
        audioElement: audioElementRef.current,
        mode: "conversation",
        taskIdentity: {
          lessonId: practice.lessonId,
          lessonVersion: practice.lessonVersion,
          actionId: practice.actionId,
        },
        onSignal: (signal) => {
          if (signal.kind === "assistant-transcript") {
            if (learnerTranscriptSeenRef.current) {
              postLearnerAssistantSeenRef.current = true;
              setFeedback("AI partner đang phản hồi lượt nói của bạn…");
            } else {
              setFeedback("Nghe AI partner mở lượt, rồi trả lời tự nhiên.");
            }
            return;
          }

          if (signal.kind === "learner-transcript") {
            const transcript = signal.transcript.trim();
            if (!transcript) {
              setFeedback("Realtime chưa nghe rõ câu vừa nói. Nói lại khi AI partner dừng.");
              return;
            }

            learnerTranscriptSeenRef.current = true;
            setAnswer(transcript);
            setAnswerSource("speech");
            setSpeechTransport("conversation");
            setFeedback("Đã nhận learner turn; chờ AI partner khép roleplay.");
            setEvaluationSuccess(null);
            setSaveState("idle");
            return;
          }

          if (signal.kind === "response-done") {
            if (!learnerTranscriptSeenRef.current) {
              setFeedback("Đến lượt bạn. Trả lời bằng tiếng Anh.");
              return;
            }

            if (postLearnerAssistantSeenRef.current) {
              stopRealtimeCapture();
              setListening(false);
              setFeedback("Roleplay đã khép lại. Canonical evaluator sẽ đánh giá learner transcript riêng biệt.");
            }
            return;
          }

          if (signal.kind === "provider-error") {
            stopRealtimeCapture();
            setListening(false);
            setFeedback(
              signal.message ||
                "Roleplay realtime gặp lỗi giữa lượt. Lượt này chưa được đổi sang capture để tránh trộn hai interaction khác nhau.",
            );
          }
        },
        onStateChange: (state) => {
          if (state === "connected") {
            setFeedback("Roleplay đã kết nối. Nghe partner mở lượt trước.");
          }
          if (state === "failed") {
            setListening(false);
            setFeedback("Kết nối roleplay realtime bị lỗi.");
          }
        },
      });

      realtimeConnectionRef.current = connection;
      realtimeCaptureTimeoutRef.current = setTimeout(() => {
        stopRealtimeCapture();
        setListening(false);
        setFeedback("Roleplay đã vượt quá 45 giây và được đóng. Có thể thử lại một lượt ngắn hơn.");
      }, 45_000);
    } catch (conversationError) {
      stopRealtimeCapture();
      setListening(false);
      const message = conversationError instanceof Error
        ? conversationError.message
        : "Realtime roleplay chưa dùng được.";
      await startCaptureSpeech(
        `Roleplay không mở được (${message}). Đã hạ xuống capture-only; câu nói vẫn có thể tạo speaking evidence nhưng không được coi là interactive roleplay.`,
      );
    }
  };

  const startSpeech = async () => {
    if (!practice || saving || submitted || listening) return;

    setFeedback(null);
    setEvaluationSuccess(null);
    setSaveState("idle");

    if (!realtimeVoiceSupported()) {
      const browserFallback = startBrowserSpeech(
        voiceMode === "conversation"
          ? "Browser không hỗ trợ guarded realtime roleplay. Đang dùng capture-only bằng speech recognition; đây không phải interactive roleplay."
          : undefined,
      );
      if (!browserFallback) {
        setFeedback(
          "Browser này không hỗ trợ realtime voice hoặc speech recognition. Có thể dùng text fallback, nhưng text không tạo speaking evidence.",
        );
      }
      return;
    }

    if (voiceMode === "conversation") {
      await startConversationSpeech();
      return;
    }

    await startCaptureSpeech();
  };

  const submit = async () => {
    if (!practice || saving || submitted || listening || answer.trim().length === 0) return;

    const now = Date.now();
    const latencyMs = attemptStartedAt.current === null ? 0 : now - attemptStartedAt.current;
    setSaveState("saving");
    setError(null);

    const result = await recordNếpPracticeAttempt({
      lessonId: practice.lessonId,
      lessonVersion: practice.lessonVersion,
      actionId: practice.actionId,
      response: answer,
      responseSource: practice.modality === "choice" ? null : answerSource,
      supportUsed,
      latencyMs,
    });

    if (!result.success) {
      setFeedback(result.feedback ?? result.error);
      setEvaluationSuccess(result.evaluation?.success ?? null);
      setSaveState("error");
      return;
    }

    setFeedback(result.feedback);
    setEvaluationSuccess(result.evaluation.success);

    if (!result.persisted) {
      setSaveState("not-saved");
      return;
    }

    setSaveState(result.evidenceRecorded ? "evidence" : "attempt");
    setSubmitted(true);
  };

  const next = () => {
    if (!submitted) return;
    if (index < practices.length - 1) {
      setIndex((value) => value + 1);
      resetResponse();
      return;
    }
    setPhase("complete");
  };

  const progress = practices.length > 0 ? Math.round(((index + 1) / practices.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#f6f4ed] text-[#171713]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2d6a4f]">Nếp · adaptive preview V1</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Practice tiếp theo được chọn từ learner state.</h1>
          </div>
          <ShieldCheck className="hidden size-8 text-[#2d6a4f] sm:block" />
        </header>

        {phase === "idle" && (
          <section className="my-auto py-16">
            <div className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(20,30,20,.07)] sm:p-9">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#24583f]"><Sparkles className="size-4" /> Session Planner V1</div>
              <p className="mt-5 max-w-xl text-lg leading-8 text-black/65">Planner đọc learner state, lịch sử practice và recurring errors để chọn một queue ngắn. Browser chỉ nhận task an toàn; score, target/evidence metadata và evaluator internals không được gửi ra learner surface.</p>
              <button type="button" onClick={loadQueue} className="mt-8 flex items-center gap-2 rounded-full bg-[#173d2e] px-5 py-3 text-sm font-bold text-white">Tạo session thích ứng <ArrowRight className="size-4" /></button>
              <p className="mt-4 text-xs leading-5 text-black/40">Route này cần đăng nhập vì adaptive planning phụ thuộc vào learner state đã persist.</p>
            </div>
          </section>
        )}

        {phase === "planning" && (
          <section className="my-auto flex flex-col items-center py-20 text-center">
            <Loader2 className="size-8 animate-spin text-[#2d6a4f]" />
            <p className="mt-4 font-semibold">Đang dựng session từ learner state…</p>
          </section>
        )}

        {phase === "auth-required" && (
          <section className="my-auto py-16">
            <div className="rounded-[32px] border border-black/10 bg-white p-7 sm:p-9">
              <LogIn className="size-7 text-[#2d6a4f]" />
              <h2 className="mt-5 text-2xl font-semibold">Cần đăng nhập để dùng adaptive planner.</h2>
              <p className="mt-3 max-w-xl leading-7 text-black/60">{error}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/login?mode=login&next=/adaptive-preview" className="rounded-full bg-[#173d2e] px-5 py-3 text-sm font-bold text-white">Đăng nhập</Link>
                <Link href="/data-preview" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Xem fixed public preview</Link>
              </div>
            </div>
          </section>
        )}

        {phase === "error" && (
          <section className="my-auto py-16">
            <div className="rounded-[32px] border border-[#b42318]/20 bg-white p-7 sm:p-9">
              <CircleAlert className="size-7 text-[#b42318]" />
              <h2 className="mt-5 text-2xl font-semibold">Chưa tạo được adaptive session.</h2>
              <p className="mt-3 leading-7 text-black/60">{error}</p>
              <button type="button" onClick={loadQueue} className="mt-7 flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold"><RefreshCw className="size-4" /> Thử lại</button>
            </div>
          </section>
        )}

        {phase === "empty" && (
          <section className="my-auto py-16">
            <div className="rounded-[32px] border border-black/10 bg-white p-7 sm:p-9">
              <CircleAlert className="size-7 text-[#8a5b00]" />
              <h2 className="mt-5 text-2xl font-semibold">Hiện chưa có practice đủ điều kiện.</h2>
              <p className="mt-3 leading-7 text-black/60">Planner không tự bỏ prerequisite hoặc bịa mastery để lấp queue. Refresh để đọc lại learner state mới nhất.</p>
              <button type="button" onClick={loadQueue} className="mt-7 flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-semibold"><RefreshCw className="size-4" /> Lập plan lại</button>
            </div>
          </section>
        )}

        {phase === "active" && practice && (
          <section className="flex flex-1 flex-col justify-center py-10">
            <div className="mb-7">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-black/40">
                <span>{practice.kind} · {practice.modality}</span>
                <span>{index + 1}/{practices.length}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.07]"><div className="h-full rounded-full bg-[#2d6a4f]" style={{ width: `${progress}%` }} /></div>
            </div>

            <h2 className="text-3xl font-semibold leading-tight sm:text-5xl">{practice.title}</h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-black/60">{practice.instruction}</p>

            <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,30,20,.07)] sm:p-8">
              {practice.prompt && (
                <div className="mb-6 rounded-2xl bg-[#f5f3ec] p-5">
                  <p className="text-xs font-bold uppercase tracking-[.16em] text-black/35">Prompt</p>
                  <p className="mt-2 text-xl font-medium leading-relaxed">{practice.prompt}</p>
                </div>
              )}

              {practice.modality === "choice" ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {practice.choices.map((choice) => (
                    <button key={choice} type="button" disabled={saving || submitted} onClick={() => selectChoice(choice)} className={`rounded-2xl border px-4 py-4 text-left font-semibold transition disabled:opacity-50 ${answer === choice ? "border-[#2d6a4f] bg-[#edf5ef]" : "border-black/10 hover:bg-black/[0.02]"}`}>{choice}</button>
                  ))}
                </div>
              ) : practice.modality === "speech" ? (
                <>
                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={startSpeech} disabled={listening || saving || submitted} className="flex items-center gap-2 rounded-full bg-[#171713] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"><Mic2 className="size-4" /> {listening ? (speechTransport === "conversation" ? "Roleplay đang chạy…" : "Đang nghe…") : voiceMode === "conversation" ? "Bắt đầu roleplay" : "Nói bằng mic"}</button>
                    {!speechAvailable && <span className="text-xs text-[#8a5b00]">Browser không hỗ trợ speech capture.</span>}
                    {voiceMode === "conversation" && <span className="text-xs text-[#24583f]">Produce dùng guarded one-turn conversation.</span>}
                  </div>
                  <textarea value={answer} disabled={listening || saving || submitted} onChange={(event) => { setAnswer(event.target.value); setAnswerSource("text"); setSpeechTransport(null); setFeedback(null); setEvaluationSuccess(null); setSaveState("idle"); }} placeholder="Transcript hoặc text fallback…" className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f5] p-4 outline-none focus:border-[#2d6a4f]/60 disabled:opacity-50" />
                  <p className="mt-2 text-xs leading-5 text-black/40">{answerSource === "speech" && speechTransport === "conversation" ? "Transcript từ guarded roleplay chỉ là language signal; AI partner không chấm điểm, transcript không phải pronunciation score." : answerSource === "speech" && speechTransport === "capture" ? "Transcript từ Realtime capture được dùng tạm thời để đánh giá language coverage; không phải điểm phát âm và không persist raw transcript." : answerSource === "speech" ? "Transcript từ browser speech recognition; không phải điểm phát âm." : "Gõ text chỉ là fallback để kiểm language coverage; không được tính speaking evidence."}</p>
                </>
              ) : (
                <textarea value={answer} disabled={saving || submitted} onChange={(event) => { setAnswer(event.target.value); setAnswerSource("text"); }} className="min-h-24 w-full rounded-2xl border border-black/10 p-4" />
              )}

              {practice.supportVi && (
                <div className="mt-5 border-t border-black/[0.07] pt-5">
                  <button type="button" disabled={listening || saving || submitted} onClick={() => setSupportUsed((value) => !value)} className="text-sm font-semibold text-black/45 disabled:opacity-40">{supportUsed ? "Ẩn hỗ trợ tiếng Việt" : "Xem hỗ trợ tiếng Việt"}</button>
                  {supportUsed && <p className="mt-2 text-sm leading-6 text-black/55">{practice.supportVi}</p>}
                </div>
              )}

              {!submitted && saveState !== "not-saved" && (
                <button type="button" onClick={submit} disabled={listening || answer.trim().length === 0 || saving} className="mt-6 flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-3 text-sm font-bold text-white disabled:opacity-30">{saving && <Loader2 className="size-4 animate-spin" />} Kiểm tra & lưu attempt</button>
              )}

              {feedback && (
                <div className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${evaluationSuccess ? "bg-[#edf5ef] text-[#24583f]" : "bg-[#fff7e6] text-[#6f4d00]"}`}>
                  {feedback}
                </div>
              )}
              {persistedLabel && <p className="mt-3 text-xs leading-5 text-black/40">{persistedLabel}</p>}

              {saveState === "not-saved" && (
                <Link href="/login?mode=login&next=/adaptive-preview" className="mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"><LogIn className="size-4" /> Đăng nhập lại</Link>
              )}
            </div>

            <div className="mt-7 flex justify-end">
              {submitted && <button type="button" onClick={next} className="flex items-center gap-2 rounded-full bg-[#173d2e] px-6 py-3 text-sm font-bold text-white">{index === practices.length - 1 ? "Kết thúc session" : "Practice tiếp theo"}<ArrowRight className="size-4" /></button>}
            </div>
          </section>
        )}

        {phase === "complete" && (
          <section className="my-auto py-16">
            <div className="rounded-[32px] bg-[#173d2e] p-7 text-white sm:p-10">
              <Sparkles className="size-7" />
              <h2 className="mt-5 text-3xl font-semibold">Session đã xong.</h2>
              <p className="mt-3 max-w-xl leading-7 text-white/70">Không mở khóa capability ở client. Tạo session mới để planner đọc lại learner state và các error/remediation signals vừa persist, rồi chọn practice tiếp theo từ dữ liệu thật.</p>
              <button type="button" onClick={loadQueue} className="mt-7 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173d2e]"><RefreshCw className="size-4" /> Lập session tiếp theo</button>
            </div>
          </section>
        )}

        <footer className="mt-auto pt-6 text-center text-[11px] leading-5 text-black/35">
          <Headphones className="mr-1 inline size-3" /> Planner chọn task; produce có guarded roleplay; server đánh giá; DB quyết định evidence. Transcript chỉ là language signal; text fallback ≠ speaking evidence.
        </footer>
      </div>
    </main>
  );
}

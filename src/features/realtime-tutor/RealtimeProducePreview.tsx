"use client";

import Link from "next/link";
import { CircleAlert, Loader2, Mic2, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { recordNếpPracticeAttempt } from "@/app/actions/learning-evidence";
import {
  connectRealtimeVoice,
  type RealtimeVoiceConnection,
} from "@/lib/realtime/webrtc-client";

export type RealtimeProducePreviewTask = {
  lessonId: string;
  lessonVersion: number;
  actionId: string;
  title: string;
  instruction: string;
  prompt: string;
};

type VoicePhase =
  | "idle"
  | "connecting"
  | "partner"
  | "learner"
  | "responding"
  | "ready"
  | "error";

type SaveState = "idle" | "saving" | "evidence" | "attempt" | "not-saved" | "error";

function phaseLabel(phase: VoicePhase) {
  if (phase === "connecting") return "Đang mở realtime roleplay…";
  if (phase === "partner") return "Nghe Maya nói…";
  if (phase === "learner") return "Đến lượt nói của bạn.";
  if (phase === "responding") return "Maya đang phản hồi…";
  if (phase === "ready") return "Roleplay đã khép lại. Có thể kiểm tra attempt.";
  if (phase === "error") return "Realtime roleplay gặp lỗi.";
  return "Bắt đầu một lượt hội thoại ngắn.";
}

function saveLabel(state: SaveState) {
  if (state === "saving") return "Đang lưu attempt…";
  if (state === "evidence") return "Attempt + mastery evidence đã được ghi.";
  if (state === "attempt") return "Attempt đã được ghi; lần này không tạo mastery evidence.";
  if (state === "not-saved") return "Phiên đăng nhập không còn hợp lệ; kết quả chưa được lưu.";
  if (state === "error") return "Attempt chưa lưu được.";
  return null;
}

export function RealtimeProducePreview({ task }: { task: RealtimeProducePreviewTask }) {
  const [voicePhase, setVoicePhase] = useState<VoicePhase>("idle");
  const [partnerTranscript, setPartnerTranscript] = useState("");
  const [answer, setAnswer] = useState("");
  const [answerSource, setAnswerSource] = useState<"speech" | "text" | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [evaluationSuccess, setEvaluationSuccess] = useState<boolean | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");

  const connectionRef = useRef<RealtimeVoiceConnection | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const attemptStartedAtRef = useRef<number | null>(null);
  const learnerTranscriptSeenRef = useRef(false);
  const postLearnerAssistantSeenRef = useRef(false);

  const busy = ["connecting", "partner", "learner", "responding"].includes(voicePhase);
  const saving = saveState === "saving";
  const persistedLabel = saveLabel(saveState);

  const closeRealtime = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    connectionRef.current?.close();
    connectionRef.current = null;
  };

  useEffect(() => closeRealtime, []);

  const reset = () => {
    closeRealtime();
    learnerTranscriptSeenRef.current = false;
    postLearnerAssistantSeenRef.current = false;
    attemptStartedAtRef.current = null;
    setVoicePhase("idle");
    setPartnerTranscript("");
    setAnswer("");
    setAnswerSource(null);
    setFeedback(null);
    setEvaluationSuccess(null);
    setSaveState("idle");
  };

  const start = async () => {
    if (busy || saving) return;

    reset();
    attemptStartedAtRef.current = Date.now();
    setVoicePhase("connecting");

    if (
      typeof window === "undefined" ||
      typeof RTCPeerConnection === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setVoicePhase("error");
      setFeedback("Browser này chưa hỗ trợ WebRTC microphone cần cho realtime tutor.");
      return;
    }

    try {
      if (!audioElementRef.current) {
        audioElementRef.current = document.createElement("audio");
      }

      const connection = await connectRealtimeVoice({
        audioElement: audioElementRef.current,
        mode: "conversation",
        taskIdentity: {
          lessonId: task.lessonId,
          lessonVersion: task.lessonVersion,
          actionId: task.actionId,
        },
        onSignal: (signal) => {
          if (signal.kind === "assistant-transcript") {
            if (learnerTranscriptSeenRef.current) {
              postLearnerAssistantSeenRef.current = true;
              setVoicePhase("responding");
            } else {
              setVoicePhase("partner");
            }
            if (signal.transcript.trim()) setPartnerTranscript(signal.transcript.trim());
            return;
          }

          if (signal.kind === "learner-transcript") {
            const transcript = signal.transcript.trim();
            if (!transcript) {
              setFeedback("Realtime chưa nghe rõ câu vừa nói. Nói lại khi Maya dừng.");
              return;
            }

            learnerTranscriptSeenRef.current = true;
            setAnswer(transcript);
            setAnswerSource("speech");
            setVoicePhase("responding");
            setFeedback(null);
            setEvaluationSuccess(null);
            setSaveState("idle");
            return;
          }

          if (signal.kind === "response-done") {
            if (!learnerTranscriptSeenRef.current) {
              setVoicePhase("learner");
              return;
            }

            if (postLearnerAssistantSeenRef.current) {
              closeRealtime();
              setVoicePhase("ready");
            }
            return;
          }

          if (signal.kind === "provider-error") {
            closeRealtime();
            setVoicePhase("error");
            setFeedback(signal.message || "Realtime provider gặp lỗi.");
          }
        },
        onStateChange: (state) => {
          if (state === "connected") setVoicePhase("partner");
          if (state === "failed") {
            setVoicePhase("error");
            setFeedback("Kết nối realtime voice bị lỗi.");
          }
        },
      });

      connectionRef.current = connection;
      timeoutRef.current = setTimeout(() => {
        closeRealtime();
        setVoicePhase("error");
        setFeedback("Roleplay đã vượt quá 45 giây và được đóng tự động. Thử lại một lượt ngắn hơn.");
      }, 45_000);
    } catch (error) {
      closeRealtime();
      setVoicePhase("error");
      setFeedback(error instanceof Error ? error.message : "Không mở được realtime tutor.");
    }
  };

  const submit = async () => {
    if (saving || busy || answer.trim().length === 0) return;

    const now = Date.now();
    const latencyMs = attemptStartedAtRef.current === null ? 0 : now - attemptStartedAtRef.current;
    setSaveState("saving");
    setFeedback(null);

    const result = await recordNếpPracticeAttempt({
      lessonId: task.lessonId,
      lessonVersion: task.lessonVersion,
      actionId: task.actionId,
      response: answer,
      responseSource: answerSource,
      supportUsed: false,
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
  };

  return (
    <main className="min-h-screen bg-[#f6f4ed] text-[#171713]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2d6a4f]">
              Nếp · realtime tutor produce V1
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              Một roleplay thật, một learner turn, một evidence decision.
            </h1>
          </div>
          <ShieldCheck className="hidden size-8 text-[#2d6a4f] sm:block" />
        </header>

        <section className="flex flex-1 flex-col justify-center py-10">
          <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,30,20,.07)] sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#24583f]">
              <Sparkles className="size-4" /> Canonical produce task
            </div>
            <h2 className="mt-5 text-3xl font-semibold">{task.title}</h2>
            <p className="mt-3 leading-7 text-black/60">{task.instruction}</p>

            <div className="mt-6 rounded-2xl bg-[#f5f3ec] p-5">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-black/35">Partner cue</p>
              <p className="mt-2 text-xl font-medium">{task.prompt}</p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={start}
                disabled={busy || saving}
                className="flex items-center gap-2 rounded-full bg-[#171713] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
              >
                {voicePhase === "connecting" ? <Loader2 className="size-4 animate-spin" /> : <Mic2 className="size-4" />}
                {busy ? "Roleplay đang chạy" : "Bắt đầu roleplay"}
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={saving}
                className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-3 text-sm font-semibold disabled:opacity-40"
              >
                <RotateCcw className="size-4" /> Reset
              </button>
            </div>

            <p className="mt-3 text-sm font-medium text-black/55">{phaseLabel(voicePhase)}</p>

            {partnerTranscript && (
              <div className="mt-5 rounded-2xl border border-black/[0.07] p-4">
                <p className="text-xs font-bold uppercase tracking-[.16em] text-black/35">Maya · transient</p>
                <p className="mt-2 leading-7">{partnerTranscript}</p>
              </div>
            )}

            <label className="mt-5 block text-xs font-bold uppercase tracking-[.16em] text-black/35">
              Learner transcript
            </label>
            <textarea
              value={answer}
              disabled={saving || busy}
              onChange={(event) => {
                setAnswer(event.target.value);
                setAnswerSource("text");
                setFeedback(null);
                setEvaluationSuccess(null);
                setSaveState("idle");
              }}
              placeholder="Realtime transcript sẽ xuất hiện ở đây…"
              className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f5] p-4 outline-none focus:border-[#2d6a4f]/60 disabled:opacity-50"
            />
            <p className="mt-2 text-xs leading-5 text-black/40">
              {answerSource === "speech"
                ? "Transcript là language signal, không phải pronunciation score. Assistant transcript không được persist."
                : "Nếu sửa/gõ text, response source đổi thành text và không được tính speaking evidence."}
            </p>

            <button
              type="button"
              onClick={submit}
              disabled={busy || saving || answer.trim().length === 0}
              className="mt-6 flex items-center gap-2 rounded-full bg-[#2d6a4f] px-5 py-3 text-sm font-bold text-white disabled:opacity-30"
            >
              {saving && <Loader2 className="size-4 animate-spin" />}
              Kiểm tra bằng canonical evaluator
            </button>

            {feedback && (
              <div
                className={`mt-5 rounded-2xl p-4 text-sm leading-6 ${
                  evaluationSuccess ? "bg-[#edf5ef] text-[#24583f]" : "bg-[#fff7e6] text-[#6f4d00]"
                }`}
              >
                {feedback}
              </div>
            )}
            {persistedLabel && <p className="mt-3 text-xs leading-5 text-black/40">{persistedLabel}</p>}

            {saveState === "not-saved" && (
              <Link
                href="/login?mode=login&next=/realtime-tutor-preview"
                className="mt-5 inline-flex rounded-full border border-black/10 px-4 py-2 text-sm font-semibold"
              >
                Đăng nhập lại
              </Link>
            )}

            {voicePhase === "error" && !feedback && (
              <div className="mt-5 flex items-center gap-2 text-sm text-[#8a5b00]">
                <CircleAlert className="size-4" /> Realtime tutor chưa hoàn tất lượt này.
              </div>
            )}
          </div>
        </section>

        <footer className="mt-auto pt-6 text-center text-[11px] leading-5 text-black/35">
          AI chỉ đóng vai partner. Nếp server quyết định task và evidence; DB quyết định learner state.
        </footer>
      </div>
    </main>
  );
}

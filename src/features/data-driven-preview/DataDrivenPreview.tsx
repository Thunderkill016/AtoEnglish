"use client";

import { ArrowLeft, ArrowRight, CircleAlert, Headphones, Mic2, RefreshCw, ShieldCheck, Sparkles, Target, Volume2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { recordLearningAttempt } from "@/app/actions/learning-evidence";
import { capabilityGraphV1 } from "@/lib/nep/capabilities.v1";
import { evaluateNếpAction, feedbackForNếpEvaluation, type NếpEvaluationResult } from "@/lib/nep/evaluator";
import { firstMeetingLessonV1, qaLesson } from "@/lib/nep/lesson-contract";
import { toLearningAttemptRecord } from "@/lib/nep/learning-evidence-adapter";

type EvidenceKey = "comprehension" | "retrieval" | "production" | "repair" | "transfer";
type EvidenceState = Record<EvidenceKey, boolean>;
type PersistenceState = "idle" | "saving" | "evidence-saved" | "attempt-saved" | "local-only" | "error";
type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

const initialEvidence: EvidenceState = { comprehension: false, retrieval: false, production: false, repair: false, transfer: false };

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.88;
  window.speechSynthesis.speak(utterance);
}

function recognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const browserWindow = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

function evidenceKeyForAction(kind: string): EvidenceKey | null {
  if (kind === "comprehend") return "comprehension";
  if (kind === "retrieve") return "retrieval";
  if (kind === "produce") return "production";
  if (kind === "repair") return "repair";
  if (kind === "transfer") return "transfer";
  return null;
}

function persistenceLabel(state: PersistenceState) {
  if (state === "saving") return "Đang lưu learning event…";
  if (state === "evidence-saved") return "Attempt + evidence đã được lưu vào learner model.";
  if (state === "attempt-saved") return "Attempt đã được lưu; lần này không tạo mastery evidence.";
  if (state === "local-only") return "Preview công khai: kết quả đang chỉ giữ trong phiên này.";
  if (state === "error") return "Flow vẫn tiếp tục, nhưng learning event chưa lưu được.";
  return null;
}

export function DataDrivenPreview() {
  const lesson = firstMeetingLessonV1;
  const capability = capabilityGraphV1.find((item) => item.id === lesson.capabilityId)!;
  const qaErrors = useMemo(() => qaLesson(lesson).filter((issue) => issue.severity === "error"), [lesson]);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answerSource, setAnswerSource] = useState<"speech" | "text" | null>(null);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [supportUsed, setSupportUsed] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceState>(initialEvidence);
  const [persistenceState, setPersistenceState] = useState<PersistenceState>("idle");
  const attemptStartedAt = useRef<number | null>(null);
  const lastSubmissionKey = useRef<string | null>(null);

  const action = lesson.actions[step];
  const progress = Math.round(((step + 1) / lesson.actions.length) * 100);
  const speechAvailable = typeof window !== "undefined" && recognitionCtor() !== null;
  const persistedLabel = persistenceLabel(persistenceState);
  const saving = persistenceState === "saving";

  const markResponseChanged = () => {
    if (lastSubmissionKey.current !== null) attemptStartedAt.current = Date.now();
    lastSubmissionKey.current = null;
    setPersistenceState("idle");
  };

  const resetAttempt = () => {
    setAnswer("");
    setAnswerSource(null);
    setFeedback(null);
    setSupportUsed(false);
    setPersistenceState("idle");
    lastSubmissionKey.current = null;
    attemptStartedAt.current = Date.now();
  };

  const toggleSupport = () => {
    if (saving) return;
    if (lastSubmissionKey.current !== null) attemptStartedAt.current = Date.now();
    lastSubmissionKey.current = null;
    setPersistenceState("idle");
    setSupportUsed((value) => !value);
  };

  const startSpeech = () => {
    const Recognition = recognitionCtor();
    if (!Recognition) {
      setFeedback("Browser này không có speech recognition. Text fallback chỉ demo flow và không được tính speaking evidence.");
      return;
    }
    if (lastSubmissionKey.current !== null) attemptStartedAt.current = Date.now();
    lastSubmissionKey.current = null;
    setPersistenceState("idle");

    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event) => {
      setAnswer(event.results[0]?.[0]?.transcript ?? "");
      setAnswerSource("speech");
      setListening(false);
      setFeedback(null);
      markResponseChanged();
    };
    recognition.onerror = () => { setListening(false); setFeedback("Không lấy được transcript. Thử lại hoặc dùng text fallback; fallback không tạo speaking evidence."); };
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };

  const persistEvaluation = async (evaluation: NếpEvaluationResult) => {
    const submissionKey = `${action.id}|${answerSource ?? "none"}|support:${supportUsed ? 1 : 0}|${answer.trim()}`;
    if (lastSubmissionKey.current === submissionKey) return;

    const now = Date.now();
    const latencyMs = attemptStartedAt.current === null ? 0 : now - attemptStartedAt.current;
    const record = toLearningAttemptRecord({
      lesson,
      action,
      response: answer,
      responseSource: answerSource,
      evaluation,
      supportUsed,
      latencyMs,
    });
    if (!record) return;

    lastSubmissionKey.current = submissionKey;
    setPersistenceState("saving");
    const result = await recordLearningAttempt(record);
    if (result.success) {
      setPersistenceState(result.evidenceRecorded ? "evidence-saved" : "attempt-saved");
      return;
    }
    const error = "error" in result ? result.error ?? "" : "";
    if (error.includes("đăng nhập")) {
      setPersistenceState("local-only");
      return;
    }
    lastSubmissionKey.current = null;
    setPersistenceState("error");
  };

  const evaluate = async () => {
    if (saving) return;

    const evaluation = evaluateNếpAction(action, answer);
    const ok = evaluation.success;
    if (action.kind === "comprehend") {
      setEvidence((current) => ({ ...current, comprehension: ok }));
      setFeedback(ok ? "Đúng: Maya đang hỏi tên." : feedbackForNếpEvaluation(action, evaluation));
      await persistEvaluation(evaluation);
      return;
    }

    const channel = evidenceKeyForAction(action.kind);
    const observedSpeech = answerSource === "speech";
    const canShowEvidence = channel && observedSpeech && ok && (channel !== "transfer" || evidence.production);

    if (canShowEvidence && channel) {
      setEvidence((current) => ({ ...current, [channel]: true }));
    }

    if (channel && answerSource !== "speech") {
      setFeedback(
        ok
          ? "Text có đủ target language, nhưng không cộng speaking evidence vì không có oral response quan sát được."
          : `${feedbackForNếpEvaluation(action, evaluation)} Text fallback không tạo speaking evidence.`,
      );
      await persistEvaluation(evaluation);
      return;
    }

    if (channel === "transfer" && ok && !evidence.production) {
      setFeedback("Transcript đáp ứng task, nhưng chưa có production evidence độc lập trước đó nên chưa thể gọi đây là transfer.");
      await persistEvaluation(evaluation);
      return;
    }

    setFeedback(feedbackForNếpEvaluation(action, evaluation));
    await persistEvaluation(evaluation);
  };

  const next = () => {
    if (step < lesson.actions.length - 1) { setStep((value) => value + 1); resetAttempt(); return; }
    setActive(false);
  };

  if (!active) {
    return (
      <main className="min-h-screen bg-[#f5f3ec] text-[#171713]">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-14">
          <div className="mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2d6a4f]">Nếp · vertical slice V1</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Học một việc. Làm được việc đó.</h1>
            </div>
            <div className="hidden rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black/55 sm:block">Preview · không phải efficacy claim</div>
          </div>

          <section className="grid gap-5 lg:grid-cols-[1.4fr_.8fr]">
            <div className="rounded-[32px] bg-[#173d2e] p-6 text-white shadow-[0_30px_100px_rgba(23,61,46,.16)] sm:p-9">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/70"><Target className="size-4" /> Capability hôm nay</div>
              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">{capability.title}</h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-white/70">{lesson.mission}</p>
              <div className="mt-7 flex flex-wrap gap-2">{lesson.newItems.map((item) => <span key={item} className="rounded-full bg-white/10 px-3 py-1.5 text-sm">{item}</span>)}</div>
              <button type="button" onClick={() => { setActive(true); setStep(0); setEvidence(initialEvidence); resetAttempt(); }} className="mt-8 flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#173d2e]">Bắt đầu mission <ArrowRight className="size-4" /></button>
            </div>

            <div className="rounded-[32px] border border-black/10 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck className="size-4 text-[#2d6a4f]" /> Lesson QA</div>
              <p className="mt-4 text-3xl font-semibold">{qaErrors.length === 0 ? "PASS" : "BLOCKED"}</p>
              <p className="mt-2 text-sm leading-6 text-black/55">Gate: retrieval-before-reveal, explicit evidence targets, real speech path, feedback/repair/retry, changed-context transfer, delayed review và evidence trace.</p>
              <p className="mt-5 border-t border-black/[0.07] pt-5 text-xs leading-5 text-black/40">{lesson.sourceDerived.principleIds.slice(0, 7).join(" · ")}</p>
            </div>
          </section>

          <section className="mt-6 rounded-[32px] border border-black/10 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold"><Sparkles className="size-4" /> Capability graph V1</div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {capabilityGraphV1.map((item) => (
                <div key={item.id} className={`rounded-2xl border p-4 ${item.id === lesson.capabilityId ? "border-[#2d6a4f] bg-[#edf5ef]" : "border-black/[0.08]"}`}>
                  <p className="text-xs font-bold text-black/35">{item.id}</p><p className="mt-2 font-semibold">{item.title}</p><p className="mt-2 text-xs leading-5 text-black/50">{item.learnerJob}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171713]">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-5 sm:px-6 sm:py-8">
        <header className="mb-8 flex items-center gap-4">
          <button type="button" onClick={() => setActive(false)} className="grid size-10 place-items-center rounded-full border border-black/10 bg-white" aria-label="Thoát"><ArrowLeft className="size-4" /></button>
          <div className="min-w-0 flex-1"><div className="mb-2 flex justify-between text-xs font-bold uppercase tracking-[0.18em] text-black/40"><span>{action.kind}</span><span>{progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-black/[0.07]"><div className="h-full rounded-full bg-[#2d6a4f]" style={{ width: `${progress}%` }} /></div></div>
        </header>

        <section className="flex flex-1 flex-col justify-center pb-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2d6a4f]">{String(step + 1).padStart(2, "0")} · {action.kind}</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">{action.title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-black/60">{action.instruction}</p>

          <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_24px_80px_rgba(20,30,20,.07)] sm:p-8">
            {action.model && <div className="mb-5"><button type="button" onClick={() => speak(action.model ?? "")} className="mb-4 flex items-center gap-2 rounded-full bg-[#edf5ef] px-4 py-2 text-sm font-semibold text-[#24583f]"><Volume2 className="size-4" /> Nghe</button><p className="text-2xl font-medium leading-relaxed">{action.model}</p></div>}
            {action.prompt && <div className="mb-5 rounded-2xl bg-[#f5f3ec] p-5"><p className="text-xs font-bold uppercase tracking-[.18em] text-black/35">Prompt</p><p className="mt-2 text-xl font-medium">{action.prompt}</p></div>}

            {action.kind === "comprehend" ? (
              <div className="grid gap-3 sm:grid-cols-3">{["name", "job", "country"].map((choice) => <button key={choice} type="button" disabled={saving} onClick={() => { setAnswer(choice); setAnswerSource("text"); setFeedback(null); markResponseChanged(); }} className={`rounded-2xl border px-4 py-4 text-left font-semibold disabled:opacity-40 ${answer === choice ? "border-[#2d6a4f] bg-[#edf5ef]" : "border-black/10"}`}>{choice}</button>)}</div>
            ) : action.modality === "speech" ? (
              <>
                <div className="flex flex-wrap gap-3"><button type="button" onClick={startSpeech} disabled={listening || saving} className="flex items-center gap-2 rounded-full bg-[#171713] px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"><Mic2 className="size-4" /> {listening ? "Đang nghe…" : "Nói bằng mic"}</button>{!speechAvailable && <span className="flex items-center gap-2 text-xs text-[#8a5b00]"><CircleAlert className="size-4" /> Browser không hỗ trợ speech recognition</span>}</div>
                <textarea value={answer} disabled={saving} onChange={(event) => { setAnswer(event.target.value); setAnswerSource("text"); setFeedback(null); markResponseChanged(); }} placeholder="Transcript hoặc text fallback…" className="mt-4 min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-[#faf9f5] p-4 outline-none focus:border-[#2d6a4f]/60 disabled:opacity-50" />
                <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={evaluate} disabled={!answer || answerSource !== "speech" || saving} className="rounded-full bg-[#2d6a4f] px-4 py-2 text-xs font-bold text-white disabled:opacity-30">Đánh giá speech transcript</button><button type="button" onClick={evaluate} disabled={!answer || saving} className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold text-black/55 disabled:opacity-30">Text fallback</button></div>
              </>
            ) : null}

            {action.kind === "comprehend" && <button type="button" onClick={evaluate} disabled={!answer || saving} className="mt-4 rounded-full bg-[#171713] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-30">Kiểm tra</button>}
            {action.supportVi && <div className="mt-5 border-t border-black/[0.07] pt-5"><button type="button" disabled={saving} onClick={toggleSupport} className="text-sm font-semibold text-black/45 disabled:opacity-40">{supportUsed ? "Ẩn hỗ trợ" : "Xem hỗ trợ tiếng Việt"}</button>{supportUsed && <p className="mt-2 text-sm leading-6 text-black/55">{action.supportVi}</p>}</div>}
            {feedback && <div className="mt-5 flex gap-3 rounded-2xl bg-[#fff7e6] p-4 text-sm leading-6"><CircleAlert className="mt-0.5 size-4 shrink-0 text-[#8a5b00]" /><p>{feedback}</p></div>}
            {persistedLabel && <p className="mt-3 text-xs leading-5 text-black/40">{persistedLabel}</p>}
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2">{(Object.keys(evidence) as EvidenceKey[]).map((key) => <div key={key} className={`rounded-xl border px-2 py-2 text-center text-[10px] font-bold uppercase tracking-wide ${evidence[key] ? "border-[#2d6a4f]/30 bg-[#edf5ef] text-[#24583f]" : "border-black/[0.07] text-black/25"}`}>{key}</div>)}</div>
          <div className="mt-8 flex items-center justify-between"><button type="button" onClick={() => { setStep((value) => Math.max(0, value - 1)); resetAttempt(); }} disabled={step === 0 || saving} className="rounded-full px-4 py-3 text-sm font-semibold text-black/45 disabled:opacity-20"><RefreshCw className="mr-2 inline size-3" />Quay lại</button><button type="button" onClick={next} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#2d6a4f] px-6 py-3 text-sm font-semibold text-white disabled:opacity-40">{step === lesson.actions.length - 1 ? "Kết thúc slice" : "Tiếp theo"}<ArrowRight className="size-4" /></button></div>
        </section>

        <footer className="pb-4 text-center text-[11px] leading-5 text-black/35"><Headphones className="mr-1 inline size-3" /> Transcript feedback ≠ pronunciation score. Raw transcript không được persist. Text fallback ≠ speaking evidence.{supportUsed && " Vietnamese support usage is tracked separately."}</footer>
      </div>
    </main>
  );
}

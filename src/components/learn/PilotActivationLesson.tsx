"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Mic,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";

import { completeUnit, getUnitCompletionStatus } from "@/app/actions/unit";
import {
  ACTIVATION_QUIZ,
  ACTIVATION_STEPS,
  CORE_WORK_LINES,
  DEFAULT_WORK_PROFILE,
  SURVIVAL_PHRASES,
  UNIT_A0_1_ACTIVATION_META,
  UNIT_A0_1_ID,
  WORK_QUESTIONS,
  buildWorkIntroduction,
  type WorkProfile,
} from "@/lib/pilot/unit-a0-1-activation";
import {
  trackPilotEventOnce,
  trackPilotEventPersistentlyOnce,
} from "@/lib/pilot/pilot-analytics-client";

interface PilotActivationLessonProps {
  nextRoute: string;
}

const PROFILE_FIELDS: Array<{
  key: keyof WorkProfile;
  label: string;
  hint: string;
  icon: typeof BriefcaseBusiness;
}> = [
  { key: "name", label: "Tên", hint: "Minh", icon: Sparkles },
  { key: "role", label: "Nghề nghiệp", hint: "a delivery driver", icon: BriefcaseBusiness },
  { key: "company", label: "Công ty", hint: "Ato Delivery", icon: Building2 },
  { key: "responsibility", label: "Trách nhiệm", hint: "delivering customer orders", icon: CheckCircle2 },
];

function speak(text: string, rate = 0.72): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  utterance.voice =
    voices.find((voice) => voice.name.includes("Microsoft Aria")) ??
    voices.find((voice) => voice.name.includes("Google US English")) ??
    voices.find((voice) => voice.lang === "en-US") ??
    voices.find((voice) => voice.lang.startsWith("en")) ??
    null;
  window.speechSynthesis.speak(utterance);
}

function AudioButton({ text, question = false }: { text: string; question?: boolean }) {
  const Icon = question ? CircleHelp : Volume2;
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label={`Nghe: ${text}`}
      className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-emerald-300"
    >
      <Icon className="size-4" />
    </button>
  );
}

function saveGuestCompletion(): void {
  try {
    const key = "guest_completed_units";
    const parsed = JSON.parse(window.localStorage.getItem(key) || "[]") as unknown;
    const units = Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
    window.localStorage.setItem(key, JSON.stringify([...new Set([...units, UNIT_A0_1_ID])]));
  } catch {
    // Best-effort guest progress.
  }
}

export default function PilotActivationLesson({ nextRoute }: PilotActivationLessonProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState<WorkProfile>(DEFAULT_WORK_PROFILE);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [hasSpokenTwice, setHasSpokenTwice] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  const currentStep = ACTIVATION_STEPS[stepIndex];
  const introduction = useMemo(() => buildWorkIntroduction(profile), [profile]);
  const correctCount = ACTIVATION_QUIZ.filter(
    (question) => quizAnswers[question.id] === question.answer,
  ).length;
  const allQuizAnswered = Object.keys(quizAnswers).length === ACTIVATION_QUIZ.length;
  const starCount: 1 | 2 | 3 =
    hasSpokenTwice && correctCount === ACTIVATION_QUIZ.length ? 3 : correctCount >= 3 ? 2 : 1;

  useEffect(() => {
    trackPilotEventOnce("unit_started", UNIT_A0_1_ID, {
      source: "activation_lesson",
      unitId: UNIT_A0_1_ID,
    });
    void getUnitCompletionStatus(UNIT_A0_1_ID).then((result) => {
      if (result.success && result.completed) setIsCompleted(true);
    });
    return () => window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    if (currentStep.id === "speak") {
      trackPilotEventOnce("first_speaking_started", UNIT_A0_1_ID, {
        source: "activation_lesson",
        unitId: UNIT_A0_1_ID,
      });
    }
  }, [currentStep.id]);

  const move = (delta: number) => {
    window.speechSynthesis?.cancel();
    setStepIndex((value) => Math.max(0, Math.min(value + delta, ACTIVATION_STEPS.length - 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const markSpeakingComplete = () => {
    setHasSpokenTwice(true);
    trackPilotEventPersistentlyOnce("first_speaking_completed", UNIT_A0_1_ID, {
      source: "activation_lesson",
      unitId: UNIT_A0_1_ID,
      passed: true,
    });
    toast.success("Đã hoàn thành phần nói 2 lần.");
  };

  const finishLesson = async () => {
    if (!allQuizAnswered || !hasSpokenTwice || isSubmitting) return;
    setIsSubmitting(true);
    const result = await completeUnit(UNIT_A0_1_ID, starCount);

    if (result.success) {
      setEarnedXp(result.xpEarned ?? 0);
      toast.success(
        result.alreadyCompleted
          ? "Bài này đã được hoàn thành trước đó."
          : `Hoàn thành bài kích hoạt! +${result.xpEarned ?? 0} XP`,
      );
    } else if (result.error?.includes("đăng nhập")) {
      saveGuestCompletion();
      setEarnedXp(60);
      toast.success("Hoàn thành ở chế độ khách — tiến độ đã lưu trên thiết bị này.");
    } else {
      toast.error(result.error || "Không thể hoàn thành bài học.");
      setIsSubmitting(false);
      return;
    }

    setIsCompleted(true);
    setShowSummary(true);
    confetti({ particleCount: 110, spread: 85, origin: { y: 0.62 } });
    trackPilotEventPersistentlyOnce("unit_completed", UNIT_A0_1_ID, {
      source: "activation_lesson",
      unitId: UNIT_A0_1_ID,
      score: Math.round((correctCount / ACTIVATION_QUIZ.length) * 100),
      starCount,
      passed: true,
    });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Link href="/dashboard" aria-label="Về dashboard" className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400">
                <ArrowLeft className="size-4" />
              </Link>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-400">
                  A0 · Bài kích hoạt · {UNIT_A0_1_ACTIVATION_META.estimatedTime} phút
                </p>
                <h1 className="truncate text-sm font-bold text-white sm:text-base">{UNIT_A0_1_ACTIVATION_META.title}</h1>
              </div>
            </div>
            <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
              {stepIndex + 1}/{ACTIVATION_STEPS.length}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all" style={{ width: `${((stepIndex + 1) / ACTIVATION_STEPS.length) * 100}%` }} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:py-10">
        <section className="mb-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400">{currentStep.label}</p>
              <p className="mt-1 text-sm text-zinc-300">Mục tiêu: tự giới thiệu tên, công việc, công ty và trách nhiệm trong 20–30 giây.</p>
            </div>
            <span className="shrink-0 rounded-lg bg-zinc-900 px-2 py-1 text-[11px] font-bold text-zinc-400">~{currentStep.minutes} phút</span>
          </div>
        </section>

        {stepIndex === 0 && (
          <section className="space-y-3">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-xl font-black">Nghe và nói theo 4 câu cốt lõi</h2>
              <p className="mt-2 text-sm text-zinc-400">Nghe từng câu rồi nói theo hai lần. Không cần nói nhanh.</p>
              <button type="button" onClick={() => speak(CORE_WORK_LINES.map((line) => line.en).join(" "), 0.68)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-black text-zinc-950">
                <Volume2 className="size-4" /> Nghe cả đoạn chậm
              </button>
            </div>
            {CORE_WORK_LINES.map((line, index) => (
              <article key={line.en} className="flex items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-black text-emerald-300">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white">{line.en}</p>
                  <p className="mt-1 text-sm text-zinc-400">{line.vn}</p>
                  <p className="mt-2 text-xs font-semibold text-amber-300">Mẫu: {line.focus}</p>
                </div>
                <AudioButton text={line.en} />
              </article>
            ))}
          </section>
        )}

        {stepIndex === 1 && (
          <section className="space-y-3">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-xl font-black">5 câu hỏi công việc cơ bản</h2>
              <p className="mt-2 text-sm text-zinc-400">Nghe câu hỏi, tự trả lời, rồi nghe câu mẫu.</p>
            </div>
            {WORK_QUESTIONS.map((item, index) => (
              <article key={item.question} className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <div className="flex items-start gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-xs font-black text-blue-300">Q{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-black">{item.question}</p>
                    <p className="mt-1 text-sm text-zinc-500">{item.meaning}</p>
                    <p className="mt-3 rounded-xl border border-emerald-500/15 bg-emerald-500/10 p-3 text-sm font-semibold text-zinc-200">{item.answer}</p>
                  </div>
                  <div className="flex flex-col gap-2"><AudioButton text={item.question} question /><AudioButton text={item.answer} /></div>
                </div>
              </article>
            ))}
          </section>
        )}

        {stepIndex === 2 && (
          <section className="space-y-3">
            <div className="rounded-3xl border border-amber-500/20 bg-amber-500/10 p-5">
              <h2 className="text-xl font-black">Ba câu cứu nguy khi chưa nghe kịp</h2>
              <p className="mt-2 text-sm text-zinc-300">Dùng ngay thay vì im lặng hoặc đoán bừa.</p>
            </div>
            {SURVIVAL_PHRASES.map((phrase) => (
              <article key={phrase.en} className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <AudioButton text={phrase.en} />
                <div><p className="font-black">{phrase.en}</p><p className="mt-1 text-sm text-zinc-400">{phrase.vn}</p></div>
              </article>
            ))}
            <p className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4 text-sm text-zinc-300"><strong className="text-emerald-300">Mẹo:</strong> nhấn vào <em>slowly</em> hoặc <em>again</em>, rồi chờ người đối diện nói lại.</p>
          </section>
        )}

        {stepIndex === 3 && (
          <section className="space-y-4">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5">
              <h2 className="text-xl font-black">Tạo đoạn giới thiệu của bạn</h2>
              <p className="mt-2 text-sm text-zinc-400">Nhập bằng tiếng Anh hoặc dùng ví dụ có sẵn.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROFILE_FIELDS.map(({ key, label, hint, icon: Icon }) => (
                <label key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                  <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-400"><Icon className="size-4 text-emerald-400" />{label}</span>
                  <input value={profile[key]} onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))} placeholder={hint} maxLength={80} className="mt-3 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-emerald-500" />
                </label>
              ))}
            </div>
            <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5">
              <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Bài nói của bạn</p>
              <p className="mt-3 text-lg font-bold leading-relaxed">{introduction}</p>
              <button type="button" onClick={() => speak(introduction, 0.68)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-black text-emerald-300"><Volume2 className="size-4" /> Nghe bài nói chậm</button>
            </div>
          </section>
        )}

        {stepIndex === 4 && (
          <section className="space-y-5">
            <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5">
              <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-zinc-950"><Mic className="size-6" /></span><div><h2 className="text-xl font-black">Nói thành tiếng hai lần</h2><p className="mt-2 text-sm text-zinc-300">Lần 1 nhìn bài. Lần 2 chỉ nhìn: name · role · company · responsibility.</p></div></div>
              <p className="mt-5 rounded-2xl border border-white/10 bg-zinc-950/40 p-4 font-bold leading-relaxed">{introduction}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => speak(introduction, 0.68)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-black"><Volume2 className="size-4" />Nghe lại mẫu</button>
                <button type="button" onClick={markSpeakingComplete} className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-black ${hasSpokenTwice ? "bg-emerald-500 text-zinc-950" : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"}`}>{hasSpokenTwice ? <Check className="size-4" /> : <Mic className="size-4" />}{hasSpokenTwice ? "Đã nói 2 lần" : "Tôi đã nói 2 lần"}</button>
              </div>
            </div>

            <div><h3 className="text-lg font-black">Kiểm tra nhanh 4 câu</h3><p className="mt-1 text-sm text-zinc-400">Chọn đủ bốn câu rồi hoàn thành bài.</p></div>
            {ACTIVATION_QUIZ.map((question, index) => (
              <fieldset key={question.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/45 p-4">
                <legend className="px-1 text-sm font-black">{index + 1}. {question.prompt}</legend>
                <div className="mt-3 space-y-2">
                  {question.options.map((option) => {
                    const selected = quizAnswers[question.id] === option;
                    return <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${selected ? "border-emerald-500/50 bg-emerald-500/10 text-white" : "border-zinc-800 bg-zinc-950/35 text-zinc-300"}`}><input type="radio" name={question.id} checked={selected} onChange={() => setQuizAnswers((current) => ({ ...current, [question.id]: option }))} className="sr-only" /><span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-emerald-400 bg-emerald-500" : "border-zinc-600"}`}>{selected && <Check className="size-3 text-zinc-950" />}</span>{option}</label>;
                  })}
                </div>
              </fieldset>
            ))}
            <button type="button" onClick={() => void finishLesson()} disabled={!allQuizAnswered || !hasSpokenTwice || isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-4 text-base font-black text-zinc-950 disabled:cursor-not-allowed disabled:opacity-40">{isSubmitting ? "Đang lưu tiến độ..." : isCompleted ? "Hoàn thành lại bài" : "Hoàn thành bài kích hoạt"}<CheckCircle2 className="size-5" /></button>
          </section>
        )}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-800 bg-zinc-950/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl gap-3">
          <button type="button" onClick={() => move(-1)} disabled={stepIndex === 0} className="inline-flex h-12 items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 text-sm font-black text-zinc-300 disabled:opacity-30"><ChevronLeft className="size-4" />Trước</button>
          {stepIndex < ACTIVATION_STEPS.length - 1 ? <button type="button" onClick={() => move(1)} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-black text-zinc-950">Tiếp tục<ChevronRight className="size-4" /></button> : <button type="button" onClick={() => { setQuizAnswers({}); setHasSpokenTwice(false); }} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-5 text-sm font-black text-zinc-300"><RotateCcw className="size-4" />Làm lại phần cuối</button>}
        </div>
      </nav>

      {showSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/20 bg-zinc-900 p-6 text-center shadow-2xl">
            <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-emerald-500 text-3xl">🎤</span>
            <p className="mt-5 text-xs font-black uppercase tracking-widest text-emerald-400">Bài đầu tiên đã hoàn thành</p>
            <h2 className="mt-2 text-2xl font-black">Bạn đã nói được một đoạn giới thiệu công việc.</h2>
            <p className="mt-3 text-sm text-zinc-400">Điểm: {correctCount}/{ACTIVATION_QUIZ.length} · {starCount} sao · +{earnedXp} XP</p>
            <div className="mt-6 grid gap-3"><Link href={nextRoute} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 py-4 font-black text-zinc-950">Sang bài tiếp theo<ChevronRight className="size-5" /></Link><button type="button" onClick={() => setShowSummary(false)} className="rounded-2xl border border-zinc-700 bg-zinc-800 px-5 py-3 text-sm font-bold">Xem lại bài nói</button></div>
          </div>
        </div>
      )}
    </main>
  );
}

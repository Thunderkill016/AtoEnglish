"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Coffee,
  RotateCcw,
  Volume2,
} from "lucide-react";

import { MinimalButton } from "@/components/design-system";
import MissionRunner from "@/components/learn/MissionRunner";
import type { LessonSpecV1 } from "@/lib/lessons/lesson-spec";
import {
  formatLearningSessionDuration,
  resolveLearningSessionBudget,
  type LearningSessionMode,
} from "@/lib/lessons/session-budget";
import {
  evaluateMissionTranscript,
  type MissionEvaluationResult,
} from "@/lib/missions/mission-evaluator";
import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

type MissionLesson = LessonSpecV1 & { mission: MissionSpecV1 };

interface MissionSessionGateProps {
  lesson: MissionLesson;
  nextRoute: string;
}

const HABIT_CUE_STORAGE_KEY = "atoenglish:habit-cue";
const HABIT_CUE_CHANGE_EVENT = "atoenglish:habit-cue-change";

const HABIT_CUES = [
  { id: "after-breakfast", label: "Sau bữa sáng" },
  { id: "lunch-break", label: "Giờ nghỉ trưa" },
  { id: "evening", label: "Buổi tối" },
] as const;

function subscribeToHabitCue(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleChange = () => onStoreChange();
  window.addEventListener("storage", handleChange);
  window.addEventListener(HABIT_CUE_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(HABIT_CUE_CHANGE_EVENT, handleChange);
  };
}

function getHabitCueSnapshot() {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(HABIT_CUE_STORAGE_KEY);
  } catch {
    return null;
  }
}

const getServerHabitCueSnapshot = () => null;

function speakText(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace("...", "Minh"));
  utterance.lang = "en-US";
  utterance.rate = 0.92;
  window.speechSynthesis.speak(utterance);
}

export default function MissionSessionGate({
  lesson,
  nextRoute,
}: MissionSessionGateProps) {
  const router = useRouter();
  const mission = lesson.mission;
  const [mode, setMode] = useState<LearningSessionMode | null>(null);
  const habitCue = useSyncExternalStore(
    subscribeToHabitCue,
    getHabitCueSnapshot,
    getServerHabitCueSnapshot,
  );
  const [quickText, setQuickText] = useState("");
  const [quickError, setQuickError] = useState<string | null>(null);
  const [quickEvaluation, setQuickEvaluation] =
    useState<MissionEvaluationResult | null>(null);

  const standardBudget = resolveLearningSessionBudget(mission, "standard");
  const busyBudget = resolveLearningSessionBudget(mission, "busy");
  const busyChunks = mission.targetChunks.slice(0, busyBudget.targetChunkCount);
  const busyIntentIds = useMemo(
    () =>
      mission.intents
        .filter((intent) => intent.required)
        .slice(0, 2)
        .map((intent) => intent.id),
    [mission.intents],
  );
  const busyIntents = mission.intents.filter((intent) =>
    busyIntentIds.includes(intent.id),
  );
  const completedBusyIntentIds = quickEvaluation
    ? busyIntentIds.filter((intentId) =>
        quickEvaluation.completedIntentIds.includes(intentId),
      )
    : [];
  const busyReviewPassed =
    busyIntentIds.length > 0 &&
    completedBusyIntentIds.length === busyIntentIds.length;

  const selectHabitCue = (cueId: string) => {
    try {
      window.localStorage.setItem(HABIT_CUE_STORAGE_KEY, cueId);
      window.dispatchEvent(new Event(HABIT_CUE_CHANGE_EVENT));
    } catch {
      // The preference is optional; learning must continue without storage.
    }
  };

  const submitBusyReview = () => {
    const answer = quickText.trim();
    if (!answer) {
      setQuickError("Hãy tự viết ít nhất một câu trước khi kiểm tra.");
      return;
    }

    setQuickError(null);
    setQuickEvaluation(evaluateMissionTranscript(mission, [answer]));
  };

  if (mode === "standard") {
    return (
      <div className="bg-background">
        <div className="border-b border-primary/20 bg-primary/5">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <Clock3 className="size-4 text-primary" aria-hidden />
              Phiên chuẩn · {formatLearningSessionDuration(standardBudget)} · 1 nhiệm vụ ·{" "}
              {standardBudget.targetChunkCount} cụm · tối đa {standardBudget.feedbackCount} góp ý
            </p>
            <button
              type="button"
              onClick={() => setMode(null)}
              className="min-h-9 rounded-lg px-3 font-semibold text-primary hover:bg-primary/10"
            >
              Đổi nhịp học
            </button>
          </div>
        </div>
        <MissionRunner lesson={lesson} nextRoute={nextRoute} />
      </div>
    );
  }

  if (mode === "busy") {
    return (
      <main className="min-h-screen bg-background pb-20">
        <header className="border-b border-border/60 bg-background/95">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setMode(null)}
              className="min-h-11 rounded-lg px-3 text-sm font-semibold text-muted-foreground hover:bg-muted"
            >
              Quay lại
            </button>
            <p className="flex items-center gap-2 text-xs font-bold text-primary">
              <Coffee className="size-4" aria-hidden />
              Ngày bận · {formatLearningSessionDuration(busyBudget)}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
          <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
            <p className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-200">
              Giữ nhịp, không học dồn
            </p>
            <h1 className="mt-2 text-2xl font-black">Ôn nhanh {mission.titleVi}</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Phiên này chỉ ôn {busyBudget.targetChunkCount} cụm cốt lõi và một lượt tự nhớ.
              Nó không đánh dấu hoàn thành bài, không mở checkpoint và không đưa thêm can-do mới.
            </p>
          </section>

          <section className="space-y-3">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                Cụm cốt lõi
              </p>
              <h2 className="mt-1 text-xl font-black">
                Nghe một lần, sau đó tự nhớ
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {busyChunks.map((chunk) => (
                <button
                  key={chunk.id}
                  type="button"
                  onClick={() => speakText(chunk.english)}
                  className="rounded-xl border border-border/60 bg-card p-4 text-left transition-colors hover:border-primary/50"
                >
                  <span className="flex items-start justify-between gap-3">
                    <strong className="text-sm">{chunk.english}</strong>
                    <Volume2 className="size-4 shrink-0 text-primary" aria-hidden />
                  </span>
                  <span className="mt-2 block text-xs text-muted-foreground">
                    {chunk.vietnamese}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start gap-3">
              <Brain className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-bold">Tự kiểm tra không nhìn mẫu</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Viết một câu trả lời ngắn thể hiện: {busyIntents
                    .map((intent) => intent.descriptionVi.toLowerCase())
                    .join(" và ")}.
                </p>
              </div>
            </div>
            <textarea
              value={quickText}
              onChange={(event) => {
                setQuickText(event.target.value);
                setQuickEvaluation(null);
                setQuickError(null);
              }}
              rows={4}
              className="w-full rounded-xl border border-border bg-background px-3 py-3 text-sm"
              placeholder="Tự viết câu của bạn..."
            />
            {quickError && (
              <p className="text-sm font-semibold text-destructive">{quickError}</p>
            )}
            <MinimalButton fullWidth onClick={submitBusyReview}>
              Tự kiểm tra <ArrowRight className="size-4" />
            </MinimalButton>
          </section>

          {quickEvaluation && (
            <section
              className={`rounded-2xl border p-5 ${
                busyReviewPassed
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-amber-500/30 bg-amber-500/10"
              }`}
            >
              <div className="flex items-start gap-3">
                {busyReviewPassed ? (
                  <CheckCircle2 className="size-6 shrink-0 text-emerald-500" />
                ) : (
                  <RotateCcw className="size-6 shrink-0 text-amber-500" />
                )}
                <div>
                  <h2 className="text-xl font-black">
                    {busyReviewPassed
                      ? "Đã giữ nhịp học hôm nay"
                      : "Cần thử lại một lượt ngắn"}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Bạn đã thể hiện {completedBusyIntentIds.length}/{busyIntentIds.length} mục tiêu ôn nhanh.
                    Phiên này không thay đổi mastery hay tiến độ bài học.
                  </p>
                </div>
              </div>

              {!busyReviewPassed && (
                <div className="mt-4 space-y-2 text-sm">
                  {busyIntents
                    .filter(
                      (intent) =>
                        !quickEvaluation.completedIntentIds.includes(intent.id),
                    )
                    .map((intent) => (
                      <p
                        key={intent.id}
                        className="rounded-lg bg-background/70 px-3 py-2 text-muted-foreground"
                      >
                        Gợi ý: {intent.examples[0]}
                      </p>
                    ))}
                </div>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => router.push("/learn")}
                  className="min-h-11 rounded-xl border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
                >
                  Kết thúc hôm nay
                </button>
                <MinimalButton fullWidth onClick={() => setMode("standard")}>
                  Có thêm thời gian: học phiên chuẩn
                </MinimalButton>
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="space-y-3 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-primary">
            Chọn nhịp học hôm nay
          </p>
          <h1 className="text-3xl font-black">Hôm nay bạn có bao nhiêu thời gian?</h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
            AtoEnglish giới hạn lượng nội dung để bạn kết thúc bằng một việc làm được,
            thay vì học nhiều rồi quên.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border-2 border-primary bg-primary/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground">
                Khuyến nghị
              </span>
              <Clock3 className="size-6 text-primary" aria-hidden />
            </div>
            <h2 className="mt-4 text-xl font-black">Phiên chuẩn 12–15 phút</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {standardBudget.descriptionVi}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Tối đa {standardBudget.newCanDoLimit} can-do mới</li>
              <li>• {standardBudget.targetChunkCount} cụm mục tiêu</li>
              <li>• Tối đa {standardBudget.feedbackCount} góp ý rồi bắt buộc sửa lại</li>
            </ul>
            <div className="mt-5">
              <MinimalButton fullWidth onClick={() => setMode("standard")}>
                Chọn phiên chuẩn 12–15 phút <ArrowRight className="size-4" />
              </MinimalButton>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <Coffee className="size-6 text-amber-500" aria-hidden />
            <h2 className="mt-4 text-xl font-black">Ngày bận 3–5 phút</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {busyBudget.descriptionVi}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Không thêm can-do mới</li>
              <li>• Chỉ ôn {busyBudget.targetChunkCount} cụm cốt lõi</li>
              <li>• Không đánh dấu hoàn thành hoặc mở checkpoint</li>
            </ul>
            <button
              type="button"
              onClick={() => setMode("busy")}
              className="mt-5 min-h-11 w-full rounded-xl border border-border bg-background px-4 text-sm font-bold hover:bg-muted"
            >
              Chọn ngày bận 3–5 phút
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 className="font-black">Gắn việc học với một thời điểm quen thuộc</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Chọn một tín hiệu trong ngày. Bản thử chỉ lưu lựa chọn trên thiết bị này,
                chưa gửi thông báo.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {HABIT_CUES.map((cue) => (
              <button
                key={cue.id}
                type="button"
                aria-pressed={habitCue === cue.id}
                onClick={() => selectHabitCue(cue.id)}
                className={`min-h-10 rounded-full border px-4 text-sm font-semibold transition-colors ${
                  habitCue === cue.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {cue.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

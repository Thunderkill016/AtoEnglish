"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  LessonStepV2,
  LessonV2,
  PracticeExercise,
} from "../../../lib/lessons/v2/schema";
import {
  calculateLessonSessionProgress,
  completeLessonStep,
  createLessonSessionState,
  lessonSessionStorageKey,
  markExerciseCorrect,
  normaliseLessonSessionState,
  recordPerformanceAttempt,
  updateLessonAnswer,
  type LessonSessionState,
} from "../../../lib/lessons/v2/session-progress";

interface LessonV2RunnerProps {
  lesson: LessonV2;
  sessionLabel: string;
  nextLessonId?: string;
}

function playPracticeAudio(text: string): void {
  if (
    typeof window === "undefined" ||
    !("speechSynthesis" in window)
  ) {
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}

function expectedAnswer(exercise: PracticeExercise): string {
  return exercise.answer.trim().toLowerCase();
}

function isExerciseAnswerCorrect(
  exercise: PracticeExercise,
  answer: string,
): boolean {
  const normalised = answer.trim().toLowerCase();
  if (normalised === expectedAnswer(exercise)) return true;

  if (exercise.kind === "recall") {
    return (exercise.acceptedAnswers ?? []).some(
      (candidate) => candidate.trim().toLowerCase() === normalised,
    );
  }

  return false;
}

function StepHeading({
  title,
  minutes,
}: {
  title: string;
  minutes: number;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <h2 className="text-xl font-semibold text-slate-950">{title}</h2>
      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
        {minutes} phút
      </span>
    </div>
  );
}

function PracticeExerciseCard({
  exercise,
  answer,
  isCorrect,
  onAnswer,
  onCheck,
}: {
  exercise: PracticeExercise;
  answer: string;
  isCorrect: boolean;
  onAnswer: (answer: string) => void;
  onCheck: () => void;
}) {
  const feedback = isCorrect
    ? "Đúng. Hãy tự nói lại trước khi sang câu tiếp theo."
    : answer
      ? "Chưa đúng. Xem lại ý nghĩa rồi thử lại."
      : "";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="font-medium text-slate-900">{exercise.promptVi}</p>

      {(exercise.kind === "select" || exercise.kind === "listen") && (
        <div className="mt-4 grid gap-2">
          {exercise.kind === "listen" && (
            <button
              type="button"
              onClick={() => playPracticeAudio(exercise.audioText)}
              className="rounded-xl bg-indigo-50 p-3 text-left text-sm font-semibold text-indigo-950 hover:bg-indigo-100"
            >
              ▶ Phát câu nghe
            </button>
          )}
          {exercise.options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-3 py-3 hover:bg-slate-50"
            >
              <input
                type="radio"
                name={exercise.id}
                value={option}
                checked={answer === option}
                onChange={() => onAnswer(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

      {exercise.kind === "order" && (
        <div className="mt-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {exercise.tokens.map((token) => (
              <span
                key={token}
                className="rounded-lg bg-slate-100 px-3 py-1 text-sm"
              >
                {token}
              </span>
            ))}
          </div>
          <input
            value={answer}
            onChange={(event) => onAnswer(event.target.value)}
            placeholder="Gõ câu theo đúng thứ tự"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {exercise.kind === "recall" && (
        <input
          value={answer}
          onChange={(event) => onAnswer(event.target.value)}
          placeholder="Tự nhớ rồi gõ câu trả lời"
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
        />
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p
          className={`text-sm ${
            isCorrect ? "text-emerald-700" : "text-amber-700"
          }`}
          aria-live="polite"
        >
          {feedback}
        </p>
        <button
          type="button"
          onClick={onCheck}
          disabled={!answer.trim()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Kiểm tra
        </button>
      </div>
    </article>
  );
}

function LessonStepPanel({
  step,
  lesson,
  state,
  setState,
}: {
  step: LessonStepV2;
  lesson: LessonV2;
  state: LessonSessionState;
  setState: (state: LessonSessionState) => void;
}) {
  switch (step.kind) {
    case "scenario":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-indigo-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Vai của bạn
              </p>
              <p className="mt-2 text-slate-900">{step.roleVi}</p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                Tình huống
              </p>
              <p className="mt-2 text-slate-900">{step.situationVi}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Kết quả cần đạt
              </p>
              <p className="mt-2 text-slate-900">{step.goalVi}</p>
            </div>
          </div>
        </div>
      );

    case "model":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <div className="space-y-3">
            {step.turns.map((turn, index) => (
              <div
                key={`${turn.speaker}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {turn.speaker}
                </p>
                <p className="mt-1 text-lg font-medium text-slate-950">
                  {turn.text}
                </p>
                {turn.translationVi && (
                  <p className="mt-1 text-sm text-slate-600">
                    {turn.translationVi}
                  </p>
                )}
              </div>
            ))}
          </div>
          {step.replayRates && (
            <p className="mt-4 text-sm text-slate-500">
              Tốc độ luyện gợi ý: {step.replayRates.join("× → ")}×
            </p>
          )}
        </div>
      );

    case "notice": {
      const targets = lesson.targets.filter((target) =>
        step.targetIds.includes(target.id),
      );

      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          {step.explanationVi && (
            <p className="mb-5 rounded-2xl bg-amber-50 p-4 text-amber-950">
              {step.explanationVi}
            </p>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {targets.map((target) => (
              <article
                key={target.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <p className="text-sm font-semibold text-indigo-700">
                  {target.form}
                </p>
                <p className="mt-2 text-slate-700">{target.meaningVi}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {target.exampleEn}
                </p>
              </article>
            ))}
          </div>
        </div>
      );
    }

    case "practice":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <div className="space-y-4">
            {step.exercises.map((exercise) => {
              const answer = state.answers[exercise.id] ?? "";
              const isCorrect = state.correctExerciseIds.includes(exercise.id);

              return (
                <PracticeExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  answer={answer}
                  isCorrect={isCorrect}
                  onAnswer={(nextAnswer) =>
                    setState(
                      updateLessonAnswer(
                        state,
                        exercise.id,
                        nextAnswer,
                      ),
                    )
                  }
                  onCheck={() => {
                    if (isExerciseAnswerCorrect(exercise, answer)) {
                      setState(markExerciseCorrect(state, exercise.id));
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      );

    case "rehearsal":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <p className="rounded-2xl bg-sky-50 p-4 text-sky-950">
            {step.promptVi}
          </p>
          {step.frameEn && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Khung tạm thời
              </p>
              <p className="mt-2 text-lg font-medium text-slate-950">
                {step.frameEn}
              </p>
            </div>
          )}
          {step.keyWords && (
            <div className="mt-4 flex flex-wrap gap-2">
              {step.keyWords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      );

    case "performance":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <div className="rounded-2xl bg-indigo-950 p-5 text-white">
            <p className="text-sm text-indigo-200">{step.task.roleVi}</p>
            <p className="mt-2 text-lg font-semibold">{step.task.goalVi}</p>
            <p className="mt-3 text-sm leading-6 text-indigo-100">
              {step.task.promptVi}
            </p>
          </div>
          <ul className="mt-5 space-y-2">
            {step.task.successCriteriaVi.map((criterion) => (
              <li
                key={criterion}
                className="flex gap-3 rounded-xl bg-slate-50 p-3"
              >
                <span aria-hidden="true">✓</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                setState(recordPerformanceAttempt(state))
              }
              className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-500"
            >
              Ghi nhận lượt nói
            </button>
            <span className="text-sm text-slate-600" aria-live="polite">
              Đã ghi {state.performanceAttempts}/
              {step.task.attempts} lượt
            </span>
          </div>
        </div>
      );

    case "feedback":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <div className="space-y-3">
            {step.repairPromptsVi.map((prompt, index) => (
              <div
                key={prompt}
                className="flex gap-3 rounded-2xl border border-slate-200 p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-800">
                  {index + 1}
                </span>
                <p>{prompt}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "exit":
      return (
        <div>
          <StepHeading title={step.titleVi} minutes={step.estimatedMinutes} />
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Can-do
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-950">
              {step.canDoCheckVi}
            </p>
            {step.confidencePromptVi && (
              <p className="mt-3 text-sm text-emerald-800">
                {step.confidencePromptVi}
              </p>
            )}
          </div>
        </div>
      );
  }
}

export function LessonV2Runner({
  lesson,
  sessionLabel,
  nextLessonId,
}: LessonV2RunnerProps) {
  const [state, setState] = useState<LessonSessionState>(() =>
    createLessonSessionState(lesson.id),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const key = lessonSessionStorageKey(lesson.id);
    const raw = window.localStorage.getItem(key);

    if (raw) {
      try {
        setState(
          normaliseLessonSessionState(JSON.parse(raw), lesson.id),
        );
      } catch {
        setState(createLessonSessionState(lesson.id));
      }
    }

    setHydrated(true);
  }, [lesson.id]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      lessonSessionStorageKey(lesson.id),
      JSON.stringify(state),
    );
  }, [hydrated, lesson.id, state]);

  const safeStepIndex = Math.min(
    state.currentStepIndex,
    lesson.steps.length - 1,
  );
  const currentStep = lesson.steps[safeStepIndex];
  const progress = calculateLessonSessionProgress(
    state,
    lesson.steps.length,
  );

  const canCompleteCurrentStep = useMemo(() => {
    if (currentStep.kind === "practice") {
      return currentStep.exercises.every((exercise) =>
        state.correctExerciseIds.includes(exercise.id),
      );
    }

    if (currentStep.kind === "performance") {
      return (
        state.performanceAttempts >= currentStep.task.attempts
      );
    }

    return true;
  }, [currentStep, state.correctExerciseIds, state.performanceAttempts]);

  function moveToPreviousStep() {
    setState({
      ...state,
      currentStepIndex: Math.max(0, safeStepIndex - 1),
      updatedAt: new Date().toISOString(),
    });
  }

  function completeCurrentStep() {
    const isFinalStep = safeStepIndex === lesson.steps.length - 1;
    const nextStepIndex = isFinalStep
      ? safeStepIndex
      : safeStepIndex + 1;

    setState(
      completeLessonStep(
        state,
        currentStep.id,
        nextStepIndex,
        isFinalStep,
      ),
    );
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-slate-600">
        Đang tải tiến trình bài học…
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <header className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/learn-v2"
                className="text-sm font-medium text-indigo-700 hover:underline"
              >
                ← Pre‑A1 V2
              </Link>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                {sessionLabel}
              </p>
              <h1 className="mt-2 text-2xl font-bold text-slate-950">
                {lesson.titleVi}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                {lesson.primaryOutcome.statementVi}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 px-4 py-3 text-right">
              <p className="text-xs text-slate-500">Thời lượng</p>
              <p className="font-semibold text-slate-900">
                {lesson.estimatedMinutes} phút
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>
                Bước {safeStepIndex + 1}/{lesson.steps.length}
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-7">
          <LessonStepPanel
            step={currentStep}
            lesson={lesson}
            state={state}
            setState={setState}
          />

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={moveToPreviousStep}
              disabled={safeStepIndex === 0}
              className="rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Bước trước
            </button>

            {!state.completed ? (
              <button
                type="button"
                onClick={completeCurrentStep}
                disabled={!canCompleteCurrentStep}
                className="rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {safeStepIndex === lesson.steps.length - 1
                  ? "Hoàn thành bài"
                  : "Hoàn thành bước"}
              </button>
            ) : nextLessonId ? (
              <Link
                href={`/learn-v2/${nextLessonId}`}
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
              >
                Sang bài tiếp theo
              </Link>
            ) : (
              <Link
                href="/learn-v2"
                className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
              >
                Xem tiến trình module
              </Link>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

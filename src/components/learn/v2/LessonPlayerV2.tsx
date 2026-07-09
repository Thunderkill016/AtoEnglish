"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LessonSpec } from "@/lib/v2/lesson-spec";
import { LESSON_STAGES } from "@/lib/v2/lesson-spec";
import { markLessonComplete } from "@/lib/v2/progress";
import { cn } from "@/lib/utils";

interface Props {
  lesson: LessonSpec;
}

export function LessonPlayerV2({ lesson }: Props) {
  const router = useRouter();
  const [stageIndex, setStageIndex] = useState(0);
  const [taskDone, setTaskDone] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);

  const stage = LESSON_STAGES[stageIndex];
  const isLast = stageIndex >= LESSON_STAGES.length - 1;
  const quizItems = lesson.review.quiz;

  const correctCount = useMemo(() => {
    return quizItems.filter((q) => selected[q.id] === q.answer).length;
  }, [quizItems, selected]);

  function goNext() {
    if (stage.id === "task" && !taskDone) return;

    if (stage.id === "review" && quizScore === null) {
      setQuizScore(correctCount);
      return;
    }

    if (isLast && quizScore !== null) {
      markLessonComplete({
        lessonId: lesson.id,
        quizCorrect: correctCount,
        quizTotal: quizItems.length,
        taskDone,
      });
      setFinished(true);
      return;
    }

    if (!isLast) setStageIndex((i) => i + 1);
  }

  function goPrev() {
    if (stageIndex > 0) setStageIndex((i) => i - 1);
  }

  if (finished) {
    const pct = Math.round((correctCount / quizItems.length) * 100);
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 space-y-4 text-center">
        <p className="text-2xl font-black text-emerald-300">Hoàn thành!</p>
        <p className="text-sm text-zinc-300">
          {lesson.title_vi} · Quiz {correctCount}/{quizItems.length} ({pct}%)
          {taskDone ? " · Nhiệm vụ nói ✓" : ""}
        </p>
        <p className="text-xs text-zinc-500">
          Tiến độ đã lưu trên máy (local). Lộ trình B1: về Home để học bài tiếp.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link
            href="/home"
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-zinc-950"
          >
            Về Home — bài tiếp
          </Link>
          <button
            type="button"
            onClick={() => router.push("/path")}
            className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-zinc-200 hover:bg-white/5"
          >
            Xem lộ trình
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-1" aria-label="Tiến độ bài học">
        {LESSON_STAGES.map((s, i) => (
          <div
            key={s.id}
            title={s.label_vi}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < stageIndex
                ? "bg-emerald-500"
                : i === stageIndex
                  ? "bg-emerald-400/80"
                  : "bg-zinc-800",
            )}
          />
        ))}
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-500/90">
        {stageIndex + 1}/{LESSON_STAGES.length} · {stage.label_vi}
      </p>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl space-y-4">
        {stage.id === "engage" && <EngageStage lesson={lesson} />}
        {stage.id === "lexis" && <LexisStage lesson={lesson} />}
        {stage.id === "grammar" && <GrammarStage lesson={lesson} />}
        {stage.id === "controlled" && (
          <ControlledStage lesson={lesson} selected={selected} onSelect={(id, v) => setSelected((s) => ({ ...s, [id]: v }))} />
        )}
        {stage.id === "input" && <InputStage lesson={lesson} />}
        {stage.id === "fluency" && <FluencyStage lesson={lesson} />}
        {stage.id === "task" && (
          <TaskStage lesson={lesson} done={taskDone} onDone={() => setTaskDone(true)} />
        )}
        {stage.id === "review" && (
          <ReviewStage
            lesson={lesson}
            selected={selected}
            onSelect={(id, val) => setSelected((s) => ({ ...s, [id]: val }))}
            quizScore={quizScore}
            correctCount={correctCount}
            taskDone={taskDone}
          />
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={stageIndex === 0}
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-300 disabled:opacity-40 hover:bg-white/5"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={stage.id === "task" && !taskDone}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2.5 text-sm font-bold text-zinc-950 disabled:opacity-40"
        >
          {stage.id === "review" && quizScore === null
            ? "Chấm quiz"
            : isLast && quizScore !== null
              ? "Hoàn thành bài"
              : "Tiếp tục"}
        </button>
      </div>

      {stage.id === "task" && !taskDone && (
        <p className="text-center text-xs text-amber-400/90">
          Đánh dấu đã nói xong nhiệm vụ trước khi sang bước sau.
        </p>
      )}
    </div>
  );
}

function EngageStage({ lesson }: { lesson: LessonSpec }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-50">Tình huống</h2>
      <p className="text-zinc-200 leading-relaxed">{lesson.situation}</p>
      <div>
        <h3 className="text-sm font-semibold text-emerald-400 mb-2">Sau bài bạn làm được</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-zinc-300">
          {lesson.canDo.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-zinc-400 border-t border-white/10 pt-3">
        <span className="font-semibold text-zinc-300">Văn hóa: </span>
        {lesson.culturalNote_vi}
      </p>
      {lesson.jobAngle && (
        <p className="text-xs text-teal-400/90">💼 {lesson.jobAngle}</p>
      )}
    </div>
  );
}

function LexisStage({ lesson }: { lesson: LessonSpec }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-zinc-50">Từ vựng cốt lõi</h2>
      <p className="text-xs text-zinc-500">{lesson.lexis.length} mục — đủ để hiểu hội thoại.</p>
      <ul className="space-y-3">
        {lesson.lexis.map((item) => (
          <li key={item.id} className="rounded-xl border border-white/10 bg-zinc-950/40 p-3">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-bold text-emerald-300">{item.word}</span>
              {item.phonetic && <span className="text-xs text-zinc-500">{item.phonetic}</span>}
              <span className="text-sm text-zinc-300">— {item.meaning_vi}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-400 italic">{item.example_en}</p>
            {item.l1_note_vi && (
              <p className="mt-2 text-xs text-amber-200/80">⚠️ {item.l1_note_vi}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function GrammarStage({ lesson }: { lesson: LessonSpec }) {
  const g = lesson.grammar;
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-zinc-50">{g.title}</h2>
      <p className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 font-mono text-sm text-emerald-200">
        {g.rule}
      </p>
      <ul className="space-y-1 text-sm">
        {g.examples.map((ex) => (
          <li key={ex.en}>
            <span className="text-zinc-100">{ex.en}</span>
            <span className="text-zinc-500"> — {ex.vi}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-amber-200/80">🇻🇳 {g.vnNote}</p>
      <div className="rounded-xl border border-white/10 p-3 space-y-2">
        <p className="text-sm font-medium text-zinc-200">CCQ: {g.ccq.question}</p>
        <ul className="text-sm text-zinc-400 space-y-1">
          {g.ccq.options.map((o) => (
            <li key={o} className={o === g.ccq.answer ? "text-emerald-400 font-medium" : ""}>
              {o === g.ccq.answer ? "✓ " : "· "}
              {o}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ControlledStage({
  lesson,
  selected,
  onSelect,
}: {
  lesson: LessonSpec;
  selected: Record<string, string>;
  onSelect: (id: string, v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-zinc-50">Luyện tập</h2>
      {lesson.controlled.map((ex) => (
        <div key={ex.id} className="rounded-xl border border-white/10 p-3 space-y-2">
          <p className="text-sm text-zinc-200">{ex.prompt_vi}</p>
          {ex.stem && <p className="text-sm font-mono text-zinc-400">{ex.stem}</p>}
          {ex.options ? (
            <div className="flex flex-wrap gap-2">
              {ex.options.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => onSelect(ex.id, o)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    selected[ex.id] === o
                      ? selected[ex.id] === ex.answer
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
                        : "border-amber-500/50 bg-amber-500/10 text-amber-100"
                      : "border-white/10 text-zinc-400",
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-500/90">Đáp án gợi ý: {ex.answer}</p>
          )}
          {selected[ex.id] && selected[ex.id] !== ex.answer && (
            <p className="text-xs text-amber-400">Gợi ý: {ex.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function InputStage({ lesson }: { lesson: LessonSpec }) {
  const d = lesson.input.dialogues[0];
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-50">Hội thoại & nghe</h2>
      {d && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-teal-300">{d.title_vi}</h3>
          {d.context_vi && <p className="text-xs text-zinc-500">{d.context_vi}</p>}
          <ul className="space-y-2">
            {d.lines.map((line) => (
              <li key={line.id} className="text-sm">
                <span className="font-semibold text-emerald-400">{line.speaker}: </span>
                <span className="text-zinc-100">{line.text}</span>
                <p className="text-xs text-zinc-500 pl-2">{line.translation_vi}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="text-sm font-semibold text-zinc-300 mb-2">Nghe & chọn (đáp án)</h3>
        <ul className="space-y-2 text-sm text-zinc-400">
          {lesson.input.listenItems.map((item) => (
            <li key={item.id}>
              “{item.audio_text}” → <span className="text-emerald-400">{item.answer}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FluencyStage({ lesson }: { lesson: LessonSpec }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-zinc-50">Phản xạ</h2>
      <p className="text-xs text-zinc-500">Nói to các câu đã biết — không từ mới.</p>
      <ul className="grid gap-2">
        {lesson.fluency.items.map((item) => (
          <li key={item.en} className="rounded-xl border border-white/10 px-3 py-2 text-sm">
            <span className="font-medium text-zinc-100">{item.en}</span>
            <span className="text-zinc-500"> · {item.vi}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TaskStage({
  lesson,
  done,
  onDone,
}: {
  lesson: LessonSpec;
  done: boolean;
  onDone: () => void;
}) {
  const t = lesson.task;
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-zinc-50">Nhiệm vụ nói</h2>
      <p className="text-zinc-200 leading-relaxed">{t.prompt_vi}</p>
      <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
        {t.successCriteria_vi.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {t.scaffold_en && (
        <div className="rounded-xl bg-zinc-950/50 border border-white/10 p-3">
          <p className="text-xs text-zinc-500 mb-1">Khung gợi ý</p>
          <ul className="text-sm text-zinc-300 space-y-0.5">
            {t.scaffold_en.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={onDone}
        className={cn(
          "w-full rounded-xl py-3 text-sm font-bold",
          done
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            : "bg-amber-500 text-zinc-950 hover:bg-amber-400",
        )}
      >
        {done ? "✓ Đã nói xong" : "Tôi đã nói xong nhiệm vụ"}
      </button>
    </div>
  );
}

function ReviewStage({
  lesson,
  selected,
  onSelect,
  quizScore,
  correctCount,
  taskDone,
}: {
  lesson: LessonSpec;
  selected: Record<string, string>;
  onSelect: (id: string, val: string) => void;
  quizScore: number | null;
  correctCount: number;
  taskDone: boolean;
}) {
  const total = lesson.review.quiz.length;
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-zinc-50">Quiz cuối</h2>
      {lesson.review.quiz.map((q) => (
        <div key={q.id} className="space-y-2">
          <p className="text-sm text-zinc-200">{q.question}</p>
          <div className="flex flex-wrap gap-2">
            {(q.options ?? [q.answer]).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onSelect(q.id, opt)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs",
                  selected[q.id] === opt
                    ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
                    : "border-white/10 text-zinc-400 hover:border-white/20",
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}
      {quizScore !== null && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="font-bold text-emerald-300">
            Quiz {correctCount}/{total}
            {taskDone ? " · Task ✓" : " · Task chưa"}
          </p>
          <p className="text-xs text-zinc-400 mt-1">Bấm «Hoàn thành bài» để lưu tiến độ.</p>
        </div>
      )}
    </div>
  );
}

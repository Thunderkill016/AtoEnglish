"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mic,
  PartyPopper,
  Volume2,
} from "lucide-react";
import type { ControlledExercise, LessonSpec, QuizItem } from "@/lib/v2/lesson-spec";
import { LESSON_STAGES } from "@/lib/v2/lesson-spec";
import { answersMatch, shuffleWords } from "@/lib/v2/exercise-answer";
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
    return quizItems.filter((q) =>
      answersMatch(selected[q.id] ?? "", q.answer),
    ).length;
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
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-zinc-900/80 p-8 text-center space-y-4 shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]"
      >
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
          <PartyPopper className="size-8 text-emerald-300" />
        </div>
        <p className="text-2xl font-black text-zinc-50">Hoàn thành!</p>
        <p className="text-sm text-zinc-300">
          {lesson.title_vi}
          <br />
          Quiz <span className="font-bold text-emerald-400">{correctCount}/{quizItems.length}</span>{" "}
          ({pct}%)
          {taskDone ? " · Nhiệm vụ nói ✓" : ""}
        </p>
        <p className="text-xs text-zinc-500">Tiến độ đã lưu trên máy này.</p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link
            href="/home"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-900/30"
          >
            Home — bài tiếp
            <ArrowRight className="size-4" />
          </Link>
          <button
            type="button"
            onClick={() => router.push("/path")}
            className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 hover:bg-white/10"
          >
            Xem lộ trình
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stage pills */}
      <div className="flex gap-1" aria-label="Tiến độ bài học">
        {LESSON_STAGES.map((s, i) => (
          <div
            key={s.id}
            title={s.label_vi}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i < stageIndex
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                : i === stageIndex
                  ? "bg-teal-400"
                  : "bg-zinc-800",
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/90">
          {stageIndex + 1}/{LESSON_STAGES.length} · {stage.label_vi}
        </p>
        <p className="text-[11px] text-zinc-500">{lesson.estimatedMin} phút</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -8 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] space-y-4"
        >
          {stage.id === "engage" && <EngageStage lesson={lesson} />}
          {stage.id === "lexis" && <LexisStage lesson={lesson} />}
          {stage.id === "grammar" && <GrammarStage lesson={lesson} />}
          {stage.id === "controlled" && (
            <ControlledStage
              lesson={lesson}
              selected={selected}
              onSelect={(id, v) => setSelected((s) => ({ ...s, [id]: v }))}
            />
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
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={stageIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm font-semibold text-zinc-300 disabled:opacity-35 hover:border-zinc-600 hover:bg-zinc-900"
        >
          <ArrowLeft className="size-4" />
          Lại
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={stage.id === "task" && !taskDone}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-900/25 disabled:opacity-40 hover:brightness-110 active:scale-[0.99] transition"
        >
          {stage.id === "review" && quizScore === null
            ? "Chấm quiz"
            : isLast && quizScore !== null
              ? "Hoàn thành bài"
              : "Tiếp tục"}
          <ArrowRight className="size-4" />
        </button>
      </div>

      {stage.id === "task" && !taskDone && (
        <p className="text-center text-xs text-amber-400/90 font-medium">
          Hãy nói to nhiệm vụ rồi bấm «Tôi đã nói xong»
        </p>
      )}
    </div>
  );
}

function SectionTitle({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1 mb-1">
      <h2 className="text-lg font-black text-zinc-50 tracking-tight">{children}</h2>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

function EngageStage({ lesson }: { lesson: LessonSpec }) {
  return (
    <div className="space-y-4">
      <SectionTitle hint="Biết vì sao học trước khi vào từ">Tình huống</SectionTitle>
      <p className="text-[15px] text-zinc-200 leading-relaxed">{lesson.situation}</p>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-2">
          Sau bài bạn làm được
        </p>
        <ul className="space-y-2">
          {lesson.canDo.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-zinc-200">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wide mb-1">
          Ghi chú văn hóa
        </p>
        <p className="text-sm text-zinc-400 leading-relaxed">{lesson.culturalNote_vi}</p>
      </div>
      {lesson.jobAngle && (
        <p className="text-xs font-semibold text-teal-400/90">💼 {lesson.jobAngle}</p>
      )}
    </div>
  );
}

function LexisStage({ lesson }: { lesson: LessonSpec }) {
  return (
    <div className="space-y-3">
      <SectionTitle hint={`${lesson.lexis.length} mục cốt lõi — đủ nghe hội thoại`}>
        Từ vựng
      </SectionTitle>
      <ul className="space-y-2.5">
        {lesson.lexis.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-3.5 hover:border-emerald-500/25 transition-colors"
          >
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-base font-black text-emerald-300">{item.word}</span>
              {item.phonetic && (
                <span className="text-xs text-zinc-500 font-mono">{item.phonetic}</span>
              )}
            </div>
            <p className="text-sm text-zinc-300 mt-0.5">{item.meaning_vi}</p>
            <p className="mt-1.5 text-sm text-zinc-500 italic">“{item.example_en}”</p>
            {item.l1_note_vi && (
              <p className="mt-2 text-xs leading-relaxed text-amber-200/85 rounded-lg bg-amber-500/10 border border-amber-500/15 px-2.5 py-1.5">
                ⚠️ {item.l1_note_vi}
              </p>
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
      <SectionTitle>{g.title}</SectionTitle>
      <p className="rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/10 border border-emerald-500/25 px-4 py-3 font-mono text-sm font-bold text-emerald-200">
        {g.rule}
      </p>
      <ul className="space-y-2">
        {g.examples.map((ex) => (
          <li key={ex.en} className="rounded-xl bg-zinc-950/40 border border-white/5 px-3 py-2">
            <p className="text-sm font-medium text-zinc-100">{ex.en}</p>
            <p className="text-xs text-zinc-500">{ex.vi}</p>
          </li>
        ))}
      </ul>
      <p className="text-xs text-amber-200/85 leading-relaxed">🇻🇳 {g.vnNote}</p>
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 space-y-2">
        <p className="text-sm font-bold text-violet-200">Kiểm tra hiểu: {g.ccq.question}</p>
        <ul className="space-y-1">
          {g.ccq.options.map((o) => (
            <li
              key={o}
              className={cn(
                "text-sm rounded-lg px-2 py-1",
                o === g.ccq.answer
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                  : "text-zinc-400",
              )}
            >
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
      <SectionTitle hint="MCQ · chạm từ sắp xếp · điền chỗ trống — ~80% đúng là ổn">
        Luyện tập
      </SectionTitle>
      {lesson.controlled.map((ex, i) => (
        <div
          key={ex.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-zinc-600">#{i + 1}</p>
            <span className="rounded-md bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
              {ex.type}
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-100">{ex.prompt_vi}</p>
          {ex.stem && ex.type !== "scramble" && (
            <p className="text-sm font-mono text-teal-300/90">{ex.stem}</p>
          )}
          {ex.type === "scramble" ? (
            <ScrambleExercise ex={ex} onCommit={(v) => onSelect(ex.id, v)} />
          ) : ex.type === "cloze" || ex.type === "correction" ? (
            <ClozeExercise
              exerciseId={ex.id}
              answer={ex.answer}
              explanation={ex.explanation_vi}
              placeholder={
                ex.type === "correction"
                  ? "Sửa câu đúng..."
                  : "Điền từ còn thiếu..."
              }
              onCommit={(v) => onSelect(ex.id, v)}
            />
          ) : ex.options && ex.options.length > 0 ? (
            <McqOptions
              options={ex.options}
              answer={ex.answer}
              selected={selected[ex.id]}
              onSelect={(v) => onSelect(ex.id, v)}
            />
          ) : (
            <ClozeExercise
              exerciseId={ex.id}
              answer={ex.answer}
              explanation={ex.explanation_vi}
              placeholder="Nhập đáp án..."
              onCommit={(v) => onSelect(ex.id, v)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function McqOptions({
  options,
  answer,
  selected,
  onSelect,
}: {
  options: string[];
  answer: string;
  selected?: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((o) => {
        const picked = selected === o;
        const ok = answersMatch(o, answer);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onSelect(o)}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs font-semibold transition",
              picked && ok && "border-emerald-500 bg-emerald-500/20 text-emerald-200",
              picked && !ok && "border-amber-500/60 bg-amber-500/10 text-amber-100",
              !picked && "border-zinc-700 text-zinc-400 hover:border-zinc-500",
            )}
          >
            {o}
          </button>
        );
      })}
      {selected && !answersMatch(selected, answer) && (
        <p className="w-full text-xs text-amber-400">→ {answer}</p>
      )}
    </div>
  );
}

/** Tap-order scramble: pool → built sentence → check. */
function ScrambleExercise({
  ex,
  onCommit,
}: {
  ex: ControlledExercise;
  onCommit: (joined: string) => void;
}) {
  const [pool] = useState(() =>
    shuffleWords(ex.words && ex.words.length > 0 ? ex.words : ex.answer.split(/\s+/)),
  );
  const [built, setBuilt] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const joined = built.join(" ");
  const isCorrect = answersMatch(joined, ex.answer);

  function pickWord(w: string) {
    if (checked) return;
    const used = built.filter((b) => b === w).length;
    const total = pool.filter((t) => t === w).length;
    if (used >= total) return;
    setBuilt((prev) => [...prev, w]);
  }

  function removeAt(i: number) {
    if (checked) return;
    setBuilt((prev) => {
      const next = [...prev];
      next.splice(i, 1);
      return next;
    });
  }

  function check() {
    if (built.length === 0) return;
    setChecked(true);
    onCommit(joined);
  }

  return (
    <div className="space-y-2 pt-1">
      <div
        className={cn(
          "min-h-[44px] flex flex-wrap gap-2 rounded-xl border p-3",
          checked
            ? isCorrect
              ? "border-emerald-500/40 bg-emerald-500/10"
              : "border-amber-500/40 bg-amber-500/10"
            : "border-zinc-700 bg-zinc-900/50",
        )}
      >
        {built.length === 0 ? (
          <span className="self-center text-xs text-zinc-500">
            Chạm từ bên dưới để xếp câu...
          </span>
        ) : (
          built.map((w, i) => (
            <button
              key={`${w}-${i}`}
              type="button"
              disabled={checked}
              onClick={() => removeAt(i)}
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200 disabled:cursor-default hover:bg-emerald-500/20"
            >
              {w}
            </button>
          ))
        )}
      </div>
      {!checked && (
        <div className="flex flex-wrap gap-2">
          {pool.map((w, i) => {
            const used = built.filter((b) => b === w).length;
            const total = pool.filter((t) => t === w).length;
            const disabled = used >= total;
            return (
              <button
                key={`${w}-pool-${i}`}
                type="button"
                disabled={disabled}
                onClick={() => pickWord(w)}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs font-bold transition",
                  disabled
                    ? "cursor-not-allowed border-zinc-800 text-zinc-600 opacity-30"
                    : "border-zinc-600 bg-zinc-800/80 text-zinc-100 hover:border-teal-400/70 hover:bg-zinc-800 active:scale-95",
                )}
              >
                {w}
              </button>
            );
          })}
        </div>
      )}
      {!checked ? (
        <button
          type="button"
          disabled={built.length === 0}
          onClick={check}
          className="rounded-xl border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-300 hover:bg-teal-500/20 disabled:opacity-40"
        >
          Kiểm tra
        </button>
      ) : (
        <p
          className={cn(
            "text-xs font-bold",
            isCorrect ? "text-emerald-400" : "text-amber-400",
          )}
        >
          {isCorrect ? "✓ Chính xác!" : `→ ${ex.answer}`}
          {ex.explanation_vi && !isCorrect ? (
            <span className="mt-1 block font-medium text-zinc-500">
              {ex.explanation_vi}
            </span>
          ) : null}
        </p>
      )}
    </div>
  );
}

/** Cloze / correction free-text with check. */
function ClozeExercise({
  exerciseId,
  answer,
  explanation,
  placeholder,
  onCommit,
}: {
  exerciseId: string;
  answer: string;
  explanation?: string;
  placeholder: string;
  onCommit: (v: string) => void;
}) {
  const [draft, setDraft] = useState("");
  const [checked, setChecked] = useState(false);
  const isCorrect = answersMatch(draft, answer);

  function check() {
    if (!draft.trim()) return;
    setChecked(true);
    onCommit(draft.trim());
  }

  return (
    <div className="space-y-2 pt-1">
      <input
        id={`cloze-${exerciseId}`}
        type="text"
        autoComplete="off"
        disabled={checked}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            check();
          }
        }}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-70",
          checked
            ? isCorrect
              ? "border-emerald-500/50"
              : "border-amber-500/50"
            : "border-zinc-700",
        )}
      />
      {!checked ? (
        <button
          type="button"
          disabled={!draft.trim()}
          onClick={check}
          className="rounded-xl border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs font-bold text-teal-300 hover:bg-teal-500/20 disabled:opacity-40"
        >
          Kiểm tra
        </button>
      ) : (
        <p
          className={cn(
            "text-xs font-bold",
            isCorrect ? "text-emerald-400" : "text-amber-400",
          )}
        >
          {isCorrect ? "✓ Chính xác!" : `→ ${answer}`}
          {explanation && !isCorrect ? (
            <span className="mt-1 block font-medium text-zinc-500">{explanation}</span>
          ) : null}
        </p>
      )}
    </div>
  );
}

function InputStage({ lesson }: { lesson: LessonSpec }) {
  const d = lesson.input.dialogues[0];
  return (
    <div className="space-y-4">
      <SectionTitle hint="Nghe / đọc — từ đã học trong ngữ cảnh">
        Hội thoại
      </SectionTitle>
      {d && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Volume2 className="size-4 text-teal-400" />
            <h3 className="text-sm font-bold text-teal-300">{d.title_vi}</h3>
          </div>
          {d.context_vi && (
            <p className="text-xs text-zinc-500">{d.context_vi}</p>
          )}
          <ul className="space-y-2.5">
            {d.lines.map((line) => (
              <li
                key={line.id}
                className="rounded-2xl border border-white/5 bg-zinc-950/50 px-3.5 py-2.5"
              >
                <p className="text-[11px] font-bold text-emerald-500/90 mb-0.5">
                  {line.speaker}
                </p>
                <p className="text-sm font-medium text-zinc-100">{line.text}</p>
                <p className="text-xs text-zinc-500 mt-1">{line.translation_vi}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="rounded-2xl border border-zinc-800 p-3">
        <p className="text-[11px] font-bold text-zinc-500 mb-2">Nghe & chọn</p>
        <ul className="space-y-1.5 text-sm text-zinc-400">
          {lesson.input.listenItems.map((item) => (
            <li key={item.id}>
              <span className="text-zinc-300">“{item.audio_text}”</span>
              <span className="text-emerald-400"> → {item.answer}</span>
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
      <SectionTitle hint="Nói to, nhanh dần — chỉ câu đã biết">Phản xạ</SectionTitle>
      <ul className="grid gap-2">
        {lesson.fluency.items.map((item) => (
          <li
            key={item.en}
            className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 px-4 py-3"
          >
            <Mic className="size-4 shrink-0 text-teal-400/80" />
            <div>
              <p className="text-sm font-bold text-zinc-100">{item.en}</p>
              <p className="text-xs text-zinc-500">{item.vi}</p>
            </div>
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
    <div className="space-y-4">
      <SectionTitle hint="Output thật — tiêu chí rõ">Nhiệm vụ nói</SectionTitle>
      <p className="text-[15px] text-zinc-200 leading-relaxed">{t.prompt_vi}</p>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-400 mb-2">
          Tiêu chí thành công
        </p>
        <ul className="space-y-1.5">
          {t.successCriteria_vi.map((c) => (
            <li key={c} className="flex gap-2 text-sm text-zinc-200">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-400 mt-0.5" />
              {c}
            </li>
          ))}
        </ul>
      </div>
      {t.scaffold_en && (
        <div className="rounded-2xl border border-white/10 bg-zinc-950/50 p-4">
          <p className="text-[11px] font-bold text-zinc-500 mb-2">Khung gợi ý</p>
          <ul className="space-y-1">
            {t.scaffold_en.map((s) => (
              <li key={s} className="text-sm font-mono text-teal-300/90">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        onClick={onDone}
        className={cn(
          "w-full rounded-2xl py-3.5 text-sm font-black transition flex items-center justify-center gap-2",
          done
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
            : "bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-lg shadow-amber-900/20",
        )}
      >
        <Mic className="size-4" />
        {done ? "Đã nói xong ✓" : "Tôi đã nói xong nhiệm vụ"}
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
      <SectionTitle>Quiz cuối</SectionTitle>
      {lesson.review.quiz.map((q, i) => (
        <div key={q.id} className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
          <p className="text-[11px] font-bold text-zinc-600">Câu {i + 1}</p>
          <p className="text-sm font-medium text-zinc-100">{q.question}</p>
          <ReviewQuestionBody q={q} selected={selected[q.id]} onSelect={onSelect} />
        </div>
      ))}
      {quizScore !== null && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="font-black text-emerald-300">
            Quiz {correctCount}/{total}
            {taskDone ? " · Task ✓" : ""}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Bấm «Hoàn thành bài» để lưu và về Home.
          </p>
        </div>
      )}
    </div>
  );
}

function ReviewQuestionBody({
  q,
  selected,
  onSelect,
}: {
  q: QuizItem;
  selected?: string;
  onSelect: (id: string, val: string) => void;
}) {
  const needsText =
    q.type === "cloze" || !q.options || q.options.length === 0;
  const [draft, setDraft] = useState(selected ?? "");

  if (needsText) {
    return (
      <div className="space-y-2">
        <input
          type="text"
          autoComplete="off"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            onSelect(q.id, e.target.value);
          }}
          placeholder="Điền đáp án..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
        {selected && answersMatch(selected, q.answer) && (
          <p className="text-xs font-bold text-emerald-400">✓</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {q.options!.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(q.id, opt)}
          className={cn(
            "rounded-xl border px-3 py-2 text-xs font-semibold transition",
            selected === opt
              ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
              : "border-zinc-700 text-zinc-400 hover:border-zinc-500",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { UnitData } from "../UnitTemplate";
import LessonSectionHeader from "../lesson-ui/LessonSectionHeader";
import LessonContinueButton from "../lesson-ui/LessonContinueButton";
import { lessonSectionMotion } from "../lesson-ui/motion";

interface GrammarSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  playTTS: (text: string) => void;
  ccqAnswer: string;
  setCcqAnswer: React.Dispatch<React.SetStateAction<string>>;
  ccqSubmitted: boolean;
  setCcqSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  playCorrectSound: () => void;
  playWrongSound: () => void;
  goNext: () => void;
}

export default function GrammarSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  playTTS,
  ccqAnswer,
  setCcqAnswer,
  ccqSubmitted,
  setCcqSubmitted,
  playCorrectSound,
  playWrongSound,
  goNext,
}: GrammarSectionProps) {
  const ccqCorrect = !!(unit.grammar?.ccq && ccqAnswer === unit.grammar.ccq.answer);

  return (
    <motion.div
      key="s3"
      initial={lessonSectionMotion.initial}
      animate={lessonSectionMotion.animate}
      exit={lessonSectionMotion.exit}
      transition={lessonSectionMotion.transition}
    >
      <LessonSectionHeader
        sectionId={3}
        sectionOrderIdx={sectionOrderIdx}
        totalSections={TOTAL_SECTIONS}
        subtitle="Nhận diện mẫu → quy tắc"
      />

      {unit.grammar ? (
        <div className="space-y-5">
          {/* Grammar card */}
          <div className="border border-border/60 bg-card rounded-2xl p-4 sm:p-6 shadow-md">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📐</span>
              <h2 className="text-lg font-black text-teal-300">{unit.grammar.title}</h2>
            </div>

            {/* Rule box */}
            <div className="bg-muted/40 border border-border/60 rounded-2xl p-4 mb-5 font-mono shadow-inner">
              <p className="text-primary text-sm font-bold">{unit.grammar.rule}</p>
            </div>

            {/* Conjugation table (if provided) */}
            {unit.grammar.conjugation && (
              <div className="mb-5">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-3">
                  Chia động từ
                </p>
                <div className="grid gap-2">
                  {unit.grammar.conjugation.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-card border border-border/60 hover:bg-muted/40 rounded-xl px-4 py-2.5 transition-colors"
                    >
                      <span className="text-muted-foreground text-sm w-20 font-semibold">{row.subject}</span>
                      <span className="text-primary font-bold text-sm w-16">{row.form}</span>
                      <span className="text-foreground text-sm italic flex-1">{row.example}</span>
                      <button
                        onClick={() => playTTS(row.example)}
                        aria-label={`Nghe ví dụ: ${row.example}`}
                        className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors shrink-0"
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Examples */}
            <div className="space-y-3 mb-4">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Ví dụ</p>
              {unit.grammar.examples.map((ex, i) => (
                <div
                  key={i}
                  className="bg-card border border-border/60 hover:bg-muted/40 rounded-xl px-4 py-3 flex items-start justify-between gap-3 transition-colors"
                >
                  <div>
                    <p className="text-white font-semibold text-sm">{ex.en}</p>
                    <p className="text-zinc-400 text-xs mt-0.5">{ex.vn}</p>
                  </div>
                  <button
                    onClick={() => playTTS(ex.en)}
                    aria-label={`Nghe ví dụ: ${ex.en}`}
                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors shrink-0"
                  >
                    <Volume2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Tip */}
            {unit.grammar.tip && (
              <div className="border-l-4 border-primary bg-muted/30 rounded-r-xl p-3 mb-3">
                <p className="text-xs font-bold text-primary mb-1">💡 Mẹo nhớ</p>
                <p className="text-muted-foreground text-sm" style={{ whiteSpace: "pre-wrap" }}>
                  {unit.grammar.tip}
                </p>
              </div>
            )}

            {/* Vietnamese L1 Interference Warning */}
            {unit.grammar.vnNote && (
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-card p-5 shadow-lg transition-all duration-300 hover:border-amber-500/50">
                <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-amber-500 to-orange-600" />
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">
                      Cảnh Báo Lỗi Người Việt (VN Learner Alert)
                    </h4>
                    <p
                      className="mt-1.5 text-xs font-semibold leading-relaxed text-muted-foreground whitespace-pre-wrap"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {unit.grammar.vnNote}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Grammar → Dialogue cross-reference */}
            {unit.grammar.dialogueExample && (
              <div className="mt-4 bg-card border border-border/60 rounded-2xl p-4">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                  🔍 Cấu trúc này xuất hiện trong hội thoại
                </p>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-xs text-primary font-bold mb-1">
                    {unit.grammar.dialogueExample.speaker}:
                  </p>
                  <p className="text-foreground text-sm leading-relaxed">
                    {(() => {
                      const { text, highlight } = unit.grammar!.dialogueExample!;
                      const idx = text.indexOf(highlight);
                      if (idx < 0) return text;
                      return (
                        <>
                          {text.slice(0, idx)}
                          <mark className="bg-violet-500/30 text-violet-200 px-0.5 rounded font-bold not-italic">
                            {highlight}
                          </mark>
                          {text.slice(idx + highlight.length)}
                        </>
                      );
                    })()}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1 italic">
                    {unit.grammar.dialogueExample.translation}
                  </p>
                </div>
              </div>
            )}

            {/* CCQ — Concept Check Question */}
            {unit.grammar.ccq && (
              <div className="mt-5 border-t border-teal-700/30 pt-5">
                <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
                  ✅ Kiểm tra nhanh (CCQ)
                </p>
                <p className="text-white font-semibold text-sm mb-3">
                  {unit.grammar.ccq.question}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {unit.grammar.ccq.options.map((opt) => {
                    const isPicked = ccqAnswer === opt;
                    const isRight = opt === unit.grammar!.ccq!.answer;
                    let cls =
                      "px-3 py-2 rounded-xl text-sm font-medium border text-left ";
                    if (!ccqSubmitted) {
                      cls += isPicked
                        ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20"
                        : "bg-card border-border/60 text-foreground hover:border-primary/60 hover:bg-muted/40";
                    } else {
                      if (isRight) cls += "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                      else if (isPicked) cls += "bg-red-500/10 border-red-500 text-red-400";
                      else cls += "bg-card border-border/60 text-muted-foreground";
                    }
                    return (
                      <motion.button
                        key={opt}
                        disabled={ccqSubmitted}
                        onClick={() => setCcqAnswer(opt)}
                        whileHover={!ccqSubmitted ? { y: -2, border: "1px solid #14b8a6", boxShadow: "0 4px 12px rgba(20, 184, 166, 0.15)" } : {}}
                        whileTap={!ccqSubmitted ? { y: 1, scale: 0.98 } : {}}
                        transition={{ type: "spring", stiffness: 450, damping: 15 }}
                        className={cls}
                      >
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
                {!ccqSubmitted ? (
                  <button
                    disabled={!ccqAnswer}
                    onClick={() => {
                      setCcqSubmitted(true);
                      if (ccqCorrect) playCorrectSound();
                      else playWrongSound();
                    }}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-teal-400 disabled:opacity-40 text-white font-bold rounded-2xl py-2 text-sm transition-all duration-200 active:scale-95"
                  >
                    Kiểm tra
                  </button>
                ) : (
                  <div>
                    <p className={`text-sm font-bold ${ccqCorrect ? "text-emerald-400" : "text-red-400"}`}>
                      {ccqCorrect
                        ? "✓ Chính xác! Bạn đã hiểu cấu trúc ngữ pháp."
                        : `✗ Đáp án đúng: "${unit.grammar.ccq.answer}"`}
                    </p>
                    {unit.grammar.ccq.explanation && (
                      <p className="text-xs text-zinc-400 mt-1.5 italic">
                        {unit.grammar.ccq.explanation}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border border-border/60 bg-card rounded-2xl p-5 sm:p-8 text-center">
          <p className="text-muted-foreground text-sm">Bài học này không có phần ngữ pháp riêng.</p>
        </div>
      )}

      <div className="mt-6">
        <LessonContinueButton
          onClick={goNext}
          disabled={!!(unit.grammar?.ccq && !ccqSubmitted)}
        >
          {unit.grammar?.ccq && !ccqSubmitted ? "Trả lời câu hỏi trước" : "Luyện tập ngay"}
        </LessonContinueButton>
      </div>
    </motion.div>
  );
}

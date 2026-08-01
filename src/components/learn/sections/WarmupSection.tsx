"use client";

import { motion } from "framer-motion";
import { ChevronDown, RefreshCw, Volume2 } from "lucide-react";
import { reviewCard } from "@/app/actions/cards";
import type { UnitData, WarmupCard } from "../UnitTemplate";
import LessonSectionHeader from "../lesson-ui/LessonSectionHeader";
import SituationCard from "../lesson-ui/SituationCard";
import LessonContinueButton from "../lesson-ui/LessonContinueButton";
import { lessonSectionMotion } from "../lesson-ui/motion";
import HowToLearnCard from "../lesson-ui/HowToLearnCard";

interface WarmupSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  playTTS: (text: string) => void;
  warmupCards: WarmupCard[];
  warmupFlipped: Set<number>;
  setWarmupFlipped: React.Dispatch<React.SetStateAction<Set<number>>>;
  warmupDone: boolean;
  setWarmupDone: React.Dispatch<React.SetStateAction<boolean>>;
  goNext: () => void;
}

export default function WarmupSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  playTTS,
  warmupCards,
  warmupFlipped,
  setWarmupFlipped,
  warmupDone,
  setWarmupDone,
  goNext,
}: WarmupSectionProps) {
  return (
    <motion.div
      key="s1"
      initial={lessonSectionMotion.initial}
      animate={lessonSectionMotion.animate}
      exit={lessonSectionMotion.exit}
      transition={lessonSectionMotion.transition}
    >
      <LessonSectionHeader
        sectionId={1}
        sectionOrderIdx={sectionOrderIdx}
        totalSections={TOTAL_SECTIONS}
        subtitle="Nghe và nhận ra mẫu câu chính"
      />

      {warmupCards.length > 0 && !warmupDone && (
        <div className="mb-5 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-400">
            <RefreshCw size={16} /> Ôn nhanh {warmupCards.length} thẻ
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {warmupCards.map((card, index) => {
              const flipped = warmupFlipped.has(index);
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() =>
                    setWarmupFlipped((previous) => {
                      const next = new Set(previous);
                      if (next.has(index)) next.delete(index);
                      else next.add(index);
                      return next;
                    })
                  }
                  className="h-24 w-40 shrink-0 rounded-lg border border-border/60 bg-card p-3 text-center"
                >
                  <span className="block text-sm font-bold text-foreground">
                    {flipped ? card.meaning_vn : card.word}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {flipped ? "Nghĩa tiếng Việt" : card.phonetic}
                  </span>
                </button>
              );
            })}
          </div>
          {warmupFlipped.size === warmupCards.length && (
            <button
              type="button"
              onClick={() => {
                setWarmupDone(true);
                warmupCards.forEach((card) => {
                  void reviewCard(card.id, "Good");
                });
              }}
              className="mt-2 min-h-11 w-full rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 text-sm font-bold text-amber-300"
            >
              Hoàn tất ôn nhanh
            </button>
          )}
        </div>
      )}

      <div className="mb-5">
        <p className="mb-3 text-sm font-semibold text-foreground">
          Nghe từng câu và nhận ra mẫu bạn sắp học.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {unit.warmupGreetings.map((greeting) => (
            <button
              key={`${greeting.en}:${greeting.context}`}
              type="button"
              onClick={() => playTTS(greeting.en)}
              className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-lg border border-border/60 bg-card p-3 text-center transition-colors hover:border-primary/50"
            >
              <span className="text-2xl" aria-hidden>{greeting.emoji}</span>
              <span className="text-sm font-bold leading-snug text-foreground">{greeting.en}</span>
              <span className="text-xs leading-snug text-muted-foreground">{greeting.vn}</span>
              <Volume2 className="size-4 text-primary" aria-hidden />
            </button>
          ))}
        </div>
      </div>

      <details className="group mb-5 border-y border-border/60 py-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold text-muted-foreground">
          Ngữ cảnh và lưu ý cho người Việt
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
        </summary>
        <div className="space-y-5 pt-3">
          <HowToLearnCard />

          {unit.situation && (
            <SituationCard situation={unit.situation} outcomes={unit.learningOutcomes} />
          )}

          {unit.jobScenarios?.map((scenario) => (
            <div key={scenario.id} className="border-l-2 border-primary pl-3 text-sm">
              <p className="font-bold text-foreground">{scenario.title}</p>
              {scenario.context && <p className="mt-1 text-muted-foreground">{scenario.context}</p>}
              {scenario.example && <p className="mt-1 text-emerald-400">{scenario.example}</p>}
            </div>
          ))}

          {unit.grammar?.vnNote && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-muted-foreground">
              <p className="mb-1 font-bold text-red-400">Lưu ý lỗi thường gặp</p>
              <p>{unit.grammar.vnNote}</p>
            </div>
          )}

          {unit.culturalNote && (
            <div className="border-l-2 border-primary pl-3">
              <p className="mb-1 text-sm font-bold text-primary">Ghi chú văn hóa</p>
              <p
                className="text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: unit.culturalNote }}
              />
            </div>
          )}
        </div>
      </details>

      <LessonContinueButton onClick={goNext}>Bắt đầu học</LessonContinueButton>
    </motion.div>
  );
}

import {
  LESSON_BLUEPRINT,
  type ContentBlockId,
} from "@/lib/lessons/lesson-blueprint";
import { IPOR_META, type IporPhase } from "@/lib/lessons/learning-flow";

const IPOR_PHASES: IporPhase[] = ["input", "processing", "output", "review"];

const FULL_STEPS = IPOR_PHASES.map((phase) => {
  const blocks = LESSON_BLUEPRINT.filter(
    (block) => block.phase === phase && block.sectionIds.length > 0,
  );
  const labels: Record<ContentBlockId, string> = {
    meta: "",
    hook: "tình huống",
    warmup: "ôn SRS",
    vocab: "từ vựng",
    grammar: "ngữ pháp",
    exercises_input: "luyện tập",
    dialogues: "hội thoại",
    fluency: "phản xạ",
    output: "dịch → shadowing → nói",
    review: "quiz + ôn tích lũy",
  };
  const text = blocks.map((block) => labels[block.id]).filter(Boolean).join(" → ");
  return { phase, text };
});

const GOLD_DAY_1_STEPS: Array<{ phase: IporPhase; text: string }> = [
  { phase: "input", text: "tình huống → cụm nói → hội thoại" },
  { phase: "processing", text: "nghe chọn → trả lời nhanh" },
  { phase: "output", text: "shadowing → tự nói" },
  { phase: "review", text: "quiz ngắn" },
];

interface HowToLearnCardProps {
  compact?: boolean;
}

export default function HowToLearnCard({ compact = false }: HowToLearnCardProps) {
  const steps = compact ? GOLD_DAY_1_STEPS : FULL_STEPS;

  return (
    <div className="mb-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
      <p className="text-[11px] font-black text-zinc-500 uppercase tracking-wider mb-1">
        Cách học một bài
      </p>
      <p className="text-[10px] text-zinc-600 mb-3">
        {compact
          ? "Bảy bước ngắn, ưu tiên nghe và nói ngay."
          : "Đi theo 4 pha: tiếp nhận → xử lý → sản xuất → ôn tập."}
      </p>
      <ol className="space-y-2.5">
        {steps.map(({ phase, text }, index) => (
          <li key={phase} className="flex items-start gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[11px] font-black text-zinc-400">
              {index + 1}
            </span>
            <div>
              <span className="text-[10px] font-bold text-zinc-600">
                {IPOR_META[phase].labelVi}
              </span>
              <p className="text-zinc-300 leading-snug">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[11px] text-zinc-600 border-t border-zinc-800/80 pt-3">
        Ôn nhanh chỉ dùng khi đã học bài này ít nhất 1 lần.
      </p>
    </div>
  );
}

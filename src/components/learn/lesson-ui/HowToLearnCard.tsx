import { IPOR_META, type IporPhase } from "@/lib/lessons/learning-flow";

const STEPS: { phase: IporPhase; text: string }[] = [
  { phase: "input", text: "Hiểu tình huống → học từ → nghe hội thoại" },
  { phase: "processing", text: "Nắm ngữ pháp → làm bài (nhớ chủ động, không chỉ đọc)" },
  { phase: "output", text: "Dịch câu → shadowing → nói (bắt buộc mở mic)" },
  { phase: "review", text: "Quiz + flashcards SRS ngày hôm sau" },
];

export default function HowToLearnCard() {
  return (
    <div className="mb-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4">
      <p className="text-[11px] font-black text-zinc-500 uppercase tracking-wider mb-3">
        Cách học 1 bài (~30 phút)
      </p>
      <ol className="space-y-2.5">
        {STEPS.map(({ phase, text }, i) => (
          <li key={phase} className="flex items-start gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[11px] font-black text-zinc-400">
              {i + 1}
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
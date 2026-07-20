import LessonCard from "./LessonCard";

interface SituationCardProps {
  situation: string;
  outcomes?: string[];
}

export default function SituationCard({ situation, outcomes }: SituationCardProps) {
  return (
    <LessonCard variant="highlight" className="mb-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex size-8 items-center justify-center rounded-xl bg-sky-500/15 text-base">
            📍
          </span>
          <span className="text-[11px] font-black text-sky-400 uppercase tracking-widest">
            Tình huống thực tế
          </span>
        </div>
        <p className="text-white text-lg sm:text-xl leading-relaxed font-semibold mb-4">
          {situation}
        </p>
        {outcomes && outcomes.length > 0 && (
          <ul className="space-y-2">
            {outcomes.map((o, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-sm text-zinc-400 bg-black/20 rounded-xl px-3 py-2.5"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </LessonCard>
  );
}
import { cn } from "@/lib/utils";

export type ChipTone = "brand" | "neutral" | "success" | "warn";

const TONE: Record<ChipTone, string> = {
  brand: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
  neutral: "border-white/10 bg-white/5 text-zinc-300",
  success: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  warn: "border-amber-500/30 bg-amber-500/15 text-amber-300",
};

export interface ChipProps {
  children: React.ReactNode;
  tone?: ChipTone;
  className?: string;
}

/** Compact label / badge (level, v2, SRS count). */
export function Chip({ children, tone = "brand", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        TONE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

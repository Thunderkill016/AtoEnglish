import { cn } from "@/lib/utils";

interface ThinProgressProps {
  value: number;
  className?: string;
  label?: string;
}

/** Single-line progress — replaces multi-color IPOR bar on home */
export function ThinProgress({ value, className, label }: ThinProgressProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1.5", className)}>
      {(label || pct > 0) && (
        <div className="flex justify-between text-[var(--minimal-caption-size)] text-muted-foreground font-medium">
          <span>{label ?? "Tiến trình"}</span>
          <span className="tabular-nums text-foreground font-semibold">{pct}%</span>
        </div>
      )}
      <div
        className="h-1 w-full rounded-full bg-muted overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
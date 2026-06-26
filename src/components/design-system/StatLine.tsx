import { cn } from "@/lib/utils";

interface StatLineProps {
  label: string;
  value: string;
  caption?: string;
  className?: string;
}

/** One-line stat — replaces gradient stat cards on daily path (V2) */
export function StatLine({ label, value, caption, className }: StatLineProps) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-3 border-b border-border/50 last:border-0",
        className
      )}
    >
      <span className="text-[var(--minimal-body-size)] text-muted-foreground font-medium">
        {label}
      </span>
      <div className="text-right">
        <span className="text-[var(--minimal-body-size)] font-bold text-foreground">
          {value}
        </span>
        {caption && (
          <p className="text-[var(--minimal-caption-size)] text-muted-foreground mt-0.5">
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
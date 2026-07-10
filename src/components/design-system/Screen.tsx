import { cn } from "@/lib/utils";
import { ATO_AMBIENT } from "@/lib/ui/ato-surface";

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  /** Max content width — default 680px (optimal reading line-length) */
  narrow?: boolean;
  /**
   * Ato Surface canvas: zinc-950 + optional emerald ambient glow.
   * Default false keeps legacy minimal canvas for older screens.
   */
  ato?: boolean;
  ambient?: boolean;
}

/** Full-height screen container — optional Ato Surface mode (TASK-260). */
export function Screen({
  children,
  className,
  narrow = true,
  ato = false,
  ambient = false,
}: ScreenProps) {
  return (
    <div
      className={cn(
        "relative min-h-[calc(100dvh-4rem)] overflow-x-hidden",
        ato
          ? "bg-zinc-950"
          : "bg-[var(--minimal-canvas)] dark:bg-[var(--minimal-canvas-dark)]",
        className,
      )}
    >
      {ato && ambient ? <div className={ATO_AMBIENT} aria-hidden /> : null}
      <div
        className={cn(
          // Content rhythm; (main)/layout.tsx already has pb-16 for fixed BottomNav
          "mx-auto w-full px-4 pb-10 pt-6 sm:px-6 sm:pb-10",
          narrow && "max-w-[var(--minimal-content-max)]",
        )}
      >
        {children}
      </div>
    </div>
  );
}
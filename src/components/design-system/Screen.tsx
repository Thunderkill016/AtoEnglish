import { cn } from "@/lib/utils";
import { ATO_AMBIENT } from "@/lib/ui/ato-surface";

interface ScreenProps {
  children: React.ReactNode;
  className?: string;
  /** Max content width — default product reading width */
  narrow?: boolean;
  /**
   * @deprecated Prefer default canvas (shadcn bg-background). Kept for call-site compat.
   * When true (default), uses semantic background.
   */
  ato?: boolean;
  ambient?: boolean;
}

/**
 * Product page frame — shadcn semantic canvas (`bg-background`).
 * Legacy props `ato` / `ambient` retained so existing screens keep compiling.
 */
export function Screen({
  children,
  className,
  narrow = true,
  ato: _ato = true,
  ambient = false,
}: ScreenProps) {
  return (
    <div
      className={cn(
        "relative min-h-[calc(100dvh-4rem)] overflow-x-hidden bg-background text-foreground",
        className,
      )}
    >
      {ambient ? <div className={ATO_AMBIENT} aria-hidden /> : null}
      <div
        className={cn(
          "mx-auto w-full px-4 pb-10 pt-6 sm:px-6 sm:pb-10",
          narrow && "max-w-[var(--minimal-content-max)]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

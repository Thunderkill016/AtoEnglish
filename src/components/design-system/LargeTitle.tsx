import { cn } from "@/lib/utils";

interface LargeTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

/** Apple-style large title — typography carries hierarchy, not color boxes */
export function LargeTitle({ children, subtitle, className }: LargeTitleProps) {
  return (
    <header className={cn("mb-6", className)}>
      <h1 className="text-[var(--minimal-title-size)] font-bold tracking-tight text-foreground leading-tight">
        {children}
      </h1>
      {subtitle && (
        <p className="mt-1 text-[var(--minimal-caption-size)] text-muted-foreground font-medium">
          {subtitle}
        </p>
      )}
    </header>
  );
}
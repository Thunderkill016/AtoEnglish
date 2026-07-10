import { cn } from "@/lib/utils";
import { ATO_EYEBROW } from "@/lib/ui/ato-surface";

export interface PageHeaderProps {
  /** Small uppercase label above title */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Consistent page title block (Home / hub screens). */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-2 min-w-0">
        {eyebrow ? <p className={ATO_EYEBROW}>{eyebrow}</p> : null}
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1 sm:pt-0">{action}</div> : null}
    </header>
  );
}

import { cn } from "@/lib/utils";
import { ATO_EYEBROW } from "@/lib/ui/ato-surface";

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

/** Page title block — semantic foreground colors (shadcn tokens). */
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
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? <p className={ATO_EYEBROW}>{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 pt-1 sm:pt-0">{action}</div> : null}
    </header>
  );
}

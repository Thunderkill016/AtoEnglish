import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MinimalButton } from "./MinimalButton";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center py-10 px-4 space-y-4",
        className
      )}
    >
      {Icon && (
        <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <Icon className="size-7" strokeWidth={1.75} />
        </span>
      )}
      <div className="space-y-1.5 max-w-sm">
        <p className="text-[var(--minimal-headline-size)] font-bold text-foreground">
          {title}
        </p>
        {description && (
          <p className="text-[var(--minimal-body-size)] text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <MinimalButton href={actionHref} onClick={onAction} variant="secondary">
          {actionLabel}
        </MinimalButton>
      )}
      {actionLabel && !actionHref && onAction && (
        <MinimalButton onClick={onAction} variant="secondary">
          {actionLabel}
        </MinimalButton>
      )}
    </div>
  );
}
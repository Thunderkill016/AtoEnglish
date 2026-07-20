import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Page({
  children,
  className,
  narrow = true,
}: {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-[calc(100dvh-3.5rem)] bg-background text-foreground",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto w-full px-4 py-6 pb-24 sm:px-6 sm:py-8",
          narrow ? "max-w-lg" : "max-w-2xl",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
  className,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
          {title || "AtoEnglish"}
        </h1>
        {description ? (
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Section({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mb-8 space-y-3", className)}>
      {title ? (
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}

export function ListRow({
  href,
  label,
  description,
  icon: Icon,
  className,
}: {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-12 items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 transition-colors hover:bg-muted/50",
        className,
      )}
    >
      {Icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {description ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
      <span className="text-muted-foreground" aria-hidden>
        →
      </span>
    </Link>
  );
}

export function StatLine({
  label,
  value,
  caption,
  className,
}: {
  label: string;
  value: string | number;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card px-3 py-3",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums">{value}</p>
      {caption ? (
        <p className="mt-0.5 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryRowProps {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

/** Grouped-list row — secondary navigation, not primary CTA */
export function PrimaryRow({ href, label, description, icon: Icon, className }: PrimaryRowProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-[var(--minimal-touch)] items-center gap-3 rounded-xl px-4 py-3",
        "bg-card border border-border/60 transition-colors duration-150",
        "hover:bg-muted/50 active:scale-[0.99]",
        className
      )}
    >
      {Icon && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" strokeWidth={2} />
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className="block text-[var(--minimal-body-size)] font-semibold text-foreground">
          {label}
        </span>
        {description && (
          <span className="block text-[var(--minimal-caption-size)] text-muted-foreground mt-0.5 truncate">
            {description}
          </span>
        )}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
    </Link>
  );
}
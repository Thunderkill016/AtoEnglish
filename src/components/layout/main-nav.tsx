"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import { desktopPrimaryNav, desktopMoreItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type MainNavRowProps = {
  moreOpen: boolean;
  onMoreOpenChange: (open: boolean) => void;
};

/**
 * Desktop primary nav row: Trang chủ · Học · Luyện · Ôn · Thêm
 */
export function MainNavRow({ moreOpen, onMoreOpenChange }: MainNavRowProps) {
  const pathname = usePathname();

  const isMoreActive = desktopMoreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <nav className="hidden items-center gap-0.5 md:flex" aria-label="Điều hướng chính">
      {desktopPrimaryNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {item.title}
          </Link>
        );
      })}

      <button
        type="button"
        onClick={() => onMoreOpenChange(!moreOpen)}
        aria-expanded={moreOpen}
        aria-controls="nav-more-panel"
        aria-haspopup="true"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
          isMoreActive || moreOpen
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        Thêm
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            moreOpen ? "rotate-180" : ""
          )}
        />
      </button>
    </nav>
  );
}

type MainNavMorePanelProps = {
  open: boolean;
  onNavigate: () => void;
};

/**
 * Inline expansion below the header row — grows the header card instead of
 * floating over page content.
 */
export function MainNavMorePanel({ open, onNavigate }: MainNavMorePanelProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div
      id="nav-more-panel"
      role="menu"
      className="hidden border-t border-zinc-200/60 dark:border-zinc-800/60 px-3 py-2.5 sm:px-4 md:grid md:grid-cols-2 lg:grid-cols-5 md:gap-1 animate-in fade-in-0 slide-in-from-top-1 duration-150"
    >
      {desktopMoreItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            role="menuitem"
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors duration-100",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            <div className="min-w-0">
              <p className="font-medium leading-tight">{item.title}</p>
              {item.description && (
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5 truncate">
                  {item.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}


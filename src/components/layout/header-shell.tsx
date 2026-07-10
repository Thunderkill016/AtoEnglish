"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sprout } from "lucide-react";

import { MainNavRow } from "@/components/layout/main-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AppButton } from "@/components/design-system";
import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";
import { signOut } from "@/app/actions/auth";
import { ATO_FOCUS } from "@/lib/ui/ato-surface";
import { cn } from "@/lib/utils";

type HeaderShellProps = {
  user: { id: string } | null;
  avatarUrl?: string;
  fullName?: string;
};

/** Ato Surface header — glass bar, brand mark, desktop tabs, auth */
export function HeaderShell({ user, fullName }: HeaderShellProps) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-white/10",
        "bg-zinc-950/85 backdrop-blur-xl",
        "shadow-[0_4px_24px_-8px_rgba(0,0,0,0.45)]",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[var(--minimal-content-max)] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href="/dashboard"
            className={cn("flex shrink-0 items-center gap-2 rounded-xl", ATO_FOCUS)}
          >
            <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-zinc-950 shadow-md shadow-emerald-900/30">
              <Sprout className="size-4" strokeWidth={2.4} />
            </span>
            <span className="hidden text-sm font-black tracking-tight text-zinc-50 sm:inline">
              AtoEnglish
            </span>
          </Link>
          <MainNavRow />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {fullName && (
                <span className="hidden max-w-[120px] truncate text-xs font-medium text-zinc-400 md:inline">
                  {fullName}
                </span>
              )}
              <form action={signOut}>
                <button
                  type="submit"
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl text-zinc-400 transition-colors",
                    "hover:bg-white/5 hover:text-zinc-100",
                    ATO_FOCUS,
                  )}
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="size-4" />
                </button>
              </form>
            </>
          ) : (
            <AppButton href="/login?mode=login" variant="secondary" size="sm" className="!min-h-9">
              Đăng nhập
            </AppButton>
          )}
        </div>
      </div>
    </header>
  );
}

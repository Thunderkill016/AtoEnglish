"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sprout } from "lucide-react";

import { MainNavRow } from "@/components/layout/main-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";
import { getPrimaryLearnHref } from "@/lib/constants/navigation";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

type HeaderShellProps = {
  user: { id: string } | null;
  avatarUrl?: string;
  fullName?: string;
};

/** Product header — shadcn tokens + primary learn href */
export function HeaderShell({ user, fullName }: HeaderShellProps) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;

  const homeHref = getPrimaryLearnHref();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/80",
        "bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75",
      )}
    >
      <div className="mx-auto flex h-14 max-w-[var(--minimal-content-max)] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={homeHref}
            className="flex shrink-0 items-center gap-2 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sprout className="size-4" strokeWidth={2.4} />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
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
                <span className="hidden max-w-[120px] truncate text-xs font-medium text-muted-foreground md:inline">
                  {fullName}
                </span>
              )}
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="size-4" />
                </Button>
              </form>
            </>
          ) : (
            <Link
              href="/login?mode=login"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

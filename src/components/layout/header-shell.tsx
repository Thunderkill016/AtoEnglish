"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
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

export function HeaderShell({ user, fullName }: HeaderShellProps) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link
            href={getPrimaryLearnHref()}
            className="text-sm font-semibold tracking-tight text-foreground"
          >
            AtoEnglish
          </Link>
          <MainNavRow />
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <>
              {fullName ? (
                <span className="hidden max-w-[100px] truncate text-xs text-muted-foreground md:inline">
                  {fullName}
                </span>
              ) : null}
              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
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

import Link from "next/link";
import { Sprout } from "lucide-react";

import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sprout className="size-5" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-base font-semibold tracking-tight">
                AtoEnglish
              </span>
              <span className="text-[11px] text-muted-foreground">
                Grow every day
              </span>
            </div>
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
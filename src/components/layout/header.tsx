import Link from "next/link";
import { Sprout } from "lucide-react";

import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <div className="sticky top-0 z-40 w-full max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8">
      <header className="w-full rounded-2xl border border-glass bg-glass shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none h-14 flex items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-300">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm animate-float">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight">
                AtoEnglish
              </span>
              <span className="text-[9px] text-muted-foreground font-medium">
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
      </header>
    </div>
  );
}
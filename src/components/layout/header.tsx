import Link from "next/link";
import { Sprout, LogOut, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

import { MainNav } from "@/components/layout/main-nav";
import { UserAvatar } from "@/components/layout/user-avatar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth";
import { NotificationCenterWrapper } from "@/components/layout/notification-center-wrapper";


export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0];

  return (
    <div className="sticky top-0 z-50 w-full max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8 overflow-visible">
      <header className="w-full overflow-visible rounded-2xl border border-glass bg-glass shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none h-14 flex items-center justify-between gap-4 px-4 sm:px-6 transition-all duration-300">
        <div className="flex items-center gap-6">
          <Link
            href="/"
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

        <div className="flex items-center gap-1.5">
          <ThemeToggle />

          {/* Notification Center — in-app history bell */}
          {user && <NotificationCenterWrapper />}

          {user ? (
            <div className="flex items-center gap-2.5 ml-1 sm:ml-2">
              <div className="hidden sm:flex items-center gap-2 border-r border-zinc-100 dark:border-zinc-800/50 pr-3 h-8">
                <UserAvatar avatarUrl={avatarUrl} fullName={fullName} className="size-7" />
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">
                  {fullName}
                </span>
              </div>

              <Link
                href="/settings"
                className="inline-flex items-center justify-center size-8 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Cài đặt"
                aria-label="Cài đặt"
              >
                <Settings className="size-4" />
              </Link>

              <form action={signOut}>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="size-4" />
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login?mode=login" className="ml-1">
              <Button
                variant="outline"
                className="text-xs font-semibold h-9 px-3.5 rounded-xl border-zinc-200 bg-zinc-50/10 hover:bg-zinc-50 dark:border-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800/50 transition-all"
              >
                Đăng nhập
              </Button>
            </Link>
          )}

          <MobileNav />
        </div>
      </header>
    </div>
  );
}
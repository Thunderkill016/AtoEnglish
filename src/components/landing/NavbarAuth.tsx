"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { checkHasSession } from "@/lib/auth-check";

export default function NavbarAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkHasSession());
  }, []);

  return (
    <div className="flex items-center gap-3">
      {isLoggedIn ? (
        <Link href="/dashboard" prefetch={false}>
          <Button className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-bold h-9 px-5 rounded-xl active:scale-[0.96] transition-all duration-200 shadow-sm shadow-emerald-600/10 dark:shadow-emerald-500/5">
            Vào Dashboard
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/login" prefetch={false} className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-350 hover:text-zinc-950 dark:hover:text-zinc-50 h-9 px-4 rounded-xl transition-colors duration-200"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/login" prefetch={false}>
            <Button className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-sm font-bold h-9 px-5 rounded-xl active:scale-[0.96] transition-all duration-200 shadow-sm shadow-emerald-600/10 dark:shadow-emerald-500/5">
              Bắt đầu học ngay
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}

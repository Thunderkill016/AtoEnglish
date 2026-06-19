"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkHasSession } from "@/lib/auth-check";

export default function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkHasSession());
  }, []);

  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in-up animation-delay-225 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4 w-full">
      <Link
        href={isLoggedIn ? "/dashboard" : "/login"}
        prefetch={false}
        className="w-full sm:w-auto"
      >
        <Button className="w-full sm:w-auto sm:min-w-[220px] justify-center bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-emerald-600/15 dark:shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.97] transition-all duration-300 gap-2">
          {isLoggedIn ? "Vào Dashboard" : "Bắt đầu học ngay"}
          <ArrowRight className="size-4.5" />
        </Button>
      </Link>
      <Button
        variant="outline"
        onClick={handleScrollToHowItWorks}
        className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800/80 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/30 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-50 font-bold h-14 px-8 rounded-2xl gap-1.5 active:scale-[0.97] transition-all duration-300"
      >
        <span>Xem cách học</span>
        <ChevronRight className="size-4.5" />
      </Button>
    </div>
  );
}

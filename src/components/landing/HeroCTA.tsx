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
    <div className="animate-fade-in-up animation-delay-225 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full">
      <Link
        href={isLoggedIn ? "/dashboard" : "/login"}
        className="w-full sm:w-auto"
      >
        <Button className="w-full sm:w-auto sm:min-w-[220px] justify-center bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold h-[52px] px-9 rounded-full text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2">
          {isLoggedIn ? "Vào Dashboard" : "Bắt đầu miễn phí"}
          <ArrowRight className="size-4" />
        </Button>
      </Link>
      <Button
        variant="outline"
        onClick={handleScrollToHowItWorks}
        className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold h-[52px] px-8 rounded-full text-base gap-1.5 transition-all duration-200"
      >
        <span>Xem cách học</span>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

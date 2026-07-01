"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkHasSession } from "@/lib/auth-check";

const QUICK_STATS = [
  { icon: "🔥", text: "2,400+ học viên active" },
  { icon: "📚", text: "50 bài học A0 → B2" },
  { icon: "⭐", text: "4.9/5 đánh giá" },
  { icon: "🎁", text: "Miễn phí 100%" },
];

export default function HeroCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(checkHasSession());
  }, []);

  const handleScrollToHowItWorks = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="animate-fade-in-up animation-delay-225 flex flex-col items-center gap-4 pt-4 w-full">
      {/* CTA Buttons — vibrant pre-minimal: gradient primary "Học thử ngay" direct to /learn for guest self-study */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
        <Link
          href={isLoggedIn ? "/dashboard" : "/learn"}
          prefetch={false}
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto sm:min-w-[220px] justify-center bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-400 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/15 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2">
            {isLoggedIn ? "Vào Dashboard" : "Học thử ngay"}
            <ArrowRight className="size-4.5" />
          </Button>
        </Link>
        <Link
          href="/login"
          prefetch={false}
          className="w-full sm:w-auto"
        >
          <Button
            variant="outline"
            className="w-full sm:w-auto border-zinc-200 dark:border-white/15 bg-white/5 dark:bg-white/5 backdrop-blur-md hover:bg-white/10 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white font-bold h-14 px-8 rounded-2xl gap-1.5 active:scale-[0.97] transition-all duration-300"
          >
            <span>Đăng nhập</span>
            <ChevronRight className="size-4.5" />
          </Button>
        </Link>
      </div>

      {/* Social proof microstats */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {QUICK_STATS.map((stat) => (
          <div
            key={stat.text}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-white/8 text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            <span>{stat.icon}</span>
            <span>{stat.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


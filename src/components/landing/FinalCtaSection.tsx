"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { checkHasSession } from "@/lib/auth-check";

export default function FinalCtaSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(checkHasSession());
  }, []);

  return (
    <section className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/20 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 dark:from-emerald-700 dark:via-emerald-700 dark:to-teal-700 px-6 py-14 sm:p-16 md:p-20 text-center space-y-8 shadow-2xl shadow-emerald-600/20">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[60%] h-[120%] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[50%] h-[100%] rounded-full bg-teal-400/20 blur-3xl" />
          </div>

          <ScrollReveal className="relative space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Open Beta — Miễn phí 100%
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Sẵn sàng nói tiếng Anh tự tin hơn?
            </h2>
            <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed max-w-lg mx-auto">
              Đăng nhập Google, chọn level và bắt đầu bài đầu tiên trong vài phút. Không cần thẻ tín dụng.
            </p>
          </ScrollReveal>

          <ScrollReveal delayMs={100} className="relative flex flex-col items-center gap-4">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              prefetch={false}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto sm:min-w-[280px] justify-center bg-white hover:bg-emerald-50 text-emerald-800 font-bold h-14 px-10 rounded-2xl shadow-lg shadow-black/10 hover:scale-[1.01] active:scale-[0.97] transition-all duration-300 gap-2.5">
                {isLoggedIn ? "Vào Trang chủ" : "Bắt đầu học ngay"}
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <p className="text-xs text-emerald-100/80 font-medium">
              Đăng ký nhanh qua Google · Học trên mọi thiết bị
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ui/scroll-reveal";
import { checkHasSession } from "@/lib/auth-check";

export default function FinalCtaSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(checkHasSession());
  }, []);

  return (
    <section className="relative py-24 sm:py-32 lg:py-40 px-5 sm:px-8 overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200/50 dark:border-zinc-800/40 bg-gradient-to-br from-zinc-50/60 to-white dark:from-zinc-900/15 dark:to-zinc-950/20 backdrop-blur-md px-6 py-16 sm:p-16 md:p-20 text-center space-y-8 sm:space-y-10 shadow-xl shadow-zinc-900/[0.02] dark:shadow-black/10">
          {/* Inner mesh gradients */}
          <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
            <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/4 blur-[60px]" />
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/5 dark:bg-teal-500/3 blur-[60px]" />
          </div>

          <ScrollReveal className="space-y-4">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-normal">
              Sẵn sàng bắt đầu hành trình nói tiếng Anh tự tin?
            </h2>
            <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-350 leading-relaxed max-w-lg mx-auto font-normal">
              Học miễn phí ngay hôm nay. Không cần thẻ tín dụng.
            </p>
          </ScrollReveal>

          {/* Social proof */}
          <ScrollReveal delayClass="delay-75">
            <div className="flex flex-col items-center gap-3">
              {/* Avatar stack */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2.5">
                  {["bg-emerald-500", "bg-teal-500", "bg-blue-500", "bg-violet-500", "bg-amber-500"].map((color, i) => (
                    <div
                      key={i}
                      className={`size-8 rounded-full ${color} border-2 border-white dark:border-zinc-950 flex items-center justify-center text-white text-[10px] font-black shadow-sm`}
                    >
                      {["N", "L", "T", "H", "M"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  +200 người đang học trong Open Beta
                </span>
              </div>
              {/* Short testimonial */}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 italic max-w-sm text-center leading-relaxed">
                &ldquo;Sau 2 tuần học, tôi đã có thể tự tin nói chuyện cơ bản với người nước ngoài mà không cần dịch nhẩm.&rdquo;
                <span className="not-italic font-bold text-zinc-600 dark:text-zinc-300 ml-1">— Nguyễn Lan, HCM</span>
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delayClass="delay-100" className="flex flex-col items-center gap-4">
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              prefetch={false}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto sm:min-w-[280px] justify-center bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold h-14 px-10 rounded-2xl shadow-lg shadow-emerald-600/15 dark:shadow-emerald-500/10 hover:shadow-emerald-500/25 hover:scale-[1.01] active:scale-[0.97] transition-all duration-300 gap-2.5">
                {isLoggedIn
                  ? "Vào Dashboard ngay"
                  : "Bắt đầu học ngay"}
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase">
              Đăng ký nhanh qua Google • Học miễn phí hoàn toàn
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

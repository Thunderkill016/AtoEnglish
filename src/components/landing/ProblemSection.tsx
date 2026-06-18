"use client";

import { MessageSquareOff } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function ProblemSection() {
  return (
    <section className="bg-zinc-50 dark:bg-zinc-900/10 border-y border-zinc-200/50 dark:border-zinc-800/50 py-24 sm:py-32 px-5 sm:px-8">
      <ScrollReveal className="max-w-3xl mx-auto text-center space-y-8">
        <div className="flex justify-center animate-float-slow">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 shadow-inner">
            <MessageSquareOff className="size-6" />
          </span>
        </div>

        <h2 className="text-[2rem] sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight max-w-3xl mx-auto">
          Bạn đã học nhiều năm nhưng vẫn ngại nói?
        </h2>

        <div className="space-y-6 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
          <p>
            Hàng trăm giờ học ngữ pháp, thuộc hàng nghìn từ vựng…
            <br />
            nhưng khi cần mở miệng giao tiếp thật thì lại im lặng.
          </p>
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            Bạn không thiếu kiến thức.
            <br />
            Bạn thiếu môi trường để luyện nói một cách an toàn và có hệ thống.
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 font-bold">
            AtoEnglish được xây dựng để giải quyết đúng vấn đề này.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

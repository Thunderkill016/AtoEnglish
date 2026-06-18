"use client";

import { LazyMotion, m } from "framer-motion";
import { MessageSquareOff } from "lucide-react";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export default function ProblemSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={staggerContainer}
        className="bg-zinc-50 dark:bg-zinc-900/10 border-y border-zinc-200/50 dark:border-zinc-800/50 py-24 sm:py-32 px-5 sm:px-8"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <m.div 
            variants={fadeInUp}
            className="flex justify-center animate-float-slow"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 shadow-inner">
              <MessageSquareOff className="size-6" />
            </span>
          </m.div>

          <m.h2
            variants={fadeInUp}
            className="text-[2rem] sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight max-w-3xl mx-auto"
          >
            Bạn đã học nhiều năm nhưng vẫn ngại nói?
          </m.h2>

          <m.div
            variants={fadeInUp}
            className="space-y-6 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
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
          </m.div>
        </div>
      </m.section>
    </LazyMotion>
  );
}

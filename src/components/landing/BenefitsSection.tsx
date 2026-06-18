"use client";

import { LazyMotion, m } from "framer-motion";
import { Zap, Target, Mic } from "lucide-react";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export default function BenefitsSection() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const cardReveal = {
    hidden: { opacity: 0, y: 8, scale: 0.995 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const benefits = [
    {
      icon: Zap,
      title: "Giảm nỗi sợ khi nói",
      desc: "Được luyện nói ngay từ những ngày đầu tiên, thay vì phải chờ đến khi “giỏi” rồi mới dám mở miệng.",
    },
    {
      icon: Target,
      title: "Nhớ lâu, dùng được ngay",
      desc: "Hệ thống ôn tập thông minh giúp kiến thức thực sự ở lại, và bạn có thể sử dụng khi cần giao tiếp.",
    },
    {
      icon: Mic,
      title: "Luyện nói thực tế ngay trong app",
      desc: "Shadowing và Roleplay giúp bạn tập phản xạ như đang nói chuyện thật, thay vì chỉ học lý thuyết.",
    },
  ];

  return (
    <LazyMotion features={loadFeatures} strict>
      <section className="bg-zinc-50 dark:bg-zinc-900/30 py-20 sm:py-28 lg:py-36 px-5 sm:px-8 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Header */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Bạn sẽ thay đổi như thế nào
            </h2>
          </m.div>

          {/* Benefit Cards Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <m.div
                  key={index}
                  variants={cardReveal}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <BenefitIcon className="size-6" strokeWidth={2} />
                  </span>
                  <div className="space-y-3 text-left">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                      {benefit.desc}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}

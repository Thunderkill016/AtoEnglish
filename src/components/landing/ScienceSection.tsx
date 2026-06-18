"use client";

import { LazyMotion, m } from "framer-motion";
import { Cpu, Users, Sparkles } from "lucide-react";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export default function ScienceSection() {
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

  return (
    <LazyMotion features={loadFeatures} strict>
      <section className="py-20 sm:py-28 lg:py-36 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Header */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight max-w-2xl mx-auto">
              Được xây dựng dựa trên khoa học, dành riêng cho người Việt
            </h2>
          </m.div>

          {/* Pillars Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Pillar 1 */}
            <m.div
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="size-6" strokeWidth={2} />
              </span>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  Phương pháp IPOR & FSRS
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  Phương pháp học IPOR (Input → Processing → Output → Review) kết hợp FSRS (hệ thống ôn tập thông minh) — được chứng minh hiệu quả trong việc học ngôn ngữ.
                </p>
              </div>
            </m.div>

            {/* Pillar 2 */}
            <m.div
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Users className="size-6" strokeWidth={2} />
              </span>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  Dành riêng cho người Việt
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  Được thiết kế dành riêng cho người Việt bắt đầu từ con số 0, đặc biệt là những người từng học nhiều nhưng vẫn ngại nói.
                </p>
              </div>
            </m.div>

            {/* Pillar 3 */}
            <m.div
              variants={cardReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="size-6" strokeWidth={2} />
              </span>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  Đồng hành cùng phát triển
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  Hiện đang trong giai đoạn phát triển cùng những người dùng đầu tiên.
                </p>
              </div>
            </m.div>
          </div>

          {/* Honest bottom quote */}
          <m.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="text-center text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 max-w-2xl mx-auto leading-relaxed font-normal italic"
          >
            Chúng tôi đang xây dựng AtoEnglish cùng với những người học đầu tiên. Phản hồi của bạn sẽ giúp chúng tôi cải thiện sản phẩm tốt hơn.
          </m.p>
        </div>
      </section>
    </LazyMotion>
  );
}

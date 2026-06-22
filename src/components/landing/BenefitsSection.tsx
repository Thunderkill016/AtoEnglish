
import { Zap, Clock, Wallet } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Zap,
      title: "Phản xạ nói tự nhiên",
      desc: "Luyện nói chủ động giúp bạn bật ra câu trả lời lập tức, hoàn toàn loại bỏ thói quen dịch nhẩm ngữ pháp từ tiếng Việt sang tiếng Anh trong đầu.",
    },
    {
      icon: Clock,
      title: "15 phút mỗi ngày để giữ nhịp",
      desc: "Bài học ngắn giúp bạn duy trì thói quen. Để lên IELTS 6.5, hệ thống vẫn yêu cầu nhiều giờ tích lũy, review và checkpoint đủ 4 kỹ năng.",
    },
    {
      icon: Wallet,
      title: "Tự học có kiểm soát",
      desc: "Bạn luyện nói và viết trong môi trường riêng tư, có phản hồi tiếng Việt ngắn gọn, thay vì phải tự đoán lỗi hoặc học lan man.",
    },
  ];

  const delayMs = [0, 100, 200];

  return (
    <section className="bg-gradient-to-b from-zinc-50/20 to-zinc-50/50 dark:from-zinc-900/10 dark:to-zinc-950/20 py-24 sm:py-32 lg:py-40 px-5 sm:px-8 border-y border-zinc-200/40 dark:border-zinc-800/40 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/1 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-normal">
            Bạn sẽ thay đổi như thế nào?
          </h2>
        </ScrollReveal>

        {/* Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => {
            const BenefitIcon = benefit.icon;
            return (
              <ScrollReveal
                key={index}
                delayMs={delayMs[index]}
                className="flex"
              >
                <div
                  className="group relative overflow-hidden z-0 flex flex-col items-start p-5 sm:p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm hover:shadow-xl hover:shadow-zinc-900/[0.03] dark:hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300 space-y-4 sm:space-y-6 w-full"
                >
                  {/* CSS-only Glowing Border Gradient */}
                  <div className="absolute -inset-px rounded-[2rem] bg-gradient-to-r from-emerald-500/25 to-teal-500/25 dark:from-emerald-500/35 dark:to-teal-500/35 opacity-0 group-hover:opacity-100 blur-[3px] transition duration-500 -z-10" />
                  <div className="absolute inset-0 rounded-[2rem] bg-white/95 dark:bg-zinc-950/95 -z-10 transition-colors duration-300" />

                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50 dark:border-emerald-800/20 shadow-sm">
                    <BenefitIcon className="size-6" strokeWidth={2.2} />
                  </span>
                  <div className="space-y-3.5 text-left flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-normal">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal flex-1">
                      {benefit.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

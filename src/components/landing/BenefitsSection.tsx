import { Zap, Clock, Wallet } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const benefits = [
  {
    icon: Zap,
    number: "01",
    title: "Phản xạ nói tự nhiên",
    desc: "Luyện nói chủ động giúp bạn bật ra câu trả lời lập tức, loại bỏ hoàn toàn thói quen dịch nhẩm từ tiếng Việt sang tiếng Anh trong đầu.",
  },
  {
    icon: Clock,
    number: "02",
    title: "15 phút mỗi ngày là đủ",
    desc: "Lộ trình học ngắn gọn, tối ưu trên mọi thiết bị di động giúp bạn duy trì thói quen học bền bỉ hàng ngày mà không bị quá tải.",
  },
  {
    icon: Wallet,
    number: "03",
    title: "Chi phí tối giản",
    desc: "Trải nghiệm luyện nói giao tiếp phản xạ chất lượng cao với mức học phí tối giản nhất — miễn phí hoàn toàn trong Open Beta.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 px-5 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] rounded-full bg-emerald-500/4 dark:bg-emerald-500/2 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        {/* Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-normal">
            Bạn sẽ thay đổi như thế nào?
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
            Sau mỗi ngày 15 phút với AtoEnglish.
          </p>
        </ScrollReveal>

        {/* Benefits — typography-first, no card borders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <ScrollReveal key={idx} delayMs={idx * 120}>
                <div className="flex flex-col gap-5">
                  {/* Large decorative number */}
                  <span className="text-6xl sm:text-7xl font-black text-zinc-100 dark:text-zinc-800/80 leading-none select-none">
                    {b.number}
                  </span>

                  {/* Icon */}
                  <div className="flex items-center gap-3 -mt-2">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/20 shadow-sm">
                      <Icon className="size-5" strokeWidth={2.2} />
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-emerald-200/60 to-transparent dark:from-emerald-800/40 dark:to-transparent" />
                  </div>

                  {/* Text */}
                  <div className="space-y-2.5">
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                      {b.desc}
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

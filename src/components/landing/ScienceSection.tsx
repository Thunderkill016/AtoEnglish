"use client";

import { Cpu, Users, Brain } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function ScienceSection() {
  const delays = ["", "delay-100", "delay-200"];

  return (
    <section className="py-24 sm:py-32 lg:py-40 px-5 sm:px-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[30%] left-[10%] w-[50%] h-[50%] rounded-full bg-teal-500/3 dark:bg-teal-500/1 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="flex flex-col items-center gap-y-2 sm:gap-y-3 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 max-w-4xl mx-auto px-4">
            <span className="block lg:whitespace-nowrap">Được xây dựng dựa trên khoa học,</span>
            <span className="block lg:whitespace-nowrap">tối ưu cho người Việt</span>
          </h2>
        </ScrollReveal>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Pillar 1 */}
          <ScrollReveal delayClass={delays[0]} className="flex">
            <div
              className="group flex flex-col items-start p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-xl hover:shadow-zinc-900/[0.03] dark:hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300 space-y-6 w-full"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50 dark:border-emerald-800/20 shadow-sm">
                <Cpu className="size-6" strokeWidth={2.2} />
              </span>
              <div className="space-y-3.5 text-left flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-normal">
                  Phương pháp IPOR & FSRS
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal flex-1">
                  Phương pháp học IPOR (Input → Processing → Output → Review) tích hợp thuật toán ôn tập ngắt quãng thông minh FSRS — đã được kiểm chứng khoa học mang lại hiệu quả vượt trội.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 2 */}
          <ScrollReveal delayClass={delays[1]} className="flex">
            <div
              className="group flex flex-col items-start p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-xl hover:shadow-zinc-900/[0.03] dark:hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300 space-y-6 w-full"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50 dark:border-emerald-800/20 shadow-sm">
                <Users className="size-6" strokeWidth={2.2} />
              </span>
              <div className="space-y-3.5 text-left flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-normal">
                  Tối ưu cho người Việt
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal flex-1">
                  Mỗi bài giảng và bài tập được thiết kế trực diện để sửa các lỗi phát âm và phản xạ nói phổ biến của người Việt khi học giao tiếp từ cơ bản.
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Pillar 3 */}
          <ScrollReveal delayClass={delays[2]} className="flex">
            <div
              className="group flex flex-col items-start p-8 rounded-[2rem] border border-zinc-200/50 dark:border-zinc-800/40 bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-xl hover:shadow-zinc-900/[0.03] dark:hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300 space-y-6 w-full"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50 dark:border-emerald-800/20 shadow-sm">
                <Brain className="size-6" strokeWidth={2.2} />
              </span>
              <div className="space-y-3.5 text-left flex-1 flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-normal">
                  Học chủ động (Active Recall)
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal flex-1">
                  Bắt buộc não bộ phải chủ động truy xuất thông tin liên tục, giúp củng cố kết nối thần kinh mạnh mẽ hơn 80% so với phương pháp nghe đọc thụ động truyền thống.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Honest bottom quote */}
        <ScrollReveal delayClass="delay-300">
          <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium italic tracking-wide">
            Chúng tôi đang hoàn thiện AtoEnglish cùng với những thế hệ người học đầu tiên. Mọi phản hồi của bạn đều là nguồn động lực vô giá để chúng tôi nâng cấp sản phẩm tốt hơn.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

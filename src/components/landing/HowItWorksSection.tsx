"use client";

import { BookOpen, Cpu, Mic, RotateCcw } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function HowItWorksSection() {
  const steps = [
    {
      id: "01",
      title: "Nghe & Đọc (Input)",
      desc: "Tiếp xúc với tiếng Anh thực tế qua các tình huống giao tiếp gần gũi, nghe và đọc theo ngữ điệu người bản xứ.",
      icon: BookOpen,
      gradient: "from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconColor: "text-emerald-700 dark:text-emerald-400",
      borderColor: "hover:border-emerald-500/30 dark:hover:border-emerald-500/20",
    },
    {
      id: "02",
      title: "Xử lý sâu (Processing)",
      desc: "Làm chủ từ vựng và cấu trúc qua bài tập viết câu phản xạ và ghép thẻ thông minh (SRS), chống học vẹt thụ động.",
      icon: Cpu,
      gradient: "from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/5",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-700 dark:text-blue-400",
      borderColor: "hover:border-blue-500/30 dark:hover:border-blue-500/20",
    },
    {
      id: "03",
      title: "Nói & Viết (Output)",
      desc: "Luyện nói Shadowing và thực hành đóng vai (Roleplay) tình huống thực tế. Ghi âm và nhận phản hồi lỗi phát âm tức thì.",
      icon: Mic,
      gradient: "from-violet-500/5 to-purple-500/5 dark:from-violet-500/10 dark:to-purple-500/5",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
      iconColor: "text-violet-755 dark:text-violet-400",
      borderColor: "hover:border-violet-500/30 dark:hover:border-violet-500/20",
    },
    {
      id: "04",
      title: "Ôn tập thông minh (Review)",
      desc: "Thuật toán ôn tập ngắt quãng (FSRS) tự động tính toán thời điểm vàng để nhắc nhở, đưa từ vựng vào trí nhớ vĩnh viễn.",
      icon: RotateCcw,
      gradient: "from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/5",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-700 dark:text-amber-450",
      borderColor: "hover:border-amber-500/30 dark:hover:border-amber-500/20",
    },
  ];

  const delays = ["", "delay-100", "delay-200", "delay-300"];

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 lg:py-40 px-5 sm:px-8 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-500/4 dark:bg-emerald-500/2 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-normal">
            Cách học giúp bạn nói được nhanh nhất
          </h2>
          <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-350 max-w-xl mx-auto leading-relaxed font-normal">
            Chỉ 4 bước lặp lại mỗi ngày — giúp bạn chuyển từ “thuộc lòng lý thuyết” sang “nói trôi chảy tự nhiên”.
          </p>
        </ScrollReveal>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal
                key={step.id}
                delayClass={delays[index]}
                className="h-full"
              >
                <div
                  className={`group relative flex flex-col h-full bg-gradient-to-br ${step.gradient} border border-zinc-200/50 dark:border-zinc-800/40 ${step.borderColor} p-8 sm:p-9 rounded-3xl space-y-6 hover:shadow-xl hover:shadow-zinc-900/[0.03] dark:hover:shadow-black/25 hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl ${step.iconBg} ${step.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="size-5.5" />
                    </span>
                    <span className="text-3xl font-mono font-bold text-zinc-350 dark:text-zinc-700/80 group-hover:text-emerald-500/40 dark:group-hover:text-emerald-400/30 transition-colors duration-300">
                      {step.id}
                    </span>
                  </div>
                  <div className="space-y-3 flex-1 flex flex-col">
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-normal">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-650 dark:text-zinc-400 leading-relaxed flex-1 font-normal">
                      {step.desc}
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

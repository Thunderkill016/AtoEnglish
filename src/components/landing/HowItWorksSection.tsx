"use client";

import { BookOpen, Cpu, Mic, RotateCcw } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function HowItWorksSection() {
  const steps = [
    {
      id: "01",
      title: "Nghe & Đọc (Input)",
      desc: "Tiếp xúc với tiếng Anh thực tế qua các tình huống gần gũi, nghe và đọc theo người bản xứ.",
      icon: BookOpen,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "02",
      title: "Xử lý sâu (Processing)",
      desc: "Hiểu rõ từ vựng và cấu trúc câu qua bài tập tương tác, thay vì chỉ học vẹt.",
      icon: Cpu,
      gradient: "from-blue-500/10 to-indigo-500/10",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "03",
      title: "Nói & Viết (Output)",
      desc: "Luyện nói ngay từ bài học đầu tiên qua Shadowing và Roleplay. Ghi âm và so sánh với mẫu chuẩn.",
      icon: Mic,
      gradient: "from-violet-500/10 to-purple-500/10",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      id: "04",
      title: "Ôn tập thông minh (Review)",
      desc: "Hệ thống FSRS tự động nhắc nhở ôn đúng lúc, giúp kiến thức thực sự đi vào bộ nhớ dài hạn.",
      icon: RotateCcw,
      gradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  const delays = ["", "delay-100", "delay-200", "delay-300"];

  return (
    <section
      id="how-it-works"
      className="py-20 sm:py-28 lg:py-36 px-5 sm:px-8"
    >
      <div className="max-w-6xl mx-auto space-y-14 sm:space-y-20">
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Cách học giúp bạn nói được nhanh nhất
          </h2>
          <p className="text-[15px] sm:text-base lg:text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Chỉ 4 bước lặp lại mỗi ngày — giúp bạn chuyển từ “học thuộc” sang “nói tự tin”.
          </p>
        </ScrollReveal>

        {/* 4 Cards Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal
                key={step.id}
                delayClass={delays[index]}
                className="h-full"
              >
                <div
                  className={`group relative flex flex-col h-full bg-gradient-to-br ${step.gradient} border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 p-6 sm:p-7 lg:p-8 rounded-2xl space-y-5 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-11 sm:size-12 items-center justify-center rounded-xl ${step.iconBg} ${step.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="size-5 sm:size-6" />
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-extralight text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500/60 dark:group-hover:text-emerald-400/40 transition-colors duration-300">
                      {step.id}
                    </span>
                  </div>
                  <div className="space-y-2.5 flex-1 flex flex-col">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
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

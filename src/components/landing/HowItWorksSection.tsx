
import { Headphones, Layers, Mic2, RefreshCw } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function HowItWorksSection() {
  const steps = [
    {
      id: "01",
      title: "Nghe & Đọc (Input)",
      desc: "Tiếp xúc với tiếng Anh thực tế qua các tình huống giao tiếp gần gũi, nghe và đọc theo ngữ điệu người bản xứ.",
      icon: Headphones,
      accentBg: "bg-emerald-100 dark:bg-emerald-950/50",
      accentText: "text-emerald-700 dark:text-emerald-400",
      accentBorder: "border-emerald-200/50 dark:border-emerald-800/20",
      lineBg: "bg-emerald-200/60 dark:bg-emerald-800/30",
      tag: "IPOR — Bước 1",
    },
    {
      id: "02",
      title: "Xử lý sâu (Processing)",
      desc: "Làm chủ từ vựng và cấu trúc qua bài tập viết câu phản xạ và ghép thẻ thông minh (SRS), chống học vẹt thụ động.",
      icon: Layers,
      accentBg: "bg-blue-100 dark:bg-blue-950/50",
      accentText: "text-blue-700 dark:text-blue-400",
      accentBorder: "border-blue-200/50 dark:border-blue-800/20",
      lineBg: "bg-blue-200/60 dark:bg-blue-800/30",
      tag: "IPOR — Bước 2",
    },
    {
      id: "03",
      title: "Nói & Viết (Output)",
      desc: "Luyện nói Shadowing và thực hành đóng vai tình huống thực tế. Ghi âm và nhận phản hồi lỗi phát âm tức thì.",
      icon: Mic2,
      accentBg: "bg-violet-100 dark:bg-violet-950/50",
      accentText: "text-violet-700 dark:text-violet-400",
      accentBorder: "border-violet-200/50 dark:border-violet-800/20",
      lineBg: "bg-violet-200/60 dark:bg-violet-800/30",
      tag: "IPOR — Bước 3",
    },
    {
      id: "04",
      title: "Ôn tập thông minh (Review)",
      desc: "Thuật toán FSRS tự động tính toán thời điểm vàng để nhắc nhở, đưa từ vựng vào trí nhớ dài hạn hiệu quả.",
      icon: RefreshCw,
      accentBg: "bg-amber-100 dark:bg-amber-950/50",
      accentText: "text-amber-700 dark:text-amber-400",
      accentBorder: "border-amber-200/50 dark:border-amber-800/20",
      lineBg: "bg-amber-200/60 dark:bg-amber-800/30",
      tag: "IPOR — Bước 4",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-zinc-50/30 to-white dark:from-zinc-900/10 dark:to-zinc-950/20 border-y border-zinc-200/40 dark:border-zinc-800/40 py-24 sm:py-32 lg:py-40 px-5 sm:px-8 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-500/4 dark:bg-emerald-500/2 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-16 sm:space-y-20">
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-normal">
            Cách học giúp bạn nói được nhanh nhất
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
            4 bước lặp lại mỗi ngày — từ{" "}
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              &ldquo;thuộc lòng lý thuyết&rdquo;
            </span>{" "}
            sang{" "}
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
              &ldquo;nói trôi chảy tự nhiên&rdquo;
            </span>
            .
          </p>
        </ScrollReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[27px] sm:left-[31px] top-10 bottom-10 w-px bg-gradient-to-b from-emerald-200 via-blue-200 via-violet-200 to-amber-200 dark:from-emerald-800/40 dark:via-blue-800/40 dark:via-violet-800/40 dark:to-amber-800/40 hidden sm:block" />

          <div className="space-y-8 sm:space-y-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <ScrollReveal key={step.id} delayMs={idx * 100}>
                  <div className="flex gap-5 sm:gap-7 group">
                    {/* Step circle */}
                    <div className="flex flex-col items-center shrink-0">
                      <span
                        className={`relative z-10 flex size-14 sm:size-16 items-center justify-center rounded-2xl ${step.accentBg} ${step.accentText} border ${step.accentBorder} shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0`}
                      >
                        <Icon className="size-6 sm:size-7" strokeWidth={2} />
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2 pt-1">
                      <span className={`text-[11px] font-bold uppercase tracking-widest ${step.accentText} opacity-70`}>
                        {step.tag}
                      </span>
                      <h3 className="mt-1 text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm sm:text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </div>

                    {/* Step number — decorative */}
                    <span className="hidden lg:block text-5xl font-black text-zinc-100 dark:text-zinc-800/70 leading-none self-center shrink-0 select-none">
                      {step.id}
                    </span>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

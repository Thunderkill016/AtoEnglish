
import { Headphones, Layers, Mic2, RefreshCw } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const STEPS = [
  {
    id: "01",
    title: "Nghe & Đọc",
    tag: "Input",
    desc: "Tiếp xúc tiếng Anh thực tế qua tình huống gần gũi, nghe ngữ điệu người bản xứ.",
    icon: Headphones,
    color: "emerald",
  },
  {
    id: "02",
    title: "Xử lý sâu",
    tag: "Processing",
    desc: "Làm chủ từ vựng qua viết câu phản xạ và thẻ SRS — chống học vẹt thụ động.",
    icon: Layers,
    color: "blue",
  },
  {
    id: "03",
    title: "Nói & Viết",
    tag: "Output",
    desc: "Shadowing, roleplay tình huống thực tế. Ghi âm và nhận phản hồi phát âm tức thì.",
    icon: Mic2,
    color: "violet",
  },
  {
    id: "04",
    title: "Ôn tập thông minh",
    tag: "Review",
    desc: "FSRS tính thời điểm vàng nhắc ôn — đưa từ vựng vào trí nhớ dài hạn.",
    icon: RefreshCw,
    color: "amber",
  },
] as const;

const COLOR_MAP = {
  emerald: {
    iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    iconText: "text-emerald-700 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
    line: "from-emerald-500/40",
  },
  blue: {
    iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    iconText: "text-blue-700 dark:text-blue-400",
    ring: "ring-blue-500/20",
    line: "from-blue-500/40",
  },
  violet: {
    iconBg: "bg-violet-500/10 dark:bg-violet-500/20",
    iconText: "text-violet-700 dark:text-violet-400",
    ring: "ring-violet-500/20",
    line: "from-violet-500/40",
  },
  amber: {
    iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    iconText: "text-amber-700 dark:text-amber-400",
    ring: "ring-amber-500/20",
    line: "from-amber-500/40",
  },
};

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 lg:py-40 px-5 sm:px-8 relative"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-500/4 dark:bg-emerald-500/2 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-14 sm:space-y-20">
        <ScrollReveal className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
            4 bước IPOR — lặp lại mỗi ngày
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Từ “thuộc lòng lý thuyết” sang “nói trôi chảy tự nhiên” trong ~15 phút mỗi ngày.
          </p>
        </ScrollReveal>

        <div className="relative">
          <div
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-emerald-500/30 via-blue-500/30 via-violet-500/30 to-amber-500/30"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const colors = COLOR_MAP[step.color];
              return (
                <ScrollReveal key={step.id} delayMs={index * 100} className="relative">
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left h-full p-6 sm:p-7 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm hover:border-emerald-500/20 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
                    <div className="relative mb-5">
                      <span
                        className={`flex size-14 items-center justify-center rounded-2xl ${colors.iconBg} ${colors.iconText} ring-4 ${colors.ring}`}
                      >
                        <Icon className="size-6" />
                      </span>
                      <span className="absolute -top-2 -right-2 text-[10px] font-black text-zinc-400 dark:text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-full size-6 flex items-center justify-center">
                        {step.id}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                      {step.tag}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {step.desc}
                    </p>
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

import { X, Check, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const BEFORE_ITEMS = [
  "Mất 5–10 giây dịch nhẩm trước khi nói",
  "Ngại phát âm sai, sợ bị đánh giá",
  "Học nhiều ngữ pháp nhưng không có ai để luyện nói",
  "App gamification — vui nhưng không nói được",
];

const AFTER_ITEMS = [
  "Nói theo mẫu Shadowing ngay từ bài đầu",
  "Luyện trong môi trường an toàn, không áp lực",
  "IPOR: Input → Output mỗi ngày, có phản hồi tức thì",
  "FSRS nhắc ôn đúng lúc — nhớ lâu, không học vẹt",
];

export default function ProblemSection() {
  return (
    <section className="bg-gradient-to-b from-white to-zinc-50/60 dark:from-zinc-950 dark:to-zinc-900/10 py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/2 blur-[80px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-14 sm:space-y-16">
        <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
            Học nhiều năm mà vẫn ngại mở miệng?
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Bạn không thiếu kiến thức — bạn thiếu môi trường để biến kiến thức thành phản xạ nói tự nhiên.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <ScrollReveal delayMs={0}>
            <div className="h-full rounded-[2rem] border border-zinc-200/70 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900/30 p-7 sm:p-9 space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-zinc-200/80 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                  <X className="size-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Trước đây</p>
                  <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Học truyền thống / app giải trí</h3>
                </div>
              </div>
              <ul className="space-y-4">
                {BEFORE_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <X className="size-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delayMs={100}>
            <div className="h-full rounded-[2rem] border border-emerald-500/25 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/5 p-7 sm:p-9 space-y-6 shadow-sm shadow-emerald-500/5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                  <Check className="size-5" />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Với AtoEnglish</p>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Luyện nói có hệ thống</h3>
                </div>
              </div>
              <ul className="space-y-4">
                {AFTER_ITEMS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <Check className="size-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delayMs={150} className="flex justify-center">
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors"
          >
            Xem 4 bước học IPOR
            <ArrowRight className="size-4" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
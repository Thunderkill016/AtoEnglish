
import { XCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function ProblemSection() {
  const problems = [
    {
      title: "Học nhiều nhưng phản xạ chậm",
      desc: "Mất từ 5 đến 10 giây để dịch nhẩm cấu trúc ngữ pháp trong đầu trước khi nói.",
    },
    {
      title: "Nỗi sợ nói sai & bị phán xét",
      desc: "E ngại phát âm chưa chuẩn, lo sợ người đối diện không hiểu hoặc đánh giá năng lực.",
    },
    {
      title: "Thiếu môi trường thực hành",
      desc: "Không có bạn đồng hành luyện tập phản xạ giao tiếp mỗi ngày trong môi trường an toàn.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/10 dark:to-zinc-950/20 border-y border-zinc-200/40 dark:border-zinc-800/40 py-24 sm:py-32 px-5 sm:px-8 relative overflow-hidden">
      {/* Soft background light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 dark:bg-emerald-500/2 blur-[80px] pointer-events-none" />

      <ScrollReveal className="max-w-5xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 shadow-inner">
              <XCircle className="size-6 animate-pulse" />
            </span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-normal">
            Bạn học tiếng Anh nhiều năm nhưng vẫn ngại nói?
          </h2>
          
          <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-350 max-w-2xl mx-auto leading-relaxed font-normal">
            Hàng trăm giờ học ngữ pháp, thuộc hàng nghìn từ vựng… nhưng khi cần mở miệng giao tiếp thực tế thì lại bế tắc. Bạn không thiếu kiến thức, bạn chỉ thiếu môi trường để luyện phản xạ nói tự nhiên.
          </p>
        </div>

        {/* 3 Problems Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {problems.map((prob, idx) => (
            <div 
              key={idx} 
              className="bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm p-7 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 shadow-sm space-y-3.5 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
            >
              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-sm sm:text-base">
                0{idx + 1}. {prob.title}
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
                {prob.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4">
          <p className="text-emerald-700 dark:text-emerald-400 font-black text-lg sm:text-xl">
            AtoEnglish được xây dựng để giải quyết đúng vấn đề này.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

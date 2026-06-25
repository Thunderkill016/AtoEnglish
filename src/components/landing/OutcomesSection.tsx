
import {
  Zap,
  Clock,
  FlaskConical,
  MapPin,
  Lightbulb,
  Gift,
} from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

const OUTCOMES = [
  {
    id: "ipor",
    span: "lg:col-span-2 lg:row-span-2",
    icon: FlaskConical,
    title: "IPOR + FSRS",
    subtitle: "Phương pháp khoa học",
    desc: "Chu trình Input → Processing → Output → Review kết hợp thuật toán ôn tập ngắt quãng FSRS — nhắc ôn đúng thời điểm vàng, ghi nhớ lâu hơn học vẹt.",
    accent: "from-emerald-500/8 to-teal-500/8 dark:from-emerald-500/12 dark:to-teal-500/8",
    featured: true,
  },
  {
    id: "speaking",
    span: "",
    icon: Zap,
    title: "Phản xạ nói tự nhiên",
    subtitle: "Kết quả thực tế",
    desc: "Shadowing và roleplay giúp bạn bật ra câu trả lời ngay, không còn dịch nhẩm trong đầu.",
    accent: "from-violet-500/6 to-purple-500/6 dark:from-violet-500/10 dark:to-purple-500/6",
  },
  {
    id: "time",
    span: "",
    icon: Clock,
    title: "15 phút mỗi ngày",
    subtitle: "Thói quen bền vững",
    desc: "Bài học ngắn, tối ưu mobile — dễ duy trì streak mà không bị quá tải.",
    accent: "from-amber-500/6 to-orange-500/6 dark:from-amber-500/10 dark:to-orange-500/6",
  },
  {
    id: "vietnamese",
    span: "",
    icon: MapPin,
    title: "Tối ưu người Việt",
    subtitle: "Nội dung bản địa",
    desc: "Sửa lỗi phát âm và phản xạ phổ biến của người Việt từ A0.",
    accent: "from-blue-500/6 to-indigo-500/6 dark:from-blue-500/10 dark:to-indigo-500/6",
  },
  {
    id: "recall",
    span: "",
    icon: Lightbulb,
    title: "Active Recall",
    subtitle: "Học chủ động",
    desc: "Bắt não truy xuất thông tin liên tục qua SRS và bài tập viết — củng cố trí nhớ mạnh hơn đọc thụ động.",
    accent: "from-teal-500/6 to-cyan-500/6 dark:from-teal-500/10 dark:to-cyan-500/6",
  },
  {
    id: "free",
    span: "",
    icon: Gift,
    title: "Miễn phí Open Beta",
    subtitle: "Trải nghiệm đầy đủ",
    desc: "Toàn bộ bài học, SRS và luyện nói mở khóa 100% trong giai đoạn thử nghiệm.",
    accent: "from-emerald-500/6 to-green-500/6 dark:from-emerald-500/10 dark:to-green-500/6",
  },
];

export default function OutcomesSection() {
  return (
    <section
      id="outcomes"
      className="py-24 sm:py-32 lg:py-40 px-5 sm:px-8 relative border-y border-zinc-200/40 dark:border-zinc-800/40 bg-gradient-to-b from-zinc-50/30 to-white dark:from-zinc-900/10 dark:to-zinc-950/20"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] right-[5%] w-[45%] h-[45%] rounded-full bg-teal-500/4 dark:bg-teal-500/2 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-14 sm:space-y-20">
        <ScrollReveal className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
            Kết quả & phương pháp
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight">
            Bạn sẽ học được gì — và tại sao nó hiệu quả?
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Một lộ trình duy nhất kết hợp khoa học ghi nhớ, luyện nói thực chiến và thiết kế cho người Việt bận rộn.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 auto-rows-fr">
          {OUTCOMES.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.id}
                delayMs={index * 75}
                className={`flex ${item.span}`}
              >
                <div
                  className={`group relative flex flex-col h-full w-full p-6 sm:p-7 rounded-[1.75rem] border border-zinc-200/60 dark:border-zinc-800/50 bg-gradient-to-br ${item.accent} bg-white/70 dark:bg-zinc-900/25 backdrop-blur-sm hover:border-emerald-500/25 dark:hover:border-emerald-500/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 transition-all duration-300 ${
                    item.featured ? "sm:p-8 lg:p-9" : ""
                  }`}
                >
                  <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/20 mb-4 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="size-5" strokeWidth={2.2} />
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1">
                    {item.subtitle}
                  </p>
                  <h3
                    className={`font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2 ${
                      item.featured ? "text-xl sm:text-2xl" : "text-lg"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1 ${
                      item.featured ? "text-sm sm:text-base" : "text-sm"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delayMs={200}>
          <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed italic">
            Chúng tôi đang hoàn thiện AtoEnglish cùng những người học đầu tiên. Mọi phản hồi của bạn giúp sản phẩm tốt hơn mỗi tuần.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
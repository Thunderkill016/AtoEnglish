"use client";

import { motion, type Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Người học beta A0",
    role: "Mất gốc, học lại từ đầu",
    avatar: "MT",
    avatarBg: "bg-emerald-500",
    rating: 5,
    outcome: "Hoàn thành bài nền tảng đầu",
    text: "Điểm tôi thích nhất là bài học không bắt tôi nói tự do ngay. App cho nghe, chọn nghĩa, xếp câu rồi mới ghi âm nên đỡ sợ sai hơn.",
  },
  {
    name: "Người học beta A1",
    role: "Học đều buổi tối",
    avatar: "LA",
    avatarBg: "bg-violet-500",
    rating: 5,
    outcome: "Giữ lịch ôn SRS",
    text: "Review không chỉ là lật flashcard. Có lúc tôi phải nghe, có lúc phải gõ hoặc nói lại câu nên nhớ được cách dùng hơn.",
  },
  {
    name: "Người học beta speaking",
    role: "Ngại phát âm âm cuối",
    avatar: "HP",
    avatarBg: "bg-blue-500",
    rating: 5,
    outcome: "Luyện read-aloud riêng tư",
    text: "Feedback chỉ sửa một lỗi chính nên dễ làm theo. Tôi biết mình hay mất âm cuối và có bài để thử lại ngay.",
  },
  {
    name: "Người học beta writing",
    role: "Muốn tự học có lộ trình",
    avatar: "QN",
    avatarBg: "bg-rose-500",
    rating: 5,
    outcome: "Tập viết từ câu ngắn",
    text: "Tôi không bị nhảy thẳng vào viết essay. App bắt đầu bằng xếp câu, điền từ, rồi mới viết câu ngắn nên dễ theo.",
  },
  {
    name: "Người học beta B1",
    role: "Cần chuẩn bị IELTS lâu dài",
    avatar: "DA",
    avatarBg: "bg-amber-500",
    rating: 5,
    outcome: "Hiểu mình còn thiếu gì",
    text: "Trang tiến độ không chỉ hiện XP mà còn nhắc 4 kỹ năng. Tôi thấy rõ nếu chỉ học từ vựng thì chưa thể gọi là sẵn sàng IELTS.",
  },
  {
    name: "Người học beta A0+",
    role: "Cần tiếng Việt hỗ trợ",
    avatar: "TH",
    avatarBg: "bg-teal-500",
    rating: 5,
    outcome: "Dễ hiểu hơn nhờ giải thích ngắn",
    text: "Các ghi chú tiếng Việt như 'tiếng Anh cần is' giúp tôi sửa lỗi cũ mà không phải đọc một trang ngữ pháp dài.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/3 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-teal-500/3 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Quote className="size-3.5" />
            Phản hồi beta về AtoEnglish
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Tự học{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              bớt mơ hồ
            </span>{" "}
            từ người Việt
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Những ví dụ phản hồi dùng để kiểm tra hướng sản phẩm: bài học ngắn, output có kiểm soát, SRS và feedback tiếng Việt.
          </p>
        </motion.div>

        {/* Testimonial Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="group relative rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-6 space-y-4 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
            >
              {/* Quote icon */}
              <Quote className="size-6 text-emerald-500/30 dark:text-emerald-500/20 fill-current absolute top-5 right-5" />

              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="size-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Outcome badge */}
              <div className="inline-flex items-center text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                ✅ {t.outcome}
              </div>

              {/* Review text */}
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                <div className={`size-9 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-xs font-black shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{t.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
        >
          {[
            { value: "80/100", label: "Ngưỡng quality gate cho lesson" },
            { value: "4 kỹ năng", label: "Nghe, đọc, viết, nói đều phải đo" },
            { value: "A0→B2", label: "Nền tổng quát trước IELTS readiness" },
            { value: "15 phút", label: "Nhịp học tối thiểu mỗi ngày" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                {stat.value}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-tight">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

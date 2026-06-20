"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Nguyễn Minh Tuấn",
    role: "Kỹ sư phần mềm, 28 tuổi",
    avatar: "MT",
    avatarBg: "bg-emerald-500",
    rating: 5,
    outcome: "Tăng từ A1 → B1 trong 4 tháng",
    text: "Trước đây tôi học Duolingo mà không tiến bộ mấy. Kể từ khi dùng AtoEnglish, tôi nói tiếng Anh trong cuộc họp với khách hàng nước ngoài mà không còn run nữa. Phương pháp FSRS thực sự khác biệt!",
  },
  {
    name: "Trần Thị Lan Anh",
    role: "Nhân viên marketing, 25 tuổi",
    avatar: "LA",
    avatarBg: "bg-violet-500",
    rating: 5,
    outcome: "Học đều 15 phút/ngày trong 90 ngày",
    text: "Tôi đã thử rất nhiều app nhưng không app nào giữ được thói quen của tôi lâu hơn 1 tuần. AtoEnglish với hệ thống streak và bài học 15 phút đã giúp tôi duy trì 3 tháng liên tiếp — kỷ lục của tôi!",
  },
  {
    name: "Lê Hoàng Phúc",
    role: "Sinh viên đại học, 21 tuổi",
    avatar: "HP",
    avatarBg: "bg-blue-500",
    rating: 5,
    outcome: "Đậu IELTS 6.5 sau 6 tháng luyện tập",
    text: "Tính năng luyện nói phản xạ của AtoEnglish cực kỳ hữu ích cho phần Speaking IELTS. Tôi không còn bị blank mind khi gặp câu hỏi khó nữa. Nhất định giới thiệu cho bạn bè!",
  },
  {
    name: "Phạm Quỳnh Như",
    role: "Kế toán trưởng, 32 tuổi",
    avatar: "QN",
    avatarBg: "bg-rose-500",
    rating: 5,
    outcome: "Tự tin giao tiếp trong hội nghị quốc tế",
    text: "Là người mất gốc, tôi sợ học tiếng Anh từ bé. AtoEnglish giải thích ngữ pháp bằng tiếng Việt rất dễ hiểu và không bao giờ khiến tôi cảm thấy bị áp lực. Bây giờ tôi có thể email với đối tác Nhật trực tiếp.",
  },
  {
    name: "Võ Đức Anh",
    role: "Freelancer thiết kế, 27 tuổi",
    avatar: "DA",
    avatarBg: "bg-amber-500",
    rating: 5,
    outcome: "Kiếm thêm 20% thu nhập từ khách nước ngoài",
    text: "Sau 5 tháng học AtoEnglish, tôi bắt đầu nhận dự án từ khách hàng Mỹ và Úc. Doanh thu tăng 20% nhờ giao tiếp trực tiếp không qua phiên dịch. ROI tốt nhất tôi từng đầu tư.",
  },
  {
    name: "Bùi Thị Hương",
    role: "Giáo viên tiểu học, 30 tuổi",
    avatar: "TH",
    avatarBg: "bg-teal-500",
    rating: 5,
    outcome: "Từ 0 lên A2 trong 2 tháng đầu",
    text: "Tôi hoàn toàn không biết tiếng Anh khi bắt đầu. Các bài học Unit 1 của AtoEnglish dạy từng bước từ IPA đến cấu trúc câu rất rõ ràng. Giờ tôi có thể tự đọc được email tiếng Anh mà không cần Google dịch.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
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
            Học viên nói gì về AtoEnglish
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Kết quả{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              thực tế
            </span>{" "}
            từ người Việt
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Hàng nghìn học viên người Việt đã cải thiện tiếng Anh với AtoEnglish — đây là câu chuyện của họ.
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
            { value: "4.9/5", label: "Đánh giá trung bình" },
            { value: "92%", label: "Học viên duy trì ≥30 ngày" },
            { value: "3.2×", label: "Tốc độ nhớ từ so với học thông thường" },
            { value: "15 phút", label: "Thời gian học tối thiểu mỗi ngày" },
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

"use client";

import { motion, type Variants } from "framer-motion";
import { MessageSquareQuote } from "lucide-react";

const BETA_STORIES = [
  {
    name: "Minh T.",
    role: "Kỹ sư phần mềm · Beta tester",
    avatar: "MT",
    avatarBg: "bg-emerald-500",
    focus: "Luyện nói hàng ngày",
    text: "Tôi thích nhất phần Shadowing — có thể thử nói ngay trên landing mà không cần đăng ký. Sau 2 tuần beta, tôi cảm thấy ít phải dịch nhẩm hơn khi họp online.",
  },
  {
    name: "Lan A.",
    role: "Marketing · Người học đầu tiên",
    avatar: "LA",
    avatarBg: "bg-violet-500",
    focus: "Thói quen 15 phút/ngày",
    text: "Bài học ngắn nên tôi giữ được streak lâu hơn mọi app trước đây. Dashboard nhiệm vụ hôm nay giúp biết cần làm gì — không bị lạc trong menu.",
  },
  {
    name: "Phúc L.",
    role: "Sinh viên · Open Beta",
    avatar: "HP",
    avatarBg: "bg-blue-500",
    focus: "SRS + phát âm",
    text: "Thẻ SRS nhắc ôn đúng lúc, không spam. Phần nhận diện giọng nói cho biết từ nào phát âm chưa rõ — hữu ích hơn chỉ nghe audio mẫu.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 px-5 sm:px-8 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/3 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquareQuote className="size-3.5" />
            Phản hồi Open Beta
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Người học đầu tiên đang thử nghiệm
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            AtoEnglish đang trong giai đoạn Open Beta. Đây là phản hồi thật từ những người dùng sớm — chúng tôi chưa có số liệu quy mô lớn để công bố.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {BETA_STORIES.map((story) => (
            <motion.div
              key={story.name}
              variants={cardVariants}
              className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm p-6 space-y-4 hover:border-emerald-500/25 transition-all duration-300"
            >
              <div className="inline-flex text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                {story.focus}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                &ldquo;{story.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <div
                  className={`size-9 rounded-full ${story.avatarBg} flex items-center justify-center text-white text-xs font-black shrink-0`}
                >
                  {story.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{story.name}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{story.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto"
        >
          Bạn cũng đang dùng beta? Gửi góp ý qua{" "}
          <a
            href="mailto:support@atoenglish.com"
            className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            support@atoenglish.com
          </a>{" "}
          — mỗi phản hồi đều được đọc.
        </motion.p>
      </div>
    </section>
  );
}
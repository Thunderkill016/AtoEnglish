"use client";

import { motion, type Variants } from "framer-motion";
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
        {/* Header - honest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4 mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Quote className="size-3.5" />
            Thực tế về AtoEnglish
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Một dự án nhỏ đang phát triển
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Không có hàng nghìn học viên. Không có con số ảo. Chỉ có công cụ để bạn tự luyện nói mỗi ngày.
          </p>
        </motion.div>

        {/* Honest cards - keep the beautiful glass design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "Thử mà không cần tài khoản", text: "Bạn có thể vào học thử ngay (guest mode). Tiến độ lưu cục bộ trên trình duyệt." },
            { title: "Tập trung vào nói", text: "Mỗi bài có Shadowing (nhại theo) và Roleplay tình huống thực tế. Không chỉ đọc chép." },
            { title: "Ôn tập FSRS miễn phí", text: "Dùng thuật toán FSRS mã nguồn mở để nhắc ôn đúng lúc sắp quên." },
            { title: "Open Beta", text: "Dự án đang phát triển. Sẽ được cải thiện dựa trên phản hồi người dùng thật." },
          ].map((note, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-6 space-y-4 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col"
            >
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                {note.title}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex-1">
                {note.text}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-zinc-500 dark:text-zinc-400">
          Muốn xem thực tế? Bấm “Học thử ngay” — không cần đăng nhập.
        </p>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

export default function FaqSection() {
  const faqs = [
    {
      q: "Người mất gốc hoặc mới bắt đầu từ con số 0 có học được không?",
      a: "Hoàn toàn học được! Lộ trình của AtoEnglish được thiết kế đặc biệt từ cơ bản nhất (A1). Phương pháp 4 bước (IPOR) giúp chia nhỏ bài học: bạn sẽ tích lũy từ vựng qua hình ảnh/âm thanh, luyện tập viết câu phản xạ và thực hành nói nhại giọng (Shadowing) mà không bị áp lực ngữ pháp hàn lâm.",
    },
    {
      q: "Tôi có phải cài đặt ứng dụng vào điện thoại không?",
      a: "Không cần. AtoEnglish là một nền tảng Web-App hiện đại, chạy trực tiếp trên trình duyệt web của bạn. Giao diện được tối ưu hóa mượt mà cho cả điện thoại di động (iPhone, Android), máy tính bảng lẫn máy tính cá nhân. Chỉ cần mở trình duyệt, đăng nhập nhanh bằng Google là học được ngay.",
    },
    {
      q: "Sản phẩm có thực sự miễn phí không?",
      a: "Có, hoàn toàn miễn phí! Hiện tại AtoEnglish đang trong giai đoạn thử nghiệm mở (Open Beta). Chúng tôi cam kết mở khóa toàn bộ các bài học giao tiếp, công cụ ôn tập lật thẻ SRS và bài tập luyện nói phản xạ cơ bản miễn phí 100% cho tất cả người học trải nghiệm trong giai đoạn này.",
    },
    {
      q: "Thuật toán Ôn tập ngắt quãng (FSRS) là gì?",
      a: "FSRS (Free Spaced Repetition Scheduler) là thuật toán khoa học ghi nhớ tiên tiến bậc nhất hiện nay. Thay vì cố gắng học vẹt, FSRS sẽ đo lường mức độ ghi nhớ của bạn đối với từng từ vựng và tự động lên lịch nhắc nhở ôn tập vào đúng 'thời điểm vàng' ngay trước khi bạn chuẩn bị quên. Nhờ đó, bạn ghi nhớ từ vựng sâu sắc hơn tới 80% với thời gian học ít hơn.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-5 sm:px-8 border-t border-zinc-200/40 dark:border-zinc-800/40 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[40%] right-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500/3 dark:bg-emerald-500/1 blur-[100px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-16">
        {/* Section Header */}
        <ScrollReveal className="text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-250/20 shadow-sm">
              <HelpCircle className="size-5.5" />
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-normal">
            Giải đáp thắc mắc
          </h2>
          <p className="text-base sm:text-lg text-zinc-650 dark:text-zinc-350 max-w-xl mx-auto leading-relaxed font-normal">
            Những câu hỏi thường gặp giúp bạn yên tâm bắt đầu hành trình học nói tiếng Anh.
          </p>
        </ScrollReveal>

        {/* Accordions */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <ScrollReveal key={idx} delayClass={idx > 0 ? "delay-75" : ""}>
                <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/15 backdrop-blur-sm shadow-sm overflow-hidden hover:border-emerald-500/20 dark:hover:border-emerald-500/10 transition-colors duration-200">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left select-none group"
                  >
                    <span className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-200">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`size-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-emerald-600 dark:text-emerald-400" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[300px] border-t border-zinc-150 dark:border-zinc-850" : "max-h-0"
                    }`}
                  >
                    <p className="p-5 sm:p-6 text-xs sm:text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed font-normal bg-zinc-50/30 dark:bg-zinc-900/10">
                      {faq.a}
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

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ = [
  {
    q: "Mất gốc có học được không?",
    a: "Có. Lộ trình từ A0. Mỗi bài có can-do rõ, giải thích tiếng Việt, luyện nói từ sớm — không bắt đầu bằng ngữ pháp hàn lâm.",
  },
  {
    q: "Mỗi ngày cần bao lâu?",
    a: "15–20 phút là đủ để tiến bộ nếu đều. Có thể chia nhỏ theo stage trong bài.",
  },
  {
    q: "Khác Duolingo / app nước ngoài thế nào?",
    a: "Tập trung người Việt: L1 notes, lỗi phát âm VN, lộ trình A0→B1 Independent User — không league/XP làm core loop.",
  },
  {
    q: "Có cần cài app không?",
    a: "Không. Web-app, chạy trên trình duyệt điện thoại và máy tính.",
  },
  {
    q: "Có thật miễn phí?",
    a: "Open Beta: học, nói, ôn FSRS miễn phí. Chúng tôi sẽ thông báo rõ nếu có gói trả phí sau này.",
  },
  {
    q: "Dữ liệu có an toàn?",
    a: "Supabase Auth + RLS. Tiến độ guest lưu local; đăng nhập thì đồng bộ theo tài khoản. Không bán dữ liệu cá nhân.",
  },
] as const;

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-y border-border bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight md:text-3xl">
          Câu hỏi thường gặp
        </h2>

        <ul className="mt-10 space-y-2">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <li
                key={item.q}
                className="rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                {isOpen ? (
                  <p className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

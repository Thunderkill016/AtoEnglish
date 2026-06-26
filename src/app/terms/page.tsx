import Link from "next/link";
import { Sprout } from "lucide-react";
import type { Metadata } from "next";
import { Screen, LargeTitle, Prose } from "@/components/design-system";

export const metadata: Metadata = {
  title: "Điều khoản Sử dụng | AtoEnglish",
  description: "Điều khoản và điều kiện sử dụng dịch vụ AtoEnglish.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-200">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
                AtoEnglish
              </span>
              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
                Grow every day
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            ← Trang chủ
          </Link>
        </div>
      </nav>

      <Screen narrow>
        <LargeTitle subtitle="Cập nhật lần cuối: Tháng 6 năm 2025">
          Điều khoản Sử dụng
        </LargeTitle>

        <Prose>
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">1. Chấp nhận Điều khoản</h2>
            <p>
              Bằng cách truy cập và sử dụng AtoEnglish, bạn đồng ý với các điều khoản và điều kiện này. Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">2. Mô tả Dịch vụ</h2>
            <p>
              AtoEnglish là nền tảng học tiếng Anh trực tuyến (Web App) cung cấp:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>Bài học theo lộ trình CEFR từ A1 đến B2.</li>
              <li>Hệ thống ôn tập thẻ từ vựng thông minh (FSRS Spaced Repetition).</li>
              <li>Luyện nói phản xạ với nhận diện giọng nói từ trình duyệt.</li>
              <li>Theo dõi tiến độ và thói quen học hàng ngày.</li>
            </ul>
            <p>
              Dịch vụ hiện đang trong giai đoạn <strong>Open Beta</strong> và hoàn toàn miễn phí.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">3. Tài khoản Người dùng</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.</li>
              <li>Chỉ được tạo một tài khoản cho mỗi cá nhân.</li>
              <li>Không được sử dụng tài khoản cho mục đích thương mại hoặc chia sẻ hàng loạt.</li>
              <li>AtoEnglish có quyền tạm ngưng tài khoản vi phạm điều khoản.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">4. Sở hữu Trí tuệ</h2>
            <p>
              Toàn bộ nội dung bài học, thiết kế giao diện, và mã nguồn thuộc sở hữu của AtoEnglish. Bạn không được sao chép, phân phối lại hoặc sử dụng cho mục đích thương mại mà không có sự cho phép bằng văn bản.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">5. Giới hạn Trách nhiệm</h2>
            <p>
              AtoEnglish đang trong giai đoạn phát triển và có thể có lỗi hoặc gián đoạn dịch vụ. Chúng tôi không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">6. Thay đổi Điều khoản</h2>
            <p>
              Chúng tôi có thể cập nhật điều khoản này theo thời gian. Thông báo sẽ được gửi qua email đã đăng ký hoặc thông báo trên ứng dụng. Việc tiếp tục sử dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">7. Liên hệ</h2>
            <p>
              Mọi câu hỏi về điều khoản sử dụng, vui lòng liên hệ:{" "}
              <a
                href="mailto:support@atoenglish.com"
                className="text-emerald-600 dark:text-emerald-400 underline hover:no-underline font-medium"
              >
                support@atoenglish.com
              </a>
            </p>
          </section>
        </Prose>

        <div className="pt-8 border-t border-border/40 flex gap-4 text-sm">
          <Link href="/privacy" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
            Chính sách Bảo mật →
          </Link>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Về trang chủ
          </Link>
        </div>
      </Screen>
    </div>
  );
}

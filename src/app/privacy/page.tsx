import type { Metadata } from "next";
import Logo from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Chính sách Bảo mật | AtoEnglish",
  description: "Chính sách bảo mật dữ liệu người dùng của AtoEnglish.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans antialiased">
      {/* Nav */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40">
        <div className="max-w-4xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Logo size="sm" />
          <Link
            href="/"
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            ← Trang chủ
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24 space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Chính sách Bảo mật
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Cập nhật lần cuối: Tháng 6 năm 2025
          </p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">1. Thông tin chúng tôi thu thập</h2>
            <p>
              Khi bạn đăng ký và sử dụng AtoEnglish, chúng tôi thu thập các thông tin sau:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li><strong>Thông tin tài khoản</strong>: Email, tên hiển thị (từ Google OAuth hoặc bạn cung cấp).</li>
              <li><strong>Dữ liệu học tập</strong>: Tiến độ bài học, điểm XP, streak, lịch sử ôn tập thẻ từ vựng (SRS).</li>
              <li><strong>Dữ liệu kỹ thuật</strong>: Loại trình duyệt, thiết bị, dữ liệu hiệu suất ẩn danh (qua Vercel Speed Insights).</li>
            </ul>
            <p>
              Chúng tôi <strong>không thu thập</strong> dữ liệu giọng nói — tính năng luyện nói hoạt động hoàn toàn phía trình duyệt của bạn và không gửi lên máy chủ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">2. Cách chúng tôi sử dụng thông tin</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>Cung cấp và cải thiện dịch vụ học tập cá nhân hóa.</li>
              <li>Lưu lịch sử tiến độ và ôn tập theo thuật toán FSRS.</li>
              <li>Gửi thông báo nhắc nhở học hàng ngày (nếu bạn đồng ý).</li>
              <li>Phân tích tổng hợp ẩn danh để cải thiện nội dung bài học.</li>
            </ul>
            <p>
              Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">3. Lưu trữ và bảo mật dữ liệu</h2>
            <p>
              Dữ liệu được lưu trữ trên <strong>Supabase</strong> với mã hóa TLS và chính sách bảo mật hàng đầu. Chúng tôi áp dụng Row Level Security (RLS) — đảm bảo mỗi người dùng chỉ truy cập được dữ liệu của chính họ.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">4. Quyền của bạn</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-zinc-600 dark:text-zinc-400">
              <li>Yêu cầu xem, chỉnh sửa hoặc xóa dữ liệu cá nhân của bạn.</li>
              <li>Rút lại quyền truy cập Google OAuth bất cứ lúc nào.</li>
              <li>Xóa tài khoản hoàn toàn bằng cách liên hệ với chúng tôi.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">5. Liên hệ</h2>
            <p>
              Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ:{" "}
              <a
                href="mailto:support@atoenglish.com"
                className="text-emerald-600 dark:text-emerald-400 underline hover:no-underline font-medium"
              >
                support@atoenglish.com
              </a>
            </p>
          </section>
        </div>

        <div className="pt-8 border-t border-zinc-200/40 dark:border-zinc-800/40 flex gap-4 text-sm">
          <Link href="/terms" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
            Điều khoản Sử dụng →
          </Link>
          <Link href="/" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Về trang chủ
          </Link>
        </div>
      </main>
    </div>
  );
}

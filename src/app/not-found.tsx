import { StatLine } from "@/components/ui/page";
import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-zinc-950 text-white space-y-8">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* 404 Number */}
      <div className="relative">
        <span className="text-[120px] sm:text-[180px] font-black text-transparent bg-gradient-to-b from-emerald-500/20 to-transparent bg-clip-text leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Search className="size-10" />
          </div>
        </div>
      </div>

      <div className="space-y-3 max-w-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Trang không tồn tại
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Có vẻ như bạn lạc đường rồi. Trang này không tồn tại hoặc đã bị xóa.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all active:scale-[0.98]"
        >
          <Home className="size-4" />
          Trang chủ
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 text-sm font-bold hover:border-emerald-500/30 hover:text-white transition-all active:scale-[0.98]"
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

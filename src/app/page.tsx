"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Cpu,
  RotateCcw,
  Sparkles,
  Mic,
  ChevronRight,
  Check,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsAuthLoading(false);
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const steps = [
    {
      id: "01",
      title: "Nghe & Đọc (Input)",
      desc: "Nạp tiếng Anh tự nhiên qua các ngữ cảnh phong phú và bài đọc sinh động phù hợp với trình độ.",
      icon: BookOpen,
    },
    {
      id: "02",
      title: "Xử lý sâu (Processing)",
      desc: "Mổ xẻ từ vựng cốt lõi, cụm từ thực tế và phân tích sâu các cấu trúc ngữ pháp tiêu điểm.",
      icon: Cpu,
    },
    {
      id: "03",
      title: "Nói & Viết (Output)",
      desc: "Thực hành phản xạ nói ngay lập tức với kỹ thuật Shadowing và AI chấm điểm phát âm.",
      icon: Mic,
    },
    {
      id: "04",
      title: "Ôn tập thông minh (Review)",
      desc: "Thuật toán SRS tự động lên lịch nhắc nhở ôn tập vào thời điểm vàng để ghi nhớ dài hạn.",
      icon: RotateCcw,
    },
  ];

  const benefits = [
    {
      title: "Nói tự tin hơn sau mỗi bài học",
      desc: "Phương pháp học phản xạ buộc cơ miệng hoạt động, giúp bạn nói tự nhiên ngay sau bài học.",
    },
    {
      title: "Nhớ từ lâu nhờ hệ thống ôn tập thông minh",
      desc: "Thuật toán lặp lại ngắt quãng SRS tự động nhắc nhở ôn luyện vào thời điểm vàng để nhớ dài hạn.",
    },
    {
      title: "Luyện nói thực tế ngay trong app",
      desc: "Công nghệ AI Shadowing và kịch bản Roleplay nhập vai giúp bạn luyện nói tự nhiên mọi lúc mọi nơi.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100 h-16 flex items-center justify-between px-6 sm:px-12 transition-all">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-sm">
            A
          </span>
          <span className="text-lg font-bold tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors">
            AtoEnglish
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthLoading ? (
            <div className="h-9 w-20 bg-zinc-50 animate-pulse rounded-lg" />
          ) : user ? (
            <Link href="/dashboard">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-9 px-5 rounded-lg active:scale-[0.98] transition-all">
                Vào Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 h-9 px-4 rounded-lg">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-9 px-5 rounded-lg active:scale-[0.98] transition-all">
                  Bắt đầu miễn phí
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 sm:px-12 py-32 sm:py-44 flex flex-col items-center justify-center text-center max-w-5xl mx-auto space-y-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="space-y-8"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
            <Sparkles className="size-3.5" />
            Phương pháp học thế hệ mới
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.4] sm:leading-[1.35] lg:leading-[1.3] max-w-4xl mx-auto text-balance">
            Học tiếng Anh để nói được,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              không chỉ để biết.
            </span>
          </h1>
          <p className="text-lg sm:text-2xl text-zinc-500 max-w-3xl mx-auto font-normal leading-[1.6] tracking-tight">
            Phương pháp khoa học giúp xóa bỏ nỗi sợ nói và làm chủ giao tiếp tự nhiên từ con số 0.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-2"
        >
          {isAuthLoading ? (
            <div className="h-12 w-40 bg-zinc-50 animate-pulse rounded-full" />
          ) : (
            <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 px-8 rounded-full text-base shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                {user ? "Vào Dashboard" : "Bắt đầu miễn phí"}
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto text-zinc-600 hover:text-zinc-900 font-medium h-12 px-6 rounded-full text-base gap-1 hover:bg-zinc-50 hover:scale-[1.02] transition-all duration-300"
          >
            <span>Xem cách hoạt động</span>
            <ChevronRight className="size-4.5" />
          </Button>
        </motion.div>
      </section>

      {/* Section Vấn đề (Problem) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="bg-zinc-50 border-y border-zinc-100 py-28 px-6 sm:px-12 text-center max-w-none"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950">
            Bạn đã học nhiều năm nhưng vẫn ngại nói?
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 leading-[1.65] font-normal max-w-2xl mx-auto">
            Hàng trăm giờ học ngữ pháp trên giấy không giúp bạn phản xạ khi giao tiếp thực tế. Đã đến lúc chuyển hóa kiến thức thụ động thành phản xạ nói chủ động ngay sau mỗi bài học.
          </p>
        </div>
      </motion.section>

      {/* Section Cách AtoEnglish hoạt động (How it works) */}
      <section id="how-it-works" className="py-32 sm:py-40 px-6 sm:px-12 max-w-6xl mx-auto space-y-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center space-y-4"
        >
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900">
            Vòng lặp học tập toàn diện
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 max-w-xl mx-auto font-normal leading-relaxed">
            Quy trình 4 bước tối giản chuẩn khoa học giúp chuyển hóa ngoại ngữ thành phản xạ tự nhiên.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                variants={fadeInUp}
                className="group flex flex-col h-full bg-white border border-zinc-100 hover:border-emerald-500/30 p-8 rounded-2xl space-y-6 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                    <Icon className="size-6" />
                  </span>
                  <span className="text-3xl font-mono font-light text-zinc-200 group-hover:text-emerald-500 transition-colors duration-300">
                    {step.id}
                  </span>
                </div>
                <div className="space-y-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{step.title}</h3>
                  <p className="text-sm text-zinc-500 leading-[1.65] font-normal flex-1">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Section Bạn sẽ đạt được gì (Value Proposition) */}
      <section className="bg-zinc-50 py-32 sm:py-40 px-6 sm:px-12 max-w-none border-y border-zinc-100">
        <div className="max-w-4xl mx-auto space-y-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900">
              Kiến tạo phản xạ giao tiếp
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 max-w-xl mx-auto font-normal leading-relaxed">
              Định hình lại thói quen tự học ngoại ngữ và gặt hái kết quả thực tế.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="max-w-2xl mx-auto space-y-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex gap-5 items-start p-6 sm:p-8 rounded-2xl border border-zinc-100 bg-white hover:bg-zinc-50/50 hover:shadow-sm transition-all duration-300"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-1">
                  <Check className="size-3.5" />
                </span>
                <div className="space-y-2 text-left">
                  <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{benefit.title}</h3>
                  <p className="text-sm sm:text-base text-zinc-500 leading-[1.65] font-normal">
                    {benefit.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="py-32 sm:py-40 px-6 sm:px-12 text-center max-w-4xl mx-auto space-y-10"
      >
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 leading-none">
            Sẵn sàng bắt đầu hành trình?
          </h2>
          <p className="text-base sm:text-lg text-zinc-500 font-normal leading-relaxed">
            Bắt đầu rèn luyện phản xạ tiếng Anh ngay hôm nay cùng hàng nghìn học viên.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          {isAuthLoading ? (
            <div className="h-12 w-64 bg-zinc-50 animate-pulse rounded-full" />
          ) : (
            <Link href={user ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium h-12 px-8 rounded-full text-base shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                {user ? "Vào Dashboard ngay hôm nay" : "Bắt đầu miễn phí ngay hôm nay"}
              </Button>
            </Link>
          )}
          <span className="text-xs text-zinc-400 font-medium">
            Miễn phí. Không cần thẻ tín dụng.
          </span>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded bg-emerald-600 text-white font-bold text-xs">
            A
          </span>
          <span className="text-sm font-bold tracking-tight text-zinc-900">
            AtoEnglish
          </span>
        </div>

        <div className="text-xs text-zinc-400 font-normal">
          &copy; {new Date().getFullYear()} AtoEnglish. Bảo lưu mọi quyền.
        </div>

        <div className="flex items-center gap-4">
          {isAuthLoading ? (
            <div className="h-4 w-12 bg-zinc-50 animate-pulse rounded" />
          ) : user ? (
            <Link href="/dashboard" className="text-xs text-zinc-500 hover:text-zinc-900 font-bold transition-colors">
              Dashboard
            </Link>
          ) : (
            <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-900 font-bold transition-colors">
              Đăng nhập
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
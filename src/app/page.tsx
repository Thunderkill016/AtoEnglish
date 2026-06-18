"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LazyMotion, m } from "framer-motion";
import {
  BookOpen,
  Cpu,
  RotateCcw,
  Sparkles,
  Mic,
  ChevronRight,
  ArrowRight,
  Users,
  Target,
  Zap,
  MessageSquareOff,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

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

  // --- Animation Variants ---

  const fadeInUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const cardReveal = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  // --- Data ---

  const steps = [
    {
      id: "01",
      title: "Nghe & Đọc (Input)",
      desc: "Tiếp xúc với tiếng Anh thực tế qua các tình huống gần gũi, nghe và đọc theo người bản xứ.",
      icon: BookOpen,
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      id: "02",
      title: "Xử lý sâu (Processing)",
      desc: "Hiểu rõ từ vựng và cấu trúc câu qua bài tập tương tác, thay vì chỉ học vẹt.",
      icon: Cpu,
      gradient: "from-blue-500/10 to-indigo-500/10",
      iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "03",
      title: "Nói & Viết (Output)",
      desc: "Luyện nói ngay từ bài học đầu tiên qua Shadowing và Roleplay. Ghi âm và so sánh với mẫu chuẩn.",
      icon: Mic,
      gradient: "from-violet-500/10 to-purple-500/10",
      iconBg: "bg-violet-500/10 dark:bg-violet-500/15",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      id: "04",
      title: "Ôn tập thông minh (Review)",
      desc: "Hệ thống FSRS tự động nhắc nhở ôn đúng lúc, giúp kiến thức thực sự đi vào bộ nhớ dài hạn.",
      icon: RotateCcw,
      gradient: "from-amber-500/10 to-orange-500/10",
      iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Giảm nỗi sợ khi nói",
      desc: "Được luyện nói ngay từ những ngày đầu tiên, thay vì phải chờ đến khi “giỏi” rồi mới dám mở miệng.",
    },
    {
      icon: Target,
      title: "Nhớ lâu, dùng được ngay",
      desc: "Hệ thống ôn tập thông minh giúp kiến thức thực sự ở lại, và bạn có thể sử dụng khi cần giao tiếp.",
    },
    {
      icon: Mic,
      title: "Luyện nói thực tế ngay trong app",
      desc: "Shadowing và Roleplay giúp bạn tập phản xạ như đang nói chuyện thật, thay vì chỉ học lý thuyết.",
    },
  ];



  const stats = [
    { value: "2,500+", label: "Người học" },
    { value: "15 phút", label: "Mỗi ngày là đủ" },
    { value: "94%", label: "Cải thiện sau 30 ngày" },
  ];

  return (
    <LazyMotion features={loadFeatures} strict>
      <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900/40 selection:text-emerald-900 dark:selection:text-emerald-100 overflow-x-hidden">
      {/* ===== Navigation Bar ===== */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-sm">
              A
            </span>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200">
              AtoEnglish
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {isAuthLoading ? (
              <div className="h-9 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />
            ) : user ? (
              <Link href="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-9 px-5 rounded-lg active:scale-[0.97] transition-all shadow-sm">
                  Vào Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-9 px-4 rounded-lg transition-colors"
                  >
                    Đăng nhập
                  </Button>
                </Link>
                <Link href="/login">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-9 px-5 rounded-lg active:scale-[0.97] transition-all shadow-sm">
                    Bắt đầu miễn phí
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <section className="relative px-5 sm:px-8 pt-24 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-32">
        {/* Subtle gradient background orb */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 uppercase tracking-[0.12em] shadow-sm">
                <Sparkles className="size-3" />
                Phương pháp học thế hệ mới
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-in-up animation-delay-75 text-[2.25rem] leading-[1.12] sm:text-5xl sm:leading-[1.1] lg:text-[3.75rem] lg:leading-[1.08] font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl mx-auto">
              Học tiếng Anh để <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">nói được</span>,
              <br />
              không chỉ để biết.
            </h1>

            {/* Subheadline */}
            <p className="animate-fade-in-up animation-delay-150 text-base sm:text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Phương pháp khoa học giúp bạn tự tin giao tiếp thực tế từ con số 0.
              <br className="hidden sm:block" />
              Luyện nói ngay từ những bài học đầu tiên.
            </p>

            {/* CTAs */}
            <div className="animate-fade-in-up animation-delay-225 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full">
              {isAuthLoading ? (
                <div className="h-[52px] w-52 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-full" />
              ) : (
                <Link
                  href={user ? "/dashboard" : "/login"}
                  className="w-full sm:w-auto"
                >
                  <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold h-[52px] px-9 rounded-full text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 gap-2">
                    {user ? "Vào Dashboard" : "Bắt đầu miễn phí"}
                    <ArrowRight className="size-4" />
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold h-[52px] px-8 rounded-full text-base gap-1.5 transition-all duration-200"
              >
                <span>Xem cách học</span>
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-in-up animation-delay-300 relative max-w-2xl mx-auto mt-16 sm:mt-20">
          <div className="flex items-center justify-center divide-x divide-zinc-200 dark:divide-zinc-800">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center px-6 sm:px-10 py-2"
              >
                <span className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Problem Section — sharper, more empathetic ===== */}
      <m.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="bg-zinc-50 dark:bg-zinc-900/10 border-y border-zinc-200/50 dark:border-zinc-800/50 py-24 sm:py-32 px-5 sm:px-8"
      >
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Empathetic silent icon */}
          <m.div 
            variants={fadeInUp}
            className="flex justify-center animate-float-slow"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 shadow-inner">
              <MessageSquareOff className="size-6" />
            </span>
          </m.div>

          <m.h2
            variants={fadeInUp}
            className="text-[2rem] sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight max-w-3xl mx-auto"
          >
            Bạn đã học nhiều năm nhưng vẫn ngại nói?
          </m.h2>

          <m.div
            variants={fadeInUp}
            className="space-y-6 text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            <p>
              Hàng trăm giờ học ngữ pháp, thuộc hàng nghìn từ vựng…
              <br />
              nhưng khi cần mở miệng giao tiếp thật thì lại im lặng.
            </p>
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">
              Bạn không thiếu kiến thức.
              <br />
              Bạn thiếu môi trường để luyện nói một cách an toàn và có hệ thống.
            </p>
            <p className="text-emerald-600 dark:text-emerald-400 font-bold">
              AtoEnglish được xây dựng để giải quyết đúng vấn đề này.
            </p>
          </m.div>
        </div>
      </m.section>

      {/* ===== IPOR Section (How it works) ===== */}
      <section
        id="how-it-works"
        className="py-20 sm:py-28 lg:py-36 px-5 sm:px-8"
      >
        <div className="max-w-6xl mx-auto space-y-14 sm:space-y-20">
          {/* Section Header */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Cách học giúp bạn nói được nhanh nhất
            </h2>
            <p className="text-[15px] sm:text-base lg:text-lg text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              Chỉ 4 bước lặp lại mỗi ngày — giúp bạn chuyển từ “học thuộc” sang “nói tự tin”.
            </p>
          </m.div>

          {/* 4 Cards Grid — always shows all 4 */}
          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <m.div
                  key={step.id}
                  variants={cardReveal}
                  className={`group relative flex flex-col h-full bg-gradient-to-br ${step.gradient} border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 p-6 sm:p-7 lg:p-8 rounded-2xl space-y-5 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex size-11 sm:size-12 items-center justify-center rounded-xl ${step.iconBg} ${step.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="size-5 sm:size-6" />
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-extralight text-zinc-300 dark:text-zinc-700 group-hover:text-emerald-500/60 dark:group-hover:text-emerald-400/40 transition-colors duration-300">
                      {step.id}
                    </span>
                  </div>
                  <div className="space-y-2.5 flex-1 flex flex-col">
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1">
                      {step.desc}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      {/* ===== Benefits Section — result-focused ===== */}
      <section className="bg-zinc-50 dark:bg-zinc-900/30 py-20 sm:py-28 lg:py-36 px-5 sm:px-8 border-y border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-6xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Header */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Bạn sẽ thay đổi như thế nào
            </h2>
          </m.div>

          {/* Benefit Cards Grid */}
          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {benefits.map((benefit, index) => {
              const BenefitIcon = benefit.icon;
              return (
                <m.div
                  key={index}
                  variants={cardReveal}
                  className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                    <BenefitIcon className="size-6" strokeWidth={2} />
                  </span>
                  <div className="space-y-3 text-left">
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                      {benefit.desc}
                    </p>
                  </div>
                </m.div>
              );
            })}
          </m.div>
        </div>
      </section>

      {/* ===== Social Proof / Science Section ===== */}
      <section className="py-20 sm:py-28 lg:py-36 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-14 sm:space-y-16">
          {/* Section Header */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center space-y-4"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-[2.75rem] font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight max-w-2xl mx-auto">
              Được xây dựng dựa trên khoa học, dành riêng cho người Việt
            </h2>
          </m.div>

          {/* Pillars Grid */}
          <m.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {/* Pillar 1 */}
            <m.div
              variants={cardReveal}
              className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="size-6" strokeWidth={2} />
              </span>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  Phương pháp IPOR & FSRS
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  Phương pháp học IPOR (Input → Processing → Output → Review) kết hợp FSRS (hệ thống ôn tập thông minh) — được chứng minh hiệu quả trong việc học ngôn ngữ.
                </p>
              </div>
            </m.div>

            {/* Pillar 2 */}
            <m.div
              variants={cardReveal}
              className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Users className="size-6" strokeWidth={2} />
              </span>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  Dành riêng cho người Việt
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  Được thiết kế dành riêng cho người Việt bắt đầu từ con số 0, đặc biệt là những người từng học nhiều nhưng vẫn ngại nói.
                </p>
              </div>
            </m.div>

            {/* Pillar 3 */}
            <m.div
              variants={cardReveal}
              className="flex flex-col items-start p-6 sm:p-8 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 hover:shadow-lg hover:shadow-zinc-900/[0.04] dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-300 space-y-5"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="size-6" strokeWidth={2} />
              </span>
              <div className="space-y-3 text-left">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-snug">
                  Đồng hành cùng phát triển
                </h3>
                <p className="text-sm sm:text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
                  Hiện đang trong giai đoạn phát triển cùng những người dùng đầu tiên.
                </p>
              </div>
            </m.div>
          </m.div>

          {/* Honest bottom quote */}
          <m.p
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="text-center text-xs sm:text-sm text-zinc-400 dark:text-zinc-500 max-w-2xl mx-auto leading-relaxed font-normal italic"
          >
            Chúng tôi đang xây dựng AtoEnglish cùng với những người học đầu tiên. Phản hồi của bạn sẽ giúp chúng tôi cải thiện sản phẩm tốt hơn.
          </m.p>
        </div>
      </section>

      {/* ===== Final CTA Section — bigger, bolder ===== */}
      <m.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
        className="relative py-24 sm:py-32 lg:py-40 px-5 sm:px-8 overflow-hidden"
      >
        {/* Background glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center space-y-8 sm:space-y-10">
          <m.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Sẵn sàng bắt đầu hành trình nói tiếng Anh tự tin?
            </h2>
            <p className="text-[15px] sm:text-base lg:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto font-normal">
              Học miễn phí ngay hôm nay. Không cần thẻ tín dụng.
            </p>
          </m.div>

          <m.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-4"
          >
            {isAuthLoading ? (
              <div className="h-14 w-72 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-full" />
            ) : (
              <Link
                href={user ? "/dashboard" : "/login"}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold h-14 px-10 rounded-full text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 gap-2.5">
                  {user
                    ? "Vào Dashboard ngay"
                    : "Bắt đầu miễn phí ngay hôm nay"}
                  <ArrowRight className="size-4.5" />
                </Button>
              </Link>
            )}
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
              Miễn phí. Không cần thẻ tín dụng. Hủy bất cứ lúc nào.
            </div>
          </m.div>
        </div>
      </m.section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 py-10 sm:py-12 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-md bg-emerald-600 text-white font-bold text-xs">
              A
            </span>
            <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              AtoEnglish
            </span>
          </div>

          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-normal">
            &copy; {new Date().getFullYear()} AtoEnglish. Bảo lưu mọi quyền.
          </span>

          <div className="flex items-center gap-4">
            {isAuthLoading ? (
              <div className="h-4 w-14 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-colors"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
    </LazyMotion>
  );
}
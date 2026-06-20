"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Map,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface RoadmapLevel {
  code: "A1" | "A2" | "B1" | "B2" | "C1";
  name: string;
  desc: string;
  lessonsCount: number;
  completedPercent: number;
  status: "completed" | "active" | "locked";
  topics: string[];
}

export default function RoadmapPage() {
  const router = useRouter();
  const levels: RoadmapLevel[] = [
    {
      code: "A1",
      name: "Elementary (Cơ bản)",
      desc: "Xây dựng nền tảng vững chắc: Học phát âm chuẩn IPA, chào hỏi cơ bản, tự giới thiệu bản thân và cấu trúc câu hiện tại đơn giản.",
      lessonsCount: 12,
      completedPercent: 100,
      status: "completed",
      topics: ["Bảng phiên âm IPA", "Chào hỏi & Bản thân", "Gia đình & Đời sống"],
    },
    {
      code: "A2",
      name: "Pre-Intermediate (Sơ trung cấp)",
      desc: "Mở rộng giao tiếp thường nhật: Mua sắm, mô tả trải nghiệm du lịch, nói về sở thích cá nhân. Thì quá khứ đơn và động từ khuyết thiếu.",
      lessonsCount: 18,
      completedPercent: 100,
      status: "completed",
      topics: ["Giao dịch & Mua sắm", "Kể chuyện quá khứ", "Lối sống & Sở thích"],
    },
    {
      code: "B1",
      name: "Intermediate (Trung cấp)",
      desc: "Làm chủ chủ đề học thuật và công việc: Diễn đạt ý kiến cá nhân, ước mơ, nói về công nghệ & xã hội. Viết các đoạn luận ngắn mạch lạc.",
      lessonsCount: 24,
      completedPercent: 45,
      status: "active",
      topics: ["Công nghệ & Xã hội", "Môi trường học tập", "Giao tiếp công sở"],
    },
    {
      code: "B2",
      name: "Upper-Intermediate (Trên trung cấp)",
      desc: "Tranh luận tự tin: Trình bày ý kiến đa chiều về các vấn đề xã hội phức tạp, đọc hiểu báo chí quốc tế. Sử dụng câu điều kiện hỗn hợp.",
      lessonsCount: 30,
      completedPercent: 0,
      status: "locked",
      topics: ["Kinh tế & Đầu tư", "Văn hóa & Toàn cầu", "Tranh luận nâng cao"],
    },
    {
      code: "C1",
      name: "Advanced (Cao cấp)",
      desc: "Tiếng Anh học thuật & Chuyên sâu: Sử dụng từ vựng đa dạng, tự nhiên như người bản xứ. Sẵn sàng viết luận văn và nghiên cứu khoa học.",
      lessonsCount: 36,
      completedPercent: 0,
      status: "locked",
      topics: ["Nghiên cứu khoa học", "Văn học nghệ thuật", "Lãnh đạo & Tổ chức"],
    },
  ];

  return (
    <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
      {/* Soft background ambient blurs */}
      <div className="absolute top-10 left-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-foreground/[0.05]"
      >
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Map className="size-3.5 animate-pulse" />
            Lộ trình học chuẩn CEFR
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-1">
            Bản đồ lộ trình A1 → C1
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Bản đồ tự học tiếng Anh cá nhân hóa. Chinh phục từng chặng để đạt mục tiêu của bạn.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 rounded-2xl bg-glass border border-glass px-4.5 py-3 text-xs sm:text-sm font-bold text-foreground shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <TrendingUp className="size-4.5 text-primary animate-pulse" />
          <span>Tổng tiến độ: {Math.round(levels.reduce((sum, l) => sum + l.completedPercent, 0) / levels.length)}% hoàn thành</span>
        </div>
      </motion.div>

      {/* Alternating Timeline Layout (Snake Path) */}
      <div className="relative space-y-16 py-8">
        
        {/* Draw Line in Background (Desktop only) */}
        <div className="absolute left-8 lg:left-1/2 lg:-translate-x-1/2 top-10 bottom-10 w-1 bg-foreground/[0.04] -z-10 rounded-full" />
        
        {/* Active Part of Timeline Line */}
        <motion.div 
          initial={{ height: 0 }}
          animate={{ height: "55%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute left-8 lg:left-1/2 lg:-translate-x-1/2 top-10 w-1 bg-gradient-to-b from-primary via-primary to-emerald-400 -z-10 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.2)]"
        />

        {levels.map((lvl, index) => {
          const isCompleted = lvl.status === "completed";
          const isActive = lvl.status === "active";
          const isLocked = lvl.status === "locked";
          const isEven = index % 2 === 0;

          return (
            <div 
              key={lvl.code} 
              className={`relative flex flex-col lg:flex-row items-start lg:items-center ${
                isEven ? "lg:justify-start" : "lg:justify-end"
              } pl-16 lg:pl-0`}
            >
              
              {/* Timeline Center Node */}
              <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 top-1 lg:top-auto z-20 flex items-center justify-center">
                {isCompleted && (
                  <motion.span 
                    whileHover={{ scale: 1.1 }}
                    className="flex size-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-4 border-background"
                  >
                    <CheckCircle2 className="size-5" />
                  </motion.span>
                )}
                {isActive && (
                  <motion.span 
                    animate={{
                      boxShadow: [
                        "0 0 0 0px oklch(var(--primary) / 0.4)",
                        "0 0 0 12px oklch(var(--primary) / 0)",
                      ],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                    }}
                    whileHover={{ scale: 1.1 }}
                    className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg border-4 border-background"
                  >
                    <Sparkles className="size-5 animate-pulse" />
                  </motion.span>
                )}
                {isLocked && (
                  <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground border-4 border-background">
                    <Lock className="size-4" />
                  </span>
                )}
              </div>

              {/* Card Container (Takes 45% width on desktop) */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, type: "spring", stiffness: 90 }}
                className={`w-full lg:w-[46%] rounded-3xl border p-6 sm:p-7 bg-glass border-glass shadow-[0_8px_30px_rgb(0,0,0,0.015)] ${
                  isActive
                    ? "ring-1 ring-primary/35 border-primary/20 shadow-[0_8px_35px_oklch(var(--primary)/0.03)]"
                    : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black px-3.5 py-1 rounded-lg ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                          : isActive
                          ? "bg-primary/20 text-primary border border-primary/20 animate-pulse"
                          : "bg-muted text-muted-foreground border border-border/40"
                      }`}>
                        LEVEL {lvl.code}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                          Đang chinh phục
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-foreground mt-1 leading-tight">
                      {lvl.name}
                    </h3>
                  </div>

                  {/* Level Progress Indicator */}
                  <div className="w-full sm:w-48 space-y-1.5 shrink-0">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                      <span>{lvl.lessonsCount} bài học</span>
                      <span className="text-foreground">{lvl.completedPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
                      <motion.div
                        className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${lvl.completedPercent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-5 font-normal">
                  {lvl.desc}
                </p>

                {/* Topics list */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {lvl.topics.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground/75 bg-foreground/[0.02] px-3 py-1.5 rounded-xl border border-foreground/[0.04]">
                      <BookOpen className="size-3.5 text-muted-foreground" />
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA Action button */}
                <div className="flex justify-end pt-4 border-t border-foreground/[0.04]">
                  {isCompleted ? (
                    <Button variant="outline" className="rounded-xl text-xs gap-1.5 border-glass h-11 px-5 hover:bg-muted font-bold active:scale-[0.98] transition-all duration-200">
                      <Award className="size-4.5 text-yellow-500" />
                      <span>Xem chứng nhận chặng {lvl.code}</span>
                    </Button>
                  ) : isActive ? (
                    <Button 
                      onClick={() => router.push("/learn")} 
                      className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl text-xs font-bold gap-2 shadow-md shadow-primary/10 active:scale-[0.98] h-11 px-5 flex items-center transition-all duration-200"
                    >
                      <Play className="size-3.5 fill-current" />
                      <span>Học tiếp ngay</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="rounded-xl text-xs gap-1.5 opacity-55 border-glass h-11 px-5">
                      <Lock className="size-4" />
                      <span>Cần hoàn thành chặng trước</span>
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
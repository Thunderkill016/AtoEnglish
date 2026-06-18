"use client";

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
  const levels: RoadmapLevel[] = [
    {
      code: "A1",
      name: "Elementary (Cơ bản)",
      desc: "Xây dựng nền tảng vững chắc: Học phát âm chuẩn IPA, các từ vựng chào hỏi cơ bản, tự giới thiệu bản thân và cấu trúc ngữ pháp hiện tại đơn giản.",
      lessonsCount: 12,
      completedPercent: 100,
      status: "completed",
      topics: ["Bảng phiên âm IPA", "Chào hỏi & Bản thân", "Gia đình & Môi trường sống"],
    },
    {
      code: "A2",
      name: "Pre-Intermediate (Sơ trung cấp)",
      desc: "Mở rộng giao tiếp thường nhật: Mua sắm, mô tả trải nghiệm du lịch, nói về sở thích cá nhân. Làm quen với các thì quá khứ đơn, tương lai đơn và động từ khuyết thiếu.",
      lessonsCount: 18,
      completedPercent: 100,
      status: "completed",
      topics: ["Giao dịch & Mua sắm", "Kể chuyện quá khứ", "Sở thích & Lối sống"],
    },
    {
      code: "B1",
      name: "Intermediate (Trung cấp - HIỆN TẠI)",
      desc: "Làm chủ các chủ đề học thuật và công việc: Diễn đạt ý kiến cá nhân, ước mơ, nói về công nghệ & xã hội (IPOR model). Học cách viết các đoạn văn luận ngắn mạch lạc.",
      lessonsCount: 24,
      completedPercent: 45,
      status: "active",
      topics: ["Công nghệ & Xã hội", "Môi trường học tập", "Giao tiếp công sở"],
    },
    {
      code: "B2",
      name: "Upper-Intermediate (Trên trung cấp)",
      desc: "Tranh luận tự tin: Trình bày ý kiến đa chiều về các vấn đề xã hội phức tạp, đọc hiểu báo chí quốc tế và tài liệu chuyên ngành. Sử dụng các cấu trúc đảo ngữ, câu điều kiện hỗn hợp.",
      lessonsCount: 30,
      completedPercent: 0,
      status: "locked",
      topics: ["Kinh tế & Đầu tư", "Văn hóa & Toàn cầu hóa", "Tranh luận nâng cao"],
    },
    {
      code: "C1",
      name: "Advanced (Cao cấp)",
      desc: "Tiếng Anh học thuật & Chuyên sâu: Sử dụng từ vựng đa dạng, tự nhiên như người bản xứ trong cả văn phong trang trọng và đời thường. Sẵn sàng viết luận văn và nghiên cứu khoa học.",
      lessonsCount: 36,
      completedPercent: 0,
      status: "locked",
      topics: ["Nghiên cứu khoa học", "Văn học & Nghệ thuật", "Lãnh đạo & Tổ chức"],
    },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-10 left-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header */}
      <div className="border-b border-border/40 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10">
            <Map className="size-3.5" />
            Lộ trình học chuẩn CEFR
          </span>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Bản đồ lộ trình A1 → C1
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Con đường học tập tiếng Anh cá nhân hóa rõ ràng, giúp bạn duy trì tính kỷ luật và kiên trì.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 rounded-xl bg-glass border border-glass px-4 py-2 text-xs font-semibold text-foreground">
          <TrendingUp className="size-4 text-primary" />
          <span>Tổng tiến độ: 49% hoàn thành</span>
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="relative pl-6 sm:pl-10 space-y-12">
        {/* Glowing Connected Timeline Line */}
        <div className="absolute left-10 sm:left-14 top-4 bottom-4 w-0.5 bg-muted-foreground/20 -translate-x-1/2 -z-10" />
        
        {/* Glow Active portion of line */}
        <div className="absolute left-10 sm:left-14 top-4 h-[55%] w-0.5 bg-gradient-to-b from-primary via-primary to-emerald-400 -translate-x-1/2 -z-10 shadow-[0_0_10px_rgba(34,197,94,0.3)]" />

        {/* Level List */}
        {levels.map((lvl) => {
          const isCompleted = lvl.status === "completed";
          const isActive = lvl.status === "active";
          const isLocked = lvl.status === "locked";

          return (
            <div key={lvl.code} className="relative group">
              {/* Timeline Node Icon */}
              <div className="absolute -left-10 sm:-left-14 top-1 -translate-x-1/2 z-10 flex items-center justify-center">
                {isCompleted && (
                  <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md border-4 border-background transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle2 className="size-4.5 sm:size-5" />
                  </span>
                )}
                {isActive && (
                  <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.4)] border-4 border-background animate-pulse transition-transform duration-300 group-hover:scale-110">
                    <Sparkles className="size-4.5 sm:size-5 animate-pulse" />
                  </span>
                )}
                {isLocked && (
                  <span className="flex size-9 sm:size-10 items-center justify-center rounded-full bg-muted text-muted-foreground border-4 border-background">
                    <Lock className="size-3.5 sm:size-4" />
                  </span>
                )}
              </div>

              {/* Level Details Card */}
              <div className={`rounded-3xl border p-6 bg-glass border-glass shadow-[0_4px_25px_rgba(0,0,0,0.01)] transition-all duration-300 ${
                isActive
                  ? "ring-1 ring-primary/40 border-primary/20 shadow-primary/5 hover:shadow-primary/10"
                  : "hover:border-border/80"
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg ${
                        isCompleted
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                          : isActive
                          ? "bg-primary/20 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border/40"
                      }`}>
                        LEVEL {lvl.code}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary animate-pulse">
                          Đang học bài này
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mt-1">
                      {lvl.name}
                    </h3>
                  </div>

                  {/* Level Progress */}
                  <div className="w-full md:w-48 space-y-1.5 shrink-0">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>Bài học: {lvl.lessonsCount} bài</span>
                      <span className="font-semibold text-foreground">{lvl.completedPercent}% hoàn thành</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                        style={{ width: `${lvl.completedPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {lvl.desc}
                </p>

                {/* Sub topics chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {lvl.topics.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 text-[11px] font-medium text-foreground/70 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">
                      <BookOpen className="size-3 text-muted-foreground" />
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="flex justify-end pt-3 border-t border-border/40">
                  {isCompleted ? (
                    <Button variant="outline" className="rounded-xl text-xs gap-1.5">
                      <Award className="size-4 text-yellow-500" />
                      Xem lại chứng chỉ Level {lvl.code}
                    </Button>
                  ) : isActive ? (
                    <Button onClick={() => window.location.href = "/learn"} className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl text-xs font-semibold gap-1.5 shadow-md shadow-primary/10">
                      <Play className="size-3.5 fill-current" />
                      Học tiếp B1 ngay bây giờ
                      <ArrowRight className="size-3.5" />
                    </Button>
                  ) : (
                    <Button disabled variant="outline" className="rounded-xl text-xs gap-1 opacity-60">
                      <Lock className="size-3.5" />
                      Cần hoàn thành B1 trước
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
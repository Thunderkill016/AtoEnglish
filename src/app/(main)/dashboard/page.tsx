import Link from "next/link";
import {
  Flame,
  BookOpen,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const currentStreak = 5;
  const xpCurrent = 35;
  const xpTarget = 50;
  const dueCardsCount = 12;

  // SVG parameters for circular progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const xpPercentage = (xpCurrent / xpTarget) * 100;
  const strokeDashoffset = circumference - (xpPercentage / 100) * circumference;

  const dailyQuests = [
    { id: 1, text: "Học 1 bài mới (Input & Processing)", xp: "+20 XP", completed: true },
    { id: 2, text: "Ôn tập 10 thẻ SRS vựng", xp: "+15 XP", completed: false },
    { id: 3, text: "Đặt 3 câu thực tế (Output)", xp: "+15 XP", completed: false },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Soft background ambient blur */}
      <div className="absolute top-10 right-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 left-10 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Greeting Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider">
            <Sparkles className="size-3.5" />
            <span>Chào mừng bạn trở lại</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
            Học tập mỗi ngày cùng AtoEnglish
          </h1>
          <p className="text-sm text-muted-foreground">
            Lộ trình tự học cá nhân hóa B1 Intermediate theo mô hình IPOR & Spaced Repetition.
          </p>
        </div>
        
        {/* User Level Badge */}
        <div className="shrink-0 flex items-center gap-3 rounded-2xl bg-glass border border-glass p-3 shadow-[0_8px_30px_rgb(0,0,0,0.01)]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-4.5" />
          </span>
          <div>
            <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Trình độ hiện tại</div>
            <div className="text-xs font-bold text-foreground">B1 Intermediate</div>
          </div>
        </div>
      </div>

      {/* Asymmetric Dashboard Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* LEFT COLUMN: Main Learning Activities (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Recommended Lesson Card */}
          <div className="group rounded-3xl border border-glass bg-glass p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 flex flex-col justify-between min-h-[260px] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-primary">
              <BookOpen className="size-36" />
            </div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Bài học gợi ý tiếp theo</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                  Pha 2: Processing
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                  Unit 4: Technology & Society
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Phân tích ngữ pháp chuyên sâu, giải nghĩa cấu trúc &quot;used to / get used to&quot; thông qua các ngữ cảnh thực tế của bài đọc công nghệ xã hội.
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <span className="text-[11px] bg-muted/65 text-muted-foreground px-2 py-0.5 rounded-lg border border-border/40 font-medium">Từ vựng (+10)</span>
                <span className="text-[11px] bg-muted/65 text-muted-foreground px-2 py-0.5 rounded-lg border border-border/40 font-medium">Nghe hiểu</span>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border/40 relative z-10">
              <Link href="/learn">
                <Button className="w-full h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl flex items-center justify-between px-4 group/btn transition-all duration-300">
                  <span>Vào học tiếp bài này</span>
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Daily Quests Card */}
          <div className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-foreground">Nhiệm vụ hôm nay</h3>
                <p className="text-xs text-muted-foreground">Hoàn thành nhiệm vụ để duy trì nhịp học</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                1 / 3 Hoàn thành
              </span>
            </div>
            
            <div className="space-y-4">
              {dailyQuests.map((quest) => (
                <div key={quest.id} className="flex items-center gap-4 text-sm p-2 rounded-xl hover:bg-muted/30 transition-colors">
                  <span className="shrink-0 text-primary">
                    {quest.completed ? (
                      <CheckCircle2 className="size-5 fill-primary text-primary-foreground" />
                    ) : (
                      <Circle className="size-5 text-muted-foreground hover:text-primary transition-colors cursor-pointer" />
                    )}
                  </span>
                  <div className="flex-1 leading-tight">
                    <p className={quest.completed ? "text-muted-foreground line-through decoration-1" : "text-foreground font-semibold"}>
                      {quest.text}
                    </p>
                  </div>
                  <span className="text-xs font-bold font-mono text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded-md border border-border/40">{quest.xp}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Circular Stats & SRS Call-to-action (1/3 width) */}
        <div className="space-y-8">
          
          {/* Circular Progress XP Card */}
          <div className="rounded-3xl border border-glass bg-glass p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider w-full text-left">
              Tiến trình XP Ngày
            </h3>
            
            {/* SVG Circular Ring */}
            <div className="relative size-32 flex items-center justify-center">
              <svg className="size-full transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-muted fill-none"
                  strokeWidth="8"
                />
                {/* Active Indicator */}
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  className="stroke-primary fill-none transition-all duration-500 ease-out"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inside Text */}
              <div className="absolute flex flex-col items-center leading-none">
                <span className="text-2xl font-extrabold text-foreground">{Math.round(xpPercentage)}%</span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mt-1">{xpCurrent} / {xpTarget} XP</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Còn {xpTarget - xpCurrent} XP nữa để đạt mục tiêu</p>
              <p className="text-[10px] text-muted-foreground">Mục tiêu hằng ngày giúp bạn tăng cường trí nhớ hiệu quả.</p>
            </div>
          </div>

          {/* Minimalist Streak Card */}
          <div className="rounded-3xl border border-glass bg-glass p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Chuỗi học tập</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-foreground">{currentStreak}</span>
                <span className="text-xs text-muted-foreground font-medium">ngày liên tiếp</span>
              </div>
            </div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 animate-flame">
              <Flame className="size-6 fill-orange-500" />
            </span>
          </div>

          {/* Flashcards SRS Practice Card */}
          <div className="group rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-[0_8px_30px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[160px]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/20">
                  <Layers className="size-3" />
                  SRS Review
                </span>
                <span className="text-xs font-bold text-primary font-mono">{dueCardsCount} thẻ cần học</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Đã đến lịch ôn tập của bạn. Thuật toán SRS lặp lại ngắt quãng sẽ tự chọn các từ bạn sắp quên để giúp bạn ôn lại hiệu quả.
              </p>
            </div>
            
            <div className="pt-3">
              <Link href="/flashcards">
                <Button className="w-full h-10 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl text-xs flex items-center justify-between px-3 group/btn transition-all duration-300">
                  <span>Luyện tập ngay</span>
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </Button>
              </Link>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
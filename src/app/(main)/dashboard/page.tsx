import Link from "next/link";
import {
  Flame,
  Trophy,
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
  // Mock data for a highly personalized feel
  const currentStreak = 5;
  const xpCurrent = 35;
  const xpTarget = 50;
  const xpPercentage = (xpCurrent / xpTarget) * 100;
  const dueCardsCount = 12;

  const dailyQuests = [
    { id: 1, text: "Học 1 bài mới (Input & Processing)", xp: "+20 XP", completed: true },
    { id: 2, text: "Ôn tập 10 thẻ SRS vựng", xp: "+15 XP", completed: false },
    { id: 3, text: "Đặt 3 câu thực tế (Output)", xp: "+15 XP", completed: false },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 -z-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Greeting Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            <span>Chào mừng bạn trở lại, Người học kiên trì!</span>
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text">
            Học tập mỗi ngày cùng AtoEnglish
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Tiến trình cá nhân hóa của bạn dựa trên lộ trình A1 → C1 và mô hình IPOR.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-glass border border-glass p-3 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <div className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Trình độ hiện tại</div>
            <div className="text-sm font-bold text-foreground">B1 Intermediate</div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Streak Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-glass border border-glass p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 size-24 text-orange-500/5 transition-transform duration-500 group-hover:scale-125">
            <Flame className="size-full" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Streak hiện tại</span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 animate-flame">
              <Flame className="size-5 fill-orange-500" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">{currentStreak}</span>
            <span className="text-sm font-medium text-muted-foreground">ngày liên tiếp</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Bạn đang làm rất tốt! Hãy duy trì chuỗi học để củng cố trí nhớ dài hạn.
          </p>
        </div>

        {/* Daily XP Progress Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-glass border border-glass p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
          <div className="absolute -right-6 -bottom-6 size-24 text-primary/5 transition-transform duration-500 group-hover:scale-125">
            <Trophy className="size-full" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Kinh nghiệm hôm nay</span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="size-5" />
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-foreground">{xpCurrent}</span>
            <span className="text-sm font-medium text-muted-foreground">/ {xpTarget} XP</span>
          </div>
          {/* Progress bar */}
          <div className="mt-4 space-y-2">
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Còn {xpTarget - xpCurrent} XP nữa để đạt mục tiêu</span>
              <span>{Math.round(xpPercentage)}%</span>
            </div>
          </div>
        </div>

        {/* Daily Quests Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-glass border border-glass p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-muted-foreground">Nhiệm vụ hôm nay</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              1 / 3 Hoàn thành
            </span>
          </div>
          <div className="space-y-3">
            {dailyQuests.map((quest) => (
              <div key={quest.id} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 shrink-0 text-primary">
                  {quest.completed ? (
                    <CheckCircle2 className="size-4.5 fill-primary text-primary-foreground" />
                  ) : (
                    <Circle className="size-4.5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </span>
                <div className="flex-1 leading-tight">
                  <p className={quest.completed ? "text-muted-foreground line-through decoration-1" : "text-foreground font-medium"}>
                    {quest.text}
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">{quest.xp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SRS Practice Call-to-action Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] dark:shadow-none animate-glow-pulse">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Layers className="size-32" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">
              <Layers className="size-3.5" />
              <span>Spaced Repetition System (SRS)</span>
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Bạn có <span className="text-primary underline decoration-2 underline-offset-4">{dueCardsCount} từ vựng</span> cần ôn tập hôm nay!
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base leading-relaxed">
              Thuật toán lặp lại ngắt quãng thông minh sẽ giúp bạn ghi nhớ sâu các từ vựng này vào vùng trí nhớ dài hạn ngay trước khi chúng bắt đầu mờ nhạt.
            </p>
          </div>
          <Link href="/flashcards" className="shrink-0">
            <Button size="lg" className="h-12 px-6 rounded-xl font-medium shadow-lg hover:shadow-primary/20 bg-primary hover:bg-primary/95 text-primary-foreground flex items-center gap-2 group transition-all duration-300 hover:translate-x-1">
              Bắt đầu ôn tập ngay
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Current Roadmap & IPOR Step */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommended Lesson card */}
        <div className="group rounded-2xl bg-glass border border-glass p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bài học gợi ý tiếp theo</span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <BookOpen className="size-3" />
                <span>Pha 2: Processing</span>
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                Unit 4: Technology & Society
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Phân tích ngữ pháp chuyên sâu, giải nghĩa cấu trúc &quot;used to / get used to&quot; thông qua các ngữ cảnh thực tế của bài đọc.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">Từ vựng (+10)</span>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md">Nghe hiểu</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border/40">
            <Link href="/learn">
              <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary group text-foreground font-medium rounded-xl p-3">
                <span>Vào học tiếp bài này</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Level Roadmap preview */}
        <div className="group rounded-2xl bg-glass border border-glass p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lộ trình học tập</span>
              <span className="text-xs font-medium text-muted-foreground">Tiến độ A1 → C1</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Chặng B1: Intermediate</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Bạn đã hoàn thành 45% chặng B1. Mục tiêu tiếp theo là làm chủ các kỹ năng giao tiếp về chủ đề trừu tượng và viết luận ngắn.
              </p>
            </div>
            {/* Steps indicator */}
            <div className="flex items-center justify-between gap-2 pt-2">
              {["A1", "A2", "B1", "B2", "C1"].map((lvl) => {
                const isCompleted = lvl === "A1" || lvl === "A2";
                const isCurrent = lvl === "B1";
                return (
                  <div key={lvl} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className={`h-1.5 w-full rounded-full ${
                      isCompleted ? "bg-primary" : isCurrent ? "bg-primary animate-pulse" : "bg-muted"
                    }`} />
                    <span className={`text-[10px] font-bold ${
                      isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                    }`}>{lvl}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border/40">
            <Link href="/roadmap">
              <Button variant="ghost" className="w-full justify-between hover:bg-primary/5 hover:text-primary group text-foreground font-medium rounded-xl p-3">
                <span>Xem bản đồ chi tiết</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import {
  Trophy,
  Flame,
  Layers,
  BookOpen,
  Calendar,
  Award,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function ProgressPage() {
  const stats = [
    { label: "Tổng kinh nghiệm", value: "1,250 XP", sub: "+120 XP tuần này", icon: Trophy, color: "text-primary bg-primary/10" },
    { label: "Streak hiện tại", value: "5 ngày", sub: "Kỷ lục: 12 ngày", icon: Flame, color: "text-orange-500 bg-orange-500/10" },
    { label: "Từ vựng SRS", value: "120 từ", sub: "92% thẻ thuộc loại tốt", icon: Layers, color: "text-blue-500 bg-blue-500/10" },
    { label: "Bài học hoàn thành", value: "15 bài", sub: "Đạt 40% chặng B1", icon: BookOpen, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  // Weekly study data for the CSS-based chart
  const weeklyData = [
    { day: "T2", xp: 30, height: "h-[60%]" },
    { day: "T3", xp: 45, height: "h-[90%]" },
    { day: "T4", xp: 15, height: "h-[30%]" },
    { day: "T5", xp: 50, height: "h-[100%]" },
    { day: "T6", xp: 20, height: "h-[40%]" },
    { day: "T7", xp: 0, height: "h-[0%]" },
    { day: "CN", xp: 35, height: "h-[70%]" },
  ];

  const achievements = [
    {
      title: "Kẻ dậy sớm",
      desc: "Hoàn thành bài học trước 7 giờ sáng",
      unlocked: true,
      reward: "Đã nhận Huy chương Vàng",
      icon: Sparkles,
      tier: "gold",
    },
    {
      title: "Chiến thần từ vựng",
      desc: "Ghi nhớ thành công 100 từ vựng qua SRS",
      unlocked: true,
      reward: "Đã nhận Huy chương Vàng",
      icon: Award,
      tier: "gold",
    },
    {
      title: "Không thể cản phá",
      desc: "Đạt chuỗi học tập liên tiếp 7 ngày",
      unlocked: false,
      progress: "5 / 7 ngày",
      reward: "Huy chương Bạc",
      icon: Flame,
      tier: "silver",
    },
    {
      title: "Bậc thầy Output",
      desc: "Đặt 50 câu tiếng Anh thực tế trong các bài học",
      unlocked: false,
      progress: "15 / 50 câu",
      reward: "Huy chương Đồng",
      icon: BookOpen,
      tier: "bronze",
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Header */}
      <div className="border-b border-border/40 pb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/10">
          <TrendingUp className="size-3.5" />
          Báo cáo học tập cá nhân
        </span>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Tiến độ & Thành tích
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Theo dõi sát sao các chỉ số học tập để giữ vững động lực học tiếng Anh mỗi ngày.
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-glass border border-glass p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                <span className={`flex size-9 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="size-4.5" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</span>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics chart and summary */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-glass bg-glass p-6 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-base text-foreground">Kinh nghiệm hàng ngày</h3>
              <p className="text-xs text-muted-foreground">Lượng XP thu nhận được trong 7 ngày qua</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg border border-border/40">
              <Calendar className="size-3.5" />
              Tuần này
            </span>
          </div>

          {/* Chart Core (CSS Column Layout) */}
          <div className="h-56 flex items-end justify-between gap-2 px-2 pt-6 border-b border-border/60">
            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[10px] font-mono font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded shadow-sm translate-y-1">
                  {data.xp} XP
                </span>
                {/* Bar */}
                <div
                  className={`w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-primary/80 to-primary group-hover:from-primary group-hover:to-emerald-400 transition-all duration-300 ${data.height}`}
                  style={{ minHeight: data.xp > 0 ? "4px" : "0px" }}
                />
                {/* Day label */}
                <span className="text-xs text-muted-foreground font-medium py-2">
                  {data.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed memory state summary */}
        <div className="rounded-3xl border border-glass bg-glass p-6 space-y-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-base text-foreground">Hộp bộ nhớ SRS</h3>
            <p className="text-xs text-muted-foreground">
              Phân tích phân phối trạng thái ghi nhớ của 120 từ vựng đã học qua thuật toán Spaced Repetition.
            </p>
            
            {/* Box indicators */}
            <div className="space-y-3 pt-2">
              {[
                { name: "Hộp 1 (Mới học - Ôn hàng ngày)", count: 18, pct: 15, color: "bg-red-500" },
                { name: "Hộp 2 (Bắt đầu nhớ - Ôn cách ngày)", count: 32, pct: 27, color: "bg-orange-500" },
                { name: "Hộp 3 (Nhớ khá tốt - Ôn cách tuần)", count: 50, pct: 41, color: "bg-blue-500" },
                { name: "Hộp 4 (Trí nhớ dài hạn - Ôn cách tháng)", count: 20, pct: 17, color: "bg-emerald-500" },
              ].map((box, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium text-foreground">{box.name}</span>
                    <span className="font-semibold text-muted-foreground">{box.count} từ ({box.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${box.color}`} style={{ width: `${box.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border/40 text-center">
            <p className="text-[11px] text-muted-foreground">
              Học thêm từ mới để nâng cao số lượng từ trong vùng trí nhớ dài hạn (Hộp 4).
            </p>
          </div>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-foreground">Huy chương đạt được</h3>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon;
            
            // Tier styling
            const tierBorder = 
              ach.unlocked
                ? ach.tier === "gold"
                  ? "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50"
                  : ach.tier === "silver"
                  ? "border-slate-400/30 bg-slate-400/5 hover:border-slate-400/50"
                  : "border-amber-700/30 bg-amber-700/5 hover:border-amber-700/50"
                : "border-border/40 bg-muted/10 opacity-75";

            const tierIconColor = 
              ach.unlocked
                ? ach.tier === "gold"
                  ? "text-yellow-500 bg-yellow-500/10"
                  : ach.tier === "silver"
                  ? "text-slate-400 bg-slate-400/10"
                  : "text-amber-700 bg-amber-700/10"
                : "text-muted-foreground bg-muted";

            return (
              <div
                key={idx}
                className={`group rounded-2xl border p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] ${tierBorder}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className={`flex size-10 items-center justify-center rounded-xl ${tierIconColor}`}>
                      {ach.unlocked ? <Icon className="size-5" /> : <Lock className="size-4.5" />}
                    </span>
                    {ach.unlocked ? (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Đã mở khóa
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/40">
                        Chưa mở khóa
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{ach.title}</h4>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-1">
                      {ach.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/30">
                  {ach.unlocked ? (
                    <div className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="size-3.5 text-emerald-500 fill-emerald-500/20" />
                      {ach.reward}
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-semibold text-muted-foreground">
                        <span>Tiến trình</span>
                        <span>{ach.progress}</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/70" style={{ width: "70%" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
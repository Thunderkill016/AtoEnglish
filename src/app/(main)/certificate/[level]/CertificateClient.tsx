"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Download, ArrowLeft, BookOpen, Star, Lock, Share2 } from "lucide-react";
import { SecondaryPageShell, MinimalButton } from "@/components/design-system";
import { toast } from "sonner";

interface Props {
  level: string;
  levelLabel: string;
  userName: string;
  totalXp: number;
  isEligible: boolean;
  completedForLevel: number;
  requiredUnits: number;
  completedDate: string | null;
}

// Level color themes
const LEVEL_THEMES: Record<string, { gradient: string; accent: string; badge: string }> = {
  a1: {
    gradient: "from-emerald-600 via-teal-500 to-emerald-400",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  },
  a2: {
    gradient: "from-blue-600 via-indigo-500 to-blue-400",
    accent: "text-blue-400",
    badge: "bg-blue-500/20 border-blue-500/40 text-blue-300",
  },
  b1: {
    gradient: "from-purple-600 via-violet-500 to-purple-400",
    accent: "text-purple-400",
    badge: "bg-purple-500/20 border-purple-500/40 text-purple-300",
  },
  b2: {
    gradient: "from-orange-600 via-amber-500 to-orange-400",
    accent: "text-orange-400",
    badge: "bg-orange-500/20 border-orange-500/40 text-orange-300",
  },
  business: {
    gradient: "from-blue-600 via-indigo-500 to-emerald-500",
    accent: "text-blue-400",
    badge: "bg-blue-500/20 border-blue-500/40 text-blue-300",
  },
};

export default function CertificateClient({
  level,
  levelLabel,
  userName,
  totalXp,
  isEligible,
  completedForLevel,
  requiredUnits,
  completedDate,
}: Props) {
  const router = useRouter();
  const theme = LEVEL_THEMES[level] ?? LEVEL_THEMES.a1;

  const certUrl = typeof window !== "undefined"
    ? `${window.location.origin}/certificate/${level}`
    : `https://atoenglish.vercel.app/certificate/${level}`;

  const shareText = `🎓 Tôi vừa hoàn thành chứng nhận ${level.toUpperCase()} tiếng Anh trên AtoEnglish!\n\n📚 Hoàn thành ${requiredUnits} bài học · ${totalXp.toLocaleString()} XP tích lũy\n\nHọc tiếng Anh miễn phí 100% tại AtoEnglish 👇`;

  const handleShareLinkedIn = () => {
    const params = new URLSearchParams({
      mini: "true",
      url: certUrl,
      title: `AtoEnglish ${level.toUpperCase()} Certificate`,
      summary: shareText,
      source: "AtoEnglish",
    });
    window.open(`https://www.linkedin.com/shareArticle?${params.toString()}`, "_blank", "width=600,height=500");
  };

  const handleShareFacebook = () => {
    const params = new URLSearchParams({ u: certUrl });
    window.open(`https://www.facebook.com/sharer/sharer.php?${params.toString()}`, "_blank", "width=600,height=400");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${certUrl}`);
      toast.success("Đã sao chép nội dung chia sẻ!");
    } catch {
      toast.error("Không thể sao chép. Thử lại nhé!");
    }
  };

  const handlePrint = () => window.print();

  if (!isEligible) {
    return (
      <SecondaryPageShell title="Chứng nhận chưa mở khoá" subtitle={`${level.toUpperCase()} · ${completedForLevel}/${requiredUnits} bài`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 py-8"
        >
          <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-muted border border-border">
            <Lock className="size-10 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Hoàn thành tất cả {requiredUnits} bài học của chặng {level.toUpperCase()} để nhận chứng nhận.
          </p>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((completedForLevel / requiredUnits) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
            />
          </div>
          <p className={`text-xs font-bold ${theme.accent}`}>
            {Math.round((completedForLevel / requiredUnits) * 100)}% hoàn thành
          </p>
          <div className="flex flex-col gap-3">
            <MinimalButton fullWidth onClick={() => router.push("/learn")}>
              <BookOpen className="size-4" /> Tiếp tục học
            </MinimalButton>
            <MinimalButton variant="ghost" fullWidth onClick={() => router.back()}>
              <ArrowLeft className="size-4" /> Quay lại
            </MinimalButton>
          </div>
        </motion.div>
      </SecondaryPageShell>
    );
  }

  return (
    <SecondaryPageShell
      title={`Chứng nhận ${level.toUpperCase()}`}
      subtitle={levelLabel}
    >
      {/* Certificate flat card */}
      <motion.div
        id="certificate-card"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl mx-auto bg-card border border-border/60 rounded-2xl overflow-hidden print:shadow-none"
      >
        {/* Accent top bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${theme.gradient}`} />

        <div className="p-8 sm:p-10 space-y-7">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">AtoEnglish</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Certificate of Completion</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={`size-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
            >
              <Award className="size-8 text-white" />
            </motion.div>
          </div>

          {/* Main content */}
          <div className="text-center space-y-5">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-semibold">Chứng nhận hoàn thành</p>
              <h1 className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                {levelLabel.split("—")[0].trim()}
              </h1>
              <p className="text-muted-foreground text-sm">{levelLabel.split("—")[1]?.trim()}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3 + i * 0.08, type: "spring", stiffness: 220 }}
                >
                  <Star className="size-7 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  Cấp cho
                </span>
              </div>
            </div>

            {/* Recipient name */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {userName}
              </h2>
              <p className="text-muted-foreground text-sm">
                đã hoàn thành <span className="font-bold text-foreground">{requiredUnits} bài học</span> chặng{" "}
                <span className="font-bold text-foreground">{level.toUpperCase()}</span> với{" "}
                <span className={`font-black ${theme.accent}`}>{totalXp.toLocaleString()} XP</span>
              </p>
            </div>

            {/* Date */}
            {completedDate && (
              <p className="text-xs text-muted-foreground font-mono">
                Ngày cấp: {completedDate}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bài học", value: `${requiredUnits}` },
              { label: "XP tích lũy", value: totalXp.toLocaleString() },
              { label: "Trình độ", value: level.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl bg-muted/40 border border-border/60 p-3 text-center">
                <p className={`text-lg font-black ${theme.accent}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Watermark / signature line */}
          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <div className="space-y-1">
              <div className={`text-xs font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                AtoEnglish
              </div>
              <p className="text-[10px] text-muted-foreground">atoenglish.vercel.app</p>
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl border ${theme.badge}`}>
              Xác thực ✓
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className={`h-0.5 w-full bg-gradient-to-r ${theme.gradient} opacity-50`} />
      </motion.div>

      {/* Share Section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-2xl mx-auto mt-5 rounded-2xl border border-border/60 bg-card p-4 print:hidden"
      >
        <p className="text-xs font-black text-muted-foreground uppercase tracking-wider text-center mb-3">
          🎉 Chia sẻ thành tích với mọi người
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            id="share-linkedin"
            onClick={handleShareLinkedIn}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#0077b5]/10 border border-[#0077b5]/20 hover:bg-[#0077b5]/20 transition-all duration-200 group"
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="#0077b5" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">LinkedIn</span>
          </button>
          <button
            id="share-facebook"
            onClick={handleShareFacebook}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-[#1877f2]/10 border border-[#1877f2]/20 hover:bg-[#1877f2]/20 transition-all duration-200 group"
          >
            <Share2 className="size-5 text-[#1877f2]" />
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">Facebook</span>
          </button>
          <button
            id="share-copy-link"
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted border border-border/60 hover:bg-muted/80 transition-all duration-200 group"
          >
            <Share2 className="size-5 text-muted-foreground" />
            <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">Sao chép</span>
          </button>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-2xl mx-auto print:hidden"
      >
        <MinimalButton
          data-testid="print-certificate"
          variant="secondary"
          fullWidth
          onClick={handlePrint}
        >
          <Download className="size-4" />
          Lưu / In chứng nhận
        </MinimalButton>
        <MinimalButton
          data-testid="back-to-dashboard"
          fullWidth
          onClick={() => router.push("/dashboard")}
        >
          Về Dashboard
        </MinimalButton>
      </motion.div>
    </SecondaryPageShell>
  );
}

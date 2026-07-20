import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SrsCardProps {
  dueCardsCount: number;
}

export default function SrsCard({ dueCardsCount }: SrsCardProps) {
  const hasDue = dueCardsCount > 0;

  return (
    <Card
      
      className={`rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
        hasDue ? "hover:border-amber-500/50" : "hover:border-white/15"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`flex size-8 items-center justify-center rounded-xl ${
            hasDue ? "bg-amber-500/15 text-amber-400" : "bg-zinc-800 text-zinc-500"
          }`}>
            <Layers className="size-4" />
          </span>
          <span className={`text-sm font-black uppercase tracking-wide ${
            hasDue ? "text-amber-400" : "text-zinc-400"
          }`}>
            Hộp thẻ SRS
          </span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-mono border ${
          hasDue
            ? "bg-amber-500/10 text-amber-400 border-amber-500/25 animate-pulse"
            : "bg-zinc-800/60 text-zinc-500 border-zinc-700/40"
        }`}>
          {dueCardsCount} thẻ đến hạn
        </span>
      </div>

      <p className="text-xs text-zinc-400 leading-relaxed font-normal">
        {hasDue
          ? "Thuật toán FSRS đã lên lịch ôn tập. Luyện ngay để ghi nhớ sâu hơn."
          : "Không có thẻ đến hạn. Hãy tiếp tục học bài mới để mở thẻ SRS."}
      </p>

      <Link href="/flashcards" className="block">
        <Button
          className={`w-full h-10 font-bold rounded-xl text-xs flex items-center justify-between px-4 transition-all duration-200 active:scale-[0.98] ${
            hasDue
              ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-md shadow-amber-500/20"
              : "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-300"
          }`}
        >
          <span>Ôn tập lật thẻ</span>
          <ArrowRight className="size-3.5" />
        </Button>
      </Link>
    </Card>
  );
}

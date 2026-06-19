import { Check, X, Minus } from "lucide-react";
import ScrollReveal from "@/components/ui/scroll-reveal";

type CellValue = "yes" | "no" | "partial";

interface ComparisonRow {
  feature: string;
  traditional: CellValue;
  vocabApp: CellValue;
  atoEnglish: CellValue;
}

const rows: ComparisonRow[] = [
  {
    feature: "Luyện phản xạ nói tự nhiên",
    traditional: "no",
    vocabApp: "no",
    atoEnglish: "yes",
  },
  {
    feature: "Lộ trình A1 → C1 rõ ràng",
    traditional: "yes",
    vocabApp: "no",
    atoEnglish: "yes",
  },
  {
    feature: "Ôn tập thông minh FSRS",
    traditional: "no",
    vocabApp: "partial",
    atoEnglish: "yes",
  },
  {
    feature: "Học trên mọi thiết bị, không cài app",
    traditional: "no",
    vocabApp: "no",
    atoEnglish: "yes",
  },
  {
    feature: "Hoàn toàn miễn phí",
    traditional: "no",
    vocabApp: "partial",
    atoEnglish: "yes",
  },
  {
    feature: "Không cần giáo viên hay lịch học cố định",
    traditional: "no",
    vocabApp: "yes",
    atoEnglish: "yes",
  },
];

function Cell({ value }: { value: CellValue }) {
  if (value === "yes")
    return (
      <span className="inline-flex items-center justify-center size-7 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
        <Check className="size-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
      </span>
    );
  if (value === "no")
    return (
      <span className="inline-flex items-center justify-center size-7 rounded-full bg-zinc-100 dark:bg-zinc-900">
        <X className="size-4 text-zinc-400 dark:text-zinc-600" strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center size-7 rounded-full bg-amber-50 dark:bg-amber-950/30">
      <Minus className="size-4 text-amber-500 dark:text-amber-400" strokeWidth={2.5} />
    </span>
  );
}

export default function ComparisonSection() {
  return (
    <section className="py-24 sm:py-32 px-5 sm:px-8 border-t border-zinc-200/40 dark:border-zinc-800/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/3 dark:bg-emerald-500/2 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <ScrollReveal className="text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-normal">
            Tại sao chọn AtoEnglish?
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
            So sánh với các phương pháp học phổ biến hiện nay.
          </p>
        </ScrollReveal>

        {/* Table */}
        <ScrollReveal delayMs={100}>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200/60 dark:border-zinc-800/50 bg-zinc-50/70 dark:bg-zinc-900/30">
                  <th className="text-left px-5 sm:px-6 py-4 font-semibold text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-wider w-full">
                    Tính năng
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-semibold text-zinc-500 dark:text-zinc-500 text-xs uppercase tracking-wider whitespace-nowrap min-w-[96px]">
                    Học truyền thống
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-semibold text-zinc-500 dark:text-zinc-500 text-xs uppercase tracking-wider whitespace-nowrap min-w-[96px]">
                    App từ vựng
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-center font-bold text-emerald-700 dark:text-emerald-400 text-xs uppercase tracking-wider whitespace-nowrap min-w-[100px] bg-emerald-50/50 dark:bg-emerald-950/20">
                    AtoEnglish
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white/70 dark:bg-zinc-900/15">
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/20 transition-colors duration-150"
                  >
                    <td className="px-5 sm:px-6 py-4 text-zinc-800 dark:text-zinc-200 font-medium leading-snug">
                      {row.feature}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <Cell value={row.traditional} />
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center">
                      <Cell value={row.vocabApp} />
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-center bg-emerald-50/30 dark:bg-emerald-950/10">
                      <Cell value={row.atoEnglish} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        {/* Legend */}
        <ScrollReveal delayMs={150} className="flex items-center justify-center gap-6 text-xs text-zinc-500 dark:text-zinc-500">
          <span className="flex items-center gap-1.5">
            <Check className="size-3.5 text-emerald-500" strokeWidth={2.5} />
            Có
          </span>
          <span className="flex items-center gap-1.5">
            <Minus className="size-3.5 text-amber-500" strokeWidth={2.5} />
            Một phần
          </span>
          <span className="flex items-center gap-1.5">
            <X className="size-3.5 text-zinc-400" strokeWidth={2.5} />
            Không có
          </span>
        </ScrollReveal>
      </div>
    </section>
  );
}

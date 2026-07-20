import { Mic, Clock, Gift } from "lucide-react";

const BENEFITS = [
  {
    icon: Mic,
    title: "Phản xạ nói",
    desc: "Luyện chủ động — bớt dịch nhẩm Việt→Anh trong đầu.",
  },
  {
    icon: Clock,
    title: "15–20 phút/ngày",
    desc: "Bài ngắn, mobile-first, dễ giữ thói quen.",
  },
  {
    icon: Gift,
    title: "Open Beta miễn phí",
    desc: "Học · nói · ôn FSRS không paywall giai đoạn này.",
  },
] as const;

/** Outcomes — single block (do not duplicate on page). */
export default function BenefitsSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Bạn sẽ thay đổi như thế nào?
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <li
                key={b.title}
                className="rounded-xl border border-border bg-card p-5 md:p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

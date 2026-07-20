const STEPS = [
  {
    n: "01",
    title: "Học theo bài có can-do",
    desc: "Mỗi bài A0→B1 có mục tiêu đo được: nói được gì sau 15–40 phút.",
  },
  {
    n: "02",
    title: "Luyện nói có kiểm soát",
    desc: "Shadowing, roleplay, journal — feedback tiếng Việt, không điểm ảo.",
  },
  {
    n: "03",
    title: "Ôn đúng lúc quên",
    desc: "FSRS xếp lịch từ vựng & câu — nhớ lâu hơn học vẹt.",
  },
  {
    n: "04",
    title: "Tiến độ lộ trình B1",
    desc: "Path tuần tự, cổng A2/B1 — biết mình đang ở đâu trên đường Independent User.",
  },
] as const;

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Cách học
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Bốn bước, một thói quen
          </h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            15–20 phút/ngày. Không cần app native — mở web là học.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-xl border border-border bg-card p-5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold tabular-nums text-primary">
                {s.n}
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

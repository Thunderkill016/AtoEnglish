const METHODS = [
  {
    title: "LessonSpec + can-do",
    desc: "Một grammar spine / bài, lexis giới hạn, outcome đo được — không dump từ điển.",
  },
  {
    title: "Giải thích tiếng Việt",
    desc: "Contrast L1↔L2: be/-s, final consonant, trật tự từ — lỗi người Việt hay gặp.",
  },
  {
    title: "FSRS + nói có kiểm soát",
    desc: "Ôn đúng lúc quên. Shadowing → semi-free task, không chat AI vô hạn.",
  },
] as const;

export default function ScienceSection() {
  return (
    <section id="science" className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Phương pháp
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Khoa học, không gamification rỗng
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {METHODS.map((m) => (
            <li
              key={m.title}
              className="rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <h3 className="text-base font-semibold">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {m.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

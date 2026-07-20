const PROBLEMS = [
  {
    n: "01",
    title: "Học nhiều, phản xạ chậm",
    desc: "Phải dịch nhẩm trong đầu 5–10 giây trước khi nói được một câu.",
  },
  {
    n: "02",
    title: "Ngại nói sai",
    desc: "Sợ phát âm lệch, sợ người kia không hiểu hoặc đánh giá.",
  },
  {
    n: "03",
    title: "Thiếu chỗ luyện thật",
    desc: "Không có môi trường an toàn để nói to mỗi ngày.",
  },
] as const;

export default function ProblemSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Học nhiều năm vẫn ngại mở miệng?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Không thiếu từ vựng — thiếu lộ trình nói được và chỗ luyện phản xạ
            an toàn.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <li
              key={p.n}
              className="rounded-xl border border-border bg-card p-5 md:p-6"
            >
              <p className="text-xs font-semibold tabular-nums text-primary">
                {p.n}
              </p>
              <h3 className="mt-2 text-base font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-sm font-medium text-primary">
          AtoEnglish giải đúng 3 điểm này — cho người Việt.
        </p>
      </div>
    </section>
  );
}

import Link from "next/link";

import {
  LESSON_V2_REGISTRY,
  type LessonSessionKind,
} from "../../lib/lessons/v2/lesson-registry";

const SESSION_LABELS: Record<LessonSessionKind, string> = {
  encounter: "Bài 1 · Gặp và nhận ra",
  communicate: "Bài 2 · Luyện và giao tiếp",
  retain_transfer: "Bài 3 · Nhớ lại và chuyển giao",
};

export default function LearnV2Page() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="rounded-3xl bg-indigo-950 p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
            AtoEnglish Lesson System V2
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Pre‑A1 · Module 1: Nói và đánh vần tên
          </h1>
          <p className="mt-3 max-w-3xl text-indigo-100">
            Ba bài tách riêng việc gặp ngôn ngữ, dùng trong giao tiếp và
            nhớ/chuyển sang tình huống mới. Hoàn thành trang không đồng
            nghĩa đã thành thạo.
          </p>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {LESSON_V2_REGISTRY.map((entry) => (
            <article
              key={entry.lesson.id}
              className="flex flex-col rounded-3xl bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                {SESSION_LABELS[entry.sessionKind]}
              </p>
              <h2 className="mt-3 text-xl font-bold text-slate-950">
                {entry.lesson.titleVi}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                {entry.lesson.primaryOutcome.statementVi}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {entry.lesson.estimatedMinutes} phút
                </span>
                <Link
                  href={`/learn-v2/${entry.lesson.id}`}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Mở bài
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Bằng chứng tiến bộ của module
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["Introduced", "Đã nhận ra câu và ý nghĩa"],
              ["Supported", "Làm được với khung/từ khóa"],
              ["Retained", "Vẫn làm được sau trì hoãn"],
              ["Transfer", "Dùng được ở bối cảnh khác"],
            ].map(([label, description]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="mt-1 text-sm text-slate-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

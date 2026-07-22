import Link from "next/link";

import {
  getLessonsForModuleV2,
  LESSON_V2_MODULES,
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
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl bg-indigo-950 p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
            AtoEnglish Lesson System V2
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Pre‑A1 · Hai module đầu tiên
          </h1>
          <p className="mt-3 max-w-3xl text-indigo-100">
            Sáu bài đi từ nhận biết sang giao tiếp, delayed recall và transfer.
            Bài nhớ lại chỉ mở sau 24 giờ thật và evidence được gửi lên Supabase.
          </p>
        </header>

        <div className="mt-7 space-y-7">
          {LESSON_V2_MODULES.map((module) => {
            const lessons = getLessonsForModuleV2(module.id);

            return (
              <section
                key={module.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
                      Module {module.order}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      {module.titleVi}
                    </h2>
                    <p className="mt-2 max-w-3xl text-slate-600">
                      {module.descriptionVi}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                    {lessons.length} bài
                  </span>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {lessons.map((entry) => (
                    <article
                      key={entry.lesson.id}
                      className="flex flex-col rounded-2xl border border-slate-200 p-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                        {SESSION_LABELS[entry.sessionKind]}
                      </p>
                      <h3 className="mt-3 text-lg font-bold text-slate-950">
                        {entry.lesson.titleVi}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                        {entry.lesson.primaryOutcome.statementVi}
                      </p>
                      {entry.unlockRule && (
                        <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                          Mở sau {entry.unlockRule.delayHours} giờ kể từ bài 2.
                        </p>
                      )}
                      <div className="mt-5 flex items-center justify-between gap-3">
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
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-7 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-950">
            Evidence được lưu thế nào?
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["Introduced", "Đã nhận ra câu và ý nghĩa"],
              ["Supported", "Làm được với khung/từ khóa"],
              ["Retained", "Vẫn làm được sau ít nhất 24 giờ"],
              ["Transfer", "Dùng được ở bối cảnh khác"],
            ].map(([label, description]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-900">{label}</p>
                <p className="mt-1 text-sm text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

import Link from "next/link";

import {
  getLessonsForSectionV2,
  LESSON_V2_MODULES,
  LESSON_V2_REGISTRY,
  LESSON_V2_SECTIONS,
  type LessonSessionKind,
} from "../../lib/lessons/v2/lesson-registry";

const SESSION_LABELS: Record<LessonSessionKind, string> = {
  encounter: "Bài 1 · Gặp và nhận ra",
  communicate: "Bài 2 · Luyện và giao tiếp",
  retain_transfer: "Bài 3 · Nhớ lại và chuyển giao",
  checkpoint: "Checkpoint · Tích hợp năng lực",
};

export default function LearnV2Page() {
  const checkpointCount = LESSON_V2_SECTIONS.filter(
    (section) => section.kind === "checkpoint",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl bg-indigo-950 p-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
            AtoEnglish Lesson System V2
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Pre‑A1 · Curriculum đang triển khai
          </h1>
          <p className="mt-3 max-w-3xl text-indigo-100">
            {LESSON_V2_MODULES.length} module + {checkpointCount} checkpoint với{" "}
            {LESSON_V2_REGISTRY.length} bài. Kiến thức đi từ nhận biết sang giao
            tiếp, delayed recall, transfer rồi tích hợp trong nhiệm vụ mới.
          </p>
        </header>

        <div className="mt-7 space-y-7">
          {LESSON_V2_SECTIONS.map((section) => {
            const lessons = getLessonsForSectionV2(section.id);
            const isCheckpoint = section.kind === "checkpoint";

            return (
              <section
                key={section.id}
                className={`rounded-3xl bg-white p-6 shadow-sm ${
                  isCheckpoint ? "border-2 border-amber-300" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        isCheckpoint ? "text-amber-700" : "text-indigo-700"
                      }`}
                    >
                      {section.labelVi}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">
                      {section.titleVi}
                    </h2>
                    <p className="mt-2 max-w-3xl text-slate-600">
                      {section.descriptionVi}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm ${
                      isCheckpoint
                        ? "bg-amber-100 text-amber-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {lessons.length} bài
                  </span>
                </div>

                <div
                  className={`mt-5 grid gap-4 ${
                    lessons.length === 1 ? "max-w-2xl" : "lg:grid-cols-3"
                  }`}
                >
                  {lessons.map((entry) => (
                    <article
                      key={entry.lesson.id}
                      className={`flex flex-col rounded-2xl border p-5 ${
                        isCheckpoint
                          ? "border-amber-200 bg-amber-50/40"
                          : "border-slate-200"
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          isCheckpoint ? "text-amber-700" : "text-indigo-700"
                        }`}
                      >
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
                          Mở sau {entry.unlockRule.delayHours} giờ kể từ bài luyện
                          và giao tiếp.
                        </p>
                      )}
                      {isCheckpoint && (
                        <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-medium text-amber-900">
                          Chỉ mở sau khi hoàn thành delayed transfer của cả bốn
                          module.
                        </p>
                      )}
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">
                          {entry.lesson.estimatedMinutes} phút
                        </span>
                        <Link
                          href={`/learn-v2/${entry.lesson.id}`}
                          className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                            isCheckpoint ? "bg-amber-700" : "bg-slate-950"
                          }`}
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
              ["Transfer", "Dùng được ở bối cảnh khác và checkpoint"],
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

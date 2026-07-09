import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonV2 } from "@/lib/v2/lessons";
import { getPathMeta } from "@/lib/v2/path";
import { LESSON_STAGES } from "@/lib/v2/lesson-spec";
import { LessonPlayerV2 } from "@/components/learn/v2/LessonPlayerV2";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLessonV2(lessonId);
  return {
    title: lesson
      ? `${lesson.title_vi} | AtoEnglish v2`
      : "Bài học v2 | AtoEnglish",
    robots: { index: false },
  };
}

export default async function LearnV2LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = getLessonV2(lessonId);
  if (!lesson) notFound();

  const meta = getPathMeta(lessonId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-24 sm:px-6">
      <div className="mb-4 flex items-center justify-between gap-3 text-sm">
        <Link
          href="/home"
          className="text-zinc-500 hover:text-emerald-500 transition-colors"
        >
          ← Home
        </Link>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
          v2 · {lesson.cefr} · {lesson.phase}
        </span>
      </div>

      <header className="mb-6 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {meta ? `Bài ${meta.order}/42 · Lộ trình B1` : "PilotSpec pilot"}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
          {lesson.title_vi}
        </h1>
        <p className="text-sm text-zinc-400">
          ~{lesson.estimatedMin} phút · {LESSON_STAGES.length} giai · nhiệm vụ nói bắt
          buộc
        </p>
      </header>

      <LessonPlayerV2 lesson={lesson} />
    </div>
  );
}

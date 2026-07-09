import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
      ? `${lesson.title_vi} | AtoEnglish`
      : "Bài học | AtoEnglish",
    robots: { index: false },
  };
}

export default async function LearnV2LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = getLessonV2(lessonId);
  if (!lesson) notFound();

  const meta = getPathMeta(lessonId);

  return (
    <div className="relative mx-auto max-w-2xl min-h-[calc(100dvh-4rem)] px-4 py-6 pb-28 sm:px-6 overflow-x-hidden">
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[240px] w-[50%] rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-20 left-0 -z-10 h-[180px] w-[180px] rounded-full bg-teal-500/8 blur-[80px]" />

      <div className="mb-5 flex items-center justify-between gap-3">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-400">
          {lesson.cefr} · {lesson.phase}
        </span>
      </div>

      <header className="mb-6 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          {meta ? `Bài ${meta.order}/42 · Lộ trình B1` : "Pilot học v2"}
          {" · "}
          {LESSON_STAGES.length} bước · ~{lesson.estimatedMin} phút
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-50">
          {lesson.title_vi}
        </h1>
      </header>

      <LessonPlayerV2 lesson={lesson} />
    </div>
  );
}

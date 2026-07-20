import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getLessonV2 } from "@/lib/v2/lessons";
import { getPathMeta } from "@/lib/v2/path";
import { LESSON_STAGES } from "@/lib/v2/lesson-spec";
import { LessonPlayerV2 } from "@/components/learn/v2/LessonPlayerV2";
import { Screen, AppButton, PageHeader } from "@/components/design-system";
import { Badge } from "@/components/ui/badge";

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
    <Screen ambient narrow className="pb-28">
      <div className="mb-5 flex items-center justify-between gap-3">
        <AppButton href="/home" variant="ghost" size="sm" className="-ml-2 px-2">
          <ArrowLeft className="size-4" aria-hidden />
          Home
        </AppButton>
        <Badge variant="secondary">
          {lesson.cefr} · {lesson.phase}
        </Badge>
      </div>

      <PageHeader
        className="mb-6"
        eyebrow={
          meta
            ? `Bài ${meta.order}/42 · Lộ trình B1 · ${LESSON_STAGES.length} bước · ~${lesson.estimatedMin} phút`
            : `Bài học · ${LESSON_STAGES.length} bước · ~${lesson.estimatedMin} phút`
        }
        title={lesson.title_vi}
        subtitle={
          lesson.canDo?.length
            ? `Can-do: ${lesson.canDo.slice(0, 2).join(" · ")}`
            : undefined
        }
      />

      <LessonPlayerV2 lesson={lesson} />
    </Screen>
  );
}

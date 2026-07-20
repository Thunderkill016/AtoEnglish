import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonV2 } from "@/lib/v2/lessons";
import { getPathMeta } from "@/lib/v2/path";
import { LESSON_STAGES } from "@/lib/v2/lesson-spec";
import { LessonPlayerV2 } from "@/components/learn/v2/LessonPlayerV2";
import { Page, PageHeader } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLessonV2(lessonId);
  return {
    title: lesson ? `${lesson.title_vi} | AtoEnglish` : "Bài học | AtoEnglish",
    robots: { index: false },
  };
}

export default async function LearnV2LessonPage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = getLessonV2(lessonId);
  if (!lesson) notFound();
  const meta = getPathMeta(lessonId);

  return (
    <Page className="pb-28">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link
          href="/home"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Home
        </Link>
        <Badge variant="secondary">
          {lesson.cefr} · {lesson.phase}
        </Badge>
      </div>
      <PageHeader
        description={
          meta
            ? `Bài ${meta.order}/42 · ${LESSON_STAGES.length} bước · ~${lesson.estimatedMin} phút`
            : `${LESSON_STAGES.length} bước · ~${lesson.estimatedMin} phút`
        }
      />
      <LessonPlayerV2 lesson={lesson} />
    </Page>
  );
}

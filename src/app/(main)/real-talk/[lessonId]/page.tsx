import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getRealTalkLesson,
  REAL_TALK_LESSONS,
} from "@/features/real-talk/data/lessons";
import RealTalkLessonPlayer from "@/features/real-talk/ui/RealTalkLessonPlayer";

interface RealTalkLessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export function generateStaticParams() {
  return REAL_TALK_LESSONS.map((lesson) => ({ lessonId: lesson.id }));
}

export async function generateMetadata({
  params,
}: RealTalkLessonPageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getRealTalkLesson(lessonId);

  if (!lesson) return { title: "Không tìm thấy bài Real Talk | AtoEnglish" };

  return {
    title: `${lesson.titleVi} | AtoEnglish Real Talk`,
    description: lesson.canDoVi,
  };
}

export default async function RealTalkLessonPage({
  params,
}: RealTalkLessonPageProps) {
  const { lessonId } = await params;
  const lesson = getRealTalkLesson(lessonId);

  if (!lesson) notFound();

  return <RealTalkLessonPlayer lesson={lesson} />;
}

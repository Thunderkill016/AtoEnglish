import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PrivateLessonRuntime from "@/features/real-talk/components/PrivateLessonRuntime";
import { fetchOwnerPrivateDraftBySlug } from "@/features/real-talk/server/private-draft-library";

interface PrivateLessonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PrivateLessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { lesson } = await fetchOwnerPrivateDraftBySlug(slug);

  return {
    title: lesson
      ? `${lesson.titleVi} | Bài học riêng | AtoEnglish`
      : "Không tìm thấy bài học | AtoEnglish",
    robots: { index: false, follow: false },
  };
}

export default async function PrivateLessonPage({
  params,
}: PrivateLessonPageProps) {
  const { slug } = await params;
  const { video, lesson } = await fetchOwnerPrivateDraftBySlug(slug);
  if (!video || !lesson) notFound();

  return <PrivateLessonRuntime video={video} lesson={lesson} />;
}

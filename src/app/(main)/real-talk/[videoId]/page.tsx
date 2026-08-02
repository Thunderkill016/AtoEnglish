import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { fetchLessonBySlug } from "@/app/actions/real-talk";
import RealTalkLessonComponent from "@/components/real-talk/RealTalkLesson";

interface PageProps {
  params: Promise<{ videoId: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { videoId } = await params;
  const { video } = await fetchLessonBySlug(videoId);
  if (!video) {
    return { title: "Video không tìm thấy | AtoEnglish" };
  }
  return {
    title: `${video.titleVi} — Real Talk | AtoEnglish`,
    description: `Học tiếng Anh từ cuộc trò chuyện thực tế: ${video.title}. Cấp độ ${video.level}.`,
  };
}

export default async function RealTalkVideoPage({ params }: PageProps) {
  const { videoId } = await params;
  const { video, lesson } = await fetchLessonBySlug(videoId);

  if (!video || !lesson) {
    notFound();
  }

  return <RealTalkLessonComponent video={video} lesson={lesson} />;
}

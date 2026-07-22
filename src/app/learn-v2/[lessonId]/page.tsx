import { notFound } from "next/navigation";

import { LessonV2Runner } from "../../../components/lessons/v2/LessonV2Runner";
import {
  getNextLessonV2,
  getRegisteredLessonV2,
  type LessonSessionKind,
} from "../../../lib/lessons/v2/lesson-registry";

const SESSION_LABELS: Record<LessonSessionKind, string> = {
  encounter: "Gặp và nhận ra",
  communicate: "Luyện và giao tiếp",
  retain_transfer: "Nhớ lại và chuyển giao",
};

interface LessonV2PageProps {
  params: Promise<{
    lessonId: string;
  }>;
}

export default async function LessonV2Page({
  params,
}: LessonV2PageProps) {
  const { lessonId } = await params;
  const registered = getRegisteredLessonV2(lessonId);

  if (!registered) notFound();

  const next = getNextLessonV2(lessonId);

  return (
    <LessonV2Runner
      lesson={registered.lesson}
      sessionLabel={SESSION_LABELS[registered.sessionKind]}
      nextLessonId={next?.lesson.id}
    />
  );
}

import { notFound } from "next/navigation";

import { LessonV2Runtime } from "../../../components/lessons/v2/LessonV2Runtime";
import {
  getNextLessonV2,
  getRegisteredLessonV2,
  getReviewDelayAfterLessonV2,
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
    <LessonV2Runtime
      lesson={registered.lesson}
      moduleId={registered.moduleId}
      sessionKind={registered.sessionKind}
      sessionLabel={SESSION_LABELS[registered.sessionKind]}
      nextLessonId={next?.lesson.id}
      unlockRule={registered.unlockRule}
      nextReviewDelayHours={getReviewDelayAfterLessonV2(lessonId)}
    />
  );
}

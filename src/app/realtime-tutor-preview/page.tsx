import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  RealtimeProducePreview,
  type RealtimeProducePreviewTask,
} from "@/features/realtime-tutor/RealtimeProducePreview";
import { resolveNếpAction } from "@/lib/nep/practice-execution.v1";

const TASK_IDENTITY = {
  lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
  lessonVersion: 1,
  actionId: "produce",
} as const;

export const metadata: Metadata = {
  title: "Nếp Realtime Tutor Preview — AtoEnglish",
  description:
    "Authenticated one-turn preview of server-resolved Nếp roleplay and canonical learning evidence.",
  robots: { index: false, follow: false },
};

export default function RealtimeTutorPreviewPage() {
  const resolved = resolveNếpAction(
    TASK_IDENTITY.lessonId,
    TASK_IDENTITY.lessonVersion,
    TASK_IDENTITY.actionId,
  );

  if (!resolved || resolved.action.modality !== "speech" || !resolved.action.prompt) {
    notFound();
  }

  const task: RealtimeProducePreviewTask = {
    ...TASK_IDENTITY,
    title: resolved.action.title,
    instruction: resolved.action.instruction,
    prompt: resolved.action.prompt,
  };

  return <RealtimeProducePreview task={task} />;
}

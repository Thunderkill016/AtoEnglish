import type { NếpPracticeEnvelope } from "@/lib/nep/practice-execution.v1";

export type AdaptiveVoiceMode = "conversation" | "capture";

/**
 * Interactive Realtime is deliberately narrower than the server's eligible tutor action set.
 * V1 activates it only for planner-selected `produce` speech tasks. Retrieval must remain
 * independent capture; repair/transfer stay capture-only until their own bounded review slices.
 */
export function adaptiveVoiceModeForPractice(
  practice: Pick<NếpPracticeEnvelope, "kind" | "modality">,
): AdaptiveVoiceMode | null {
  if (practice.modality !== "speech") return null;
  return practice.kind === "produce" ? "conversation" : "capture";
}

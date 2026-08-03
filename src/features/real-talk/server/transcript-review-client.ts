import "server-only";

import type {
  TranscriptAcquisitionMode,
  TranscriptCue,
  TranscriptRightsBasis,
} from "@/features/real-talk/domain/transcript-source";
import { createClient } from "@/lib/supabase/server";

const FUNCTION_NAME = "real-talk-transcript-review";

export type ApprovedTranscriptAcquisitionMode = Exclude<
  TranscriptAcquisitionMode,
  "experimental_unofficial"
>;

export interface TranscriptReviewSubmission {
  provider: string;
  sourceExternalId: string;
  canonicalSourceUrl: string;
  sourceReference: string;
  language: string;
  acquisitionMode: ApprovedTranscriptAcquisitionMode;
  rightsBasis: TranscriptRightsBasis;
  rightsReference: string;
  cues: TranscriptCue[];
  warnings?: string[];
}

export interface TranscriptReviewResult {
  sourceId: string;
  reviewStatus: "unreviewed" | "human_verified";
  cueDigest: string;
  reviewedAt?: string;
}

async function invokeTranscriptReview(body: Record<string, unknown>) {
  const client = await createClient();
  const { data, error } = await client.functions.invoke<TranscriptReviewResult>(
    FUNCTION_NAME,
    { body },
  );
  if (error || !data?.sourceId || !data.cueDigest) {
    throw new Error("Trusted transcript review request failed.");
  }
  return data;
}

export async function submitTranscriptForReview(
  submission: TranscriptReviewSubmission,
): Promise<TranscriptReviewResult> {
  return invokeTranscriptReview({ action: "submit", submission });
}

export async function approveTranscriptSource(
  sourceId: string,
): Promise<TranscriptReviewResult> {
  return invokeTranscriptReview({ action: "approve", sourceId });
}

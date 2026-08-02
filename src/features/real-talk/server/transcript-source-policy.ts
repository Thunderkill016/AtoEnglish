import {
  TranscriptSourceError,
  type TranscriptSourceAdapter,
  type TranscriptSourceRequest,
  type TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";
import { assertTranscriptSourceResultTrusted } from "@/features/real-talk/server/transcript-provenance";

const EXPERIMENTAL_FLAG = "REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS";

export type TranscriptSourcePolicyMode =
  | "approved_only"
  | "allow_experimental_non_production";

export interface TranscriptSourcePolicy {
  mode: TranscriptSourcePolicyMode;
  runtime: "production" | "non_production";
  experimentalFlagEnabled: boolean;
}

type Environment = Record<string, string | undefined>;

export function resolveTranscriptSourcePolicy(
  environment: Environment = process.env,
): TranscriptSourcePolicy {
  const runtime =
    environment.NODE_ENV === "production" ? "production" : "non_production";
  const experimentalFlagEnabled =
    environment[EXPERIMENTAL_FLAG]?.trim().toLowerCase() === "true";

  return {
    runtime,
    experimentalFlagEnabled,
    mode:
      runtime === "non_production" && experimentalFlagEnabled
        ? "allow_experimental_non_production"
        : "approved_only",
  };
}

export function assertTranscriptSourceAllowed(
  adapter: TranscriptSourceAdapter,
  policy: TranscriptSourcePolicy,
) {
  if (adapter.trust === "approved") return;

  if (
    adapter.trust === "experimental" &&
    policy.mode === "allow_experimental_non_production" &&
    policy.runtime === "non_production"
  ) {
    return;
  }

  throw new TranscriptSourceError({
    code: "transcript_source_policy_blocked",
    message:
      policy.runtime === "production"
        ? "Experimental transcript adapters are blocked in production."
        : `Experimental transcript adapters require ${EXPERIMENTAL_FLAG}=true outside production.`,
  });
}

export async function acquireTranscriptForCompilation(params: {
  adapter: TranscriptSourceAdapter;
  request: TranscriptSourceRequest;
  environment?: Environment;
}): Promise<TranscriptSourceResult> {
  const policy = resolveTranscriptSourcePolicy(params.environment);
  assertTranscriptSourceAllowed(params.adapter, policy);

  const result = await params.adapter.acquire(params.request);
  assertTranscriptSourceResultTrusted({
    adapter: params.adapter,
    request: params.request,
    result,
  });
  return result;
}

import {
  TranscriptSourceError,
  type TranscriptSourceAdapter,
  type TranscriptSourceRequest,
  type TranscriptSourceResult,
} from "@/features/real-talk/domain/transcript-source";
import { assertTranscriptSourceResultTrusted } from "@/features/real-talk/server/transcript-provenance";

const EXPERIMENTAL_NON_PRODUCTION_FLAG =
  "REAL_TALK_ALLOW_EXPERIMENTAL_TRANSCRIPTS";
const EXPERIMENTAL_PRIVATE_PRODUCTION_FLAG =
  "REAL_TALK_ALLOW_PRIVATE_PRODUCTION_TRANSCRIPTS";

export type TranscriptUseCase = "private_draft" | "public_content";

export type TranscriptSourcePolicyMode =
  | "approved_only"
  | "allow_experimental_non_production"
  | "allow_experimental_private_production";

export interface TranscriptSourcePolicy {
  mode: TranscriptSourcePolicyMode;
  runtime: "production" | "non_production";
  useCase: TranscriptUseCase;
  experimentalFlagEnabled: boolean;
  privateProductionFlagEnabled: boolean;
}

type Environment = Record<string, string | undefined>;

function isEnabled(value: string | undefined) {
  return value?.trim().toLowerCase() === "true";
}

export function resolveTranscriptSourcePolicy(
  environment: Environment = process.env,
  useCase: TranscriptUseCase = "public_content",
): TranscriptSourcePolicy {
  const runtime =
    environment.NODE_ENV === "production" ? "production" : "non_production";
  const experimentalFlagEnabled = isEnabled(
    environment[EXPERIMENTAL_NON_PRODUCTION_FLAG],
  );
  const privateProductionFlagEnabled = isEnabled(
    environment[EXPERIMENTAL_PRIVATE_PRODUCTION_FLAG],
  );

  let mode: TranscriptSourcePolicyMode = "approved_only";
  if (runtime === "non_production" && experimentalFlagEnabled) {
    mode = "allow_experimental_non_production";
  } else if (
    runtime === "production" &&
    useCase === "private_draft" &&
    privateProductionFlagEnabled
  ) {
    mode = "allow_experimental_private_production";
  }

  return {
    runtime,
    useCase,
    experimentalFlagEnabled,
    privateProductionFlagEnabled,
    mode,
  };
}

export function assertTranscriptSourceAllowed(
  adapter: TranscriptSourceAdapter,
  policy: TranscriptSourcePolicy,
) {
  if (adapter.trust === "approved") return;

  const allowedOutsideProduction =
    adapter.trust === "experimental" &&
    policy.mode === "allow_experimental_non_production" &&
    policy.runtime === "non_production";
  const allowedForPrivateProduction =
    adapter.trust === "experimental" &&
    policy.mode === "allow_experimental_private_production" &&
    policy.runtime === "production" &&
    policy.useCase === "private_draft";

  if (allowedOutsideProduction || allowedForPrivateProduction) return;

  throw new TranscriptSourceError({
    code: "transcript_source_policy_blocked",
    message:
      policy.runtime === "production"
        ? policy.useCase === "private_draft"
          ? `Private production drafts require ${EXPERIMENTAL_PRIVATE_PRODUCTION_FLAG}=true until an approved transcript provider is available.`
          : "Experimental transcript adapters are never allowed for public content."
        : `Experimental transcript adapters require ${EXPERIMENTAL_NON_PRODUCTION_FLAG}=true outside production.`,
  });
}

export async function acquireTranscriptForCompilation(params: {
  adapter: TranscriptSourceAdapter;
  request: TranscriptSourceRequest;
  useCase?: TranscriptUseCase;
  environment?: Environment;
}): Promise<TranscriptSourceResult> {
  const policy = resolveTranscriptSourcePolicy(
    params.environment,
    params.useCase ?? "public_content",
  );
  assertTranscriptSourceAllowed(params.adapter, policy);

  const result = await params.adapter.acquire(params.request);
  assertTranscriptSourceResultTrusted({
    adapter: params.adapter,
    request: params.request,
    result,
  });
  return result;
}

export type TranscriptAcquisitionMode =
  | "creator_provided"
  | "authorized_export"
  | "licensed_source"
  | "public_domain"
  | "human_reviewed_upload"
  | "approved_provider_api"
  | "experimental_unofficial";

export type TranscriptReviewStatus =
  | "unreviewed"
  | "machine_checked"
  | "human_verified";

export type TranscriptSourceTrust = "approved" | "experimental";

export type TranscriptSourceFailureCode =
  | "transcript_source_policy_blocked"
  | "transcript_not_available"
  | "transcript_too_short"
  | "transcript_provider_error";

export interface TranscriptCue {
  text: string;
  offset: number;
  duration: number;
}

export interface TranscriptSourceRequest {
  sourceId: string;
  sourceUrl: string;
  requestedLanguage: string;
}

export interface TranscriptSourceMetadata {
  adapterId: string;
  provider: string;
  acquisitionMode: TranscriptAcquisitionMode;
  trust: TranscriptSourceTrust;
  language: string;
  reviewStatus: TranscriptReviewStatus;
  sourceReference: string;
  acquiredAt: string;
  warnings: string[];
}

export interface TranscriptSourceResult {
  cues: TranscriptCue[];
  metadata: TranscriptSourceMetadata;
}

export interface TranscriptSourceAdapter {
  readonly id: string;
  readonly trust: TranscriptSourceTrust;
  acquire(request: TranscriptSourceRequest): Promise<TranscriptSourceResult>;
}

export class TranscriptSourceError extends Error {
  readonly code: TranscriptSourceFailureCode;
  readonly retryable: boolean;

  constructor(params: {
    code: TranscriptSourceFailureCode;
    message: string;
    retryable?: boolean;
    cause?: unknown;
  }) {
    super(params.message, { cause: params.cause });
    this.name = "TranscriptSourceError";
    this.code = params.code;
    this.retryable = params.retryable ?? false;
  }
}

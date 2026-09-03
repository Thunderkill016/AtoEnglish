export const EVIDENCE_TYPES = [
  "recognition",
  "retrieval",
  "listening",
  "production",
  "repair",
  "transfer",
  "retention",
] as const;

export type EvidenceType = (typeof EVIDENCE_TYPES)[number];
export type EvidenceCoverage = Partial<Record<EvidenceType, number>>;
export type ResponseModality = "choice" | "text" | "speech" | "gesture" | "none";

export interface LearningAttemptInput {
  knowledgeItemId?: string | null;
  capabilityId?: string | null;
  sessionId?: string | null;
  exerciseType: string;
  responseModality: ResponseModality;
  promptId?: string | null;
  contextId?: string | null;
  responseText?: string | null;
  correct?: boolean | null;
  latencyMs?: number | null;
  hintCount?: number;
  revealUsed?: boolean;
  supportLevel?: number;
  metadata?: Record<string, unknown>;
}

export interface EvidenceCandidate {
  type: EvidenceType;
  targetId: string;
  success: boolean;
  confidence?: number;
  /** Optional evaluator echo. It may not contradict the attempt's context. */
  contextId?: string | null;
  evaluator?: string;
  metadata?: Record<string, unknown>;
}

export interface EvidenceEvent extends Required<Pick<EvidenceCandidate, "type" | "targetId" | "success">> {
  confidence: number;
  supportLevel: number;
  contextId: string | null;
  evaluator: string;
  metadata: Record<string, unknown>;
}

export interface EvidencePolicyContext {
  attempt: LearningAttemptInput;
  candidate: EvidenceCandidate;
  /** Context used by the immediately preceding successful production of the same target. */
  previousSuccessfulContextId?: string | null;
  /**
   * Used only by the server persistence boundary. The database then validates transfer
   * against stored evidence history; callers must never use this to claim transfer locally.
   */
  deferTransferContextCheck?: boolean;
}

const ORAL_EVIDENCE_TYPES: readonly EvidenceType[] = ["production", "repair", "transfer"];

/**
 * Product invariant: a response may only create evidence that its observed modality can support.
 * Completion, button taps and typed fallbacks must not silently become speaking/transfer evidence.
 */
export function materializeEvidence(context: EvidencePolicyContext): EvidenceEvent | null {
  const {
    attempt,
    candidate,
    previousSuccessfulContextId,
    deferTransferContextCheck = false,
  } = context;

  if (!attempt.knowledgeItemId && !attempt.capabilityId) return null;

  // An attempt may only prove the knowledge item/capability it actually targeted.
  const targetMatchesAttempt =
    candidate.targetId === attempt.knowledgeItemId || candidate.targetId === attempt.capabilityId;
  if (!targetMatchesAttempt) return null;

  // Context describes the prompt/task that was actually attempted. An evaluator may echo it,
  // but it cannot replace it with a different context to manufacture transfer evidence.
  if (candidate.contextId && attempt.contextId && candidate.contextId !== attempt.contextId) return null;
  const evidenceContextId = attempt.contextId ?? candidate.contextId ?? null;

  if (attempt.revealUsed && ["retrieval", ...ORAL_EVIDENCE_TYPES].includes(candidate.type)) {
    return null;
  }

  if (ORAL_EVIDENCE_TYPES.includes(candidate.type)) {
    if (attempt.responseModality !== "speech") return null;
    if (!hasObservedOralResponse(attempt)) return null;
  }

  if (candidate.type === "retrieval" && attempt.responseModality === "none") return null;

  if (candidate.type === "transfer" && !deferTransferContextCheck) {
    if (!evidenceContextId || !previousSuccessfulContextId || evidenceContextId === previousSuccessfulContextId) {
      return null;
    }
  }

  return {
    type: candidate.type,
    targetId: candidate.targetId,
    success: candidate.success,
    confidence: clamp(candidate.confidence ?? 1, 0, 1),
    supportLevel: Math.max(0, attempt.supportLevel ?? 0),
    contextId: evidenceContextId,
    evaluator: candidate.evaluator ?? "deterministic",
    metadata: candidate.metadata ?? {},
  };
}

export interface LearnerSkillState {
  targetId: string;
  recognition: number;
  retrieval: number;
  listening: number;
  production: number;
  repair: number;
  transfer: number;
  retention: number;
  evidenceCount: number;
  /**
   * Coverage is derived from append-only evidence history. Numeric skill values remain a fast
   * routing snapshot; a zero with no typed evidence is unknown, not observed failure.
   */
  evidenceByType?: EvidenceCoverage;
  lastEvidenceAt: string | null;
}

export function createEmptyLearnerSkillState(targetId: string): LearnerSkillState {
  return {
    targetId,
    recognition: 0,
    retrieval: 0,
    listening: 0,
    production: 0,
    repair: 0,
    transfer: 0,
    retention: 0,
    evidenceCount: 0,
    evidenceByType: {
      recognition: 0,
      retrieval: 0,
      listening: 0,
      production: 0,
      repair: 0,
      transfer: 0,
      retention: 0,
    },
    lastEvidenceAt: null,
  };
}

/**
 * Conservative online snapshot update. Evidence history remains the source of truth;
 * this state exists for fast planning. Unsupported attempts never reach this function.
 */
export function applyEvidenceToSkillState(
  current: LearnerSkillState,
  evidence: EvidenceEvent,
  occurredAt: string
): LearnerSkillState {
  const oldValue = current[evidence.type];
  const supportPenalty = Math.min(evidence.supportLevel * 0.1, 0.5);
  const effectiveConfidence = evidence.confidence * (1 - supportPenalty);
  const observation = evidence.success ? effectiveConfidence : 0;
  const alpha = evidence.success ? 0.35 : 0.5;
  const nextValue = clamp(oldValue * (1 - alpha) + observation * alpha, 0, 1);
  const typedEvidenceCount = Math.max(0, Math.floor(current.evidenceByType?.[evidence.type] ?? 0));

  return {
    ...current,
    [evidence.type]: nextValue,
    evidenceCount: current.evidenceCount + 1,
    evidenceByType: {
      ...current.evidenceByType,
      [evidence.type]: typedEvidenceCount + 1,
    },
    lastEvidenceAt: occurredAt,
  };
}

function hasObservedOralResponse(attempt: LearningAttemptInput) {
  if (typeof attempt.responseText === "string" && attempt.responseText.trim().length > 0) return true;

  const source = attempt.metadata?.responseSource;
  const length = attempt.metadata?.responseLength;
  return source === "speech" && typeof length === "number" && Number.isFinite(length) && length > 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

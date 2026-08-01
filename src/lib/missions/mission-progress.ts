export interface TransferAttemptEvidence {
  activity_id: string;
  score: number | null;
  created_at: string;
}

export interface TransferEvidenceSummary {
  attemptCount: number;
  firstScore: number | null;
  retryScore: number | null;
  verified: boolean;
}

export function summarizeTransferEvidence(
  attempts: TransferAttemptEvidence[],
  activityId: string,
  passScore: number,
): TransferEvidenceSummary {
  const matching = attempts
    .filter((attempt) => attempt.activity_id === activityId)
    .sort(
      (left, right) =>
        new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
    );
  const first = matching[matching.length - 2] ?? null;
  const retry = matching[matching.length - 1] ?? null;

  return {
    attemptCount: matching.length,
    firstScore: first?.score ?? null,
    retryScore: retry?.score ?? null,
    verified: matching.length >= 2 && (retry?.score ?? 0) >= passScore,
  };
}

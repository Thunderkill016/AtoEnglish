export interface TransferAttemptEvidence {
  activity_id: string;
  session_id: string;
  score: number | null;
  created_at: string;
}

export interface TransferEvidenceSummary {
  sessionId: string | null;
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

  const bySession = new Map<string, TransferAttemptEvidence[]>();
  for (const attempt of matching) {
    const sessionAttempts = bySession.get(attempt.session_id) ?? [];
    sessionAttempts.push(attempt);
    bySession.set(attempt.session_id, sessionAttempts);
  }

  const latestSession = [...bySession.entries()]
    .map(([sessionId, sessionAttempts]) => ({
      sessionId,
      attempts: sessionAttempts,
      latestAt: Math.max(
        ...sessionAttempts.map((attempt) =>
          new Date(attempt.created_at).getTime(),
        ),
      ),
    }))
    .sort((left, right) => right.latestAt - left.latestAt)[0];

  if (!latestSession) {
    return {
      sessionId: null,
      attemptCount: 0,
      firstScore: null,
      retryScore: null,
      verified: false,
    };
  }

  const sessionAttempts = latestSession.attempts.sort(
    (left, right) =>
      new Date(left.created_at).getTime() - new Date(right.created_at).getTime(),
  );
  const first = sessionAttempts[0] ?? null;
  const retry = sessionAttempts[sessionAttempts.length - 1] ?? null;

  return {
    sessionId: latestSession.sessionId,
    attemptCount: sessionAttempts.length,
    firstScore: first?.score ?? null,
    retryScore: sessionAttempts.length >= 2 ? retry?.score ?? null : null,
    verified:
      sessionAttempts.length >= 2 && (retry?.score ?? 0) >= passScore,
  };
}

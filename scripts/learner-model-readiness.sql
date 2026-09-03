-- Read-only aggregate preflight for the learner-model benchmark.
--
-- Privacy boundary:
-- - emits counts/timestamps only
-- - never emits user ids, response_text, transcripts, prompts, context ids, or metadata
-- - does not mutate production data
--
-- Exact learner-level held-out sufficiency is checked again in TypeScript after a privacy-safe export.

WITH classified AS (
  SELECT
    e.user_id,
    e.evidence_type,
    e.success,
    e.created_at,
    (
      e.support_level = 0
      AND a.support_level = 0
      AND a.hint_count = 0
      AND a.reveal_used = false
    ) AS independent,
    (
      e.evidence_type = 'transfer'
      AND e.context_id IS NOT NULL
      AND prior_context.context_id IS NOT NULL
      AND e.context_id IS DISTINCT FROM prior_context.context_id
    ) AS changed_context,
    CASE
      WHEN e.evidence_type = 'retention' AND prior_independent_success.created_at IS NOT NULL
        THEN EXTRACT(EPOCH FROM (e.created_at - prior_independent_success.created_at)) / 86400.0
      ELSE NULL
    END AS delay_days
  FROM public.learning_evidence_events AS e
  JOIN public.learning_attempts AS a
    ON a.id = e.attempt_id
  LEFT JOIN LATERAL (
    SELECT prior.context_id
    FROM public.learning_evidence_events AS prior
    WHERE prior.user_id = e.user_id
      AND prior.target_id = e.target_id
      AND prior.success = true
      AND prior.evidence_type IN ('production', 'repair', 'transfer')
      AND prior.context_id IS NOT NULL
      AND (prior.created_at, prior.id) < (e.created_at, e.id)
    ORDER BY prior.created_at DESC, prior.id DESC
    LIMIT 1
  ) AS prior_context ON true
  LEFT JOIN LATERAL (
    SELECT prior.created_at
    FROM public.learning_evidence_events AS prior
    JOIN public.learning_attempts AS prior_attempt
      ON prior_attempt.id = prior.attempt_id
    WHERE prior.user_id = e.user_id
      AND prior.target_id = e.target_id
      AND prior.success = true
      AND prior.support_level = 0
      AND prior_attempt.support_level = 0
      AND prior_attempt.hint_count = 0
      AND prior_attempt.reveal_used = false
      AND prior.evidence_type IN ('retrieval', 'listening', 'production', 'repair', 'transfer', 'retention')
      AND (prior.created_at, prior.id) < (e.created_at, e.id)
    ORDER BY prior.created_at DESC, prior.id DESC
    LIMIT 1
  ) AS prior_independent_success ON true
), summarized AS (
  SELECT
    COUNT(*)::bigint AS evidence_events,
    COUNT(DISTINCT user_id)::bigint AS learners,
    COUNT(*) FILTER (
      WHERE independent
        AND (
          (evidence_type = 'transfer' AND changed_context)
          OR (evidence_type = 'retention' AND delay_days >= 1)
        )
    )::bigint AS target_outcomes,
    COUNT(DISTINCT user_id) FILTER (
      WHERE independent
        AND (
          (evidence_type = 'transfer' AND changed_context)
          OR (evidence_type = 'retention' AND delay_days >= 1)
        )
    )::bigint AS outcome_learners,
    COUNT(*) FILTER (
      WHERE independent
        AND success
        AND (
          (evidence_type = 'transfer' AND changed_context)
          OR (evidence_type = 'retention' AND delay_days >= 1)
        )
    )::bigint AS positive_outcomes,
    COUNT(*) FILTER (
      WHERE independent
        AND NOT success
        AND (
          (evidence_type = 'transfer' AND changed_context)
          OR (evidence_type = 'retention' AND delay_days >= 1)
        )
    )::bigint AS negative_outcomes,
    COUNT(*) FILTER (
      WHERE independent
        AND evidence_type = 'transfer'
        AND changed_context
    )::bigint AS transfer_outcomes,
    COUNT(*) FILTER (
      WHERE independent
        AND evidence_type = 'retention'
        AND delay_days >= 1
    )::bigint AS retention_outcomes,
    MIN(created_at) AS first_evidence_at,
    MAX(created_at) AS latest_evidence_at
  FROM classified
)
SELECT
  evidence_events,
  learners,
  target_outcomes,
  outcome_learners,
  positive_outcomes,
  negative_outcomes,
  transfer_outcomes,
  retention_outcomes,
  first_evidence_at,
  latest_evidence_at,
  CASE
    WHEN evidence_events = 0 THEN 'no-evidence'
    WHEN learners < 2 THEN 'insufficient-learners'
    WHEN target_outcomes = 0 THEN 'no-target-outcomes'
    WHEN positive_outcomes = 0 OR negative_outcomes = 0 THEN 'target-label-collapse'
    ELSE 'exportable-needs-held-out-check'
  END AS readiness_status
FROM summarized;

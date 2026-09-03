-- Read-only privacy-safe export for the learner-model benchmark.
--
-- Output contract matches LearnerModelBenchmarkDataset.
-- Raw user ids are used only inside this query to derive stable within-export pseudonyms.
-- The result never includes response_text, transcript/audio payloads, prompts, context ids,
-- metadata, email, name, or any other free text beyond canonical target ids.
--
-- Run scripts/learner-model-readiness.sql first. An empty export is expected while production
-- has no canonical evidence and must not be treated as a benchmark dataset.

WITH ranked_learners AS (
  SELECT
    user_id,
    DENSE_RANK() OVER (ORDER BY user_id) AS learner_rank
  FROM (
    SELECT DISTINCT user_id
    FROM public.learning_evidence_events
  ) AS learners
), classified AS (
  SELECT
    e.id AS evidence_id,
    'learner-' || LPAD(r.learner_rank::text, 6, '0') AS learner_key,
    e.target_id,
    e.evidence_type,
    e.success,
    e.confidence,
    e.support_level,
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
  JOIN ranked_learners AS r
    ON r.user_id = e.user_id
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
)
SELECT jsonb_build_object(
  'datasetId', 'atoenglish-canonical-evidence-' || TO_CHAR(CURRENT_TIMESTAMP AT TIME ZONE 'UTC', 'YYYYMMDD"T"HH24MISS"Z"'),
  'synthetic', false,
  'records', COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'learnerKey', learner_key,
        'targetId', target_id,
        'evidenceType', evidence_type,
        'success', success,
        'confidence', confidence,
        'supportLevel', support_level,
        'independent', independent,
        'changedContext', changed_context,
        'delayDays', delay_days,
        'occurredAt', created_at
      )
      ORDER BY learner_key, created_at, evidence_id
    ),
    '[]'::jsonb
  )
) AS benchmark_dataset
FROM classified;

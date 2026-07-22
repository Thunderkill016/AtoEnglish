alter table public.lesson_v2_evidence
  add constraint lesson_v2_evidence_payload_size_check
  check (octet_length(evidence::text) <= 8192),
  add constraint lesson_v2_evidence_review_time_check
  check (next_review_at is null or next_review_at >= completed_at),
  add constraint lesson_v2_evidence_source_check
  check (source = 'lesson-v2-web');

create unique index if not exists lesson_v2_evidence_completion_key
  on public.lesson_v2_evidence (anonymous_id, lesson_id, completed_at);

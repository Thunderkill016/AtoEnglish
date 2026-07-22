alter table public.lesson_v2_evidence
  drop constraint if exists lesson_v2_evidence_session_kind_check;

alter table public.lesson_v2_evidence
  add constraint lesson_v2_evidence_session_kind_check
  check (
    session_kind in (
      'encounter',
      'communicate',
      'retain_transfer',
      'checkpoint'
    )
  );

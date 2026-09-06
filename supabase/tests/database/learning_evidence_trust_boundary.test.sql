begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(5);

select ok(
  not has_function_privilege(
    'authenticated',
    to_regprocedure('private.record_learning_attempt_core(text,text,uuid,text,text,text,text,text,boolean,integer,integer,boolean,integer,jsonb,text,text,boolean,double precision,text,text,jsonb)'),
    'EXECUTE'
  ),
  'authenticated cannot execute the privileged learning-attempt core directly'
);

insert into auth.users (id, aud, role, email, created_at, updated_at)
values (
  '33333333-3333-4333-8333-333333333333',
  'authenticated',
  'authenticated',
  'evidence-boundary@atoenglish.test',
  now(),
  now()
);

-- Reproduce the Supabase/PostgREST boundary: the database connection is owned
-- by authenticator and then switches to the JWT role for the request.
set session authorization authenticator;
set role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}',
  true
);
select set_config('request.jwt.claim.sub', '33333333-3333-4333-8333-333333333333', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

select throws_ok(
  $$
    select public.record_learning_attempt(
      p_knowledge_item_id => null,
      p_capability_id => 'CAP-FORGED',
      p_session_id => null,
      p_exercise_type => 'security:forged-evidence',
      p_response_modality => 'choice',
      p_prompt_id => 'security:forged-evidence',
      p_context_id => 'security:forged-evidence:v1',
      p_response_text => 'caller says correct',
      p_correct => true,
      p_latency_ms => 1,
      p_hint_count => 0,
      p_reveal_used => false,
      p_support_level => 0,
      p_metadata => '{}'::jsonb,
      p_evidence_type => 'recognition',
      p_evidence_target_id => 'CAP-FORGED',
      p_evidence_success => true,
      p_evidence_confidence => 1.0,
      p_evidence_context_id => 'security:forged-evidence:v1',
      p_evaluator => 'caller-controlled',
      p_evidence_metadata => '{}'::jsonb
    )
  $$,
  '42501',
  'Client-supplied mastery evidence is not accepted',
  'Data API learner cannot turn caller-controlled success into mastery evidence'
);

select lives_ok(
  $$
    select public.record_learning_attempt(
      p_knowledge_item_id => null,
      p_capability_id => 'CAP-RAW-ATTEMPT',
      p_session_id => null,
      p_exercise_type => 'security:raw-attempt',
      p_response_modality => 'choice',
      p_prompt_id => 'security:raw-attempt',
      p_context_id => 'security:raw-attempt:v1',
      p_response_text => 'raw response',
      p_correct => true,
      p_latency_ms => 1,
      p_hint_count => 0,
      p_reveal_used => false,
      p_support_level => 0,
      p_metadata => '{}'::jsonb,
      p_evidence_type => null,
      p_evidence_target_id => null,
      p_evidence_success => null,
      p_evidence_confidence => null,
      p_evidence_context_id => null,
      p_evaluator => 'client-observation',
      p_evidence_metadata => '{}'::jsonb
    )
  $$,
  'Data API learner can still record a raw non-authoritative attempt'
);

reset role;
reset session authorization;

select is(
  (select count(*) from public.learning_evidence_events where target_id = 'CAP-FORGED'),
  0::bigint,
  'rejected forged call creates no evidence rows'
);

select is(
  (select count(*) from public.learner_skill_states where target_id = 'CAP-FORGED'),
  0::bigint,
  'rejected forged call cannot mutate learner mastery state'
);

select is(
  (select count(*) from public.learning_attempts where capability_id = 'CAP-RAW-ATTEMPT'),
  1::bigint,
  'raw attempt is preserved without granting mastery'
);

select * from finish();
rollback;

begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(8);

select ok(
  not has_function_privilege(
    'authenticated',
    to_regprocedure('private.assign_league_for_user_internal(uuid)'),
    'EXECUTE'
  ),
  'authenticated cannot directly execute private league assignment primitive'
);

select ok(
  not has_function_privilege(
    'authenticated',
    to_regprocedure('private.grant_streak_freeze_internal(uuid,integer)'),
    'EXECUTE'
  ),
  'authenticated cannot directly execute private streak-freeze primitive'
);

select ok(
  has_function_privilege(
    'service_role',
    to_regprocedure('private.assign_league_for_user_internal(uuid)'),
    'EXECUTE'
  ),
  'service role retains private league assignment access'
);

select ok(
  has_function_privilege(
    'service_role',
    to_regprocedure('private.grant_streak_freeze_internal(uuid,integer)'),
    'EXECUTE'
  ),
  'service role retains private streak-freeze grant access'
);

select ok(
  has_function_privilege(
    'authenticated',
    to_regprocedure('public.assign_league_for_user(uuid)'),
    'EXECUTE'
  ),
  'authenticated retains the public self-scoped league wrapper'
);

select ok(
  has_function_privilege(
    'authenticated',
    to_regprocedure('public.grant_streak_freeze(uuid,integer)'),
    'EXECUTE'
  ),
  'authenticated retains the public self-scoped streak-freeze wrapper'
);

insert into auth.users (id, aud, role, email, created_at, updated_at)
values
  (
    '55555555-5555-4555-8555-555555555555',
    'authenticated',
    'authenticated',
    'gamification-owner@atoenglish.test',
    now(),
    now()
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    'authenticated',
    'authenticated',
    'gamification-other@atoenglish.test',
    now(),
    now()
  );

select set_config(
  'request.jwt.claims',
  '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated"}',
  true
);
select set_config('request.jwt.claim.sub', '55555555-5555-4555-8555-555555555555', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select lives_ok(
  $$
    select public.assign_league_for_user(
      '55555555-5555-4555-8555-555555555555'::uuid
    )
  $$,
  'authenticated learner can still assign their own league through public wrapper'
);

select throws_ok(
  $$
    select public.assign_league_for_user(
      '66666666-6666-4666-8666-666666666666'::uuid
    )
  $$,
  '42501',
  'not authorized',
  'authenticated learner cannot assign another user through public wrapper'
);

reset role;

select * from finish();
rollback;

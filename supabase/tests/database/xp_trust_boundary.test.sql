begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(7);

select ok(
  not has_function_privilege(
    'authenticated',
    to_regprocedure('public.award_user_xp(uuid,integer,date,date)'),
    'EXECUTE'
  ),
  'authenticated cannot execute arbitrary total-XP award RPC'
);

select ok(
  not has_function_privilege(
    'authenticated',
    to_regprocedure('public.bump_league_xp(uuid,integer)'),
    'EXECUTE'
  ),
  'authenticated cannot execute arbitrary league-XP bump RPC'
);

select ok(
  has_function_privilege(
    'service_role',
    to_regprocedure('public.award_user_xp(uuid,integer,date,date)'),
    'EXECUTE'
  ),
  'service role retains privileged total-XP compatibility access'
);

select ok(
  has_function_privilege(
    'service_role',
    to_regprocedure('public.bump_league_xp(uuid,integer)'),
    'EXECUTE'
  ),
  'service role retains privileged league-XP compatibility access'
);

insert into auth.users (id, aud, role, email, created_at, updated_at)
values (
  '44444444-4444-4444-8444-444444444444',
  'authenticated',
  'authenticated',
  'xp-boundary@atoenglish.test',
  now(),
  now()
);

select set_config(
  'request.jwt.claims',
  '{"sub":"44444444-4444-4444-8444-444444444444","role":"authenticated"}',
  true
);
select set_config('request.jwt.claim.sub', '44444444-4444-4444-8444-444444444444', true);
select set_config('request.jwt.claim.role', 'authenticated', true);
set local role authenticated;

select lives_ok(
  $$
    select public.complete_unit_transaction(
      '44444444-4444-4444-8444-444444444444'::uuid,
      'unit-a0-1',
      60,
      3,
      '2099-01-01'
    )
  $$,
  'validated unit completion remains available to authenticated learner'
);

reset role;

select is(
  (
    select total_xp
    from public.user_progress
    where user_id = '44444444-4444-4444-8444-444444444444'::uuid
  ),
  60,
  'validated unit completion awards only database-derived total XP'
);

select is(
  (
    select lm.xp_this_week
    from public.league_memberships lm
    join public.leagues l on l.id = lm.league_id
    where lm.user_id = '44444444-4444-4444-8444-444444444444'::uuid
      and l.week_start = date_trunc('week', now())::date
    limit 1
  ),
  60,
  'validated unit completion atomically awards the same database-derived league XP'
);

select * from finish();
rollback;

-- Cache auth.uid() once per statement in RLS policies so PostgreSQL does not
-- re-evaluate it for every scanned row.

alter policy "Users can view own profile" on public.users
  using ((select auth.uid()) = id);
alter policy "Users can update own profile" on public.users
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

alter policy "Users can view own progress" on public.user_progress
  using ((select auth.uid()) = user_id);
alter policy "Users can update own progress" on public.user_progress
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
alter policy "Users can insert own progress" on public.user_progress
  with check ((select auth.uid()) = user_id);

alter policy "Users can view own cards" on public.cards
  using ((select auth.uid()) = user_id);
alter policy "Users can insert own cards" on public.cards
  with check ((select auth.uid()) = user_id);
alter policy "Users can update own cards" on public.cards
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
alter policy "Users can delete own cards" on public.cards
  using ((select auth.uid()) = user_id);

alter policy "Users can view own lesson history" on public.lesson_history
  using ((select auth.uid()) = user_id);
alter policy "Users can insert own lesson history" on public.lesson_history
  with check ((select auth.uid()) = user_id);
alter policy "Users can update own lesson history" on public.lesson_history
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
alter policy "Users can delete own lesson history" on public.lesson_history
  using ((select auth.uid()) = user_id);

alter policy "Users can view own sentences" on public.user_sentences
  using ((select auth.uid()) = user_id);
alter policy "Users can insert own sentences" on public.user_sentences
  with check ((select auth.uid()) = user_id);
alter policy "Users can update own sentences" on public.user_sentences
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
alter policy "Users can delete own sentences" on public.user_sentences
  using ((select auth.uid()) = user_id);

alter policy "Users manage own push subscriptions" on public.push_subscriptions
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "league_memberships: user inserts own" on public.league_memberships
  with check ((select auth.uid()) = user_id);
alter policy "league_memberships: user updates own xp" on public.league_memberships
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users can read own notifications" on public.notification_logs
  using ((select auth.uid()) = user_id);
alter policy "Users can update own notifications (mark read)" on public.notification_logs
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users can view their own lesson progress" on public.user_lesson_progress
  using ((select auth.uid()) = user_id);
alter policy "Users can insert their own lesson progress" on public.user_lesson_progress
  with check ((select auth.uid()) = user_id);
alter policy "Users can update their own lesson progress" on public.user_lesson_progress
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "Users can view their own speaking sessions" on public.speaking_sessions
  using ((select auth.uid()) = user_id);
alter policy "Users can insert their own speaking sessions" on public.speaking_sessions
  with check ((select auth.uid()) = user_id);

alter policy "user_achievements_own" on public.user_achievements
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

alter policy "pilot events insert only" on public.pilot_events
  with check (
    anonymous_id is not null
    and (
      ((select auth.uid()) is null and user_id is null)
      or (
        (select auth.uid()) is not null
        and user_id = (select auth.uid())
      )
    )
  );

-- Cover the remaining foreign key used when joining/filtering achievements.
create index if not exists idx_user_achievements_achievement_id
  on public.user_achievements (achievement_id);

-- Remove only exact duplicate indexes. Keep the constraint-backed
-- cards_user_word_unique index and the newer idx_* index names.
drop index if exists public.card_review_logs_card_id_idx;
drop index if exists public.card_review_logs_review_idx;
drop index if exists public.card_review_logs_user_id_idx;
drop index if exists public.cards_due_date_idx;
drop index if exists public.unique_user_word;

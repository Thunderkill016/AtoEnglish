-- Close the authenticated execution bypass around privileged gamification helpers.
-- Browser/Data API callers must enter through public wrappers that enforce JWT self scope.

REVOKE ALL ON FUNCTION private.assign_league_for_user_internal(uuid)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.assign_league_for_user_internal(uuid)
  TO service_role;

REVOKE ALL ON FUNCTION private.grant_streak_freeze_internal(uuid, integer)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.grant_streak_freeze_internal(uuid, integer)
  TO service_role;

CREATE OR REPLACE FUNCTION public.assign_league_for_user(p_user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_role text := (SELECT auth.role());
BEGIN
  IF v_role = 'service_role' THEN
    NULL;
  ELSIF v_role = 'authenticated'
        AND v_uid IS NOT NULL
        AND p_user_id IS NOT DISTINCT FROM v_uid THEN
    NULL;
  ELSE
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  RETURN private.assign_league_for_user_internal(p_user_id);
END;
$function$;

REVOKE ALL ON FUNCTION public.assign_league_for_user(uuid)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.assign_league_for_user(uuid)
  TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.grant_streak_freeze(
  p_user_id uuid,
  p_count integer DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_uid uuid := (SELECT auth.uid());
  v_role text := (SELECT auth.role());
BEGIN
  IF v_role = 'service_role' THEN
    NULL;
  ELSIF v_role = 'authenticated'
        AND v_uid IS NOT NULL
        AND p_user_id IS NOT DISTINCT FROM v_uid THEN
    NULL;
  ELSE
    RAISE EXCEPTION 'not authorized' USING ERRCODE = '42501';
  END IF;

  PERFORM private.grant_streak_freeze_internal(p_user_id, p_count);
END;
$function$;

REVOKE ALL ON FUNCTION public.grant_streak_freeze(uuid, integer)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.grant_streak_freeze(uuid, integer)
  TO authenticated, service_role;

COMMENT ON FUNCTION private.assign_league_for_user_internal(uuid)
  IS 'Privileged league-assignment primitive. Authenticated learners must use the self-scoped public wrapper.';
COMMENT ON FUNCTION private.grant_streak_freeze_internal(uuid, integer)
  IS 'Privileged streak-freeze grant primitive. Authenticated learners must use the self-scoped public wrapper.';

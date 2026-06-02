-- Lock down sensitive columns on profiles from user self-edits.
-- The existing "Users update own profile" policy stays for non-sensitive fields;
-- a BEFORE UPDATE trigger reverts changes to protected columns unless the actor
-- is a super-admin or the request is coming from service_role.

CREATE OR REPLACE FUNCTION public.tg_profiles_protect_sensitive()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _actor uuid := auth.uid();
  _is_service boolean := (current_setting('request.jwt.claims', true)::jsonb ->> 'role') = 'service_role';
  _is_admin boolean := false;
BEGIN
  IF _actor IS NOT NULL THEN
    _is_admin := public.is_super_admin(_actor);
  END IF;

  IF _is_service OR _is_admin THEN
    RETURN NEW;
  END IF;

  -- Revert any attempted change to protected columns.
  NEW.subscription_status := OLD.subscription_status;
  NEW.coach_id            := OLD.coach_id;
  NEW.client_type         := OLD.client_type;
  NEW.is_demo             := OLD.is_demo;
  NEW.tenant_id           := OLD.tenant_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_protect_sensitive ON public.profiles;
CREATE TRIGGER profiles_protect_sensitive
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_profiles_protect_sensitive();
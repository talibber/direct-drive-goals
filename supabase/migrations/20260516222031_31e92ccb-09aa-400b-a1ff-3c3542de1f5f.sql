
CREATE TABLE IF NOT EXISTS public.staff_allowlist (
  email TEXT PRIMARY KEY,
  role public.app_role NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_allowlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff view allowlist" ON public.staff_allowlist;
CREATE POLICY "Staff view allowlist" ON public.staff_allowlist
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Owners manage allowlist" ON public.staff_allowlist;
CREATE POLICY "Owners manage allowlist" ON public.staff_allowlist
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'owner'))
  WITH CHECK (public.has_role(auth.uid(), 'owner'));

INSERT INTO public.staff_allowlist (email, role)
VALUES ('tyronerayallen@gmail.com', 'owner')
ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role;

CREATE OR REPLACE FUNCTION public.promote_allowlisted_staff()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  SELECT role INTO _role
  FROM public.staff_allowlist
  WHERE lower(email) = lower(NEW.email)
  LIMIT 1;

  IF _role IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.staff_members WHERE user_id = NEW.id
  ) THEN
    INSERT INTO public.staff_members (user_id, role, email, display_name)
    VALUES (NEW.id, _role, NEW.email, split_part(NEW.email, '@', 1));
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_promote_staff ON auth.users;
CREATE TRIGGER on_auth_user_created_promote_staff
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.promote_allowlisted_staff();

INSERT INTO public.staff_members (user_id, role, email, display_name)
SELECT u.id, sa.role, u.email, split_part(u.email, '@', 1)
FROM auth.users u
JOIN public.staff_allowlist sa ON lower(sa.email) = lower(u.email)
WHERE NOT EXISTS (SELECT 1 FROM public.staff_members sm WHERE sm.user_id = u.id);

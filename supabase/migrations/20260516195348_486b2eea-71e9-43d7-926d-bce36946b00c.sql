
-- 1. Tenants
CREATE TABLE IF NOT EXISTS public.tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read tenants" ON public.tenants FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff manage tenants" ON public.tenants FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

INSERT INTO public.tenants (slug, name, is_demo) VALUES
  ('production', 'Terrible Coaching (Production)', false),
  ('demo', 'Demo Workspace', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. System settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth read settings" ON public.system_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff write settings" ON public.system_settings FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

INSERT INTO public.system_settings (key, value) VALUES
  ('messaging_auto_send_enabled', 'false'::jsonb),
  ('breach_auto_charge_enabled', 'false'::jsonb),
  ('payments_live_enabled', 'false'::jsonb),
  ('environment_label', '"beta"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 3. Legal acceptances
CREATE TABLE IF NOT EXISTS public.legal_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  document text NOT NULL,
  version text NOT NULL DEFAULT 'v1',
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  UNIQUE (user_id, document, version)
);
ALTER TABLE public.legal_acceptances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users insert own acceptance" ON public.legal_acceptances FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own acceptance" ON public.legal_acceptances FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- 4. tenant_id columns
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','goals','weekly_checkins','coach_message_drafts','commitment_breaches',
    'help_radar_items','coaching_events','direct_access_messages','community_posts',
    'community_comments','client_points','coach_activity','client_timeline_events',
    'action_queue_items','goal_proof_submissions','content_assignments','conversations','messages'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS tenant_id uuid', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON public.%I(tenant_id)', t || '_tenant_idx', t);
  END LOOP;
END $$;

-- 5. Backfill (must run after columns exist)
UPDATE public.profiles SET tenant_id = (
  SELECT id FROM public.tenants WHERE slug = CASE WHEN public.profiles.is_demo THEN 'demo' ELSE 'production' END
) WHERE tenant_id IS NULL;

UPDATE public.goals g SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = g.user_id AND g.tenant_id IS NULL;
UPDATE public.weekly_checkins w SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = w.client_id AND w.tenant_id IS NULL;
UPDATE public.coach_message_drafts d SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = d.user_id AND d.tenant_id IS NULL;
UPDATE public.commitment_breaches b SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = b.user_id AND b.tenant_id IS NULL;
UPDATE public.help_radar_items h SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = h.client_id AND h.tenant_id IS NULL;
UPDATE public.coaching_events e SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = e.user_id AND e.tenant_id IS NULL;
UPDATE public.direct_access_messages m SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = m.client_id AND m.tenant_id IS NULL;
UPDATE public.community_posts c SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = c.client_id AND c.tenant_id IS NULL;
UPDATE public.community_comments c SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = c.client_id AND c.tenant_id IS NULL;
UPDATE public.client_points cp SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = cp.client_id AND cp.tenant_id IS NULL;
UPDATE public.coach_activity ca SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = ca.client_id AND ca.tenant_id IS NULL;
UPDATE public.client_timeline_events cte SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = cte.client_id AND cte.tenant_id IS NULL;
UPDATE public.action_queue_items aq SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = aq.client_id AND aq.tenant_id IS NULL;
UPDATE public.goal_proof_submissions gps SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = gps.client_id AND gps.tenant_id IS NULL;
UPDATE public.content_assignments cas SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = cas.client_id AND cas.tenant_id IS NULL;
UPDATE public.conversations cv SET tenant_id = p.tenant_id FROM public.profiles p WHERE p.user_id = cv.client_id AND cv.tenant_id IS NULL;
UPDATE public.messages msg SET tenant_id = cv.tenant_id FROM public.conversations cv WHERE cv.id = msg.conversation_id AND msg.tenant_id IS NULL;

-- 6. Helpers
CREATE OR REPLACE FUNCTION public.current_tenant(_user uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT tenant_id FROM public.profiles WHERE user_id = _user LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.production_tenant_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id FROM public.tenants WHERE slug = 'production' LIMIT 1
$$;

-- 7. Default tenant for new profiles via trigger
CREATE OR REPLACE FUNCTION public.tg_profile_default_tenant()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.tenant_id IS NULL THEN
    NEW.tenant_id := (SELECT id FROM public.tenants WHERE slug = CASE WHEN NEW.is_demo THEN 'demo' ELSE 'production' END LIMIT 1);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_profile_default_tenant ON public.profiles;
CREATE TRIGGER trg_profile_default_tenant BEFORE INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.tg_profile_default_tenant();

-- 8. Extra columns
ALTER TABLE public.coach_message_drafts ADD COLUMN IF NOT EXISTS regeneration_count integer NOT NULL DEFAULT 0;
ALTER TABLE public.commitment_breaches ADD COLUMN IF NOT EXISTS lifecycle_status text NOT NULL DEFAULT 'candidate';
UPDATE public.commitment_breaches SET lifecycle_status =
  CASE WHEN charged THEN 'charged' WHEN waived THEN 'waived'
       WHEN decision = 'approved' THEN 'approved'
       WHEN decision = 'disputed' THEN 'disputed' ELSE 'candidate' END;
DO $$ BEGIN
  ALTER TABLE public.commitment_breaches
    ADD CONSTRAINT commitment_breaches_lifecycle_status_chk
    CHECK (lifecycle_status IN ('candidate','approved','waived','charged','disputed'));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 9. Goal status → event trigger
CREATE OR REPLACE FUNCTION public.tg_goal_status_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.is_demo THEN RETURN NEW; END IF;
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status::text IN ('at_risk','missed') THEN
    INSERT INTO public.coaching_events(user_id, goal_id, event_type, priority, risk_level, event_payload, tenant_id, is_demo)
    VALUES (NEW.user_id, NEW.id,
      CASE WHEN NEW.status::text='at_risk' THEN 'goal_at_risk' ELSE 'goal_missed' END,
      CASE WHEN NEW.status::text='missed' THEN 1 ELSE 2 END,
      CASE WHEN NEW.status::text='missed' THEN 'high' ELSE 'medium' END,
      jsonb_build_object('goal_title', NEW.title, 'prior_status', OLD.status::text, 'new_status', NEW.status::text),
      NEW.tenant_id, false);
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_goal_status_event ON public.goals;
CREATE TRIGGER trg_goal_status_event AFTER UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.tg_goal_status_event();

-- 10. Check-in trigger
CREATE OR REPLACE FUNCTION public.tg_checkin_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.is_demo THEN RETURN NEW; END IF;
  INSERT INTO public.coaching_events(user_id, event_type, priority, risk_level, event_payload, tenant_id, is_demo)
  VALUES (NEW.client_id, 'weekly_checkin_submitted', 3, 'low',
          jsonb_build_object('checkin_id', NEW.id), NEW.tenant_id, false);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_checkin_event ON public.weekly_checkins;
CREATE TRIGGER trg_checkin_event AFTER INSERT ON public.weekly_checkins
  FOR EACH ROW EXECUTE FUNCTION public.tg_checkin_event();

-- 11. Help radar trigger
CREATE OR REPLACE FUNCTION public.tg_help_radar_event()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.is_demo THEN RETURN NEW; END IF;
  INSERT INTO public.coaching_events(user_id, event_type, priority, risk_level, event_payload, tenant_id, is_demo)
  VALUES (NEW.client_id, 'help_radar_signal', 2, 'medium',
          jsonb_build_object('category', NEW.category, 'item_id', NEW.id), NEW.tenant_id, false);
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS trg_help_radar_event ON public.help_radar_items;
CREATE TRIGGER trg_help_radar_event AFTER INSERT ON public.help_radar_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_help_radar_event();

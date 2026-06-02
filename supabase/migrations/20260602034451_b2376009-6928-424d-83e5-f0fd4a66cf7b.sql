
-- 1. profiles.coach_id
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coach_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_coach_id ON public.profiles(coach_id);

UPDATE public.profiles
SET coach_id = 'feb02c94-774e-4a33-9c82-b174d2d25405'
WHERE coach_id IS NULL
  AND client_type = 'real'
  AND is_demo = false
  AND user_id <> 'feb02c94-774e-4a33-9c82-b174d2d25405';

-- 2. subscription_status validation
CREATE OR REPLACE FUNCTION public.tg_validate_subscription_status()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.subscription_status IS NOT NULL AND NEW.subscription_status NOT IN
    ('unprovisioned','pending_payment','active','trial','past_due','canceled') THEN
    RAISE EXCEPTION 'invalid subscription_status: %', NEW.subscription_status;
  END IF;
  RETURN NEW;
END;
$$;

UPDATE public.profiles
SET subscription_status = 'unprovisioned'
WHERE subscription_status IS NULL
   OR subscription_status NOT IN ('unprovisioned','pending_payment','active','trial','past_due','canceled');

DROP TRIGGER IF EXISTS tg_profiles_validate_sub_status ON public.profiles;
CREATE TRIGGER tg_profiles_validate_sub_status
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.tg_validate_subscription_status();

-- 3. Helpers (super admin = 'owner' role)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.staff_members WHERE user_id = _user AND role = 'owner'::app_role)
$$;

CREATE OR REPLACE FUNCTION public.is_coach_of(_coach uuid, _client uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_super_admin(_coach) OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _client AND coach_id = _coach
  )
$$;

-- 4. handle_new_user: never auto-activate; default coach = founding owner
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _app_status text;
  _initial text := 'unprovisioned';
  _default_coach uuid := 'feb02c94-774e-4a33-9c82-b174d2d25405';
BEGIN
  SELECT status INTO _app_status
  FROM public.applications
  WHERE lower(email) = lower(NEW.email)
  ORDER BY created_at DESC LIMIT 1;

  IF _app_status = 'accepted' THEN _initial := 'pending_payment'; END IF;

  INSERT INTO public.profiles (user_id, email, display_name, coaching_track, subscription_status, coach_id, client_type, is_demo)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'coaching_track', 'life'),
    _initial, _default_coach, 'real', false
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 5. Goal coach inheritance
CREATE OR REPLACE FUNCTION public.tg_goal_inherit_coach()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.coach_id IS NULL THEN
    SELECT coach_id INTO NEW.coach_id FROM public.profiles WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tg_goals_inherit_coach ON public.goals;
CREATE TRIGGER tg_goals_inherit_coach
BEFORE INSERT ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.tg_goal_inherit_coach();

UPDATE public.goals g
SET coach_id = p.coach_id
FROM public.profiles p
WHERE g.user_id = p.user_id AND g.coach_id IS NULL AND p.coach_id IS NOT NULL;

-- 6. RLS hardening
DROP POLICY IF EXISTS "Staff view all goals" ON public.goals;
DROP POLICY IF EXISTS "Staff update goals" ON public.goals;
CREATE POLICY "Coach or staff view assigned goals" ON public.goals FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), user_id));
CREATE POLICY "Coach or staff update assigned goals" ON public.goals FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), user_id)) WITH CHECK (public.is_coach_of(auth.uid(), user_id));

DROP POLICY IF EXISTS "Staff view all weekly checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Staff update weekly checkins" ON public.weekly_checkins;
CREATE POLICY "Coach or staff view assigned checkins" ON public.weekly_checkins FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff update assigned checkins" ON public.weekly_checkins FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff view all radar items" ON public.help_radar_items;
DROP POLICY IF EXISTS "Staff update all radar items" ON public.help_radar_items;
CREATE POLICY "Coach or staff view assigned radar" ON public.help_radar_items FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff update assigned radar" ON public.help_radar_items FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff view all breaches" ON public.commitment_breaches;
DROP POLICY IF EXISTS "Staff update breaches" ON public.commitment_breaches;
DROP POLICY IF EXISTS "Staff insert breaches" ON public.commitment_breaches;
CREATE POLICY "Coach or staff view assigned breaches" ON public.commitment_breaches FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), user_id));
CREATE POLICY "Coach or staff update assigned breaches" ON public.commitment_breaches FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), user_id)) WITH CHECK (public.is_coach_of(auth.uid(), user_id));
CREATE POLICY "Coach or staff insert assigned breaches" ON public.commitment_breaches FOR INSERT TO authenticated WITH CHECK (public.is_coach_of(auth.uid(), user_id));

DROP POLICY IF EXISTS "Staff view all message drafts" ON public.coach_message_drafts;
DROP POLICY IF EXISTS "Staff update message drafts" ON public.coach_message_drafts;
DROP POLICY IF EXISTS "Staff insert message drafts" ON public.coach_message_drafts;
CREATE POLICY "Coach or staff view assigned drafts" ON public.coach_message_drafts FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), user_id));
CREATE POLICY "Coach or staff update assigned drafts" ON public.coach_message_drafts FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), user_id)) WITH CHECK (public.is_coach_of(auth.uid(), user_id));
CREATE POLICY "Coach or staff insert assigned drafts" ON public.coach_message_drafts FOR INSERT TO authenticated WITH CHECK (public.is_coach_of(auth.uid(), user_id));

DROP POLICY IF EXISTS "Coaches can view all messages" ON public.direct_access_messages;
DROP POLICY IF EXISTS "Coaches can update all messages" ON public.direct_access_messages;
CREATE POLICY "Assigned coach or staff view messages" ON public.direct_access_messages FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Assigned coach or staff update messages" ON public.direct_access_messages FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Users create own events" ON public.coaching_events;
DROP POLICY IF EXISTS "Staff view all coaching events" ON public.coaching_events;
CREATE POLICY "Coach or staff view coaching events" ON public.coaching_events FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), user_id));

DROP POLICY IF EXISTS "Staff view all goal proof submissions" ON public.goal_proof_submissions;
DROP POLICY IF EXISTS "Staff update goal proof submissions" ON public.goal_proof_submissions;
CREATE POLICY "Coach or staff view proofs" ON public.goal_proof_submissions FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff update proofs" ON public.goal_proof_submissions FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff manage timeline events" ON public.client_timeline_events;
CREATE POLICY "Coach or staff manage timeline events" ON public.client_timeline_events FOR ALL TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff manage action queue" ON public.action_queue_items;
CREATE POLICY "Coach or staff manage action queue" ON public.action_queue_items FOR ALL TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff view all automation" ON public.client_automation_settings;
DROP POLICY IF EXISTS "Staff update automation" ON public.client_automation_settings;
DROP POLICY IF EXISTS "Staff insert automation" ON public.client_automation_settings;
CREATE POLICY "Coach or staff view automation" ON public.client_automation_settings FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff update automation" ON public.client_automation_settings FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff insert automation" ON public.client_automation_settings FOR INSERT TO authenticated WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff view assessment results" ON public.assessment_results;
DROP POLICY IF EXISTS "Staff update assessment results" ON public.assessment_results;
CREATE POLICY "Coach or staff view assessments" ON public.assessment_results FOR SELECT TO authenticated USING (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff update assessments" ON public.assessment_results FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff insert points" ON public.client_points;
DROP POLICY IF EXISTS "Staff update points" ON public.client_points;
CREATE POLICY "Coach or staff insert points" ON public.client_points FOR INSERT TO authenticated WITH CHECK (public.is_coach_of(auth.uid(), client_id));
CREATE POLICY "Coach or staff update points" ON public.client_points FOR UPDATE TO authenticated USING (public.is_coach_of(auth.uid(), client_id)) WITH CHECK (public.is_coach_of(auth.uid(), client_id));

DROP POLICY IF EXISTS "Staff insert achievements" ON public.achievements;
CREATE POLICY "Coach or staff insert achievements" ON public.achievements FOR INSERT TO authenticated WITH CHECK (public.is_coach_of(auth.uid(), client_id));

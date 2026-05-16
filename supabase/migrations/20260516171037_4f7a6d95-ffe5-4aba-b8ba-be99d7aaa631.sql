
-- ============ PHASE 1: ADD DEMO/REAL FLAGS ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production',
  ADD COLUMN IF NOT EXISTS client_type text NOT NULL DEFAULT 'real',
  ADD COLUMN IF NOT EXISTS pod_id uuid,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS subscription_tier text,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.goals                  ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
ALTER TABLE public.weekly_checkins        ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production', ADD COLUMN IF NOT EXISTS goal_id uuid, ADD COLUMN IF NOT EXISTS completion_status text, ADD COLUMN IF NOT EXISTS confidence_score integer, ADD COLUMN IF NOT EXISTS needs_help boolean DEFAULT false, ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.community_posts        ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production', ADD COLUMN IF NOT EXISTS pod_id uuid;
ALTER TABLE public.community_comments     ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production', ADD COLUMN IF NOT EXISTS pod_id uuid;
ALTER TABLE public.coach_message_drafts   ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
ALTER TABLE public.commitment_breaches    ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production', ADD COLUMN IF NOT EXISTS auto_charge_disabled boolean NOT NULL DEFAULT true;
ALTER TABLE public.help_radar_items       ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
ALTER TABLE public.client_points          ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
ALTER TABLE public.direct_access_messages ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';
ALTER TABLE public.coaching_events        ADD COLUMN IF NOT EXISTS is_demo boolean NOT NULL DEFAULT false, ADD COLUMN IF NOT EXISTS environment text NOT NULL DEFAULT 'production';

ALTER TABLE public.client_automation_settings
  ADD COLUMN IF NOT EXISTS human_in_loop boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS human_in_loop_start_date timestamptz,
  ADD COLUMN IF NOT EXISTS human_in_loop_end_date timestamptz;

-- ============ HELPERS ============
CREATE OR REPLACE FUNCTION public.same_pod(_user uuid, _pod uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _pod IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.profiles WHERE user_id = _user AND pod_id = _pod
  )
$$;

CREATE OR REPLACE FUNCTION public.can_view_post(_user uuid, _post_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = _post_id
      AND p.is_moderated = false
      AND (
        p.client_id = _user
        OR public.is_staff(_user)
        OR public.same_pod(_user, p.pod_id)
      )
  )
$$;

-- ============ PHASE 2: RLS HARDENING ============

-- applications: staff-only SELECT/UPDATE
DROP POLICY IF EXISTS "Authenticated users can view applications" ON public.applications;
DROP POLICY IF EXISTS "Authenticated users can update applications" ON public.applications;
CREATE POLICY "Staff can view applications" ON public.applications
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update applications" ON public.applications
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));

-- community_posts: scope to owner / pod / staff and exclude demo from non-staff
DROP POLICY IF EXISTS "Authenticated users can view non-moderated posts" ON public.community_posts;
CREATE POLICY "Scoped community posts visibility" ON public.community_posts
  FOR SELECT TO authenticated USING (
    is_moderated = false
    AND (
      public.is_staff(auth.uid())
      OR (
        is_demo = false
        AND (client_id = auth.uid() OR public.same_pod(auth.uid(), pod_id))
      )
    )
  );

-- community_comments: inherit from parent post
DROP POLICY IF EXISTS "Authenticated users can view non-moderated comments" ON public.community_comments;
CREATE POLICY "Scoped community comments visibility" ON public.community_comments
  FOR SELECT TO authenticated USING (
    is_moderated = false
    AND (public.is_staff(auth.uid()) OR public.can_view_post(auth.uid(), post_id))
  );

-- assessment_results: drop overly broad coach SELECT, replace with staff-only
DROP POLICY IF EXISTS "Coaches can view all assessment results" ON public.assessment_results;
DROP POLICY IF EXISTS "Coaches can update assessment results" ON public.assessment_results;
CREATE POLICY "Staff view assessment results" ON public.assessment_results
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update assessment results" ON public.assessment_results
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid()));

-- audit_log: restrict insert to staff (service role bypasses RLS)
DROP POLICY IF EXISTS "Auth writes audit" ON public.audit_log;
CREATE POLICY "Staff writes audit" ON public.audit_log
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

-- coach_message_drafts: clients only see sent, non-demo
DROP POLICY IF EXISTS "Users view own sent drafts" ON public.coach_message_drafts;
CREATE POLICY "Users view own sent drafts" ON public.coach_message_drafts
  FOR SELECT TO authenticated USING (
    auth.uid() = user_id AND status = 'sent' AND is_demo = false
  );

-- goals: keep existing user SELECT (auth.uid() = user_id already filters per-user)
-- coaches see all (including demo) — that's intentional for admin

-- coaching_events: clients see only own non-demo
DROP POLICY IF EXISTS "Users view own events" ON public.coaching_events;
CREATE POLICY "Users view own non-demo events" ON public.coaching_events
  FOR SELECT TO authenticated USING (auth.uid() = user_id AND is_demo = false);

-- help_radar_items: clients see only own non-demo
DROP POLICY IF EXISTS "Clients can view own radar items" ON public.help_radar_items;
CREATE POLICY "Clients view own non-demo radar items" ON public.help_radar_items
  FOR SELECT TO authenticated USING (auth.uid() = client_id AND is_demo = false);

-- commitment_breaches: clients see only own non-demo
DROP POLICY IF EXISTS "Users can view own breaches" ON public.commitment_breaches;
CREATE POLICY "Users view own non-demo breaches" ON public.commitment_breaches
  FOR SELECT TO authenticated USING (auth.uid() = user_id AND is_demo = false);

-- direct_access_messages: clients see only own non-demo
DROP POLICY IF EXISTS "Clients can view own messages" ON public.direct_access_messages;
CREATE POLICY "Clients view own non-demo messages" ON public.direct_access_messages
  FOR SELECT TO authenticated USING (auth.uid() = client_id AND is_demo = false);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_client_type ON public.profiles(client_type);
CREATE INDEX IF NOT EXISTS idx_profiles_pod_id ON public.profiles(pod_id);
CREATE INDEX IF NOT EXISTS idx_goals_is_demo ON public.goals(is_demo);

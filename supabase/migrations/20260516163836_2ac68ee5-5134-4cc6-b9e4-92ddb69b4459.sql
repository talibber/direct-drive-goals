
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('owner','lead_coach','assistant_coach','client_success','billing_admin','viewer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.staff_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'viewer',
  display_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.staff_members WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.staff_members WHERE user_id = _user_id) $$;

CREATE POLICY "Staff view staff" ON public.staff_members FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Owners manage staff" ON public.staff_members FOR ALL TO authenticated USING (public.has_role(auth.uid(),'owner')) WITH CHECK (public.has_role(auth.uid(),'owner'));

CREATE TABLE IF NOT EXISTS public.staff_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role public.app_role NOT NULL,
  permission text NOT NULL,
  UNIQUE (role, permission)
);
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff view perms" ON public.staff_permissions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Owner manages perms" ON public.staff_permissions FOR ALL TO authenticated USING (public.has_role(auth.uid(),'owner')) WITH CHECK (public.has_role(auth.uid(),'owner'));

INSERT INTO public.staff_permissions (role, permission) VALUES
 ('owner','*'),
 ('lead_coach','view_clients'),('lead_coach','send_messages'),('lead_coach','approve_responses'),('lead_coach','edit_responses'),('lead_coach','edit_goals'),('lead_coach','review_proof'),('lead_coach','change_automation'),('lead_coach','access_style_learning'),('lead_coach','manage_applications'),('lead_coach','manage_programs'),('lead_coach','view_metrics'),('lead_coach','approve_charges'),('lead_coach','waive_charges'),('lead_coach','view_billing'),
 ('assistant_coach','view_clients'),('assistant_coach','send_messages'),('assistant_coach','edit_responses'),('assistant_coach','review_proof'),('assistant_coach','access_style_learning'),
 ('client_success','view_clients'),('client_success','send_messages'),('client_success','manage_applications'),
 ('billing_admin','view_billing'),('billing_admin','approve_charges'),('billing_admin','waive_charges'),
 ('viewer','view_clients'),('viewer','view_metrics')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS public.action_queue_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  source_type text NOT NULL,
  source_id uuid,
  trigger text NOT NULL,
  risk_level text NOT NULL DEFAULT 'low',
  priority int NOT NULL DEFAULT 3,
  assigned_owner uuid,
  internal_due_at timestamptz,
  status text NOT NULL DEFAULT 'open',
  suggested_response_draft_id uuid,
  suggested_action text,
  context_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  resolved_at timestamptz,
  resolved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.action_queue_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth views queue" ON public.action_queue_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth manages queue" ON public.action_queue_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_aqi_status ON public.action_queue_items(status, priority, internal_due_at);
CREATE INDEX IF NOT EXISTS idx_aqi_client ON public.action_queue_items(client_id);

CREATE TABLE IF NOT EXISTS public.client_timeline_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  kind text NOT NULL,
  source_type text,
  source_id uuid,
  owner_id uuid,
  internal_note text,
  client_facing_note text,
  client_visible boolean NOT NULL DEFAULT false,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth views timeline" ON public.client_timeline_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth writes timeline" ON public.client_timeline_events FOR INSERT TO authenticated WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_timeline_client ON public.client_timeline_events(client_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before_value jsonb,
  after_value jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff views audit" ON public.audit_log FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Auth writes audit" ON public.audit_log FOR INSERT TO authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.style_phrase_bank (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL,
  kind text NOT NULL,
  phrase text NOT NULL,
  client_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.style_phrase_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth views phrases" ON public.style_phrase_bank FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches insert phrases" ON public.style_phrase_bank FOR INSERT TO authenticated WITH CHECK (auth.uid() = coach_id);
CREATE POLICY "Coaches update phrases" ON public.style_phrase_bank FOR UPDATE TO authenticated USING (auth.uid() = coach_id);

CREATE TABLE IF NOT EXISTS public.response_target_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track text NOT NULL DEFAULT 'all',
  message_type text NOT NULL DEFAULT 'all',
  priority int NOT NULL DEFAULT 3,
  internal_target_minutes int NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.response_target_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth views targets" ON public.response_target_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Owners manage targets" ON public.response_target_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'owner')) WITH CHECK (public.has_role(auth.uid(),'owner'));
INSERT INTO public.response_target_settings (track, message_type, priority, internal_target_minutes) VALUES
  ('all','all',3,10),('all','high_risk',1,5),('operator','direct_access',1,5);

ALTER TABLE public.coaching_events
  ADD COLUMN IF NOT EXISTS risk_level text DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS priority int DEFAULT 3,
  ADD COLUMN IF NOT EXISTS assigned_owner uuid,
  ADD COLUMN IF NOT EXISTS internal_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS suggested_action text,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS client_visible boolean DEFAULT false;

ALTER TABLE public.commitment_breaches
  ADD COLUMN IF NOT EXISTS decision text DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS evidence jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS charge_scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS charge_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS suggested_decision text;

ALTER TABLE public.help_radar_items
  ADD COLUMN IF NOT EXISTS assigned_owner uuid,
  ADD COLUMN IF NOT EXISTS follow_up_at timestamptz;

ALTER TABLE public.client_automation_settings
  ADD COLUMN IF NOT EXISTS send_status text NOT NULL DEFAULT 'first_14_days';

DROP TRIGGER IF EXISTS aqi_updated_at ON public.action_queue_items;
CREATE TRIGGER aqi_updated_at BEFORE UPDATE ON public.action_queue_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

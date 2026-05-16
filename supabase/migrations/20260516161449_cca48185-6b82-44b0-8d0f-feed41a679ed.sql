
-- client automation settings
CREATE TABLE IF NOT EXISTS public.client_automation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL UNIQUE,
  automation_level int NOT NULL DEFAULT 1 CHECK (automation_level BETWEEN 0 AND 4),
  per_trigger_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  onboarded_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.client_automation_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients view own automation"
  ON public.client_automation_settings FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Coaches view all automation"
  ON public.client_automation_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches insert automation"
  ON public.client_automation_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Coaches update automation"
  ON public.client_automation_settings FOR UPDATE TO authenticated USING (true);

-- coach_message_drafts new columns
ALTER TABLE public.coach_message_drafts
  ADD COLUMN IF NOT EXISTS risk_level text NOT NULL DEFAULT 'low',
  ADD COLUMN IF NOT EXISTS automation_eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS response_due_at timestamptz,
  ADD COLUMN IF NOT EXISTS scheduled_send_at timestamptz,
  ADD COLUMN IF NOT EXISTS tone_match_score numeric NOT NULL DEFAULT 0;

-- help_radar_items: client-visible status
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='help_radar_items' AND column_name='client_status') THEN
    ALTER TABLE public.help_radar_items ADD COLUMN client_status text NOT NULL DEFAULT 'received';
  END IF;
END$$;

-- coach_message_templates flags
ALTER TABLE public.coach_message_templates
  ADD COLUMN IF NOT EXISTS is_reusable boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS client_specific_for uuid;

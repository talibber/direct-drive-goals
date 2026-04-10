CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own onboarding progress"
  ON public.onboarding_progress FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can update own onboarding steps"
  ON public.onboarding_progress FOR UPDATE TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all onboarding progress"
  ON public.onboarding_progress FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coaches can create onboarding steps"
  ON public.onboarding_progress FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Coaches can update onboarding steps"
  ON public.onboarding_progress FOR UPDATE TO authenticated
  USING (true);

CREATE INDEX idx_onboarding_progress_client ON public.onboarding_progress (client_id, step_order);

CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
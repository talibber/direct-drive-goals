
CREATE TABLE public.missed_goal_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  goal_id UUID NOT NULL REFERENCES public.goals(id),
  root_cause_category TEXT NOT NULL,
  full_explanation TEXT NOT NULL,
  is_familiar_pattern BOOLEAN NOT NULL DEFAULT false,
  pattern_description TEXT,
  next_commitment TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.missed_goal_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can create own reports"
ON public.missed_goal_reports FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view own reports"
ON public.missed_goal_reports FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all reports"
ON public.missed_goal_reports FOR SELECT
TO authenticated
USING (true);

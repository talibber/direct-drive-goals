CREATE TABLE public.coach_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL,
  client_id UUID NOT NULL,
  activity_type TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own coach activity"
  ON public.coach_activity FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all activity"
  ON public.coach_activity FOR SELECT TO authenticated
  USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can create activity"
  ON public.coach_activity FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = coach_id);

CREATE INDEX idx_coach_activity_client ON public.coach_activity (client_id, created_at DESC);
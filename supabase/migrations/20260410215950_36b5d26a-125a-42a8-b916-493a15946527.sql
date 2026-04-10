CREATE TABLE public.weekly_checkins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  coaching_track text NOT NULL DEFAULT 'life',
  week_of date NOT NULL DEFAULT CURRENT_DATE,
  energy integer NOT NULL DEFAULT 5,
  stress integer NOT NULL DEFAULT 5,
  focus integer NOT NULL DEFAULT 5,
  confidence integer NOT NULL DEFAULT 5,
  sleep integer NOT NULL DEFAULT 5,
  habit_completion integer,
  wins text,
  failures text,
  avoiding text,
  story text,
  commitment text,
  revenue_actions_count integer,
  decision_made text,
  decision_avoided text,
  fear_cost text,
  business_commitment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can create own check-ins"
ON public.weekly_checkins FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view own check-ins"
ON public.weekly_checkins FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all check-ins"
ON public.weekly_checkins FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coaches can update all check-ins"
ON public.weekly_checkins FOR UPDATE
TO authenticated
USING (true);

CREATE INDEX idx_weekly_checkins_client_id ON public.weekly_checkins(client_id);

CREATE TRIGGER update_weekly_checkins_updated_at
BEFORE UPDATE ON public.weekly_checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
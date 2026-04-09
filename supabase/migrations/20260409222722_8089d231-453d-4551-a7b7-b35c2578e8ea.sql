CREATE TABLE public.perfect_month_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  month DATE NOT NULL,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  call_scheduled_at TIMESTAMP WITH TIME ZONE,
  call_completed_at TIMESTAMP WITH TIME ZONE,
  coach_notes TEXT,
  next_goals_set BOOLEAN NOT NULL DEFAULT false,
  call_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.perfect_month_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own perfect months"
ON public.perfect_month_calls FOR SELECT
USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all perfect months"
ON public.perfect_month_calls FOR SELECT
USING (true);

CREATE POLICY "Coaches can create perfect months"
ON public.perfect_month_calls FOR INSERT
WITH CHECK (true);

CREATE POLICY "Coaches can update perfect months"
ON public.perfect_month_calls FOR UPDATE
USING (true);

CREATE TRIGGER update_perfect_month_calls_updated_at
BEFORE UPDATE ON public.perfect_month_calls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
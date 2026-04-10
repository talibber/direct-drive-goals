
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  occupation TEXT,
  coaching_interest TEXT NOT NULL DEFAULT 'life',
  challenge TEXT,
  goals_30_day TEXT,
  readiness TEXT,
  prior_coaching TEXT,
  support_level TEXT,
  track TEXT NOT NULL DEFAULT 'life',
  business_name TEXT,
  industry TEXT,
  revenue_range TEXT,
  team_size TEXT,
  avoided_decision TEXT,
  decision_outcome TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (public form)
CREATE POLICY "Anyone can submit applications"
ON public.applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Authenticated users (coaches) can view all applications
CREATE POLICY "Authenticated users can view applications"
ON public.applications
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users (coaches) can update applications
CREATE POLICY "Authenticated users can update applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (true);

CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

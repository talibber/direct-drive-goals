CREATE TABLE public.assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  disc_type TEXT NOT NULL,
  disc_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  execution_planning_score INTEGER NOT NULL DEFAULT 0,
  execution_consistency_score INTEGER NOT NULL DEFAULT 0,
  execution_motivation_score INTEGER NOT NULL DEFAULT 0,
  execution_risk_score INTEGER NOT NULL DEFAULT 0,
  coach_notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own assessment results"
  ON public.assessment_results FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create own assessment results"
  ON public.assessment_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Coaches can view all assessment results"
  ON public.assessment_results FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coaches can update assessment results"
  ON public.assessment_results FOR UPDATE TO authenticated
  USING (true);

CREATE TRIGGER update_assessment_results_updated_at
  BEFORE UPDATE ON public.assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
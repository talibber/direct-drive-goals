
-- Create goal status enum
CREATE TYPE public.goal_status AS ENUM (
  'pending_approval',
  'revision_requested', 
  'active',
  'at_risk',
  'missed',
  'completed',
  'rejected'
);

-- Create goal approval action enum
CREATE TYPE public.goal_approval_action AS ENUM (
  'approved',
  'revision_requested',
  'rejected'
);

-- Create goals table
CREATE TABLE public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coach_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Life',
  metric_type TEXT NOT NULL DEFAULT 'yes/no',
  target_value NUMERIC NOT NULL DEFAULT 1,
  current_value NUMERIC NOT NULL DEFAULT 0,
  target TEXT NOT NULL,
  proof_requirement TEXT,
  due_date DATE NOT NULL,
  stake NUMERIC NOT NULL DEFAULT 75,
  status public.goal_status NOT NULL DEFAULT 'pending_approval',
  coach_approved BOOLEAN NOT NULL DEFAULT false,
  approved_at TIMESTAMPTZ,
  coach_notes TEXT,
  resubmission_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create goal approval history table
CREATE TABLE public.goal_approval_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  coach_id UUID NOT NULL,
  action public.goal_approval_action NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_approval_history ENABLE ROW LEVEL SECURITY;

-- Goals RLS policies
CREATE POLICY "Users can view their own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view all goals"
  ON public.goals FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can update goals"
  ON public.goals FOR UPDATE
  USING (true);

-- Goal approval history RLS policies
CREATE POLICY "Users can view history for their goals"
  ON public.goal_approval_history FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.goals WHERE goals.id = goal_approval_history.goal_id AND goals.user_id = auth.uid()
  ));

CREATE POLICY "Coaches can view all history"
  ON public.goal_approval_history FOR SELECT
  USING (true);

CREATE POLICY "Coaches can create history entries"
  ON public.goal_approval_history FOR INSERT
  WITH CHECK (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

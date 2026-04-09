
-- Add new statuses to goal_status enum
ALTER TYPE public.goal_status ADD VALUE IF NOT EXISTS 'proof_pending';
ALTER TYPE public.goal_status ADD VALUE IF NOT EXISTS 'proof_submitted';

-- Add proof-related columns to goals
ALTER TABLE public.goals
  ADD COLUMN IF NOT EXISTS proof_description TEXT,
  ADD COLUMN IF NOT EXISTS proof_file_url TEXT,
  ADD COLUMN IF NOT EXISTS self_completed BOOLEAN,
  ADD COLUMN IF NOT EXISTS coach_verification_note TEXT,
  ADD COLUMN IF NOT EXISTS proof_submitted_at TIMESTAMPTZ;

-- Create missed_goal_charges table
CREATE TABLE public.missed_goal_charges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 75,
  charge_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  coach_verified BOOLEAN NOT NULL DEFAULT false,
  coach_verification_note TEXT,
  pattern_call_scheduled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.missed_goal_charges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own charges"
  ON public.missed_goal_charges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view all charges"
  ON public.missed_goal_charges FOR SELECT
  USING (true);

CREATE POLICY "System can create charges"
  ON public.missed_goal_charges FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Coaches can update charges"
  ON public.missed_goal_charges FOR UPDATE
  USING (true);

-- Create storage bucket for goal proof uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('goal-proof', 'goal-proof', true);

CREATE POLICY "Users can upload proof files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'goal-proof' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Anyone can view proof files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'goal-proof');

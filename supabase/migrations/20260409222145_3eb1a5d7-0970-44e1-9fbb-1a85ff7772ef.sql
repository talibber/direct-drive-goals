-- Add waived status to enum
ALTER TYPE public.goal_status ADD VALUE IF NOT EXISTS 'waived';

-- Create goal_proof_submissions table
CREATE TABLE public.goal_proof_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  completion_description TEXT NOT NULL,
  file_urls TEXT[] DEFAULT '{}',
  self_assessment TEXT NOT NULL CHECK (self_assessment IN ('completed', 'not_completed')),
  coach_decision TEXT CHECK (coach_decision IN ('verified', 'waived', 'missed')),
  coach_note TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  decided_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.goal_proof_submissions ENABLE ROW LEVEL SECURITY;

-- Clients can view their own submissions
CREATE POLICY "Users can view own submissions"
ON public.goal_proof_submissions FOR SELECT
USING (auth.uid() = client_id);

-- Clients can create their own submissions
CREATE POLICY "Users can create own submissions"
ON public.goal_proof_submissions FOR INSERT
WITH CHECK (auth.uid() = client_id);

-- Coaches can view all submissions
CREATE POLICY "Coaches can view all submissions"
ON public.goal_proof_submissions FOR SELECT
USING (true);

-- Coaches can update submissions (for decisions)
CREATE POLICY "Coaches can update submissions"
ON public.goal_proof_submissions FOR UPDATE
USING (true);
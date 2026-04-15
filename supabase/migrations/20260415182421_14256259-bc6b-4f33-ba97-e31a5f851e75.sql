-- Achievement Group Sessions
CREATE TABLE public.achievement_group_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  month DATE NOT NULL,
  enrolled_clients UUID[] NOT NULL DEFAULT '{}'::uuid[],
  recording_url TEXT,
  coach_notes TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.achievement_group_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view achievement group sessions"
  ON public.achievement_group_sessions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coaches can create achievement group sessions"
  ON public.achievement_group_sessions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Coaches can update achievement group sessions"
  ON public.achievement_group_sessions FOR UPDATE TO authenticated
  USING (true);

-- Achievement Group Submissions
CREATE TABLE public.achievement_group_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.achievement_group_sessions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  proud_goal TEXT NOT NULL,
  what_made_difference TEXT NOT NULL,
  next_bar TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  next_commitment TEXT,
  commitment_submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.achievement_group_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own submissions"
  ON public.achievement_group_submissions FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can create own submissions"
  ON public.achievement_group_submissions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own submissions"
  ON public.achievement_group_submissions FOR UPDATE TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all submissions"
  ON public.achievement_group_submissions FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coaches can update all submissions"
  ON public.achievement_group_submissions FOR UPDATE TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_achievement_group_sessions_updated_at
  BEFORE UPDATE ON public.achievement_group_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_achievement_group_submissions_updated_at
  BEFORE UPDATE ON public.achievement_group_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
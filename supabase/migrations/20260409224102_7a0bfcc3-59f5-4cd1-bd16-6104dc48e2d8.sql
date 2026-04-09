-- Add recording fields to reset_sessions
ALTER TABLE public.reset_sessions
  ADD COLUMN recording_url TEXT,
  ADD COLUMN recording_uploaded_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN recording_sent_at TIMESTAMP WITH TIME ZONE;

-- Create engagement tracking table
CREATE TABLE public.reset_session_engagement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.reset_sessions(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  recording_watched BOOLEAN NOT NULL DEFAULT false,
  watched_at TIMESTAMP WITH TIME ZONE,
  commitment_submitted BOOLEAN NOT NULL DEFAULT false,
  commitment_text TEXT,
  commitment_submitted_at TIMESTAMP WITH TIME ZONE,
  coach_acknowledged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (session_id, client_id)
);

-- Enable RLS
ALTER TABLE public.reset_session_engagement ENABLE ROW LEVEL SECURITY;

-- Coach policies
CREATE POLICY "Coaches can view all engagement"
ON public.reset_session_engagement FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coaches can update all engagement"
ON public.reset_session_engagement FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Coaches can create engagement records"
ON public.reset_session_engagement FOR INSERT
TO authenticated
WITH CHECK (true);

-- Client policies
CREATE POLICY "Clients can view own engagement"
ON public.reset_session_engagement FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Clients can update own engagement"
ON public.reset_session_engagement FOR UPDATE
TO authenticated
USING (auth.uid() = client_id);

-- Trigger for updated_at
CREATE TRIGGER update_reset_session_engagement_updated_at
BEFORE UPDATE ON public.reset_session_engagement
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
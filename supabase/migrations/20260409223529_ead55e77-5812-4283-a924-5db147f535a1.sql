-- Create reset_sessions table
CREATE TABLE public.reset_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  month DATE NOT NULL,
  enrolled_clients UUID[] NOT NULL DEFAULT '{}',
  session_notes TEXT,
  session_recap TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reset_sessions ENABLE ROW LEVEL SECURITY;

-- Coach policies
CREATE POLICY "Coaches can view all reset sessions"
ON public.reset_sessions FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coaches can create reset sessions"
ON public.reset_sessions FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Coaches can update reset sessions"
ON public.reset_sessions FOR UPDATE
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_reset_sessions_updated_at
BEFORE UPDATE ON public.reset_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
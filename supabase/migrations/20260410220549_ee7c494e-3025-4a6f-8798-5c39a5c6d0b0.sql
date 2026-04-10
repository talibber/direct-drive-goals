
CREATE TABLE public.direct_access_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  coach_id uuid NOT NULL,
  message_type text NOT NULL DEFAULT 'text',
  question_text text,
  context_text text,
  voice_url text,
  category text NOT NULL DEFAULT 'Other',
  sent_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  response_text text,
  response_voice_url text,
  responded_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.direct_access_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can create own messages"
ON public.direct_access_messages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can view own messages"
ON public.direct_access_messages FOR SELECT TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Clients can update own messages"
ON public.direct_access_messages FOR UPDATE TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all messages"
ON public.direct_access_messages FOR SELECT TO authenticated
USING (auth.uid() = coach_id);

CREATE POLICY "Coaches can update all messages"
ON public.direct_access_messages FOR UPDATE TO authenticated
USING (auth.uid() = coach_id);

CREATE INDEX idx_direct_access_client_id ON public.direct_access_messages(client_id);
CREATE INDEX idx_direct_access_coach_id ON public.direct_access_messages(coach_id);
CREATE INDEX idx_direct_access_responded ON public.direct_access_messages(responded_at) WHERE responded_at IS NULL;

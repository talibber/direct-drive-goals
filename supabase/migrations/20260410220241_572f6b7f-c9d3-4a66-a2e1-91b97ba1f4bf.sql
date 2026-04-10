
-- Enum for question status
CREATE TYPE public.operator_question_status AS ENUM ('under_review', 'on_agenda', 'not_this_month', 'addressed');

-- Operator calls table
CREATE TABLE public.operator_calls (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_date timestamp with time zone NOT NULL,
  guest_name text,
  guest_title text,
  guest_topic text,
  recording_url text,
  recap_notes text,
  join_link text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.operator_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view operator calls"
ON public.operator_calls FOR SELECT TO authenticated USING (true);

CREATE POLICY "Coaches can create operator calls"
ON public.operator_calls FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Coaches can update operator calls"
ON public.operator_calls FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_operator_calls_updated_at
BEFORE UPDATE ON public.operator_calls
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Operator call questions table
CREATE TABLE public.operator_call_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id uuid NOT NULL REFERENCES public.operator_calls(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  question_text text NOT NULL,
  category text NOT NULL DEFAULT 'Other',
  is_urgent boolean NOT NULL DEFAULT false,
  status public.operator_question_status NOT NULL DEFAULT 'under_review',
  coach_note text,
  agenda_order integer,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.operator_call_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own questions"
ON public.operator_call_questions FOR SELECT TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Clients can submit questions"
ON public.operator_call_questions FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Coaches can view all questions"
ON public.operator_call_questions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Coaches can update questions"
ON public.operator_call_questions FOR UPDATE TO authenticated USING (true);

CREATE INDEX idx_operator_call_questions_call_id ON public.operator_call_questions(call_id);
CREATE INDEX idx_operator_call_questions_client_id ON public.operator_call_questions(client_id);

CREATE TRIGGER update_operator_call_questions_updated_at
BEFORE UPDATE ON public.operator_call_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Operator call wins table
CREATE TABLE public.operator_call_wins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_id uuid NOT NULL REFERENCES public.operator_calls(id) ON DELETE CASCADE,
  client_id uuid NOT NULL,
  win_text text NOT NULL,
  submitted_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.operator_call_wins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own wins"
ON public.operator_call_wins FOR SELECT TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Clients can submit wins"
ON public.operator_call_wins FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Coaches can view all wins"
ON public.operator_call_wins FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_operator_call_wins_call_id ON public.operator_call_wins(call_id);

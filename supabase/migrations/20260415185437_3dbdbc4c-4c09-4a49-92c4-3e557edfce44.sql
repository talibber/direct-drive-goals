
-- Q&A Questions submitted by clients
CREATE TABLE public.qa_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  question_text TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  track TEXT NOT NULL DEFAULT 'life',
  status TEXT NOT NULL DEFAULT 'pending',
  week_of DATE NOT NULL DEFAULT (date_trunc('week', now()))::date,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can create own questions" ON public.qa_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can view own questions" ON public.qa_questions FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view all questions" ON public.qa_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can update all questions" ON public.qa_questions FOR UPDATE TO authenticated USING (true);

-- Published Q&A content
CREATE TABLE public.qa_published (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anonymized_question TEXT NOT NULL,
  answer_text TEXT,
  answer_format TEXT NOT NULL DEFAULT 'text',
  answer_media_url TEXT,
  category TEXT NOT NULL DEFAULT 'Mindset',
  track_visibility TEXT NOT NULL DEFAULT 'all',
  week_of DATE NOT NULL,
  publish_date DATE NOT NULL DEFAULT CURRENT_DATE,
  source_question_ids UUID[] DEFAULT '{}'::uuid[],
  published_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.qa_published ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published QA" ON public.qa_published FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can create published QA" ON public.qa_published FOR INSERT TO authenticated WITH CHECK (auth.uid() = published_by);
CREATE POLICY "Coaches can update published QA" ON public.qa_published FOR UPDATE TO authenticated USING (auth.uid() = published_by);

-- Q&A Reactions
CREATE TABLE public.qa_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qa_id UUID NOT NULL REFERENCES public.qa_published(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  resonated BOOLEAN NOT NULL DEFAULT true,
  is_mine BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(qa_id, client_id)
);

ALTER TABLE public.qa_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can create own reactions" ON public.qa_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Clients can view own reactions" ON public.qa_reactions FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Clients can delete own reactions" ON public.qa_reactions FOR DELETE TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Clients can update own reactions" ON public.qa_reactions FOR UPDATE TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view all reactions" ON public.qa_reactions FOR SELECT TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_qa_questions_updated_at BEFORE UPDATE ON public.qa_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_qa_published_updated_at BEFORE UPDATE ON public.qa_published FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

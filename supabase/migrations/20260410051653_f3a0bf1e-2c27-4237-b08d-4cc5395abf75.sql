-- Content Library table
CREATE TABLE public.content_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Mindset',
  content_type TEXT NOT NULL DEFAULT 'article',
  body TEXT NOT NULL DEFAULT '',
  key_takeaway TEXT,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  is_core BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view content"
ON public.content_library FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coaches can create content"
ON public.content_library FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Coaches can update content"
ON public.content_library FOR UPDATE
TO authenticated
USING (auth.uid() = created_by);

CREATE TRIGGER update_content_library_updated_at
BEFORE UPDATE ON public.content_library
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Content Assignments table
CREATE TABLE public.content_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.content_library(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  assigned_by UUID NOT NULL,
  assigned_note TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  client_reflection TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own assignments"
ON public.content_assignments FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Clients can update own assignments"
ON public.content_assignments FOR UPDATE
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Coaches can view all assignments"
ON public.content_assignments FOR SELECT
TO authenticated
USING (auth.uid() = assigned_by);

CREATE POLICY "Coaches can create assignments"
ON public.content_assignments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = assigned_by);

CREATE POLICY "Coaches can update assignments"
ON public.content_assignments FOR UPDATE
TO authenticated
USING (auth.uid() = assigned_by);

CREATE TRIGGER update_content_assignments_updated_at
BEFORE UPDATE ON public.content_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_content_assignments_client ON public.content_assignments(client_id);
CREATE INDEX idx_content_assignments_content ON public.content_assignments(content_id);
CREATE INDEX idx_content_library_category ON public.content_library(category);
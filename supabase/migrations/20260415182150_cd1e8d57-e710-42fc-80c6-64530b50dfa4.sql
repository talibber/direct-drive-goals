ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS community_motivation text,
  ADD COLUMN IF NOT EXISTS accountability_style text;
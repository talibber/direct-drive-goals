
-- Create community_comments table
CREATE TABLE public.community_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  photo_url TEXT,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view non-moderated comments"
  ON public.community_comments FOR SELECT TO authenticated
  USING (is_moderated = false);

CREATE POLICY "Users can create own comments"
  ON public.community_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can delete own comments"
  ON public.community_comments FOR DELETE TO authenticated
  USING (auth.uid() = client_id);

CREATE POLICY "Coaches can moderate comments"
  ON public.community_comments FOR UPDATE TO authenticated
  USING (true);

-- Add photo_urls to community_posts
ALTER TABLE public.community_posts
  ADD COLUMN photo_urls TEXT[] DEFAULT '{}'::text[];

-- Create storage bucket for community photos
INSERT INTO storage.buckets (id, name, public) VALUES ('community-photos', 'community-photos', true);

CREATE POLICY "Anyone can view community photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-photos');

CREATE POLICY "Authenticated users can upload community photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community-photos');

-- Community posts
CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT NOT NULL DEFAULT 'post' CHECK (post_type IN ('post', 'win', 'question', 'reflection', 'system')),
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view non-moderated posts"
ON public.community_posts FOR SELECT TO authenticated
USING (is_moderated = false);

CREATE POLICY "Users can create own posts"
ON public.community_posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can delete own posts"
ON public.community_posts FOR DELETE TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Coaches can moderate posts"
ON public.community_posts FOR UPDATE TO authenticated
USING (true);

-- Community replies
CREATE TABLE public.community_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view replies"
ON public.community_replies FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can create own replies"
ON public.community_replies FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can delete own replies"
ON public.community_replies FOR DELETE TO authenticated
USING (auth.uid() = client_id);

-- Teams
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  created_by UUID NOT NULL,
  max_members INTEGER NOT NULL DEFAULT 8,
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view teams"
ON public.teams FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create teams"
ON public.teams FOR INSERT TO authenticated
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Team creators can update teams"
ON public.teams FOR UPDATE TO authenticated
USING (auth.uid() = created_by);

-- Team members
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_admin BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(team_id, client_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view team members"
ON public.team_members FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can join teams"
ON public.team_members FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can leave teams"
ON public.team_members FOR DELETE TO authenticated
USING (auth.uid() = client_id);

-- Team challenges
CREATE TABLE public.team_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  target_metric TEXT NOT NULL,
  target_value NUMERIC NOT NULL DEFAULT 100,
  due_date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.team_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view team challenges"
ON public.team_challenges FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Team members can create challenges"
ON public.team_challenges FOR INSERT TO authenticated
WITH CHECK (EXISTS (
  SELECT 1 FROM public.team_members
  WHERE team_members.team_id = team_challenges.team_id
  AND team_members.client_id = auth.uid()
));

CREATE POLICY "Team admins can update challenges"
ON public.team_challenges FOR UPDATE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.team_members
  WHERE team_members.team_id = team_challenges.team_id
  AND team_members.client_id = auth.uid()
  AND team_members.is_admin = true
));

-- Client points
CREATE TABLE public.client_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL UNIQUE,
  total_points INTEGER NOT NULL DEFAULT 0,
  monthly_points INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.client_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all points"
ON public.client_points FOR SELECT TO authenticated
USING (true);

CREATE POLICY "System can create points"
ON public.client_points FOR INSERT TO authenticated
WITH CHECK (true);

CREATE POLICY "System can update points"
ON public.client_points FOR UPDATE TO authenticated
USING (true);

-- Point transactions
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  points_earned INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
ON public.point_transactions FOR SELECT TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "System can create transactions"
ON public.point_transactions FOR INSERT TO authenticated
WITH CHECK (true);

-- Achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  badge_name TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id, badge_name)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view all achievements"
ON public.achievements FOR SELECT TO authenticated
USING (true);

CREATE POLICY "System can create achievements"
ON public.achievements FOR INSERT TO authenticated
WITH CHECK (true);

-- Community post likes tracking
CREATE TABLE public.community_post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, client_id)
);

ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view likes"
ON public.community_post_likes FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can like posts"
ON public.community_post_likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can unlike posts"
ON public.community_post_likes FOR DELETE TO authenticated
USING (auth.uid() = client_id);
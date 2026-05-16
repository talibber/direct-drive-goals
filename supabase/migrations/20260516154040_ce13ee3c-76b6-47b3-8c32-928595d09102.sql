
-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  coaching_track TEXT NOT NULL DEFAULT 'life',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name, coaching_track)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'coaching_track', 'life')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- weekly_checkins: add goal_statuses + RLS
ALTER TABLE public.weekly_checkins
  ADD COLUMN IF NOT EXISTS goal_statuses JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users insert own checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Users view own checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Coaches view all checkins" ON public.weekly_checkins;
CREATE POLICY "Users insert own checkins" ON public.weekly_checkins
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users view own checkins" ON public.weekly_checkins
  FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Coaches view all checkins" ON public.weekly_checkins
  FOR SELECT TO authenticated USING (true);

-- TEMPLATES
CREATE TABLE IF NOT EXISTS public.coach_message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL,
  title TEXT NOT NULL,
  trigger_type TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.coach_message_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Coaches view templates" ON public.coach_message_templates;
DROP POLICY IF EXISTS "Coaches insert templates" ON public.coach_message_templates;
DROP POLICY IF EXISTS "Coaches update own templates" ON public.coach_message_templates;
CREATE POLICY "Coaches view templates" ON public.coach_message_templates
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches insert templates" ON public.coach_message_templates
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = coach_id);
CREATE POLICY "Coaches update own templates" ON public.coach_message_templates
  FOR UPDATE TO authenticated USING (auth.uid() = coach_id);
DROP TRIGGER IF EXISTS coach_message_templates_updated_at ON public.coach_message_templates;
CREATE TRIGGER coach_message_templates_updated_at BEFORE UPDATE ON public.coach_message_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- =========================================================
-- PROFILES
-- =========================================================
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
CREATE POLICY "Users view own profile or staff views all"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- =========================================================
-- PERFECT_MONTH_CALLS (public role -> authenticated, staff-scoped)
-- =========================================================
DROP POLICY IF EXISTS "Coaches can create perfect months" ON public.perfect_month_calls;
DROP POLICY IF EXISTS "Coaches can update perfect months" ON public.perfect_month_calls;
DROP POLICY IF EXISTS "Coaches can view all perfect months" ON public.perfect_month_calls;
DROP POLICY IF EXISTS "Users can view own perfect months" ON public.perfect_month_calls;

CREATE POLICY "Staff manage perfect months"
  ON public.perfect_month_calls FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients view own perfect months"
  ON public.perfect_month_calls FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

-- =========================================================
-- ACTION_QUEUE_ITEMS (staff-only)
-- =========================================================
DROP POLICY IF EXISTS "Auth manages queue" ON public.action_queue_items;
DROP POLICY IF EXISTS "Auth views queue" ON public.action_queue_items;

CREATE POLICY "Staff manage action queue"
  ON public.action_queue_items FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients view own action queue items"
  ON public.action_queue_items FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

-- =========================================================
-- CLIENT_TIMELINE_EVENTS
-- =========================================================
DROP POLICY IF EXISTS "Auth views timeline" ON public.client_timeline_events;
DROP POLICY IF EXISTS "Auth writes timeline" ON public.client_timeline_events;

CREATE POLICY "Staff manage timeline events"
  ON public.client_timeline_events FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Clients view own client-facing timeline"
  ON public.client_timeline_events FOR SELECT TO authenticated
  USING (auth.uid() = client_id);

-- =========================================================
-- ACHIEVEMENTS
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can view all achievements" ON public.achievements;
DROP POLICY IF EXISTS "System can create achievements" ON public.achievements;

CREATE POLICY "Clients view own achievements"
  ON public.achievements FOR SELECT TO authenticated
  USING (auth.uid() = client_id OR public.is_staff(auth.uid()));
CREATE POLICY "Staff insert achievements"
  ON public.achievements FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- CLIENT_POINTS
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can view all points" ON public.client_points;
DROP POLICY IF EXISTS "System can create points" ON public.client_points;
DROP POLICY IF EXISTS "System can update points" ON public.client_points;

CREATE POLICY "Clients view own points"
  ON public.client_points FOR SELECT TO authenticated
  USING (auth.uid() = client_id OR public.is_staff(auth.uid()));
CREATE POLICY "Staff insert points"
  ON public.client_points FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update points"
  ON public.client_points FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- COACHING_EVENTS
-- =========================================================
DROP POLICY IF EXISTS "Coaches view all events" ON public.coaching_events;
CREATE POLICY "Staff view all coaching events"
  ON public.coaching_events FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

-- =========================================================
-- WEEKLY_CHECKINS
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all check-ins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Coaches view all checkins" ON public.weekly_checkins;
DROP POLICY IF EXISTS "Coaches can update all check-ins" ON public.weekly_checkins;
CREATE POLICY "Staff view all weekly checkins"
  ON public.weekly_checkins FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update weekly checkins"
  ON public.weekly_checkins FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- COMMITMENT_BREACHES
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all breaches" ON public.commitment_breaches;
DROP POLICY IF EXISTS "Coaches can create breaches" ON public.commitment_breaches;
DROP POLICY IF EXISTS "Coaches can update breaches" ON public.commitment_breaches;
CREATE POLICY "Staff view all breaches"
  ON public.commitment_breaches FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert breaches"
  ON public.commitment_breaches FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update breaches"
  ON public.commitment_breaches FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- MISSED_GOAL_REPORTS
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all reports" ON public.missed_goal_reports;
CREATE POLICY "Staff view all missed goal reports"
  ON public.missed_goal_reports FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));

-- =========================================================
-- RESET_SESSIONS
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all reset sessions" ON public.reset_sessions;
DROP POLICY IF EXISTS "Coaches can create reset sessions" ON public.reset_sessions;
DROP POLICY IF EXISTS "Coaches can update reset sessions" ON public.reset_sessions;
CREATE POLICY "Staff view all reset sessions"
  ON public.reset_sessions FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Enrolled clients view own reset session"
  ON public.reset_sessions FOR SELECT TO authenticated
  USING (auth.uid() = ANY (enrolled_clients));
CREATE POLICY "Staff insert reset sessions"
  ON public.reset_sessions FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update reset sessions"
  ON public.reset_sessions FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- HELP_RADAR_ITEMS
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all radar items" ON public.help_radar_items;
DROP POLICY IF EXISTS "Coaches can update all radar items" ON public.help_radar_items;
CREATE POLICY "Staff view all radar items"
  ON public.help_radar_items FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff update all radar items"
  ON public.help_radar_items FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- USER_COACHING_PROFILES
-- =========================================================
DROP POLICY IF EXISTS "Coaches view all profiles" ON public.user_coaching_profiles;
DROP POLICY IF EXISTS "Coaches upsert profiles" ON public.user_coaching_profiles;
DROP POLICY IF EXISTS "Coaches update profiles" ON public.user_coaching_profiles;
CREATE POLICY "Staff view all coaching profiles"
  ON public.user_coaching_profiles FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert coaching profiles"
  ON public.user_coaching_profiles FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update coaching profiles"
  ON public.user_coaching_profiles FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- COACH_MESSAGE_DRAFTS
-- =========================================================
DROP POLICY IF EXISTS "Coaches view all drafts" ON public.coach_message_drafts;
DROP POLICY IF EXISTS "Coaches create drafts" ON public.coach_message_drafts;
DROP POLICY IF EXISTS "Coaches update drafts" ON public.coach_message_drafts;
CREATE POLICY "Staff view all message drafts"
  ON public.coach_message_drafts FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert message drafts"
  ON public.coach_message_drafts FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update message drafts"
  ON public.coach_message_drafts FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- MESSAGE_LEARNING_OUTCOMES
-- =========================================================
DROP POLICY IF EXISTS "Coaches view all outcomes" ON public.message_learning_outcomes;
DROP POLICY IF EXISTS "Coaches insert outcomes" ON public.message_learning_outcomes;
DROP POLICY IF EXISTS "Coaches update outcomes" ON public.message_learning_outcomes;
CREATE POLICY "Staff view all learning outcomes"
  ON public.message_learning_outcomes FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert learning outcomes"
  ON public.message_learning_outcomes FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update learning outcomes"
  ON public.message_learning_outcomes FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- ONBOARDING_PROGRESS
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all onboarding progress" ON public.onboarding_progress;
DROP POLICY IF EXISTS "Coaches can create onboarding steps" ON public.onboarding_progress;
DROP POLICY IF EXISTS "Coaches can update onboarding steps" ON public.onboarding_progress;
CREATE POLICY "Staff view all onboarding"
  ON public.onboarding_progress FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert onboarding"
  ON public.onboarding_progress FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update onboarding"
  ON public.onboarding_progress FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- RESET_SESSION_ENGAGEMENT
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all engagement" ON public.reset_session_engagement;
DROP POLICY IF EXISTS "Coaches can create engagement records" ON public.reset_session_engagement;
DROP POLICY IF EXISTS "Coaches can update all engagement" ON public.reset_session_engagement;
CREATE POLICY "Staff view all engagement"
  ON public.reset_session_engagement FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert engagement"
  ON public.reset_session_engagement FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update engagement"
  ON public.reset_session_engagement FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- COACH_STYLE_LEARNING
-- =========================================================
DROP POLICY IF EXISTS "Coaches view all learning" ON public.coach_style_learning;
DROP POLICY IF EXISTS "Coaches insert learning" ON public.coach_style_learning;
CREATE POLICY "Staff view all style learning"
  ON public.coach_style_learning FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert style learning"
  ON public.coach_style_learning FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- MISSED_GOAL_CHARGES
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all charges" ON public.missed_goal_charges;
DROP POLICY IF EXISTS "Coaches can update charges" ON public.missed_goal_charges;
DROP POLICY IF EXISTS "System can create charges" ON public.missed_goal_charges;
CREATE POLICY "Staff view all charges"
  ON public.missed_goal_charges FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert charges"
  ON public.missed_goal_charges FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update charges"
  ON public.missed_goal_charges FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- CLIENT_AUTOMATION_SETTINGS
-- =========================================================
DROP POLICY IF EXISTS "Coaches view all automation" ON public.client_automation_settings;
DROP POLICY IF EXISTS "Coaches insert automation" ON public.client_automation_settings;
DROP POLICY IF EXISTS "Coaches update automation" ON public.client_automation_settings;
CREATE POLICY "Staff view all automation"
  ON public.client_automation_settings FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert automation"
  ON public.client_automation_settings FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update automation"
  ON public.client_automation_settings FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- GOAL_APPROVAL_HISTORY
-- =========================================================
DROP POLICY IF EXISTS "Coaches can view all history" ON public.goal_approval_history;
DROP POLICY IF EXISTS "Coaches can create history entries" ON public.goal_approval_history;
CREATE POLICY "Staff view all approval history"
  ON public.goal_approval_history FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff insert approval history"
  ON public.goal_approval_history FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- ACHIEVEMENT_GROUP_SESSIONS
-- =========================================================
DROP POLICY IF EXISTS "Authenticated users can view achievement group sessions" ON public.achievement_group_sessions;
DROP POLICY IF EXISTS "Coaches can create achievement group sessions" ON public.achievement_group_sessions;
DROP POLICY IF EXISTS "Coaches can update achievement group sessions" ON public.achievement_group_sessions;
CREATE POLICY "Staff view all achievement sessions"
  ON public.achievement_group_sessions FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Enrolled clients view their achievement session"
  ON public.achievement_group_sessions FOR SELECT TO authenticated
  USING (auth.uid() = ANY (enrolled_clients));
CREATE POLICY "Staff insert achievement sessions"
  ON public.achievement_group_sessions FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff update achievement sessions"
  ON public.achievement_group_sessions FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- =========================================================
-- STORAGE: goal-proof private + scoped; community-photos hardened
-- =========================================================
UPDATE storage.buckets SET public = false WHERE id = 'goal-proof';

DROP POLICY IF EXISTS "Anyone can view proof files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view community photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload proof files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload community photos" ON storage.objects;

-- goal-proof: owner or staff can read; owner-scoped writes
CREATE POLICY "Owner or staff read goal-proof"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'goal-proof'
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );
CREATE POLICY "Owner uploads goal-proof"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'goal-proof'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Owner or staff delete goal-proof"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'goal-proof'
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );

-- community-photos: public read OK (bucket is public), but writes must be owner-scoped
CREATE POLICY "Public reads community-photos"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'community-photos');
CREATE POLICY "Owner uploads community-photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'community-photos'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
CREATE POLICY "Owner or staff delete community-photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'community-photos'
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );

-- =========================================================
-- REALTIME: remove messages from the realtime publication so
-- subscribers cannot receive cross-conversation events. App can
-- re-introduce with a proper realtime.messages authorization policy.
-- =========================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'messages'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime DROP TABLE public.messages';
  END IF;
END $$;

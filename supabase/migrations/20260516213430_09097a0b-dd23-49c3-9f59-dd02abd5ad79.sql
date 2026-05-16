
DROP POLICY IF EXISTS "Coaches can view all goals" ON public.goals;
CREATE POLICY "Staff view all goals" ON public.goals
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can view all submissions" ON public.goal_proof_submissions;
CREATE POLICY "Staff view all goal proof submissions" ON public.goal_proof_submissions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can view all submissions" ON public.achievement_group_submissions;
CREATE POLICY "Staff view all achievement submissions" ON public.achievement_group_submissions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can view all wins" ON public.operator_call_wins;
CREATE POLICY "Staff view all operator call wins" ON public.operator_call_wins
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can view all questions" ON public.operator_call_questions;
CREATE POLICY "Staff view all operator call questions" ON public.operator_call_questions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can view all questions" ON public.qa_questions;
CREATE POLICY "Staff view all qa questions" ON public.qa_questions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can view all reactions" ON public.qa_reactions;
CREATE POLICY "Staff view all qa reactions" ON public.qa_reactions
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches view templates" ON public.coach_message_templates;
CREATE POLICY "Owner or staff view templates" ON public.coach_message_templates
  FOR SELECT TO authenticated USING (auth.uid() = coach_id OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Auth views phrases" ON public.style_phrase_bank;
CREATE POLICY "Owner or staff view phrases" ON public.style_phrase_bank
  FOR SELECT TO authenticated USING (auth.uid() = coach_id OR public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Auth read settings" ON public.system_settings;
CREATE POLICY "Staff read settings" ON public.system_settings
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Auth views targets" ON public.response_target_settings;
CREATE POLICY "Staff view response targets" ON public.response_target_settings
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can view replies" ON public.community_replies;
CREATE POLICY "Scoped community replies visibility" ON public.community_replies
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR public.can_view_post(auth.uid(), post_id));

DROP POLICY IF EXISTS "Authenticated users can view likes" ON public.community_post_likes;
CREATE POLICY "Scoped community likes visibility" ON public.community_post_likes
  FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()) OR public.can_view_post(auth.uid(), post_id));

DROP POLICY IF EXISTS "Clients view own client-facing timeline" ON public.client_timeline_events;
CREATE POLICY "Clients view own visible timeline" ON public.client_timeline_events
  FOR SELECT TO authenticated
  USING (auth.uid() = client_id AND client_visible = true);

CREATE POLICY "Owner or staff update goal-proof" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'goal-proof'
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  )
  WITH CHECK (
    bucket_id = 'goal-proof'
    AND ((auth.uid())::text = (storage.foldername(name))[1] OR public.is_staff(auth.uid()))
  );

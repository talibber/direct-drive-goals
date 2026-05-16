
DROP POLICY IF EXISTS "Coaches can update all submissions" ON public.achievement_group_submissions;
CREATE POLICY "Staff update submissions" ON public.achievement_group_submissions
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches create events" ON public.coaching_events;
CREATE POLICY "Staff create coaching events" ON public.coaching_events
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can moderate comments" ON public.community_comments;
CREATE POLICY "Staff moderate comments" ON public.community_comments
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can moderate posts" ON public.community_posts;
CREATE POLICY "Staff moderate posts" ON public.community_posts
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can update submissions" ON public.goal_proof_submissions;
CREATE POLICY "Staff update goal proof submissions" ON public.goal_proof_submissions
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can update goals" ON public.goals;
CREATE POLICY "Staff update goals" ON public.goals
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can update questions" ON public.operator_call_questions;
CREATE POLICY "Staff update operator call questions" ON public.operator_call_questions
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can update operator calls" ON public.operator_calls;
DROP POLICY IF EXISTS "Coaches can create operator calls" ON public.operator_calls;
CREATE POLICY "Staff update operator calls" ON public.operator_calls
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff create operator calls" ON public.operator_calls
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "System can create transactions" ON public.point_transactions;
CREATE POLICY "Staff create point transactions" ON public.point_transactions
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Coaches can update all questions" ON public.qa_questions;
CREATE POLICY "Staff update qa questions" ON public.qa_questions
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

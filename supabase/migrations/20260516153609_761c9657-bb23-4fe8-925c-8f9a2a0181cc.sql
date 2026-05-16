
-- Enable scheduling extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Tighten RLS roles from {public} to {authenticated} on goals
DROP POLICY IF EXISTS "Coaches can update goals" ON public.goals;
DROP POLICY IF EXISTS "Coaches can view all goals" ON public.goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;

CREATE POLICY "Users can view their own goals" ON public.goals
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.goals
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.goals
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Coaches can view all goals" ON public.goals
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can update goals" ON public.goals
  FOR UPDATE TO authenticated USING (true);

-- goal_approval_history
DROP POLICY IF EXISTS "Coaches can create history entries" ON public.goal_approval_history;
DROP POLICY IF EXISTS "Coaches can view all history" ON public.goal_approval_history;
DROP POLICY IF EXISTS "Users can view history for their goals" ON public.goal_approval_history;

CREATE POLICY "Coaches can create history entries" ON public.goal_approval_history
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Coaches can view all history" ON public.goal_approval_history
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view history for their goals" ON public.goal_approval_history
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.goals
            WHERE goals.id = goal_approval_history.goal_id
              AND goals.user_id = auth.uid())
  );

-- goal_proof_submissions
DROP POLICY IF EXISTS "Coaches can update submissions" ON public.goal_proof_submissions;
DROP POLICY IF EXISTS "Coaches can view all submissions" ON public.goal_proof_submissions;
DROP POLICY IF EXISTS "Users can create own submissions" ON public.goal_proof_submissions;
DROP POLICY IF EXISTS "Users can view own submissions" ON public.goal_proof_submissions;

CREATE POLICY "Users can create own submissions" ON public.goal_proof_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Users can view own submissions" ON public.goal_proof_submissions
  FOR SELECT TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "Coaches can view all submissions" ON public.goal_proof_submissions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can update submissions" ON public.goal_proof_submissions
  FOR UPDATE TO authenticated USING (true);

-- missed_goal_charges (also {public})
DROP POLICY IF EXISTS "Coaches can update charges" ON public.missed_goal_charges;
DROP POLICY IF EXISTS "Coaches can view all charges" ON public.missed_goal_charges;
DROP POLICY IF EXISTS "System can create charges" ON public.missed_goal_charges;
DROP POLICY IF EXISTS "Users can view their own charges" ON public.missed_goal_charges;

CREATE POLICY "System can create charges" ON public.missed_goal_charges
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view their own charges" ON public.missed_goal_charges
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Coaches can view all charges" ON public.missed_goal_charges
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Coaches can update charges" ON public.missed_goal_charges
  FOR UPDATE TO authenticated USING (true);

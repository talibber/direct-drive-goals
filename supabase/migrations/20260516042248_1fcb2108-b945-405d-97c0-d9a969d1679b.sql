
-- Extend applications table for new screening questionnaire
ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS goal_area text,
  ADD COLUMN IF NOT EXISTS tried_before text,
  ADD COLUMN IF NOT EXISTS avoiding text,
  ADD COLUMN IF NOT EXISTS willing_checkins text,
  ADD COLUMN IF NOT EXISTS willing_evidence text,
  ADD COLUMN IF NOT EXISTS pod_visibility_ok text,
  ADD COLUMN IF NOT EXISTS understands_not_therapy boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS in_crisis boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS breach_fee_acknowledged boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS truth_readiness text,
  ADD COLUMN IF NOT EXISTS additional_notes text,
  ADD COLUMN IF NOT EXISTS subscription_terms_agreed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS breach_terms_agreed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS not_therapy_agreed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cancellation_terms_agreed boolean DEFAULT false;

-- Commitment Breach Fee tracking (separate from outcome misses)
CREATE TABLE IF NOT EXISTS public.commitment_breaches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  goal_id uuid,
  breach_reason text NOT NULL CHECK (breach_reason IN ('missed_checkin','missing_evidence','ghosted_system','broken_commitment','admin_override')),
  amount numeric NOT NULL DEFAULT 75,
  charged boolean NOT NULL DEFAULT false,
  waived boolean NOT NULL DEFAULT false,
  waived_by uuid,
  waiver_reason text,
  reset_call_enrolled boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.commitment_breaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own breaches"
  ON public.commitment_breaches FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Coaches can view all breaches"
  ON public.commitment_breaches FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Coaches can create breaches"
  ON public.commitment_breaches FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Coaches can update breaches"
  ON public.commitment_breaches FOR UPDATE TO authenticated
  USING (true);

CREATE TRIGGER update_commitment_breaches_updated_at
  BEFORE UPDATE ON public.commitment_breaches
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 1. Safety trigger: a real (non-demo) coach_message_drafts row cannot be set to status='sent'
--    unless a coach approved it (approved_by + approved_at must both be set).
CREATE OR REPLACE FUNCTION public.tg_block_unapproved_send()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'sent' AND NEW.is_demo = false THEN
    IF NEW.approved_by IS NULL OR NEW.approved_at IS NULL THEN
      RAISE EXCEPTION 'coach_message_drafts: a real draft cannot be sent without coach approval (approved_by, approved_at required)';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_block_unapproved_send ON public.coach_message_drafts;
CREATE TRIGGER trg_block_unapproved_send
BEFORE INSERT OR UPDATE ON public.coach_message_drafts
FOR EACH ROW EXECUTE FUNCTION public.tg_block_unapproved_send();

-- 2. Confirm launch kill switches are off
INSERT INTO public.system_settings (key, value)
VALUES
  ('messaging_auto_send_enabled', 'false'::jsonb),
  ('breach_auto_charge_enabled', 'false'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

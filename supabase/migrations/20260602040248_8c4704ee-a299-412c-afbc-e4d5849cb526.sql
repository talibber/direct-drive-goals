UPDATE public.profiles
SET coach_id = 'feb02c94-774e-4a33-9c82-b174d2d25405'
WHERE client_type = 'real'
  AND is_demo = false
  AND coach_id IS NULL;
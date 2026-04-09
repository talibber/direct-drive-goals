-- Create coach_status enum
CREATE TYPE public.help_radar_status AS ENUM ('seen', 'on_deck', 'addressed');

-- Create help_radar_items table
CREATE TABLE public.help_radar_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  category TEXT NOT NULL,
  custom_description TEXT,
  context TEXT,
  coach_status public.help_radar_status NOT NULL DEFAULT 'seen',
  coach_note TEXT,
  flagged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  addressed_at TIMESTAMP WITH TIME ZONE,
  resolved_by_client BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.help_radar_items ENABLE ROW LEVEL SECURITY;

-- Client policies
CREATE POLICY "Clients can view own radar items"
ON public.help_radar_items FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Clients can create own radar items"
ON public.help_radar_items FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can update own radar items"
ON public.help_radar_items FOR UPDATE
TO authenticated
USING (auth.uid() = client_id);

-- Coach policies
CREATE POLICY "Coaches can view all radar items"
ON public.help_radar_items FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Coaches can update all radar items"
ON public.help_radar_items FOR UPDATE
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_help_radar_items_updated_at
BEFORE UPDATE ON public.help_radar_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
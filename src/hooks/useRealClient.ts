import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ClientProfile = {
  user_id: string;
  display_name: string | null;
  email: string | null;
  coaching_track: string | null;
  client_type: "real" | "demo";
  is_demo: boolean;
  pod_id: string | null;
  subscription_status: string | null;
  coach_id: string | null;
};

const ACTIVE = new Set(["active", "trial"]);

/**
 * Returns { profile, loading, isReal } for the authenticated user.
 * isReal = real, non-demo profile WITH an active/trial subscription.
 */
export function useRealClient() {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (!cancelled) { setProfile(null); setLoading(false); }
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, email, coaching_track, client_type, is_demo, pod_id, subscription_status, coach_id")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!cancelled) {
        setProfile(data as ClientProfile | null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isReal =
    !!profile &&
    profile.client_type === "real" &&
    !profile.is_demo &&
    ACTIVE.has(profile.subscription_status ?? "");

  return { profile, loading, isReal };
}

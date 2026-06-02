import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ACTIVE = new Set(["active", "trial"]);
// past_due / canceled are routed to /billing for recovery instead of /onboarding/pending.
const BILLING_RECOVERY = new Set(["past_due", "canceled"]);

type State = { loading: boolean; allowed: boolean; redirect: string };

/** Gate for /dashboard/*: requires an authenticated user whose profile is active/trial OR staff. */
export function ProtectedClientRoute({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>({ loading: true, allowed: false, redirect: "/login" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        if (!cancelled) setS({ loading: false, allowed: false, redirect: "/login" });
        return;
      }
      const [{ data: profile }, { data: staff }] = await Promise.all([
        supabase.from("profiles").select("subscription_status, client_type, is_demo").eq("user_id", session.user.id).maybeSingle(),
        supabase.from("staff_members").select("user_id").eq("user_id", session.user.id).maybeSingle(),
      ]);
      if (cancelled) return;
      if (staff) return setS({ loading: false, allowed: true, redirect: "" });
      const status = (profile as any)?.subscription_status ?? "unprovisioned";
      if (profile && ACTIVE.has(status) && !(profile as any).is_demo) {
        setS({ loading: false, allowed: true, redirect: "" });
      } else if (BILLING_RECOVERY.has(status)) {
        setS({ loading: false, allowed: false, redirect: "/billing" });
      } else {
        setS({ loading: false, allowed: false, redirect: "/onboarding/pending" });
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (s.loading) return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (!s.allowed) return <Navigate to={s.redirect} replace />;
  return <>{children}</>;
}

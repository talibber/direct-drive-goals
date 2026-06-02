import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function ProtectedCoachRoute({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"loading" | "ok" | "deny">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { if (!cancelled) setState("deny"); return; }
      const { data } = await supabase.from("staff_members").select("user_id").eq("user_id", session.user.id).maybeSingle();
      if (!cancelled) setState(data ? "ok" : "deny");
    })();
    return () => { cancelled = true; };
  }, []);

  if (state === "loading") return <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">Loading…</div>;
  if (state === "deny") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

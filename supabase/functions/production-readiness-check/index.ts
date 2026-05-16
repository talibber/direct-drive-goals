// Production readiness check — service-role audit of the backend.
// CORS-enabled; safe to call from any authenticated coach session.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const checks: { name: string; status: "pass" | "warn" | "fail"; detail: string }[] = [];
  const push = (n: string, s: "pass" | "warn" | "fail", d: string) => checks.push({ name: n, status: s, detail: d });

  const { count: tenantCount } = await sb.from("tenants").select("id", { count: "exact", head: true });
  push("Tenants seeded", (tenantCount ?? 0) >= 2 ? "pass" : "fail", `${tenantCount ?? 0} tenants`);

  const { data: settings } = await sb.from("system_settings").select("key,value");
  const get = (k: string) => settings?.find((s: any) => s.key === k)?.value;
  push("Auto-send messaging off", get("messaging_auto_send_enabled") === false ? "pass" : "warn", String(get("messaging_auto_send_enabled")));
  push("Auto-charge breaches off", get("breach_auto_charge_enabled") === false ? "pass" : "warn", String(get("breach_auto_charge_enabled")));

  // Demo isolation: no real profile flagged is_demo
  const { count: mixed } = await sb.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", true);
  push("Real-client demo isolation", (mixed ?? 0) === 0 ? "pass" : "fail", `${mixed ?? 0} real profiles mistakenly flagged demo`);

  // Tenant linkage
  const { count: orphanProfiles } = await sb.from("profiles").select("user_id", { count: "exact", head: true }).is("tenant_id", null);
  push("All profiles have tenant", (orphanProfiles ?? 0) === 0 ? "pass" : "fail", `${orphanProfiles ?? 0} unscoped profiles`);

  const { count: orphanGoals } = await sb.from("goals").select("id", { count: "exact", head: true }).is("tenant_id", null);
  push("All goals scoped to tenant", (orphanGoals ?? 0) === 0 ? "pass" : "warn", `${orphanGoals ?? 0} unscoped goals`);

  push("Payments live", get("payments_live_enabled") ? "pass" : "warn", "Stripe/Paddle not yet enabled — expected during beta");

  const passes = checks.filter((c) => c.status === "pass").length;
  const score = Math.round((passes / checks.length) * 100);

  return new Response(JSON.stringify({ score, checks }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

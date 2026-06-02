// Production readiness check — service-role audit of the backend.
// CORS-enabled; safe to call from any authenticated coach session.
// Returns { score, checks: [{ name, status, detail, category }] } where category is one of:
//   "config" | "isolation" | "payments" | "rls" | "data".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Status = "pass" | "warn" | "fail";
type Category = "config" | "isolation" | "payments" | "rls" | "data";
interface Check { name: string; status: Status; detail: string; category: Category }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const checks: Check[] = [];
  const push = (name: string, status: Status, detail: string, category: Category = "config") =>
    checks.push({ name, status, detail, category });

  // -------- config --------
  const { count: tenantCount } = await sb.from("tenants").select("id", { count: "exact", head: true });
  push("Tenants seeded", (tenantCount ?? 0) >= 2 ? "pass" : "fail", `${tenantCount ?? 0} tenants`, "config");

  const { data: settings } = await sb.from("system_settings").select("key,value");
  const get = (k: string) => settings?.find((s: any) => s.key === k)?.value;
  push("Auto-send messaging off", get("messaging_auto_send_enabled") === false ? "pass" : "warn", String(get("messaging_auto_send_enabled")), "config");
  push("Auto-charge breaches off", get("breach_auto_charge_enabled") === false ? "pass" : "warn", String(get("breach_auto_charge_enabled")), "config");

  // -------- payments --------
  push("Stripe payments configured", get("payments_live_enabled") ? "pass" : "warn", "Stripe not yet enabled — expected during beta", "payments");
  push("STRIPE_SECRET_KEY present", Deno.env.get("STRIPE_SECRET_KEY") ? "pass" : "warn", Deno.env.get("STRIPE_SECRET_KEY") ? "set" : "missing", "payments");
  push("STRIPE_WEBHOOK_SECRET present", Deno.env.get("STRIPE_WEBHOOK_SECRET") ? "pass" : "warn", Deno.env.get("STRIPE_WEBHOOK_SECRET") ? "set" : "missing", "payments");
  push("APP_URL / SITE_URL present", (Deno.env.get("APP_URL") || Deno.env.get("SITE_URL")) ? "pass" : "warn", "Used for Stripe return URLs", "payments");

  // -------- isolation / data hygiene --------
  const { count: mixed } = await sb.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", true);
  push("No real profile mistakenly flagged demo", (mixed ?? 0) === 0 ? "pass" : "fail", `${mixed ?? 0} mixed`, "isolation");

  const { count: orphanProfiles } = await sb.from("profiles").select("user_id", { count: "exact", head: true }).is("tenant_id", null);
  push("All profiles have tenant", (orphanProfiles ?? 0) === 0 ? "pass" : "fail", `${orphanProfiles ?? 0} unscoped`, "isolation");

  const { count: orphanGoals } = await sb.from("goals").select("id", { count: "exact", head: true }).is("tenant_id", null);
  push("All goals scoped to tenant", (orphanGoals ?? 0) === 0 ? "pass" : "warn", `${orphanGoals ?? 0} unscoped`, "isolation");

  // Real clients (excluding staff) should all have a coach assigned.
  const { data: staffIds } = await sb.from("staff_members").select("user_id");
  const staffSet = (staffIds ?? []).map((r: any) => r.user_id);
  const orphanQuery = sb
    .from("profiles")
    .select("user_id", { count: "exact", head: true })
    .eq("client_type", "real")
    .eq("is_demo", false)
    .is("coach_id", null);
  const { count: realNoCoach } = staffSet.length
    ? await orphanQuery.not("user_id", "in", `(${staffSet.join(",")})`)
    : await orphanQuery;
  push("Real clients have a coach assigned", (realNoCoach ?? 0) === 0 ? "pass" : "fail", `${realNoCoach ?? 0} real clients without coach_id`, "isolation");

  // Real goals should inherit coach_id.
  const { count: realGoalNoCoach } = await sb
    .from("goals")
    .select("id", { count: "exact", head: true })
    .eq("is_demo", false)
    .is("coach_id", null);
  push("Real goals carry coach_id", (realGoalNoCoach ?? 0) === 0 ? "pass" : "warn", `${realGoalNoCoach ?? 0} real goals missing coach_id`, "isolation");

  // Real drafts must not be marked sent without approval (defense in depth, trigger should block).
  const { count: badDrafts } = await sb
    .from("coach_message_drafts")
    .select("id", { count: "exact", head: true })
    .eq("status", "sent")
    .eq("is_demo", false)
    .is("approved_by", null);
  push("No sent real drafts without approval", (badDrafts ?? 0) === 0 ? "pass" : "fail", `${badDrafts ?? 0} unapproved sent`, "rls");

  // Subscription status integrity — no unexpected values.
  const { data: badStatus } = await sb
    .from("profiles")
    .select("user_id, subscription_status")
    .not("subscription_status", "in", "(unprovisioned,pending_payment,active,trial,past_due,canceled)")
    .limit(5);
  push("Subscription statuses valid", (badStatus?.length ?? 0) === 0 ? "pass" : "fail", `${badStatus?.length ?? 0} invalid statuses`, "rls");

  // Active users (excluding staff) must have a coach assigned.
  const activeQuery = sb
    .from("profiles")
    .select("user_id", { count: "exact", head: true })
    .in("subscription_status", ["active", "trial"])
    .eq("client_type", "real")
    .is("coach_id", null);
  const { count: activeNoCoach } = staffSet.length
    ? await activeQuery.not("user_id", "in", `(${staffSet.join(",")})`)
    : await activeQuery;
  push("Active real users have a coach", (activeNoCoach ?? 0) === 0 ? "pass" : "fail", `${activeNoCoach ?? 0} active users without coach`, "isolation");

  // Data sanity — counts only, no PII.
  const { count: realProfiles } = await sb.from("profiles").select("user_id", { count: "exact", head: true }).eq("is_demo", false);
  const { count: demoProfiles } = await sb.from("profiles").select("user_id", { count: "exact", head: true }).eq("is_demo", true);
  push("Profile split", "pass", `${realProfiles ?? 0} real / ${demoProfiles ?? 0} demo`, "data");

  // Score.
  const weight = (s: Status) => (s === "pass" ? 1 : s === "warn" ? 0.5 : 0);
  const total = checks.reduce((s, c) => s + weight(c.status), 0);
  const score = Math.round((total / checks.length) * 100);

  return new Response(JSON.stringify({ score, checks }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

// Picks drafts that are safe to auto-send under each client's automation tier
// and marks them sent. Runs every minute via pg_cron.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Auto-send rules per tier. Higher tier inherits everything below.
const TIER_ALLOWED: Record<number, Set<string>> = {
  0: new Set(),
  1: new Set(),
  2: new Set(["proof_request", "win_reinforcement", "checkin_missed", "weekly_goals_submitted"]),
  3: new Set(["proof_request", "win_reinforcement", "checkin_missed", "weekly_goals_submitted", "goal_marked_on_track", "help_radar_triggered"]),
  4: new Set(["proof_request", "win_reinforcement", "checkin_missed", "weekly_goals_submitted", "goal_marked_on_track", "help_radar_triggered", "goal_marked_at_risk"]),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const { data: drafts } = await supabase
    .from("coach_message_drafts")
    .select("id,user_id,trigger_type,confidence_score,risk_level,automation_eligible,ai_draft,status,created_at")
    .eq("status", "pending")
    .eq("automation_eligible", true)
    .neq("risk_level", "high")
    .gte("confidence_score", 0.75)
    .limit(50);

  const sent: string[] = [];
  const skipped: { id: string; reason: string }[] = [];

  for (const d of drafts || []) {
    const { data: settings } = await supabase
      .from("client_automation_settings").select("*").eq("client_id", d.user_id).maybeSingle();

    // First 14 days: never auto-send (human-in-the-loop)
    const onboarded = settings?.onboarded_at ? new Date(settings.onboarded_at).getTime() : Date.now();
    const daysSince = (Date.now() - onboarded) / 86400_000;
    if (daysSince < 14) { skipped.push({ id: d.id, reason: "hitl_14d" }); continue; }

    const level = settings?.automation_level ?? 1;
    const overrides = (settings?.per_trigger_overrides ?? {}) as Record<string, boolean>;
    const allowed = TIER_ALLOWED[level] ?? TIER_ALLOWED[1];
    const explicit = overrides[d.trigger_type];
    const ok = explicit === true || (explicit !== false && allowed.has(d.trigger_type));
    if (!ok) { skipped.push({ id: d.id, reason: "tier_disallow" }); continue; }

    const { error } = await supabase
      .from("coach_message_drafts")
      .update({
        status: "sent", final_message: d.ai_draft,
        sent_at: new Date().toISOString(),
        approved_at: new Date().toISOString(),
      })
      .eq("id", d.id).eq("status", "pending");
    if (!error) sent.push(d.id);
  }

  return new Response(JSON.stringify({ sent: sent.length, skipped: skipped.length, sent_ids: sent }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

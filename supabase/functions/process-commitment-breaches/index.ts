// Scans for overdue/missed goals and creates commitment_breaches records (idempotent).
// Also exposes a "report" mode that creates a single breach for a given goal_id.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

interface ReportBody {
  goal_id?: string;
  user_id?: string;
  breach_reason?: "missed_checkin" | "missing_evidence" | "ghosted_system" | "broken_commitment";
  notes?: string;
  reset_call_enrolled?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    // Single-goal report mode
    if (req.method === "POST") {
      const body = (await req.json().catch(() => ({}))) as ReportBody;
      if (body.goal_id && body.user_id) {
        // Dedupe: skip if a breach already exists for this goal
        const { data: existing } = await supabase
          .from("commitment_breaches")
          .select("id")
          .eq("goal_id", body.goal_id)
          .maybeSingle();
        if (existing) {
          return new Response(JSON.stringify({ created: 0, skipped: 1, id: existing.id }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        const { data, error } = await supabase
          .from("commitment_breaches")
          .insert({
            user_id: body.user_id,
            goal_id: body.goal_id,
            breach_reason: body.breach_reason ?? "broken_commitment",
            notes: body.notes ?? null,
            reset_call_enrolled: body.reset_call_enrolled ?? true,
            amount: 75,
          })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ created: 1, breach: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Sweep mode: find overdue active goals without a breach yet
    const today = new Date().toISOString().slice(0, 10);
    const { data: overdueGoals, error: goalsErr } = await supabase
      .from("goals")
      .select("id, user_id, due_date, status, self_completed, coach_approved")
      .lt("due_date", today)
      .in("status", ["pending_approval", "active"]);
    if (goalsErr) throw goalsErr;

    let created = 0;
    let skipped = 0;
    for (const g of overdueGoals ?? []) {
      const { data: existing } = await supabase
        .from("commitment_breaches")
        .select("id")
        .eq("goal_id", g.id)
        .maybeSingle();
      if (existing) {
        skipped++;
        continue;
      }
      const reason = g.self_completed === false ? "broken_commitment" : "missing_evidence";
      const { error: insErr } = await supabase.from("commitment_breaches").insert({
        user_id: g.user_id,
        goal_id: g.id,
        breach_reason: reason,
        reset_call_enrolled: true,
        amount: 75,
      });
      if (!insErr) created++;
    }

    // Missed weekly check-in sweep: users with active goals who haven't
    // submitted a weekly check-in in the last 8 days get a missed_checkin breach
    // (one per user per week, deduped).
    const eightDaysAgo = new Date(Date.now() - 8 * 86400_000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400_000).toISOString();
    const { data: activeUsers } = await supabase
      .from("goals")
      .select("user_id")
      .in("status", ["pending_approval", "active"]);
    const uniqueUsers = Array.from(new Set((activeUsers ?? []).map(u => u.user_id)));
    let missedCheckinCreated = 0;
    for (const user_id of uniqueUsers) {
      const { data: recentCheckin } = await supabase
        .from("coaching_events")
        .select("id")
        .eq("user_id", user_id)
        .eq("event_type", "weekly_goals_submitted")
        .gte("created_at", eightDaysAgo)
        .limit(1)
        .maybeSingle();
      if (recentCheckin) continue;
      const { data: recentBreach } = await supabase
        .from("commitment_breaches")
        .select("id")
        .eq("user_id", user_id)
        .eq("breach_reason", "missed_checkin")
        .gte("created_at", sevenDaysAgo)
        .limit(1)
        .maybeSingle();
      if (recentBreach) continue;
      const { error: insErr } = await supabase.from("commitment_breaches").insert({
        user_id,
        breach_reason: "missed_checkin",
        reset_call_enrolled: true,
        amount: 75,
      });
      if (!insErr) missedCheckinCreated++;
    }

    return new Response(JSON.stringify({ scanned: overdueGoals?.length ?? 0, created, skipped, missedCheckinCreated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Maps a client action to internal queue defaults. Risk and priority can be overridden by the caller.
const EVENT_RULES: Record<string, { source_type: string; risk: string; priority: number; needs_response: boolean; suggested_action: string }> = {
  weekly_goals_submitted:      { source_type: "checkin",       risk: "low",    priority: 3, needs_response: true,  suggested_action: "Review check-in and reply" },
  checkin_missed:              { source_type: "checkin",       risk: "medium", priority: 2, needs_response: true,  suggested_action: "Follow up on missed check-in" },
  goal_marked_at_risk:         { source_type: "goal",          risk: "medium", priority: 2, needs_response: true,  suggested_action: "Send at-risk intervention" },
  goal_marked_missed:          { source_type: "goal",          risk: "high",   priority: 1, needs_response: true,  suggested_action: "Send missed goal response + review stake" },
  goal_marked_needs_help:      { source_type: "goal",          risk: "medium", priority: 2, needs_response: true,  suggested_action: "Offer concrete next step" },
  help_radar_triggered:        { source_type: "help_radar",    risk: "medium", priority: 2, needs_response: true,  suggested_action: "Respond to Help Radar" },
  direct_access_submitted:     { source_type: "direct_access", risk: "medium", priority: 1, needs_response: true,  suggested_action: "Respond to Direct Access message" },
  proof_submitted:             { source_type: "proof",         risk: "low",    priority: 3, needs_response: false, suggested_action: "Review proof" },
  proof_rejected:              { source_type: "proof",         risk: "medium", priority: 2, needs_response: true,  suggested_action: "Send revision request" },
  commitment_stake_triggered:  { source_type: "stake",         risk: "high",   priority: 1, needs_response: true,  suggested_action: "Review commitment stake" },
  application_submitted:       { source_type: "application",   risk: "low",    priority: 3, needs_response: false, suggested_action: "Review application" },
  client_inactive:             { source_type: "onboarding",    risk: "medium", priority: 2, needs_response: true,  suggested_action: "Re-engage inactive client" },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { client_id, event_type, source_id = null, goal_id = null, payload = {}, risk_override = null, priority_override = null, context_preview = "" } = await req.json();
    if (!client_id || !event_type) {
      return new Response(JSON.stringify({ error: "client_id and event_type required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const rule = EVENT_RULES[event_type] || { source_type: "other", risk: "low", priority: 3, needs_response: false, suggested_action: "Review" };
    const risk = risk_override || rule.risk;
    const priority = priority_override ?? rule.priority;

    // Internal target lookup
    const { data: target } = await supabase
      .from("response_target_settings")
      .select("internal_target_minutes")
      .or(`message_type.eq.${event_type},message_type.eq.all`)
      .order("priority", { ascending: true })
      .limit(1).maybeSingle();
    const targetMin = target?.internal_target_minutes ?? 10;
    const internal_due_at = new Date(Date.now() + targetMin * 60_000).toISOString();

    // 1. coaching_events
    const { data: ev } = await supabase.from("coaching_events").insert({
      user_id: client_id, goal_id, event_type, event_payload: payload,
      risk_level: risk, priority, internal_due_at, status: "open",
      suggested_action: rule.suggested_action,
    }).select("id").single();

    // 2. timeline entry
    await supabase.from("client_timeline_events").insert({
      client_id, kind: event_type, source_type: rule.source_type, source_id: source_id || ev?.id,
      internal_note: context_preview || rule.suggested_action, occurred_at: new Date().toISOString(),
    });

    // 3. action_queue_items
    let draft_id: string | null = null;
    if (rule.needs_response) {
      try {
        const resp = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-coach-draft`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` },
          body: JSON.stringify({ user_id: client_id, goal_id, event_type, event_payload: payload }),
        });
        if (resp.ok) { const j = await resp.json(); draft_id = j.draft_id || null; }
      } catch { /* non-fatal */ }
    }

    const { data: queueRow } = await supabase.from("action_queue_items").insert({
      client_id, source_type: rule.source_type, source_id: source_id || ev?.id,
      trigger: event_type, risk_level: risk, priority,
      internal_due_at, status: "open",
      suggested_response_draft_id: draft_id,
      suggested_action: rule.suggested_action,
      context_summary: { preview: context_preview, ...payload },
    }).select("id").single();

    return new Response(JSON.stringify({ event_id: ev?.id, queue_id: queueRow?.id, draft_id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

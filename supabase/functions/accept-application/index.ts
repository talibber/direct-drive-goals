import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Accepts an application and creates a real-client lane:
 *   - Marks application status=approved
 *   - Updates profile (or creates if missing) with client_type='real', is_demo=false
 *   - Seeds client_automation_settings with human_in_loop=true for 14 days
 *
 * Body: { application_id: string, user_id: string, track?: 'life'|'business', tier?: string }
 *
 * Caller must be staff (we validate via the JWT).
 */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    // staff check
    const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!user) return new Response(JSON.stringify({ error: "unauthenticated" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: staffRow } = await supabase.from("staff_members").select("user_id").eq("user_id", user.id).maybeSingle();
    if (!staffRow) return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { application_id, user_id, track = "life", tier } = await req.json();
    if (!application_id || !user_id) {
      return new Response(JSON.stringify({ error: "application_id and user_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("applications").update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewer_notes: `Approved by staff ${user.id}`,
    }).eq("id", application_id);

    await supabase.from("profiles").update({
      client_type: "real",
      is_demo: false,
      environment: "production",
      coaching_track: track,
      subscription_tier: tier ?? track,
      subscription_status: "pending_payment",
    }).eq("user_id", user_id);

    const now = new Date();
    const end = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    await supabase.from("client_automation_settings").upsert({
      client_id: user_id,
      automation_level: 1,
      send_status: "first_14_days",
      human_in_loop: true,
      human_in_loop_start_date: now.toISOString(),
      human_in_loop_end_date: end.toISOString(),
    }, { onConflict: "client_id" });

    await supabase.from("audit_log").insert({
      actor_id: user.id,
      entity_type: "application",
      entity_id: application_id,
      action: "accept_application",
      after_value: { user_id, track, tier, hitl_end: end.toISOString() },
    });

    return new Response(JSON.stringify({ ok: true, user_id, hitl_end: end.toISOString() }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { user_id } = await req.json();
    if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const sinceIso = new Date(Date.now() - 14 * 86400_000).toISOString();
    const { data: recent } = await supabase
      .from("coaching_events")
      .select("event_type,created_at")
      .eq("user_id", user_id)
      .gte("created_at", sinceIso)
      .order("created_at", { ascending: false });

    const { data: profile } = await supabase
      .from("user_coaching_profiles")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    const triggers: string[] = [];
    const ev = recent || [];
    if (ev.some(e => e.event_type === "goal_marked_at_risk")) triggers.push("goal_at_risk");
    if (ev.some(e => e.event_type === "goal_marked_missed")) triggers.push("goal_missed");
    if ((profile?.missed_goal_count ?? 0) >= 2) triggers.push("repeated_missed_goals");
    const lastEng = profile?.last_engagement_at ? new Date(profile.last_engagement_at).getTime() : 0;
    if (Date.now() - lastEng > 3 * 86400_000) triggers.push("engagement_drop");
    if (ev.filter(e => e.event_type === "goal_marked_missed").length >= 2) triggers.push("multiple_misses_this_week");

    if (triggers.length === 0) {
      return new Response(JSON.stringify({ triggered: false }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Persist radar items (dedupe per category, last 24h)
    const since24 = new Date(Date.now() - 86400_000).toISOString();
    for (const t of triggers) {
      const { data: existing } = await supabase
        .from("help_radar_items").select("id")
        .eq("client_id", user_id).eq("category", t).gte("created_at", since24).maybeSingle();
      if (!existing) {
        await supabase.from("help_radar_items").insert({
          client_id: user_id, category: t, context: `auto: ${t}`, coach_status: "seen",
        });
      }
    }

    // Forward to draft generator
    const draftRes = await fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/generate-coach-draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": req.headers.get("Authorization") || "" },
      body: JSON.stringify({
        user_id,
        event_type: "help_radar_triggered",
        event_payload: { triggers },
      }),
    });
    const draftJson = await draftRes.json();

    return new Response(JSON.stringify({ triggered: true, triggers, draft: draftJson }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});

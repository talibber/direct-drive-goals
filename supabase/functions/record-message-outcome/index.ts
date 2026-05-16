import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { draft_id, user_replied, user_reply_text, next_action_completed, goal_status_after_message } = await req.json();
    if (!draft_id) return new Response(JSON.stringify({ error: "draft_id required" }), { status: 400, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: draft } = await supabase
      .from("coach_message_drafts").select("user_id").eq("id", draft_id).single();
    if (!draft) return new Response(JSON.stringify({ error: "draft not found" }), { status: 404, headers: corsHeaders });

    const engagement_score =
      (user_replied ? 0.5 : 0) + (next_action_completed ? 0.5 : 0);

    await supabase.from("message_learning_outcomes").insert({
      draft_id,
      user_id: draft.user_id,
      user_replied: !!user_replied,
      user_reply_text: user_reply_text || null,
      next_action_completed: !!next_action_completed,
      goal_status_after_message: goal_status_after_message || null,
      engagement_score,
    });

    // Roll up into profile
    const { data: profile } = await supabase
      .from("user_coaching_profiles").select("*").eq("user_id", draft.user_id).maybeSingle();
    const { count: totalOutcomes } = await supabase
      .from("message_learning_outcomes").select("*", { count: "exact", head: true }).eq("user_id", draft.user_id);
    const { count: replies } = await supabase
      .from("message_learning_outcomes").select("*", { count: "exact", head: true }).eq("user_id", draft.user_id).eq("user_replied", true);
    const { count: completions } = await supabase
      .from("message_learning_outcomes").select("*", { count: "exact", head: true }).eq("user_id", draft.user_id).eq("next_action_completed", true);

    const replyRate = totalOutcomes ? (replies || 0) / totalOutcomes : 0;
    const completionRate = totalOutcomes ? (completions || 0) / totalOutcomes : 0;

    if (profile) {
      await supabase.from("user_coaching_profiles").update({
        reply_rate: replyRate,
        completion_rate: completionRate,
        last_engagement_at: user_replied ? new Date().toISOString() : profile.last_engagement_at,
      }).eq("user_id", draft.user_id);
    } else {
      await supabase.from("user_coaching_profiles").insert({
        user_id: draft.user_id,
        reply_rate: replyRate,
        completion_rate: completionRate,
        last_engagement_at: user_replied ? new Date().toISOString() : null,
      });
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});

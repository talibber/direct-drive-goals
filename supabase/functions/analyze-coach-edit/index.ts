import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM = `You analyze a coaching message edit. You compare an AI draft to the coach's final approved version and extract style learning. Return strict JSON:
{
  "phrases_added": string[],
  "phrases_removed": string[],
  "tone_shift": "softer|harder|more_direct|more_supportive|same",
  "pressure_level": 0-1,
  "encouragement_level": 0-1,
  "directness_level": 0-1,
  "humor_level": 0-1
}
Be concise. Max 5 phrases per array.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { draft_id, coach_id } = await req.json();
    if (!draft_id) return new Response(JSON.stringify({ error: "draft_id required" }), { status: 400, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: draft } = await supabase
      .from("coach_message_drafts")
      .select("ai_draft,final_message,trigger_type,user_id")
      .eq("id", draft_id)
      .single();
    if (!draft || !draft.final_message) {
      return new Response(JSON.stringify({ error: "draft not finalized" }), { status: 400, headers: corsHeaders });
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Lovable-API-Key": Deno.env.get("LOVABLE_API_KEY")!, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `AI DRAFT:\n${draft.ai_draft}\n\nCOACH FINAL:\n${draft.final_message}` },
        ],
        response_format: { type: "json_object" },
      }),
    });
    const aiJson = await aiRes.json();
    let parsed: any = {};
    try { parsed = JSON.parse(aiJson.choices?.[0]?.message?.content || "{}"); } catch { parsed = {}; }

    const rows = [];
    const added = (parsed.phrases_added || []) as string[];
    const removed = (parsed.phrases_removed || []) as string[];
    const len = Math.max(added.length, removed.length, 1);
    for (let i = 0; i < len; i++) {
      rows.push({
        coach_id: coach_id || draft.user_id, // fallback for single-coach mode
        draft_id,
        phrase_added: added[i] || null,
        phrase_removed: removed[i] || null,
        tone_shift: parsed.tone_shift || null,
        pressure_level: parsed.pressure_level ?? null,
        encouragement_level: parsed.encouragement_level ?? null,
        directness_level: parsed.directness_level ?? null,
        humor_level: parsed.humor_level ?? null,
        example_context: { trigger: draft.trigger_type },
      });
    }
    if (rows.length) await supabase.from("coach_style_learning").insert(rows);

    return new Response(JSON.stringify({ ok: true, recorded: rows.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: corsHeaders });
  }
});

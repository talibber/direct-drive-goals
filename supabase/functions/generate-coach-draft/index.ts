import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TONE_GUIDE: Record<string, string> = {
  goal_marked_at_risk:
    "Acknowledge the warning early. No shame. Ask what the blocker is (time, discipline, fear, unclear plan, external). Push toward an immediate next action today.",
  goal_marked_missed:
    "Direct. No motivational fluff. Ask for the real reason (unrealistic, avoided, life). Demand a reset and one adjustment for next week.",
  weekly_goals_submitted:
    "Acknowledge submitted goals. Identify likely risk. Name the one priority. Give one tactical recommendation. Ask one direct question: which goal are they most likely to avoid?",
  goal_marked_needs_help:
    "Take it seriously. Ask exactly what kind of support is needed. Offer one concrete next step.",
  help_radar_triggered:
    "Identify the signal you're seeing (engagement drop, repeat misses, silence). Ask whether the plan is unclear or they're negotiating with themselves. No robotic language.",
  checkin_missed:
    "Notice it. No lecture. Ask what happened. Reframe missed check-ins as data, not failure.",
  breach_fee_candidate:
    "Confirm a $75 breach fee is on the table. Give them the honest path to avoid it: a real update or a real reset.",
};

const SYSTEM_PROMPT = `You are drafting a coaching message in the voice of Terrible Coaching. The brand is anti-fluff, direct, high-accountability, but never cruel. Founder-led tone. No emojis. No therapy language. No diagnoses. Short paragraphs. Use second person.

Voice rules:
- Honest before kind, but kind.
- Name the avoidance.
- Always end with a specific ask or next action.
- Maximum 4 short paragraphs.
- Never auto-confirm a $75 charge; only flag the possibility.
- If the user message indicates self-harm, crisis, abuse, or emergency risk, refuse to coach and recommend professional help.

You will receive: trigger type, goal context, user profile, and recent coach-edited examples.

Return JSON only, no prose around it:
{ "draft": "<message>", "suggested_tone": "direct|supportive|tough_love|inquisitive", "confidence_score": 0.0-1.0, "requires_human_approval": true, "crisis_flag": boolean }
Confidence should be lower when context is thin.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { user_id, goal_id, event_type, event_payload = {} } = await req.json();
    if (!user_id || !event_type) {
      return new Response(JSON.stringify({ error: "user_id and event_type required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Load context
    const [{ data: profile }, { data: goal }, { data: recentLearning }, { data: recentApproved }] =
      await Promise.all([
        supabase.from("user_coaching_profiles").select("*").eq("user_id", user_id).maybeSingle(),
        goal_id
          ? supabase.from("goals").select("title,description,status,due_date,category").eq("id", goal_id).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase
          .from("coach_style_learning")
          .select("phrase_added,phrase_removed,tone_shift")
          .order("created_at", { ascending: false })
          .limit(15),
        supabase
          .from("coach_message_drafts")
          .select("trigger_type,final_message")
          .in("status", ["sent", "approved", "edited"])
          .not("final_message", "is", null)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    // Record the event
    const { data: eventRow } = await supabase
      .from("coaching_events")
      .insert({ user_id, goal_id, event_type, event_payload })
      .select("id")
      .single();

    const toneGuide = TONE_GUIDE[event_type] || "Be direct, honest, action-oriented.";

    const userMsg = `Trigger: ${event_type}
Tone guidance: ${toneGuide}
Goal context: ${goal ? JSON.stringify(goal) : "n/a"}
User profile: ${profile ? JSON.stringify({
      preferred_tone: profile.preferred_tone,
      blockers: profile.common_blockers,
      reply_rate: profile.reply_rate,
      missed: profile.missed_goal_count,
      at_risk: profile.at_risk_count,
    }) : "first interaction, no profile yet"}
Event payload: ${JSON.stringify(event_payload)}
Recent coach phrase preferences (added): ${(recentLearning || []).map(l => l.phrase_added).filter(Boolean).slice(0,8).join(" | ") || "none"}
Recent coach phrase removals: ${(recentLearning || []).map(l => l.phrase_removed).filter(Boolean).slice(0,8).join(" | ") || "none"}
Last approved messages by trigger:
${(recentApproved || []).map(m => `[${m.trigger_type}] ${m.final_message?.slice(0,300)}`).join("\n")}`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Lovable-API-Key": Deno.env.get("LOVABLE_API_KEY")!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMsg },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: "AI gateway error", status: aiRes.status, detail: txt }), {
        status: aiRes.status === 429 || aiRes.status === 402 ? aiRes.status : 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const aiJson = await aiRes.json();
    const content = aiJson.choices?.[0]?.message?.content || "{}";
    let parsed: any = {};
    try { parsed = JSON.parse(content); } catch { parsed = { draft: content, confidence_score: 0.3 }; }

    const crisis = !!parsed.crisis_flag;
    const lowConfidence = (parsed.confidence_score ?? 0) < 0.5;

    const { data: draft, error: draftErr } = await supabase
      .from("coach_message_drafts")
      .insert({
        user_id,
        goal_id,
        event_id: eventRow?.id,
        trigger_type: event_type,
        ai_draft: parsed.draft || "",
        status: crisis || lowConfidence ? "needs_human_review" : "pending",
        confidence_score: parsed.confidence_score ?? 0.5,
        suggested_tone: parsed.suggested_tone || null,
      })
      .select("id")
      .single();

    if (draftErr) throw draftErr;

    return new Response(
      JSON.stringify({ draft_id: draft.id, event_id: eventRow?.id, status: crisis || lowConfidence ? "needs_human_review" : "pending" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

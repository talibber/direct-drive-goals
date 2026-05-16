#!/usr/bin/env -S deno run -A
// Terrible Coaching — Reliability Audit
// Verifies schema, language scrub, and edge functions. Outputs 0–100 score.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";

const url = Deno.env.get("SUPABASE_URL") || "https://ihymrkyzigoqpydsnges.supabase.co";
const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(url, key);

const FORBIDDEN = /\b(AI|bot|automated|generated|model|LLM|machine learning|algorithm|assistant|auto-?response|system-generated|tone match|confidence score)\b/i;
const CLIENT_DIRS = ["src/pages", "src/components/home"];
const CLIENT_FILES_EXTRA = [
  "src/components/GoalCard.tsx","src/components/OnboardingChecklist.tsx",
  "src/components/CoachActivityStrip.tsx","src/components/MissedGoalReportModal.tsx",
  "src/components/YourNextMove.tsx","src/components/BreachFeeBadge.tsx",
];

type Check = { name: string; weight: number; pass: boolean; detail?: string };
const checks: Check[] = [];

async function fileLines(p: string) { try { return (await Deno.readTextFile(p)).split("\n"); } catch { return []; } }

async function scanLanguage() {
  const hits: string[] = [];
  const skip = /^\s*(import|\/\/|\*)/;
  const looksClient = (p: string) =>
    !p.includes("/Coach") && !p.includes("CoachLayout") && !p.includes("CoachReview");
  for (const dir of CLIENT_DIRS) {
    for await (const e of walk(dir, { exts: [".tsx", ".ts"] })) {
      if (!looksClient(e.path)) continue;
      const lines = await fileLines(e.path);
      lines.forEach((l, i) => { if (!skip.test(l) && FORBIDDEN.test(l)) hits.push(`${e.path}:${i+1} ${l.trim().slice(0,80)}`); });
    }
  }
  for (const f of CLIENT_FILES_EXTRA) {
    const lines = await fileLines(f);
    lines.forEach((l, i) => { if (!skip.test(l) && FORBIDDEN.test(l)) hits.push(`${f}:${i+1} ${l.trim().slice(0,80)}`); });
  }
  checks.push({ name: "Client-facing language scrub (0 forbidden words)", weight: 10, pass: hits.length === 0, detail: hits.slice(0,5).join("\n") });
}

async function tableExists(t: string) {
  const { error } = await supabase.from(t).select("id").limit(1);
  return !error;
}

async function schema() {
  const required = ["action_queue_items","client_timeline_events","staff_members","staff_permissions","audit_log","style_phrase_bank","response_target_settings","client_automation_settings","coaching_events","coach_message_drafts","coach_message_templates","commitment_breaches","help_radar_items"];
  const missing: string[] = [];
  for (const t of required) if (!(await tableExists(t))) missing.push(t);
  checks.push({ name: "Schema: required tables exist", weight: 15, pass: missing.length === 0, detail: missing.join(", ") });
}

async function edgeFunctions() {
  const dir = "supabase/functions";
  const want = ["create-coaching-event","generate-coach-draft","auto-send-eligible-drafts","evaluate-help-radar","record-message-outcome","analyze-coach-edit","process-commitment-breaches"];
  const have = new Set<string>();
  try { for await (const e of Deno.readDir(dir)) if (e.isDirectory) have.add(e.name); } catch {}
  const missing = want.filter((w) => !have.has(w));
  checks.push({ name: "Edge functions present", weight: 15, pass: missing.length === 0, detail: missing.join(", ") });
}

async function frontendPages() {
  const want = [
    "src/pages/CoachActionQueuePage.tsx",
    "src/pages/CoachTeamSettingsPage.tsx",
    "src/pages/CoachReviewQueuePage.tsx",
    "src/pages/CoachClientDetailPage.tsx",
    "src/pages/CoachStyleLearningPage.tsx",
    "src/pages/CoachBreachesPage.tsx",
    "src/components/CoachLayout.tsx",
  ];
  const missing: string[] = [];
  for (const f of want) { try { await Deno.stat(f); } catch { missing.push(f); } }
  checks.push({ name: "Coach pages present", weight: 10, pass: missing.length === 0, detail: missing.join(", ") });
}

async function navGroups() {
  const t = await Deno.readTextFile("src/components/CoachLayout.tsx").catch(() => "");
  const ok = t.includes("Action Queue") && t.includes("Commitment Stakes") && t.includes("Team & Settings") && t.includes("Command") && t.includes("Programs") && t.includes("Operations");
  checks.push({ name: "Coach nav grouped + renamed", weight: 5, pass: ok });
}

async function acceptanceSmoke() {
  // Lightweight: ensure key tables are queryable from anon
  const a = await supabase.from("action_queue_items").select("id", { head: true, count: "exact" });
  const b = await supabase.from("client_timeline_events").select("id", { head: true, count: "exact" });
  const c = await supabase.from("audit_log").select("id", { head: true, count: "exact" });
  checks.push({ name: "Queue/Timeline/Audit queryable", weight: 10, pass: !a.error && !b.error && !c.error });
}

async function permissionsSeeded() {
  const { data } = await supabase.from("staff_permissions").select("role,permission");
  const ok = (data?.length || 0) >= 25;
  checks.push({ name: "Staff permissions seeded", weight: 5, pass: !!ok, detail: `${data?.length || 0} rows` });
}

async function responseTargets() {
  const { data } = await supabase.from("response_target_settings").select("id");
  checks.push({ name: "Response targets seeded", weight: 5, pass: (data?.length || 0) >= 1 });
}

async function styleLearningTables() {
  const { error: e1 } = await supabase.from("coach_style_learning").select("id").limit(1);
  const { error: e2 } = await supabase.from("style_phrase_bank").select("id").limit(1);
  checks.push({ name: "Style Learning storage ready", weight: 5, pass: !e1 && !e2 });
}

async function clientAutomationStatus() {
  const { error } = await supabase.from("client_automation_settings").select("send_status").limit(1);
  checks.push({ name: "Client send_status column present", weight: 5, pass: !error });
}

async function commitmentStakesLifecycle() {
  const { error } = await supabase.from("commitment_breaches").select("decision,evidence,charge_scheduled_at").limit(1);
  checks.push({ name: "Commitment stake lifecycle columns", weight: 5, pass: !error });
}

async function highRiskGuard() {
  const t = await Deno.readTextFile("supabase/functions/generate-coach-draft/index.ts").catch(() => "");
  const ok = /HIGH_RISK\s*=\s*\//.test(t) && /needs_human_review/.test(t);
  checks.push({ name: "High-risk auto-send block in draft gen", weight: 5, pass: ok });
}

async function noClientSLA() {
  const want = "10 minute";
  let hits = 0;
  for (const dir of CLIENT_DIRS) {
    for await (const e of walk(dir, { exts: [".tsx", ".ts"] })) {
      if (e.path.includes("/Coach")) continue;
      const t = await Deno.readTextFile(e.path);
      if (t.toLowerCase().includes(want)) hits++;
    }
  }
  checks.push({ name: "No 10-minute client SLA copy", weight: 5, pass: hits === 0 });
}

async function main() {
  await Promise.all([
    scanLanguage(), schema(), edgeFunctions(), frontendPages(), navGroups(),
    acceptanceSmoke(), permissionsSeeded(), responseTargets(),
    styleLearningTables(), clientAutomationStatus(), commitmentStakesLifecycle(),
    highRiskGuard(), noClientSLA(),
  ]);

  const total = checks.reduce((a, c) => a + c.weight, 0);
  const earned = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  const score = Math.round((earned / total) * 100);

  console.log("\n=== Terrible Coaching — Reliability Audit ===\n");
  for (const c of checks) {
    console.log(`${c.pass ? "✅" : "❌"} [${c.weight} pts] ${c.name}${c.detail ? `\n     ↳ ${c.detail}` : ""}`);
  }
  console.log(`\nScore: ${earned}/${total}  →  ${score}/100`);
  console.log(score >= 95 ? "\nREADY TO ROLLOUT" : score >= 80 ? "\nNEAR READY — address failures above" : "\nNOT READY");
}

await main();

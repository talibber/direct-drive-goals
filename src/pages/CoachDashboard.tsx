import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CoachLayout } from "@/components/CoachLayout";
import { CommandCenter } from "@/components/CommandCenter";
import { StatCard } from "@/components/StatCard";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, AlertTriangle, Target, Radio, ClipboardCheck, Inbox, DollarSign, Activity,
} from "lucide-react";

type Counts = {
  activeClients: number;
  newClients7d: number;
  recentCheckins: number;
  atRiskGoals: number;
  missedGoals: number;
  helpRadar: number;
  pendingDrafts: number;
  unreadMessages: number;
  breachCandidates: number;
};

const ZERO: Counts = {
  activeClients: 0, newClients7d: 0, recentCheckins: 0,
  atRiskGoals: 0, missedGoals: 0, helpRadar: 0,
  pendingDrafts: 0, unreadMessages: 0, breachCandidates: 0,
};

export default function CoachDashboard() {
  const [counts, setCounts] = useState<Counts>(ZERO);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const since7 = new Date(Date.now() - 7 * 86400_000).toISOString();
      const cnt = async (q: any) => { const { count } = await q; return count ?? 0; };

      const [active, new7, recent, atRisk, missed, radar, drafts, unread, breaches] = await Promise.all([
        cnt(supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", false)),
        cnt(supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", false).gte("created_at", since7)),
        cnt(supabase.from("weekly_checkins" as any).select("id", { count: "exact", head: true }).eq("is_demo", false).gte("created_at", since7)),
        cnt(supabase.from("goals").select("id", { count: "exact", head: true }).eq("status", "at_risk").eq("is_demo", false)),
        cnt(supabase.from("goals").select("id", { count: "exact", head: true }).eq("status", "missed").eq("is_demo", false)),
        cnt(supabase.from("help_radar_items").select("id", { count: "exact", head: true }).eq("is_demo", false).neq("coach_status", "resolved")),
        cnt(supabase.from("coach_message_drafts").select("id", { count: "exact", head: true }).eq("is_demo", false).in("status", ["pending", "needs_human_review", "approved"])),
        cnt(supabase.from("direct_access_messages").select("id", { count: "exact", head: true }).eq("is_demo", false).is("read_at", null)),
        cnt(supabase.from("commitment_breaches").select("id", { count: "exact", head: true }).eq("is_demo", false).eq("lifecycle_status", "candidate")),
      ]);

      if (cancelled) return;
      setCounts({
        activeClients: active, newClients7d: new7, recentCheckins: recent,
        atRiskGoals: atRisk, missedGoals: missed, helpRadar: radar,
        pendingDrafts: drafts, unreadMessages: unread, breachCandidates: breaches,
      });
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Coach Dashboard</h1>
      <p className="text-muted-foreground mb-8">Live view of your coaching practice. Real clients only.</p>

      <CommandCenter />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 mt-8">
        <Link to="/coach/clients"><StatCard label="Active Clients" value={String(counts.activeClients)} change={`${counts.newClients7d} new this week`} trend="neutral" icon={Users} /></Link>
        <Link to="/coach/clients"><StatCard label="Recent Check-Ins (7d)" value={String(counts.recentCheckins)} change={counts.recentCheckins === 0 ? "None yet" : "Logged"} trend="neutral" icon={Activity} /></Link>
        <Link to="/coach/review-queue"><StatCard label="At-Risk Goals" value={String(counts.atRiskGoals)} change={counts.atRiskGoals === 0 ? "All on track" : "Needs review"} trend={counts.atRiskGoals === 0 ? "up" : "down"} icon={AlertTriangle} /></Link>
        <Link to="/coach/review-queue"><StatCard label="Missed Goals" value={String(counts.missedGoals)} change={counts.missedGoals === 0 ? "Clear" : "Reset needed"} trend={counts.missedGoals === 0 ? "up" : "down"} icon={Target} /></Link>
        <Link to="/coach/messages"><StatCard label="Pending AI Approvals" value={String(counts.pendingDrafts)} change={counts.pendingDrafts === 0 ? "Queue empty" : "Awaiting you"} trend="neutral" icon={ClipboardCheck} /></Link>
        <Link to="/coach/messages"><StatCard label="Unread Messages" value={String(counts.unreadMessages)} change={counts.unreadMessages === 0 ? "Inbox clear" : "New"} trend="neutral" icon={Inbox} /></Link>
        <Link to="/coach/action-queue"><StatCard label="Help Radar" value={String(counts.helpRadar)} change={counts.helpRadar === 0 ? "Clear" : "Open"} trend="neutral" icon={Radio} /></Link>
        <Link to="/coach/breaches"><StatCard label="Breach Fee Candidates" value={String(counts.breachCandidates)} change={counts.breachCandidates === 0 ? "None pending" : "Review"} trend="neutral" icon={DollarSign} /></Link>
      </div>

      {loading && <p className="text-xs text-muted-foreground mt-6">Refreshing live data…</p>}

      {!loading && counts.activeClients === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-card/40 p-8 text-center">
          <p className="font-display text-lg font-semibold mb-2">No clients yet</p>
          <p className="text-sm text-muted-foreground">When real clients are onboarded they will appear here automatically. No demo data is shown in production.</p>
        </div>
      )}
    </CoachLayout>
  );
}

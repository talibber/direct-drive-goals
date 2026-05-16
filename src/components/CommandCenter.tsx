import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AlertOctagon, Inbox, MessageSquare, Radio, Target, UserPlus, Users, Activity } from "lucide-react";

interface Counts {
  newClients7d: number;
  activeReal: number;
  demo: number;
  pendingDrafts: number;
  atRisk: number;
  missed: number;
  radarOpen: number;
  breachCandidates: number;
  unreadClientMsgs: number;
  inactive7d: number;
  recentCheckins: number;
}

const empty: Counts = { newClients7d: 0, activeReal: 0, demo: 0, pendingDrafts: 0, atRisk: 0, missed: 0, radarOpen: 0, breachCandidates: 0, unreadClientMsgs: 0, inactive7d: 0, recentCheckins: 0 };

export function CommandCenter() {
  const [c, setC] = useState<Counts>(empty);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const since7 = new Date(Date.now() - 7 * 86400_000).toISOString();
      const cnt = (q: any) => q.then((r: any) => r.count ?? 0);
      const [newClients7d, activeReal, demo, pendingDrafts, atRisk, missed, radarOpen, breachCandidates, unreadClientMsgs, recentCheckins] = await Promise.all([
        cnt(supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", false).gte("created_at", since7)),
        cnt(supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("client_type", "real").eq("is_demo", false)),
        cnt(supabase.from("profiles").select("user_id", { count: "exact", head: true }).eq("is_demo", true)),
        cnt(supabase.from("coach_message_drafts").select("id", { count: "exact", head: true }).in("status", ["pending", "needs_human_review"])),
        cnt(supabase.from("goals").select("id", { count: "exact", head: true }).eq("status", "at_risk").eq("is_demo", false)),
        cnt(supabase.from("goals").select("id", { count: "exact", head: true }).eq("status", "missed").eq("is_demo", false)),
        cnt(supabase.from("help_radar_items").select("id", { count: "exact", head: true }).eq("coach_status", "seen").eq("is_demo", false)),
        cnt(supabase.from("commitment_breaches").select("id", { count: "exact", head: true }).eq("lifecycle_status", "candidate").eq("is_demo", false)),
        cnt(supabase.from("messages").select("id", { count: "exact", head: true }).eq("sender_role", "client").is("read_at", null)),
        cnt(supabase.from("weekly_checkins").select("id", { count: "exact", head: true }).eq("is_demo", false).gte("created_at", since7)),
      ]);
      setC({ ...empty, newClients7d, activeReal, demo, pendingDrafts, atRisk, missed, radarOpen, breachCandidates, unreadClientMsgs, recentCheckins });
      setLoading(false);
    })();
  }, []);

  const tile = (icon: any, label: string, value: number, href: string, alert = false) => {
    const Icon = icon;
    return (
      <Link to={href}>
        <Card className={`p-4 transition-colors hover:bg-muted/30 ${alert && value > 0 ? "border-destructive/40" : ""}`}>
          <div className="flex items-center justify-between">
            <Icon size={16} className={alert && value > 0 ? "text-destructive" : "text-muted-foreground"} />
            {alert && value > 0 && <Badge variant="destructive" className="text-[10px]">action</Badge>}
          </div>
          <div className="mt-2 text-2xl font-bold">{loading ? "—" : value}</div>
          <div className="text-xs text-muted-foreground">{label}</div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg font-bold">Command Center</h2>
        <Link to="/admin/diagnostics" className="text-xs text-muted-foreground hover:text-foreground underline">Run diagnostics →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {tile(UserPlus, "New (7d)", c.newClients7d, "/coach/clients")}
        {tile(Users, "Active real", c.activeReal, "/coach/clients")}
        {tile(Users, "Demo", c.demo, "/coach/clients")}
        {tile(Inbox, "Pending approvals", c.pendingDrafts, "/coach/review-queue", true)}
        {tile(Target, "At-risk goals", c.atRisk, "/coach/action-queue", true)}
        {tile(AlertOctagon, "Missed goals", c.missed, "/coach/action-queue", true)}
        {tile(Radio, "Help Radar open", c.radarOpen, "/coach/action-queue", true)}
        {tile(AlertOctagon, "Breach candidates", c.breachCandidates, "/coach/breaches", true)}
        {tile(MessageSquare, "Unread client msgs", c.unreadClientMsgs, "/coach/messages", true)}
        {tile(Activity, "Check-ins (7d)", c.recentCheckins, "/coach/action-queue")}
      </div>
    </div>
  );
}

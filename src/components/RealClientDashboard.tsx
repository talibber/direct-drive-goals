import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { Activity, Target, Flame, Inbox } from "lucide-react";
import type { ClientProfile } from "@/hooks/useRealClient";

type Goal = { id: string; title: string; status: string; category: string; due_date: string };
type Checkin = { id: string; submitted_at: string; completion_status: string | null };
type Message = { id: string; final_message: string | null; ai_draft: string; sent_at: string | null };
type RadarItem = { id: string; category: string; client_status: string; flagged_at: string };

export function RealClientDashboard({ profile }: { profile: ClientProfile }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [radar, setRadar] = useState<RadarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [g, c, m, r] = await Promise.all([
        supabase.from("goals").select("id,title,status,category,due_date").eq("user_id", profile.user_id).eq("is_demo", false).order("created_at", { ascending: false }),
        supabase.from("weekly_checkins" as any).select("id,submitted_at,completion_status").eq("client_id", profile.user_id).eq("is_demo", false).order("submitted_at", { ascending: false }).limit(8),
        supabase.from("coach_message_drafts").select("id,final_message,ai_draft,sent_at").eq("user_id", profile.user_id).eq("status", "sent").eq("is_demo", false).order("sent_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("help_radar_items").select("id,category,client_status,flagged_at").eq("client_id", profile.user_id).eq("is_demo", false).order("flagged_at", { ascending: false }).limit(3),
      ]);
      if (cancelled) return;
      setGoals(((g.data ?? []) as unknown) as Goal[]);
      setCheckins(((c.data ?? []) as unknown) as Checkin[]);
      setMessage(((m.data ?? null) as unknown) as Message | null);
      setRadar(((r.data ?? []) as unknown) as RadarItem[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [profile.user_id]);

  const totalCheckins = checkins.length;
  const completedGoals = goals.filter((g) => g.status === "verified" || g.status === "proof_submitted").length;
  const ratio = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;
  const name = profile.display_name || profile.email?.split("@")[0] || "there";

  return (
    <DashboardLayout coachingTrack={profile.coaching_track ?? "life"}>
      <div className="mb-6">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Welcome, {name}</h1>
        <p className="text-muted-foreground mt-1">Your real accountability record. Nothing here is a demo.</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Active Goals" value={String(goals.length)} change={goals.length === 0 ? "Awaiting onboarding" : "Live"} trend="neutral" icon={Target} />
        <StatCard label="Commitment Ratio" value={`${ratio}%`} change={`${completedGoals}/${goals.length || 0} complete`} trend={ratio >= 70 ? "up" : "down"} icon={Activity} />
        <StatCard label="Check-In Count" value={String(totalCheckins)} change={totalCheckins === 0 ? "None yet" : "Logged"} trend="neutral" icon={Flame} />
        <StatCard label="Help Radar" value={String(radar.length)} change={radar.length === 0 ? "Clear" : "Open"} trend="neutral" icon={Inbox} />
      </div>

      {/* Recent coach message */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card mb-8">
        <h3 className="font-display font-semibold mb-3">Latest Message from Your Coach</h3>
        {message ? (
          <div>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{message.final_message || message.ai_draft}</p>
            <p className="text-xs text-muted-foreground mt-2">{message.sent_at ? new Date(message.sent_at).toLocaleString() : ""}</p>
            <Link to="/dashboard/messages" className="text-xs text-primary underline mt-2 inline-block">Open inbox</Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Your coaching messages will appear here.</p>
        )}
      </div>

      {/* Goals */}
      <div className="mb-8">
        <h3 className="font-display font-semibold mb-4">Your Goals</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : goals.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-card/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Your first goals will appear here after onboarding.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((g) => (
              <div key={g.id} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{g.category}</p>
                <p className="font-semibold text-foreground mt-1">{g.title}</p>
                <p className="text-xs text-muted-foreground mt-2">Due {g.due_date} · {g.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Check-ins */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-3">Recent Check-Ins</h3>
        {checkins.length === 0 ? (
          <p className="text-sm text-muted-foreground">Your first check-in starts your accountability record.</p>
        ) : (
          <ul className="space-y-2">
            {checkins.map((c) => (
              <li key={c.id} className="text-sm text-foreground flex justify-between border-b border-border/40 pb-2 last:border-0">
                <span>{c.completion_status ?? "Logged"}</span>
                <span className="text-xs text-muted-foreground">{new Date(c.submitted_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}

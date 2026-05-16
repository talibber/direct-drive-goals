import { useEffect, useMemo, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type DraftStatus = "pending" | "approved" | "edited" | "rejected" | "sent" | "needs_human_review";

interface Draft {
  id: string;
  user_id: string;
  goal_id: string | null;
  event_id: string | null;
  trigger_type: string;
  ai_draft: string;
  final_message: string | null;
  status: DraftStatus;
  confidence_score: number;
  suggested_tone: string | null;
  created_at: string;
}

interface Enrichment {
  display_name?: string;
  goal_title?: string;
  goal_status?: string;
  prior_goal_status?: string;
  blocker?: string;
  events_30d?: number;
  reply_rate?: number;
}

interface Template { id: string; title: string; trigger_type: string | null; body: string }

const statusLabel: Record<DraftStatus, string> = {
  pending: "Pending", approved: "Approved", edited: "Edited",
  rejected: "Rejected", sent: "Sent", needs_human_review: "Needs Human Review",
};

export default function CoachReviewQueuePage() {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [enrich, setEnrich] = useState<Record<string, Enrichment>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<DraftStatus | "all_open">("all_open");
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [tplOpen, setTplOpen] = useState<{ draftId: string; body: string } | null>(null);
  const [tplTitle, setTplTitle] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("coach_message_drafts").select("*")
      .order("created_at", { ascending: false }).limit(100);
    const list = (data || []) as Draft[];
    setDrafts(list);

    // Enrich in parallel
    const userIds = Array.from(new Set(list.map(d => d.user_id)));
    const goalIds = Array.from(new Set(list.map(d => d.goal_id).filter(Boolean) as string[]));
    const [{ data: profiles }, { data: goals }, { data: profilesC }] = await Promise.all([
      userIds.length ? supabase.from("profiles").select("user_id,display_name").in("user_id", userIds) : Promise.resolve({ data: [] as any[] }),
      goalIds.length ? supabase.from("goals").select("id,title,status").in("id", goalIds) : Promise.resolve({ data: [] as any[] }),
      userIds.length ? supabase.from("user_coaching_profiles").select("user_id,reply_rate,common_blockers").in("user_id", userIds) : Promise.resolve({ data: [] as any[] }),
    ]);
    const pMap = new Map((profiles || []).map(p => [p.user_id, p]));
    const gMap = new Map((goals || []).map(g => [g.id, g]));
    const cMap = new Map((profilesC || []).map(c => [c.user_id, c]));

    // Latest weekly_checkin per user for blocker
    const latestBlockers = new Map<string, string>();
    if (userIds.length) {
      const { data: ci } = await supabase
        .from("weekly_checkins").select("client_id,avoiding,created_at")
        .in("client_id", userIds).order("created_at", { ascending: false });
      for (const row of ci ?? []) {
        if (!latestBlockers.has(row.client_id) && row.avoiding) {
          latestBlockers.set(row.client_id, row.avoiding);
        }
      }
    }

    // Events count per user (last 30 days)
    const since = new Date(Date.now() - 30 * 86400_000).toISOString();
    const eventCounts = new Map<string, number>();
    if (userIds.length) {
      const { data: evs } = await supabase
        .from("coaching_events").select("user_id").in("user_id", userIds).gte("created_at", since);
      for (const e of evs ?? []) eventCounts.set(e.user_id, (eventCounts.get(e.user_id) || 0) + 1);
    }

    const e: Record<string, Enrichment> = {};
    for (const d of list) {
      const g = d.goal_id ? gMap.get(d.goal_id) : undefined;
      e[d.id] = {
        display_name: pMap.get(d.user_id)?.display_name,
        goal_title: g?.title,
        goal_status: g?.status,
        blocker: latestBlockers.get(d.user_id) || (cMap.get(d.user_id)?.common_blockers?.[0] ?? undefined),
        events_30d: eventCounts.get(d.user_id) || 0,
        reply_rate: cMap.get(d.user_id)?.reply_rate ?? undefined,
      };
    }
    setEnrich(e);

    const { data: tpls } = await supabase.from("coach_message_templates").select("*").order("created_at", { ascending: false });
    setTemplates((tpls ?? []) as Template[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    if (filter === "all_open") return drafts.filter(d => ["pending", "needs_human_review", "edited"].includes(d.status));
    return drafts.filter(d => d.status === filter);
  }, [drafts, filter]);

  async function approveAndSend(d: Draft) {
    const final = edits[d.id] ?? d.final_message ?? d.ai_draft;
    const wasEdited = final.trim() !== d.ai_draft.trim();
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("coach_message_drafts")
      .update({
        final_message: final, status: "sent",
        approved_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        approved_by: u.user?.id ?? null,
      })
      .eq("id", d.id);
    if (error) return toast({ title: "Could not send", description: error.message, variant: "destructive" });
    if (wasEdited && u.user?.id) {
      await supabase.functions.invoke("analyze-coach-edit", { body: { draft_id: d.id, coach_id: u.user.id } });
    }
    toast({ title: wasEdited ? "Edited and sent" : "Approved and sent" });
    load();
  }

  async function saveEdit(d: Draft) {
    const final = edits[d.id] ?? d.ai_draft;
    if (final.trim() === d.ai_draft.trim()) {
      return toast({ title: "No edits to save" });
    }
    const { error } = await supabase
      .from("coach_message_drafts")
      .update({ final_message: final, status: "edited" })
      .eq("id", d.id);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Edit saved (not sent)" });
    load();
  }

  async function reject(d: Draft) {
    await supabase.from("coach_message_drafts").update({ status: "rejected" }).eq("id", d.id);
    toast({ title: "Rejected" });
    load();
  }

  async function flagHuman(d: Draft) {
    await supabase.from("coach_message_drafts").update({ status: "needs_human_review" }).eq("id", d.id);
    toast({ title: "Flagged for human review" });
    load();
  }

  async function saveTemplate() {
    if (!tplOpen) return;
    if (!tplTitle.trim()) return toast({ title: "Title required", variant: "destructive" });
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const d = drafts.find(x => x.id === tplOpen.draftId);
    const { error } = await supabase.from("coach_message_templates").insert({
      coach_id: u.user.id, title: tplTitle.trim(),
      trigger_type: d?.trigger_type ?? null, body: tplOpen.body,
    });
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    toast({ title: "Template saved" });
    setTplOpen(null); setTplTitle("");
    load();
  }

  return (
    <CoachLayout>
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Coach Review Queue</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Every AI-drafted coaching message lives here until you approve, edit, or reject. Nothing sends without you.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>Refresh</Button>
      </div>

      <div className="flex gap-2 mt-4 mb-6 flex-wrap">
        {(["all_open", "pending", "needs_human_review", "edited", "sent", "rejected"] as const).map(f => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f as any)}>
            {f === "all_open" ? "Open" : statusLabel[f as DraftStatus] || f}
          </Button>
        ))}
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {!loading && visible.length === 0 && <p className="text-muted-foreground text-sm">Queue is clear.</p>}

      <div className="space-y-4">
        {visible.map(d => {
          const editValue = edits[d.id] ?? d.final_message ?? d.ai_draft;
          const isHumanReview = d.status === "needs_human_review";
          const meta = enrich[d.id] || {};
          return (
            <Card key={d.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{meta.display_name || `user ${d.user_id.slice(0, 8)}`}</span>
                    <Badge variant="outline">{d.trigger_type.replace(/_/g, " ")}</Badge>
                    {d.suggested_tone && <Badge variant="secondary">{d.suggested_tone}</Badge>}
                    <Badge className={isHumanReview ? "bg-destructive text-destructive-foreground" : ""}>
                      {statusLabel[d.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">conf {(d.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    {meta.goal_title && <div><b>Goal:</b> {meta.goal_title}{meta.goal_status ? ` · ${meta.goal_status}` : ""}</div>}
                    {meta.blocker && <div><b>Blocker:</b> {meta.blocker.slice(0, 200)}</div>}
                    <div>
                      <b>Engagement:</b> {meta.events_30d ?? 0} events / 30d
                      {meta.reply_rate != null && ` · reply ${(meta.reply_rate * 100).toFixed(0)}%`}
                    </div>
                    <div className="font-mono opacity-70">{new Date(d.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">AI draft</p>
                <div className="rounded-md border border-border bg-background/40 p-3 text-sm whitespace-pre-wrap">{d.ai_draft}</div>
              </div>

              {d.status !== "sent" && d.status !== "rejected" && (
                <>
                  {templates.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Insert template:</span>
                      <Select onValueChange={(tid) => {
                        const t = templates.find(x => x.id === tid);
                        if (t) setEdits(prev => ({ ...prev, [d.id]: t.body }));
                      }}>
                        <SelectTrigger className="w-64 h-8 text-xs"><SelectValue placeholder="Choose template" /></SelectTrigger>
                        <SelectContent>
                          {templates.map(t => (
                            <SelectItem key={t.id} value={t.id}>{t.title}{t.trigger_type ? ` · ${t.trigger_type}` : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Final message</p>
                    <Textarea
                      value={editValue}
                      onChange={e => setEdits(prev => ({ ...prev, [d.id]: e.target.value }))}
                      className="min-h-[140px] font-sans"
                    />
                  </div>
                </>
              )}

              {d.status === "sent" && d.final_message && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Sent message</p>
                  <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm whitespace-pre-wrap">{d.final_message}</div>
                </div>
              )}

              {d.status !== "sent" && d.status !== "rejected" && (
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={() => approveAndSend(d)}>Approve &amp; Send</Button>
                  <Button variant="outline" onClick={() => saveEdit(d)}>Save Edit</Button>
                  <Button variant="outline" onClick={() => setTplOpen({ draftId: d.id, body: editValue })}>Save as Template</Button>
                  <Button variant="outline" onClick={() => reject(d)}>Reject</Button>
                  {!isHumanReview && <Button variant="outline" onClick={() => flagHuman(d)}>Needs Human Review</Button>}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <Dialog open={!!tplOpen} onOpenChange={(o) => !o && setTplOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Save as Template</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Title</p>
              <Input value={tplTitle} onChange={e => setTplTitle(e.target.value)} placeholder="e.g. At-risk reset nudge" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Body</p>
              <div className="text-xs rounded-md border border-border bg-background/40 p-3 max-h-48 overflow-auto whitespace-pre-wrap">
                {tplOpen?.body}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTplOpen(null)}>Cancel</Button>
            <Button onClick={saveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CoachLayout>
  );
}

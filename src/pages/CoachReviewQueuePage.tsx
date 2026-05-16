import { useEffect, useMemo, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

const statusLabel: Record<DraftStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  edited: "Edited",
  rejected: "Rejected",
  sent: "Sent",
  needs_human_review: "Needs Human Review",
};

export default function CoachReviewQueuePage() {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<DraftStatus | "all_open">("all_open");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const q = supabase.from("coach_message_drafts").select("*").order("created_at", { ascending: false }).limit(100);
    const { data } = await q;
    setDrafts((data || []) as Draft[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    if (filter === "all_open") return drafts.filter(d => ["pending", "needs_human_review"].includes(d.status));
    return drafts.filter(d => d.status === filter);
  }, [drafts, filter]);

  async function approveAndSend(d: Draft) {
    const final = edits[d.id] ?? d.ai_draft;
    const wasEdited = final.trim() !== d.ai_draft.trim();
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("coach_message_drafts")
      .update({
        final_message: final,
        status: "sent",
        approved_at: new Date().toISOString(),
        sent_at: new Date().toISOString(),
        approved_by: u.user?.id ?? null,
      })
      .eq("id", d.id);
    if (error) {
      toast({ title: "Could not send", description: error.message, variant: "destructive" });
      return;
    }
    if (wasEdited) {
      await supabase.functions.invoke("analyze-coach-edit", { body: { draft_id: d.id, coach_id: u.user?.id } });
    }
    toast({ title: wasEdited ? "Edited and sent" : "Approved and sent" });
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
        {(["all_open", "pending", "needs_human_review", "sent", "rejected"] as const).map(f => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f as any)}>
            {f === "all_open" ? "Open" : statusLabel[f as DraftStatus] || f}
          </Button>
        ))}
      </div>

      {loading && <p className="text-muted-foreground text-sm">Loading…</p>}
      {!loading && visible.length === 0 && (
        <p className="text-muted-foreground text-sm">Queue is clear.</p>
      )}

      <div className="space-y-4">
        {visible.map(d => {
          const editValue = edits[d.id] ?? d.final_message ?? d.ai_draft;
          const isHumanReview = d.status === "needs_human_review";
          return (
            <Card key={d.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{d.trigger_type.replace(/_/g, " ")}</Badge>
                    {d.suggested_tone && <Badge variant="secondary">{d.suggested_tone}</Badge>}
                    <Badge className={isHumanReview ? "bg-destructive text-destructive-foreground" : ""}>
                      {statusLabel[d.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      confidence {(d.confidence_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    user {d.user_id.slice(0, 8)} · {new Date(d.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">AI draft</p>
                <div className="rounded-md border border-border bg-background/40 p-3 text-sm whitespace-pre-wrap">{d.ai_draft}</div>
              </div>

              {d.status !== "sent" && d.status !== "rejected" && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Final message</p>
                  <Textarea
                    value={editValue}
                    onChange={e => setEdits(prev => ({ ...prev, [d.id]: e.target.value }))}
                    className="min-h-[140px] font-sans"
                  />
                </div>
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
                  <Button variant="outline" onClick={() => reject(d)}>Reject</Button>
                  {!isHumanReview && (
                    <Button variant="outline" onClick={() => flagHuman(d)}>Mark Needs Human Review</Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </CoachLayout>
  );
}

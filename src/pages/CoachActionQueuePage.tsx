import { useEffect, useMemo, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Inbox, AlertOctagon, Clock, UserCheck } from "lucide-react";
import { toast } from "sonner";

type QueueItem = {
  id: string;
  client_id: string;
  source_type: string;
  source_id: string | null;
  trigger: string;
  risk_level: string;
  priority: number;
  assigned_owner: string | null;
  internal_due_at: string | null;
  status: string;
  suggested_action: string | null;
  suggested_response_draft_id: string | null;
  context_summary: any;
  created_at: string;
};

const FILTERS = [
  "All","Due soon","Overdue","High Risk","First 14 Days","Needs Review",
  "Ready to Send","Waiting on Client","Waiting on Proof","Waiting on Coach",
  "Assigned to Me","Unassigned","Resolved",
] as const;

export default function CoachActionQueuePage() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMe(data.user?.id ?? null));
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("action_queue_items")
      .select("*")
      .order("priority", { ascending: true })
      .order("internal_due_at", { ascending: true, nullsFirst: false })
      .limit(200);
    if (error) toast.error(error.message);
    setItems((data as any) || []);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    const now = Date.now();
    return items.filter((i) => {
      switch (filter) {
        case "All": return i.status !== "resolved";
        case "Resolved": return i.status === "resolved";
        case "High Risk": return i.risk_level === "high";
        case "Overdue": return i.internal_due_at && new Date(i.internal_due_at).getTime() < now && i.status !== "resolved";
        case "Due soon": return i.internal_due_at && new Date(i.internal_due_at).getTime() - now < 10 * 60_000 && i.status !== "resolved";
        case "Needs Review": return i.status === "open" && i.source_type === "message";
        case "Ready to Send": return i.status === "ready";
        case "Waiting on Client": return i.status === "waiting_on_client";
        case "Waiting on Proof": return i.source_type === "proof" && i.status !== "resolved";
        case "Waiting on Coach": return i.status === "waiting_on_coach";
        case "Assigned to Me": return i.assigned_owner === me;
        case "Unassigned": return !i.assigned_owner && i.status !== "resolved";
        case "First 14 Days": return !!i.context_summary?.first_14_days;
        default: return true;
      }
    });
  }, [items, filter, me]);

  async function act(id: string, action: "approve"|"assign"|"resolve"|"escalate") {
    const patch: any = { updated_at: new Date().toISOString() };
    if (action === "resolve") { patch.status = "resolved"; patch.resolved_at = new Date().toISOString(); patch.resolved_by = me; }
    if (action === "assign") patch.assigned_owner = me;
    if (action === "escalate") { patch.risk_level = "high"; patch.priority = 1; }
    if (action === "approve") patch.status = "ready";
    const { error } = await supabase.from("action_queue_items").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    await supabase.from("audit_log").insert({ actor_id: me, action, entity_type: "action_queue_items", entity_id: id, after_value: patch });
    toast.success(`Marked ${action}`);
    load();
  }

  return (
    <CoachLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Inbox className="text-primary" /> Action Queue</h1>
          <p className="text-muted-foreground mt-1">Every coaching action waiting for human review.</p>
        </div>
        <Button variant="outline" onClick={load}>Refresh</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>{f}</Button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          No open coaching actions. New client activity, proof reviews, Help Radar submissions, and follow-ups will appear here.
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((i) => {
            const overdue = i.internal_due_at && new Date(i.internal_due_at).getTime() < Date.now();
            return (
              <Card key={i.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant={i.risk_level === "high" ? "destructive" : i.risk_level === "medium" ? "secondary" : "outline"}>
                        {i.risk_level === "high" && <AlertOctagon className="h-3 w-3 mr-1" />}
                        {i.risk_level} risk
                      </Badge>
                      <Badge variant="outline">{i.source_type}</Badge>
                      <Badge variant="outline">P{i.priority}</Badge>
                      {overdue && <Badge variant="destructive"><Clock className="h-3 w-3 mr-1" />Overdue internally</Badge>}
                      {i.assigned_owner && <Badge variant="secondary"><UserCheck className="h-3 w-3 mr-1" />Assigned</Badge>}
                    </div>
                    <p className="font-medium">{i.trigger}</p>
                    {i.suggested_action && <p className="text-sm text-muted-foreground mt-1">Suggested: {i.suggested_action}</p>}
                    {i.context_summary?.preview && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{i.context_summary.preview}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <Button size="sm" onClick={() => act(i.id, "approve")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => act(i.id, "assign")}>Assign me</Button>
                    <Button size="sm" variant="outline" onClick={() => act(i.id, "escalate")}>Escalate</Button>
                    <Button size="sm" variant="ghost" onClick={() => act(i.id, "resolve")}>Resolve</Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </CoachLayout>
  );
}

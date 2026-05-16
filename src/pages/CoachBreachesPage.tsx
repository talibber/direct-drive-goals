import { useEffect, useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AlertOctagon, RefreshCw } from "lucide-react";
import { BreachFeeBadge } from "@/components/BreachFeeBadge";

interface Breach {
  id: string;
  user_id: string;
  goal_id: string | null;
  amount: number;
  breach_reason: string;
  charged: boolean;
  waived: boolean;
  waiver_reason: string | null;
  reset_call_enrolled: boolean;
  created_at: string;
  lifecycle_status: "candidate" | "approved" | "waived" | "charged" | "disputed";
  is_demo: boolean;
  auto_charge_disabled: boolean;
}

const reasonLabel: Record<string, string> = {
  missed_checkin: "Missed Check-in",
  missing_evidence: "Missing Evidence",
  ghosted_system: "Ghosted System",
  broken_commitment: "Broken Commitment",
};

export default function CoachBreachesPage() {
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [waiverFor, setWaiverFor] = useState<string | null>(null);
  const [waiverReason, setWaiverReason] = useState("");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("commitment_breaches")
      .select("*")
      .order("created_at", { ascending: false });
    setBreaches((data as Breach[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function runSweep() {
    setScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-commitment-breaches");
      if (error) throw error;
      toast.success(`Scanned ${data.scanned ?? 0} overdue goals - ${data.created ?? 0} new breach(es)`);
      await load();
    } catch (e) {
      toast.error("Sweep failed: " + (e as Error).message);
    } finally {
      setScanning(false);
    }
  }

  async function approve(id: string) {
    const { error } = await supabase.from("commitment_breaches").update({ lifecycle_status: "approved", decision: "approved" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Breach approved - still requires manual charge.");
    load();
  }

  async function markCharged(b: Breach) {
    if (b.is_demo) return toast.error("Demo breaches cannot be charged.");
    if (b.auto_charge_disabled) {
      const ok = window.confirm("Auto-charge is disabled. Mark this as manually charged?");
      if (!ok) return;
    }
    const { error } = await supabase.from("commitment_breaches").update({ charged: true, lifecycle_status: "charged", charge_completed_at: new Date().toISOString() }).eq("id", b.id);
    if (error) return toast.error(error.message);
    toast.success("Marked as charged");
    load();
  }

  async function waive(id: string) {
    if (!waiverReason.trim()) {
      toast.error("Add a waiver reason");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("commitment_breaches")
      .update({
        waived: true,
        lifecycle_status: "waived",
        waiver_reason: waiverReason,
        waived_by: userData?.user?.id ?? null,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Breach waived");
    setWaiverFor(null);
    setWaiverReason("");
    load();
  }

  const pending = breaches.filter((b) => !b.charged && !b.waived);
  const resolved = breaches.filter((b) => b.charged || b.waived);
  const totalPending = pending.reduce((s, b) => s + Number(b.amount), 0);

  return (
    <CoachLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold flex items-center gap-2">
            <AlertOctagon className="text-danger" /> Commitment Breach Fees
            <BreachFeeBadge />
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Pending breach fees, waivers, and charge status across all clients. Nothing charges automatically.
          </p>
        </div>
        <Button onClick={runSweep} disabled={scanning} variant="outline">
          <RefreshCw size={16} className={scanning ? "animate-spin" : ""} />
          Run Sweep
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-danger">{pending.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Pending $</p>
          <p className="text-2xl font-bold text-foreground">${totalPending}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-foreground">{resolved.length}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : breaches.length === 0 ? (
        <p className="text-muted-foreground">No breaches recorded. Run a sweep to check for overdue goals.</p>
      ) : (
        <div className="space-y-3">
          {breaches.map((b) => (
            <div key={b.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    ${b.amount} - {reasonLabel[b.breach_reason] ?? b.breach_reason}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Client: {b.user_id.slice(0, 8)}… · Goal: {b.goal_id?.slice(0, 8) ?? "-"} ·{" "}
                    {new Date(b.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase">{b.lifecycle_status}</Badge>
                  {b.is_demo && <Badge variant="secondary">demo</Badge>}
                  {!b.charged && !b.waived && b.lifecycle_status === "candidate" && (
                    <Button size="sm" onClick={() => approve(b.id)}>Approve</Button>
                  )}
                  {!b.charged && !b.waived && b.lifecycle_status === "approved" && (
                    <Button size="sm" onClick={() => markCharged(b)}>Mark Charged</Button>
                  )}
                  {!b.charged && !b.waived && (
                    <Button size="sm" variant="outline" onClick={() => setWaiverFor(b.id)}>Waive</Button>
                  )}
                </div>
              </div>
              {waiverFor === b.id && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    placeholder="Reason for waiving (visible internally only)"
                    value={waiverReason}
                    onChange={(e) => setWaiverReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => waive(b.id)}>Confirm Waiver</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setWaiverFor(null); setWaiverReason(""); }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {b.waiver_reason && (
                <p className="text-xs text-muted-foreground mt-2">Waiver: {b.waiver_reason}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </CoachLayout>
  );
}

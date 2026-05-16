import { useState, useEffect } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Application = Tables<"applications">;

const filterTabs = ["All", "Life Track", "Operator Track", "Pending", "Approved", "Rejected"] as const;
type FilterTab = typeof filterTabs[number];

export default function CoachApplicationsPage() {
  const [filter, setFilter] = useState<FilterTab>("All");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } else {
      setApplications(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Failed to approve application");
    } else {
      toast.success("Application approved");
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "approved", reviewed_at: new Date().toISOString() } : a));
    }
  };

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      toast.error("Failed to reject application");
    } else {
      toast.success("Application rejected");
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: "rejected", reviewed_at: new Date().toISOString() } : a));
    }
  };

  const filtered = applications.filter((a) => {
    if (filter === "Life Track") return a.track === "life";
    if (filter === "Operator Track") return a.track === "business";
    if (filter === "Pending") return a.status === "pending";
    if (filter === "Approved") return a.status === "approved";
    if (filter === "Rejected") return a.status === "rejected";
    return true;
  });

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Applications</h1>
      <p className="text-muted-foreground mb-6">Review and manage incoming applications.</p>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-muted-foreground" size={24} />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="font-display font-semibold text-foreground">{a.name}</h3>
                    {/* Track Badge */}
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      a.track === "business"
                        ? "bg-primary text-primary-foreground"
                        : "bg-foreground/10 text-foreground"
                    )}>
                      {a.track === "business" ? "Operator Track" : "Life Track"}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      a.status === "pending" ? "text-warning bg-warning/10 border border-warning/30" :
                      a.status === "approved" ? "text-success bg-success/10 border border-success/30" :
                      "text-danger bg-danger/10 border border-danger/30"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.email} · {a.occupation || "—"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-foreground font-medium">Interest:</span> {a.coaching_interest} · 
                    <span className="text-foreground font-medium"> Challenge:</span> {a.challenge || "—"}
                  </p>
                  {a.goals_30_day && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="text-foreground font-medium">30-day goals:</span> {a.goals_30_day}
                    </p>
                  )}
                  {a.support_level && (
                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="text-foreground font-medium">Support:</span> {a.support_level}
                    </p>
                  )}
                  {/* Business-specific fields */}
                  {a.track === "business" && (
                    <div className="mt-3 rounded-md border-l-2 border-primary/50 bg-primary/5 p-3 space-y-1">
                      {a.business_name && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Business:</span> {a.business_name}</p>}
                      {a.industry && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Industry:</span> {a.industry}</p>}
                      {a.revenue_range && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Revenue:</span> {a.revenue_range}</p>}
                      {a.team_size && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Team:</span> {a.team_size}</p>}
                      {a.avoided_decision && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">Decision Avoided:</span> {a.avoided_decision}</p>}
                      {a.decision_outcome && <p className="text-xs text-muted-foreground"><span className="text-foreground font-medium">If Decided:</span> {a.decision_outcome}</p>}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Submitted {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                {a.status === "pending" && (
                  <div className="flex gap-2">
                    <Button variant="hero" size="sm" onClick={() => handleApprove(a.id)}><Check size={14} /> Approve</Button>
                    <Button variant="secondary" size="sm" onClick={() => handleReject(a.id)}><X size={14} /> Reject</Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-center py-8">No applications match this filter.</p>
          )}
        </div>
      )}
    </CoachLayout>
  );
}

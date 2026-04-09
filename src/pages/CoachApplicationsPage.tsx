import { CoachLayout } from "@/components/CoachLayout";
import { applications } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export default function CoachApplicationsPage() {
  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Applications</h1>
      <p className="text-muted-foreground mb-8">Review and manage incoming applications.</p>

      <div className="space-y-4">
        {applications.map((a) => (
          <div key={a.id} className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-display font-semibold text-foreground">{a.name}</h3>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    a.status === "pending" ? "text-warning bg-warning/10 border border-warning/30" : "text-success bg-success/10 border border-success/30"
                  }`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{a.email} · {a.occupation}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="text-foreground font-medium">Interest:</span> {a.type} · 
                  <span className="text-foreground font-medium"> Challenge:</span> {a.challenge}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Submitted {a.submitted}</p>
              </div>
              {a.status === "pending" && (
                <div className="flex gap-2">
                  <Button variant="hero" size="sm"><Check size={14} /> Approve</Button>
                  <Button variant="secondary" size="sm"><X size={14} /> Reject</Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CoachLayout>
  );
}

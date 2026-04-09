import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { StatCard } from "@/components/StatCard";
import { CoachGoalReviewPanel } from "@/components/CoachGoalReviewPanel";
import { clients, applications, pendingCoachGoals, type Goal } from "@/lib/mockData";
import { Users, AlertTriangle, DollarSign, ClipboardCheck, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function CoachDashboard() {
  const atRisk = clients.filter((c) => c.risk);
  const pendingApps = applications.filter((a) => a.status === "pending");

  const [pendingGoals, setPendingGoals] = useState<Goal[]>(pendingCoachGoals);
  const [reviewGoal, setReviewGoal] = useState<Goal | null>(null);

  const handleGoalAction = (goalId: string, action: "approved" | "revision_requested" | "rejected", notes?: string) => {
    setPendingGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Coach Dashboard</h1>
      <p className="text-muted-foreground mb-8">Overview of your coaching practice.</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Active Clients" value={clients.length} icon={Users} />
        <StatCard label="At-Risk Clients" value={atRisk.length} change="Need attention" trend="down" icon={AlertTriangle} />
        <StatCard label="Pending Applications" value={pendingApps.length} icon={ClipboardCheck} />
        <StatCard label="Revenue (MTD)" value="$1,245" change="+12% from last month" trend="up" icon={DollarSign} />
      </div>

      {/* Goals Awaiting Approval */}
      {pendingGoals.length > 0 && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 mb-8">
          <h3 className="font-display font-semibold text-primary mb-3 flex items-center gap-2">
            <Target size={18} /> Goals Awaiting Approval
            <span className="ml-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
              {pendingGoals.length}
            </span>
          </h3>
          <div className="space-y-3">
            {pendingGoals.map((g) => (
              <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{g.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {g.clientName} · {g.category} · Due {g.dueDate}
                    {g.resubmissionCount > 0 && <span className="text-warning ml-1">(resubmission)</span>}
                  </p>
                </div>
                <button
                  onClick={() => setReviewGoal(g)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Review →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* At-risk */}
      {atRisk.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-5 mb-8">
          <h3 className="font-display font-semibold text-warning mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Clients Needing Attention
          </h3>
          <div className="space-y-3">
            {atRisk.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Last check-in: {c.lastCheckIn} · Score: {c.score}</p>
                </div>
                <Link to="/coach/clients" className="text-xs text-primary hover:underline">View →</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All clients table */}
      <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">All Clients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Missed Goals</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Check-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.type}</td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${c.score >= 80 ? "text-success" : c.score >= 60 ? "text-warning" : "text-danger"}`}>
                      {c.score}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.missedGoals}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.lastCheckIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Goal Review Panel */}
      <CoachGoalReviewPanel
        goal={reviewGoal}
        open={!!reviewGoal}
        onClose={() => setReviewGoal(null)}
        onAction={handleGoalAction}
      />
    </CoachLayout>
  );
}

import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GoalCard } from "@/components/GoalCard";
import { GoalBuilderDialog } from "@/components/GoalBuilderDialog";
import { goals as initialGoals, type Goal } from "@/lib/mockData";
import { Clock } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  const pendingGoals = goals.filter((g) => g.status === "pending_approval");
  const revisionGoals = goals.filter((g) => g.status === "revision_requested");
  const activeGoals = goals.filter((g) => g.status === "active" || g.status === "at_risk");
  const completedGoals = goals.filter((g) => g.status === "completed" || g.status === "missed");

  const handleNewGoal = () => {
    const newGoal: Goal = {
      id: String(Date.now()),
      title: "New Goal",
      category: "Business",
      target: "TBD",
      progress: 0,
      status: "pending_approval",
      dueDate: "May 31",
      stake: 75,
      metricType: "count",
      targetValue: 1,
      currentValue: 0,
      coachApproved: false,
      resubmissionCount: 0,
    };
    setGoals((prev) => [newGoal, ...prev]);
  };

  const handleResubmit = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, status: "pending_approval" as const, coachNotes: undefined, resubmissionCount: g.resubmissionCount + 1 }
          : g
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground mt-1">1–3 measurable goals per month. Each carries a $75 stake.</p>
        </div>
        <GoalBuilderDialog onSubmit={handleNewGoal} />
      </div>

      {/* Pending Approval */}
      {pendingGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
            <h2 className="font-display font-semibold text-foreground">Awaiting Coach Review</h2>
            <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded-full">{pendingGoals.length}</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingGoals.map((g) => (
              <GoalCard key={g.id} {...g} />
            ))}
          </div>
        </div>
      )}

      {/* Revision Requested */}
      {revisionGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-danger" />
            <h2 className="font-display font-semibold text-foreground">Revision Requested</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {revisionGoals.map((g) => (
              <GoalCard key={g.id} {...g} onResubmit={() => handleResubmit(g.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-success" />
            <h2 className="font-display font-semibold text-foreground">Active Goals</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((g) => (
              <GoalCard key={g.id} {...g} />
            ))}
          </div>
        </div>
      )}

      {/* Past Goals */}
      <div className="mt-8 rounded-lg border border-border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-4">Past Goals</h3>
        <div className="space-y-3">
          {[
            { title: "Daily journaling for 30 days", status: "missed" as const, month: "March 2026" },
            { title: "Complete sales playbook", status: "completed" as const, month: "March 2026" },
            { title: "Run 3x per week", status: "completed" as const, month: "February 2026" },
          ].map((g, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div>
                <p className="text-sm text-foreground">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.month}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                g.status === "completed" ? "text-success bg-success/10" : "text-danger bg-danger/10"
              }`}>
                {g.status === "completed" ? "Completed" : "Missed — $75"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

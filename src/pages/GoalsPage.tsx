import { DashboardLayout } from "@/components/DashboardLayout";
import { GoalCard } from "@/components/GoalCard";
import { goals } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function GoalsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground mt-1">1–3 measurable goals per month. Each carries a $75 stake.</p>
        </div>
        <Button variant="hero" size="sm"><Plus size={16} /> New Goal</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => (
          <GoalCard key={g.id} {...g} />
        ))}
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold mb-4">Past Goals</h3>
        <div className="space-y-3">
          {[
            { title: "Daily journaling for 30 days", status: "missed", month: "March 2026" },
            { title: "Complete sales playbook", status: "completed", month: "March 2026" },
            { title: "Run 3x per week", status: "completed", month: "February 2026" },
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

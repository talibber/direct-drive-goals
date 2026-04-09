import { cn } from "@/lib/utils";
import { Target, TrendingUp, AlertTriangle, XCircle } from "lucide-react";

interface GoalCardProps {
  title: string;
  category: string;
  target: string;
  progress: number;
  status: "on-track" | "at-risk" | "missed" | "completed";
  dueDate: string;
  stake: number;
}

const statusConfig = {
  "on-track": { label: "On Track", color: "text-success border-success/30 bg-success/10", icon: TrendingUp },
  "at-risk": { label: "At Risk", color: "text-warning border-warning/30 bg-warning/10", icon: AlertTriangle },
  "missed": { label: "Missed", color: "text-danger border-danger/30 bg-danger/10", icon: XCircle },
  "completed": { label: "Completed", color: "text-success border-success/30 bg-success/10", icon: Target },
};

export function GoalCard({ title, category, target, progress, status, dueDate, stake }: GoalCardProps) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-display font-semibold text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{category} · Due {dueDate}</p>
        </div>
        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", cfg.color)}>
          <Icon size={12} /> {cfg.label}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">Target: {target}</p>
      <div className="w-full bg-secondary rounded-full h-2 mb-2">
        <div
          className={cn("h-2 rounded-full transition-all", {
            "bg-gradient-gold": status === "on-track" || status === "completed",
            "bg-warning": status === "at-risk",
            "bg-danger": status === "missed",
          })}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{progress}% complete</span>
        <span className="font-medium text-foreground">${stake} stake</span>
      </div>
    </div>
  );
}

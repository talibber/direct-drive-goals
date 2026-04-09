import { cn } from "@/lib/utils";
import { Target, TrendingUp, AlertTriangle, XCircle, Clock, Edit3, CheckCircle } from "lucide-react";
import type { GoalStatus } from "@/lib/mockData";

interface GoalCardProps {
  title: string;
  category: string;
  target: string;
  progress: number;
  status: GoalStatus;
  dueDate: string;
  stake: number;
  coachNotes?: string;
  resubmissionCount?: number;
  onResubmit?: () => void;
}

const statusConfig: Record<GoalStatus, { label: string; sublabel: string; color: string; icon: typeof Target }> = {
  pending_approval: { label: "Pending", sublabel: "Waiting on coach review", color: "text-warning border-warning/30 bg-warning/10", icon: Clock },
  revision_requested: { label: "Revision", sublabel: "Coach has requested changes", color: "text-danger border-danger/30 bg-danger/10", icon: Edit3 },
  active: { label: "Active", sublabel: "Approved and stake is live", color: "text-success border-success/30 bg-success/10", icon: CheckCircle },
  at_risk: { label: "At Risk", sublabel: "Due date approaching", color: "text-warning border-warning/30 bg-warning/10", icon: AlertTriangle },
  missed: { label: "Missed", sublabel: "Goal not completed — stake charged", color: "text-danger border-danger/30 bg-danger/10", icon: XCircle },
  completed: { label: "Completed", sublabel: "Goal achieved", color: "text-success border-success/30 bg-success/10", icon: Target },
  rejected: { label: "Rejected", sublabel: "Goal not approved", color: "text-danger border-danger/30 bg-danger/10", icon: XCircle },
};

export function GoalCard({ title, category, target, progress, status, dueDate, stake, coachNotes, resubmissionCount, onResubmit }: GoalCardProps) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  const showProgress = status === "active" || status === "at_risk" || status === "completed";

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

      {/* Coach notes for revision_requested */}
      {status === "revision_requested" && coachNotes && (
        <div className="rounded-md bg-danger/5 border border-danger/20 p-3 mb-3">
          <p className="text-xs font-medium text-danger mb-1">Coach Feedback:</p>
          <p className="text-sm text-muted-foreground italic">{coachNotes}</p>
        </div>
      )}

      {showProgress && (
        <>
          <div className="w-full bg-secondary rounded-full h-2 mb-2">
            <div
              className={cn("h-2 rounded-full transition-all", {
                "bg-gradient-gold": status === "active" || status === "completed",
                "bg-warning": status === "at_risk",
              })}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{progress}% complete</span>
            <span className="font-medium text-foreground">${stake} stake</span>
          </div>
        </>
      )}

      {!showProgress && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{cfg.sublabel}</span>
          <span className="font-medium text-foreground">${stake} stake</span>
        </div>
      )}

      {status === "revision_requested" && onResubmit && (
        <button
          onClick={onResubmit}
          className="mt-3 w-full text-sm font-medium text-primary hover:text-primary/80 border border-primary/30 rounded-md py-1.5 transition-colors"
        >
          Revise & Resubmit
        </button>
      )}

      {resubmissionCount !== undefined && resubmissionCount > 0 && (
        <p className="text-xs text-muted-foreground mt-2">Resubmitted {resubmissionCount} time{resubmissionCount > 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

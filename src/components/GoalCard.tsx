import { cn } from "@/lib/utils";
import { Target, TrendingUp, AlertTriangle, XCircle, Clock, Edit3, CheckCircle, FileCheck, Upload, Shield } from "lucide-react";
import type { GoalStatus } from "@/lib/mockData";
import { BreachFeeBadge } from "@/components/BreachFeeBadge";

interface GoalCardProps {
  title: string;
  category: string;
  target: string;
  progress: number;
  status: GoalStatus;
  dueDate: string;
  stake: number;
  coachNotes?: string;
  coachVerificationNote?: string;
  resubmissionCount?: number;
  proofDescription?: string;
  selfCompleted?: boolean;
  selfAssessment?: "completed" | "not_completed";
  coachDecision?: "verified" | "waived" | "missed" | null;
  onResubmit?: () => void;
  onSubmitProof?: () => void;
}

const statusConfig: Record<GoalStatus, { label: string; sublabel: string; color: string; icon: typeof Target }> = {
  pending_approval: { label: "Pending", sublabel: "Waiting on coach review", color: "text-warning border-warning/30 bg-warning/10", icon: Clock },
  revision_requested: { label: "Revision", sublabel: "Coach has requested changes", color: "text-danger border-danger/30 bg-danger/10", icon: Edit3 },
  active: { label: "Active", sublabel: "Approved and stake is live", color: "text-success border-success/30 bg-success/10", icon: CheckCircle },
  at_risk: { label: "At Risk", sublabel: "Due date approaching", color: "text-warning border-warning/30 bg-warning/10", icon: AlertTriangle },
  missed: { label: "Missed", sublabel: "Goal not completed — stake charged", color: "text-danger border-danger/30 bg-danger/10", icon: XCircle },
  completed: { label: "Completed", sublabel: "Goal achieved", color: "text-success border-success/30 bg-success/10", icon: Target },
  rejected: { label: "Rejected", sublabel: "Goal not approved", color: "text-danger border-danger/30 bg-danger/10", icon: XCircle },
  proof_pending: { label: "Proof Pending", sublabel: "Due date reached — submit your proof", color: "text-primary border-primary/30 bg-primary/10", icon: Upload },
  proof_submitted: { label: "Proof Submitted", sublabel: "Awaiting coach verification", color: "text-primary border-primary/30 bg-primary/10", icon: FileCheck },
  waived: { label: "Waived", sublabel: "Stake waived by coach", color: "text-primary border-primary/30 bg-primary/10", icon: Shield },
};

export function GoalCard({
  title, category, target, progress, status, dueDate, stake,
  coachNotes, coachVerificationNote, resubmissionCount, proofDescription,
  selfCompleted, selfAssessment, coachDecision, onResubmit, onSubmitProof,
}: GoalCardProps) {
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
        <div className="flex items-center gap-2">
          {(status === "at_risk" || status === "missed" || status === "proof_pending") && <BreachFeeBadge />}
          <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border", cfg.color)}>
            <Icon size={12} /> {cfg.label}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-3">Target: {target}</p>

      {/* Coach notes for revision_requested */}
      {status === "revision_requested" && coachNotes && (
        <div className="rounded-md bg-danger/5 border border-danger/20 p-3 mb-3">
          <p className="text-xs font-medium text-danger mb-1">Coach Feedback:</p>
          <p className="text-sm text-muted-foreground italic">{coachNotes}</p>
        </div>
      )}

      {/* Coach verification note */}
      {coachVerificationNote && (status === "completed" || status === "missed" || status === "waived") && (
        <div className={cn("rounded-md border p-3 mb-3",
          status === "completed" ? "bg-success/5 border-success/20" :
          status === "waived" ? "bg-primary/5 border-primary/20" :
          "bg-danger/5 border-danger/20"
        )}>
          <p className={cn("text-xs font-medium mb-1",
            status === "completed" ? "text-success" :
            status === "waived" ? "text-primary" :
            "text-danger"
          )}>Coach Note:</p>
          <p className="text-sm text-muted-foreground italic">{coachVerificationNote}</p>
        </div>
      )}

      {/* Proof submitted info */}
      {status === "proof_submitted" && proofDescription && (
        <div className="rounded-md bg-primary/5 border border-primary/20 p-3 mb-3">
          <p className="text-xs font-medium text-primary mb-1">Your Proof:</p>
          <p className="text-sm text-muted-foreground italic">{proofDescription}</p>
          {(selfAssessment || selfCompleted !== undefined) && (
            <p className="text-xs mt-1 text-muted-foreground">
              Self-assessment: {(selfAssessment === "completed" || selfCompleted) ? "✓ Completed" : "✗ Not completed"}
            </p>
          )}
        </div>
      )}

      {/* Proof pending prompt */}
      {status === "proof_pending" && (
        <div className="rounded-md bg-primary/5 border border-primary/20 p-3 mb-3">
          <p className="text-sm text-foreground font-medium">Your goal has reached its due date.</p>
          <p className="text-xs text-muted-foreground mt-1">Submit your proof of completion below.</p>
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

      {status === "proof_pending" && onSubmitProof && (
        <button
          onClick={onSubmitProof}
          className="mt-3 w-full text-sm font-medium bg-gradient-gold text-primary-foreground font-bold rounded-md py-2 hover:opacity-90 transition-opacity"
        >
          Submit Completion Proof
        </button>
      )}

      {resubmissionCount !== undefined && resubmissionCount > 0 && (
        <p className="text-xs text-muted-foreground mt-2">Resubmitted {resubmissionCount} time{resubmissionCount > 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

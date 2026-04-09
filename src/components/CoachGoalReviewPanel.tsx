import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Edit3, XCircle, Target } from "lucide-react";
import { toast } from "sonner";
import type { Goal } from "@/lib/mockData";

interface CoachGoalReviewPanelProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onAction: (goalId: string, action: "approved" | "revision_requested" | "rejected", notes?: string) => void;
}

export function CoachGoalReviewPanel({ goal, open, onClose, onAction }: CoachGoalReviewPanelProps) {
  const [revisionNote, setRevisionNote] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!goal) return null;

  const handleApprove = () => {
    onAction(goal.id, "approved");
    toast.success(`Goal "${goal.title}" approved. Client notified — stake is now active.`);
    onClose();
  };

  const handleRevision = () => {
    if (!revisionNote.trim()) {
      toast.error("Please explain what needs to change");
      return;
    }
    onAction(goal.id, "revision_requested", revisionNote);
    toast.success(`Revision requested for "${goal.title}". Client notified.`);
    setRevisionNote("");
    setShowRevisionInput(false);
    onClose();
  };

  const handleReject = () => {
    if (!rejectNote.trim()) {
      toast.error("Please explain the rejection reason");
      return;
    }
    onAction(goal.id, "rejected", rejectNote);
    toast.success(`Goal "${goal.title}" rejected. Client notified.`);
    setRejectNote("");
    setShowRejectInput(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Target size={20} className="text-primary" /> Goal Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Goal details */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Goal Title</p>
              <p className="font-display font-semibold text-foreground">{goal.title}</p>
            </div>
            {goal.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Description</p>
                <p className="text-sm text-foreground">{goal.description}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Metric</p>
                <p className="text-sm text-foreground">{goal.metricType} — {goal.targetValue}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Target</p>
                <p className="text-sm text-foreground">{goal.target}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</p>
                <p className="text-sm text-foreground">{goal.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Stake</p>
                <p className="text-sm font-semibold text-foreground">${goal.stake}</p>
              </div>
              {goal.proofRequirement && (
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Proof Required</p>
                  <p className="text-sm text-foreground">{goal.proofRequirement}</p>
                </div>
              )}
            </div>
          </div>

          {/* Client context */}
          {goal.clientName && (
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Client Context</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{goal.clientName}</p>
                  <p className="text-xs text-muted-foreground">{goal.clientType} Coaching</p>
                </div>
                {goal.clientScore !== undefined && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Performance Score</p>
                    <p className={`text-lg font-bold ${goal.clientScore >= 80 ? "text-success" : goal.clientScore >= 60 ? "text-warning" : "text-danger"}`}>
                      {goal.clientScore}
                    </p>
                  </div>
                )}
              </div>
              {goal.resubmissionCount > 0 && (
                <p className="text-xs text-warning mt-2">Resubmitted {goal.resubmissionCount} time{goal.resubmissionCount > 1 ? "s" : ""}</p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <Button onClick={handleApprove} className="w-full bg-success hover:bg-success/90 text-success-foreground">
              <CheckCircle size={16} /> Approve Goal
            </Button>

            {!showRevisionInput ? (
              <Button onClick={() => { setShowRevisionInput(true); setShowRejectInput(false); }} variant="outline" className="w-full border-warning text-warning hover:bg-warning/10">
                <Edit3 size={16} /> Request Revision
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-warning">What needs to change? *</Label>
                <Textarea
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="This goal needs a clearer metric. Instead of 'work out more,' define the exact frequency and duration so we can score it fairly."
                  className="border-warning/30"
                />
                <div className="flex gap-2">
                  <Button onClick={handleRevision} size="sm" className="bg-warning text-warning-foreground hover:bg-warning/90 flex-1">
                    Send Revision Request
                  </Button>
                  <Button onClick={() => { setShowRevisionInput(false); setRevisionNote(""); }} size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {!showRejectInput ? (
              <Button onClick={() => { setShowRejectInput(true); setShowRevisionInput(false); }} variant="ghost" className="w-full text-danger hover:text-danger hover:bg-danger/10 text-xs">
                <XCircle size={14} /> Reject Goal
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-danger">Rejection reason *</Label>
                <Textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="This goal is not appropriate for the coaching system because..."
                  className="border-danger/30"
                />
                <div className="flex gap-2">
                  <Button onClick={handleReject} size="sm" className="bg-danger text-danger-foreground hover:bg-danger/90 flex-1">
                    Confirm Rejection
                  </Button>
                  <Button onClick={() => { setShowRejectInput(false); setRejectNote(""); }} size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

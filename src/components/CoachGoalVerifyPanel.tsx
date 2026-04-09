import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, FileCheck, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Goal } from "@/lib/mockData";

interface CoachGoalVerifyPanelProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onAction: (goalId: string, action: "completed" | "missed", note?: string) => void;
}

export function CoachGoalVerifyPanel({ goal, open, onClose, onAction }: CoachGoalVerifyPanelProps) {
  const [missNote, setMissNote] = useState("");
  const [overrideNote, setOverrideNote] = useState("");
  const [showMissInput, setShowMissInput] = useState(false);

  if (!goal) return null;

  const handleComplete = () => {
    onAction(goal.id, "completed", overrideNote || undefined);
    toast.success(`"${goal.title}" marked as completed. Client notified.`);
    resetAndClose();
  };

  const handleMiss = () => {
    if (!missNote.trim()) {
      toast.error("Please add a note explaining the decision");
      return;
    }
    onAction(goal.id, "missed", missNote);
    toast.success(`"${goal.title}" marked as missed. Stake charge triggered. Client notified.`);
    resetAndClose();
  };

  const resetAndClose = () => {
    setMissNote("");
    setOverrideNote("");
    setShowMissInput(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileCheck size={20} className="text-primary" /> Verify Goal Completion
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Goal details */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Goal</p>
              <p className="font-display font-semibold text-foreground">{goal.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Target</p>
                <p className="text-sm text-foreground">{goal.target}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Metric</p>
                <p className="text-sm text-foreground">{goal.metricType} — {goal.targetValue}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Due Date</p>
                <p className="text-sm text-foreground">{goal.dueDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Stake</p>
                <p className="text-sm font-semibold text-foreground">${goal.stake}</p>
              </div>
            </div>
          </div>

          {/* Client context */}
          {goal.clientName && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">{goal.clientName}</p>
                <p className="text-xs text-muted-foreground">{goal.clientType} Coaching</p>
              </div>
              {goal.clientScore !== undefined && (
                <p className={`text-lg font-bold ${goal.clientScore >= 80 ? "text-success" : goal.clientScore >= 60 ? "text-warning" : "text-danger"}`}>
                  {goal.clientScore}
                </p>
              )}
            </div>
          )}

          {/* Submitted proof */}
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">Client's Submitted Proof</p>
            <p className="text-sm text-foreground">{goal.proofDescription || "No description provided"}</p>

            {goal.selfCompleted !== undefined && (
              <p className="text-xs text-muted-foreground">
                Self-assessment: <span className={goal.selfCompleted ? "text-success font-medium" : "text-danger font-medium"}>
                  {goal.selfCompleted ? "✓ Claims completed" : "✗ Self-reported as not completed"}
                </span>
              </p>
            )}

            {goal.proofFileUrl && (
              <a href={goal.proofFileUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                <ExternalLink size={12} /> View uploaded evidence
              </a>
            )}

            {goal.proofSubmittedAt && (
              <p className="text-xs text-muted-foreground">Submitted: {goal.proofSubmittedAt}</p>
            )}
          </div>

          {/* Override note */}
          <div>
            <Label>Coach Note (optional — visible to client)</Label>
            <Textarea
              value={overrideNote}
              onChange={(e) => setOverrideNote(e.target.value)}
              placeholder="Add context about this verification..."
              className="mt-1.5"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <Button onClick={handleComplete} className="w-full bg-success hover:bg-success/90 text-success-foreground">
              <CheckCircle size={16} /> Mark Completed
            </Button>

            {!showMissInput ? (
              <Button onClick={() => setShowMissInput(true)} variant="ghost" className="w-full text-danger hover:text-danger hover:bg-danger/10">
                <XCircle size={16} /> Mark Missed
              </Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-danger">Why is this goal being marked as missed? *</Label>
                <Textarea
                  value={missNote}
                  onChange={(e) => setMissNote(e.target.value)}
                  placeholder="The proof submitted does not demonstrate the goal target was met because..."
                  className="border-danger/30"
                  rows={3}
                />
                <div className="rounded-md bg-danger/5 border border-danger/20 p-3">
                  <p className="text-xs text-danger">This will trigger a $75 stake charge and schedule a Pattern Call within 7 days.</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleMiss} size="sm" className="bg-danger text-danger-foreground hover:bg-danger/90 flex-1">
                    Confirm — Mark Missed
                  </Button>
                  <Button onClick={() => { setShowMissInput(false); setMissNote(""); }} size="sm" variant="ghost">Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

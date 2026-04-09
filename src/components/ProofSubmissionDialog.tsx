import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, FileCheck } from "lucide-react";
import { toast } from "sonner";
import type { Goal } from "@/lib/mockData";

interface ProofSubmissionDialogProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (goalId: string, data: { description: string; selfCompleted: boolean; file?: File }) => void;
}

export function ProofSubmissionDialog({ goal, open, onClose, onSubmit }: ProofSubmissionDialogProps) {
  const [description, setDescription] = useState("");
  const [selfCompleted, setSelfCompleted] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  if (!goal) return null;

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error("Please describe what you accomplished");
      return;
    }

    if (!selfCompleted) {
      // Auto-miss flow
      onSubmit(goal.id, { description, selfCompleted: false, file: file ?? undefined });
      toast.info("Goal marked as not completed. Stake charge and Pattern Call will be scheduled.");
      resetAndClose();
      return;
    }

    onSubmit(goal.id, { description, selfCompleted: true, file: file ?? undefined });
    toast.success("Proof submitted — awaiting coach verification.");
    resetAndClose();
  };

  const resetAndClose = () => {
    setDescription("");
    setSelfCompleted(true);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetAndClose(); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileCheck size={20} className="text-primary" /> Submit Completion Proof
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Goal context */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <p className="font-display font-semibold text-foreground">{goal.title}</p>
            <p className="text-sm text-muted-foreground mt-1">Target: {goal.target}</p>
            {goal.proofRequirement && (
              <p className="text-xs text-muted-foreground mt-1">Proof required: {goal.proofRequirement}</p>
            )}
            <p className="text-xs font-medium text-foreground mt-2">${goal.stake} accountability stake</p>
          </div>

          {/* Self-assessment */}
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {selfCompleted ? "I completed this goal" : "I did not complete this goal"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selfCompleted
                  ? "Your proof will be reviewed by your coach"
                  : "Stake will be charged and a Pattern Call scheduled"}
              </p>
            </div>
            <Switch checked={selfCompleted} onCheckedChange={setSelfCompleted} />
          </div>

          {!selfCompleted && (
            <div className="rounded-md bg-danger/5 border border-danger/20 p-3">
              <p className="text-sm text-danger font-medium">Missed Goal Flow</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your $75 stake will be charged and a 30-minute Pattern Call will be scheduled within 7 days
                to identify the behavioral patterns behind the miss.
              </p>
            </div>
          )}

          {/* Description */}
          <div>
            <Label>{selfCompleted ? "Describe what you accomplished *" : "What happened? *"}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={selfCompleted
                ? "Explain how you met your goal target, with specific details..."
                : "Describe what prevented you from completing this goal..."
              }
              className="mt-1.5"
              rows={4}
            />
          </div>

          {/* File upload */}
          {selfCompleted && (
            <div>
              <Label>Supporting Evidence (optional)</Label>
              <div className="mt-1.5 border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/40 transition-colors">
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  id="proof-upload"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label htmlFor="proof-upload" className="cursor-pointer">
                  <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                  {file ? (
                    <p className="text-sm text-foreground font-medium">{file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">Click to upload screenshot, document, or photo</p>
                      <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          <Button onClick={handleSubmit} variant={selfCompleted ? "hero" : "destructive"} className="w-full">
            {selfCompleted ? "Submit Proof for Verification" : "Confirm — Mark as Missed"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

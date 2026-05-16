import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, FileCheck, Download, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Goal } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface CoachGoalVerifyPanelProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onAction: (goalId: string, action: "verified" | "waived" | "missed", note?: string) => void;
}

export function CoachGoalVerifyPanel({ goal, open, onClose, onAction }: CoachGoalVerifyPanelProps) {
  const [coachNote, setCoachNote] = useState("");
  const [showMissConfirm, setShowMissConfirm] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  if (!goal) return null;

  const fileUrls = goal.proofFileUrls || (goal.proofFileUrl ? [goal.proofFileUrl] : []);
  const isImageUrl = (url: string) => /\.(jpg|jpeg|png|gif|webp)/i.test(url) || url.includes("unsplash");
  const isPdfUrl = (url: string) => /\.pdf/i.test(url);

  const handleVerify = () => {
    onAction(goal.id, "verified", coachNote || undefined);
    toast.success(`"${goal.title}" verified as complete. Client notified.`);
    resetAndClose();
  };

  const handleWaive = () => {
    if (!coachNote.trim()) {
      toast.error("A note is required when waiving the stake - the client needs context.");
      return;
    }
    onAction(goal.id, "waived", coachNote);
    toast.success(`"${goal.title}" stake waived. Client notified.`);
    resetAndClose();
  };

  const handleMissClick = () => {
    if (!coachNote.trim()) {
      toast.error("Please add a note explaining the decision before marking as missed.");
      return;
    }
    setShowMissConfirm(true);
  };

  const confirmMiss = () => {
    onAction(goal.id, "missed", coachNote);
    toast.success(`"${goal.title}" marked as missed. Stake charge triggered.`);
    setShowMissConfirm(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setCoachNote("");
    setShowMissConfirm(false);
    setExpandedImage(null);
    onClose();
  };

  return (
    <>
      <Dialog open={open && !showMissConfirm && !expandedImage} onOpenChange={(v) => { if (!v) resetAndClose(); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <FileCheck size={20} className="text-primary" /> Verify Goal Completion
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-5 gap-6 mt-2">
            {/* Left - Evidence */}
            <div className="md:col-span-3 space-y-4">
              {/* Goal details */}
              <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Goal</p>
                  <p className="font-display font-semibold text-foreground">{goal.title}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground">Metric:</span>{" "}
                    <span className="text-foreground">{goal.metricType} - {goal.targetValue}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Target:</span>{" "}
                    <span className="text-foreground">{goal.target}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Due:</span>{" "}
                    <span className="text-foreground">{goal.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Stake:</span>{" "}
                    <span className="font-semibold text-foreground">${goal.stake}</span>
                  </div>
                </div>
                {goal.proofRequirement && (
                  <div className="pt-1 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">Proof required:</span>{" "}
                    <span className="text-sm text-foreground">{goal.proofRequirement}</span>
                  </div>
                )}
              </div>

              {/* Self-assessment badge */}
              <div className={cn(
                "inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full",
                goal.selfAssessment === "completed" || goal.selfCompleted
                  ? "bg-success/10 text-success"
                  : "bg-danger/10 text-danger"
              )}>
                {goal.selfAssessment === "completed" || goal.selfCompleted
                  ? <><CheckCircle size={14} /> Client says completed</>
                  : <><XCircle size={14} /> Client self-reported missed</>
                }
              </div>

              {/* Client's description */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-2">Client's Description</p>
                <blockquote className="text-sm text-foreground border-l-2 border-primary/30 pl-3 italic">
                  {goal.proofDescription || "No description provided"}
                </blockquote>
                {goal.proofSubmittedAt && (
                  <p className="text-xs text-muted-foreground mt-2">Submitted: {goal.proofSubmittedAt}</p>
                )}
              </div>

              {/* Uploaded files */}
              {fileUrls.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Uploaded Evidence ({fileUrls.length} file{fileUrls.length > 1 ? "s" : ""})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {fileUrls.map((url, i) =>
                      isImageUrl(url) ? (
                        <div key={i} className="relative group cursor-pointer" onClick={() => setExpandedImage(url)}>
                          <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-32 object-cover rounded-lg border border-border" />
                          <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <span className="text-xs font-medium text-foreground">Click to expand</span>
                          </div>
                        </div>
                      ) : isPdfUrl(url) ? (
                        <div key={i} className="flex items-center gap-2 rounded-lg border border-border p-3 bg-secondary/30">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                            <ExternalLink size={14} className="text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">Document {i + 1}</p>
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                              View Full Document
                            </a>
                          </div>
                          <a href={url} download className="text-muted-foreground hover:text-foreground">
                            <Download size={14} />
                          </a>
                        </div>
                      ) : (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-border p-3 bg-secondary/30 hover:border-primary/30 transition-colors">
                          <Download size={14} className="text-muted-foreground" />
                          <span className="text-sm text-primary hover:underline">View file {i + 1}</span>
                        </a>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right - Context + Actions */}
            <div className="md:col-span-2 space-y-4">
              {/* Client context */}
              {goal.clientName && (
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <p className="text-sm font-medium text-foreground">{goal.clientName}</p>
                  <p className="text-xs text-muted-foreground">{goal.clientType} Coaching</p>
                  {goal.clientScore !== undefined && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Performance Score</p>
                      <p className={cn("text-2xl font-bold", goal.clientScore >= 80 ? "text-success" : goal.clientScore >= 60 ? "text-warning" : "text-danger")}>
                        {goal.clientScore}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Coach note */}
              <div>
                <Label className="text-sm">Add a note to the client (optional)</Label>
                <Textarea
                  value={coachNote}
                  onChange={(e) => setCoachNote(e.target.value)}
                  placeholder="This note will be visible to the client alongside your decision."
                  className="mt-1.5"
                  rows={3}
                />
              </div>

              {/* Decision buttons */}
              <div className="space-y-2 pt-2">
                <Button onClick={handleVerify} className="w-full bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle size={16} /> Verify Complete
                </Button>
                <Button onClick={handleWaive} variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                  <Shield size={16} /> Waive Stake
                </Button>
                <Button onClick={handleMissClick} variant="ghost" className="w-full text-danger hover:text-danger hover:bg-danger/10">
                  <XCircle size={16} /> Mark Missed
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image lightbox */}
      <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent className="sm:max-w-2xl p-2">
          {expandedImage && (
            <img src={expandedImage} alt="Evidence" className="w-full rounded-lg" />
          )}
        </DialogContent>
      </Dialog>

      {/* Miss confirmation modal */}
      <Dialog open={showMissConfirm} onOpenChange={(v) => { if (!v) setShowMissConfirm(false); }}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-2">
            <AlertTriangle size={40} className="mx-auto text-danger" />
            <h3 className="font-display font-semibold text-lg text-foreground">Confirm - Mark Missed</h3>
            <p className="text-sm text-muted-foreground">
              This will charge the client <span className="font-semibold text-foreground">${goal.stake}</span> and enroll them in the monthly Reset Session. This cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowMissConfirm(false)} variant="outline" className="flex-1">
                Go back
              </Button>
              <Button onClick={confirmMiss} className="flex-1 bg-danger hover:bg-danger/90 text-danger-foreground">
                Confirm - Mark Missed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

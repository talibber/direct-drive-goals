import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CloudUpload, FileCheck, X, FileText, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Goal } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface ProofSubmissionDialogProps {
  goal: Goal | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (goalId: string, data: { description: string; selfAssessment: "completed" | "not_completed"; files: File[] }) => void;
}

export function ProofSubmissionDialog({ goal, open, onClose, onSubmit }: ProofSubmissionDialogProps) {
  const [description, setDescription] = useState("");
  const [selfAssessment, setSelfAssessment] = useState<"completed" | "not_completed" | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showMissConfirm, setShowMissConfirm] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const MAX_FILES = 3;
    const MAX_SIZE = 10 * 1024 * 1024;
    const ACCEPTED = ["image/jpeg", "image/png", "application/pdf", "image/heic"];
    const arr = Array.from(incoming);
    const valid: File[] = [];
    setFiles((prev) => {
      for (const f of arr) {
        if (prev.length + valid.length >= MAX_FILES) {
          toast.error(`Maximum ${MAX_FILES} files allowed`);
          break;
        }
        if (f.size > MAX_SIZE) {
          toast.error(`${f.name} exceeds 10MB limit`);
          continue;
        }
        if (!ACCEPTED.includes(f.type) && !f.name.toLowerCase().endsWith(".heic")) {
          toast.error(`${f.name} is not a supported file type`);
          continue;
        }
        valid.push(f);
      }
      return [...prev, ...valid];
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  if (!goal) return null;

  const MAX_FILES = 3;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ACCEPTED = ["image/jpeg", "image/png", "application/pdf", "image/heic"];

  const addFiles = (incoming: FileList | File[]) => {
    const arr = Array.from(incoming);
    const valid: File[] = [];
    for (const f of arr) {
      if (files.length + valid.length >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`);
        break;
      }
      if (f.size > MAX_SIZE) {
        toast.error(`${f.name} exceeds 10MB limit`);
        continue;
      }
      if (!ACCEPTED.includes(f.type) && !f.name.toLowerCase().endsWith(".heic")) {
        toast.error(`${f.name} is not a supported file type`);
        continue;
      }
      valid.push(f);
    }
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [files]
  );

  const handleSubmit = () => {
    if (!description.trim()) {
      toast.error("Please describe what you accomplished");
      return;
    }
    if (!selfAssessment) {
      toast.error("Please select your self-assessment");
      return;
    }
    if (selfAssessment === "not_completed") {
      setShowMissConfirm(true);
      return;
    }
    submitProof();
  };

  const submitProof = () => {
    onSubmit(goal.id, { description, selfAssessment: selfAssessment!, files });
    toast.success("Your proof has been submitted. Your coach will review and verify within 48 hours.");
    resetAndClose();
  };

  const confirmMiss = () => {
    onSubmit(goal.id, { description, selfAssessment: "not_completed", files });
    toast.info("Goal marked as not completed. Your $75 accountability stake will be charged and a Pattern Call will be scheduled.");
    setShowMissConfirm(false);
    resetAndClose();
  };

  const resetAndClose = () => {
    setDescription("");
    setSelfAssessment(null);
    setFiles([]);
    setShowMissConfirm(false);
    setDragOver(false);
    onClose();
  };

  const isImage = (f: File) => f.type.startsWith("image/");

  return (
    <>
      <Dialog open={open && !showMissConfirm} onOpenChange={(v) => { if (!v) resetAndClose(); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <FileCheck size={20} className="text-primary" /> Submit Completion Proof
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 mt-2">
            {/* Goal context */}
            <div className="rounded-lg border border-border bg-secondary/30 p-4">
              <p className="font-display font-semibold text-foreground">{goal.title}</p>
              <p className="text-sm text-muted-foreground mt-1">Target: {goal.target}</p>
              {goal.proofRequirement && (
                <p className="text-xs text-muted-foreground mt-1">Proof required: {goal.proofRequirement}</p>
              )}
              <p className="text-xs font-medium text-foreground mt-2">${goal.stake} accountability stake</p>
            </div>

            {/* Description */}
            <div>
              <Label className="text-sm font-medium">How did you complete this goal? *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Be specific. What did you do, when did you do it, and how do you know it counts?"
                className="mt-1.5"
                rows={4}
              />
            </div>

            {/* File upload */}
            <div>
              <Label className="text-sm font-medium">Upload your proof</Label>
              <p className="text-xs text-muted-foreground mt-0.5 mb-2">
                Photo, screenshot, document, or PDF. Max 10MB per file. Up to 3 files.
              </p>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ""; }}
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf,.heic"
                  multiple
                />
                <CloudUpload size={28} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {dragOver ? "Drop files here" : "Drag & drop or click to browse"}
                </p>
              </div>

              {/* File previews */}
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-md border border-border bg-secondary/30 p-2">
                      {isImage(f) ? (
                        <img
                          src={URL.createObjectURL(f)}
                          alt={f.name}
                          className="w-10 h-10 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <FileText size={18} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{f.name}</p>
                        <p className="text-xs text-muted-foreground">{(f.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="text-muted-foreground hover:text-danger">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Self-assessment radio cards */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Self-assessment *</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelfAssessment("completed")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all text-center",
                    selfAssessment === "completed"
                      ? "border-success bg-success/5"
                      : "border-border hover:border-success/40"
                  )}
                >
                  <CheckCircle size={24} className={selfAssessment === "completed" ? "text-success" : "text-muted-foreground"} />
                  <span className={cn("text-sm font-medium", selfAssessment === "completed" ? "text-success" : "text-foreground")}>
                    I completed this goal
                  </span>
                </button>
                <button
                  onClick={() => setSelfAssessment("not_completed")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all text-center",
                    selfAssessment === "not_completed"
                      ? "border-danger bg-danger/5"
                      : "border-border hover:border-danger/40"
                  )}
                >
                  <XCircle size={24} className={selfAssessment === "not_completed" ? "text-danger" : "text-muted-foreground"} />
                  <span className={cn("text-sm font-medium", selfAssessment === "not_completed" ? "text-danger" : "text-foreground")}>
                    I did not complete this goal
                  </span>
                </button>
              </div>
            </div>

            <Button onClick={handleSubmit} variant="hero" className="w-full">
              Submit for Coach Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Miss confirmation modal */}
      <Dialog open={showMissConfirm} onOpenChange={(v) => { if (!v) setShowMissConfirm(false); }}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-2">
            <AlertTriangle size={40} className="mx-auto text-warning" />
            <h3 className="font-display font-semibold text-lg text-foreground">Are you sure?</h3>
            <p className="text-sm text-muted-foreground">
              Submitting this will trigger your <span className="font-semibold text-foreground">${goal.stake} accountability stake</span> and schedule a Pattern Call with your coach.
            </p>
            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowMissConfirm(false)} variant="outline" className="flex-1">
                Go back
              </Button>
              <Button onClick={confirmMiss} className="flex-1 bg-danger hover:bg-danger/90 text-danger-foreground">
                Yes, I missed it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle } from "lucide-react";

const ROOT_CAUSES = [
  "I didn't prioritize it",
  "Life happened — unexpected circumstance",
  "The goal was too aggressive",
  "I avoided it on purpose",
  "I didn't have the skills or knowledge",
  "I lacked accountability mid-month",
  "I started strong then lost momentum",
  "I'm not sure — I need to figure this out",
] as const;

export interface MissedGoalReportData {
  goalId: string;
  rootCauseCategory: string;
  fullExplanation: string;
  isFamiliarPattern: boolean;
  patternDescription: string | null;
  nextCommitment: string;
}

interface MissedGoalReportModalProps {
  open: boolean;
  goalTitle: string;
  goalTarget: string;
  goalId: string;
  onSubmit: (data: MissedGoalReportData) => void;
}

export function MissedGoalReportModal({ open, goalTitle, goalTarget, goalId, onSubmit }: MissedGoalReportModalProps) {
  const [rootCause, setRootCause] = useState<string>("");
  const [explanation, setExplanation] = useState("");
  const [isFamiliar, setIsFamiliar] = useState<boolean | null>(null);
  const [patternDesc, setPatternDesc] = useState("");
  const [commitment, setCommitment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!rootCause) e.rootCause = "Select a root cause.";
    if (explanation.length < 50) e.explanation = `Minimum 50 characters (${explanation.length}/50).`;
    if (isFamiliar === null) e.familiar = "Select one.";
    if (isFamiliar === false && !patternDesc.trim()) {
      // patternDesc only required if familiar
    }
    if (isFamiliar && !patternDesc.trim()) e.pattern = "Describe the pattern.";
    if (!commitment.trim()) e.commitment = "Required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      goalId,
      rootCauseCategory: rootCause,
      fullExplanation: explanation,
      isFamiliarPattern: isFamiliar!,
      patternDescription: isFamiliar ? patternDesc : null,
      nextCommitment: commitment,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Dialog open={true}>
        <DialogContent className="max-w-lg border-2 border-primary bg-card [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <AlertTriangle className="text-primary" size={28} />
            </div>
            <p className="font-display font-bold text-lg text-foreground">Submitted.</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your $75 stake has been charged. You're enrolled in this month's Reset Session. Your response will inform the session — without attribution.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary bg-card [&>button]:hidden" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="font-display text-xl font-bold text-foreground">Goal Missed — Tell Me Why</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This isn't punishment. This is data. Be honest — it will be addressed in the Reset Session.
            </p>
          </div>

          {/* Goal info */}
          <div className="rounded-md border border-border bg-background p-4">
            <p className="text-sm font-semibold text-foreground">{goalTitle}</p>
            <p className="text-xs text-muted-foreground">Target: {goalTarget}</p>
          </div>

          {/* Field 1 — Root cause */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">What was the real reason?</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ROOT_CAUSES.map((cause) => (
                <button
                  key={cause}
                  onClick={() => setRootCause(cause)}
                  className={`text-left text-sm p-3 rounded-md border transition-colors ${
                    rootCause === cause
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {cause}
                </button>
              ))}
            </div>
            {errors.rootCause && <p className="text-xs text-danger mt-1">{errors.rootCause}</p>}
          </div>

          {/* Field 2 — Explanation */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Say more. What actually happened?</label>
            <Textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Don't summarize. Tell me the real story."
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground mt-1">{explanation.length}/50 minimum</p>
            {errors.explanation && <p className="text-xs text-danger mt-1">{errors.explanation}</p>}
          </div>

          {/* Field 3 — Pattern recognition */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">Is this the first time this pattern has shown up for you?</label>
            <div className="flex gap-3">
              <button
                onClick={() => setIsFamiliar(false)}
                className={`flex-1 text-sm p-3 rounded-md border transition-colors ${
                  isFamiliar === false ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                Yes, this is new
              </button>
              <button
                onClick={() => setIsFamiliar(true)}
                className={`flex-1 text-sm p-3 rounded-md border transition-colors ${
                  isFamiliar === true ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"
                }`}
              >
                No, this is familiar
              </button>
            </div>
            {errors.familiar && <p className="text-xs text-danger mt-1">{errors.familiar}</p>}
            {isFamiliar && (
              <div className="mt-3">
                <label className="text-xs font-medium text-muted-foreground block mb-1">Where else does this pattern show up in your life?</label>
                <Textarea
                  value={patternDesc}
                  onChange={(e) => setPatternDesc(e.target.value)}
                  placeholder="Describe the pattern..."
                  className="min-h-[60px]"
                />
                {errors.pattern && <p className="text-xs text-danger mt-1">{errors.pattern}</p>}
              </div>
            )}
          </div>

          {/* Field 4 — Commitment */}
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">What specifically will be different next month?</label>
            <Textarea
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              placeholder="Be specific. This becomes your Reset Session pre-work."
              className="min-h-[80px]"
            />
            {errors.commitment && <p className="text-xs text-danger mt-1">{errors.commitment}</p>}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
          >
            Submit and Accept the Stake
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

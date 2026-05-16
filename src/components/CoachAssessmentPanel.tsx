import { useState } from "react";
import { Brain, Zap, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AssessmentData {
  discType: "D" | "I" | "S" | "C";
  discScores: Record<string, number>;
  executionPlanning: number;
  executionConsistency: number;
  executionMotivation: number;
  executionRisk: number;
  completedAt: string;
  coachNotes?: string;
}

const discDescriptions: Record<string, { title: string; summary: string }> = {
  D: { title: "Dominance", summary: "Direct, results-oriented, and decisive. Thrives with control and measurable progress." },
  I: { title: "Influence", summary: "Social, optimistic, and persuasive. Thrives in collaborative environments." },
  S: { title: "Steadiness", summary: "Patient, reliable, and consistent. Values stability and follow-through." },
  C: { title: "Conscientiousness", summary: "Analytical, precise, and quality-driven. Values accuracy and preparation." },
};

const executionLabels: Record<string, { low: string; high: string }> = {
  planning: { low: "Action-First", high: "Planner" },
  consistency: { low: "Sprint & Crash", high: "Steady Operator" },
  motivation: { low: "External Fuel", high: "Self-Driven" },
  risk: { low: "Risk-Averse", high: "Risk-Tolerant" },
};

// Mock data for demo
const mockAssessment: AssessmentData = {
  discType: "D",
  discScores: { D: 72, I: 45, S: 30, C: 53 },
  executionPlanning: 35,
  executionConsistency: 40,
  executionMotivation: 70,
  executionRisk: 65,
  completedAt: "Mar 5, 2026",
  coachNotes: "",
};

export function CoachAssessmentPanel({ clientId }: { clientId?: string }) {
  const [notes, setNotes] = useState(mockAssessment.coachNotes || "");
  const [saved, setSaved] = useState(false);
  const data = mockAssessment;

  const execScores: Record<string, number> = {
    planning: data.executionPlanning,
    consistency: data.executionConsistency,
    motivation: data.executionMotivation,
    risk: data.executionRisk,
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* DISC */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Brain size={16} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">DISC Profile</h3>
          <span className="ml-auto text-xs text-muted-foreground">Completed {data.completedAt}</span>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center">
            <span className="font-display text-2xl font-black text-primary">{data.discType}</span>
          </div>
          <div>
            <p className="font-display font-bold text-foreground">{discDescriptions[data.discType].title}</p>
            <p className="text-sm text-muted-foreground">{discDescriptions[data.discType].summary}</p>
          </div>
        </div>

        <div className="grid gap-2.5">
          {(["D", "I", "S", "C"] as const).map(t => (
            <div key={t} className="flex items-center gap-3">
              <span className={cn("w-5 text-xs font-bold", t === data.discType ? "text-primary" : "text-muted-foreground")}>{t}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full">
                <div
                  className={cn("h-full rounded-full", t === data.discType ? "bg-primary" : "bg-muted-foreground/40")}
                  style={{ width: `${data.discScores[t]}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{data.discScores[t]}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Style */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-primary" />
          <h3 className="font-display font-semibold text-foreground">Execution Style</h3>
        </div>

        <div className="grid gap-4">
          {Object.entries(executionLabels).map(([dim, labels]) => {
            const score = execScores[dim] || 50;
            return (
              <div key={dim}>
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className={score < 50 ? "text-primary" : "text-muted-foreground"}>{labels.low}</span>
                  <span className={score >= 50 ? "text-primary" : "text-muted-foreground"}>{labels.high}</span>
                </div>
                <div className="relative h-2.5 bg-secondary rounded-full">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-border" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-primary-foreground shadow-sm"
                    style={{ left: `calc(${score}% - 7px)` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Coach Notes */}
      <div className="rounded-lg border border-primary/30 bg-card p-5 shadow-card">
        <h3 className="font-display font-semibold text-foreground mb-1">Coaching approach notes - private</h3>
        <p className="text-xs text-muted-foreground mb-3">Record how you plan to adapt your style for this client based on their results.</p>
        <Textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g. High D - be direct, skip small talk. Action-biased so front-load accountability structure..."
          className="min-h-[100px] mb-3"
        />
        <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
          <Save size={14} /> {saved ? "Saved ✓" : "Save Notes"}
        </Button>
      </div>
    </div>
  );
}

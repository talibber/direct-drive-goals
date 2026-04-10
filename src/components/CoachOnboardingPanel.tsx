import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { UserPlus, Check, AlertTriangle, Send, Mic } from "lucide-react";

interface OnboardingClient {
  id: string;
  name: string;
  email: string;
  daysSinceApproval: number;
  steps: { name: string; complete: boolean; active: boolean; stuckHours: number }[];
}

const mockOnboardingClients: OnboardingClient[] = [
  {
    id: "new-1",
    name: "Jordan Mitchell",
    email: "jordan@example.com",
    daysSinceApproval: 1,
    steps: [
      { name: "Approved", complete: true, active: false, stuckHours: 0 },
      { name: "Assessments", complete: false, active: true, stuckHours: 12 },
      { name: "Onboarding Call", complete: false, active: false, stuckHours: 0 },
      { name: "First Goals", complete: false, active: false, stuckHours: 0 },
      { name: "First Check-In", complete: false, active: false, stuckHours: 0 },
      { name: "Coach Note", complete: false, active: false, stuckHours: 0 },
    ],
  },
  {
    id: "new-2",
    name: "Priya Desai",
    email: "priya@example.com",
    daysSinceApproval: 4,
    steps: [
      { name: "Approved", complete: true, active: false, stuckHours: 0 },
      { name: "Assessments", complete: true, active: false, stuckHours: 0 },
      { name: "Onboarding Call", complete: true, active: false, stuckHours: 0 },
      { name: "First Goals", complete: false, active: true, stuckHours: 52 },
      { name: "First Check-In", complete: false, active: false, stuckHours: 0 },
      { name: "Coach Note", complete: false, active: false, stuckHours: 0 },
    ],
  },
];

export function CoachOnboardingPanel() {
  const clients = mockOnboardingClients;
  if (clients.length === 0) return null;

  return (
    <div className="rounded-lg border border-primary/30 bg-card p-5 shadow-card mb-8">
      <h3 className="font-display font-semibold text-foreground mb-1 flex items-center gap-2">
        <UserPlus size={18} className="text-primary" />
        New Clients — Onboarding
        <span className="ml-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
          {clients.length}
        </span>
      </h3>
      <p className="text-xs text-muted-foreground mb-4">Clients in their 7-day onboarding window.</p>

      <div className="space-y-4">
        {clients.map(client => {
          const activeStep = client.steps.find(s => s.active);
          const isStuck = activeStep && activeStep.stuckHours > 48;
          const completedCount = client.steps.filter(s => s.complete).length;

          return (
            <div key={client.id} className={cn(
              "rounded-lg border p-4",
              isStuck ? "border-warning/50 bg-warning/5" : "border-border"
            )}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Link to={`/coach/clients/${client.id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
                    {client.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Day {client.daysSinceApproval} of 7
                    {isStuck && (
                      <span className="inline-flex items-center gap-1 ml-2 text-warning font-medium">
                        <AlertTriangle size={10} /> Stuck {activeStep.stuckHours}h on "{activeStep.name}"
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Mic size={10} /> Voice Note
                  </button>
                  <Link
                    to="/coach/messages"
                    className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-md bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Send size={10} /> Message
                  </Link>
                </div>
              </div>

              {/* Step progress dots */}
              <div className="flex items-center gap-1">
                {client.steps.map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold relative",
                      step.complete
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : step.active
                        ? "bg-warning/20 text-warning border border-warning/40"
                        : "bg-muted/40 text-muted-foreground/30 border border-border"
                    )}
                      title={step.name}
                    >
                      {step.complete ? <Check size={10} /> : i}
                      {step.active && (
                        <span className="absolute inset-0 rounded-full border border-warning animate-ping opacity-20" />
                      )}
                    </div>
                    {i < client.steps.length - 1 && (
                      <div className={cn(
                        "w-3 h-0.5 mx-0.5",
                        step.complete ? "bg-primary/40" : "bg-border"
                      )} />
                    )}
                  </div>
                ))}
                <span className="text-[10px] text-muted-foreground ml-2">
                  {completedCount}/{client.steps.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

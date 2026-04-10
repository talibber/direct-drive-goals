import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Check, Lock, ExternalLink } from "lucide-react";

export interface OnboardingStep {
  id: string;
  day: number;
  title: string;
  description: string;
  link?: string;
  status: "complete" | "active" | "locked";
  completedAt?: string;
}

export type CoachingTrack = "life" | "business";

const lifeSteps: OnboardingStep[] = [
  {
    id: "s0",
    day: 0,
    title: "Application approved — welcome in.",
    description: "",
    status: "complete",
    completedAt: "Apr 3, 2026",
  },
  {
    id: "s1",
    day: 1,
    title: "Complete your assessments",
    description: "8 minutes. Your coach reviews these before your onboarding call.",
    link: "/onboarding/assessment",
    status: "complete",
    completedAt: "Apr 4, 2026",
  },
  {
    id: "s2",
    day: 1,
    title: "Schedule your onboarding call",
    description: "20 minutes. We level set expectations and answer your questions.",
    status: "active",
  },
  {
    id: "s3",
    day: 3,
    title: "Set your first goals",
    description: "1-3 goals. Measurable. Time-bound. Stakes active after coach approval.",
    link: "/dashboard/goals",
    status: "locked",
  },
  {
    id: "s4",
    day: 5,
    title: "Complete your first check-in",
    description: "Even if it's early. Starting the habit now matters.",
    link: "/dashboard/check-in",
    status: "locked",
  },
  {
    id: "s5",
    day: 7,
    title: "Listen to your first coach note",
    description: "Your coach has reviewed your data and has something to say.",
    status: "locked",
  },
];

const businessSteps: OnboardingStep[] = [
  {
    id: "b0",
    day: 0,
    title: "Welcome to Business Track.",
    description: "",
    status: "complete",
    completedAt: "Apr 3, 2026",
  },
  {
    id: "b1",
    day: 1,
    title: "Complete your assessments",
    description: "8 minutes. Same assessments, framed through a business lens.",
    link: "/onboarding/assessment?track=business",
    status: "active",
  },
  {
    id: "b2",
    day: 1,
    title: "Schedule your initial call",
    description: "45 minutes. We review your business, your current challenges, and calibrate the system to where you actually are.",
    status: "locked",
  },
  {
    id: "b3",
    day: 3,
    title: "Set your first business goals",
    description: "What are the 1-3 things that, if you actually did them this month, would move your business forward in a way you'd feel?",
    link: "/dashboard/goals",
    status: "locked",
  },
  {
    id: "b4",
    day: 5,
    title: "Complete your first check-in",
    description: "Business track check-in unlocks.",
    link: "/dashboard/check-in",
    status: "locked",
  },
  {
    id: "b5",
    day: 7,
    title: "Your first coach voice note",
    description: "Your coach has reviewed your assessment and initial call notes and has something to say.",
    status: "locked",
  },
];

interface OnboardingChecklistProps {
  track?: CoachingTrack;
}

export function OnboardingChecklist({ track = "life" }: OnboardingChecklistProps) {
  const steps = track === "business" ? businessSteps : lifeSteps;
  const allComplete = steps.every(s => s.status === "complete");
  if (allComplete) return null;

  const title = track === "business"
    ? "Your Business Track starts here."
    : "Your first 7 days.";

  const subtitle = track === "business"
    ? "Seven days to get the system calibrated to your business. Move fast — your stake is active after your first goal is approved."
    : "Complete these in order. The system gets better the more honest you are from the start.";

  return (
    <div className="rounded-xl border-2 border-primary/30 bg-card p-6 md:p-8 shadow-card mb-8">
      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
        {title}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {subtitle}
      </p>

      <div className="space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={step.id} className="flex gap-4">
              {/* Timeline column */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 flex-shrink-0 relative",
                  step.status === "complete"
                    ? "border-primary bg-primary/20 text-primary"
                    : step.status === "active"
                    ? "border-warning bg-warning/10 text-warning"
                    : "border-muted-foreground/30 bg-muted/20 text-muted-foreground/40"
                )}>
                  {step.status === "complete" ? (
                    <Check size={16} />
                  ) : step.status === "locked" ? (
                    <Lock size={12} />
                  ) : (
                    <span>{step.day}</span>
                  )}
                  {step.status === "active" && (
                    <span className="absolute inset-0 rounded-full border-2 border-warning animate-ping opacity-30" />
                  )}
                </div>
                {!isLast && (
                  <div className={cn(
                    "w-0.5 flex-1 min-h-[24px]",
                    step.status === "complete" ? "bg-primary/40" : "bg-border"
                  )} />
                )}
              </div>

              {/* Content */}
              <div className={cn("pb-6", isLast && "pb-0")}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                    step.status === "complete"
                      ? "bg-primary/10 text-primary"
                      : step.status === "active"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground/50"
                  )}>
                    Day {step.day}
                  </span>
                  {step.status === "complete" && step.completedAt && (
                    <span className="text-[10px] text-muted-foreground">✓ {step.completedAt}</span>
                  )}
                </div>
                <p className={cn(
                  "text-sm font-semibold mt-1",
                  step.status === "complete"
                    ? "text-foreground"
                    : step.status === "active"
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}>
                  {step.link && step.status === "active" ? (
                    <Link to={step.link} className="hover:text-primary transition-colors flex items-center gap-1.5">
                      {step.title} <ExternalLink size={12} />
                    </Link>
                  ) : (
                    step.title
                  )}
                </p>
                {step.description && (
                  <p className={cn(
                    "text-xs mt-0.5 leading-relaxed",
                    step.status === "locked" ? "text-muted-foreground/30" : "text-muted-foreground"
                  )}>
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

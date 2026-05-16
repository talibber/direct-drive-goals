import { Link } from "react-router-dom";
import { ArrowRight, Upload, CalendarCheck, MessageSquare, AlertTriangle, Eye } from "lucide-react";
import { BreachFeeBadge } from "@/components/BreachFeeBadge";

type Move = {
  title: string;
  goalName?: string;
  due?: string;
  status?: string;
  proofRequirement?: string;
  ctaLabel: string;
  ctaHref: string;
  icon: typeof Upload;
  stakeAtRisk?: boolean;
};

interface Props { move?: Move | null }

const DEFAULT_MOVE: Move = {
  title: "Complete this week's check-in",
  goalName: "Weekly Check-In",
  due: "Sunday 11:59pm",
  status: "Due now",
  ctaLabel: "Complete Check-In",
  ctaHref: "/dashboard/check-in",
  icon: CalendarCheck,
  stakeAtRisk: true,
};

export function YourNextMove({ move }: Props) {
  const m = move ?? DEFAULT_MOVE;
  const Icon = m.icon;
  return (
    <div className="mb-6 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-5 md:p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-md bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.15em] text-primary font-bold mb-1">Your next move</p>
            <h2 className="font-display text-lg md:text-xl font-bold text-foreground">{m.title}</h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
              {m.goalName && <span><b className="text-foreground/80">Goal:</b> {m.goalName}</span>}
              {m.due && <span><b className="text-foreground/80">Due:</b> {m.due}</span>}
              {m.status && <span><b className="text-foreground/80">Status:</b> {m.status}</span>}
              {m.proofRequirement && <span><b className="text-foreground/80">Proof:</b> {m.proofRequirement}</span>}
              {m.stakeAtRisk && <BreachFeeBadge label="$75 at stake" />}
            </div>
          </div>
        </div>
        <Link
          to={m.ctaHref}
          className="inline-flex items-center gap-2 rounded-md bg-gradient-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {m.ctaLabel} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export { Upload, CalendarCheck, MessageSquare, AlertTriangle, Eye };

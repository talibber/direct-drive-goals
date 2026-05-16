import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  label?: string;
}

export function BreachFeeBadge({ className, label = "$75" }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-xs font-mono font-semibold text-primary cursor-help",
            className,
          )}
          aria-label="Potential breach fee"
        >
          {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        Potential $75 breach fee applies if this commitment is missed without an approved update. The purpose is urgency, not punishment. All breach fees go to the Breach Review Queue for coach approval - nothing is charged automatically.
      </TooltipContent>
    </Tooltip>
  );
}

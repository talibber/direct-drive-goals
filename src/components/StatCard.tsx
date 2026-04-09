import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, change, trend, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-5 shadow-card", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && <Icon size={16} className="text-muted-foreground" />}
      </div>
      <div className="text-2xl font-display font-bold text-foreground">{value}</div>
      {change && (
        <span className={cn("text-xs font-medium mt-1 inline-block", {
          "text-success": trend === "up",
          "text-danger": trend === "down",
          "text-muted-foreground": trend === "neutral",
        })}>
          {change}
        </span>
      )}
    </div>
  );
}

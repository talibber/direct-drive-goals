import { cn } from "@/lib/utils";

export type ClientTypeFilter = "all" | "real" | "demo";

export function ClientTypeToggle({ value, onChange }: { value: ClientTypeFilter; onChange: (v: ClientTypeFilter) => void }) {
  const opts: { id: ClientTypeFilter; label: string }[] = [
    { id: "all", label: "Show All" },
    { id: "real", label: "Real Clients" },
    { id: "demo", label: "Demo Clients" },
  ];
  return (
    <div className="inline-flex gap-1 rounded-md border border-border bg-card p-1">
      {opts.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "px-3 py-1 text-xs font-medium rounded transition-colors",
            value === o.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

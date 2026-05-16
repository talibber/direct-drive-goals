import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { clients } from "@/lib/mockData";

// Mock: identify clients whose last coach activity is >7 days old
const staleClients = [
  { id: "3", name: "David L.", lastActivityDaysAgo: 9, lastAction: "Check-in review" },
];

export function CoachStaleActivityAlert() {
  if (staleClients.length === 0) return null;

  return (
    <div className="rounded-lg border border-warning/30 bg-warning/5 p-5 mb-8">
      <h3 className="font-display font-semibold text-foreground mb-1 flex items-center gap-2">
        <AlertTriangle size={18} className="text-warning" />
        Clients Needing Attention
        <span className="ml-1 text-xs font-bold bg-warning text-warning-foreground rounded-full w-5 h-5 flex items-center justify-center">
          {staleClients.length}
        </span>
      </h3>
      <p className="text-xs text-muted-foreground mb-3">No coach activity in 7+ days.</p>
      <div className="space-y-2">
        {staleClients.map(c => (
          <div key={c.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div>
              <Link to={`/coach/clients/${c.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                {c.name}
              </Link>
              <p className="text-xs text-muted-foreground">Last: {c.lastAction} - {c.lastActivityDaysAgo} days ago</p>
            </div>
            <span className="text-xs font-medium text-warning">Review pending</span>
          </div>
        ))}
      </div>
    </div>
  );
}

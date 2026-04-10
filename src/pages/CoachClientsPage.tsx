import { Link } from "react-router-dom";
import { CoachLayout } from "@/components/CoachLayout";
import { clients } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

export default function CoachClientsPage() {
  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Clients</h1>
      <p className="text-muted-foreground mb-8">Manage your active clients.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-display font-semibold text-foreground">
                  <Link to={`/coach/clients/${c.id}`} className="hover:text-primary transition-colors">{c.name}</Link>
                </h3>
                <p className="text-xs text-muted-foreground">{c.email}</p>
              </div>
              {c.risk && (
                <span className="text-xs font-medium px-2 py-1 rounded-full text-warning border border-warning/30 bg-warning/10">
                  At Risk
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div>
                <div className="text-lg font-bold text-foreground">{c.score}</div>
                <div className="text-xs text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{c.missedGoals}</div>
                <div className="text-xs text-muted-foreground">Missed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{c.type}</div>
                <div className="text-xs text-muted-foreground">Type</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Last check-in: {c.lastCheckIn}</p>
            <Button variant="secondary" size="sm" className="w-full">View Details</Button>
          </div>
        ))}
      </div>
    </CoachLayout>
  );
}

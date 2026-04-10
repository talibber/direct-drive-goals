import { useState } from "react";
import { Link } from "react-router-dom";
import { CoachLayout } from "@/components/CoachLayout";
import { clients } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const filterTabs = ["All Clients", "Life Track", "Business Track", "At Risk", "Missing Check-In"] as const;
type FilterTab = typeof filterTabs[number];

export default function CoachClientsPage() {
  const [filter, setFilter] = useState<FilterTab>("All Clients");

  const filtered = clients.filter((c) => {
    if (filter === "Life Track") return c.type === "Life";
    if (filter === "Business Track") return c.type === "Business";
    if (filter === "At Risk") return c.risk;
    if (filter === "Missing Check-In") return c.lastCheckIn.includes("5") || c.lastCheckIn.includes("8");
    return true;
  });

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Clients</h1>
      <p className="text-muted-foreground mb-6">Manage your active clients.</p>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
              filter === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div key={c.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-display font-semibold text-foreground">
                    <Link to={`/coach/clients/${c.id}`} className="hover:text-primary transition-colors">{c.name}</Link>
                  </h3>
                  <span className={cn(
                    "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full",
                    c.type === "Business"
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground/10 text-foreground"
                  )}>
                    {c.type === "Business" ? "BT" : "LT"}
                  </span>
                </div>
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
                <div className="text-xs text-muted-foreground">Track</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Last check-in: {c.lastCheckIn}</p>
            <Link to={`/coach/clients/${c.id}`}>
              <Button variant="secondary" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">No clients match this filter.</p>
        )}
      </div>
    </CoachLayout>
  );
}

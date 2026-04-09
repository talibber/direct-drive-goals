import { DashboardLayout } from "@/components/DashboardLayout";
import { coachNotes } from "@/lib/mockData";

export default function SessionsPage() {
  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Session Recaps</h1>
      <p className="text-muted-foreground mb-8">Coach notes and session summaries.</p>

      <div className="space-y-4">
        {coachNotes.map((n, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">TC</div>
              <div>
                <p className="text-sm font-medium text-foreground">Coach Note</p>
                <p className="text-xs text-muted-foreground">{n.date}, 2026</p>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{n.note}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}

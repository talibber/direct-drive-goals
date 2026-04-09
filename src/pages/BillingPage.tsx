import { DashboardLayout } from "@/components/DashboardLayout";
import { billingHistory } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Billing</h1>
      <p className="text-muted-foreground mb-8">Your subscription and accountability stake history.</p>

      {/* Subscription card */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-card mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="font-display text-xl font-bold text-foreground">Terrible Coaching — $99/mo</p>
          <p className="text-xs text-muted-foreground mt-1">Next billing: May 1, 2026</p>
        </div>
        <Badge className="bg-success/10 text-success border-success/30">Active</Badge>
      </div>

      {/* History */}
      <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">Charge History</h3>
        </div>
        <div className="divide-y divide-border">
          {billingHistory.map((b) => (
            <div key={b.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${b.type === "stake" ? "bg-danger" : "bg-success"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{b.description}</p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${b.type === "stake" ? "text-danger" : "text-foreground"}`}>
                  ${b.amount}
                </span>
                <p className="text-xs text-muted-foreground">{b.type === "stake" ? "Accountability Stake" : "Subscription"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

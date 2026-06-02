import { DashboardLayout } from "@/components/DashboardLayout";
import { billingHistory } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealClient } from "@/hooks/useRealClient";

export default function BillingPage() {
  const { profile } = useRealClient();
  const coachingTrack = (profile?.coaching_track as "life" | "business") ?? "life";
  const planName = coachingTrack === "business" ? "Operator Track" : "Life Track";
  const planPrice = coachingTrack === "business" ? 199 : 99;
  const stakesThisMonth = billingHistory.filter(b => b.type === "stake" && b.date.includes("Apr")).reduce((s, b) => s + b.amount, 0);
  const totalThisMonth = planPrice + stakesThisMonth;
  const status = profile?.subscription_status ?? "unprovisioned";
  const isPendingPayment = status === "pending_payment";

  return (
    <DashboardLayout coachingTrack={coachingTrack}>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Billing</h1>
      <p className="text-muted-foreground mb-8">Your subscription and commitment breach fee history.</p>

      {isPendingPayment && (
        <div className="rounded-lg border border-primary/40 bg-primary/[0.05] p-5 mb-6">
          <p className="font-display text-lg font-semibold mb-1">Complete payment to activate your account</p>
          <p className="text-sm text-muted-foreground mb-4">
            Your application has been accepted. Your coach will send a secure checkout link by email. Once payment clears,
            your dashboard unlocks automatically.
          </p>
          {/* TODO(payments): wire Stripe/Paddle checkout when secrets are configured.
              Webhook should flip profiles.subscription_status from pending_payment → active. */}
          <Button variant="outline" disabled className="cursor-not-allowed">Pay now (coming soon)</Button>
        </div>
      )}


      {/* Subscription card */}
      <div className="rounded-lg border border-border bg-card p-6 shadow-card mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Plan</p>
          <p className="font-display text-xl font-bold text-foreground">Terrible Coaching - {planName} - ${planPrice}/mo</p>
          <p className="text-xs text-muted-foreground mt-1">Next billing: May 1, 2026</p>
        </div>
        <Badge className={isPendingPayment ? "bg-warning/10 text-warning border-warning/30" : "bg-success/10 text-success border-success/30"}>
          {isPendingPayment ? "Payment required" : status === "active" ? "Active" : status}
        </Badge>
      </div>

      {/* Month summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Subscription</p>
          <p className="text-lg font-bold text-foreground">${planPrice}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Breach Fees This Month</p>
          <p className="text-lg font-bold text-danger">${stakesThisMonth}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total This Month</p>
          <p className="text-lg font-bold text-foreground">${totalThisMonth}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Payment Method</p>
          <p className="text-sm font-medium text-foreground">•••• 4242</p>
        </div>
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
                <p className="text-xs text-muted-foreground">{b.type === "stake" ? "Commitment Breach Fee" : "Subscription"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

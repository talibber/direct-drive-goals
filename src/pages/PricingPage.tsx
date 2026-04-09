import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, X } from "lucide-react";

const included = [
  "1-on-1 coaching (life + business)",
  "Weekly check-in system with performance scoring",
  "Up to 3 active goals per month",
  "Coach reviews and approves every goal",
  "Proof-based goal verification",
  "Direct coach notes and feedback",
  "Performance trend dashboards",
  "$75 accountability stake per missed goal",
  "Missed goal triggers a Pattern Call within 7 days",
  "Coach waiver option — judgment over automation",
  "Perfect Month triggers a Next Level Call",
  "Cancel anytime — no contracts",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Simple <span className="text-gradient-gold">Pricing</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              One plan. One price. Accountability included.
            </p>
          </div>

          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              One offer. No tiers. No upsells.
            </h2>
            <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
              We keep it simple because complexity is how coaching products hide their lack of results.
            </p>
          </div>

          <div className="rounded-xl border-2 border-primary/30 bg-card p-8 md:p-10 shadow-card animate-pulse-glow mx-auto max-w-lg">
            <div className="text-center mb-8">
              <div className="text-xs font-medium uppercase tracking-wider text-primary mb-2">Monthly Subscription</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-display text-5xl md:text-6xl font-bold text-gradient-gold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">+ $75 per missed goal (accountability stake)</p>
            </div>

            <ul className="space-y-3 mb-4">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            {/* Paired miss consequences */}
            <div className="ml-1 mb-8 flex gap-3">
              <div className="w-[3px] rounded-full bg-gradient-gold shrink-0" />
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground">$75 accountability stake per missed goal</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground">Missed goal triggers a Pattern Call — not just a charge</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-5 mb-8">
              <p className="text-base font-display font-bold text-foreground mb-1">
                Maximum monthly exposure: $225
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                ($99 subscription + up to 3 missed goal stakes at $75 each)
              </p>
              <p className="text-sm text-foreground/80 mt-2 font-medium">
                You'll never be charged more than this in a single month.
              </p>
            </div>

            <Link to="/apply" className="block">
              <Button variant="hero" size="lg" className="w-full text-base">
                Apply Now <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          {/* Accountability Stake explanation */}
          <div className="mt-16 max-w-xl mx-auto">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4 text-center">The Accountability Stake</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">Missing a goal isn't just a charge — it's a signal.</p>
              <p>
                When you miss a pre-agreed goal, two things happen: a $75 stake is charged to your payment method, and a Pattern Call is automatically scheduled with your coach.
              </p>
              <p>
                The Pattern Call is a focused 30-minute session built around one question: what's actually in the way?
              </p>
              <p>
                Not motivation. Not encouragement. A direct conversation about the pattern behind the miss — and a clear commitment for what changes next.
              </p>
              <p className="text-foreground font-medium">
                The stake creates urgency. The call creates insight. Together, they're why this works.
              </p>
            </div>
          </div>

          {/* Two outcomes callout */}
          <div className="mt-12 max-w-xl mx-auto rounded-xl border border-primary/30 bg-card p-6 md:p-8">
            <h4 className="font-display text-lg font-bold text-foreground text-center mb-6">Two outcomes. Both useful.</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-display font-semibold text-danger/80 mb-3">Miss a goal</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X size={14} className="text-danger/60 mt-0.5 shrink-0" />
                    $75 stake charged automatically
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X size={14} className="text-danger/60 mt-0.5 shrink-0" />
                    Pattern Call scheduled within 7 days
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <X size={14} className="text-danger/60 mt-0.5 shrink-0" />
                    Miss logged to your scorecard
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-display font-semibold text-primary mb-3">Hit your goals</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    Stake never charged
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    Streak continues
                  </li>
                  <li className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check size={14} className="text-primary mt-0.5 shrink-0" />
                    Score improves
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
      <Footer />
    </div>
  );
}

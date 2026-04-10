import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight, X, Sparkles } from "lucide-react";

const lifeFeatures = [
  "1-on-1 coaching (life + business)",
  "Weekly check-in system with performance scoring",
  "Up to 3 active goals per month",
  "Coach reviews and approves every goal",
  "Proof-based goal verification",
  "Direct coach notes and feedback",
  "Help Radar — flag challenges outside your goals and get direct coach perspective",
  "Performance trend dashboards",
  "Coach waiver option — judgment over automation",
  "Perfect Month triggers a Next Level Call",
  "Cancel anytime — no contracts",
];

const businessFeatures = [
  "Business-focused goal setting with coach approval",
  "Weekly check-in with business mindset questions",
  "Initial onboarding call to level set expectations",
  "Monthly Operator Community Call with guest professionals",
  "Direct messenger and voice note access — responses within 24hrs",
  "Business content library — mindset, decisions, leadership",
  "Operator networking thread — connect with peers directly",
  "Separate business cohort Reset Session",
  "Accountability stake system with proof verification",
  "Performance scorecard and weekly trend data",
  "Cancel anytime after 30 days",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-gradient-gold">Track</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Two tracks. Same accountability system. Pick the one that fits.
            </p>
          </div>

          {/* Two cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* LIFE TRACK */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 text-center">Life Track</p>
              <div className="rounded-xl border-2 border-primary/30 bg-card p-8 shadow-card h-full flex flex-col">
                <div className="text-center mb-8">
                  <div className="text-xs font-medium uppercase tracking-wider text-primary mb-2">Monthly Subscription</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-5xl font-bold text-gradient-gold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+ $75 per missed goal (accountability stake)</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {lifeFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-4 mb-6">
                  <p className="text-sm font-display font-bold text-foreground mb-1">
                    Maximum monthly exposure: $324
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ($99 subscription + up to 3 missed goal stakes at $75 each)
                  </p>
                </div>

                <Link to="/apply" className="block">
                  <Button variant="hero" size="lg" className="w-full text-base">
                    Apply Now <ArrowRight size={18} />
                  </Button>
                </Link>
                <p className="mt-4 text-[11px] text-muted-foreground/60 text-center leading-relaxed uppercase tracking-wider">
                  No refunds. No exceptions.<br />
                  By applying you agree to our coaching terms.<br />
                  Cancel anytime after your first 30 days.
                </p>
              </div>
            </div>

            {/* BUSINESS TRACK */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3 text-center">Business Track</p>
              <div className="rounded-xl border-2 border-primary/30 bg-card p-8 shadow-card h-full flex flex-col relative">
                {/* Badge */}
                <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> New
                </div>

                <div className="text-center mb-8">
                  <div className="text-xs font-medium uppercase tracking-wider text-primary mb-2">Monthly Subscription</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display text-5xl font-bold text-gradient-gold">$199</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">+ $75 per missed goal (accountability stake)</p>
                </div>

                <ul className="space-y-3 mb-6 flex-1">
                  {businessFeatures.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg border border-primary/30 bg-primary/[0.04] p-4 mb-6">
                  <p className="text-sm font-display font-bold text-foreground mb-1">
                    Maximum monthly exposure: $424
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    ($199 subscription + up to 3 missed goal stakes at $75 each)
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    You'll never be charged more than this in a single month.
                  </p>
                </div>

                <Link to="/apply?track=business" className="block">
                  <Button variant="hero" size="lg" className="w-full text-base">
                    Apply for Business Track <ArrowRight size={18} />
                  </Button>
                </Link>
                <p className="mt-4 text-[11px] text-muted-foreground/60 text-center leading-relaxed uppercase tracking-wider">
                  No refunds. No exceptions.<br />
                  By applying you agree to our coaching terms.<br />
                  Cancel anytime after your first 30 days.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison callout */}
          <div className="mt-12 rounded-xl border-2 border-primary/30 bg-card p-8 md:p-10">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground text-center mb-6">
              Not sure which track is right for you?
            </h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              <p>
                <span className="text-foreground font-medium">Life Track</span> is for anyone ready to build better habits, make clearer decisions, and keep the promises they make to themselves.
              </p>
              <p>
                <span className="text-foreground font-medium">Business Track</span> is for operators — people actively running a business who need a thinking partner, peer access, and real-time perspective on the decisions that matter.
              </p>
              <p className="text-foreground font-medium">
                Life Track builds the person. Business Track sharpens the operator. The accountability system is identical in both. The consequences are real in both. The only difference is who's in the room with you.
              </p>
            </div>
          </div>

          {/* Accountability Stake explanation */}
          <div className="mt-16 max-w-xl mx-auto">
            <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4 text-center">The Accountability Stake</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p className="text-foreground font-medium">Missing a goal isn't just a charge — it's a signal.</p>
              <p>
                When you miss a pre-agreed goal, two things happen: a $75 stake is charged to your payment method, and you're enrolled in the monthly Reset Session.
              </p>
              <p>
                The Reset Session is a group coaching call where common patterns get addressed — without attribution. No one is called out. Everyone benefits.
              </p>
              <p>
                Think of it like church. The sermon might be about you. You'll know. That's the point.
              </p>
              <p className="text-foreground font-medium">
                The stake creates urgency. The session creates insight. Together, they're why this works.
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
                    Enrolled in the monthly Reset Session
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

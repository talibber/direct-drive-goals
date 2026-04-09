import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

const included = [
  "1-on-1 coaching (life + business)",
  "Weekly check-in system with performance scoring",
  "Up to 3 active goals per month",
  "Direct coach notes and feedback",
  "Performance trend dashboards",
  "Accountability stake system",
  "Email notifications and reminders",
  "Cancel anytime—no contracts",
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

          <div className="rounded-xl border-2 border-primary/30 bg-card p-8 md:p-10 shadow-card animate-pulse-glow mx-auto max-w-lg">
            <div className="text-center mb-8">
              <div className="text-xs font-medium uppercase tracking-wider text-primary mb-2">Monthly Subscription</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="font-display text-5xl md:text-6xl font-bold text-gradient-gold">$99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">+ $75 per missed goal (accountability stake)</p>
            </div>

            <ul className="space-y-3 mb-8">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <Check className="text-primary flex-shrink-0 mt-0.5" size={16} />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <Link to="/apply" className="block">
              <Button variant="hero" size="lg" className="w-full text-base">
                Apply Now <ArrowRight size={18} />
              </Button>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <h3 className="font-display font-semibold text-foreground mb-2">The Accountability Stake</h3>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Each active goal carries a $75 stake. If you miss the goal by the due date, the stake 
              is automatically charged. This isn't a punishment—it's a commitment device. Research shows 
              that financial stakes dramatically increase follow-through. You can have 1–3 active goals 
              per month, meaning your maximum monthly stake exposure is $225.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Life Track",
    founding: "$99",
    standard: "$149",
    tagline: "For personal goals, routines, and discipline.",
    body: "60-minute initial call. Monthly goals. Weekly check-ins. Evidence tracking. Pod accountability. Unlimited in-app messaging. Access to the monthly Reset Call if needed.",
    badge: null,
    goldButton: false,
    href: "/apply?track=life",
    cta: "Apply for Life Track",
  },
  {
    name: "Operator Track",
    founding: "$199",
    standard: "$299",
    tagline: "For founders, creators, professionals, and builders.",
    body: "Everything in Life Track, plus operator-level goal design, business-focused feedback, sharper weekly review, and pod matching with other high-output members.",
    badge: "Most Popular",
    goldButton: false,
    href: "/apply?track=operator",
    cta: "Apply for Operator Track",
  },
  {
    name: "Direct",
    founding: "$1,000",
    standard: "$1,500–$2,500",
    tagline: "For the person who wants the coach, not just the system.",
    body: "Weekly 1-on-1 calls. Priority app review. Same-day response target. Pre-decision feedback. Deeper goal and performance review. Limited availability.",
    badge: "5 Founding Seats",
    goldButton: true,
    href: "/apply?track=direct",
    cta: "Apply for Direct",
  },
];

export default function PricingPreviewSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Three tracks. One standard.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Founding rates are limited. Standard rates apply after the founding cohort fills.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          All tracks include the $75 Commitment Breach Fee for missed check-ins, missing evidence, ghosting, or broken controllable commitments. Fee may be waived at coach discretion.
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 flex flex-col relative ${
                tier.goldButton
                  ? "border-primary/30 bg-primary/[0.04]"
                  : "border-border bg-card"
              }`}
            >
              {tier.badge && (
                <span className={`absolute -top-3 left-6 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  tier.badge === "5 Founding Seats"
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "bg-primary text-primary-foreground"
                }`}>
                  {tier.badge}
                </span>
              )}
              <h3 className="font-display text-lg font-bold text-foreground mb-2 mt-1">{tier.name}</h3>
              <div className="mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-display font-bold text-gradient-gold">{tier.founding}</span>
                  <span className="text-sm text-muted-foreground">/month founding</span>
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1">Standard: {tier.standard}/month</p>
              </div>
              <p className="text-sm font-medium text-foreground/80 mt-4 mb-2">{tier.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{tier.body}</p>
              <Link to={tier.href}>
                <Button
                  variant={tier.goldButton ? "hero" : "heroOutline"}
                  size="default"
                  className="w-full text-sm"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

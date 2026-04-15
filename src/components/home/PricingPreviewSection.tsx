import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const tiers = [
  {
    name: "Life Track",
    price: "$99",
    tagline: "The system. The community. The standard.",
    body: "Coaching call. Customized 30-60-90 goals. Weekly check-ins. Matched pod. Five coach touchpoints a month. For anyone ready to stop lying to themselves and move.",
    badge: null,
    goldButton: false,
  },
  {
    name: "Business Track",
    price: "$199",
    tagline: "Everything in Life Track plus a room full of operators.",
    body: "Monthly expert calls. Direct access to your coach. Peer networking. For people running something who need more than accountability — they need perspective from someone who gets the weight.",
    badge: "MOST POPULAR",
    goldButton: false,
  },
  {
    name: "Direct",
    price: "$1,000",
    tagline: "Weekly 1-on-1 calls. Same-day responses. Pre-decision feedback.",
    body: "For the person who wants the coach, not just the system. Five spots. That's it.",
    badge: "5 SPOTS",
    goldButton: true,
  },
];

export default function PricingPreviewSection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Three ways in. One standard.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The system is identical. The community is matched to your track. The access to me changes.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground mb-12">
          All tracks include $75 accountability fee per missed goal or missed check-in.
        </p>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 flex flex-col ${
                tier.goldButton
                  ? "border-primary/30 bg-primary/[0.04]"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-display text-lg font-bold text-foreground">{tier.name}</h3>
                {tier.badge && (
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    tier.badge === "5 SPOTS"
                      ? "text-primary border-primary/30 bg-primary/10 animate-pulse"
                      : "text-primary border-primary/30 bg-primary/10"
                  }`}>
                    {tier.badge}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-display font-bold text-gradient-gold">{tier.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm font-medium text-foreground/80 mb-2">{tier.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{tier.body}</p>
              <Link to="/pricing">
                <Button
                  variant={tier.goldButton ? "hero" : "heroOutline"}
                  size="default"
                  className="w-full text-sm"
                >
                  See full details
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

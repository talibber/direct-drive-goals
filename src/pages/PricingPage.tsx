import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHead } from "@/components/PageHead";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const lifeIncludes = [
  "60-minute initial coaching call",
  "Monthly goals built from your call",
  "Weekly check-ins with scoring",
  "Evidence-based goal verification",
  "Personality-matched accountability pod",
  "Unlimited in-app messaging",
  "Access to the monthly Reset Call if needed",
];

const operatorIncludes = [
  "Everything in Life Track",
  "Operator-level goal design",
  "Business-focused weekly review",
  "Pod of other high-output operators",
  "Monthly Operator Community Call",
  "Priority in-app messaging review",
];

const directIncludes = [
  "Everything in Operator Track",
  "Weekly 1-on-1 calls (30–45 min)",
  "Same-day messenger response target",
  "Pre-decision voice memo access",
  "Priority goal + evidence review",
  "Monthly private written recap",
];

type Row = { label: string; life: string; op: string; direct: string };
type Category = { name: string; rows: Row[] };

const comparison: Category[] = [
  {
    name: "The System",
    rows: [
      { label: "60-minute initial call", life: "✓", op: "✓", direct: "✓" },
      { label: "Monthly goals from coaching call", life: "✓", op: "✓", direct: "✓" },
      { label: "Weekly check-ins + scoring", life: "✓", op: "✓", direct: "✓" },
      { label: "Evidence-based verification", life: "✓", op: "✓", direct: "✓" },
      { label: "$75 Commitment Breach Fee", life: "✓", op: "✓", direct: "✓" },
      { label: "Performance scorecard", life: "✓", op: "✓", direct: "✓" },
      { label: "Business-focused goal design", life: "—", op: "✓", direct: "✓" },
    ],
  },
  {
    name: "The Community",
    rows: [
      { label: "Personality-matched pod", life: "✓", op: "✓", direct: "✓" },
      { label: "Community feed", life: "✓", op: "✓", direct: "✓" },
      { label: "Operator-only pod", life: "—", op: "✓", direct: "✓" },
      { label: "Operator networking directory", life: "—", op: "✓", direct: "✓" },
    ],
  },
  {
    name: "Coach Access",
    rows: [
      { label: "Unlimited in-app messaging", life: "✓", op: "✓", direct: "✓" },
      { label: "Response target", life: "Async", op: "Priority (biz days)", direct: "Same day" },
      { label: "Weekly 1-on-1 call", life: "—", op: "—", direct: "✓" },
      { label: "Pre-decision voice memo", life: "—", op: "—", direct: "✓" },
      { label: "Monthly private recap", life: "—", op: "—", direct: "✓" },
    ],
  },
  {
    name: "Limits",
    rows: [
      { label: "Client cap", life: "None", op: "None", direct: "5 founding seats" },
      { label: "Founding rate", life: "$99", op: "$199", direct: "$1,000" },
      { label: "Standard rate", life: "$149", op: "$299", direct: "$1,500–$2,500" },
    ],
  },
];

function Dot() {
  return <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />;
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 mb-6">
      {items.map(item => (
        <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
          <Dot />{item}
        </li>
      ))}
    </ul>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHead
        title="Pricing — Life Track $99, Operator Track $199, Direct $1,000"
        description="Founding pricing for Terrible Coaching. Monthly accountability coaching with weekly check-ins, evidence verification, and $75 commitment breach fees. No refunds after the initial call."
        path="/pricing"
      />
      <Navbar />

      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-6xl">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Three tracks. <span className="text-gradient-gold">One standard.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Founding rates are limited. Choose based on the access and pressure you actually need — not what sounds impressive.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">

            {/* LIFE */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">Life Track</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-gradient-gold">$99</span>
                <span className="text-sm text-muted-foreground">/mo founding</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Standard rate: $149/month</p>
              <p className="text-sm font-medium text-foreground/80 mb-5">For personal goals, routines, and discipline.</p>
              <FeatureList items={lifeIncludes} />
              <div className="mt-auto">
                <Link to="/apply?track=life" className="block">
                  <Button variant="heroOutline" size="lg" className="w-full text-sm">Apply for Life Track</Button>
                </Link>
              </div>
            </div>

            {/* OPERATOR */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Most Popular
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1 mt-2">Operator Track</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-gradient-gold">$199</span>
                <span className="text-sm text-muted-foreground">/mo founding</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Standard rate: $299/month</p>
              <p className="text-sm font-medium text-foreground/80 mb-5">For founders, creators, professionals, traders, and builders.</p>
              <FeatureList items={operatorIncludes} />
              <div className="mt-auto">
                <Link to="/apply?track=operator" className="block">
                  <Button variant="hero" size="lg" className="w-full text-sm">Apply for Operator Track</Button>
                </Link>
              </div>
            </div>

            {/* DIRECT */}
            <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-6 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full animate-pulse">
                5 Founding Seats
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1 mt-2">Direct</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-gradient-gold">$1,000</span>
                <span className="text-sm text-muted-foreground">/mo founding</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Standard rate: $1,500–$2,500/month</p>
              <p className="text-sm font-medium text-foreground/80 mb-5">For the person who wants direct access, not just the system.</p>
              <FeatureList items={directIncludes} />
              <div className="mt-auto">
                <Link to="/apply?track=direct" className="block">
                  <Button variant="hero" size="lg" className="w-full text-sm font-bold">Apply for Direct</Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center mt-2">Applications reviewed personally. Not everyone is accepted.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-20 max-w-3xl mx-auto leading-relaxed">
            All tracks include the $75 Commitment Breach Fee for missed check-ins, missing evidence, ghosting, or broken controllable commitments. Fee may be waived at coach discretion.
          </p>

          {/* Comparison */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold">Everything side by side.</h2>
              <p className="mt-2 text-muted-foreground">No hidden differences.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 text-muted-foreground font-medium w-[40%]" />
                    <th className="text-center py-3 px-3 text-foreground font-display font-bold">Life</th>
                    <th className="text-center py-3 px-3 text-foreground font-display font-bold">Operator</th>
                    <th className="text-center py-3 px-3 text-primary font-display font-bold">Direct</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((cat) => (
                    <>
                      <tr key={cat.name}>
                        <td colSpan={4} className="pt-6 pb-2">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/70">{cat.name}</span>
                        </td>
                      </tr>
                      {cat.rows.map((row, i) => (
                        <tr key={row.label} className={i % 2 === 0 ? "bg-secondary/20" : ""}>
                          <td className="py-2.5 pr-4 text-foreground/70">{row.label}</td>
                          <td className="py-2.5 px-3 text-center text-foreground/60">{row.life}</td>
                          <td className="py-2.5 px-3 text-center text-foreground/60">{row.op}</td>
                          <td className="py-2.5 px-3 text-center text-primary font-medium">{row.direct}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Commitment Breach Fee */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">The Commitment Breach Fee</h2>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                We do not charge you for honest failure. We charge when you breach the standard: a missed check-in, missing evidence by the deadline, ghosting the system, or a broken controllable commitment you agreed to.
              </p>
              <p>
                Missing an outcome you could not fully control is different. That gets reviewed — not automatically charged. The Reset Call exists to look at the pattern when a breach happens, not to punish you for ambition.
              </p>
            </div>
            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                I have the authority to waive any fee when life genuinely happens. But the default is that what you commit to here carries weight. The fee creates urgency. The pod creates daily visibility. The Reset creates insight. That combination is why this works.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="max-w-3xl mx-auto text-center border-t border-border pt-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pick your track. Apply today.</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We review every application personally. If you're a fit, you'll hear back within 48 hours. If you're not ready for this we'll tell you that too.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/apply?track=life">
                <Button variant="heroOutline" size="lg" className="text-sm px-8">Apply for Life Track</Button>
              </Link>
              <Link to="/apply?track=operator">
                <Button variant="heroOutline" size="lg" className="text-sm px-8">Apply for Operator Track</Button>
              </Link>
              <Link to="/apply?track=direct">
                <Button variant="hero" size="lg" className="text-sm px-8 font-bold">Apply for Direct</Button>
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
              Payments are non-refundable after the initial coaching call has been completed. You may cancel your subscription before your next billing cycle.
              <br />
              Terrible Coaching is not therapy, counseling, medical care, crisis care, diagnosis, or treatment.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/* ───────────── DATA ───────────── */

const lifeSystem = [
  "Weekly check-in with performance scoring",
  "1-3 goals per month — built from your coaching call",
  "Coach goal approval — vague goals get sent back",
  "Proof-based goal verification",
  "$75 accountability fee per miss",
  "Performance scorecard and trend tracking",
  "Help Radar — flag challenges outside your goals",
];

const lifeCommunity = [
  "Personality assessment and pod matching",
  "Accountability pod — 4-6 matched members",
  "Community feed — wins, questions, reflections",
  "Gamification — streaks, levels, badges",
];

const lifeCoach = [
  "Initial coaching call — real coaching, not onboarding",
  "Customized 30-60-90 day goal framework",
  "Weekly Q&A content — your questions answered",
  "Reset Session — monthly group for missed goals",
  "Achievement group — monthly for Perfect Months",
  "Monthly community call",
];

const bizSystem = [
  "Business mindset check-in questions",
  "Decision tracking — what you made, what you avoided, what fear cost you",
  "Business-focused goal categories",
  "Separate business cohort Reset Session",
];

const bizCommunity = [
  "Business Track pod — matched operators only",
  "Operator networking directory — connect directly with peers",
  "Business community feed — resources, wins, questions",
];

const bizCoach = [
  "Everything in Life Track touchpoints",
  "Monthly Operator Community Call with guest professionals",
  "Direct messenger — 24hr response",
  "Voice note access — 24hr response",
];

const directCoach = [
  "Weekly 1-on-1 call — 30-45 minutes",
  "Same-day messenger and voice note responses",
  "Pre-decision voice memo — perspective before you commit, not after",
  "Priority goal review within 4 hours",
  "Priority proof verification same day",
  "Monthly private written recap — my honest read on your patterns",
];

/* ───── Comparison table data ───── */
type Row = { label: string; life: string; biz: string; direct: string };
type Category = { name: string; rows: Row[] };

const comparison: Category[] = [
  {
    name: "The System",
    rows: [
      { label: "Weekly check-in and scoring", life: "✓", biz: "✓", direct: "✓" },
      { label: "Goals 1-3 per month from coaching call", life: "✓", biz: "✓", direct: "✓" },
      { label: "Coach goal approval", life: "✓", biz: "✓", direct: "✓" },
      { label: "Proof-based verification", life: "✓", biz: "✓", direct: "✓" },
      { label: "$75 accountability fee", life: "✓", biz: "✓", direct: "✓" },
      { label: "Performance scorecard", life: "✓", biz: "✓", direct: "✓" },
      { label: "Help Radar", life: "✓", biz: "✓", direct: "✓" },
      { label: "Business mindset check-in", life: "—", biz: "✓", direct: "✓" },
      { label: "Decision tracking", life: "—", biz: "✓", direct: "✓" },
    ],
  },
  {
    name: "The Community",
    rows: [
      { label: "Personality assessment", life: "✓", biz: "✓", direct: "✓" },
      { label: "Matched accountability pod", life: "✓", biz: "✓", direct: "✓" },
      { label: "Community feed", life: "✓", biz: "✓", direct: "✓" },
      { label: "Gamification", life: "✓", biz: "—", direct: "—" },
      { label: "Business operator pod", life: "—", biz: "✓", direct: "✓" },
      { label: "Operator networking directory", life: "—", biz: "✓", direct: "✓" },
    ],
  },
  {
    name: "Coach Touchpoints",
    rows: [
      { label: "Initial coaching call", life: "✓", biz: "✓", direct: "✓" },
      { label: "Customized 30-60-90 goal framework", life: "✓", biz: "✓", direct: "✓" },
      { label: "Weekly Q&A content", life: "✓", biz: "✓", direct: "✓" },
      { label: "Reset Session monthly", life: "✓", biz: "✓", direct: "✓" },
      { label: "Achievement group monthly", life: "✓", biz: "✓", direct: "✓" },
      { label: "Monthly community call", life: "✓", biz: "✓", direct: "✓" },
      { label: "Operator Community Call", life: "—", biz: "✓", direct: "✓" },
      { label: "Guest professionals monthly", life: "—", biz: "✓", direct: "✓" },
    ],
  },
  {
    name: "Direct Access",
    rows: [
      { label: "Messenger access", life: "—", biz: "✓", direct: "✓" },
      { label: "Voice note access", life: "—", biz: "✓", direct: "✓" },
      { label: "Response window", life: "—", biz: "24hrs", direct: "Same day" },
      { label: "Message limit", life: "—", biz: "8/month", direct: "None" },
      { label: "Weekly 1-on-1 call", life: "—", biz: "—", direct: "✓" },
      { label: "Pre-decision voice memo", life: "—", biz: "—", direct: "✓" },
      { label: "Monthly private recap", life: "—", biz: "—", direct: "✓" },
      { label: "Priority review", life: "—", biz: "—", direct: "✓" },
    ],
  },
  {
    name: "Limits",
    rows: [
      { label: "Client cap", life: "None", biz: "None", direct: "5 max" },
      { label: "Max monthly exposure", life: "$324", biz: "$424", direct: "$1,225" },
    ],
  },
];

/* ───── Gold dot bullet component ───── */
function Dot() {
  return <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />;
}

function FeatureGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-primary/70 mb-3">{title}</p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-foreground/80">
            <Dot />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────── PAGE ───────────── */

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-6xl">

          {/* ─── HEADER ─── */}
          <div className="text-center mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              The system. The community. <span className="text-gradient-gold">The standard.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three tracks. One accountability framework. Choose based on what you need — not what sounds impressive.
            </p>
          </div>

          {/* ─── POSITIONING CARDS ─── */}
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5 mb-6">
            {[
              { name: "Life Track", text: "The system holds you accountable. Your pod holds you daily. Your coach shows up five ways a month." },
              { name: "Business Track", text: "Everything in Life Track. Plus operators who understand what you're carrying. Plus direct access when the decision can't wait." },
              { name: "Direct", text: "Everything in Business Track. Plus the coach, directly, weekly, same day." },
            ].map((c) => (
              <div key={c.name} className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-2">{c.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-lg font-display font-bold text-gradient-gold italic mb-16">
            The mirror is the same at every tier. The distance changes.
          </p>

          {/* ─── THREE PRICING CARDS ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">

            {/* LIFE TRACK */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1">Life Track</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-gradient-gold">$99</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">+ $75 per missed goal or missed check-in</p>
              <p className="text-sm font-medium text-foreground/80 mb-6">For anyone ready to move.</p>

              <FeatureGroup title="The System" items={lifeSystem} />
              <FeatureGroup title="The Community" items={lifeCommunity} />
              <FeatureGroup title="Your Coach — 5 Touchpoints" items={lifeCoach} />

              <div className="mt-auto pt-4">
                <Link to="/apply?track=life" className="block mb-3">
                  <Button variant="heroOutline" size="lg" className="w-full text-sm">Apply for Life Track</Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center">Maximum: $324 ($99 + up to 3 fees at $75)</p>
              </div>
            </div>

            {/* BUSINESS TRACK */}
            <div className="rounded-xl border border-border bg-card p-6 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
                Most Popular
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-1 mt-2">Business Track</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-gradient-gold">$199</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">+ $75 per missed goal or missed check-in</p>
              <p className="text-sm font-medium text-foreground/80 mb-6">For operators running something.</p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-4">Everything in Life Track plus:</p>
              <FeatureGroup title="The System" items={bizSystem} />
              <FeatureGroup title="The Community" items={bizCommunity} />
              <FeatureGroup title="Your Coach — Expanded Access" items={bizCoach} />

              <div className="mt-auto pt-4">
                <Link to="/apply?track=business" className="block mb-3">
                  <Button variant="hero" size="lg" className="w-full text-sm">Apply for Business Track</Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center">Maximum: $424 ($199 + up to 3 fees at $75)</p>
              </div>
            </div>

            {/* DIRECT */}
            <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Direct</p>
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary border border-primary/30 bg-primary/10 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  5 Spots
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">3 of 5 spots remaining</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display text-4xl font-bold text-gradient-gold">$1,000</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">+ $75 per missed goal or missed check-in</p>
              <p className="text-sm font-medium text-foreground/80 mb-6">For the person who wants the coach, not just the system.</p>

              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground/50 mb-4">Everything in Business Track plus:</p>
              <FeatureGroup title="Direct Coach Access" items={directCoach} />

              <div className="mt-auto pt-4">
                <Link to="/apply?track=direct" className="block mb-3">
                  <Button variant="hero" size="lg" className="w-full text-sm font-bold">Apply for Direct</Button>
                </Link>
                <p className="text-[10px] text-muted-foreground text-center mb-2">Applications reviewed personally. Not everyone is accepted.</p>
                <p className="text-[10px] text-muted-foreground text-center">Maximum: $1,225 ($1,000 + up to 3 fees at $75)</p>
              </div>
            </div>
          </div>

          {/* ─── COMPARISON TABLE ─── */}
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
                    <th className="text-center py-3 px-3 text-foreground font-display font-bold">Business</th>
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
                          <td className="py-2.5 px-3 text-center text-foreground/60">{row.biz}</td>
                          <td className="py-2.5 px-3 text-center text-primary font-medium">{row.direct}</td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ─── ACCOUNTABILITY FEE ─── */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">The Accountability Fee</h2>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                We make decisions on good data. If you don't update the system — your check-ins, your goals, your progress — then I don't have what I need to give you real feedback. Going silent isn't neutral. It's a choice that costs you $75 and costs us both time we can't get back.
              </p>
              <p>
                When you miss a pre-approved goal, two things happen automatically. The fee is charged to your payment method. And you're enrolled in the monthly Reset Session — a group call where I work through the themes behind the misses without naming anyone. Your pod already knows your streak dropped. The system already logged it. The Reset gives you the framework to understand why and commit to what changes next.
              </p>
            </div>
            <div className="mt-8 rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed">
                I have the authority to waive any fee. Life doesn't always cooperate. But the default is that what you commit to here carries weight. The fee creates urgency. The pod creates daily visibility. The Reset creates insight. That combination is why this works.
              </p>
            </div>
          </div>

          {/* ─── POD SECTION ─── */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-6">Why the pod changes everything.</h2>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                Every member of Terrible Coaching is matched to an accountability pod of 4-6 people based on their personality assessment results.
              </p>
              <p>
                Same operating style. Matched by how you make decisions, handle pressure, and respond to feedback.
              </p>
              <p>
                Your pod sees your check-in streak. Your pod knows when you go quiet. Your pod is there when you hit everything.
              </p>
              <p>
                I set the standard. The pod holds it every day in between. That's the piece most coaching programs are missing — not more access to the coach, but the right people around you consistently.
              </p>
            </div>
          </div>

          {/* ─── FINAL CTA ─── */}
          <div className="max-w-3xl mx-auto text-center border-t border-border pt-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pick your track. Apply today.</h2>
            <p className="text-muted-foreground text-lg mb-8">
              We review every application personally. If you're a fit you'll hear back within 48 hours. If you're not ready for this we'll tell you that too.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link to="/apply?track=life">
                <Button variant="heroOutline" size="lg" className="text-sm px-8">Apply for Life Track</Button>
              </Link>
              <Link to="/apply?track=business">
                <Button variant="heroOutline" size="lg" className="text-sm px-8">Apply for Business Track</Button>
              </Link>
              <Link to="/apply?track=direct">
                <Button variant="hero" size="lg" className="text-sm px-8 font-bold">Apply for Direct</Button>
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
              No refunds after payment is processed. Cancel anytime after your first 30 days.
              <br />
              Terrible Coaching is not therapy and not a substitute for licensed mental health care.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

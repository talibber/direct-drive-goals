import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useReveal } from "@/hooks/useReveal";

const previewGoals = [
  { title: "Send 50 outreach messages", status: "on-track", progress: 78 },
  { title: "Close 2 clients this month", status: "on-track", progress: 55 },
  { title: "Daily journaling — evidence", status: "at-risk", progress: 40 },
];

const knowItems = [
  "Lose the weight",
  "Build the business",
  "Make the calls",
  "Stop procrastinating",
  "Finish the project",
  "Save the money",
  "Fix the habit",
];

const forYou = [
  "You struggle with consistency",
  "You perform better with accountability",
  "You need structure more than motivation",
  "You want direct feedback",
  "You're tired of restarting every week",
  "You know your execution doesn't match your ambition",
];

const notForYou = [
  "You want therapy",
  "You want passive inspiration",
  "You disappear when challenged",
  "You want someone to babysit you forever",
  "You hate accountability with consequences",
];

const breachTypes = [
  {
    label: "Breach Type 01",
    title: "You ghost the system",
    body: "If you stop checking in, ignore reminders, and disappear from the process, that is a breach. Coaching without data becomes guessing. And we do not guess.",
  },
  {
    label: "Breach Type 02",
    title: "You skip the evidence",
    body: "Your word matters. Evidence makes it visible. If your commitment requires proof and you do not submit it by the deadline, that is a breach.",
  },
  {
    label: "Breach Type 03",
    title: "You break a controllable commitment",
    body: "We do not charge you for missing an outcome you could not fully control. But if you agreed to a controllable action and did not do it, the commitment carries weight.",
  },
];

const steps = [
  { num: "01", title: "You apply and get screened", desc: "Tell us who you are, what you are building, and whether you are ready to be held to a standard. If you fit, you are matched to a track and pod." },
  { num: "02", title: "Your first call is 60 minutes", desc: "This is not onboarding. It is diagnosis. We identify the real pattern, the goal underneath the goal, and the proof that shows whether you are actually moving." },
  { num: "03", title: "We build your monthly goals", desc: "Monthly targets. Weekly commitments. Evidence requirements. No vague ambition. No fake productivity. Everything has to be visible." },
  { num: "04", title: "You check in weekly", desc: "Every week, you submit progress, evidence, misses, and the next commitment. The system tracks your streak, ratio, and risk signals." },
  { num: "05", title: "Your pod sees the ratio", desc: "Your pod sees completion percentage and whether you are showing up. You can share details if you choose. Accountability without oversharing.", highlight: true },
  { num: "06", title: "Breaches trigger the Reset", desc: "Miss a required check-in, ghost the system, or break a controllable commitment, and the $75 Breach Fee may apply. You are enrolled in the monthly Reset Call.", highlight: true },
];

const tiers = [
  {
    label: "Life Track",
    name: "Life",
    founding: "$99",
    standard: "$149",
    desc: "For personal goals, routines, and discipline.",
    features: ["60-minute initial call", "Monthly goals + weekly check-ins", "Evidence tracking", "Pod accountability", "Unlimited in-app messaging", "Access to monthly Reset Call"],
    href: "/apply?track=life",
  },
  {
    label: "Operator Track",
    name: "Operator",
    founding: "$199",
    standard: "$299",
    desc: "For founders, creators, professionals, and builders.",
    features: ["Everything in Life", "Operator-level goal design", "Business-focused feedback", "Sharper weekly review", "High-output pod matching"],
    href: "/apply?track=operator",
  },
  {
    label: "Direct",
    name: "Direct",
    founding: "$1,000",
    standard: "$1,500–2,500",
    desc: "For the person who wants the coach, not just the system.",
    features: ["Weekly 1-on-1 calls", "Priority app review", "Same-day response target", "Pre-decision feedback", "Limited availability"],
    href: "/apply?track=direct",
    accent: true,
    badge: "5 Founding Seats Remaining",
  },
];

export default function HomePage() {
  const rootRef = useReveal<HTMLDivElement>();

  return (
    <div ref={rootRef} className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="reveal font-mono text-[12px] uppercase tracking-[0.2em] text-primary mb-8">
              High-speed personalized accountability
            </p>
            <h1 className="reveal font-display text-7xl md:text-8xl lg:text-9xl leading-[0.9]">
              Stop<br />negotiating<br />with<br /><span className="text-primary">yourself.</span>
            </h1>
            <p className="reveal mt-8 text-lg font-light text-foreground/80 max-w-xl leading-relaxed">
              You already know what the goal is. The problem is what happens between Monday motivation and Thursday pressure. Terrible Coaching keeps you accountable through weekly commitments, direct feedback, structured check-ins, and real consequences when you stop following through.
            </p>
            <div className="reveal mt-10 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <Link
                to="/apply/select"
                className="font-mono text-[13px] uppercase tracking-wider bg-primary text-primary-foreground px-7 py-4 hover:bg-primary/90 transition-colors"
              >
                Start Your Plan
              </Link>
              <Link to="/how-it-works" className="font-mono text-[13px] uppercase tracking-wider text-foreground hover:text-primary transition-colors">
                See How It Works →
              </Link>
            </div>
            <p className="reveal mt-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground max-w-md">
              Not therapy. Not motivation. A behavioral accountability system.
            </p>
          </div>

          {/* Dashboard preview */}
          <div className="reveal">
            <div className="border border-border bg-card p-6 md:p-8">
              <div className="flex items-center justify-between pb-5 border-b border-border">
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">Member Dashboard</p>
                <p className="font-mono text-[11px] uppercase tracking-widest text-primary flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Live
                </p>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                <div className="p-5 text-center">
                  <div className="font-display text-5xl text-primary">91</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Performance</div>
                </div>
                <div className="p-5 text-center">
                  <div className="font-display text-5xl text-primary">80%</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Commit Ratio</div>
                </div>
                <div className="p-5 text-center">
                  <div className="font-display text-5xl text-primary">6 WKS</div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Streak</div>
                </div>
              </div>

              <div className="pt-5 space-y-5">
                {previewGoals.map((g) => {
                  const ok = g.status === "on-track";
                  return (
                    <div key={g.title}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-light text-foreground truncate pr-2">{g.title}</span>
                        <span className={`font-mono text-[10px] uppercase tracking-widest ${ok ? "text-primary" : "text-danger"}`}>
                          {ok ? "On Track" : "At Risk"}
                        </span>
                      </div>
                      <div className="w-full h-[2px] bg-border">
                        <div
                          className={`h-[2px] ${ok ? "bg-primary" : "bg-danger"}`}
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                      <div className="font-mono text-[10px] text-muted-foreground mt-1 text-right">{g.progress}%</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <blockquote className="reveal mt-8 border-l-2 border-primary pl-5 font-mono text-sm text-foreground/80 italic leading-relaxed">
              "I can't want this for you more than you want it for yourself."
            </blockquote>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="bg-primary text-primary-foreground py-6 overflow-hidden border-y border-primary">
        <div className="flex whitespace-nowrap animate-marquee">
          {[0, 1].map((i) => (
            <div key={i} className="flex shrink-0 font-display text-3xl md:text-4xl tracking-wider">
              {[
                "The mirror doesn't lie",
                "Catch the drift early",
                "Not therapy. Not inspiration.",
                "The goal is correction",
                "Your behavior is the data",
              ].map((t) => (
                <span key={t} className="px-8 uppercase">{t} ·</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 01 — Problem */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container grid md:grid-cols-[200px_1fr] gap-10 md:gap-20">
          <p className="reveal font-mono text-[11px] uppercase tracking-widest text-muted-foreground">01 — The Problem</p>
          <div>
            <h2 className="reveal font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
              The problem is rarely <span className="text-primary">information.</span>
            </h2>
            <p className="reveal mt-8 text-lg font-light text-foreground/80 max-w-2xl leading-relaxed">
              Most people already know what they need to do. The issue is not knowledge. The issue is inconsistency. Most people slowly negotiate with themselves until the goal quietly dies.
            </p>
            <div className="reveal mt-10 flex flex-wrap gap-3">
              {knowItems.map((item) => (
                <span key={item} className="border border-border font-mono text-[12px] uppercase tracking-wider px-4 py-2 text-foreground/80">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VERDICT STRIP */}
      <div className="bg-primary text-primary-foreground py-16 md:py-20 text-center">
        <h3 className="container font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95]">
          Terrible Coaching interrupts that pattern before it becomes your lifestyle.
        </h3>
      </div>

      {/* FILTER SECTION */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container grid md:grid-cols-2 md:divide-x divide-border">
          <div className="md:pr-12">
            <p className="reveal font-mono text-[11px] uppercase tracking-widest text-primary mb-8">This is for you if</p>
            <ul>
              {forYou.map((item) => (
                <li key={item} className="reveal flex items-center gap-4 py-5 border-b border-border">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="text-[17px] font-light text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:pl-12 mt-16 md:mt-0">
            <p className="reveal font-mono text-[11px] uppercase tracking-widest text-danger mb-8">This is not for you if</p>
            <ul>
              {notForYou.map((item) => (
                <li key={item} className="reveal flex items-center gap-4 py-5 border-b border-border">
                  <span className="w-2 h-2 rounded-full bg-danger shrink-0" />
                  <span className="text-[17px] font-light text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 02 — Breach Fee */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <p className="reveal font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-8">02 — The Standard</p>
          <h2 className="reveal font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            Why there's<br />a <span className="text-primary">$75</span><br />breach fee.
          </h2>
          <p className="reveal mt-8 text-lg font-light text-foreground/80 max-w-3xl leading-relaxed">
            If you say something matters, your behavior should reflect it. The breach fee creates urgency around the commitments you voluntarily make. You are not punished for needing help or being human — only for repeatedly disappearing on the standard you agreed to.
          </p>

          <div className="reveal mt-12 border border-primary bg-primary/[0.04] p-8 md:p-10 max-w-4xl">
            <h3 className="font-display text-4xl md:text-5xl text-primary leading-none">Most members never pay it.</h3>
            <p className="mt-4 text-base font-light text-foreground/80 leading-relaxed">
              The fee exists to make the standard real. When it is real, you stop drifting. The fee may be waived at coach discretion when life genuinely happens. Avoidance is not adversity.
            </p>
          </div>

          <div className="reveal mt-16 grid md:grid-cols-3 border-y border-border">
            {breachTypes.map((b, i) => (
              <div key={b.title} className={`p-8 ${i > 0 ? "md:border-l border-border" : ""} ${i > 0 ? "border-t md:border-t-0" : ""}`}>
                <p className="font-mono text-[11px] uppercase tracking-widest text-danger mb-4">{b.label}</p>
                <h4 className="text-lg font-medium text-foreground mb-3">{b.title}</h4>
                <p className="text-sm font-light text-foreground/75 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 03 — How It Works */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <p className="reveal font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-8">03 — How It Works</p>
          <h2 className="reveal font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-16">
            The full system.<br />Nothing <span className="text-primary">hidden.</span>
          </h2>
          <div className="border-t border-border">
            {steps.map((s) => (
              <div
                key={s.num}
                className={`reveal grid grid-cols-[80px_1fr] md:grid-cols-[120px_320px_1fr] gap-6 md:gap-10 py-8 px-2 md:px-6 border-b border-border ${
                  s.highlight ? "bg-primary/[0.04]" : ""
                }`}
              >
                <div className={`font-display text-5xl md:text-6xl ${s.highlight ? "text-primary" : "text-muted-foreground"}`}>
                  {s.num}
                </div>
                <div className="text-lg font-medium text-foreground col-span-2 md:col-span-1">{s.title}</div>
                <div className="text-sm font-light text-foreground/75 leading-relaxed col-span-2 md:col-span-1">
                  {s.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 04 — Pricing */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container">
          <p className="reveal font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-8">04 — Pricing</p>
          <h2 className="reveal font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            Three tracks.<br />One <span className="text-primary">standard.</span>
          </h2>
          <p className="reveal mt-6 text-lg font-light text-muted-foreground max-w-2xl leading-relaxed">
            Founding rates are limited. Standard rates apply after the founding cohort fills. All tracks include the $75 Commitment Breach Fee.
          </p>

          <div className="reveal mt-16 grid md:grid-cols-3 border-y border-border">
            {tiers.map((t, i) => (
              <div
                key={t.name}
                className={`flex flex-col p-8 ${i > 0 ? "border-t md:border-t-0 md:border-l border-border" : ""} ${
                  t.accent ? "bg-primary/[0.04]" : ""
                }`}
              >
                {t.badge && (
                  <p className="font-mono text-[11px] uppercase tracking-widest text-danger mb-4">{t.badge}</p>
                )}
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-3">{t.label}</p>
                <h3 className="font-display text-4xl text-foreground mb-4">{t.name}</h3>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display text-6xl text-primary leading-none">{t.founding}</span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">/ mo founding</span>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground line-through mb-6">
                  Standard {t.standard}/mo
                </p>
                <p className="text-sm font-light text-foreground/85 mb-6">{t.desc}</p>
                <ul className="mb-8 flex-1">
                  {t.features.map((f) => (
                    <li key={f} className="text-sm font-light text-foreground/80 py-3 border-b border-border flex gap-3">
                      <span className="text-primary">—</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={t.href}
                  className="block text-center font-mono text-[13px] uppercase tracking-wider border border-primary text-primary py-3 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  Apply For {t.name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-24 md:py-32 border-b border-border">
        <div className="container grid md:grid-cols-[380px_1fr] gap-12 md:gap-20 items-start">
          <div className="reveal aspect-[4/5] bg-card border border-border" />
          <div>
            <p className="reveal font-mono text-[11px] uppercase tracking-widest text-primary mb-6">
              T. Allen — Founder
            </p>
            <blockquote className="reveal font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-foreground">
              The system is the tool.<br />
              The pod is the pressure.<br />
              The feedback is the mirror.<br />
              And the mirror does <span className="text-primary">not negotiate.</span>
            </blockquote>
            <p className="reveal mt-8 text-base font-light text-foreground/80 leading-relaxed max-w-2xl">
              I built Terrible Coaching because I got tired of watching smart people stay stuck — not because they did not know what to do, but because nobody around them was willing to hold them to the standard they claimed they wanted.
            </p>
            <p className="reveal mt-4 text-base font-light text-foreground/80 leading-relaxed max-w-2xl">
              Everyone has somebody saying 'you got this.' Very few people have somebody asking, 'Did you actually do what you said you were going to do?'
            </p>
            <div className="reveal mt-10 pt-6 border-t border-border">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                T. Allen / Founder / Terrible Coaching
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 md:py-44 text-center">
        <div className="container">
          <h2 className="reveal font-display text-7xl md:text-9xl lg:text-[10rem] leading-[0.9]">
            The mirror<br />doesn't<br /><span className="text-primary">lie.</span>
          </h2>
          <p className="reveal mt-10 text-lg font-light text-muted-foreground max-w-xl mx-auto">
            Apply now. Get screened. Get matched. Get held to the standard you claim you want.
          </p>
          <div className="reveal mt-10">
            <Link
              to="/apply/select"
              className="inline-block font-mono text-[13px] uppercase tracking-wider bg-primary text-primary-foreground px-10 py-5 hover:bg-primary/90 transition-colors"
            >
              Apply Now
            </Link>
          </div>
          <p className="reveal mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            No refunds. $75 breach fee. Real consequences.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

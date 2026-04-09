import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Target, Flame, X, Check } from "lucide-react";
import founderImg from "@/assets/founder.png";

const oldWay = [
  "Vague goals with no measurement",
  "Weekly calls with no follow-up",
  "Encouragement when you need correction",
  "Zero financial skin in the game",
  "Feeling good instead of moving forward",
];

const newWay = [
  "SMART goals with pass/fail definitions",
  "Weekly scored check-ins with trend data",
  "Brutally honest coach feedback",
  "$75 accountability stake per missed goal",
  "Performance score you can't lie to",
];

const previewGoals = [
  { title: "Close 3 new enterprise deals", status: "on-track", progress: 67 },
  { title: "Ship v2.0 product launch", status: "at-risk", progress: 45 },
  { title: "Run 4x per week consistently", status: "on-track", progress: 85 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_100%_51%/0.08),transparent_60%)]" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-medium text-primary animate-fade-up">
                <Flame size={14} /> Coaching that actually works
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Stop performing.
                <br />
                <span className="text-gradient-gold">Start executing.</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
                Terrible Coaching is radically honest coaching for founders, executives, and investors
                who are done with fluffy advice and ready for measurable results. Miss a goal? Pay $75.
                That's accountability.
              </p>
              <p className="mt-4 text-sm md:text-base font-semibold text-foreground/80 tracking-wide animate-fade-up" style={{ animationDelay: "0.25s" }}>
                Weekly check-ins. Real consequences. No fluff.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <Link to="/apply">
                  <Button variant="hero" size="lg" className="text-base px-8">
                    Apply Now <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button variant="heroOutline" size="lg" className="text-base px-8">
                    How It Works
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
                $99/month · $75 per missed goal · No contracts · Cancel anytime
              </p>
            </div>

            {/* Right column — Dashboard preview */}
            <div className="relative animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,hsl(45_100%_51%/0.07),transparent_70%)] pointer-events-none" />
              <div className="relative rounded-xl border border-border bg-card p-6 shadow-[0_20px_60px_-15px_hsl(0_0%_0%/0.6)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Client Dashboard</p>
                    <p className="text-sm text-foreground/70 mt-0.5">Week of Apr 7, 2026</p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target size={14} className="text-primary" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <div className="text-2xl font-display font-bold text-gradient-gold">91</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Performance</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <div className="text-2xl font-display font-bold text-gradient-gold">80%</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Goals Hit</div>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3 text-center">
                    <div className="text-2xl font-display font-bold text-gradient-gold">6 wks</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">Streak</div>
                  </div>
                </div>

                {/* Goal cards */}
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Active Goals</p>
                  {previewGoals.map((g) => (
                    <div key={g.title} className="rounded-lg border border-border bg-background/50 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground truncate pr-2">{g.title}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          g.status === "on-track"
                            ? "text-success border-success/30 bg-success/10"
                            : "text-warning border-warning/30 bg-warning/10"
                        }`}>
                          {g.status === "on-track" ? "On Track" : "At Risk"}
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${g.status === "on-track" ? "bg-gradient-gold" : "bg-warning"}`}
                          style={{ width: `${g.progress}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-1 text-right">{g.progress}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Most coaching. <span className="text-gradient-gold">This coaching.</span>
            </h2>
          </div>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Old way */}
            <div className="rounded-xl border border-danger/20 bg-danger/[0.03] p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-danger/80 mb-6">What you've probably tried</h3>
              <ul className="space-y-4">
                {oldWay.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X size={18} className="text-danger/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* New way */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8">
              <h3 className="font-display text-lg font-bold text-primary mb-6">What Terrible Coaching does</h3>
              <ul className="space-y-4">
                {newWay.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check size={18} className="text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/90 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-10 md:gap-14">
            <div className="w-full md:w-[380px] shrink-0 relative">
              <img
                src={founderImg}
                alt="T. Allen, Founder of Terrible Coaching"
                className="w-full rounded-lg object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent rounded-b-lg" />
            </div>
            <div className="flex-1 pt-2">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground mb-4">
                I don't give advice. I give perspective.
              </h2>
              <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
                <p>
                  I built Terrible Coaching because I realized I can't execute your life for you — and I wouldn't want to. What I can do is help you see what you're already seeing but not trusting.
                </p>
                <p>
                  Most people don't need more information. They have the answer. They just don't have the confidence or the belief in themselves to act on it yet.
                </p>
                <p>
                  This isn't coaching for a specific type of person. It's for anyone who deserves better feedback, without judgment — so they can finally make the decision they've been circling.
                </p>
                <p>
                  The system creates accountability. The scorecard creates visibility. But the real work is you learning to trust what you already know.
                </p>
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-foreground/70">
                T. Allen, Founder
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold">Your performance, quantified</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Weekly check-ins. Performance scores. Goal tracking. No hiding from the data.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 md:p-10 shadow-card">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Performance Score", value: "86", sub: "+12 from last month" },
                  { label: "Goals Completed", value: "8/10", sub: "80% completion rate" },
                  { label: "Check-In Streak", value: "6 wks", sub: "Longest streak" },
                  { label: "Stakes Charged", value: "$150", sub: "2 missed goals" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl md:text-4xl font-display font-bold text-gradient-gold">{s.value}</div>
                    <div className="text-sm font-medium text-foreground mt-1">{s.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mirror Section */}
      <section className="py-20 md:py-24">
        <div className="container">
          <div className="max-w-[740px] mx-auto text-center space-y-6">
            <p className="text-lg md:text-xl text-muted-foreground leading-[1.7]">
              I can't want this for you more than you want it for yourself.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-[1.7]">
              There's a real cost to missing goals — not the $75. The cost of another month that passed. Another promise to yourself that didn't get kept. Another version of who you could be, deferred.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-primary leading-[1.7]">
              Terrible Coaching doesn't motivate you.
              <br />
              It doesn't fix you. It holds up a mirror.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-[1.7]">
              The scorecard shows you the gap between who you said you'd be and what you actually did. The check-in surfaces what you're avoiding. The accountability stake makes the cost of inaction visible.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-primary leading-[1.7]">
              The answers are already inside you.
              <br />
              The promise was already made.
            </p>
            <p className="text-xl md:text-2xl font-semibold text-primary leading-[1.7]">
              We just make sure you can't look away from it.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Ready to stop lying to yourself?</h2>
            <p className="text-muted-foreground text-lg mb-8">
              Apply for Terrible Coaching. We'll review your application and, if you're a fit, 
              invite you to subscribe. No sales calls. No BS.
            </p>
            <Link to="/apply">
              <Button variant="hero" size="lg" className="text-base px-10">
                Apply Now <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

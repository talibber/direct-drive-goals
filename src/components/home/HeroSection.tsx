import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";

const previewGoals = [
  { title: "Send 50 outreach messages this week", status: "on-track", progress: 78 },
  { title: "Monthly target: close 2 clients", status: "on-track", progress: 55 },
  { title: "Daily journaling - evidence submitted", status: "at-risk", progress: 40 },
];

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_100%_51%/0.08),transparent_60%)]" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-5 py-1.5 mb-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary animate-fade-up">
              High-speed personalized accountability
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Stop negotiating
              <br />
              with yourself.
              <br />
              <span className="text-gradient-gold">Start catching the drift early.</span>
            </h1>

            <p className="mt-8 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              You already know what the goal is. The problem is what happens between Monday motivation and Thursday pressure. Terrible Coaching keeps you accountable through weekly commitments, direct feedback, structured check-ins, and real consequences when you stop following through.
            </p>

            <p className="mt-4 text-base md:text-lg font-medium text-foreground/90 animate-fade-up max-w-xl" style={{ animationDelay: "0.25s" }}>
              This is not motivation. This is behavioral accountability.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/apply/select">
                <Button variant="hero" size="lg" className="text-base px-8">
                  Start Your Accountability Plan
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="heroOutline" size="lg" className="text-base px-8">
                  See How It Works
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground animate-fade-up max-w-xl leading-relaxed" style={{ animationDelay: "0.4s" }}>
              Personalized feedback delivered fast based on your goals, behavior, check-ins, and progress patterns.
            </p>
          </div>

          {/* Right column - Dashboard preview */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,hsl(45_100%_51%/0.07),transparent_70%)] pointer-events-none" />
            <div className="relative rounded-xl border border-border bg-card p-6 shadow-[0_20px_60px_-15px_hsl(0_0%_0%/0.6)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Member Dashboard</p>
                  <p className="text-sm text-foreground/70 mt-0.5">Week of Apr 7, 2026</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target size={14} className="text-primary" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="text-2xl font-display font-bold text-gradient-gold">91</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Performance</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="text-2xl font-display font-bold text-gradient-gold">80%</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Commitment Ratio</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="text-2xl font-display font-bold text-gradient-gold">6 wks</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Streak</div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Weekly Commitments</p>
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

              <div className="mt-4 rounded-lg border border-border bg-background/30 p-3">
                <p className="text-xs text-muted-foreground">
                  Your pod: 4 members · ratio visible · evidence private
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

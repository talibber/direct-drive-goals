import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target } from "lucide-react";

const previewGoals = [
  { title: "Build morning routine — 6 days/week", status: "on-track", progress: 78 },
  { title: "Close 2 new clients this month", status: "on-track", progress: 55 },
  { title: "Journal daily for 30 days", status: "at-risk", progress: 40 },
];

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_100%_51%/0.08),transparent_60%)]" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <div>
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-5 py-1.5 mb-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary animate-fade-up">
              The coaching you wish someone gave you years ago
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              You already know
              <br />
              what to do.
              <br />
              <span className="text-gradient-gold">You just don't have anyone holding you to it.</span>
            </h1>

            <div className="mt-8 space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <p>
                Not a cheerleader. Not a group chat that dies in two weeks. A coach who will tell you what you already know but keep avoiding — backed by a system that tracks whether you actually did something about it.
              </p>
              <p>
                Your first call is real coaching — not onboarding. I listen. I identify what's underneath the surface problem. Then we build your 30-60-90 day goals from that conversation, not from a template. Everything that follows is designed to keep you honest about what we uncovered together.
              </p>
            </div>

            {/* Proof points */}
            <ul className="mt-6 space-y-2.5 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              {[
                "Customized 30-60-90 day goals from your coaching call",
                "Personality-matched accountability pods",
                "Weekly scored check-ins and real-time feedback",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-foreground/80">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Link to="/apply/select">
                <Button variant="hero" size="lg" className="text-base px-8">
                  Apply Now
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button variant="heroOutline" size="lg" className="text-base px-8">
                  How It Works
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
              Life Track $99 · Business Track $199 · Direct $1,000 · No contracts · Cancel after 30 days
            </p>
          </div>

          {/* Right column — Dashboard preview */}
          <div className="relative animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <div className="absolute -inset-16 bg-[radial-gradient(ellipse_at_center,hsl(45_100%_51%/0.07),transparent_70%)] pointer-events-none" />
            <div className="relative rounded-xl border border-border bg-card p-6 shadow-[0_20px_60px_-15px_hsl(0_0%_0%/0.6)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Client Dashboard</p>
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
                  <div className="text-[10px] text-muted-foreground mt-0.5">Goals Hit</div>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <div className="text-2xl font-display font-bold text-gradient-gold">6 wks</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Streak</div>
                </div>
              </div>

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

              {/* Pod indicator */}
              <div className="mt-4 rounded-lg border border-border bg-background/30 p-3">
                <p className="text-xs text-muted-foreground">
                  Your pod: 4 members · 3 checked in this week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

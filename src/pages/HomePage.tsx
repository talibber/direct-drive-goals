import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ArrowRight, Target, Flame, TrendingUp, DollarSign, Zap, Shield } from "lucide-react";

const features = [
  { icon: Target, title: "Measurable Goals", desc: "Every goal has a number. No vague intentions. We define exactly what success looks like." },
  { icon: DollarSign, title: "$75 Accountability Stakes", desc: "Miss a goal, pay the stake. Nothing focuses the mind like having skin in the game." },
  { icon: TrendingUp, title: "Weekly Performance Scores", desc: "Track your energy, focus, habits, and execution in a single score. See the trend." },
  { icon: Flame, title: "Radical Honesty", desc: "Your coach will tell you what you need to hear, not what you want to hear." },
  { icon: Zap, title: "Execution > Strategy", desc: "Most people don't need another framework. They need to actually do the thing." },
  { icon: Shield, title: "Not Therapy", desc: "This is coaching and consulting for high performers. We focus on thinking and action." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(45_100%_51%/0.08),transparent_60%)]" />
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6 text-xs font-medium text-primary animate-fade-up">
              <Flame size={14} /> Coaching that actually works
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Stop performing.
              <br />
              <span className="text-gradient-gold">Start executing.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Terrible Coaching is radically honest coaching for founders, executives, and investors 
              who are done with fluffy advice and ready for measurable results. Miss a goal? Pay $75. 
              That's accountability.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
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
        </div>
      </section>

      {/* Anti-fluff */}
      <section className="py-20 border-t border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Most coaching is <span className="text-danger line-through decoration-2">expensive therapy</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              We're not here to explore your childhood. We're here to help you think better, 
              execute faster, and build the life and business you actually want.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-lg border border-border bg-card p-6 shadow-card hover:border-primary/20 transition-colors">
                <f.icon className="text-primary mb-4" size={24} />
                <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score preview */}
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

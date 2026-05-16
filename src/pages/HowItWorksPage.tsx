import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHead } from "@/components/PageHead";
import { ClipboardCheck, Target, CalendarCheck, TrendingUp, DollarSign, MessageSquare } from "lucide-react";

const steps = [
  { icon: ClipboardCheck, title: "1. Apply", desc: "Fill out our application. Tell us who you are, what you're working on, and what's not working. Tell us whether you're applying for Life Track or Operator Track. The system is the same. The focus is different. We'll review within 48 hours." },
  { icon: Target, title: "2. Set Goals", desc: "If accepted, you'll define 1–3 measurable, time-bound goals for your first month. Each goal gets a $75 commitment breach fee." },
  { icon: CalendarCheck, title: "3. Weekly Check-Ins", desc: "Every week, you complete a check-in: energy, focus, stress, habits, wins, failures, and what you're avoiding. No hiding." },
  { icon: MessageSquare, title: "4. Coach Feedback", desc: "Your coach reviews your data, writes direct notes, and adjusts your plan. No fluffy encouragement-just what you need to hear." },
  { icon: TrendingUp, title: "5. Score & Track", desc: "Your weekly performance score combines goal progress, habit adherence, well-being metrics, and coach assessment. Watch the trend." },
  { icon: DollarSign, title: "6. Pay the Stakes", desc: "Miss a goal? The $75 stake is charged. No negotiation. This is the mechanism that makes the system work." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background">
      <PageHead
        title="How Terrible Coaching Works - Six Steps to Real Accountability"
        description="Apply, set measurable goals, complete weekly check-ins, get direct coach feedback, and pay the $75 stake when you miss. Here's exactly how the system works."
        path="/how-it-works"
      />
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient-gold">Works</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Six steps. No mystery. No fluff. Here's exactly what happens when you join Terrible Coaching.
          </p>
          <div className="space-y-8">
            {steps.map((s) => (
              <div key={s.title} className="flex gap-5 rounded-lg border border-border bg-card p-6 shadow-card">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <s.icon className="text-primary" size={20} />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

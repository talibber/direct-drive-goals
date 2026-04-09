import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-3xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-gradient-gold">Terrible Coaching</span>
          </h1>
          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg">
            <p>
              Most coaching is broken because it's built around the coach, not the client.
            </p>
            <p>
              Advice assumes the coach knows your life better than you do. We don't believe that.
            </p>
            <p>
              Terrible Coaching was built on a different premise: most people already have the answer. They don't need more information. They don't need motivation. They need better feedback — without judgment — so they can finally trust what they already know and act on it.
            </p>
            <p>
              We don't tell you what to do. We give you perspective. We build you a system. We hold you accountable to your own standards — not ours.
            </p>
            <p>
              The scorecard makes your progress visible. The weekly check-in surfaces what you're avoiding. The accountability stake makes the cost of inaction real. And when you miss a goal, we don't penalize you and disappear — we schedule a call and figure out what's actually in the way.
            </p>
            <p>
              This isn't just for founders and executives. It's for anyone who deserves honest feedback and is ready to stop lying to themselves about why they're not moving.
            </p>
            <p className="text-foreground font-semibold">
              The answers are already inside you. Terrible Coaching is how you learn to trust them.
            </p>
          </div>
          <p className="mt-10 text-xs text-muted-foreground/60 leading-relaxed max-w-xl">
            Terrible Coaching is not therapy. We are not licensed therapists or mental health professionals. Coaching is not a substitute for licensed mental health care. If you are experiencing a mental health crisis, please contact a licensed professional or call 988 (Suicide &amp; Crisis Lifeline).
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

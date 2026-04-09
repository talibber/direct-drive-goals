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
              Most coaching is expensive therapy with a whiteboard.
            </p>
            <p>
              Vague affirmations. No accountability. Zero measurable outcomes.
            </p>
            <p className="text-foreground font-semibold">
              We built the opposite.
            </p>
            <p>
              Terrible Coaching is for people who are already moving — founders, executives, operators — who know they're leaving performance on the table and want someone to call them on it.
            </p>
            <p>
              The model is simple: define your goals, put money on the line, check in weekly, get honest feedback. Hit your goals. Or pay $75 and learn something real about yourself.
            </p>
            <p>
              This is not crisis care. This is not therapy. If you are experiencing a mental health crisis, please contact a licensed professional or call 988.
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

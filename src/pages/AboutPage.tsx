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
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              Terrible Coaching exists because most coaching is terrible—vague affirmations, 
              no accountability, and zero measurable outcomes. We built the opposite.
            </p>
            <p>
              We work with founders, executives, and investors who are already successful but 
              know they're leaving performance on the table. The kind of people who don't need 
              motivation—they need clarity, systems, and someone willing to call them on their BS.
            </p>
            <p>
              Our model is simple: define measurable goals, put money on the line, check in weekly, 
              and get brutally honest feedback. If you hit your goals, great. If you miss them, you 
              pay $75 per miss. That's not punishment—it's signal. It tells you where the gap is 
              between what you say matters and what you actually do.
            </p>
            <div className="border-l-2 border-primary pl-6 py-2">
              <p className="text-foreground font-medium italic">
                "The quality of your life is determined by the quality of your thinking and 
                the consistency of your execution. Everything else is noise."
              </p>
            </div>
            <p>
              We combine life coaching and business coaching because the two can't be separated. 
              Your sleep affects your decisions. Your relationships affect your focus. Your health 
              affects your output. We look at the whole picture.
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground pt-4">Important Disclaimer</h2>
            <p className="text-sm border border-border rounded-lg p-4 bg-card">
              Terrible Coaching is not therapy. We are not licensed therapists or mental health professionals. 
              Coaching is not a substitute for licensed mental health care. If you are experiencing a mental 
              health crisis, please contact a licensed professional or call 988 (Suicide & Crisis Lifeline).
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

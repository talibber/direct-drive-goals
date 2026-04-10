import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function TrackSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 md:pt-40">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Which track is <span className="text-gradient-gold">right for you</span>?
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Both use the same accountability system. The difference is who's in the room and what we focus on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Life Track */}
            <Link
              to="/apply?track=life"
              className="group rounded-xl border-2 border-border hover:border-primary/50 bg-card p-8 transition-all hover:shadow-[0_8px_30px_-8px_hsl(45_100%_51%/0.15)]"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Life Track — $99/month</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                For anyone ready to stop lying to themselves about their habits, decisions, and personal standards.
              </p>
              <ul className="space-y-2 text-sm text-foreground/80 mb-8">
                <li>Weekly check-ins. Scored goals.</li>
                <li>Accountability stakes.</li>
                <li>Group Reset Sessions.</li>
              </ul>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                Apply for Life Track <ArrowRight size={16} />
              </div>
            </Link>

            {/* Business Track */}
            <Link
              to="/apply?track=business"
              className="group rounded-xl border-2 border-primary/30 bg-card p-8 transition-all hover:shadow-[0_8px_30px_-8px_hsl(45_100%_51%/0.15)] relative"
            >
              <div className="absolute -top-3 right-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Popular
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-4">Business Track — $199/month</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                For operators running a business who need a thinking partner, peer access, and real-time perspective on decisions that matter.
              </p>
              <p className="text-xs text-foreground/70 font-medium mb-2">Everything in Life Track plus:</p>
              <ul className="space-y-1.5 text-sm text-foreground/80 mb-8">
                <li>Monthly Operator Community Call</li>
                <li>Direct messenger and voice note access</li>
                <li>Operator Networking Directory</li>
                <li>Guest professionals monthly</li>
              </ul>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                Apply for Business Track <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

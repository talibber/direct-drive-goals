import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Your goals don't need more motivation.
            <br />
            <span className="text-gradient-gold">They need weight.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Set the goal. Make the commitment. Check in weekly. Catch the drift early. Stop disappearing on yourself.
          </p>
          <Link to="/apply/select">
            <Button variant="hero" size="lg" className="text-base px-10">
              Start Your Accountability Plan
            </Button>
          </Link>
          <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
            Not therapy. Not counseling. Not crisis support. Subscription renews monthly until cancelled. Payments are non-refundable after the initial coaching call.
          </p>
        </div>
      </div>
    </section>
  );
}

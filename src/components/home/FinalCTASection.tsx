import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to stop figuring it out alone?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Apply for Terrible Coaching. We'll review your application, match you to a pod, and set the standard on your first call. No sales calls. No BS. An honest answer within 48 hours.
          </p>
          <Link to="/apply/select">
            <Button variant="hero" size="lg" className="text-base px-10">
              Apply Now
            </Button>
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            No refunds. Cancel after 30 days. Not therapy. Not for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}

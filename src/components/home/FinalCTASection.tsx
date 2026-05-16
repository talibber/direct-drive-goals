import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="py-20 border-t border-border">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to make avoidance expensive?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Apply for your pod. We review every application personally. If you're a fit, you'll receive next steps within 48 hours.
          </p>
          <Link to="/apply/select">
            <Button variant="hero" size="lg" className="text-base px-10">
              Apply for Your Pod
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

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-bold mb-3">
              <span className="text-gradient-gold italic">Terrible</span> Coaching
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Radically honest coaching for people who are done with fluff and ready for results.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/about", label: "About" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/pricing", label: "Pricing" },
                { to: "/apply", label: "Apply" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Legal</h4>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
              <span className="text-sm text-muted-foreground">Terms of Service</span>
              <span className="text-sm text-muted-foreground">Coaching Disclaimer</span>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Terrible Coaching is not therapy. Coaching is not a substitute for licensed mental health care. 
              If you are in crisis, please contact a licensed professional or call 988.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Terrible Coaching. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

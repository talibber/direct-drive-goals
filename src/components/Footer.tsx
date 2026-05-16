import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="font-display text-3xl text-primary tracking-wide">TERRIBLE COACHING</div>
            <p className="mt-3 italic text-muted-foreground text-sm">The mirror doesn't lie.</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4">Navigate</p>
            <div className="flex flex-col gap-2">
              {[
                { to: "/about", label: "About" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/pricing", label: "Pricing" },
                { to: "/apply/select", label: "Apply" },
              ].map((l) => (
                <Link key={l.to} to={l.to} className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground mb-4">Legal</p>
            <div className="flex flex-col gap-2 mb-4">
              <Link to="/legal/terms" className="text-sm text-foreground/80 hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/legal/privacy" className="text-sm text-foreground/80 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/legal/disclaimer" className="text-sm text-foreground/80 hover:text-primary transition-colors">Coaching Disclaimer</Link>
              <Link to="/legal/subscription" className="text-sm text-foreground/80 hover:text-primary transition-colors">Subscription &amp; Fee Terms</Link>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Terrible Coaching is not therapy, counseling, medical care, or crisis care. If you are in crisis, contact a licensed professional or call 988.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} Terrible Coaching — All Rights Reserved
          </p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Built For The Ones Who Stop Negotiating
          </p>
        </div>
      </div>
    </footer>
  );
}

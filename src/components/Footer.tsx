import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <img src={logo} alt="Terrible Coaching" className="h-auto w-[100px] mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              The mirror doesn't lie.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/about", label: "About" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/pricing", label: "Pricing" },
                { to: "/apply/select", label: "Apply" },
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
              <Link to="/legal/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              <Link to="/legal/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/legal/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">Coaching Disclaimer</Link>
              <Link to="/legal/subscription" className="text-sm text-muted-foreground hover:text-primary transition-colors">Subscription &amp; Fee Terms</Link>
              <Link to="/legal/community" className="text-sm text-muted-foreground hover:text-primary transition-colors">Community Guidelines</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold mb-3 text-foreground">Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Terrible Coaching is not therapy, counseling, medical care, crisis care, diagnosis, or treatment. Coaching is focused on goals, accountability, behavior tracking, and execution. If you are in crisis or need mental health care, contact a licensed professional or emergency service.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Terrible Coaching. All rights reserved.
          </p>
          <p className="text-[11px] text-muted-foreground/50 mt-1">
            Life Track - Founding $99/mo | Operator Track - Founding $199/mo | Direct - Founding $1,000/mo
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-[12px]">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-wide text-primary">
          TERRIBLE COACHING
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`font-mono text-[13px] uppercase tracking-wider transition-colors ${
                location.pathname === l.to ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/apply/select"
            className="font-mono text-[13px] uppercase tracking-wider border border-primary text-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Apply
          </Link>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-3 font-mono text-[13px] uppercase tracking-wider text-muted-foreground hover:text-foreground border-b border-border last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/apply/select"
            onClick={() => setOpen(false)}
            className="mt-3 block text-center font-mono text-[13px] uppercase tracking-wider border border-primary text-primary py-3"
          >
            Apply
          </Link>
        </div>
      )}
    </nav>
  );
}

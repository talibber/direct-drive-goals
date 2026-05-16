import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/pricing", label: "Pricing" },
  { to: "/apply/select", label: "Apply" },
];

export function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-20 md:h-24 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Terrible Coaching" className="h-16 md:h-20 w-auto object-contain" />
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 text-sm font-medium transition-colors rounded-md ${
                location.pathname === l.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="ml-4">
            <Button variant="heroOutline" size="sm">Log In</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 animate-fade-in">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block py-3 text-sm font-medium text-muted-foreground hover:text-foreground border-b border-border/50 last:border-0"
            >
              {l.label}
            </Link>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="mt-3 block">
            <Button variant="hero" className="w-full">Log In</Button>
          </Link>
        </div>
      )}
    </nav>
  );
}

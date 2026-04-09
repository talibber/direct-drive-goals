import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Target, CalendarCheck, CreditCard, FileText, User, LogOut, RotateCcw, Radio } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/goals", label: "Goals", icon: Target },
  { to: "/dashboard/check-in", label: "Check-In", icon: CalendarCheck },
  { to: "/dashboard/help-radar", label: "Help Radar", icon: Radio },
  { to: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { to: "/dashboard/sessions", label: "Sessions", icon: FileText },
  { to: "/dashboard/reset-session", label: "Reset Session", icon: RotateCcw },
  { to: "/dashboard/profile", label: "Profile", icon: User },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <Link to="/" className="font-display text-lg font-bold mb-8 px-3">
          <span className="text-gradient-gold italic">Terrible</span> Coaching
        </Link>
        <nav className="flex-1 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                location.pathname === l.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <l.icon size={18} />
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
          <LogOut size={18} /> Log Out
        </Link>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="flex justify-around py-2">
          {links.slice(0, 5).map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-xs",
                location.pathname === l.to ? "text-primary" : "text-muted-foreground"
              )}
            >
              <l.icon size={18} />
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        <div className="p-6 md:p-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}

import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, MessageSquare, LogOut, Mic, Zap, Trophy, BookOpen } from "lucide-react";
import logo from "@/assets/logo.png";

const links = [
  { to: "/coach", label: "Overview", icon: LayoutDashboard },
  { to: "/coach/clients", label: "Clients", icon: Users },
  { to: "/coach/messages", label: "Messages", icon: MessageSquare },
  { to: "/coach/direct-access", label: "Direct Access", icon: Zap },
  { to: "/coach/applications", label: "Applications", icon: ClipboardCheck },
  { to: "/coach/operator-call", label: "Operator Call", icon: Mic },
  { to: "/coach/achievement-group", label: "Achievement Group", icon: Trophy },
  { to: "/coach/weekly-qa", label: "Weekly Q&A", icon: BookOpen },
  { to: "/coach/metrics", label: "Metrics", icon: BarChart3 },
];

export function CoachLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-4">
        <Link to="/" className="mb-2 px-3 block">
          <img src={logo} alt="Terrible Coaching" className="h-auto w-[140px]" />
        </Link>
        <span className="text-xs text-primary font-medium px-3 mb-6">Coach Portal</span>
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

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}

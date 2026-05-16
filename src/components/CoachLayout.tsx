import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, ClipboardCheck, BarChart3, MessageSquare, LogOut,
  Mic, Zap, Trophy, BookOpen, AlertOctagon, Inbox, Brain, Settings,
} from "lucide-react";
import logo from "@/assets/logo.png";

const groups: { label: string; links: { to: string; label: string; icon: any }[] }[] = [
  {
    label: "Command",
    links: [
      { to: "/coach", label: "Overview", icon: LayoutDashboard },
      { to: "/coach/action-queue", label: "Action Queue", icon: Inbox },
      { to: "/coach/messages", label: "Messages", icon: MessageSquare },
      { to: "/coach/clients", label: "Clients", icon: Users },
    ],
  },
  {
    label: "Programs",
    links: [
      { to: "/coach/direct-access", label: "Direct Access", icon: Zap },
      { to: "/coach/operator-call", label: "Operator Call", icon: Mic },
      { to: "/coach/achievement-group", label: "Achievement Group", icon: Trophy },
      { to: "/coach/weekly-qa", label: "Weekly Q&A", icon: BookOpen },
    ],
  },
  {
    label: "Operations",
    links: [
      { to: "/coach/applications", label: "Applications", icon: ClipboardCheck },
      { to: "/coach/breaches", label: "Commitment Stakes", icon: AlertOctagon },
      { to: "/coach/metrics", label: "Metrics", icon: BarChart3 },
      { to: "/coach/style-learning", label: "Style Learning", icon: Brain },
      { to: "/coach/team-settings", label: "Team & Settings", icon: Settings },
    ],
  },
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
        <nav className="flex-1 space-y-4 overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="px-3 mb-1 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                {g.label}
              </div>
              <div className="space-y-1">
                {g.links.map((l) => {
                  const active = location.pathname === l.to ||
                    (l.to === "/coach/action-queue" && location.pathname === "/coach/review-queue");
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <l.icon size={18} />
                      {l.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <Link to="/login" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground mt-4">
          <LogOut size={18} /> Log Out
        </Link>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

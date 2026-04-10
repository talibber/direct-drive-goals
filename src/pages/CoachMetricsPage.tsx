import { CoachLayout } from "@/components/CoachLayout";
import { clients, weeklyCheckIns, goals as allGoals, coachHelpRadarItems } from "@/lib/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, TrendingUp, Target, AlertTriangle, DollarSign, CheckCircle2, XCircle, Calendar, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

// Mock extended data
const monthlyGoalData = [
  { month: "Nov", set: 12, completed: 9, missed: 3, stakes: 225 },
  { month: "Dec", set: 14, completed: 11, missed: 2, stakes: 150 },
  { month: "Jan", set: 15, completed: 12, missed: 3, stakes: 225 },
  { month: "Feb", set: 13, completed: 10, missed: 2, stakes: 150 },
  { month: "Mar", set: 16, completed: 13, missed: 3, stakes: 225 },
  { month: "Apr", set: 14, completed: 10, missed: 1, stakes: 75 },
];

const clientCheckInHistory: Record<string, boolean[]> = {
  "1": [true, true, true, true, true, true, true, true, true, true, true, true],
  "2": [true, true, false, true, true, false, true, true, true, false, true, false],
  "3": [true, true, true, true, true, true, true, true, true, true, true, true],
  "4": [true, false, true, false, true, false, false, true, false, true, false, false],
  "5": [true, true, true, true, false, true, true, true, true, true, true, true],
};

const atRiskGoals = [
  { clientId: "2", clientName: "Sarah Kim", goalTitle: "Morning meditation 5x/week", dueDate: "Apr 12", status: "at_risk", daysUntilDue: 2, lastCheckIn: "5 days ago" },
  { clientId: "4", clientName: "Priya Patel", goalTitle: "Complete client proposal", dueDate: "Apr 14", status: "at_risk", daysUntilDue: 4, lastCheckIn: "8 days ago" },
  { clientId: "4", clientName: "Priya Patel", goalTitle: "Launch personal website", dueDate: "Apr 17", status: "active", daysUntilDue: 7, lastCheckIn: "8 days ago" },
  { clientId: "2", clientName: "Sarah Kim", goalTitle: "Read leadership book", dueDate: "Apr 16", status: "active", daysUntilDue: 6, lastCheckIn: "5 days ago" },
];

export default function CoachMetricsPage() {
  const avgScore = Math.round(clients.reduce((s, c) => s + c.score, 0) / clients.length);
  const totalMissed = clients.reduce((s, c) => s + c.missedGoals, 0);
  const perfectMonthClients = clients.filter(c => c.perfectMonths > 0 && c.score >= 90).length;
  const noCheckInThisWeek = clients.filter(c => c.lastCheckIn.includes("5") || c.lastCheckIn.includes("8")).length;
  const checkInRate = Math.round(((clients.length - noCheckInThisWeek) / clients.length) * 100);

  // Performance distribution
  const distribution = [
    { range: "90-100", count: clients.filter(c => c.score >= 90).length, color: "hsl(45 100% 51%)" },
    { range: "75-89", count: clients.filter(c => c.score >= 75 && c.score < 90).length, color: "hsl(45 80% 55%)" },
    { range: "60-74", count: clients.filter(c => c.score >= 60 && c.score < 75).length, color: "hsl(30 80% 55%)" },
    { range: "45-59", count: clients.filter(c => c.score >= 45 && c.score < 60).length, color: "hsl(15 80% 55%)" },
    { range: "Below 45", count: clients.filter(c => c.score < 45).length, color: "hsl(0 72% 51%)" },
  ];

  const weeks = Array.from({ length: 12 }, (_, i) => `W${i + 1}`);

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Metrics & Performance</h1>
      <p className="text-muted-foreground mb-8">Practice-level performance, risk tracking, and client analytics.</p>

      {/* Summary Stat Bar */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8">
        <Link to="/coach/clients" className="rounded-lg border border-border bg-card p-4 shadow-card hover:border-primary/50 transition-colors">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Users size={12} /> Active Clients</span>
          <div className="text-2xl font-display font-bold text-foreground mt-1">{clients.length}</div>
        </Link>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><TrendingUp size={12} /> Avg Score</span>
          <div className="text-2xl font-display font-bold text-foreground mt-1">{avgScore}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Target size={12} /> Active Goals</span>
          <div className="text-2xl font-display font-bold text-foreground mt-1">14</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><CheckCircle2 size={12} /> Completed (Month)</span>
          <div className="text-2xl font-display font-bold text-success mt-1">10</div>
        </div>
        <Link to="#at-risk" className="rounded-lg border border-warning/30 bg-warning/5 p-4 shadow-card hover:border-warning/50 transition-colors">
          <span className="text-xs font-medium uppercase tracking-wider text-warning flex items-center gap-1"><AlertTriangle size={12} /> At Risk</span>
          <div className="text-2xl font-display font-bold text-warning mt-1">{atRiskGoals.length}</div>
        </Link>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><XCircle size={12} /> Missed (Month)</span>
          <div className="text-2xl font-display font-bold text-danger mt-1">{totalMissed}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><DollarSign size={12} /> Stakes Charged</span>
          <div className="text-2xl font-display font-bold text-foreground mt-1">${totalMissed * 75}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Check-In Rate</span>
          <div className="text-2xl font-display font-bold text-foreground mt-1">{checkInRate}%</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1">🏆 Perfect Months</span>
          <div className="text-2xl font-display font-bold text-primary mt-1">{perfectMonthClients}</div>
        </div>
        <div className="rounded-lg border border-danger/30 bg-danger/5 p-4 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wider text-danger flex items-center gap-1">⚠️ No Check-In</span>
          <div className="text-2xl font-display font-bold text-danger mt-1">{noCheckInThisWeek}</div>
        </div>
      </div>

      {/* Section 1: At Risk Right Now */}
      <div id="at-risk" className="rounded-lg border border-warning/30 bg-card p-5 shadow-card mb-8">
        <h3 className="font-display font-semibold mb-4 text-warning flex items-center gap-2">
          <AlertTriangle size={18} /> At Risk Right Now
        </h3>
        <div className="space-y-2">
          {atRiskGoals.sort((a, b) => a.daysUntilDue - b.daysUntilDue).map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-md border border-border bg-background">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  item.daysUntilDue <= 3 ? "bg-danger" : item.daysUntilDue <= 7 ? "bg-warning" : "bg-muted-foreground"
                }`} />
                <div className="min-w-0">
                  <Link to={`/coach/clients/${item.clientId}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                    {item.clientName}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{item.goalTitle} · Due {item.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.status === "at_risk" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                }`}>
                  {item.status === "at_risk" ? "At Risk" : "Active"}
                </span>
                <span className={`text-sm font-bold ${item.daysUntilDue <= 3 ? "text-danger" : "text-foreground"}`}>
                  {item.daysUntilDue}d
                </span>
                <span className="text-xs text-muted-foreground hidden md:inline">Last: {item.lastCheckIn}</span>
                <Link to="/coach/messages" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  <MessageSquare size={12} /> Message
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2 & 3: Charts side by side */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Performance Distribution */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="range" stroke="hsl(0 0% 55%)" fontSize={11} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)", fontSize: "12px" }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {distribution.map((entry, idx) => (
                  <rect key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-primary" /> Gold = 90+</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm inline-block bg-danger" /> Red = Below 45</span>
          </div>
        </div>

        {/* Goal Completion Trend */}
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Goal Completion Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyGoalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="month" stroke="hsl(0 0% 55%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)", fontSize: "12px" }} />
              <Line type="monotone" dataKey="set" stroke="hsl(0 0% 55%)" strokeWidth={1.5} dot={false} name="Goals Set" />
              <Line type="monotone" dataKey="completed" stroke="hsl(142 76% 36%)" strokeWidth={2} dot={{ fill: "hsl(142 76% 36%)", r: 3 }} name="Completed" />
              <Line type="monotone" dataKey="missed" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ fill: "hsl(0 72% 51%)", r: 3 }} name="Missed" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-muted-foreground inline-block rounded" /> Set</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success inline-block rounded" /> Completed</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-danger inline-block rounded" /> Missed</span>
          </div>
        </div>
      </div>

      {/* Section 4: Check-In Consistency Heatmap */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card mb-8">
        <h3 className="font-display font-semibold mb-4">Check-In Consistency (12 Weeks)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left px-3 py-2 font-medium text-muted-foreground w-32">Client</th>
                {weeks.map(w => (
                  <th key={w} className="px-1 py-2 font-medium text-muted-foreground text-center">{w}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => {
                const history = clientCheckInHistory[c.id] || [];
                return (
                  <tr key={c.id}>
                    <td className="px-3 py-1.5">
                      <Link to={`/coach/clients/${c.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {c.name}
                      </Link>
                    </td>
                    {history.map((checked, i) => (
                      <td key={i} className="px-1 py-1.5 text-center">
                        <span className={`inline-block w-5 h-5 rounded ${
                          checked ? "bg-success/80" : "bg-danger/80"
                        }`} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-success/80 rounded inline-block" /> Checked In</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-danger/80 rounded inline-block" /> Missed</span>
        </div>
      </div>
    </CoachLayout>
  );
}

import { CoachLayout } from "@/components/CoachLayout";
import { StatCard } from "@/components/StatCard";
import { weeklyCheckIns, clients } from "@/lib/mockData";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, Target, Users, TrendingUp } from "lucide-react";

const revenueData = [
  { month: "Jan", subscriptions: 495, stakes: 150 },
  { month: "Feb", subscriptions: 495, stakes: 75 },
  { month: "Mar", subscriptions: 495, stakes: 225 },
  { month: "Apr", subscriptions: 495, stakes: 150 },
];

export default function CoachMetricsPage() {
  const avgScore = Math.round(clients.reduce((s, c) => s + c.score, 0) / clients.length);

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Metrics & Revenue</h1>
      <p className="text-muted-foreground mb-8">Practice-level performance and revenue data.</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Monthly Revenue" value="$1,245" change="+12%" trend="up" icon={DollarSign} />
        <StatCard label="Avg Client Score" value={avgScore} change="Across all clients" trend="up" icon={TrendingUp} />
        <StatCard label="Goal Completion" value="76%" change="This month" trend="neutral" icon={Target} />
        <StatCard label="Check-In Rate" value="88%" change="5 of 5 clients" trend="up" icon={Users} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="month" stroke="hsl(0 0% 55%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)", fontSize: "12px" }}
              />
              <Bar dataKey="subscriptions" fill="hsl(45 100% 51%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stakes" fill="hsl(0 72% 51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded-sm inline-block" /> Subscriptions</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-danger rounded-sm inline-block" /> Stakes</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Avg Score Trend (Cohort)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyCheckIns}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
              <XAxis dataKey="week" stroke="hsl(0 0% 55%)" fontSize={12} />
              <YAxis stroke="hsl(0 0% 55%)" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)", fontSize: "12px" }}
              />
              <Line type="monotone" dataKey="score" stroke="hsl(45 100% 51%)" strokeWidth={2} dot={{ fill: "hsl(45 100% 51%)", r: 4 }} />
              <Line type="monotone" dataKey="habits" stroke="hsl(142 76% 36%)" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Score</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success inline-block rounded" /> Habits</span>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}

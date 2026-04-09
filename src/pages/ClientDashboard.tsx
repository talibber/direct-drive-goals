import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { GoalCard } from "@/components/GoalCard";
import { GamificationPanel } from "@/components/GamificationPanel";
import { weeklyCheckIns, goals, coachNotes, billingHistory, clientPerfectMonth, clientResetSession } from "@/lib/mockData";
import { Activity, Target, Flame, DollarSign, Trophy, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ClientDashboard() {
  const latestScore = weeklyCheckIns[weeklyCheckIns.length - 1].score;
  const pm = clientPerfectMonth;
  const rs = clientResetSession;

  return (
    <DashboardLayout>
      {/* Perfect Month Banner */}
      {pm.active && (
        <div className="mb-6 rounded-lg bg-gradient-gold p-5 shadow-card">
          <div className="flex items-center gap-3">
            <Trophy size={28} className="text-primary-foreground" />
            <div>
              <p className="font-display font-bold text-primary-foreground text-lg">
                Perfect Month — All goals completed and verified.
              </p>
              <p className="text-sm text-primary-foreground/80 mt-0.5">
                {pm.callScheduledAt
                  ? `Next Level Call scheduled for ${pm.callScheduledAt}`
                  : "Next Level Call scheduled."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Session Notification */}
      {rs.enrolled && !rs.completed && (
        <div className="mb-6 rounded-lg border-2 border-danger/30 bg-danger/5 p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <RotateCcw size={24} className="text-danger mt-0.5" />
              <div>
                <p className="font-display font-bold text-foreground">
                  Goal missed. $75 stake charged.
                </p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  You've been enrolled in this month's Reset Session. The Reset is a group coaching call where we address common patterns, recalibrate, and set the next commitment. No one is called out. Everyone benefits.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/reset-session"
              className="px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-md hover:bg-foreground/90 transition-colors flex-shrink-0 whitespace-nowrap"
            >
              View Session Date
            </Link>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold">Welcome back, Marcus</h1>
        <p className="text-muted-foreground mt-1">Here's your performance snapshot.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard label="Performance Score" value={pm.active ? latestScore + 10 : latestScore} change={pm.active ? "+10 Perfect Month bonus" : "+5 from last week"} trend="up" icon={Activity} />
        <StatCard label="Goal Completion" value="80%" change="8 of 10 goals" trend="up" icon={Target} />
        <StatCard label="Check-In Streak" value="6 wks" change="Personal best!" trend="up" icon={Flame} />
        <StatCard label="Perfect Months" value={pm.perfectMonthCount} change="Lifetime total" trend="up" icon={Trophy} />
        <StatCard label="Stakes Charged" value="$150" change="2 missed goals" trend="down" icon={DollarSign} />
      </div>

      {/* Level & Badges */}
      <div className="mb-8">
        <GamificationPanel />
      </div>

      {/* Performance Chart */}
      <div className="rounded-lg border border-border bg-card p-5 shadow-card mb-8">
        <h3 className="font-display font-semibold mb-4">Performance Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklyCheckIns}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
            <XAxis dataKey="week" stroke="hsl(0 0% 55%)" fontSize={12} />
            <YAxis stroke="hsl(0 0% 55%)" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0 0% 7%)",
                border: "1px solid hsl(0 0% 14%)",
                borderRadius: "8px",
                color: "hsl(0 0% 95%)",
                fontSize: "12px",
              }}
            />
            <Line type="monotone" dataKey="score" stroke="hsl(45 100% 51%)" strokeWidth={2} dot={{ fill: "hsl(45 100% 51%)", r: 4 }} />
            <Line type="monotone" dataKey="energy" stroke="hsl(142 76% 36%)" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="focus" stroke="hsl(200 80% 60%)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Score</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success inline-block rounded" /> Energy</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: "hsl(200 80% 60%)" }} /> Focus</span>
        </div>
      </div>

      {/* Goals */}
      <div className="mb-8">
        <h3 className="font-display font-semibold mb-4">Active Goals</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <GoalCard key={g.id} {...g} />
          ))}
        </div>
      </div>

      {/* Coach Notes + Billing */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Coach Notes</h3>
          <div className="space-y-4">
            {coachNotes.map((n, i) => (
              <div key={i} className="border-l-2 border-primary/30 pl-4">
                <p className="text-xs text-muted-foreground mb-1">{n.date}</p>
                <p className="text-sm text-foreground leading-relaxed">{n.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="font-display font-semibold mb-4">Recent Billing</h3>
          <div className="space-y-3">
            {billingHistory.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="text-sm text-foreground">{b.description}</p>
                  <p className="text-xs text-muted-foreground">{b.date}</p>
                </div>
                <span className={`text-sm font-semibold ${b.type === "stake" ? "text-danger" : "text-foreground"}`}>
                  ${b.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

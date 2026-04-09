import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { StatCard } from "@/components/StatCard";
import { CoachGoalReviewPanel } from "@/components/CoachGoalReviewPanel";
import { CoachGoalVerifyPanel } from "@/components/CoachGoalVerifyPanel";
import { PerfectMonthSchedulePanel } from "@/components/PerfectMonthSchedulePanel";
import { clients, applications, pendingCoachGoals, proofSubmittedGoals as initialProofGoals, perfectMonthAlerts as initialAlerts, resetSessions as initialResetSessions, resetSessionEngagements, type Goal, type PerfectMonthAlert, type ResetSession } from "@/lib/mockData";
import { Users, AlertTriangle, DollarSign, ClipboardCheck, Target, FileCheck, Trophy, RotateCcw, Upload, Link2, Send, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function CoachDashboard() {
  const atRisk = clients.filter((c) => c.risk);
  const pendingApps = applications.filter((a) => a.status === "pending");

  const [pendingGoals, setPendingGoals] = useState<Goal[]>(pendingCoachGoals);
  const [proofGoals, setProofGoals] = useState<Goal[]>(initialProofGoals);
  const [reviewGoal, setReviewGoal] = useState<Goal | null>(null);
  const [verifyGoal, setVerifyGoal] = useState<Goal | null>(null);
  const [pmAlerts, setPmAlerts] = useState<PerfectMonthAlert[]>(initialAlerts);
  const [scheduleAlert, setScheduleAlert] = useState<PerfectMonthAlert | null>(null);

  const handleGoalAction = (goalId: string, action: "approved" | "revision_requested" | "rejected", notes?: string) => {
    setPendingGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleVerifyAction = (goalId: string, action: "verified" | "waived" | "missed", note?: string) => {
    setProofGoals((prev) => prev.filter((g) => g.id !== goalId));
  };

  const handleSchedulePM = (alertId: string, data: { scheduledAt: string; title: string; notes: string }) => {
    setPmAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, callScheduled: true, callScheduledAt: data.scheduledAt, callTitle: data.title, coachNotes: data.notes }
          : a
      )
    );
  };

  const unscheduledAlerts = pmAlerts.filter((a) => !a.callScheduled);

  return (
    <CoachLayout>
      <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Coach Dashboard</h1>
      <p className="text-muted-foreground mb-8">Overview of your coaching practice.</p>

      {/* Perfect Month Alerts */}
      {unscheduledAlerts.length > 0 && (
        <div className="mb-8 space-y-3">
          {unscheduledAlerts.map((alert) => (
            <div key={alert.id} className="rounded-lg bg-gradient-gold p-5 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Trophy size={24} className="text-primary-foreground" />
                  <div>
                    <p className="font-display font-bold text-primary-foreground text-lg">
                      {alert.clientName} just completed all goals this month.
                    </p>
                    <p className="text-sm text-primary-foreground/80 mt-0.5">
                      Time to talk about the next level.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setScheduleAlert(alert)}
                  className="px-4 py-2 bg-background text-foreground text-sm font-semibold rounded-md hover:bg-background/90 transition-colors flex-shrink-0"
                >
                  Schedule Next Level Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard label="Active Clients" value={clients.length} icon={Users} />
        <StatCard label="At-Risk Clients" value={atRisk.length} change="Need attention" trend="down" icon={AlertTriangle} />
        <StatCard label="Pending Applications" value={pendingApps.length} icon={ClipboardCheck} />
        <StatCard label="Revenue (MTD)" value="$1,245" change="+12% from last month" trend="up" icon={DollarSign} />
      </div>

      {/* Priority widgets row */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {/* Goals Awaiting Approval */}
        {pendingGoals.length > 0 && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
            <h3 className="font-display font-semibold text-primary mb-3 flex items-center gap-2">
              <Target size={18} /> Goals Awaiting Approval
              <span className="ml-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                {pendingGoals.length}
              </span>
            </h3>
            <div className="space-y-3">
              {pendingGoals.map((g) => (
                <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{g.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.clientName} · {g.category} · Due {g.dueDate}
                      {g.resubmissionCount > 0 && <span className="text-warning ml-1">(resubmission)</span>}
                    </p>
                  </div>
                  <button onClick={() => setReviewGoal(g)} className="text-xs font-medium text-primary hover:underline">
                    Review →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals to Verify */}
        {proofGoals.length > 0 && (
          <div className="rounded-lg border border-success/30 bg-success/5 p-5">
            <h3 className="font-display font-semibold text-success mb-3 flex items-center gap-2">
              <FileCheck size={18} /> Goals to Verify
              <span className="ml-1 text-xs font-bold bg-success text-success-foreground rounded-full w-5 h-5 flex items-center justify-center">
                {proofGoals.length}
              </span>
            </h3>
            <div className="space-y-3">
              {proofGoals.map((g) => (
                <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{g.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {g.clientName} · Submitted {g.proofSubmittedAt}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                        (g.selfAssessment === "completed" || g.selfCompleted)
                          ? "text-success bg-success/10" : "text-danger bg-danger/10"
                      }`}>
                        {(g.selfAssessment === "completed" || g.selfCompleted) ? "Client says completed" : "Client self-reported missed"}
                      </span>
                      {(g.proofFileUrls?.length ?? 0) > 0 && (
                        <span className="text-xs text-muted-foreground">{g.proofFileUrls!.length} file{g.proofFileUrls!.length > 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setVerifyGoal(g)} className="text-xs font-medium text-success hover:underline">
                    Verify →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reset Session Widget */}
      {resetSessions.length > 0 && (
        <div className="mb-8">
          {resetSessions.filter((s) => !s.completed).map((session) => {
            const enrolledClientNames = clients.filter((c) => session.enrolledClients.includes(c.id));
            return (
              <div key={session.id} className="rounded-lg border border-danger/30 bg-card p-5">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <RotateCcw size={18} className="text-danger" /> Reset Session — {session.month}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Next Session</p>
                      <p className="text-sm font-medium text-foreground">{session.sessionDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Enrolled Clients ({enrolledClientNames.length})</p>
                      <div className="space-y-1">
                        {enrolledClientNames.map((c) => (
                          <p key={c.id} className="text-sm text-foreground">{c.name} · Score: {c.score}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Common Patterns (Coach Prep — Private)</p>
                    <textarea
                      defaultValue={session.sessionNotes || ""}
                      placeholder="Note common themes without attributing to specific clients..."
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-y"
                    />
                    <button className="mt-2 text-xs font-medium text-primary hover:underline">
                      Send Session Reminder
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* At-risk */}
      {atRisk.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-5 mb-8">
          <h3 className="font-display font-semibold text-warning mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Clients Needing Attention
          </h3>
          <div className="space-y-3">
            {atRisk.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Last check-in: {c.lastCheckIn} · Score: {c.score}</p>
                </div>
                <Link to="/coach/clients" className="text-xs text-primary hover:underline">View →</Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All clients table */}
      <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="font-display font-semibold">All Clients</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Type</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Score</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Perfect Months</th>
                <th className="px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Last Check-In</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.type}</td>
                  <td className="px-5 py-3">
                    <span className={`font-semibold ${c.score >= 80 ? "text-success" : c.score >= 60 ? "text-warning" : "text-danger"}`}>
                      {c.score}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {c.perfectMonths > 0 ? (
                      <span className="inline-flex items-center gap-1 text-primary font-semibold">
                        <Trophy size={12} /> {c.perfectMonths}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{c.lastCheckIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Verify & Schedule Panels */}
      <CoachGoalReviewPanel
        goal={reviewGoal}
        open={!!reviewGoal}
        onClose={() => setReviewGoal(null)}
        onAction={handleGoalAction}
      />
      <CoachGoalVerifyPanel
        goal={verifyGoal}
        open={!!verifyGoal}
        onClose={() => setVerifyGoal(null)}
        onAction={handleVerifyAction}
      />
      <PerfectMonthSchedulePanel
        alert={scheduleAlert}
        open={!!scheduleAlert}
        onClose={() => setScheduleAlert(null)}
        onSchedule={handleSchedulePM}
      />
    </CoachLayout>
  );
}

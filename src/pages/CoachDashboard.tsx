import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { StatCard } from "@/components/StatCard";
import { CoachGoalReviewPanel } from "@/components/CoachGoalReviewPanel";
import { CoachGoalVerifyPanel } from "@/components/CoachGoalVerifyPanel";
import { PerfectMonthSchedulePanel } from "@/components/PerfectMonthSchedulePanel";
import { CoachOnboardingPanel } from "@/components/CoachOnboardingPanel";
import { clients, applications, pendingCoachGoals, proofSubmittedGoals as initialProofGoals, perfectMonthAlerts as initialAlerts, resetSessions as initialResetSessions, resetSessionEngagements, coachHelpRadarItems, missedGoalReports, type Goal, type PerfectMonthAlert, type ResetSession, type HelpRadarItem } from "@/lib/mockData";
import { Users, AlertTriangle, DollarSign, ClipboardCheck, Target, FileCheck, Trophy, RotateCcw, Upload, Link2, Send, Eye, EyeOff, CheckCircle2, Radio } from "lucide-react";
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
  const [rSessions, setRSessions] = useState<ResetSession[]>(initialResetSessions);
  const [recordingInput, setRecordingInput] = useState<Record<string, string>>({});
  const [radarItems, setRadarItems] = useState<HelpRadarItem[]>(coachHelpRadarItems);
  const [radarTab, setRadarTab] = useState<"items" | "insights">("items");
  const [radarNote, setRadarNote] = useState<Record<string, string>>({});
  const [radarStatus, setRadarStatus] = useState<Record<string, string>>({});

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

      {/* New Clients — Onboarding */}
      <CoachOnboardingPanel />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        <Link to="/coach/clients">
          <StatCard label="Active Clients" value={clients.length} icon={Users} className="hover:border-primary/50 transition-colors cursor-pointer" />
        </Link>
        <Link to="/coach/metrics#at-risk">
          <StatCard label="At-Risk Clients" value={atRisk.length} change="Need attention" trend="down" icon={AlertTriangle} className="hover:border-primary/50 transition-colors cursor-pointer" />
        </Link>
        <Link to="/coach/applications">
          <StatCard label="Pending Applications" value={pendingApps.length} icon={ClipboardCheck} className="hover:border-primary/50 transition-colors cursor-pointer" />
        </Link>
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

      {/* Reset Session Widgets */}
      {rSessions.length > 0 && (
        <div className="mb-8 space-y-4">
          {/* Upcoming sessions */}
          {rSessions.filter((s) => !s.completed).map((session) => {
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

                {/* Client Miss Reasons — This Month */}
                {missedGoalReports.length > 0 && (
                  <div className="mt-6 border-t border-border pt-5">
                    <h4 className="text-sm font-semibold text-foreground mb-4">Client Miss Reasons — This Month</h4>
                    
                    {/* Root cause breakdown */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Root Cause Breakdown</p>
                      <div className="space-y-1.5">
                        {(() => {
                          const counts: Record<string, number> = {};
                          missedGoalReports.forEach(r => { counts[r.rootCauseCategory] = (counts[r.rootCauseCategory] || 0) + 1; });
                          return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([cause, count]) => (
                            <div key={cause} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{cause}</span>
                              <span className="font-semibold text-foreground">{count}</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Pattern split */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Pattern Recognition</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-warning font-medium">{missedGoalReports.filter(r => r.isFamiliarPattern).length} familiar</span>
                        <span className="text-muted-foreground">{missedGoalReports.filter(r => !r.isFamiliarPattern).length} new</span>
                      </div>
                    </div>

                    {/* Anonymous explanations */}
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">What Clients Said (Anonymous)</p>
                      <div className="space-y-2">
                        {missedGoalReports.map((r, i) => (
                          <div key={r.id} className="rounded-md border border-border bg-background p-3">
                            <p className="text-sm text-foreground leading-relaxed italic">"{r.fullExplanation}"</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Commitments */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Commitments (Reset Prep)</p>
                      <div className="space-y-2">
                        {missedGoalReports.map(r => (
                          <div key={r.id} className="rounded-md border border-primary/20 bg-primary/5 p-3">
                            <p className="text-sm text-foreground leading-relaxed">{r.nextCommitment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Completed sessions with recording workflow */}
          {rSessions.filter((s) => s.completed).map((session) => {
            const enrolledClientNames = clients.filter((c) => session.enrolledClients.includes(c.id));
            const engagements = resetSessionEngagements.filter((e) => e.sessionId === session.id);
            const hasRecording = !!session.recordingUrl;
            const recordingSent = !!session.recordingSentAt;

            return (
              <div key={session.id} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-success" /> Reset Session — {session.month}
                  <span className="text-xs font-normal text-muted-foreground ml-auto">Completed</span>
                </h3>

                {/* Recording upload/link */}
                {!hasRecording && (
                  <div className="mb-4 p-4 rounded-md border border-dashed border-primary/30 bg-primary/5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Upload size={12} /> Upload or link session recording
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recordingInput[session.id] || ""}
                        onChange={(e) => setRecordingInput((prev) => ({ ...prev, [session.id]: e.target.value }))}
                        placeholder="Paste Loom, YouTube, Vimeo link or upload URL..."
                        className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={() => {
                          const url = recordingInput[session.id]?.trim();
                          if (!url) return;
                          setRSessions((prev) => prev.map((s) => s.id === session.id ? { ...s, recordingUrl: url, recordingUploadedAt: new Date().toISOString() } : s));
                          toast.success("Recording saved.");
                        }}
                        className="px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90"
                      >
                        <Link2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Accepts: MP4, MOV, MP3, M4A, or video links (Loom, YouTube, Vimeo)</p>
                  </div>
                )}

                {hasRecording && !recordingSent && (
                  <div className="mb-4 p-4 rounded-md border border-success/30 bg-success/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">Recording ready</p>
                        <p className="text-xs text-muted-foreground truncate max-w-md">{session.recordingUrl}</p>
                      </div>
                      <button
                        onClick={() => {
                          setRSessions((prev) => prev.map((s) => s.id === session.id ? { ...s, recordingSentAt: new Date().toISOString() } : s));
                          toast.success(`Recording sent to ${enrolledClientNames.length} enrolled clients.`);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90"
                      >
                        <Send size={14} /> Send to Enrolled Clients
                      </button>
                    </div>
                  </div>
                )}

                {recordingSent && (
                  <p className="text-xs text-success mb-4 flex items-center gap-1">
                    <CheckCircle2 size={14} /> Recording sent to enrolled clients on {session.recordingSentAt}
                  </p>
                )}

                {/* Commitment Tracking */}
                {recordingSent && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Commitment Tracking</p>
                    <div className="space-y-2">
                      {enrolledClientNames.map((c) => {
                        const eng = engagements.find((e) => e.clientId === c.id);
                        const noResponse = !eng || (!eng.recordingWatched && !eng.commitmentSubmitted);
                        return (
                          <div key={c.id} className={`flex items-center justify-between py-2 px-3 rounded-md ${noResponse ? "bg-danger/5 border border-danger/20" : "bg-secondary/30"}`}>
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-medium text-foreground">{c.name}</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className={`flex items-center gap-1 ${eng?.recordingWatched ? "text-success" : "text-muted-foreground"}`}>
                                {eng?.recordingWatched ? <Eye size={12} /> : <EyeOff size={12} />}
                                {eng?.recordingWatched ? "Watched" : "Not watched"}
                              </span>
                              <span className={`flex items-center gap-1 ${eng?.commitmentSubmitted ? "text-success" : "text-muted-foreground"}`}>
                                {eng?.commitmentSubmitted ? <CheckCircle2 size={12} /> : "—"}
                                {eng?.commitmentSubmitted ? "Committed" : "No commitment"}
                              </span>
                              {noResponse && (
                                <span className="text-danger font-semibold">No response</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Help Radar Widget */}
      {radarItems.length > 0 && (
        <div className="rounded-lg border border-primary/30 bg-card p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
              <Radio size={18} className="text-primary" /> Help Radar
              <span className="ml-1 text-xs font-bold bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center">
                {radarItems.filter((i) => !i.resolvedByClient && i.coachStatus !== "addressed").length}
              </span>
            </h3>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => setRadarTab("items")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${radarTab === "items" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Items
              </button>
              <button
                onClick={() => setRadarTab("insights")}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${radarTab === "insights" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                Radar Insights
              </button>
            </div>
          </div>

          {radarTab === "items" && (
            <div className="space-y-3">
              {radarItems
                .filter((i) => !i.resolvedByClient)
                .sort((a, b) => new Date(b.flaggedAt).getTime() - new Date(a.flaggedAt).getTime())
                .map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="text-sm font-medium text-foreground">{item.clientName}</p>
                          <span className="text-xs text-muted-foreground">·</span>
                          <p className="text-sm text-primary font-medium">{item.category}</p>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            item.coachStatus === "addressed" ? "bg-success/10 text-success" :
                            item.coachStatus === "on_deck" ? "bg-primary/10 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {item.coachStatus === "addressed" ? "Addressed" : item.coachStatus === "on_deck" ? "On Deck" : "Seen"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">Flagged {item.flaggedAt}</p>
                        {item.context && (
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.context}</p>
                        )}

                        {/* Coach response area */}
                        <div className="mt-3 space-y-2">
                          <textarea
                            value={radarNote[item.id] ?? item.coachNote ?? ""}
                            onChange={(e) => setRadarNote((prev) => ({ ...prev, [item.id]: e.target.value }))}
                            placeholder="This note goes directly to the client. Be direct."
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[50px] resize-y"
                          />
                          <div className="flex items-center gap-2">
                            <select
                              value={radarStatus[item.id] ?? item.coachStatus}
                              onChange={(e) => setRadarStatus((prev) => ({ ...prev, [item.id]: e.target.value }))}
                              className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                              <option value="seen">Seen</option>
                              <option value="on_deck">On Deck</option>
                              <option value="addressed">Addressed</option>
                            </select>
                            <button
                              onClick={() => {
                                const newStatus = (radarStatus[item.id] ?? item.coachStatus) as HelpRadarItem["coachStatus"];
                                const newNote = radarNote[item.id] ?? item.coachNote ?? "";
                                setRadarItems((prev) => prev.map((i) => i.id === item.id ? {
                                  ...i,
                                  coachStatus: newStatus,
                                  coachNote: newNote || null,
                                  addressedAt: newStatus === "addressed" ? new Date().toISOString() : i.addressedAt,
                                } : i));
                                toast.success(newStatus === "addressed" ? "Challenge marked as addressed. Client notified." : "Status updated.");
                              }}
                              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:bg-primary/90"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {radarTab === "insights" && (() => {
            const active = radarItems.filter((i) => !i.resolvedByClient);
            const addressed = active.filter((i) => i.coachStatus === "addressed").length;
            const total = active.length;

            // Top categories
            const catCounts: Record<string, number> = {};
            active.forEach((i) => { catCounts[i.category] = (catCounts[i.category] || 0) + 1; });
            const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
            const maxCount = topCats[0]?.[1] || 1;

            // High need clients (3+ unaddressed)
            const clientCounts: Record<string, { name: string; count: number }> = {};
            active.filter((i) => i.coachStatus !== "addressed").forEach((i) => {
              if (!clientCounts[i.clientId]) clientCounts[i.clientId] = { name: i.clientName || "", count: 0 };
              clientCounts[i.clientId].count++;
            });
            const highNeed = Object.values(clientCounts).filter((c) => c.count >= 3);

            return (
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Top 5 Flagged Categories This Month</p>
                  <div className="space-y-2">
                    {topCats.map(([cat, count]) => (
                      <div key={cat} className="flex items-center gap-3">
                        <p className="text-sm text-foreground w-40 shrink-0 truncate">{cat}</p>
                        <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-gold rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-foreground w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Completion Rate</p>
                    <p className="text-2xl font-display font-bold text-foreground">
                      {total > 0 ? Math.round((addressed / total) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">{addressed} of {total} addressed</p>
                  </div>
                </div>

                {highNeed.length > 0 && (
                  <div>
                    <p className="text-xs text-danger uppercase tracking-wider font-semibold mb-2">High Need — Review Soon</p>
                    <div className="space-y-1">
                      {highNeed.map((c) => (
                        <p key={c.name} className="text-sm text-danger font-medium">{c.name} — {c.count} unaddressed challenges</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {atRisk.length > 0 && (
        <div className="rounded-lg border border-warning/30 bg-warning/5 p-5 mb-8">
          <h3 className="font-display font-semibold text-warning mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> Clients Needing Attention
          </h3>
          <div className="space-y-3">
            {atRisk.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-medium text-foreground"><Link to={`/coach/clients/${c.id}`} className="hover:text-primary transition-colors">{c.name}</Link></p>
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
                  <td className="px-5 py-3 font-medium text-foreground">
                    <Link to={`/coach/clients/${c.id}`} className="hover:text-primary transition-colors">{c.name}</Link>
                  </td>
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

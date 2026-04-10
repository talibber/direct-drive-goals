import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CoachLayout } from "@/components/CoachLayout";
import { clients, weeklyCheckIns, goals, goalApprovalHistory, goalDecisionHistory, coachHelpRadarItems, resetSessionEngagements, resetSessions, clientAchievements, levels, applications, missedGoalReports } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, Trophy, Target, Calendar, Shield, MessageSquare, FileText, Award, TrendingUp, Send } from "lucide-react";
import { CoachAssessmentPanel } from "@/components/CoachAssessmentPanel";

const allTabs = ["Overview", "Goals", "Check-Ins", "Assessment", "Application", "Messages", "Sessions", "Direct Access"] as const;
type Tab = typeof allTabs[number];

export default function CoachClientDetailPage() {
  const { clientId } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");

  const client = clients.find(c => c.id === clientId);
  if (!client) {
    return (
      <CoachLayout>
        <p className="text-muted-foreground">Client not found.</p>
        <Link to="/coach/clients" className="text-primary hover:underline text-sm">← Back to Clients</Link>
      </CoachLayout>
    );
  }

  const isBusiness = client.type === "Business";
  const tabs = isBusiness ? allTabs : allTabs.filter(t => t !== "Direct Access");
  const clientRadarItems = coachHelpRadarItems.filter(i => i.clientId === clientId);
  const clientEngagements = resetSessionEngagements.filter(e => e.clientId === clientId);
  const clientLevel = levels.find(l => l.level === 4) || levels[0]; // Mock level
  const totalPoints = 1245;
  const monthlyPoints = 185;
  const streak = 6;
  const daysAsClient = 68;

  // Mock client goals
  const clientGoals = [
    { id: "g1", title: "Close 3 enterprise deals", status: "active", dueDate: "Apr 30", daysLeft: 20, category: "Business", stake: 75, progress: 66, coachDecision: null },
    { id: "g2", title: "Morning routine 6 days/week", status: "proof_pending", dueDate: "Apr 9", daysLeft: -1, category: "Life", stake: 75, progress: 83, coachDecision: null },
    { id: "g3", title: "Ship MVP by end of month", status: "at_risk", dueDate: "Apr 30", daysLeft: 20, category: "Business", stake: 75, progress: 40, coachDecision: null },
  ];

  const pastGoals = [
    { id: "pg1", title: "Daily journaling for 30 days", status: "missed", dueDate: "Mar 31", category: "Life", coachDecision: "missed", stake: 75 },
    { id: "pg2", title: "Launch landing page", status: "completed", dueDate: "Mar 15", category: "Business", coachDecision: "verified", stake: 75 },
    { id: "pg3", title: "Network at 3 events", status: "completed", dueDate: "Feb 28", category: "Business", coachDecision: "verified", stake: 75 },
  ];

  const stakeHistory = [
    { date: "Mar 31, 2026", goal: "Daily journaling", amount: 75 },
  ];

  const scoreTrend = weeklyCheckIns.map((w, i) => ({
    week: w.week,
    score: w.score,
    goals: Math.round(w.habits * 0.6 + 30),
  }));

  // Mock application data
  const app = applications.find(a => a.name === client.name) || {
    name: client.name,
    email: client.email,
    occupation: "Startup Founder",
    type: client.type,
    challenge: "Scaling business while maintaining work-life balance",
    submitted: "Feb 1, 2026",
    status: "approved",
  };

  return (
    <CoachLayout>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/coach/clients" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold">{client.name}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
              isBusiness ? "bg-primary text-primary-foreground" : "bg-foreground/10 text-foreground"
            }`}>
              {isBusiness ? "Business Track" : "Life Track"}
            </span>
            <span>{client.email}</span>
            <span>·</span>
            {!isBusiness && <>
              <span className="text-primary font-medium">Level {clientLevel.level} — {clientLevel.name}</span>
              <span>·</span>
              <span>{totalPoints} pts</span>
              <span>·</span>
            </>}
            <span>{streak}w streak</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/coach/messages"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Send size={12} /> Send Message
          </Link>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${
            client.score >= 80 ? "bg-success/10 text-success" :
            client.score >= 60 ? "bg-warning/10 text-warning" :
            "bg-danger/10 text-danger"
          }`}>
            Score: {client.score}
          </span>
          {client.risk && (
            <span className="text-xs font-medium px-2 py-1 rounded-full text-warning border border-warning/30 bg-warning/10">At Risk</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Days as Client</p>
              <p className="text-xl font-bold text-foreground mt-1">{daysAsClient}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Perfect Months</p>
              <p className="text-xl font-bold text-primary mt-1">{client.perfectMonths}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Goals Missed</p>
              <p className="text-xl font-bold text-danger mt-1">{client.missedGoals}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Stakes Charged</p>
              <p className="text-xl font-bold text-foreground mt-1">${stakeHistory.reduce((s, h) => s + h.amount, 0)}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Radar Items</p>
              <p className="text-xl font-bold text-foreground mt-1">{clientRadarItems.length}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Reset Sessions</p>
              <p className="text-xl font-bold text-foreground mt-1">{clientEngagements.length}</p>
            </div>
          </div>

          {/* Score Trend */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Performance Score Trend</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
                <XAxis dataKey="week" stroke="hsl(0 0% 55%)" fontSize={12} />
                <YAxis stroke="hsl(0 0% 55%)" fontSize={12} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="score" stroke="hsl(45 100% 51%)" strokeWidth={2} dot={{ fill: "hsl(45 100% 51%)", r: 4 }} name="Score" />
                <Line type="monotone" dataKey="goals" stroke="hsl(142 76% 36%)" strokeWidth={1.5} dot={false} name="Goal Completion %" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Badges — Life Track only */}
          {!isBusiness && (
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <h3 className="font-display font-semibold mb-3">Badges Earned</h3>
              <div className="flex flex-wrap gap-2">
                {clientAchievements.map(a => (
                  <span key={a.id} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    <Award size={12} /> {a.badgeName}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Stake History */}
          {stakeHistory.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <h3 className="font-display font-semibold mb-3">Stakes Charged</h3>
              <div className="space-y-2">
                {stakeHistory.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm text-foreground">{s.goal}</p>
                      <p className="text-xs text-muted-foreground">{s.date}</p>
                    </div>
                    <span className="text-sm font-bold text-danger">${s.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Radar */}
          {clientRadarItems.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-5 shadow-card">
              <h3 className="font-display font-semibold mb-3">Help Radar Items</h3>
              <div className="space-y-2">
                {clientRadarItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.category}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-md">{item.context}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      item.coachStatus === "addressed" ? "bg-success/10 text-success" :
                      item.coachStatus === "on_deck" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {item.coachStatus === "addressed" ? "Addressed" : item.coachStatus === "on_deck" ? "On Deck" : "Seen"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "Goals" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Active Goals</h3>
            <div className="space-y-3">
              {clientGoals.map(g => (
                <div key={g.id} className="flex items-center justify-between p-3 rounded-md border border-border bg-background">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{g.title}</p>
                    <p className="text-xs text-muted-foreground">{g.category} · Due {g.dueDate} · ${g.stake} stake</p>
                    <div className="w-32 h-1.5 bg-secondary rounded-full mt-1.5">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${g.progress}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      g.status === "at_risk" ? "bg-warning/10 text-warning" :
                      g.status === "proof_pending" ? "bg-primary/10 text-primary" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {g.status.replace(/_/g, " ")}
                    </span>
                    {g.daysLeft > 0 && (
                      <span className={`text-sm font-bold ${g.daysLeft <= 3 ? "text-danger" : "text-foreground"}`}>
                        {g.daysLeft}d
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Past Goals</h3>
            <div className="space-y-3">
              {pastGoals.map(g => {
                const missReport = g.coachDecision === "missed" ? missedGoalReports.find(r => r.clientId === clientId && r.goalTitle === g.title) : null;
                return (
                  <div key={g.id} className="rounded-md border border-border bg-background">
                    <div className="flex items-center justify-between p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{g.title}</p>
                        <p className="text-xs text-muted-foreground">{g.category} · Due {g.dueDate}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        g.coachDecision === "verified" ? "bg-success/10 text-success" :
                        g.coachDecision === "missed" ? "bg-danger/10 text-danger" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {g.coachDecision === "verified" ? "Completed" : g.coachDecision === "missed" ? "Missed ($75)" : g.status}
                      </span>
                    </div>
                    {missReport && (
                      <details className="border-t border-border">
                        <summary className="px-3 py-2 text-xs font-medium text-primary cursor-pointer hover:text-primary/80">
                          View Miss Report
                        </summary>
                        <div className="px-3 pb-3 space-y-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Root Cause</p>
                            <p className="text-sm text-foreground">{missReport.rootCauseCategory}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">What Happened</p>
                            <p className="text-sm text-foreground leading-relaxed">{missReport.fullExplanation}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Pattern</p>
                            <p className="text-sm text-foreground">{missReport.isFamiliarPattern ? `Familiar — ${missReport.patternDescription}` : "New pattern"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Commitment</p>
                            <p className="text-sm text-foreground">{missReport.nextCommitment}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">Submitted {missReport.submittedAt}</p>
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Goal Approval History</h3>
            <div className="space-y-2">
              {goalApprovalHistory.map(h => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm text-foreground">{h.goalTitle}</p>
                    <p className="text-xs text-muted-foreground">{h.createdAt}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    h.action === "approved" ? "bg-success/10 text-success" :
                    h.action === "revision_requested" ? "bg-warning/10 text-warning" :
                    "bg-danger/10 text-danger"
                  }`}>
                    {h.action.replace(/_/g, " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Check-Ins" && (
        <div className="space-y-6">
          {/* Metric Trends */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Metric Trends (8 Weeks)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weeklyCheckIns}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 14%)" />
                <XAxis dataKey="week" stroke="hsl(0 0% 55%)" fontSize={12} />
                <YAxis stroke="hsl(0 0% 55%)" fontSize={12} domain={[0, 10]} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(0 0% 7%)", border: "1px solid hsl(0 0% 14%)", borderRadius: "8px", color: "hsl(0 0% 95%)", fontSize: "12px" }} />
                <Line type="monotone" dataKey="energy" stroke="hsl(45 100% 51%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="stress" stroke="hsl(0 72% 51%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="focus" stroke="hsl(142 76% 36%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="confidence" stroke="hsl(200 80% 55%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="sleep" stroke="hsl(270 60% 60%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-primary inline-block rounded" /> Energy</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-danger inline-block rounded" /> Stress</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-success inline-block rounded" /> Focus</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: "hsl(200 80% 55%)" }} /> Confidence</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded inline-block" style={{ backgroundColor: "hsl(270 60% 60%)" }} /> Sleep</span>
            </div>
          </div>

          {/* Check-In Timeline */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Check-In Timeline</h3>
            <div className="space-y-4">
              {weeklyCheckIns.slice().reverse().map((ci, i) => (
                <details key={i} className="border border-border rounded-md">
                  <summary className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">{ci.week}</span>
                      <span className={`text-sm font-bold ${ci.score >= 80 ? "text-success" : ci.score >= 60 ? "text-warning" : "text-danger"}`}>
                        Score: {ci.score}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>E:{ci.energy}</span>
                      <span>S:{ci.stress}</span>
                      <span>F:{ci.focus}</span>
                      <span>C:{ci.confidence}</span>
                      <span>Sl:{ci.sleep}</span>
                    </div>
                  </summary>
                  <div className="p-4 border-t border-border space-y-3">
                    <div className="grid grid-cols-5 gap-3">
                      {[
                        { label: "Energy", value: ci.energy, max: 10 },
                        { label: "Stress", value: ci.stress, max: 10 },
                        { label: "Focus", value: ci.focus, max: 10 },
                        { label: "Confidence", value: ci.confidence, max: 10 },
                        { label: "Sleep", value: ci.sleep, max: 10 },
                      ].map(m => (
                        <div key={m.label}>
                          <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                          <div className="w-full h-1.5 bg-secondary rounded-full">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(m.value / m.max) * 100}%` }} />
                          </div>
                          <p className="text-xs font-medium text-foreground mt-0.5">{m.value}/10</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Habits Completion</p>
                      <p className="text-sm font-medium text-foreground">{ci.habits}%</p>
                    </div>

                    {/* Business Mindset Data — mock: show for Business Track clients */}
                    {client.type === "Business" && (
                      <div className="mt-4 rounded-lg border-l-[4px] border-l-primary border border-primary/20 bg-primary/[0.03] p-4 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-primary">Business Mindset Data</h4>
                        <div>
                          <p className="text-xs text-muted-foreground">Revenue-Generating Actions</p>
                          <p className="text-sm font-semibold text-foreground mt-0.5">12</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Decision Made</p>
                          <p className="text-sm text-foreground mt-0.5 leading-relaxed">Decided to drop the lowest-margin client and reallocate team bandwidth to the enterprise pipeline.</p>
                        </div>
                        <div className="rounded-md bg-warning/5 border border-warning/20 p-3">
                          <p className="text-xs font-bold text-warning uppercase tracking-wider mb-1">⚠ Decision Avoided</p>
                          <p className="text-sm text-foreground leading-relaxed">Haven't had the pricing conversation with the anchor client. Keeps getting pushed.</p>
                        </div>
                        <div className="rounded-md bg-danger/5 border border-danger/20 p-3">
                          <p className="text-xs font-bold text-danger uppercase tracking-wider mb-1">⚠ Fear / Uncertainty Cost</p>
                          <p className="text-sm text-foreground leading-relaxed">Delayed the product launch by another week because I wasn't sure about the positioning. That's two weeks now.</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Business Commitment (Next Week)</p>
                          <p className="text-sm text-foreground mt-0.5 leading-relaxed">Have the pricing conversation with anchor client by Wednesday. No more delays.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Assessment" && (
        <CoachAssessmentPanel clientId={clientId} />
      )}

      {activeTab === "Application" && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-card max-w-2xl">
          <h3 className="font-display font-semibold mb-6">Application — Read Only</h3>
          <div className="space-y-5">
            {[
              { label: "Full Name", value: app.name },
              { label: "Email", value: app.email },
              { label: "Occupation / Role", value: app.occupation || "—" },
              { label: "Coaching Interest", value: app.type },
              { label: "Main Challenge", value: app.challenge },
              { label: "Submitted", value: app.submitted },
              { label: "Status", value: app.status },
            ].map(field => (
              <div key={field.label}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{field.label}</p>
                <p className="text-sm text-foreground">{field.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "Messages" && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-card">
          <h3 className="font-display font-semibold mb-4">Messages</h3>
          <p className="text-sm text-muted-foreground mb-4">View the full conversation thread with {client.name}.</p>
          <Link to="/coach/messages" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors">
            <MessageSquare size={14} /> Open Conversation
          </Link>
        </div>
      )}

      {activeTab === "Sessions" && (
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="font-display font-semibold mb-4">Reset Session History</h3>
            {clientEngagements.length > 0 ? (
              <div className="space-y-3">
                {clientEngagements.map(eng => {
                  const session = resetSessions.find(s => s.id === eng.sessionId);
                  return (
                    <div key={eng.id} className="p-3 rounded-md border border-border bg-background">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-foreground">{session?.month || "Session"}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className={eng.recordingWatched ? "text-success" : "text-muted-foreground"}>
                            {eng.recordingWatched ? "✓ Watched" : "Not watched"}
                          </span>
                          <span className={eng.commitmentSubmitted ? "text-success" : "text-muted-foreground"}>
                            {eng.commitmentSubmitted ? "✓ Committed" : "No commitment"}
                          </span>
                        </div>
                      </div>
                      {eng.commitmentText && (
                        <p className="text-xs text-muted-foreground italic">"{eng.commitmentText}"</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No reset session engagement recorded.</p>
            )}
          </div>
        </div>
      )}
    </CoachLayout>
  );
}

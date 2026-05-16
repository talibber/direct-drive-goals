import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { BreachFeeBadge } from "@/components/BreachFeeBadge";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ratingFields = [
  { key: "energy", label: "Energy Level", borderColor: "border-l-green-500" },
  { key: "stress", label: "Stress Level", borderColor: "border-l-amber-600" },
  { key: "focus", label: "Focus Level", borderColor: "border-l-blue-500" },
  { key: "confidence", label: "Confidence Level", borderColor: "border-l-primary" },
  { key: "sleep", label: "Sleep Quality", borderColor: "border-l-purple-500" },
];

const GOAL_STATUSES = ["on_track", "at_risk", "missed", "completed", "needs_help"] as const;
type GoalStatusKey = typeof GOAL_STATUSES[number];

const STATUS_TO_EVENT: Record<GoalStatusKey, string> = {
  on_track: "goal_marked_on_track",
  at_risk: "goal_marked_at_risk",
  missed: "goal_marked_missed",
  completed: "goal_marked_completed",
  needs_help: "goal_marked_needs_help",
};

const NEEDS_DRAFT: GoalStatusKey[] = ["at_risk", "missed", "needs_help"];

interface ActiveGoal { id: string; title: string }

export default function WeeklyCheckInPage() {
  const { toast } = useToast();
  const [coachingTrack, setCoachingTrack] = useState<"life" | "business">("life");
  const isBusiness = coachingTrack === "business";

  const [ratings, setRatings] = useState<Record<string, number>>({
    energy: 5, stress: 5, focus: 5, confidence: 5, sleep: 5,
  });
  const [habitPct, setHabitPct] = useState<string>("");
  const [wins, setWins] = useState("");
  const [failures, setFailures] = useState("");
  const [avoiding, setAvoiding] = useState("");
  const [story, setStory] = useState("");
  const [commitment, setCommitment] = useState("");
  const [revenueActions, setRevenueActions] = useState<string>("");
  const [decisionMade, setDecisionMade] = useState("");
  const [decisionAvoided, setDecisionAvoided] = useState("");
  const [fearCost, setFearCost] = useState("");
  const [businessCommitment, setBusinessCommitment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [activeGoals, setActiveGoals] = useState<ActiveGoal[]>([]);
  const [goalStatuses, setGoalStatuses] = useState<Record<string, GoalStatusKey>>({});
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);
      const [{ data: profile }, { data: goals }] = await Promise.all([
        supabase.from("profiles").select("coaching_track").eq("user_id", u.user.id).maybeSingle(),
        supabase.from("goals").select("id,title").eq("user_id", u.user.id).in("status", ["active", "at_risk"]),
      ]);
      if (profile?.coaching_track === "business" || profile?.coaching_track === "life") {
        setCoachingTrack(profile.coaching_track as "life" | "business");
      }
      setActiveGoals((goals ?? []) as ActiveGoal[]);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast({ title: "Sign in required", description: "Please sign in to submit.", variant: "destructive" });
      return;
    }
    if (isBusiness) {
      if (!revenueActions || !decisionMade.trim() || !decisionAvoided.trim() || !fearCost.trim() || !businessCommitment.trim()) {
        toast({ title: "Required fields", description: "All business mindset fields are required.", variant: "destructive" });
        return;
      }
    }
    setSubmitting(true);
    try {
      // Persist the full check-in
      const { error: ciErr } = await supabase.from("weekly_checkins").insert({
        client_id: userId,
        coaching_track: coachingTrack,
        energy: ratings.energy, stress: ratings.stress, focus: ratings.focus,
        confidence: ratings.confidence, sleep: ratings.sleep,
        habit_completion: habitPct ? parseInt(habitPct, 10) : null,
        wins: wins || null, failures: failures || null, avoiding: avoiding || null,
        story: story || null, commitment: commitment || null,
        revenue_actions_count: revenueActions ? parseInt(revenueActions, 10) : null,
        decision_made: decisionMade || null,
        decision_avoided: decisionAvoided || null,
        fear_cost: fearCost || null,
        business_commitment: businessCommitment || null,
        goal_statuses: goalStatuses,
      });
      if (ciErr) throw ciErr;

      // Build events and drafts
      const safeInserts: any[] = [
        { user_id: userId, event_type: "weekly_goals_submitted", event_payload: { ratings, goalStatuses } },
      ];
      const draftCalls: Promise<unknown>[] = [];
      for (const goalId of Object.keys(goalStatuses)) {
        const status = goalStatuses[goalId];
        const eventType = STATUS_TO_EVENT[status];
        if (NEEDS_DRAFT.includes(status)) {
          draftCalls.push(
            supabase.functions.invoke("generate-coach-draft", {
              body: { user_id: userId, goal_id: goalId, event_type: eventType, event_payload: { status, blocker: avoiding } },
            })
          );
        } else {
          safeInserts.push({ user_id: userId, goal_id: goalId, event_type: eventType, event_payload: { status } });
        }
      }
      await Promise.all([
        supabase.from("coaching_events").insert(safeInserts),
        ...draftCalls,
      ]);
      setSubmitted(true);
      toast({ title: "Check-in submitted", description: "Your coach will review and respond." });
    } catch (err: any) {
      toast({ title: "Submission failed", description: err?.message || "Check connection.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto text-center py-20">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-2xl font-bold mb-2">Check-In Complete</h2>
          <p className="text-muted-foreground">Your coach will review your data and leave notes this week.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Weekly Check-In</h1>
        <p className="text-muted-foreground mb-8">Be honest. That's the whole point.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <h3 className="font-display font-semibold mb-1">How are you doing? (1–10)</h3>
            <p className="text-sm italic text-muted-foreground mb-6">No right answers. Just honest ones.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ratingFields.map((f, i) => (
                <div
                  key={f.key}
                  className={`rounded-lg border border-border border-l-[3px] ${f.borderColor} bg-background/50 p-4 ${
                    i === ratingFields.length - 1 ? "sm:col-start-1 sm:col-end-2 sm:justify-self-center sm:w-full sm:max-w-[calc(50%-0.5rem)]" : ""
                  }`}
                >
                  <div className="flex justify-between mb-2">
                    <Label className="text-sm">{f.label}</Label>
                    <span className="text-sm font-mono text-primary font-semibold">{ratings[f.key]}</span>
                  </div>
                  <Slider
                    min={1} max={10} step={1}
                    value={[ratings[f.key]]}
                    onValueChange={([v]) => setRatings((prev) => ({ ...prev, [f.key]: v }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {isBusiness && (
            <div className="rounded-lg border-2 border-primary/30 border-l-[4px] border-l-primary bg-card p-6 shadow-card space-y-5">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-0.5">Your business this week</h3>
                <p className="text-xs text-muted-foreground">Required for Operator Track clients.</p>
              </div>
              <div>
                <Label htmlFor="revenue-actions">How many revenue-generating actions did you take this week? <span className="text-destructive">*</span></Label>
                <Input id="revenue-actions" type="number" min={0} value={revenueActions} onChange={(e) => setRevenueActions(e.target.value)} placeholder="Count actions, not results" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="decision-made">Most significant business decision this week? <span className="text-destructive">*</span></Label>
                <Textarea id="decision-made" value={decisionMade} onChange={(e) => setDecisionMade(e.target.value)} className="mt-1.5 min-h-[80px]" required />
              </div>
              <div>
                <Label htmlFor="decision-avoided">What business decision are you avoiding right now? <span className="text-destructive">*</span></Label>
                <Textarea id="decision-avoided" value={decisionAvoided} onChange={(e) => setDecisionAvoided(e.target.value)} className="mt-1.5 min-h-[80px]" required />
              </div>
              <div>
                <Label htmlFor="fear-cost">What did fear or uncertainty cost your business this week? <span className="text-destructive">*</span></Label>
                <Textarea id="fear-cost" value={fearCost} onChange={(e) => setFearCost(e.target.value)} className="mt-1.5 min-h-[80px]" required />
              </div>
              <div>
                <Label htmlFor="biz-commitment">One business commitment for next week? <span className="text-destructive">*</span></Label>
                <Textarea id="biz-commitment" value={businessCommitment} onChange={(e) => setBusinessCommitment(e.target.value)} className="mt-1.5 min-h-[80px]" required />
              </div>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <Label className="text-sm font-display font-semibold">Habit Completion (%)</Label>
            <Select value={habitPct} onValueChange={setHabitPct}>
              <SelectTrigger className="mt-2"><SelectValue placeholder="Select percentage" /></SelectTrigger>
              <SelectContent>
                {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v) => (
                  <SelectItem key={v} value={String(v)}>{v}%</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-card space-y-5">
            <div><Label>Wins this week</Label><Textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="What went well?" className="mt-1.5 min-h-[80px]" /></div>
            <div><Label>Failures this week</Label><Textarea value={failures} onChange={e => setFailures(e.target.value)} placeholder="What didn't go as planned?" className="mt-1.5 min-h-[80px]" /></div>
            <div><Label>What are you avoiding?</Label><Textarea value={avoiding} onChange={e => setAvoiding(e.target.value)} placeholder="Be honest. What are you procrastinating on?" className="mt-1.5 min-h-[60px]" /></div>
            <div><Label>What story are you telling yourself?</Label><Textarea value={story} onChange={e => setStory(e.target.value)} placeholder="What's the narrative in your head?" className="mt-1.5 min-h-[60px]" /></div>
            <div><Label>Next week commitment</Label><Textarea value={commitment} onChange={e => setCommitment(e.target.value)} placeholder="One specific thing you will do next week" className="mt-1.5 min-h-[60px]" /></div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 shadow-card space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-display font-semibold">Goal Status</h3>
              <BreachFeeBadge label="$75 per missed commitment" />
            </div>
            <p className="text-xs text-muted-foreground">
              Mark every active goal honestly. At-risk, missed, and needs-help statuses send a coaching draft to your coach for review and reply.
            </p>
            {activeGoals.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No active goals yet.</p>
            )}
            {activeGoals.map((g) => (
              <div key={g.id} className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground flex-1">{g.title}</span>
                <Select value={goalStatuses[g.id] || undefined} onValueChange={(v) => setGoalStatuses(prev => ({ ...prev, [g.id]: v as GoalStatusKey }))}>
                  <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on_track">On Track</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="needs_help">Needs Help</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full text-base" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Check-In"}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}

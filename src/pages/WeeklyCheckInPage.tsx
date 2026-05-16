import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { goals } from "@/lib/mockData";

const ratingFields = [
  { key: "energy", label: "Energy Level", borderColor: "border-l-green-500" },
  { key: "stress", label: "Stress Level", borderColor: "border-l-amber-600" },
  { key: "focus", label: "Focus Level", borderColor: "border-l-blue-500" },
  { key: "confidence", label: "Confidence Level", borderColor: "border-l-primary" },
  { key: "sleep", label: "Sleep Quality", borderColor: "border-l-purple-500" },
];

// TODO: In production, derive from client profile data
const MOCK_COACHING_TRACK: "life" | "business" = "business";

export default function WeeklyCheckInPage() {
  const { toast } = useToast();
  const coachingTrack = MOCK_COACHING_TRACK;
  const isBusiness = coachingTrack === "business";

  const [ratings, setRatings] = useState<Record<string, number>>({
    energy: 5, stress: 5, focus: 5, confidence: 5, sleep: 5,
  });
  const [revenueActions, setRevenueActions] = useState<string>("");
  const [decisionMade, setDecisionMade] = useState("");
  const [decisionAvoided, setDecisionAvoided] = useState("");
  const [fearCost, setFearCost] = useState("");
  const [businessCommitment, setBusinessCommitment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusiness) {
      if (!revenueActions || !decisionMade.trim() || !decisionAvoided.trim() || !fearCost.trim() || !businessCommitment.trim()) {
        toast({ title: "Required fields", description: "All business mindset fields are required.", variant: "destructive" });
        return;
      }
    }
    setSubmitted(true);
    toast({ title: "Check-in submitted", description: "Your weekly data has been recorded." });
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
          {/* Ratings */}
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

          {/* Operator Track Section */}
          {isBusiness && (
            <div className="rounded-lg border-2 border-primary/30 border-l-[4px] border-l-primary bg-card p-6 shadow-card space-y-5">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-0.5">Your business this week</h3>
                <p className="text-xs text-muted-foreground">Required for Operator Track clients.</p>
              </div>

              <div>
                <Label htmlFor="revenue-actions">
                  How many revenue-generating actions did you take this week? <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="revenue-actions"
                  type="number"
                  min={0}
                  value={revenueActions}
                  onChange={(e) => setRevenueActions(e.target.value)}
                  placeholder="Calls made, proposals sent, deals closed, follow-ups done — count the actions not the results"
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="decision-made">
                  What was the most significant business decision you made this week? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="decision-made"
                  value={decisionMade}
                  onChange={(e) => setDecisionMade(e.target.value)}
                  placeholder="Be specific. What did you decide and why?"
                  className="mt-1.5 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="decision-avoided">
                  What business decision are you avoiding right now? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="decision-avoided"
                  value={decisionAvoided}
                  onChange={(e) => setDecisionAvoided(e.target.value)}
                  placeholder="The one you keep pushing to next week. What is it really?"
                  className="mt-1.5 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fear-cost">
                  What did fear or uncertainty cost your business this week? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="fear-cost"
                  value={fearCost}
                  onChange={(e) => setFearCost(e.target.value)}
                  placeholder="Lost deal, delayed launch, conversation you didn't have — what did avoidance cost you?"
                  className="mt-1.5 min-h-[80px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="biz-commitment">
                  What is the one business commitment for next week? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="biz-commitment"
                  value={businessCommitment}
                  onChange={(e) => setBusinessCommitment(e.target.value)}
                  placeholder="Specific. Measurable. Not a task — a decision or action that moves something forward."
                  className="mt-1.5 min-h-[80px]"
                  required
                />
              </div>
            </div>
          )}

          {/* Habit completion */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card">
            <Label className="text-sm font-display font-semibold">Habit Completion (%)</Label>
            <Select>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select percentage" />
              </SelectTrigger>
              <SelectContent>
                {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v) => (
                  <SelectItem key={v} value={String(v)}>{v}%</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Text fields */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card space-y-5">
            <div>
              <Label>Wins this week</Label>
              <Textarea placeholder="What went well?" className="mt-1.5 min-h-[80px]" />
            </div>
            <div>
              <Label>Failures this week</Label>
              <Textarea placeholder="What didn't go as planned?" className="mt-1.5 min-h-[80px]" />
            </div>
            <div>
              <Label>What are you avoiding?</Label>
              <Textarea placeholder="Be honest. What are you procrastinating on?" className="mt-1.5 min-h-[60px]" />
            </div>
            <div>
              <Label>What story are you telling yourself?</Label>
              <Textarea placeholder="What's the narrative in your head?" className="mt-1.5 min-h-[60px]" />
            </div>
            <div>
              <Label>Next week commitment</Label>
              <Textarea placeholder="One specific thing you will do next week" className="mt-1.5 min-h-[60px]" />
            </div>
          </div>

          {/* Goal status */}
          <div className="rounded-lg border border-border bg-card p-6 shadow-card space-y-4">
            <h3 className="font-display font-semibold">Goal Status</h3>
            {goals.map((g) => (
              <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <span className="text-sm text-foreground">{g.title}</span>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="on-track">On Track</SelectItem>
                    <SelectItem value="at-risk">At Risk</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          <Button type="submit" variant="hero" size="lg" className="w-full text-base">
            Submit Check-In
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}

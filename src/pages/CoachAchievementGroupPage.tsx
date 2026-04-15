import { useState } from "react";
import { CoachLayout } from "@/components/CoachLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const mockSession = {
  id: "ag-1",
  date: "May 3, 2026",
  enrolledCount: 4,
  submissionsReceived: 3,
  completed: false,
  recordingUrl: null as string | null,
  coachNotes: "",
};

const mockSubmissions = [
  {
    id: "s1",
    clientName: "Jordan Lee",
    discType: "DI",
    proudGoal: "Closed 3 enterprise deals in one month — first time ever.",
    whatMadeDifference: "Blocked 2 hours every morning for outreach before anything else. No email until after 10am. The consistency compounded.",
    nextBar: "5 enterprise deals next month. Adding a second outreach block in the afternoon.",
    nextCommitment: null as string | null,
  },
  {
    id: "s2",
    clientName: "Priya Mehta",
    discType: "SC",
    proudGoal: "Ran 4x/week for the full month — didn't miss a single run.",
    whatMadeDifference: "Laid out my clothes the night before. Removed the decision from the morning. My pod checking in daily made skipping feel impossible.",
    nextBar: "Adding strength training 2x/week on top of the 4 runs.",
    nextCommitment: null as string | null,
  },
  {
    id: "s3",
    clientName: "Marcus Chen",
    discType: "DC",
    proudGoal: "Shipped the product redesign on time — first time hitting a product deadline in 6 months.",
    whatMadeDifference: "Stopped waiting for perfection. Set a 'good enough' bar with my coach and committed to shipping at 85% instead of 100%.",
    nextBar: "Ship 2 features next month. Same 85% bar. Velocity over perfection.",
    nextCommitment: null as string | null,
  },
];

export default function CoachAchievementGroupPage() {
  const [coachNotes, setCoachNotes] = useState(mockSession.coachNotes);
  const [recordingUrl, setRecordingUrl] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState<Record<string, string>>({});

  return (
    <CoachLayout>
      <div className="max-w-4xl">
        <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">Achievement Group</h1>
        <p className="text-muted-foreground mb-8">Call prep, submissions, and follow-through.</p>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-4 text-center">
            <div className="text-2xl font-display font-bold text-gradient-gold">{mockSession.date}</div>
            <div className="text-xs text-muted-foreground mt-1">Next Session</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-display font-bold text-gradient-gold">{mockSession.enrolledCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Enrolled</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-display font-bold text-gradient-gold">{mockSession.submissionsReceived}</div>
            <div className="text-xs text-muted-foreground mt-1">Submissions</div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-display font-bold text-gradient-gold">
              {mockSession.completed ? "Done" : "Upcoming"}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Status</div>
          </div>
        </div>

        {/* Call Prep */}
        <div className="rounded-xl border border-primary/20 bg-card p-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary mb-4">Achievement Group Prep</p>

          {/* Submissions */}
          <div className="space-y-4 mb-6">
            {mockSubmissions.map((sub) => (
              <div key={sub.id} className="rounded-lg border border-border bg-background/50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-display font-bold text-foreground">{sub.clientName}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70 border border-primary/20 rounded-full px-2 py-0.5">
                    {sub.discType}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Proudest Goal</p>
                    <p className="text-foreground/80">{sub.proudGoal}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">What Made the Difference</p>
                    <p className="text-foreground/80">{sub.whatMadeDifference}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Raising the Bar To</p>
                    <p className="text-foreground/80">{sub.nextBar}</p>
                  </div>
                </div>

                {/* Coach follow-up note (post-call) */}
                {mockSession.completed && (
                  <div className="mt-4 pt-3 border-t border-border">
                    <Label className="text-xs">Follow-through note (private)</Label>
                    <Textarea
                      className="mt-1.5 min-h-[60px]"
                      placeholder="Your private note on this client's commitment..."
                      value={followUpNotes[sub.id] || ""}
                      onChange={(e) => setFollowUpNotes(prev => ({ ...prev, [sub.id]: e.target.value }))}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Coach Notes */}
          <div>
            <Label>Call Talking Points</Label>
            <Textarea
              className="mt-1.5 min-h-[100px]"
              placeholder="Your notes for the Achievement group call..."
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Post-Call Actions */}
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-4">Post-Call</p>

          <div className="space-y-4">
            <div>
              <Label>Recording URL</Label>
              <Input
                className="mt-1.5"
                placeholder="Paste recording link..."
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="hero"
                disabled={!recordingUrl}
                onClick={() => {
                  toast.success("Recording saved and distributed.");
                }}
              >
                Save Recording
              </Button>
              <Button
                variant="heroOutline"
                onClick={() => {
                  toast.success("Coach notes saved.");
                }}
              >
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
